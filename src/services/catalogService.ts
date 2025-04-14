
// Re-export specific functions from the catalog module to avoid conflicts
export { ProductType, productTypeIconMap, productTypeLabels } from './catalog/utils';

// Export from products.ts
export {
  fetchProducts,
  fetchProductById,
  createProduct as createProductLegacy,
  updateProduct as updateProductLegacy,
  deleteProduct,
  Product
} from './catalog/products';

// Export from categories.ts
export {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  Category
} from './catalog/categories';

// Export from productService.ts (newer versions)
export {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  Product as ProductNew
} from './catalog/productService';

// Export from subscriptions.ts
export {
  fetchSubscriptions,
  fetchSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  Subscription,
  BillingCycle
} from './catalog/subscriptions';
