
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const SecuritySettings = () => {
  const handleChangePassword = () => {
    toast.success("تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني");
  };

  const handleEnableTwoFactor = () => {
    toast.success("تم تفعيل المصادقة الثنائية");
  };

  const handleRevokeSession = (id: string) => {
    toast.success("تم إنهاء الجلسة");
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">إعدادات الأمان</h3>
        <p className="text-sm text-muted-foreground">
          تحكم في إعدادات الأمان وحماية حسابك
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">تغيير كلمة المرور</h4>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">كلمة المرور الحالية</Label>
            <Input id="current_password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">كلمة المرور الجديدة</Label>
            <Input id="new_password" type="password" />
            <p className="text-xs text-muted-foreground mt-1">
              يجب أن تحتوي على 8 أحرف على الأقل، وحرف كبير، وحرف صغير، ورقم، ورمز خاص.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">تأكيد كلمة المرور الجديدة</Label>
            <Input id="confirm_password" type="password" />
          </div>
          <div>
            <Button onClick={handleChangePassword}>تغيير كلمة المرور</Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium">المصادقة الثنائية</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two_factor">تفعيل المصادقة الثنائية</Label>
              <p className="text-sm text-muted-foreground">
                تعزيز أمان حسابك باستخدام المصادقة الثنائية.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="two_factor" />
              <Button variant="outline" onClick={handleEnableTwoFactor}>
                إعداد
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium">جلسات تسجيل الدخول النشطة</h4>
        <Table>
          <TableCaption>قائمة الأجهزة التي قمت بتسجيل الدخول منها</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>الجهاز</TableHead>
              <TableHead>الموقع</TableHead>
              <TableHead>آخر نشاط</TableHead>
              <TableHead>إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span>Chrome على Windows</span>
                  <span className="text-xs text-muted-foreground">هذا الجهاز</span>
                </div>
              </TableCell>
              <TableCell>الرياض، المملكة العربية السعودية</TableCell>
              <TableCell>الآن</TableCell>
              <TableCell>
                <Button variant="ghost" disabled>إنهاء</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Safari على iPhone</TableCell>
              <TableCell>الرياض، المملكة العربية السعودية</TableCell>
              <TableCell>منذ 2 ساعة</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleRevokeSession("device-2")}>إنهاء</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Firefox على macOS</TableCell>
              <TableCell>دبي، الإمارات العربية المتحدة</TableCell>
              <TableCell>منذ يومين</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleRevokeSession("device-3")}>إنهاء</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-medium">سجل النشاط</h4>
        <Button variant="outline">عرض سجل النشاط الأمني</Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
