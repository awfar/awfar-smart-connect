
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AccountSettings = () => {
  const handleSave = () => {
    toast.success("تم حفظ إعدادات الحساب");
  };

  const handleDeleteAccount = () => {
    toast.error("تم إرسال طلب حذف الحساب", {
      description: "سيتم التواصل معك قريباً للتأكيد"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">إعدادات الحساب</h3>
        <p className="text-sm text-muted-foreground">
          تحكم في إعدادات حسابك والتفضيلات العامة
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">اسم المستخدم</Label>
          <Input id="username" defaultValue="ahmed_m" />
          <p className="text-xs text-muted-foreground mt-1">
            عنوان URL الخاص بك: lovable.app/u/ahmed_m
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">اللغة</Label>
          <Select defaultValue="ar">
            <SelectTrigger id="language">
              <SelectValue placeholder="اختر اللغة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">المنطقة الزمنية</Label>
          <Select defaultValue="asia_riyadh">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="اختر المنطقة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asia_riyadh">(GMT+3) الرياض، المدينة المنورة، جدة</SelectItem>
              <SelectItem value="asia_dubai">(GMT+4) دبي، أبو ظبي، مسقط</SelectItem>
              <SelectItem value="africa_cairo">(GMT+2) القاهرة، عمّان</SelectItem>
              <SelectItem value="europe_london">(GMT+0) لندن، دبلن</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_notifications">الإشعارات عبر البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">تلقي إشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch id="email_notifications" defaultChecked />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing_emails">رسائل تسويقية</Label>
              <p className="text-sm text-muted-foreground">تلقي عروض وتحديثات حول المنتجات</p>
            </div>
            <Switch id="marketing_emails" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="social_mentions">تنبيهات الإشارة</Label>
              <p className="text-sm text-muted-foreground">تلقي إشعارات عند الإشارة إليك في تعليقات</p>
            </div>
            <Switch id="social_mentions" defaultChecked />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ الإعدادات</Button>
      </div>
      
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-destructive">حذف الحساب</h3>
        <p className="text-sm text-muted-foreground mt-2">
          سيؤدي حذف حسابك إلى إزالة جميع بياناتك بشكل دائم من أنظمتنا. هذا الإجراء لا يمكن التراجع عنه.
        </p>
        <div className="mt-4">
          <Button variant="destructive" onClick={handleDeleteAccount}>حذف الحساب</Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
