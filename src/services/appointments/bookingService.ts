
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppointmentCreateInput } from "./types";

export const createBooking = async (appointmentData: AppointmentCreateInput) => {
  try {
    // Validate required fields
    if (!appointmentData.title) {
      toast.error("عنوان الموعد مطلوب");
      return null;
    }
    
    if (!appointmentData.start_time || !appointmentData.end_time) {
      toast.error("وقت البداية والنهاية مطلوبان");
      return null;
    }
    
    // Get current user for created_by field if not provided
    if (!appointmentData.created_by) {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        appointmentData.created_by = authData.session.user.id;
      }
    }
    
    const appointmentRecord = {
      title: appointmentData.title,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      status: appointmentData.status || 'scheduled',
      description: appointmentData.description,
      location: appointmentData.location,
      location_details: appointmentData.location_details,
      lead_id: appointmentData.lead_id,
      company_id: appointmentData.company_id,
      client_id: appointmentData.client_id,
      owner_id: appointmentData.owner_id,
      created_by: appointmentData.created_by,
      is_all_day: appointmentData.is_all_day,
      type: appointmentData.type,
      color: appointmentData.color,
      reminder_time: appointmentData.reminder_time,
      related_deal_id: appointmentData.related_deal_id,
      related_ticket_id: appointmentData.related_ticket_id,
      participants: appointmentData.participants,
    };

    console.log("Creating booking with data:", appointmentRecord);
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentRecord)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error creating booking:", error);
      toast.error("فشل في إنشاء الموعد");
      return null;
    }
    
    toast.success("تم إنشاء الموعد بنجاح");
    return data;
  } catch (error) {
    console.error("Error in createBooking:", error);
    toast.error("حدث خطأ أثناء إنشاء الموعد");
    return null;
  }
};

