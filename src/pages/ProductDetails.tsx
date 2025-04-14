
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  fetchProductById, 
  productTypeIconMap, 
  productTypeLabels,
  updateProduct
} from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from '@/components/catalog/ProductForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId || ''),
    enabled: !!productId
  });

  const handleProductUpdate = () => {
    setShowEditDialog(false);
    queryClient.invalidateQueries({ queryKey: ['product', productId] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast.success('تم تحديث المنتج بنجاح');
  };

  const handleDeleteProduct = async () => {
    try {
      if (product) {
        await updateProduct(product.id, { is_active: false });
        toast.success('تم إلغاء تنشيط المنتج بنجاح');
        setShowDeleteDialog(false);
        navigate('/catalog');
      }
    } catch (error) {
      console.error('Error deactivating product:', error);
      toast.error('حدث خطأ أثناء إلغاء تنشيط المنتج');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center">
          <div className="animate-pulse flex flex-col w-full max-w-3xl">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-red-600">حدث خطأ</h2>
          <p className="mt-2 text-gray-600">لم يتم العثور على المنتج المطلوب</p>
          <Button 
            variant="secondary" 
            className="mt-4"
            onClick={() => navigate('/catalog')}
          >
            العودة إلى الكتالوج
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const createdDate = new Date(product.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale: ar });
  
  // Get the correct icon component based on the product type
  const IconComponent = productTypeIconMap[product.type];

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/catalog')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">تفاصيل المنتج</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <IconComponent className="h-5 w-5" />
                  {productTypeLabels[product.type]}
                </Badge>
                <Badge variant={product.is_active ? 'success' : 'destructive'}>
                  {product.is_active ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>

              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <Clock className="h-4 w-4 ml-1" /> 
                <span>تم الإنشاء {timeAgo}</span>
              </div>

              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">الوصف</h3>
                <p className="text-gray-700">{product.description}</p>

                {product.type === 'physical' && product.inventory !== undefined && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">المخزون</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            product.inventory > 50 ? 'bg-green-600' : 
                            product.inventory > 20 ? 'bg-yellow-400' : 'bg-red-600'
                          }`} 
                          style={{ width: `${Math.min(100, (product.inventory / 100) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 font-medium">{product.inventory} وحدة</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">معلومات المنتج</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">السعر:</span>
                    <span className="font-bold">{product.price} ر.س</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">SKU:</span>
                    <span>{product.sku}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">النوع:</span>
                    <span>{productTypeLabels[product.type]}</span>
                  </div>
                  
                  {product.type === 'physical' && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">المخزون:</span>
                      <span 
                        className={`${
                          (product.inventory || 0) > 20 ? 'text-green-600' : 'text-red-600'
                        } font-medium`}
                      >
                        {product.inventory || 0} وحدة
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">التصنيفات</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    منتجات
                  </Badge>
                  {product.type === 'physical' && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      منتجات مادية
                    </Badge>
                  )}
                  {product.type === 'digital' && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      منتجات رقمية
                    </Badge>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Tag className="h-3 w-3 ml-1" />
                    إضافة تصنيف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          <ProductForm 
            product={product} 
            onSuccess={handleProductUpdate} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إلغاء تنشيط المنتج بدلاً من حذفه نهائياً. يمكنك إعادة تنشيطه لاحقاً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground">
              نعم، قم بالحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ProductDetails;
