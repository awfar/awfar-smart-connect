
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم حفظ التغييرات بنجاح");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">المعلومات الشخصية</h3>
        <p className="text-sm text-muted-foreground">
          قم بتحديث معلومات ملفك الشخصي وكيفية مشاركتها معنا
        </p>
      </div>
      
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>أم</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">تغيير الصورة</Button>
            <Button variant="outline" size="sm" className="text-destructive">إزالة</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG أو PNG. الحد الأقصى 1 ميجابايت.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input id="firstName" defaultValue="أحمد" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">الاسم الأخير</Label>
          <Input id="lastName" defaultValue="محمد" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" defaultValue="ahmed@example.com" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input id="phone" type="tel" defaultValue="+966 12 345 6789" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company">الشركة</Label>
          <Input id="company" defaultValue="شركة أوفار للتقنية" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">المنصب</Label>
          <Input id="position" defaultValue="مدير المبيعات" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">القسم</Label>
          <Select defaultValue="sales">
            <SelectTrigger id="department">
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">المبيعات</SelectItem>
              <SelectItem value="marketing">التسويق</SelectItem>
              <SelectItem value="engineering">الهندسة</SelectItem>
              <SelectItem value="support">الدعم الفني</SelectItem>
              <SelectItem value="hr">الموارد البشرية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">نبذة تعريفية</Label>
          <Textarea id="bio" rows={4} defaultValue="مدير مبيعات ذو خبرة واسعة في مجال التكنولوجيا والحلول الرقمية. أعمل على تطوير استراتيجيات المبيعات وبناء علاقات طويلة الأمد مع العملاء." />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
