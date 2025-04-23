// Import the necessary modules
import React from 'react';
import { useLeadManagement } from '@/hooks/useLeadManagement';

// Define fallback functions for missing properties in the Lead type
const getLeadStage = (lead: any) => lead.stage || lead.status || 'new';

const getLeadOwner = (lead: any) => {
  if (lead.owner) return lead.owner;
  
  // Construct owner from profiles if available
  if (lead.profiles) {
    return {
      id: lead.assigned_to || '',
      first_name: lead.profiles?.first_name || '',
      last_name: lead.profiles?.last_name || '',
      name: `${lead.profiles?.first_name || ''} ${lead.profiles?.last_name || ''}`.trim() || 'Unassigned',
      avatar: lead.profiles?.avatar_url || '',
      initials: `${(lead.profiles?.first_name || '')[0] || ''}${(lead.profiles?.last_name || '')[0] || ''}`
    };
  }
  
  // Return default owner object if neither is available
  return {
    id: lead.assigned_to || '',
    name: 'Unassigned',
    initials: 'NA',
    avatar: ''
  };
};

// LeadManagement component
const LeadManagement = () => {
  const {
    selectedView,
    showFilters,
    selectedLead,
    leads,
    isLoading,
    isError,
    isAddLeadOpen,
    isEditLeadOpen,
    isDeleteDialogOpen,
    leadToEdit,
    leadToDelete,
    supabaseStatus,
    filters,
    searchTerm,
    setSelectedView,
    toggleFilters,
    handleRefresh,
    handleAddLead,
    handleSearch,
    handleFilterChange,
    handleLeadSuccess,
    handleLeadClick,
    handleEditLead,
    handleDeleteLead,
    confirmDeleteLead,
    setIsAddLeadOpen,
    setIsEditLeadOpen,
    setIsDeleteDialogOpen,
    getSelectedLeadObject,
    refetch
  } = useLeadManagement();

  // Use the helper functions in your render method
  const renderLeadRow = (lead: any) => {
    const stage = getLeadStage(lead);
    const owner = getLeadOwner(lead);
    
    return (
      <tr key={lead.id}>
        <td className="pl-4"><input type="checkbox" /></td>
        <td>
          <a href="#" onClick={() => handleLeadClick(lead.id)}>
            {lead.first_name} {lead.last_name}
          </a>
        </td>
        <td>{lead.email}</td>
        <td>{lead.company}</td>
        <td>{lead.country}</td>
        <td>{stage}</td>
        <td>
          <div className="flex items-center">
            <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
              {owner.initials || 'NA'}
            </span>
            <span>{owner.name || 'Unassigned'}</span>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إدارة العملاء المحتملين</h1>
        <div className="space-x-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddLead}>
            إضافة عميل محتمل
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={toggleFilters}>
            {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleRefresh}>
            تحديث
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 border rounded">
          {/* Add your filter components here */}
          <p>Filters will go here</p>
        </div>
      )}

      <input
        type="text"
        placeholder="بحث..."
        className="mb-4 p-2 border rounded w-full"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {isLoading ? (
        <p>Loading leads...</p>
      ) : isError ? (
        <p>Error fetching leads.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="pl-4"></th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الشركة</th>
                <th>الدولة</th>
                <th>المرحلة</th>
                <th>المالك</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(renderLeadRow)}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">إضافة عميل محتمل</h3>
            {/* Add your form here */}
            <div className="mt-2 text-right">
              <button className="px-4 py-2 bg-red-500 text-white rounded mr-2" onClick={() => setIsAddLeadOpen(false)}>
                إلغاء
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {isEditLeadOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">تعديل عميل محتمل</h3>
            {/* Add your form here */}
            <div className="mt-2 text-right">
              <button className="px-4 py-2 bg-red-500 text-white rounded mr-2" onClick={() => setIsEditLeadOpen(false)}>
                إلغاء
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف هذا العميل المحتمل؟</p>
            <div className="mt-2 text-right">
              <button className="px-4 py-2 bg-red-500 text-white rounded mr-2" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={confirmDeleteLead}>
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
