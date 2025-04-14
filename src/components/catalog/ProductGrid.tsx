
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/catalogService';
import type { productTypeIconMap, productTypeLabels } from '@/services/catalogService';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="w-2/3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="w-1/3">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="col-span-3 py-8 text-center">
        <p className="text-gray-500">لا توجد منتجات متطابقة مع معايير البحث</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        // Import dynamically to avoid the TS error
        const productTypeIcons = require('@/services/catalog/utils').productTypeIconMap;
        const productTypeLbls = require('@/services/catalog/utils').productTypeLabels;
        const IconComponent = productTypeIcons[product.type];
        
        return (
          <Link to={`/catalog/product/${product.id}`} key={product.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-5 w-5" />
                      <span className="text-sm text-gray-500">{productTypeLbls[product.type]}</span>
                    </div>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{product.price} ر.س</div>
                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                  </div>
                </div>
                {product.type === 'physical' && (
                  <div className="mt-4 text-sm">
                    <span className="text-gray-500">المخزون: </span>
                    <span className={`font-medium ${(product.inventory || 0) > 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inventory || 0} وحدة
                    </span>
                  </div>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-sm ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {product.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                  <Button variant="ghost" size="sm">
                    تفاصيل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
