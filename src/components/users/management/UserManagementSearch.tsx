
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface UserManagementSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const UserManagementSearch = ({ 
  searchTerm, 
  onSearch, 
  showFilters, 
  onToggleFilters 
}: UserManagementSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <TabsList className="mb-4 md:mb-0">
        <TabsTrigger value="all">جميع المستخدمين</TabsTrigger>
        <TabsTrigger value="active">المستخدمين النشطين</TabsTrigger>
        <TabsTrigger value="inactive">المستخدمين غير النشطين</TabsTrigger>
      </TabsList>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="بحث عن مستخدم..."
            className="w-full md:w-80 pr-10"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4" />
          <span>فلترة</span>
        </Button>
      </div>
    </div>
  );
};

export default UserManagementSearch;
