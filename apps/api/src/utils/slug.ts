/**
 * Generate URL-friendly slugs for SEO optimization
 */

/**
 * Convert text to URL slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Generate unique slug with optional suffix
 */
export const generateUniqueSlug = async (
  text: string,
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts: number = 100
): Promise<string> => {
  let baseSlug = generateSlug(text);
  let slug = baseSlug;
  let attempt = 0;
  
  while (await checkExists(slug)) {
    attempt++;
    if (attempt > maxAttempts) {
      throw new Error('Unable to generate unique slug after maximum attempts');
    }
    slug = `${baseSlug}-${attempt}`;
  }
  
  return slug;
};

/**
 * Generate SKU from product data
 */
export const generateSKU = (
  brandCode: string,
  categoryCode: string,
  productNumber: number,
  variantCode?: string
): string => {
  const brand = brandCode.toUpperCase().substring(0, 3).padEnd(3, 'X');
  const category = categoryCode.toUpperCase().substring(0, 2).padEnd(2, 'X');
  const number = productNumber.toString().padStart(5, '0');
  const variant = variantCode ? `-${variantCode.toUpperCase()}` : '';
  
  return `${brand}-${category}-${number}${variant}`;
};

/**
 * Generate order number
 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ME-${timestamp}${random}`;
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 100;
};

/**
 * Convert slug back to readable text
 */
export const slugToReadable = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Generate SEO-friendly URL path
 */
export const generateSEOPath = (
  type: 'product' | 'category' | 'brand',
  slug: string,
  id?: string
): string => {
  const paths: Record<string, string> = {
    product: '/products',
    category: '/categories',
    brand: '/brands',
  };
  
  const basePath = paths[type] || '';
  return id ? `${basePath}/${slug}-${id}` : `${basePath}/${slug}`;
};

/**
 * Parse SEO path to extract slug and ID
 */
export const parseSEOPath = (path: string): { slug: string; id?: string } => {
  const parts = path.split('/').pop()?.split('-');
  if (!parts) return { slug: path };
  
  const lastPart = parts[parts.length - 1];
  if (/^[a-f0-9]{8,}$/i.test(lastPart)) {
    return {
      slug: parts.slice(0, -1).join('-'),
      id: lastPart,
    };
  }
  
  return { slug: path };
};

/**
 * Generate meta title for SEO
 */
export const generateMetaTitle = (
  title: string,
  siteName: string = 'Maison Élise',
  maxLength: number = 60
): string => {
  const fullTitle = `${title} | ${siteName}`;
  return fullTitle.length > maxLength ? title.substring(0, maxLength - 3) + '...' : fullTitle;
};

/**
 * Generate meta description
 */
export const generateMetaDescription = (
  description: string,
  maxLength: number = 160
): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

export default {
  generateSlug,
  generateUniqueSlug,
  generateSKU,
  generateOrderNumber,
  isValidSlug,
  slugToReadable,
  generateSEOPath,
  parseSEOPath,
  generateMetaTitle,
  generateMetaDescription,
};
