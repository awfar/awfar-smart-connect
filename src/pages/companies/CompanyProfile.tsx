
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyProfileTabs } from '@/components/companies/CompanyProfileTabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useBreakpoints } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '@/services/companies';
import { toast } from 'sonner';

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoints();
  
  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id || ''),
    enabled: !!id,
    onError: () => {
      toast.error('حدث خطأ في تحميل بيانات الشركة');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[300px]">
        <p className="text-muted-foreground">جاري تحميل بيانات الشركة...</p>
      </div>
    );
  }
  
  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px]">
        <p className="text-destructive mb-4">حدث خطأ في تحميل بيانات الشركة</p>
        <Button onClick={() => navigate('/dashboard/companies')}>
          العودة إلى قائمة الشركات
        </Button>
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

      <CompanyProfileTabs company={company} />
    </div>
  );
};

export default CompanyProfile;
