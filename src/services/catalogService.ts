
// Re-export specific functions from the catalog module to avoid conflicts

// Export types from utils.ts
export { type ProductType } from './catalog/utils';
export { productTypeIconMap } from './catalog/utils';
export { productTypeLabels } from './catalog/utils';

// Export from products.ts
export {
  fetchProducts,
  fetchProductById,
  createProduct as createProductLegacy,
  updateProduct as updateProductLegacy,
  deleteProduct,
} from './catalog/products';
export type { Product } from './catalog/products';

// Export from categories.ts
export {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './catalog/categories';
export type { Category } from './catalog/categories';

// Export from productService.ts (newer versions)
export {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
} from './catalog/productService';
export type { Product as ProductNew } from './catalog/productService';

// Export from subscriptions.ts
export {
  fetchSubscriptions,
  fetchSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from './catalog/subscriptions';
export type { Subscription, BillingCycle } from './catalog/subscriptions';
