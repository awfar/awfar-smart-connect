
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createLead, updateLead, Lead } from "@/services/leads";
import { useLeadForm } from '@/hooks/useLeadForm';
import LeadFormFields from './LeadFormFields';
import LeadFormToolbar from './LeadFormToolbar';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadFormProps {
  lead?: Lead;
  onClose?: () => void;
  onSuccess?: (lead?: Lead) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const editMode = !!lead;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<{ isConnected: boolean, message: string }>({
    isConnected: false,
    message: "جاري التحقق من الاتصال بقاعدة البيانات..."
  });
  const [authStatus, setAuthStatus] = useState<{ isAuthenticated: boolean, userId: string | null }>({
    isAuthenticated: false,
    userId: null
  });
  
  const { 
    formData, 
    options, 
    isLoading, 
    formErrors, 
    handleChange, 
    handleSelectChange, 
    validateForm 
  } = useLeadForm(lead);

  // Check Supabase connection and authentication on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check connection to database
        const { data, error } = await supabase.from('leads').select('count').limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setSupabaseStatus({
            isConnected: false,
            message: `خطأ في الاتصال بقاعدة البيانات: ${error.message}`
          });
        } else {
          console.log("Supabase connection successful:", data);
          setSupabaseStatus({
            isConnected: true,
            message: "تم الاتصال بقاعدة البيانات بنجاح"
          });
        }

        // Check authentication status
        const { data: authData } = await supabase.auth.getSession();
        setAuthStatus({
          isAuthenticated: !!authData.session,
          userId: authData.session?.user?.id || null
        });
        
        console.log("Authentication status:", !!authData.session ? "Authenticated" : "Not authenticated");
        
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setSupabaseStatus({
          isConnected: false,
          message: `خطأ في فحص الاتصال: ${err instanceof Error ? err.message : String(err)}`
        });
      }
    };
    
    checkConnection();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted with data:", formData);
    setDbError(null);
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }
    
    if (!supabaseStatus.isConnected) {
      setDbError("غير متصل بقاعدة البيانات! سيتم استخدام بيانات تجريبية.");
      toast.warning("سيتم استخدام بيانات تجريبية - تحقق من اتصالك بقاعدة البيانات");
    }
    
    setIsSubmitting(true);

    try {
      if (editMode && lead) {
        console.log("Updating lead:", lead.id);
        const updatedLead = await updateLead({
          ...lead,
          ...formData,
          id: lead.id,
          updated_at: new Date().toISOString()
        });
        
        if (updatedLead) {
          if (onSuccess) {
            onSuccess(updatedLead);
          }
          
          if (onClose) onClose();
        } else {
          setDbError("فشل في تحديث العميل المحتمل - لم يتم استلام بيانات التحديث");
        }
      } else {
        console.log("Creating new lead with data:", formData);
        
        // Set current timestamp for creation
        const newLeadData = {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Check Supabase auth status for debugging
        const { data: authData } = await supabase.auth.getSession();
        console.log("Current auth session:", authData);
        
        const newLead = await createLead(newLeadData as Omit<Lead, "id">);
        
        if (newLead) {
          console.log("Lead created with ID:", newLead.id);
          
          if (onSuccess) {
            onSuccess(newLead);
          }
          
          if (onClose) onClose();
        } else {
          setDbError("فشل في إنشاء العميل المحتمل - لم يتم استلام بيانات الإنشاء");
          throw new Error("No lead data returned from creation");
        }
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setDbError(error instanceof Error ? error.message : "خطأ غير معروف");
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      // This would typically redirect to a login page
      toast.info("لم يتم تنفيذ نظام المصادقة بعد. ستظل البيانات في وضع تجريبي.");
    } catch (error) {
      console.error("Error redirecting to login:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-2 text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {!authStatus.isAuthenticated && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">تنبيه: أنت غير مسجل دخول</AlertTitle>
          <AlertDescription className="text-amber-700">
            البيانات ستكون تجريبية فقط ولن يتم حفظها بشكل دائم. قم بتسجيل الدخول لحفظ بياناتك في قاعدة البيانات.
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={handleLogin} className="bg-amber-100 hover:bg-amber-200 border-amber-300">
                تسجيل الدخول
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {!supabaseStatus.isConnected && (
        <Alert variant="destructive" className="border-red-400 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-700">تحذير: مشكلة في الاتصال بقاعدة البيانات</AlertTitle>
          <AlertDescription className="text-red-600">
            {supabaseStatus.message} - سيتم استخدام بيانات تجريبية مؤقتة.
          </AlertDescription>
        </Alert>
      )}
      
      {dbError && (
        <Alert variant="destructive" className="bg-red-50 border-red-400">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-700">خطأ في العملية:</AlertTitle>
          <AlertDescription className="text-red-600">{dbError}</AlertDescription>
        </Alert>
      )}
      
      <LeadFormFields 
        formData={formData}
        formErrors={formErrors}
        options={options}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <LeadFormToolbar 
        isSubmitting={isSubmitting}
        onClose={onClose}
        isEditMode={editMode}
      />
    </form>
  );
};

export default LeadForm;
