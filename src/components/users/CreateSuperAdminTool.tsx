
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createSuperAdmin } from "@/services/users/createAdmin";
import { toast } from "sonner";

const CreateSuperAdminTool = () => {
  const [firstName, setFirstName] = useState("lion");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("phplaith@gmail.com");
  const [password, setPassword] = useState("awfar1234@@@");
  const [loading, setLoading] = useState(false);

  const handleCreateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await createSuperAdmin(email, password, firstName, lastName);
      if (success) {
        toast.success("تم إنشاء مستخدم Super Admin بنجاح");
        
        // Leave form values as is to show what was submitted
        setLoading(false);
      } else {
        throw new Error("فشل في إنشاء المستخدم");
      }
    } catch (error: any) {
      console.error("خطأ في إنشاء مستخدم Super Admin:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء المستخدم");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>إنشاء مستخدم Super Admin</CardTitle>
        <CardDescription>
          قم بإنشاء مستخدم جديد بصلاحيات Super Admin
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCreateSuperAdmin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">الاسم الأول</Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">الاسم الأخير</Label>
            <Input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري الإنشاء..." : "إنشاء مستخدم Super Admin"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateSuperAdminTool;
