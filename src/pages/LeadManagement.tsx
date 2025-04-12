
import React, { useState } from 'react';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LeadFilters from "@/components/leads/LeadFilters";
import LeadDetails from "@/components/leads/LeadDetails";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadSearchBar from "@/components/leads/LeadSearchBar";
import LeadCardHeader from "@/components/leads/LeadCardHeader";
import LeadTable from "@/components/leads/LeadTable";

const LeadManagement = () => {
  const [selectedView, setSelectedView] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Mock data for leads
  const leads = [
    {
      id: "lead-001",
      name: "محمد سعيد",
      company: "شركة التقنية الحديثة",
      email: "m.saeed@tech-modern.com",
      phone: "+20 123 456 7890",
      country: "مصر",
      industry: "تكنولوجيا المعلومات",
      stage: "جديد",
      source: "نموذج موقع",
      owner: {
        name: "أحمد محمد",
        avatar: "/placeholder.svg",
        initials: "أم"
      },
      created_at: "2023-05-12"
    },
    {
      id: "lead-002",
      name: "ليلى حسن",
      company: "كافيه الأصدقاء",
      email: "laila@friends-cafe.com",
      phone: "+966 50 123 4567",
      country: "السعودية",
      industry: "مطاعم ومقاهي",
      stage: "مؤهل",
      source: "معرض",
      owner: {
        name: "سارة أحمد",
        avatar: "/placeholder.svg",
        initials: "سأ"
      },
      created_at: "2023-05-15"
    },
    {
      id: "lead-003",
      name: "خالد عبدالرحمن",
      company: "صيدليات الشفاء",
      email: "khalid@alshifa-pharm.com",
      phone: "+971 55 987 6543",
      country: "الإمارات",
      industry: "الرعاية الصحية",
      stage: "فرصة",
      source: "إحالة",
      owner: {
        name: "محمود عبد الله",
        avatar: "/placeholder.svg",
        initials: "مع"
      },
      created_at: "2023-05-18"
    },
    {
      id: "lead-004",
      name: "فاطمة علي",
      company: "متاجر الأناقة",
      email: "fatima@elegance-stores.com",
      phone: "+20 111 222 3333",
      country: "مصر",
      industry: "تجزئة",
      stage: "عرض سعر",
      source: "واتساب",
      owner: {
        name: "نورا سعيد",
        avatar: "/placeholder.svg",
        initials: "نس"
      },
      created_at: "2023-05-20"
    },
    {
      id: "lead-005",
      name: "عمر يوسف",
      company: "مطاعم الذواقة",
      email: "omar@gourmet-restaurants.com",
      phone: "+966 55 444 5555",
      country: "السعودية",
      industry: "مطاعم ومقاهي",
      stage: "تفاوض",
      source: "نموذج موقع",
      owner: {
        name: "خالد محمود",
        avatar: "/placeholder.svg",
        initials: "خم"
      },
      created_at: "2023-05-22"
    },
  ];

  const handleLeadClick = (leadId: string) => {
    setSelectedLead(leadId === selectedLead ? null : leadId);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRefresh = () => {
    // Placeholder for refresh functionality
    console.log("Refreshing leads data");
  };

  const handleAddLead = () => {
    // Placeholder for add lead functionality
    console.log("Adding new lead");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search functionality here
    console.log("Searching for:", term);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <LeadHeader 
              onToggleFilters={toggleFilters}
              onRefresh={handleRefresh}
              onAddLead={handleAddLead}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <Card>
                  <CardHeader className="pb-3">
                    <LeadCardHeader />
                    <div className="mt-4">
                      <LeadSearchBar 
                        selectedView={selectedView}
                        onViewChange={setSelectedView}
                        onSearch={handleSearch}
                      />
                    </div>
                  </CardHeader>
                  
                  {showFilters && <LeadFilters />}

                  <CardContent>
                    <LeadTable 
                      leads={leads} 
                      selectedLead={selectedLead}
                      onLeadSelect={handleLeadClick}
                    />
                  </CardContent>
                </Card>
              </div>

              {selectedLead && (
                <div className="w-[400px]">
                  <LeadDetails 
                    lead={leads.find(l => l.id === selectedLead)!} 
                    onClose={() => setSelectedLead(null)} 
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadManagement;
