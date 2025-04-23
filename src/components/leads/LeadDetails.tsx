
import React from 'react';
import { Lead } from "@/services/leads";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onRefresh: () => void;
  onViewFullProfile?: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ 
  lead, 
  onClose, 
  onEdit,
  onDelete,
  onRefresh,
  onViewFullProfile
}) => {
  return (
    <div className="p-4">
      {/* Lead details content */}
      <div>
        <h3 className="text-lg font-medium">{lead.first_name} {lead.last_name}</h3>
        <div className="text-sm text-gray-500 mt-1">{lead.email}</div>
        {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
        {lead.company && <div className="text-sm text-gray-500 mt-1">الشركة: {lead.company}</div>}
        {lead.position && <div className="text-sm text-gray-500">المنصب: {lead.position}</div>}
        {lead.status && <div className="text-sm text-gray-500 mt-1">الحالة: {lead.status}</div>}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col space-y-2">
        <button
          className="text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => onEdit(lead)}
        >
          تحرير البيانات
        </button>
        <button
          className="text-red-600 hover:text-red-800 text-sm"
          onClick={() => onDelete(lead.id)}
        >
          حذف
        </button>
        {onViewFullProfile && (
          <button
            className="text-green-600 hover:text-green-800 text-sm"
            onClick={onViewFullProfile}
          >
            عرض الصفحة الكاملة
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadDetails;
