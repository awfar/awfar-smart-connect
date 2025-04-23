
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EntityOption = { value: string; label: string };

interface Props {
  leadId: string;
  companyId: string;
  dealId: string;
  appointmentId: string;
  leads: EntityOption[];
  companies: EntityOption[];
  deals: EntityOption[];
  appointments: EntityOption[];
  setLeadId: (v: string) => void;
  setCompanyId: (v: string) => void;
  setDealId: (v: string) => void;
  setAppointmentId: (v: string) => void;
}

const TaskAssociationSection: React.FC<Props> = ({
  leadId, companyId, dealId, appointmentId,
  leads, companies, deals, appointments,
  setLeadId, setCompanyId, setDealId, setAppointmentId
}) => (
  <div>
    <label className="text-sm font-medium">الجهة المرتبطة (اختياري)</label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <Select
        value={leadId}
        onValueChange={setLeadId}
      >
        <SelectTrigger>
          <SelectValue placeholder="ربط عميل" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="no-lead" value="none">بدون</SelectItem>
          {leads.map(l => (
            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={companyId}
        onValueChange={setCompanyId}
      >
        <SelectTrigger>
          <SelectValue placeholder="ربط شركة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="no-company" value="none">بدون</SelectItem>
          {companies.map(c => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={dealId}
        onValueChange={setDealId}
      >
        <SelectTrigger>
          <SelectValue placeholder="ربط صفقة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="no-deal" value="none">بدون</SelectItem>
          {deals.map(d => (
            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={appointmentId}
        onValueChange={setAppointmentId}
      >
        <SelectTrigger>
          <SelectValue placeholder="ربط موعد" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="no-appointment" value="none">بدون</SelectItem>
          {appointments.map(a => (
            <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default TaskAssociationSection;
