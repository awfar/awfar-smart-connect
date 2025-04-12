
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

interface TaskFiltersProps {
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  onStatusChange,
  onPriorityChange 
}) => {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [activePriority, setActivePriority] = useState<string>("all");

  const statuses = [
    { value: "all", label: "جميع الحالات" },
    { value: "مكتمل", label: "مكتمل" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: "معلق", label: "معلق" },
    { value: "ملغي", label: "ملغي" }
  ];

  const priorities = [
    { value: "all", label: "جميع الأولويات" },
    { value: "منخفض", label: "منخفض" },
    { value: "متوسط", label: "متوسط" },
    { value: "عالي", label: "عالي" },
    { value: "عاجل", label: "عاجل" }
  ];

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    onStatusChange(status);
  };

  const handlePriorityChange = (priority: string) => {
    setActivePriority(priority);
    onPriorityChange(priority);
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-start">
            <Filter className="ml-2 h-4 w-4" />
            <span>الحالة: </span>
            <span className="font-medium mr-2">
              {statuses.find(s => s.value === activeStatus)?.label}
            </span>
            <ChevronDown className="mr-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
              >
                <div className="flex w-full items-center justify-between">
                  <span>{status.label}</span>
                  {activeStatus === status.value && <Check className="h-4 w-4" />}
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
    </div>
  );
};

export default TaskFilters;
