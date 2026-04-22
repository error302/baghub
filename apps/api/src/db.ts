import { PrismaClient } from '@prisma/client';

// Prisma client singleton with Kenya-specific optimizations

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma client with logging in development
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Save reference to prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

// Export common query helpers for Kenya market
export const dbHelpers = {
  // Soft delete helper
  async softDelete<T extends { id: string; deletedAt: Date | null }>(
    model: keyof PrismaClient,
    id: string
  ): Promise<void> {
    const m = prisma[model] as { update: (args: { where: { id: string }; data: { deletedAt: Date } }) => Promise<T> };
    await m.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  // Check if record exists and is not soft deleted
  async exists(
    model: keyof PrismaClient,
    id: string
  ): Promise<boolean> {
    const m = prisma[model] as { findUnique: (args: { where: { id: string; deletedAt?: null } }) => Promise<unknown> };
    const record = await m.findUnique({
      where: { id, deletedAt: null },
    });
    return record !== null;
  },

  // Get active products with stock check
  async getActiveProducts(skip?: number, take?: number) {
    return prisma.product.findMany({
      where: {
        status: 'active',
        deletedAt: null,
        variants: {
          some: {
            stockQty: { gt: 0 },
          },
        },
      },
      include: {
        images: true,
        category: true,
        brand: true,
        variants: {
          where: {
            stockQty: { gt: 0 },
            deletedAt: null,
          },
        },
      },
      skip,
      take,
    });
  },

  // Calculate shipping rate for Kenya zones
  async getShippingRate(
    zone: string,
    orderWeight: number,
    orderTotal: number
  ) {
    const rate = await prisma.shippingRate.findFirst({
      where: {
        zone: zone as 'nairobi' | 'nairobi_metropolitan' | 'coast' | 'central' | 'rift_valley' | 'western' | 'nyanza' | 'eastern' | 'northern' | 'international',
        isActive: true,
        OR: [
          { minWeight: null },
          { minWeight: { lte: orderWeight } },
        ],
        OR: [
          { maxWeight: null },
          { maxWeight: { gte: orderWeight } },
        ],
        OR: [
          { minOrder: null },
          { minOrder: { lte: orderTotal } },
        ],
      },
      orderBy: {
        rate: 'asc',
      },
    });

    // Check free shipping threshold
    if (rate?.freeThreshold && orderTotal >= Number(rate.freeThreshold)) {
      return { ...rate, rate: 0 };
    }

    return rate;
  },

  // Check stock availability
  async checkStock(variantId: string, quantity: number): Promise<boolean> {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stockQty: true, reservedQty: true },
    });

    if (!variant) return false;
    
    const availableQty = variant.stockQty - variant.reservedQty;
    return availableQty >= quantity;
  },

  // Reserve stock for order
  async reserveStock(variantId: string, quantity: number): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          select: { stockQty: true, reservedQty: true },
        });

        if (!variant || variant.stockQty - variant.reservedQty < quantity) {
          throw new Error('Insufficient stock');
        }

        await tx.productVariant.update({
          where: { id: variantId },
          data: { reservedQty: { increment: quantity } },
        });
      });
      return true;
    } catch {
      return false;
    }
  },

  // Release reserved stock
  async releaseStock(variantId: string, quantity: number): Promise<void> {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { reservedQty: { decrement: quantity } },
    });
  },

  // Confirm stock (reduce actual stock after order completion)
  async confirmStock(variantId: string, quantity: number): Promise<void> {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stockQty: { decrement: quantity },
        reservedQty: { decrement: quantity },
      },
    });
  },
};

export { prisma };
