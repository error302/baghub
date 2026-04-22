import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { validateRequest } from '../middleware/validate';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

const productQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('20'),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().optional().transform(Number),
  maxPrice: z.string().optional().transform(Number),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'popular']).default('newest'),
  search: z.string().optional(),
  isNew: z.string().optional().transform(Boolean),
  isFeatured: z.string().optional().transform(Boolean)
});

const createProductSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string(),
  shortDescription: z.string().optional(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  basePrice: z.number().positive(),
  comparePrice: z.number().optional(),
  costPrice: z.number().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  weight: z.number().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional()
});

// Get all products
router.get('/', validateRequest(productQuerySchema, 'query'), async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      search,
      isNew,
      isFeatured
    } = req.query as any;

    const where: any = {
      status: 'active',
      deletedAt: null
    };

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    if (isNew) {
      where.isNewArrival = true;
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    const orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy.basePrice = 'asc';
        break;
      case 'price_desc':
        orderBy.basePrice = 'desc';
        break;
      case 'popular':
        orderBy.reviews = { _count: 'desc' };
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          brand: {
            select: { id: true, name: true, slug: true }
          },
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          variants: {
            where: { deletedAt: null }
          },
          reviews: {
            where: { status: 'approved' },
            select: { rating: true }
          }
        },
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.product.count({ where })
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
      
      return {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length
      };
    });

    res.json({
      products: productsWithRating,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single product by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug, deletedAt: null },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        variants: {
          where: { deletedAt: null },
          orderBy: [{ color: 'asc' }, { size: 'asc' }]
        },
        reviews: {
          where: { status: 'approved' },
          include: {
            user: {
              select: { name: true, avatarUrl: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'active',
        deletedAt: null
      },
      include: {
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        variants: { take: 1 }
      },
      take: 4
    });

    res.json({
      ...product,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post('/', authenticate, requireRole(['admin', 'staff']), validateRequest(createProductSchema), async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...req.body,
        updatedAt: new Date()
      },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true
      }
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get new arrivals
router.get('/featured/new-arrivals', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        deletedAt: null,
        isNewArrival: true
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        variants: { take: 1 }
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

// Get featured products
router.get('/featured/featured', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        deletedAt: null,
        isFeatured: true
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        variants: { take: 1 }
      },
      take: 8
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

export { router as productsRouter };
