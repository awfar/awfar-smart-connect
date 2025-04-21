
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, RefreshCw, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lead } from '@/types/leads';
import { getLeads } from '@/services/leads';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStageColorClass } from '@/services/leads/utils';
import { format } from 'date-fns';
import { LeadForm } from '@/components/leads/LeadForm';

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    data: leads = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['leads', search],
    queryFn: () => getLeads(),
  });

  const filteredLeads = leads.filter(lead => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      lead.first_name?.toLowerCase().includes(searchLower) || 
      lead.last_name?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.company?.toLowerCase().includes(searchLower) ||
      lead.phone?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    if (error) {
      toast.error('فشل في تحميل بيانات العملاء المحتملين');
    }
  }, [error]);

  const handleViewLead = (id: string) => {
    navigate(`/dashboard/leads/${id}`);
  };

  const handleAddLeadSuccess = () => {
    setIsAddLeadOpen(false);
    refetch();
    toast.success('تم إضافة العميل المحتمل بنجاح');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">إدارة العملاء المحتملين</h1>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في العملاء..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="ml-1 h-4 w-4" />
            تصفية
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="ml-1 h-4 w-4" />
            تحديث
          </Button>
          <Button onClick={() => setIsAddLeadOpen(true)}>
            <Plus className="ml-1 h-4 w-4" />
            إضافة عميل
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted/40 p-4 rounded-lg mb-6">
          <h2 className="font-medium mb-2">خيارات التصفية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter options will go here */}
            <div className="text-center text-muted-foreground">
              سيتم إضافة خيارات تصفية قريباً
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">الاسم</TableHead>
                <TableHead>الشركة</TableHead>
                <TableHead>المنصب</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المسؤول</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || "بدون اسم";
                  const createdDate = lead.created_at ? format(new Date(lead.created_at), 'yyyy/MM/dd') : '';
                  
                  return (
                    <TableRow key={lead.id} className="cursor-pointer" onClick={() => handleViewLead(lead.id)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{fullName.charAt(0) || "؟"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{fullName}</p>
                            <p className="text-xs text-muted-foreground">{createdDate}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.company || "-"}</TableCell>
                      <TableCell>{lead.position || "-"}</TableCell>
                      <TableCell>{lead.email || "-"}</TableCell>
                      <TableCell>{lead.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStageColorClass(lead.status || 'جديد')}>
                          {lead.status || 'جديد'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.owner?.name ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>{lead.owner.initials || "؟"}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{lead.owner.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">غير مخصص</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLead(lead.id);
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    لا توجد نتائج.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إضافة عميل محتمل جديد</DialogTitle>
          </DialogHeader>
          <LeadForm onSuccess={handleAddLeadSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;
