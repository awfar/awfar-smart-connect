
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSuperAdmin } from "@/services/usersService";
import { Loader2 } from "lucide-react";

const CreateSuperAdminTool = () => {
  const [email, setEmail] = useState("a.galal@awfar.com");
  const [password, setPassword] = useState("admin");
  const [firstName, setFirstName] = useState("أحمد");
  const [lastName, setLastName] = useState("جلال");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await createSuperAdmin(email, password, firstName, lastName);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">إنشاء مستخدم مسؤول (سوبر أدمن)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateSuperAdmin} className="space-y-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="firstName">الاسم الأول</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">الاسم الأخير</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              "إنشاء المستخدم المسؤول"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateSuperAdminTool;
