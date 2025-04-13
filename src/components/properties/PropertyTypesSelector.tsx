
import React from 'react';
import { Button } from '@/components/ui/button';
import { PropertyType } from '@/services/propertiesService';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTypeLabel } from './PropertyList';
import { 
  Briefcase, 
  Contact, 
  FileSpreadsheet, 
  Package, 
  Receipt, 
  UserCheck,
  Users,
  HelpCircle
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface PropertyTypesSelectorProps {
  selectedType: PropertyType;
  onTypeChange: (type: PropertyType) => void;
}

const propertyTypes: PropertyType[] = [
  'lead',
  'company',
  'contact',
  'deal',
  'user',
  'product',
  'invoice'
];

const typeIcons: Record<PropertyType, React.ReactNode> = {
  lead: <UserCheck className="h-4 w-4 mr-2" />,
  company: <Briefcase className="h-4 w-4 mr-2" />,
  contact: <Contact className="h-4 w-4 mr-2" />,
  deal: <FileSpreadsheet className="h-4 w-4 mr-2" />,
  user: <Users className="h-4 w-4 mr-2" />,
  product: <Package className="h-4 w-4 mr-2" />,
  invoice: <Receipt className="h-4 w-4 mr-2" />
};

const typeDescriptions: Record<PropertyType, string> = {
  lead: "خصائص العملاء المحتملين قبل تحويلهم إلى عملاء",
  company: "معلومات الشركات والمؤسسات",
  contact: "بيانات جهات الاتصال والأفراد",
  deal: "تفاصيل الصفقات والفرص البيعية",
  user: "بيانات المستخدمين والمشرفين",
  product: "تفاصيل المنتجات والخدمات",
  invoice: "معلومات الفواتير والمدفوعات"
};

const PropertyTypesSelector: React.FC<PropertyTypesSelectorProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  return (
    <TooltipProvider>
      <div className="mb-6">
        <Tabs 
          defaultValue={selectedType} 
          onValueChange={(value) => onTypeChange(value as PropertyType)}
        >
          <TabsList className="overflow-auto flex w-full border-b pb-px bg-background">
            {propertyTypes.map((type) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value={type} 
                    className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex items-center justify-center"
                  >
                    {typeIcons[type]}
                    {getTypeLabel(type)}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" className="bg-popover p-2 max-w-xs">
                  <p>{typeDescriptions[type]}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default PropertyTypesSelector;
