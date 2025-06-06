import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, CreditCard, LayoutDashboard, PiggyBank, Users, CalendarIcon, ChevronDown, MoreHorizontal } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ActivityTimeline } from '@/components/reports/ActivityTimeline';
import { LeadSourcesChart } from '@/components/reports/LeadSourcesChart';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface SalesData {
  name: string;
  value: number;
}

interface IndustrySalesData {
  industry: string;
  sales: number;
}

interface LeadsGrowthData {
  date: string;
  count: number;
}

const data = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    position: "Software Engineer",
    company: "Tech Corp",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    position: "Marketing Manager",
    company: "Global Solutions",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-123-4567",
    position: "Sales Representative",
    company: "SalesForce Inc.",
  },
  {
    name: "Bob Williams",
    email: "bob.williams@example.com",
    phone: "111-222-3333",
    position: "Project Manager",
    company: "ProjectPro Ltd.",
  },
  {
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "444-555-6666",
    position: "Data Analyst",
    company: "Data Insights Corp",
  },
]

const salesComparisonData: SalesData[] = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
  { name: 'Jul', value: 4300 },
];

const leadSourcesData: SalesData[] = [
  { name: 'Organic', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Social', value: 200 },
  { name: 'Direct', value: 100 },
];

const productsPerformanceData: SalesData[] = [
  { name: 'Product A', value: 1200 },
  { name: 'Product B', value: 800 },
  { name: 'Product C', value: 600 },
  { name: 'Product D', value: 400 },
];

const teamPerformanceData = [
  { name: 'Team A', sales: 2400, leads: 120 },
  { name: 'Team B', sales: 1398, leads: 80 },
  { name: 'Team C', sales: 9800, leads: 200 },
  { name: 'Team D', sales: 3908, leads: 90 },
];

const recentActivitiesData = [
  {
    id: '1',
    time: '9:00 AM',
    subject: 'Meeting with John Doe',
    description: 'Discuss project requirements',
    type: 'meeting',
    user: { name: 'John Doe', initials: 'JD' },
    timestamp: '2023-04-10T09:00:00',
    entity: { name: 'Tech Corp' },
    result: 'Successful'
  },
  {
    id: '2',
    time: '10:00 AM',
    subject: 'Call with Jane Smith',
    description: 'Follow up on proposal',
    type: 'call',
    user: { name: 'Jane Smith', initials: 'JS' },
    timestamp: '2023-04-10T10:00:00',
    entity: { name: 'Global Solutions' },
    result: 'Pending'
  },
  {
    id: '3',
    time: '11:00 AM',
    subject: 'Email to Bob Williams',
    description: 'Send project update',
    type: 'email',
    user: { name: 'Bob Williams', initials: 'BW' },
    timestamp: '2023-04-10T11:00:00',
    entity: { name: 'ProjectPro Ltd.' },
    result: 'Sent'
  },
  {
    id: '4',
    time: '12:00 PM',
    subject: 'Lunch Break',
    description: 'Take a break and recharge',
    type: 'break',
    user: { name: 'Emily Brown', initials: 'EB' },
    timestamp: '2023-04-10T12:00:00',
    entity: null,
    result: null
  },
  {
    id: '5',
    time: '1:00 PM',
    subject: 'Meeting with Emily Brown',
    description: 'Review data analysis results',
    type: 'meeting',
    user: { name: 'Emily Brown', initials: 'EB' },
    timestamp: '2023-04-10T13:00:00',
    entity: { name: 'Data Insights Corp' },
    result: 'Successful'
  },
];

const industrySalesData: IndustrySalesData[] = [
  { industry: 'Technology', sales: 5000 },
  { industry: 'Healthcare', sales: 3000 },
  { industry: 'Finance', sales: 4000 },
  { industry: 'Education', sales: 2000 },
];

const leadsGrowthData: LeadsGrowthData[] = [
  { date: 'Jan', count: 120 },
  { date: 'Feb', count: 80 },
  { date: 'Mar', count: 200 },
  { date: 'Apr', count: 90 },
];

const salesByIndustry: SalesData[] = industrySalesData.map(item => ({
  name: item.industry,
  value: item.sales,
}));

const leadsGrowth: SalesData[] = leadsGrowthData.map(item => ({
  name: item.date,
  value: item.count,
}));

const SalesComparisonChart = ({ data, isLoading }: { data: SalesData[], isLoading: boolean }) => {
  if (isLoading) return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="المبيعات" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ProductsPerformanceChart = ({ data, isLoading }: { data: SalesData[], isLoading: boolean }) => {
  if (isLoading) return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" name="المبيعات" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TeamPerformanceReport = ({ data, isLoading }: { data: any[], isLoading: boolean }) => {
  if (isLoading) return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" name="المبيعات" />
        <Bar dataKey="leads" fill="#82ca9d" name="العملاء المتوقعين" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ReportsManagement: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data))
    toast({
      title: "تم النسخ!",
      description: "تم نسخ بيانات المستخدم إلى الحافظة.",
    })
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">نظرة عامة على التقارير</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>اختر تاريخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231.89 ر.س</div>
              <p className="text-xs text-gray-500">+20.1% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">اشتراكات هذا الشهر</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-gray-500">+180.1% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3224 ر.س</div>
              <p className="text-xs text-gray-500">+19% من الشهر الماضي</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-8">
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle>المبيعات حسب الصناعة</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={salesByIndustry}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {salesByIndustry.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle>نمو العملاء المتوقعين</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={leadsGrowth} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 mt-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>مقارنة المبيعات</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesComparisonChart data={salesComparisonData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>مصادر العملاء المتوقعين</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadSourcesChart data={leadSourcesData} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>أداء المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductsPerformanceChart data={productsPerformanceData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 mt-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>تقرير أداء الفريق</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamPerformanceReport data={teamPerformanceData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 mt-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>الجدول الزمني للنشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline data={recentActivitiesData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsManagement;
