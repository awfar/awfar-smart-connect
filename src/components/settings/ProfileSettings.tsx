
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: "أحمد",
    lastName: "محمد",
    email: "ahmed@example.com",
    phone: "+966 12 345 6789",
    company: "شركة أوفار للتقنية",
    position: "مدير المبيعات",
    department: "sales",
    bio: "مدير مبيعات ذو خبرة واسعة في مجال التكنولوجيا والحلول الرقمية. أعمل على تطوير استراتيجيات المبيعات وبناء علاقات طويلة الأمد مع العملاء."
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("تم حفظ التغييرات بنجاح");
    }, 1000);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB
    
    if (fileSize > 1) {
      toast.error("حجم الملف يجب أن يكون أقل من 1 ميجابايت");
      return;
    }
    
    setUploading(true);
    
    try {
      // You would upload this to storage in a real implementation
      // For now, create an object URL as a demonstration
      const fileUrl = URL.createObjectURL(file);
      setAvatarUrl(fileUrl);
      toast.success("تم تحديث الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("فشل في تحميل الصورة");
    } finally {
      setUploading(false);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success("تم إزالة الصورة بنجاح");
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
        <Avatar className="h-20 w-20 cursor-pointer relative" onClick={handleAvatarClick}>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
          <AvatarImage src={avatarUrl || "/placeholder.svg"} />
          <AvatarFallback>أم</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAvatarClick}>
              تغيير الصورة
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive" 
              onClick={handleRemoveAvatar}
              disabled={!avatarUrl}
            >
              إزالة
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            JPG أو PNG. الحد الأقصى 1 ميجابايت.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">الاسم الأخير</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company">الشركة</Label>
          <Input 
            id="company" 
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">المنصب</Label>
          <Input 
            id="position" 
            value={formData.position}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">القسم</Label>
          <Select 
            value={formData.department}
            onValueChange={(value) => handleSelectChange("department", value)}
          >
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
          <Textarea 
            id="bio" 
            rows={4} 
            value={formData.bio}
            onChange={handleChange}
          />
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
