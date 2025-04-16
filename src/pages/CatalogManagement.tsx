
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchProducts,
  fetchCategories
} from '@/services/catalogService';
import type { ProductType } from '@/services/catalogService'; 
import ProductGrid from '@/components/catalog/ProductGrid';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogTabs from '@/components/catalog/CatalogTabs';
import ProductFormDialog from '@/components/catalog/ProductFormDialog';

const CatalogManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType | 'all'>('all');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesType;
  }) : [];

  const handleProductSuccess = () => {
    setShowProductForm(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
  };

  return (
    <div className="p-6 space-y-6 rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة الكتالوج</h1>
        <ProductFormDialog 
          open={showProductForm}
          onOpenChange={setShowProductForm}
          onSuccess={handleProductSuccess}
        />
      </div>

      <CatalogTabs
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      >
        <CatalogFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          resetFilters={resetFilters}
        />
        <ProductGrid
          products={filteredProducts}
          isLoading={isLoadingProducts}
        />
      </CatalogTabs>
    </div>
  );
};

export default CatalogManagement;
