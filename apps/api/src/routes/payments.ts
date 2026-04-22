import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { initiateSTKPush, verifyTransaction } from '../services/mpesa';

const router = Router();

const mpesaSchema = z.object({
  orderId: z.string(),
  phoneNumber: z.string()
});

// Initiate M-Pesa payment
router.post('/mpesa/stk-push', authenticate, validateRequest(mpesaSchema), async (req, res, next) => {
  try {
    const { orderId, phoneNumber } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.userId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    // Format phone number (add 254 prefix if needed)
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }

    // Initiate STK push
    const mpesaResponse = await initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: Number(order.total),
      accountReference: order.orderNumber,
      transactionDesc: `Payment for order ${order.orderNumber}`
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        method: 'mpesa',
        status: 'pending',
        transactionId: mpesaResponse.CheckoutRequestID,
        response: mpesaResponse
      }
    });

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'processing' }
    });

    res.json({
      payment,
      message: 'STK push initiated. Please check your phone.'
    });
  } catch (error) {
    next(error);
  }
});

// M-Pesa callback (no auth required - called by Safaricom)
router.post('/mpesa/callback', async (req, res, next) => {
  try {
    const callbackData = req.body;

    // Acknowledge receipt immediately
    res.json({ ResultCode: 0, ResultDesc: 'Success' });

    // Process callback asynchronously
    const resultCode = callbackData.Body?.stkCallback?.ResultCode;
    const checkoutRequestID = callbackData.Body?.stkCallback?.CheckoutRequestID;
    const resultDesc = callbackData.Body?.stkCallback?.ResultDesc;
    const callbackMetadata = callbackData.Body?.stkCallback?.CallbackMetadata?.Item;

    const payment = await prisma.payment.findFirst({
      where: { transactionId: checkoutRequestID },
      include: { order: true }
    });

    if (!payment) {
      console.error('Payment not found for callback:', checkoutRequestID);
      return;
    }

    if (resultCode === 0) {
      // Success
      const mpesaReceipt = callbackMetadata?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            response: callbackData
          }
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: 'completed',
            mpesaReceipt,
            status: 'confirmed',
            confirmedAt: new Date()
          }
        })
      ]);

      // Send confirmation email (implement email service)
      console.log(`Payment completed for order ${payment.order.orderNumber}`);
    } else {
      // Failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          response: callbackData
        }
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'failed' }
      });

      console.error(`Payment failed: ${resultDesc}`);
    }
  } catch (error) {
    console.error('M-Pesa callback error:', error);
  }
});

// Check payment status
router.get('/:paymentId/status', authenticate, async (req, res, next) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        id: req.params.paymentId,
        order: { userId: req.user.userId }
      },
      include: { order: true }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    next(error);
  }
});

export { router as paymentsRouter };
