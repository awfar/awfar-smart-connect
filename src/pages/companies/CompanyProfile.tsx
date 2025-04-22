import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyProfileTabs } from '@/components/companies/CompanyProfileTabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useBreakpoints } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '@/services/companies';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CompanyActions } from '@/components/companies/CompanyActions';

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoints();
  
  const { data: company, isLoading, error, refetch } = useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id || ''),
    enabled: !!id,
    retry: 2, // Retry failed requests twice
  });

  React.useEffect(() => {
    if (error) {
      console.error('Error fetching company data:', error);
      toast.error('حدث خطأ في تحميل بيانات الشركة');
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل بيانات الشركة...</p>
        </div>
      </div>
    );
  }
  
  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px]">
        <Alert variant="destructive" className="mb-6 max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="mr-2">خطأ في تحميل البيانات</AlertTitle>
          <AlertDescription>
            حدث خطأ في تحميل بيانات الشركة، يرجى المحاولة مرة أخرى.
          </AlertDescription>
        </Alert>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Button onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/companies')}>
            العودة إلى قائمة الشركات
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    toast.info('سيتم إضافة وظيفة الحذف قريباً');
  };

  const handleEdit = () => {
    toast.info('سيتم إضافة وظيفة التعديل قريباً');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost"
            onClick={() => navigate('/dashboard/companies')}
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة
          </Button>
          <h1 className="text-2xl font-bold">{company.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 ml-2" />
            {!isMobile && "تعديل"}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 ml-2" />
            {!isMobile && "حذف"}
          </Button>
        </div>
      </div>

      <CompanyActions companyId={company.id} />

      <CompanyProfileTabs company={company} />
    </div>
  );
};

export default CompanyProfile;
