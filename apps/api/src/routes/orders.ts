import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { validateRequest } from '../middleware/validate';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

const orderItemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive()
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingName: z.string(),
  shippingPhone: z.string(),
  shippingLine1: z.string(),
  shippingLine2: z.string().optional(),
  shippingCity: z.string(),
  shippingCounty: z.string(),
  shippingZone: z.enum(['nairobi', 'nairobi_metropolitan', 'coast', 'central', 'rift_valley', 'western', 'nyanza', 'eastern', 'northern', 'international']),
  shippingPostalCode: z.string().optional(),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['mpesa', 'card', 'bank_transfer', 'cash_on_delivery']).default('mpesa')
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  adminNotes: z.string().optional()
});

// Generate order number
function generateOrderNumber(): string {
  const prefix = 'ME';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Create order
router.post('/', authenticate, validateRequest(createOrderSchema), async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const data = req.body;

    // Get product variants
    const variants = await Promise.all(
      data.items.map(async (item: any) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant) throw new Error(`Variant not found`);
        if (variant.stockQty < item.quantity) throw new Error(`Insufficient stock`);

        return {
          ...variant,
          quantity: item.quantity,
          unitPrice: Number(variant.product.basePrice) + Number(variant.priceDelta)
        };
      })
    );

    const subtotal = variants.reduce((sum, v) => sum + v.unitPrice * v.quantity, 0);
    const shippingCost = subtotal >= 8000 ? 0 : 500;
    const total = subtotal + shippingCost;

    // Reserve stock
    await Promise.all(
      variants.map(v =>
        prisma.productVariant.update({
          where: { id: v.id },
          data: {
            stockQty: { decrement: v.quantity },
            reservedQty: { increment: v.quantity }
          }
        })
      )
    );

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: data.paymentMethod,
        subtotal,
        discountAmount: 0,
        shippingCost,
        taxAmount: 0,
        total,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingLine1: data.shippingLine1,
        shippingLine2: data.shippingLine2,
        shippingCity: data.shippingCity,
        shippingCounty: data.shippingCounty,
        shippingZone: data.shippingZone,
        shippingPostalCode: data.shippingPostalCode,
        customerNotes: data.customerNotes,
        items: {
          create: variants.map(v => ({
            variantId: v.id,
            quantity: v.quantity,
            unitPrice: v.unitPrice,
            totalPrice: v.unitPrice * v.quantity,
            productSnapshot: {
              name: v.product.name,
              sku: `${v.product.sku}-${v.skuSuffix}`,
              color: v.color,
              size: v.size
            }
          }))
        }
      },
      include: {
        items: { include: { variant: { include: { product: true } } } }
      }
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

// Get user orders
router.get('/my-orders', authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { items: { include: { variant: { include: { product: true } } } }, payments: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all orders
router.get('/', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { variant: { include: { product: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// Admin: Update order status
router.patch('/:id/status', authenticate, requireRole(['admin', 'staff']), validateRequest(updateStatusSchema), async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status, ...req.body },
      include: { items: { include: { variant: { include: { product: true } } } } }
    });
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

export { router as ordersRouter };
