import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

const addressSchema = z.object({
  name: z.string(),
  phone: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  county: z.string(),
  zone: z.enum(['nairobi', 'nairobi_metropolitan', 'coast', 'central', 'rift_valley', 'western', 'nyanza', 'eastern', 'northern', 'international']),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false)
});

// Get user profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { addresses: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, phone }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Get addresses
router.get('/addresses', authenticate, async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.userId }
    });
    res.json({ addresses });
  } catch (error) {
    next(error);
  }
});

// Add address
router.post('/addresses', authenticate, validateRequest(addressSchema), async (req, res, next) => {
  try {
    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        ...req.body,
        userId: req.user.userId
      }
    });

    res.status(201).json({ address });
  } catch (error) {
    next(error);
  }
});

// Update address
router.put('/addresses/:id', authenticate, async (req, res, next) => {
  try {
    if (req.body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({ address });
  } catch (error) {
    next(error);
  }
});

// Delete address
router.delete('/addresses/:id', authenticate, async (req, res, next) => {
  try {
    await prisma.address.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
});

// Get wishlist
router.get('/wishlist', authenticate, async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.userId },
      include: {
        product: {
          include: {
            images: { take: 1 },
            variants: { take: 1 },
            category: true
          }
        }
      }
    });

    res.json({ wishlist });
  } catch (error) {
    next(error);
  }
});

// Add to wishlist
router.post('/wishlist/:productId', authenticate, async (req, res, next) => {
  try {
    const item = await prisma.wishlistItem.create({
      data: {
        userId: req.user.userId,
        productId: req.params.productId
      },
      include: {
        product: {
          include: { images: { take: 1 } }
        }
      }
    });

    res.status(201).json({ item });
  } catch (error) {
    // Handle unique constraint violation
    res.status(409).json({ error: 'Item already in wishlist' });
  }
});

// Remove from wishlist
router.delete('/wishlist/:productId', authenticate, async (req, res, next) => {
  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId: req.params.productId
        }
      }
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
});

export { router as usersRouter };
