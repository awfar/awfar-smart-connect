import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const LeadsOverview = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "مؤهل":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "قيد التفاوض":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "مغلق - ناجح":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "مغلق - خسارة":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  const leads = [
    {
      id: "1",
      name: "محمد عبد الله",
      company: "شركة التقنية الحديثة",
      email: "m.abdullah@techcompany.sa",
      phone: "+966 50 123 4567",
      status: "جديد",
      country: "السعودية",
      date: "2023-04-10",
    },
    {
      id: "2",
      name: "سارة أحمد",
      company: "مؤسسة الأفكار",
      email: "sara@ideas.ae",
      phone: "+971 55 987 6543",
      status: "مؤهل",
      country: "الإمارات",
      date: "2023-04-09",
    },
    {
      id: "3",
      name: "خالد محمود",
      company: "مجموعة المستقبل",
      email: "khalid@future-group.eg",
      phone: "+20 100 456 7890",
      status: "قيد التفاوض",
      country: "مصر",
      date: "2023-04-08",
    },
    {
      id: "4",
      name: "نورا سعيد",
      company: "شركة الابتكار",
      email: "noura@innovation.sa",
      phone: "+966 55 432 1098",
      status: "مغلق - ناجح",
      country: "السعودية",
      date: "2023-04-07",
    },
    {
      id: "5",
      name: "أحمد علي",
      company: "مؤسسة التطوير",
      email: "ahmed@development.ae",
      phone: "+971 50 765 4321",
      status: "مغلق - خسارة",
      country: "الإمارات",
      date: "2023-04-06",
    },
  ];
  
  const filteredLeads = leads
    .filter(lead => filter === "all" || lead.status === filter)
    .filter(lead => 
      searchQuery === "" || 
      lead.name.includes(searchQuery) || 
      lead.company.includes(searchQuery) || 
      lead.email.includes(searchQuery)
    );
  
  return (
    <Card className="shadow-md overflow-hidden border border-gray-100">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b gap-3 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[220px] pr-9 border-gray-200 focus:border-awfar-primary"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button variant="outline" className="flex items-center gap-1 border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>فلترة</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <select
                className="px-3 py-2 border rounded-md text-sm border-gray-200 focus:border-awfar-primary focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="جديد">جديد</option>
                <option value="مؤهل">مؤهل</option>
                <option value="قيد التفاوض">قيد التفاوض</option>
                <option value="مغلق - ناجح">مغلق - ناجح</option>
                <option value="مغلق - خسارة">مغلق - خسارة</option>
              </select>
            </div>
          </div>
          
          <Button className="flex items-center gap-1 whitespace-nowrap bg-awfar-primary hover:bg-awfar-primary/90">
            <Plus className="h-4 w-4" />
            <span>إضافة عميل محتمل</span>
          </Button>
        </div>
        
        {isMobile ? (
          <div className="p-4 space-y-4 bg-gray-50">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-awfar-primary">{lead.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/leads/${lead.id}`}>عرض التفاصيل</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>تعديل</DropdownMenuItem>
                        <DropdownMenuItem>إضافة نشاط</DropdownMenuItem>
                        <DropdownMenuItem>تغيير الحالة</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">{lead.company}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getStatusBadgeColor(lead.status)} variant="outline">
                      {lead.status}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">{lead.country}</Badge>
                  </div>
                  <div className="text-sm mt-3 border-t pt-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span className="text-xs">{lead.email}</span>
                      <span className="text-xs font-medium">{lead.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium">الاسم</TableHead>
                <TableHead className="font-medium">الشركة</TableHead>
                <TableHead className="hidden md:table-cell font-medium">البريد الإلكتروني</TableHead>
                <TableHead className="hidden md:table-cell font-medium">الهاتف</TableHead>
                <TableHead className="font-medium">الحالة</TableHead>
                <TableHead className="hidden md:table-cell font-medium">الدولة</TableHead>
                <TableHead className="hidden md:table-cell font-medium">تاريخ الإضافة</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-awfar-primary">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{lead.phone}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(lead.status)} variant="outline">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{lead.country}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{lead.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/leads/${lead.id}`}>عرض التفاصيل</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>تعديل</DropdownMenuItem>
                        <DropdownMenuItem>إضافة نشاط</DropdownMenuItem>
                        <DropdownMenuItem>تغيير الحالة</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-12 bg-gray-50">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد نتائج</h3>
            <p className="text-sm text-gray-500">لا توجد نتائج تطابق معايير البحث</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsOverview;
