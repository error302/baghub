import Stripe from 'stripe';
import prisma from '../db';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Create a payment intent for an order
 */
export const createPaymentIntent = async (
  orderId: string
): Promise<PaymentIntentResponse> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Create line items for Stripe
  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: order.currency.toLowerCase(),
      product_data: {
        name: `${item.variant.product.name} - ${item.variant.color || ''} ${item.variant.size || ''}`.trim(),
      },
      unit_amount: Math.round(Number(item.unitPrice) * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));
  
  // Add shipping as line item
  if (order.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: {
          name: 'Shipping',
        },
        unit_amount: Math.round(Number(order.shippingCost) * 100),
      },
      quantity: 1,
    });
  }
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.total) * 100),
    currency: order.currency.toLowerCase(),
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  // Update order with Stripe payment intent ID
  await prisma.order.update({
    where: { id: orderId },
    data: {
      stripePiId: paymentIntent.id,
    },
  });
  
  return {
    clientSecret: paymentIntent.client_secret || '',
    paymentIntentId: paymentIntent.id,
  };
};

/**
 * Retrieve payment intent
 */
export const getPaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

/**
 * Cancel payment intent
 */
export const cancelPaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.cancel(paymentIntentId);
};

/**
 * Create refund
 */
export const createRefund = async (
  paymentIntentId: string,
  amount?: number
) => {
  const refundData: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };
  
  if (amount) {
    refundData.amount = Math.round(amount * 100);
  }
  
  return stripe.refunds.create(refundData);
};

/**
 * Handle Stripe webhook
 */
export const handleWebhook = async (
  payload: string | Buffer,
  signature: string
): Promise<void> => {
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`);
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(failedPayment);
      break;
    }
    
    case 'charge.refunded': {
      const refund = event.data.object as Stripe.Charge;
      await handleRefund(refund);
      break;
    }
    
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }
};

/**
 * Handle successful payment
 */
const handlePaymentSuccess = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  const orderId = paymentIntent.metadata?.orderId;
  
  if (!orderId) {
    console.error('Order ID not found in payment intent metadata');
    return;
  }
  
  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'completed',
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    }),
    // Update any pending payments
    prisma.payment.updateMany({
      where: {
        orderId,
        status: 'pending',
      },
      data: {
        status: 'completed',
        transactionId: paymentIntent.id,
      },
    }),
  ]);
};

/**
 * Handle failed payment
 */
const handlePaymentFailure = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  const orderId = paymentIntent.metadata?.orderId;
  
  if (!orderId) {
    console.error('Order ID not found in payment intent metadata');
    return;
  }
  
  await prisma.payment.updateMany({
    where: {
      orderId,
      transactionId: paymentIntent.id,
    },
    data: {
      status: 'failed',
      response: {
        last_payment_error: paymentIntent.last_payment_error,
      } as unknown as Record<string, unknown>,
    },
  });
};

/**
 * Handle refund
 */
const handleRefund = async (charge: Stripe.Charge): Promise<void> => {
  const orderId = charge.metadata?.orderId;
  
  if (!orderId) {
    console.error('Order ID not found in charge metadata');
    return;
  }
  
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'refunded',
    },
  });
};

/**
 * Create customer
 */
export const createCustomer = async (
  email: string,
  name?: string,
  phone?: string
) => {
  return stripe.customers.create({
    email,
    name,
    phone,
  });
};

/**
 * Create checkout session
 */
export const createCheckoutSession = async (
  orderId: string,
  successUrl: string,
  cancelUrl: string
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
      user: true,
    },
  });
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  const lineItems = order.items.map((item) => {
    const imageUrl = item.variant.product.images.find((img) => img.isPrimary)?.url || 
                     item.variant.product.images[0]?.url;
    
    return {
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: {
          name: item.variant.product.name,
          description: `${item.variant.color || ''} ${item.variant.size || ''}`.trim(),
          images: imageUrl ? [imageUrl] : undefined,
        },
        unit_amount: Math.round(Number(item.unitPrice) * 100),
      },
      quantity: item.quantity,
    };
  });
  
  // Add shipping
  lineItems.push({
    price_data: {
      currency: order.currency.toLowerCase(),
      product_data: {
        name: 'Shipping',
        description: `Delivery to ${order.shippingCity}`,
      },
      unit_amount: Math.round(Number(order.shippingCost) * 100),
    },
    quantity: 1,
  });
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    customer_email: order.user?.email || order.guestEmail || undefined,
    shipping_address_collection: {
      allowed_countries: ['KE'],
    },
  });
  
  return session;
};

export default {
  createPaymentIntent,
  getPaymentIntent,
  cancelPaymentIntent,
  createRefund,
  handleWebhook,
  createCustomer,
  createCheckoutSession,
};
