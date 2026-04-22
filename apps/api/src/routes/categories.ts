import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { validateRequest } from '../middleware/validate';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().default(0)
});

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: { products: { where: { status: 'active', deletedAt: null } } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

// Get category by slug with products
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug, deletedAt: null },
      include: {
        products: {
          where: { status: 'active', deletedAt: null },
          include: {
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
            variants: { take: 1 }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
});

// Create category (admin only)
router.post('/', authenticate, requireRole(['admin', 'staff']), validateRequest(createCategorySchema), async (req, res, next) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Update category (admin only)
router.put('/:id', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.update({
      where: { id },
      data: req.body
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Delete category (admin only)
router.delete('/:id', authenticate, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as categoriesRouter };
