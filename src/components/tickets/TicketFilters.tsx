
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TicketFiltersProps {
  onPriorityChange: (priority: string) => void;
  onCategoryChange: (category: string) => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({ 
  onPriorityChange,
  onCategoryChange
}) => {
  const [activePriority, setActivePriority] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const priorities = [
    { value: "all", label: "جميع الأولويات" },
    { value: "منخفض", label: "منخفض" },
    { value: "متوسط", label: "متوسط" },
    { value: "عالي", label: "عالي" },
    { value: "عاجل", label: "عاجل" }
  ];

  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "خدمة العملاء", label: "خدمة العملاء" },
    { value: "الدعم الفني", label: "الدعم الفني" },
    { value: "المبيعات", label: "المبيعات" },
    { value: "المالية", label: "المالية" },
    { value: "أخرى", label: "أخرى" }
  ];

  const handlePriorityChange = (priority: string) => {
    setActivePriority(priority);
    onPriorityChange(priority);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-start">
            <Filter className="ml-2 h-4 w-4" />
            <span>الأولوية: </span>
            <span className="font-medium mr-2">
              {priorities.find(p => p.value === activePriority)?.label}
            </span>
            <ChevronDown className="mr-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>تصفية حسب الأولوية</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                onClick={() => handlePriorityChange(priority.value)}
              >
                <div className="flex w-full items-center justify-between">
                  <span>{priority.label}</span>
                  {activePriority === priority.value && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-start">
            <Filter className="ml-2 h-4 w-4" />
            <span>الفئة: </span>
            <span className="font-medium mr-2">
              {categories.find(c => c.value === activeCategory)?.label}
            </span>
            <ChevronDown className="mr-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>تصفية حسب الفئة</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
              >
                <div className="flex w-full items-center justify-between">
                  <span>{category.label}</span>
                  {activeCategory === category.value && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TicketFilters;
