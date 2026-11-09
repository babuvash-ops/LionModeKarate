// Lion Mode Karate Academy Pro Shop catalogue. Prices in South African Rand (VAT-inclusive).
import { DUMMY_PRODUCTS } from "./dummyData";

export const PRODUCTS = DUMMY_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  compare_at_price: p.compare_at_price,
  image: p.images[0] || p.image,
  images: p.images,
  category: p.category,
  description: p.description,
  rating: p.rating,
  badge: p.badge,
  stock: p.stock,
  sizes: p.sizes,
  is_active: p.is_active
}));

export const CATEGORIES = ["All", "Uniforms", "Equipment", "Belts", "Apparel", "Accessories"];
export const SHIPPING_FLAT = 80;
export const FREE_SHIPPING_THRESHOLD = 1000;

export const formatZAR = (n: number | string) =>
  "R " + Number(n || 0).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
