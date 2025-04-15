
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailForConfirmation, setEmailForConfirmation] = useState('');
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const { login, loading, resendConfirmationEmail, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  
  // إذا كان المستخدم مسجل دخوله بالفعل، انتقل إلى لوحة التحكم
  useEffect(() => {
    if (isLoggedIn && user) {
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    }
  }, [isLoggedIn, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      await login(email, password);
      // سيتم التعامل مع التوجيه في useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      // إذا كان الخطأ هو عدم تأكيد البريد الإلكتروني، اعرض نموذج إعادة إرسال التأكيد
      if (error.message && error.message.includes('Email not confirmed')) {
        setEmailForConfirmation(email);
        setShowConfirmationForm(true);
      }
    }
  };

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmationLoading(true);
    
    try {
      const success = await resendConfirmationEmail(emailForConfirmation);
      if (success) {
        setShowConfirmationForm(false);
      }
    } finally {
      setConfirmationLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">تسجيل الدخول</CardTitle>
          {showConfirmationForm && (
            <CardDescription className="text-center">
              يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {showConfirmationForm ? (
            <div className="space-y-4">
              <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  لم يتم تأكيد بريدك الإلكتروني بعد. يرجى التحقق من بريدك الوارد أو اطلب إعادة إرسال رابط التأكيد.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleResendConfirmation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmation-email">البريد الإلكتروني</Label>
                  <Input
                    id="confirmation-email"
                    type="email"
                    value={emailForConfirmation}
                    onChange={(e) => setEmailForConfirmation(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={confirmationLoading}>
                  {confirmationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري إرسال رابط التأكيد...
                    </>
                  ) : (
                    'إعادة إرسال رابط التأكيد'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowConfirmationForm(false)}
                >
                  العودة إلى تسجيل الدخول
                </Button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Link to="/forget-password" className="text-sm text-primary hover:underline">نسيت كلمة المرور؟</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <LogIn className="ml-2 h-4 w-4" />
                    تسجيل الدخول
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    <span className="flex items-center justify-center mt-2">
                      <UserPlus className="ml-1 h-4 w-4" />
                      إنشاء حساب جديد
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
