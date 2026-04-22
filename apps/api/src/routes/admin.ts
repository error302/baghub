import { Router } from 'express';
import { prisma } from '../db';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Get dashboard stats
router.get('/dashboard', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      revenueThisMonth,
      revenueThisWeek,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      newCustomers,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'processing' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count({ where: { status: 'delivered' } }),
      prisma.order.count({ where: { status: 'cancelled' } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: thirtyDaysAgo } },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: sevenDaysAgo } },
        _sum: { total: true }
      }),
      prisma.product.count({ where: { status: 'active', deletedAt: null } }),
      prisma.productVariant.count({
        where: { stockQty: { lte: prisma.productVariant.fields.lowStockThreshold } }
      }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo }, role: 'customer' }
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } }
        }
      })
    ]);

    // Get sales by day for chart
    const salesByDay = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: 'cancelled' }
      },
      _sum: { total: true },
      _count: true
    });

    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['variantId'],
      where: {
        order: { createdAt: { gte: thirtyDaysAgo }, status: { not: 'cancelled' } }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: { include: { images: { take: 1 } } } }
        });
        return {
          ...variant,
          quantitySold: item._sum.quantity
        };
      })
    );

    res.json({
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        revenue: {
          total: totalRevenue._sum.total || 0,
          thisMonth: revenueThisMonth._sum.total || 0,
          thisWeek: revenueThisWeek._sum.total || 0
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        },
        customers: {
          total: totalCustomers,
          newThisMonth: newCustomers
        }
      },
      recentOrders,
      salesByDay: salesByDay.map(d => ({
        date: d.createdAt,
        revenue: d._sum.total || 0,
        orders: d._count
      })),
      topProducts: topProductsWithDetails
    });
  } catch (error) {
    next(error);
  }
});

// Get sales report
router.get('/reports/sales', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where: any = {
      status: { not: 'cancelled' }
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [orders, categoryBreakdown] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              variant: {
                include: { product: { include: { category: true } } }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.orderItem.groupBy({
        by: ['variantId'],
        where: { order: where },
        _sum: { quantity: true, totalPrice: true }
      })
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue
      },
      orders
    });
  } catch (error) {
    next(error);
  }
});

// Update product status
router.patch('/products/:id/status', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true
      }
    });

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Get low stock alerts
router.get('/inventory/low-stock', authenticate, requireRole(['admin', 'staff']), async (req, res, next) => {
  try {
    const variants = await prisma.productVariant.findMany({
      where: {
        stockQty: { lte: prisma.productVariant.fields.lowStockThreshold }
      },
      include: {
        product: {
          include: { images: { take: 1 } }
        }
      },
      orderBy: { stockQty: 'asc' }
    });

    res.json({ variants });
  } catch (error) {
    next(error);
  }
});

export { router as adminRouter };
