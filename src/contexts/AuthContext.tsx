
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; session: Session | null } | void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email || "No user");
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email || "No active session");
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('يجب تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تحقق من بريدك الإلكتروني أو اطلب إعادة إرسال رابط التأكيد.');
        } else {
          toast.error(error.message || 'حدث خطأ في تسجيل الدخول');
        }
        throw error;
      }
      
      toast.success(`مرحبًا بك! تم تسجيل الدخول بنجاح`);
      return data;
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const siteUrl = window.location.origin; // Get the current site URL
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });
      if (error) throw error;
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في إرسال رابط إعادة تعيين كلمة المرور');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const siteUrl = window.location.origin; // Get the current site URL
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${siteUrl}/login`
        }
      });
      
      if (error) throw error;
      
      toast.success('تم إرسال رابط التأكيد مرة أخرى إلى بريدك الإلكتروني');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في إعادة إرسال رابط التأكيد');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isLoggedIn: !!user,
    user,
    session,
    loading,
    login,
    logout,
    resetPassword,
    resendConfirmationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
