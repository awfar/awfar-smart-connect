
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { getSalesTeamMembers } from "@/services/deals/dealQueries";
import { DateRange } from "react-day-picker";

interface DealFiltersProps {
  onStageChange: (stage: string) => void;
  onStatusChange: (status: string) => void;
  onOwnerChange: (ownerId: string) => void;
  onValueChange: (value: string) => void;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (range: { fromDate?: string; toDate?: string }) => void;
  onResetFilters: () => void;
}

const DealFilters = ({ 
  onStageChange, 
  onStatusChange,
  onOwnerChange,
  onValueChange,
  onSearchChange,
  onDateRangeChange,
  onResetFilters 
}: DealFiltersProps) => {
  const [search, setSearch] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [owners, setOwners] = useState<{id: string; name: string}[]>([]);
  
  // Fetch sales team members to use as owners filter
  useEffect(() => {
    const fetchOwners = async () => {
      const members = await getSalesTeamMembers();
      setOwners(members.map((member: any) => ({
        id: member.id,
        name: `${member.first_name || ''} ${member.last_name || ''}`.trim()
      })));
    };
    
    fetchOwners();
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    // Format dates for API request
    const fromDate = range?.from ? format(range.from, 'yyyy-MM-dd') : undefined;
    const toDate = range?.to ? format(range.to, 'yyyy-MM-dd') : undefined;
    
    onDateRangeChange({ fromDate, toDate });
  };
  
  const handleResetFilters = () => {
    setSearch('');
    setDateRange(undefined);
    onResetFilters();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث في الصفقات..."
            className="pl-4 pr-10"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={isFilterExpanded ? "default" : "outline"} 
            size="icon"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          {(search || isFilterExpanded || dateRange?.from) && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleResetFilters}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {isFilterExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/10">
          <div>
            <Label htmlFor="stage-filter" className="text-sm block mb-2">المرحلة</Label>
            <Select onValueChange={onStageChange} defaultValue="all">
              <SelectTrigger className="w-full" id="stage-filter">
                <SelectValue placeholder="جميع المراحل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المراحل</SelectItem>
                <SelectItem value="discovery">مرحلة الاكتشاف</SelectItem>
                <SelectItem value="proposal">تقديم العرض</SelectItem>
                <SelectItem value="negotiation">التفاوض</SelectItem>
                <SelectItem value="closed_won">مربوح</SelectItem>
                <SelectItem value="closed_lost">خسارة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status-filter" className="text-sm block mb-2">الحالة</Label>
            <Select onValueChange={onStatusChange} defaultValue="all">
              <SelectTrigger className="w-full" id="status-filter">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="won">مربوح</SelectItem>
                <SelectItem value="lost">خسارة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="owner-filter" className="text-sm block mb-2">المسؤول</Label>
            <Select onValueChange={onOwnerChange} defaultValue="all">
              <SelectTrigger className="w-full" id="owner-filter">
                <SelectValue placeholder="جميع المسؤولين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المسؤولين</SelectItem>
                {owners.map(owner => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name || owner.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="value-filter" className="text-sm block mb-2">قيمة الصفقة</Label>
            <Select onValueChange={onValueChange} defaultValue="all">
              <SelectTrigger className="w-full" id="value-filter">
                <SelectValue placeholder="جميع القيم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع القيم</SelectItem>
                <SelectItem value="low">أقل من 10,000 ريال</SelectItem>
                <SelectItem value="medium">10,000 - 50,000 ريال</SelectItem>
                <SelectItem value="high">أكثر من 50,000 ريال</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm block mb-2">تاريخ الإغلاق المتوقع</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant="outline"
                  className="w-full justify-start text-right"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "d MMM", { locale: ar })} - {format(dateRange.to, "d MMM", { locale: ar })}
                      </>
                    ) : (
                      format(dateRange.from, "d MMMM yyyy", { locale: ar })
                    )
                  ) : (
                    <span>اختر الفترة</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  locale={ar}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealFilters;
