
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  getProducts, 
  getCategories, 
  Product, 
  ProductType, 
  productTypeIconMap, 
  productTypeLabels,
  createProduct 
} from '@/services/catalogService';
import { 
  Plus,
  Search,
  Filter,
  Tag,
  CircleSlash,
  ArrowUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ProductForm from '@/components/catalog/ProductForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const CatalogManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType | 'all'>('all');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleProductSuccess = () => {
    setShowProductForm(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">إدارة الكتالوج</h1>
          <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <ProductForm 
                onSuccess={handleProductSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="subscriptions">الاشتراكات</TabsTrigger>
            <TabsTrigger value="packages">الباقات</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="البحث عن منتج..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    فلترة
                    {filterType !== 'all' && <Badge variant="secondary" className="mr-2">{productTypeLabels[filterType as ProductType]}</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType('all')}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <span>جميع المنتجات</span>
                  </DropdownMenuItem>
                  {(Object.keys(productTypeIconMap) as ProductType[]).map(type => {
                    const IconComponent = productTypeIconMap[type];
                    return (
                      <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                        <IconComponent className="mr-2 h-4 w-4" />
                        <span>{productTypeLabels[type]}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="gap-2">
                <Tag size={16} />
                تصنيف
              </Button>
              <Button variant="outline" className="gap-2" onClick={resetFilters}>
                <CircleSlash size={16} />
                مسح الفلاتر
              </Button>
            </div>

            {isLoadingProducts ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const IconComponent = productTypeIconMap[product.type];
                  
                  return (
                    <Link to={`/catalog/product/${product.id}`} key={product.id}>
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <IconComponent className="h-5 w-5" />
                                <span className="text-sm text-gray-500">{productTypeLabels[product.type]}</span>
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
                            <span className={`text-sm ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {product.isActive ? 'نشط' : 'غير نشط'}
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
                {filteredProducts.length === 0 && (
                  <div className="col-span-3 py-8 text-center">
                    <p className="text-gray-500">لا توجد منتجات متطابقة مع معايير البحث</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">إدارة الاشتراكات</h3>
              <p className="text-gray-500 mt-2">يمكنك الانتقال إلى <Link to="/subscriptions" className="text-primary underline">صفحة إدارة الاشتراكات</Link> للتعامل مع الاشتراكات</p>
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">إدارة الباقات</h3>
              <p className="text-gray-500 mt-2">يمكنك الانتقال إلى <Link to="/packages" className="text-primary underline">صفحة إدارة الباقات</Link> للتعامل مع الباقات</p>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">قسم إدارة التصنيفات</h3>
              <p className="text-gray-500 mt-2">سيتم تنفيذ إدارة التصنيفات قريباً</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CatalogManagement;
