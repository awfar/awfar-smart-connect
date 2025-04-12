
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscription, getSubscriptions } from '@/services/catalogService';
import { Plus, Check, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SubscriptionManagement: React.FC = () => {
  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions
  });

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة الاشتراكات</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة خطة اشتراك
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard 
              key={subscription.id} 
              subscription={subscription} 
            />
          ))}
        </div>

        <Separator className="my-10" />

        <div className="mb-6">
          <h2 className="text-2xl font-bold">التقارير والإحصائيات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إجمالي الإيرادات المتكررة</CardTitle>
              <CardDescription>إجمالي الإيرادات الشهرية من الاشتراكات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">13,500 ر.س</div>
              <div className="text-sm text-green-600 flex items-center mt-2">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="text-3xl font-bold">199 ر.س</div>
              <div className="text-sm text-green-600 flex items-center mt-2">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+1.2% مقارنة بالشهر السابق</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            تحديث البيانات
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

const SubscriptionCard: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
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
          <span className="text-muted-foreground"> ر.س/{subscription.billingCycle === 'monthly' ? 'شهرياً' : 
            subscription.billingCycle === 'quarterly' ? 'كل 3 أشهر' : 'سنوياً'}
          </span>
        </div>
        
        <ul className="space-y-2 mb-6">
          {subscription.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <Button className="flex-1">تعديل</Button>
          <Button variant="outline" className="flex-1">إلغاء تنشيط</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
