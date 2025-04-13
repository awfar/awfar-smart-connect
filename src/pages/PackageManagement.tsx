
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getPackages, getProducts } from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Plus, Edit, Package as PackageIcon, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type Package as PackageType } from '@/services/catalogService';
import PackageForm from '@/components/catalog/PackageForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PackageManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editPackage, setEditPackage] = useState<PackageType | undefined>(undefined);
  const queryClient = useQueryClient();
  
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: getPackages
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const handleEditPackage = (pkg: PackageType) => {
    setEditPackage(pkg);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditPackage(undefined);
    queryClient.invalidateQueries({ queryKey: ['packages'] });
  };

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة الباقات</h1>
          <Button className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            إنشاء باقة جديدة
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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
                            <Check className="h-4 w-4 text-green-500 ml-2" />
                            <span>{product.name}</span>
                          </li>
                        ) : null;
                      })}
                      {pkg.products.length === 0 && (
                        <li className="text-sm text-gray-500">لا توجد منتجات في هذه الباقة</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" className="gap-1" onClick={() => handleEditPackage(pkg)}>
                    <Edit className="h-4 w-4" />
                    تعديل
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Package Card */}
            <Card className="border-dashed border-2 flex flex-col justify-center items-center p-6 h-full">
              <PackageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-center">إنشاء باقة جديدة</h3>
              <p className="text-gray-500 text-center mb-4">قم بتجميع المنتجات والخدمات في باقة واحدة</p>
              <Button className="gap-2" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                باقة جديدة
              </Button>
            </Card>
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editPackage ? 'تعديل الباقة' : 'إنشاء باقة جديدة'}</DialogTitle>
            </DialogHeader>
            <PackageForm 
              package={editPackage} 
              onSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PackageManagement;
