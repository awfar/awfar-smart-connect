
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthButton: React.FC = () => {
  const { isLoggedIn, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      await logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleAuthAction}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isLoggedIn ? (
        <>
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل خروج {user?.email?.split('@')[0]}</span>
        </>
      ) : (
        <>
          <LogIn className="ml-2 h-4 w-4" />
          <span>تسجيل الدخول</span>
        </>
      )}
    </Button>
  );
};

export default AuthButton;
