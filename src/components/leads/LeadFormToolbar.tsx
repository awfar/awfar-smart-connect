
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LeadFormToolbarProps {
  isSubmitting: boolean;
  onClose?: () => void;
  isEditMode: boolean;
}

const LeadFormToolbar: React.FC<LeadFormToolbarProps> = ({
  isSubmitting,
  onClose,
  isEditMode
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        disabled={isSubmitting}
      >
        إلغاء
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : isEditMode ? "تحديث" : "إضافة"}
      </Button>
    </div>
  );
};

export default LeadFormToolbar;
