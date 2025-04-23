
import { supabase } from "@/integrations/supabase/client";
import { AppointmentCreateInput } from "./types";
import { createAppointment } from "./appointmentsCrud";
import { toast } from "sonner";

export const createBookingFromPublic = async (bookingData: any) => {
  try {
    const { 
      user_id, 
      name, 
      email, 
      company, 
      title,
      start_time,
      end_time,
      notes,
      type = 'virtual',
      location = 'zoom'
    } = bookingData;

    let leadId = null;
    const { data: existingLeads, error: leadCheckError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (leadCheckError) {
      console.error("Error checking existing lead:", leadCheckError);
    } else if (existingLeads && existingLeads.length > 0) {
      leadId = existingLeads[0].id;
    } else {
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const { data: newLead, error: createLeadError } = await supabase
        .from('leads')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: company,
          source: 'booking_page',
          status: 'new'
        })
        .select()
        .single();

      if (createLeadError) {
        console.error("Error creating new lead:", createLeadError);
      } else {
        leadId = newLead.id;

        try {
          await supabase.rpc('log_activity', {
            p_entity_type: 'lead',
            p_entity_id: newLead.id,
            p_action: 'create',
            p_user_id: user_id,
            p_details: `Lead created via booking page: ${firstName} ${lastName}`
          });
        } catch (logError) {
          console.error("Error logging lead creation:", logError);
        }
      }
    }

    const appointmentData: AppointmentCreateInput = {
      title: title,
      description: `Appointment booked via public booking page by ${name} (${email})`,
      start_time: start_time,
      end_time: end_time,
      location: location,
      status: 'scheduled',
      lead_id: leadId,
      owner_id: user_id,
      notes: notes,
      type: type,
      created_by: user_id
    };

    const appointment = await createAppointment(appointmentData);

    try {
      await supabase.rpc('log_activity', {
        p_entity_type: 'appointment',
        p_entity_id: appointment.id,
        p_action: 'public_booking',
        p_user_id: user_id,
        p_details: `Appointment booked via public booking page by ${name} (${email})`
      });
    } catch (logError) {
      console.error("Error logging public booking:", logError);
    }

    return appointment;
  } catch (error) {
    console.error("Error creating booking from public:", error);
    return null;
  }
};
