
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from 'lucide-react';
import { useBreakpoints } from '@/hooks/use-mobile';

interface LeadFormToolbarProps {
  isSubmitting: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
}

const LeadFormToolbar: React.FC<LeadFormToolbarProps> = ({
  isSubmitting,
  onClose,
  isEditMode = false
}) => {
  const { isMobile } = useBreakpoints();
  
  return (
    <div className={`
      flex items-center
      ${isMobile ? 'sticky bottom-0 bg-background pt-2 pb-1 border-t mt-4' : 'justify-end mt-6'}
      ${isMobile ? 'justify-between gap-2' : 'gap-4'}
    `}>
      {onClose && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className={isMobile ? "flex-1" : ""}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 ml-2" />
          <span>إلغاء</span>
        </Button>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={isMobile ? "flex-1" : ""}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            <span>جاري الحفظ...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4 ml-2" />
            <span>{isEditMode ? 'حفظ التغييرات' : 'إضافة عميل محتمل'}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default LeadFormToolbar;
