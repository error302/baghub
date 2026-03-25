interface ProductJsonLdProps {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  sku: string;
  brand: string;
  category: string;
  reviews: {
    average: number;
    count: number;
  };
  availability: "InStock" | "OutOfStock";
}

export default function ProductJsonLd({
  name,
  description,
  price,
  originalPrice,
  image,
  sku,
  brand,
  category,
  reviews,
  availability,
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `https://baghub.com${image}`,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category,
    offers: {
      "@type": "Offer",
      url: `https://baghub.com/shop/${sku.toLowerCase()}`,
      priceCurrency: "USD",
      price: price.toString(),
      ...(originalPrice && {
        priceValidUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      }),
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.average.toString(),
      reviewCount: reviews.count.toString(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}