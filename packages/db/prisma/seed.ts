import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "handbags" },
      update: {},
      create: {
        name: "Handbags",
        slug: "handbags",
        description: "Premium handbags for every occasion",
      },
    }),
    prisma.category.upsert({
      where: { slug: "backpacks" },
      update: {},
      create: {
        name: "Backpacks",
        slug: "backpacks",
        description: "Stylish backpacks for work and travel",
      },
    }),
    prisma.category.upsert({
      where: { slug: "totes" },
      update: {},
      create: {
        name: "Totes",
        slug: "totes",
        description: "Spacious totes for everyday use",
      },
    }),
    prisma.category.upsert({
      where: { slug: "wallets" },
      update: {},
      create: {
        name: "Wallets",
        slug: "wallets",
        description: "Elegant wallets and cardholders",
      },
    }),
    prisma.category.upsert({
      where: { slug: "luggage" },
      update: {},
      create: {
        name: "Luggage",
        slug: "luggage",
        description: "Durable luggage for all your travels",
      },
    }),
    prisma.category.upsert({
      where: { slug: "kids" },
      update: {},
      create: {
        name: "Kids",
        slug: "kids",
        description: "Fun and functional bags for children",
      },
    }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "baghub-originals" },
      update: {},
      create: {
        name: "BagHub Originals",
        slug: "baghub-originals",
        description: "Our signature collection",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "luxe-collection" },
      update: {},
      create: {
        name: "Luxe Collection",
        slug: "luxe-collection",
        description: "Premium designer bags",
      },
    }),
  ]);

  // Create products
  const products = [
    {
      sku: "BAG-TOTE-001",
      slug: "classic-leather-tote",
      name: "Classic Leather Tote",
      description:
        "A timeless leather tote crafted from premium Italian leather. Perfect for everyday use with spacious interior.",
      categoryId: categories[2].id, // Totes
      brandId: brands[0].id,
      basePrice: 299.99,
      status: "active" as const,
      isFeatured: true,
    },
    {
      sku: "BAG-HAND-001",
      slug: "designer-handbag",
      name: "Designer Handbag",
      description:
        "Elegant designer handbag with gold hardware and premium leather construction.",
      categoryId: categories[0].id, // Handbags
      brandId: brands[1].id,
      basePrice: 499.99,
      status: "active" as const,
      isFeatured: true,
    },
    {
      sku: "BAG-BACK-001",
      slug: "travel-backpack",
      name: "Travel Backpack",
      description:
        "Durable travel backpack with laptop compartment and multiple pockets.",
      categoryId: categories[1].id, // Backpacks
      brandId: brands[0].id,
      basePrice: 189.99,
      status: "active" as const,
      isFeatured: true,
    },
    {
      sku: "BAG-WAL-001",
      slug: "slim-wallet",
      name: "Slim Wallet",
      description:
        "Minimalist wallet with RFID protection and multiple card slots.",
      categoryId: categories[3].id, // Wallets
      brandId: brands[0].id,
      basePrice: 79.99,
      status: "active" as const,
      isFeatured: true,
    },
    {
      sku: "BAG-LUG-001",
      slug: "weekend-duffel",
      name: "Weekend Duffel",
      description:
        "Perfect weekend getaway duffel with shoe compartment.",
      categoryId: categories[4].id, // Luggage
      brandId: brands[0].id,
      basePrice: 159.99,
      status: "active" as const,
      isFeatured: false,
    },
    {
      sku: "BAG-HAND-002",
      slug: "crossbody-bag",
      name: "Crossbody Bag",
      description:
        "Compact crossbody bag perfect for essentials on the go.",
      categoryId: categories[0].id, // Handbags
      brandId: brands[0].id,
      basePrice: 129.99,
      status: "active" as const,
      isFeatured: false,
    },
    {
      sku: "BAG-KID-001",
      slug: "kids-backpack",
      name: "Kids Backpack",
      description:
        "Fun and colorful backpack for kids with padded straps.",
      categoryId: categories[5].id, // Kids
      brandId: brands[0].id,
      basePrice: 49.99,
      status: "active" as const,
      isFeatured: false,
    },
    {
      sku: "BAG-TOTE-002",
      slug: "canvas-tote",
      name: "Canvas Tote",
      description:
        "Durable canvas tote with reinforced handles.",
      categoryId: categories[2].id, // Totes
      brandId: brands[0].id,
      basePrice: 89.99,
      status: "active" as const,
      isFeatured: false,
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });

    // Create variants for each product
    const colors = ["Black", "Brown", "Tan", "Navy"];
    const sizes = ["Small", "Medium", "Large"];

    for (const color of colors) {
      for (const size of sizes) {
        const variantSku = `${product.sku}-${color.substring(0, 3).toUpperCase()}-${size.substring(0, 1)}`;
        await prisma.productVariant.upsert({
          where: { barcode: variantSku },
          update: {},
          create: {
            productId: createdProduct.id,
            skuSuffix: `-${color}-${size}`,
            color,
            size,
            stockQty: Math.floor(Math.random() * 20) + 5,
            images: [],
            barcode: variantSku,
          },
        });
      }
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });