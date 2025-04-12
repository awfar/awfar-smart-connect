
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getProductById, productTypeIconMap, productTypeLabels } from '@/services/catalogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Tag 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId || ''),
    enabled: !!productId
  });

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

  const createdDate = new Date(product.createdAt);
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
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
            <Button variant="destructive" className="gap-2">
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
                <Badge variant={product.isActive ? 'success' : 'destructive'}>
                  {product.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>

              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <Clock className="h-4 w-4 mr-1" /> 
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
                    <Tag className="h-3 w-3 mr-1" />
                    إضافة تصنيف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetails;
