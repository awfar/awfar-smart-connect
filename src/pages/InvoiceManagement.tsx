
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getInvoices, Invoice } from '@/services/catalogService';
import {
  Calendar as CalendarIcon,
  FileText,
  Plus,
  Filter,
  Search,
  Eye,
  Download,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors: Record<Invoice['status'], { color: string, icon: React.ReactNode, label: string }> = {
  'draft': { color: 'bg-gray-200 text-gray-800', icon: <Clock className="h-4 w-4" />, label: 'مسودة' },
  'sent': { color: 'bg-blue-100 text-blue-800', icon: <FileText className="h-4 w-4" />, label: 'مرسلة' },
  'paid': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" />, label: 'مدفوعة' },
  'overdue': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4" />, label: 'متأخرة' },
  'cancelled': { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="h-4 w-4" />, label: 'ملغاة' },
};

const InvoiceManagement: React.FC = () => {
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           invoice.id.includes(searchTerm);
    const matchesStatus = activeTab === 'all' || invoice.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة الفواتير</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إنشاء فاتورة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">إجمالي الفواتير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 فواتير</div>
              <div className="text-sm text-green-600 mt-1">2 فواتير جديدة هذا الشهر</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">إجمالي المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,500 ر.س</div>
              <div className="text-sm text-green-600 mt-1">+15% مقارنة بالشهر السابق</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">المستحقات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,350 ر.س</div>
              <div className="text-sm text-red-600 mt-1">3 فواتير متأخرة</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="البحث عن فاتورة..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ar }) : 'اختر تاريخ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto">
                <Calendar
                  locale={ar}
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              فلترة
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">الجميع</TabsTrigger>
            <TabsTrigger value="draft">مسودة</TabsTrigger>
            <TabsTrigger value="sent">مرسلة</TabsTrigger>
            <TabsTrigger value="paid">مدفوعة</TabsTrigger>
            <TabsTrigger value="overdue">متأخرة</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]"># الفاتورة</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">تاريخ الإصدار</TableHead>
                      <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right w-[100px]">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          لا توجد فواتير متطابقة مع معايير البحث
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">#{invoice.id}</TableCell>
                          <TableCell>{invoice.customerName}</TableCell>
                          <TableCell className="text-right">{invoice.totalAmount} ر.س</TableCell>
                          <TableCell className="text-right">{format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</TableCell>
                          <TableCell className="text-right">{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              className={`gap-1 ${statusColors[invoice.status].color}`}
                              variant="outline"
                            >
                              {statusColors[invoice.status].icon}
                              {statusColors[invoice.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">فتح القائمة</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" /> عرض
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Download className="h-4 w-4" /> تحميل
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <ArrowUpDown className="h-4 w-4" /> تغيير الحالة
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceManagement;
