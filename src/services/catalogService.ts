
// Re-export everything from the catalog module
export * from './catalog';
export * from './catalog/utils';
export * from './catalog/products';
export * from './catalog/categories';
export * from './catalog/subscriptions';
export * from './catalog/productService';

// Alias functions to maintain compatibility
import { fetchProducts as getProducts } from './catalog/products';
import { fetchProductById as getProductById } from './catalog/products';
import { fetchCategories as getCategories } from './catalog/categories';

export {
  getProducts,
  getProductById,
  getCategories
};
