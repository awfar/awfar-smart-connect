
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const NotificationSettings = () => {
  const handleSave = () => {
    toast.success("تم حفظ إعدادات الإشعارات");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">إعدادات الإشعارات</h3>
        <p className="text-sm text-muted-foreground">
          تحكم في كيفية وتوقيت تلقي الإشعارات
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="font-medium">العملاء والعملاء المحتملين</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new_lead">عميل محتمل جديد</Label>
                <p className="text-sm text-muted-foreground">تنبيه عند تسجيل عميل محتمل جديد</p>
              </div>
              <Switch id="new_lead" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lead_assigned">تعيين عميل محتمل</Label>
                <p className="text-sm text-muted-foreground">تنبيه عند تعيين عميل محتمل لك</p>
              </div>
              <Switch id="lead_assigned" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lead_status_change">تغيير حالة العميل المحتمل</Label>
                <p className="text-sm text-muted-foreground">تنبيه عند تغيير حالة العميل المحتمل</p>
              </div>
              <Switch id="lead_status_change" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">المواعيد والمهام</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task_reminder">تذكير بالمهام</Label>
                <p className="text-sm text-muted-foreground">تنبيه قبل موعد استحقاق المهام</p>
              </div>
              <Switch id="task_reminder" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="appointment_reminder">تذكير بالمواعيد</Label>
                <p className="text-sm text-muted-foreground">تنبيه قبل المواعيد المجدولة</p>
              </div>
              <Switch id="appointment_reminder" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reminder_time">وقت التذكير</Label>
            <RadioGroup id="reminder_time" defaultValue="30_min">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="15_min" id="r1" />
                <Label htmlFor="r1">قبل 15 دقيقة</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="30_min" id="r2" />
                <Label htmlFor="r2">قبل 30 دقيقة</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="1_hour" id="r3" />
                <Label htmlFor="r3">قبل ساعة</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="1_day" id="r4" />
                <Label htmlFor="r4">قبل يوم</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">التذاكر والدعم الفني</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new_ticket">تذكرة جديدة</Label>
                <p className="text-sm text-muted-foreground">تنبيه عند إنشاء تذكرة جديدة</p>
              </div>
              <Switch id="new_ticket" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ticket_update">تحديث التذاكر</Label>
                <p className="text-sm text-muted-foreground">تنبيه عند وجود تحديث على التذاكر</p>
              </div>
              <Switch id="ticket_update" defaultChecked />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ticket_resolved">حل التذاكر</Label>
                <p className="text-sm text-muted-foreground">تنبيه عند حل تذكرة</p>
              </div>
              <Switch id="ticket_resolved" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ الإعدادات</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
