
import React from 'react';
import { Lead } from '@/types/leads';
import { Mail, Phone, MapPin, Building, Briefcase, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LeadProfileInfoProps {
  lead: Lead;
}

const LeadProfileInfo: React.FC<LeadProfileInfoProps> = ({ lead }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">المعلومات الأساسية</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</p>
              <p>{lead.email || 'غير محدد'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">رقم الهاتف</p>
              <p>{lead.phone || 'غير محدد'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Building className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">الشركة</p>
              <p>{lead.company || 'غير محدد'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">المنصب الوظيفي</p>
              <p>{lead.position || 'غير محدد'}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">الدولة</p>
              <p>{lead.country || 'غير محدد'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Building className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">القطاع</p>
              <p>{lead.industry || 'غير محدد'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <User className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">المسؤول عن العميل</p>
              <p>{lead.owner?.name || 'غير محدد'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 ml-2" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</p>
              <p>
                {lead.created_at 
                  ? format(new Date(lead.created_at), 'yyyy/MM/dd HH:mm', { locale: ar }) 
                  : 'غير محدد'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {lead.notes && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">ملاحظات</h3>
          <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
            {lead.notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadProfileInfo;
