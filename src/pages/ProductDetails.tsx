
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductById,
  updateProduct,
  deleteProduct,
  fetchCategories
} from '@/services/catalogService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductForm from '@/components/catalog/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Tag,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
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

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : null,
    enabled: !!id,
  });

  // Fetch categories for category name display
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("تم حذف المنتج بنجاح");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/catalog');
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (product: { id: string; isActive: boolean }) => 
      updateProduct(product.id, { isActive: !product.isActive }),
    onSuccess: () => {
      toast.success("تم تحديث حالة المنتج بنجاح");
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (error) => {
      console.error("Error updating product status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة المنتج");
    }
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = () => {
    if (product) {
      toggleActiveMutation.mutate({ 
        id: product.id, 
        isActive: product.isActive 
      });
    }
  };

  // Get category name from category ID
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'بدون تصنيف';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'بدون تصنيف';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 rtl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="p-6 rtl">
          <h1 className="text-2xl font-bold mb-4">خطأ في تحميل المنتج</h1>
          <p className="text-red-600">لا يمكن العثور على المنتج أو حدث خطأ أثناء التحميل.</p>
          <Button className="mt-4" onClick={() => navigate('/catalog')}>
            <ArrowLeft className="ml-2" size={16} />
            العودة إلى الكتالوج
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isEditing) {
    return (
      <DashboardLayout>
        <div className="p-6 rtl">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="mr-4">
              <ArrowLeft className="ml-2" size={16} />
              العودة إلى تفاصيل المنتج
            </Button>
            <h1 className="text-2xl font-bold">تحرير المنتج</h1>
          </div>
          <ProductForm 
            product={product} 
            onSuccess={() => {
              setIsEditing(false);
              queryClient.invalidateQueries({ queryKey: ['product', id] });
              queryClient.invalidateQueries({ queryKey: ['products'] });
            }} 
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Button variant="ghost" onClick={() => navigate('/catalog')} className="mr-4">
              <ArrowLeft className="ml-2" size={16} />
              العودة إلى الكتالوج
            </Button>
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              variant={product.isActive ? "outline" : "default"} 
              onClick={handleToggleActive}
            >
              {product.isActive ? (
                <>
                  <XCircle className="ml-2" size={16} />
                  تعطيل المنتج
                </>
              ) : (
                <>
                  <CheckCircle className="ml-2" size={16} />
                  تفعيل المنتج
                </>
              )}
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="ml-2" size={16} />
              تحرير المنتج
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleting(true)}>
              <Trash2 className="ml-2" size={16} />
              حذف
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">الوصف</h3>
                  <p className="mt-1 text-gray-600">{product.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">السعر</h3>
                    <p className="mt-1 text-gray-600 text-lg font-bold">{product.price} ر.س</p>
                  </div>
                  <div>
                    <h3 className="font-medium">رمز المنتج (SKU)</h3>
                    <p className="mt-1 text-gray-600">{product.sku || 'غير محدد'}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Package className="ml-2 text-gray-500" />
                    <div>
                      <h3 className="font-medium">النوع</h3>
                      <p className="mt-1 text-gray-600">{product.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Tag className="ml-2 text-gray-500" />
                    <div>
                      <h3 className="font-medium">التصنيف</h3>
                      <p className="mt-1 text-gray-600">{getCategoryName(product.category_id)}</p>
                    </div>
                  </div>
                </div>

                {product.type === 'physical' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium">المخزون</h3>
                      <p className="mt-1 text-gray-600">
                        {product.inventory !== undefined ? `${product.inventory} وحدة` : 'غير محدد'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">الحالة</h3>
                  <div className="mt-1">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">تاريخ الإنشاء</h3>
                  <div className="mt-1 flex items-center text-gray-600">
                    <Calendar className="ml-2" size={14} />
                    <span>
                      {product.createdAt ? format(new Date(product.createdAt), 'dd/MM/yyyy') : 'غير محدد'}
                    </span>
                  </div>
                </div>

                {product.image_url && (
                  <div>
                    <h3 className="text-sm font-medium">صورة المنتج</h3>
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-auto object-cover" 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المنتج؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المنتج "{product.name}" نهائياً. هذه العملية لا يمكن التراجع عنها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ProductDetails;
