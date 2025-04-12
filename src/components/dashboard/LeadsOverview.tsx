
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, MoreHorizontal, Plus } from "lucide-react";
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

const LeadsOverview = () => {
  const [filter, setFilter] = useState("all");
  
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
  
  // Filter leads based on the current filter
  const filteredLeads = filter === "all" ? leads : leads.filter(lead => lead.status === filter);
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>فلترة</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <select
              className="px-3 py-2 border rounded-md text-sm"
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
          
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>إضافة عميل محتمل</span>
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الشركة</TableHead>
              <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
              <TableHead className="hidden md:table-cell">الهاتف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="hidden md:table-cell">الدولة</TableHead>
              <TableHead className="hidden md:table-cell">تاريخ الإضافة</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                <TableCell className="hidden md:table-cell">{lead.phone}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(lead.status)} variant="outline">
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{lead.country}</TableCell>
                <TableCell className="hidden md:table-cell">{lead.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
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
      </CardContent>
    </Card>
  );
};

export default LeadsOverview;
