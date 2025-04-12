
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const AppearanceSettings = () => {
  const handleSave = () => {
    toast.success("تم حفظ إعدادات المظهر");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">إعدادات المظهر</h3>
        <p className="text-sm text-muted-foreground">
          خصص مظهر التطبيق وتفضيلاتك البصرية
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">سمة التطبيق</h4>
          <RadioGroup defaultValue="light" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="theme-light" className="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                <div className="border-2 rounded-md p-4 hover:border-primary">
                  <div className="bg-white rounded-sm shadow-sm p-2 mb-2">
                    <div className="h-2 w-3/4 rounded bg-gray-200"></div>
                    <div className="mt-2 h-2 w-1/2 rounded bg-gray-100"></div>
                  </div>
                  <span className="block text-center">فاتح</span>
                </div>
              </Label>
            </div>
            <div>
              <Label htmlFor="theme-dark" className="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                <div className="border-2 rounded-md p-4 hover:border-primary">
                  <div className="bg-gray-800 rounded-sm shadow-sm p-2 mb-2">
                    <div className="h-2 w-3/4 rounded bg-gray-600"></div>
                    <div className="mt-2 h-2 w-1/2 rounded bg-gray-700"></div>
                  </div>
                  <span className="block text-center">داكن</span>
                </div>
              </Label>
            </div>
            <div>
              <Label htmlFor="theme-system" className="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                <div className="border-2 rounded-md p-4 hover:border-primary">
                  <div className="flex justify-between mb-2 gap-2">
                    <div className="bg-white rounded-sm shadow-sm p-1 w-1/2">
                      <div className="h-1.5 w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="bg-gray-800 rounded-sm shadow-sm p-1 w-1/2">
                      <div className="h-1.5 w-full rounded bg-gray-600"></div>
                    </div>
                  </div>
                  <span className="block text-center">تلقائي (حسب النظام)</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">اللون الرئيسي</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Button variant="outline" className="p-6 h-auto aspect-square border-2 hover:border-ring focus:border-ring border-primary bg-primary"></Button>
            <Button variant="outline" className="p-6 h-auto aspect-square border-2 hover:border-ring bg-blue-600"></Button>
            <Button variant="outline" className="p-6 h-auto aspect-square border-2 hover:border-ring bg-green-600"></Button>
            <Button variant="outline" className="p-6 h-auto aspect-square border-2 hover:border-ring bg-red-600"></Button>
            <Button variant="outline" className="p-6 h-auto aspect-square border-2 hover:border-ring bg-purple-600"></Button>
            <Button variant="outline" className="p-6 h-auto aspect-square border-2 hover:border-ring bg-orange-600"></Button>
          </div>
          <div className="mt-2 flex items-center">
            <Label htmlFor="custom-color" className="ml-2">لون مخصص:</Label>
            <Input id="custom-color" type="color" className="w-10 h-10 p-1" defaultValue="#8B5CF6" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">حجم الخط</h4>
          <Select defaultValue="medium">
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="اختر حجم الخط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">صغير</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="large">كبير</SelectItem>
              <SelectItem value="xl">كبير جداً</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animation">تأثيرات الحركة</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل تأثيرات الحركة والانتقالات السلسة
              </p>
            </div>
            <Switch id="animation" defaultChecked />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact_mode">الوضع المدمج</Label>
              <p className="text-sm text-muted-foreground">
                تقليل المسافات والهوامش لعرض محتوى أكثر
              </p>
            </div>
            <Switch id="compact_mode" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rtl_mode">دعم RTL</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل وضع الكتابة من اليمين إلى اليسار
              </p>
            </div>
            <Switch id="rtl_mode" defaultChecked />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ التغييرات</Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
