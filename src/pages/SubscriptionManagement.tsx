
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscription, fetchSubscriptions } from '@/services/catalogService';
import { Plus, Check, RefreshCw, Pencil, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SubscriptionForm from '@/components/catalog/SubscriptionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SubscriptionManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editSubscription, setEditSubscription] = useState<Subscription | undefined>(undefined);
  const queryClient = useQueryClient();
  
  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions
  });

  const handleEditSubscription = (subscription: Subscription) => {
    setEditSubscription(subscription);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditSubscription(undefined);
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة الاشتراكات</h1>
          <Button className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            إضافة خطة اشتراك
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(subscriptions) && subscriptions.map((subscription) => (
              <SubscriptionCard 
                key={subscription.id} 
                subscription={subscription} 
                onEdit={() => handleEditSubscription(subscription)}
              />
            ))}
            
            {/* Add New Subscription Card */}
            <Card className="border-dashed border-2 flex flex-col justify-center items-center p-6 h-full">
              <Plus className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-center">إضافة خطة اشتراك</h3>
              <p className="text-gray-500 text-center mb-4">أنشئ خطة اشتراك جديدة لعملائك</p>
              <Button className="gap-2" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                اشتراك جديد
              </Button>
            </Card>
          </div>
        )}

        <Separator className="my-10" />

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">التقارير والإحصائيات</h2>
          <Button variant="outline" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            تحديث البيانات
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إجمالي الإيرادات المتكررة</CardTitle>
              <CardDescription>إجمالي الإيرادات الشهرية من الاشتراكات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Array.isArray(subscriptions) && subscriptions.reduce((sum, sub) => {
                  let multiplier = 1;
                  if (sub.billingCycle === 'quarterly') multiplier = 1/3;
                  if (sub.billingCycle === 'annually') multiplier = 1/12;
                  return sum + (sub.price * multiplier);
                }, 0).toFixed(2)} ر.س
              </div>
              <div className="text-sm text-green-600 flex items-center mt-2">
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+8.2% مقارنة بالشهر السابق</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>متوسط قيمة الاشتراك</CardTitle>
              <CardDescription>متوسط قيمة الاشتراك الشهري</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Array.isArray(subscriptions) && subscriptions.length ? 
                  (subscriptions.reduce((sum, sub) => sum + sub.price, 0) / subscriptions.length).toFixed(2) 
                  : '0'} ر.س
              </div>
              <div className="text-sm text-green-600 flex items-center mt-2">
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+2.5% مقارنة بالشهر السابق</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معدل الاحتفاظ بالعملاء</CardTitle>
              <CardDescription>نسبة العملاء الذين يستمرون بالاشتراك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">93%</div>
              <div className="text-sm text-green-600 flex items-center mt-2">
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+1.2% مقارنة بالشهر السابق</span>
              </div>
            </CardContent>
          </Card>
        </div>
      
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editSubscription ? 'تعديل الاشتراك' : 'إضافة اشتراك جديد'}</DialogTitle>
            </DialogHeader>
            <SubscriptionForm 
              subscription={editSubscription} 
              onSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onEdit }) => {
  const billingCycleLabels: Record<string, string> = {
    monthly: 'شهرياً',
    quarterly: 'كل 3 أشهر',
    annually: 'سنوياً'
  };

  return (
    <Card className={`overflow-hidden ${subscription.id === '2' ? 'border-primary border-2' : ''}`}>
      {subscription.id === '2' && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">الأكثر شعبية</div>
      )}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{subscription.name}</CardTitle>
          <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
            {subscription.isActive ? 'نشط' : 'غير نشط'}
          </Badge>
        </div>
        <CardDescription>{subscription.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-3xl font-bold">{subscription.price}</span>
          <span className="text-muted-foreground"> ر.س/{billingCycleLabels[subscription.billingCycle]}</span>
        </div>
        
        <ul className="space-y-2 mb-6">
          {subscription.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary ml-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <Button className="flex-1 gap-1" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            تعديل
          </Button>
          <Button variant="outline" className="flex-1 gap-1">
            <X className="h-4 w-4" />
            إلغاء تنشيط
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
