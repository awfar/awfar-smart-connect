
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DealFiltersProps {
  onStageChange: (stage: string) => void;
  onValueChange: (value: string) => void;
}

const DealFilters: React.FC<DealFiltersProps> = ({ onStageChange, onValueChange }) => {
  const handleStageChange = (value: string) => {
    onStageChange(value);
  };

  const handleValueChange = (value: string) => {
    onValueChange(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div>
        <Label htmlFor="stage-filter" className="text-sm block mb-2">مرحلة الصفقة</Label>
        <Select onValueChange={handleStageChange} defaultValue="all">
          <SelectTrigger className="w-[180px]" id="stage-filter">
            <SelectValue placeholder="جميع المراحل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المراحل</SelectItem>
            <SelectItem value="qualified">مؤهل</SelectItem>
            <SelectItem value="proposal">تم تقديم عرض</SelectItem>
            <SelectItem value="negotiation">تفاوض</SelectItem>
            <SelectItem value="closed_won">مغلق (مربوح)</SelectItem>
            <SelectItem value="closed_lost">مغلق (خسارة)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="value-filter" className="text-sm block mb-2">قيمة الصفقة</Label>
        <Select onValueChange={handleValueChange} defaultValue="all">
          <SelectTrigger className="w-[180px]" id="value-filter">
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
    </div>
  );
};

export default DealFilters;
