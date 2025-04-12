
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getPackages, getProducts } from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Plus, Edit, Package, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PackageManagement: React.FC = () => {
  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: getPackages
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة الباقات</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إنشاء باقة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription className="mt-1">{pkg.description}</CardDescription>
                  </div>
                  <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                    {pkg.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">{pkg.price} ر.س</div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">محتوى الباقة:</h4>
                  <ul className="space-y-2">
                    {pkg.products.map((productId) => {
                      const product = products.find(p => p.id === productId);
                      return product ? (
                        <li key={productId} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>{product.name}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="gap-1">
                  <Edit className="h-4 w-4" />
                  تعديل
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* Add New Package Card */}
          <Card className="border-dashed border-2 flex flex-col justify-center items-center p-6 h-full">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-center">إنشاء باقة جديدة</h3>
            <p className="text-gray-500 text-center mb-4">قم بتجميع المنتجات والخدمات في باقة واحدة</p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              باقة جديدة
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PackageManagement;
