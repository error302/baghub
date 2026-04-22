import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { validateRequest } from '../middleware/validate';

const router = Router();

const cartItemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive()
});

// Get cart (from session/token - simplified version)
router.get('/', async (req, res, next) => {
  try {
    // In a real implementation, you'd use session or JWT
    // For now, return empty cart
    res.json({ items: [], total: 0 });
  } catch (error) {
    next(error);
  }
});

// Add to cart
router.post('/', validateRequest(cartItemSchema), async (req, res, next) => {
  try {
    const { variantId, quantity } = req.body;

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: { images: true } } }
    });

    if (!variant) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (variant.stockQty < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const cartItem = {
      variantId: variant.id,
      productId: variant.productId,
      name: variant.product.name,
      sku: `${variant.product.sku}-${variant.skuSuffix}`,
      color: variant.color,
      size: variant.size,
      price: Number(variant.product.basePrice) + Number(variant.priceDelta),
      image: variant.product.images[0]?.url || null,
      quantity,
      maxStock: variant.stockQty
    };

    res.json({ item: cartItem });
  } catch (error) {
    next(error);
  }
});

// Validate cart items
router.post('/validate', async (req, res, next) => {
  try {
    const { items } = req.body;
    const validatedItems = [];
    const errors = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: { include: { images: true } } }
      });

      if (!variant) {
        errors.push({ variantId: item.variantId, error: 'Product not found' });
        continue;
      }

      if (variant.stockQty < item.quantity) {
        errors.push({
          variantId: item.variantId,
          error: `Only ${variant.stockQty} available`,
          maxStock: variant.stockQty
        });
      }

      validatedItems.push({
        variantId: variant.id,
        productId: variant.productId,
        name: variant.product.name,
        sku: `${variant.product.sku}-${variant.skuSuffix}`,
        color: variant.color,
        size: variant.size,
        price: Number(variant.product.basePrice) + Number(variant.priceDelta),
        image: variant.product.images[0]?.url || null,
        quantity: Math.min(item.quantity, variant.stockQty),
        maxStock: variant.stockQty
      });
    }

    res.json({ items: validatedItems, errors });
  } catch (error) {
    next(error);
  }
});

export { router as cartRouter };
