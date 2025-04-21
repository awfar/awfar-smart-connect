
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Lead } from '@/types/leads';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LeadProfileInfoProps {
  lead: Lead;
}

const LeadProfileInfo: React.FC<LeadProfileInfoProps> = ({ lead }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: ar });
    } catch (e) {
      return dateString;
    }
  };

  // Information sections for the lead profile
  const contactInfo = [
    { label: 'البريد الإلكتروني', value: lead.email },
    { label: 'رقم الهاتف', value: lead.phone || 'غير متوفر' },
    { label: 'الشركة', value: lead.company || 'غير متوفر' },
    { label: 'المنصب', value: lead.position || 'غير متوفر' },
  ];

  const additionalInfo = [
    { label: 'الدولة', value: lead.country || 'غير متوفر' },
    { label: 'القطاع', value: lead.industry || 'غير متوفر' },
    { label: 'المصدر', value: lead.source || 'غير متوفر' },
    { label: 'تاريخ الإنشاء', value: formatDate(lead.created_at) },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">معلومات العميل المحتمل</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-md mb-2">معلومات الاتصال</h3>
            <div className="space-y-2">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-medium text-md mb-2">معلومات إضافية</h3>
            <div className="space-y-2">
              {additionalInfo.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {lead.notes && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="font-medium text-md mb-2">ملاحظات</h3>
              <p className="whitespace-pre-wrap">{lead.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadProfileInfo;
