import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(255, "Email is too long")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Product schemas
export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name is too long")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long")
    .trim(),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU is too long")
    .regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, and hyphens")
    .trim(),
  basePrice: z
    .number()
    .min(0.01, "Price must be at least $0.01")
    .max(99999.99, "Price is too high"),
  categoryId: z.string().uuid("Invalid category"),
  brandId: z.string().uuid("Invalid brand"),
  status: z.enum(["draft", "active", "archived"]),
  isFeatured: z.boolean().default(false),
});

// Order schemas
export const shippingAddressSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .optional(),
  address1: z
    .string()
    .min(5, "Address is required")
    .max(200, "Address is too long")
    .trim(),
  address2: z
    .string()
    .max(200, "Address is too long")
    .trim()
    .optional(),
  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City name is too long")
    .trim(),
  state: z
    .string()
    .min(2, "State is required")
    .max(50, "State name is too long")
    .trim(),
  zip: z
    .string()
    .min(3, "ZIP code is required")
    .max(20, "ZIP code is too long")
    .regex(/^[\d\-\s]+$/, "Please enter a valid ZIP code")
    .trim(),
  country: z
    .string()
    .length(2, "Please select a valid country")
    .toUpperCase(),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Cart is empty")
    .max(20, "Too many items in cart"),
  shippingAddress: shippingAddressSchema,
  notes: z.string().max(500).optional(),
});

// Review schemas
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .trim(),
  body: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review is too long")
    .trim(),
});

// User profile schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long")
    .trim(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message is too long")
    .trim(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ContactInput = z.infer<typeof contactSchema>;