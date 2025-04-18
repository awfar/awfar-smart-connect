
import React from 'react';
import { useBreakpoints } from '@/hooks/use-mobile';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  const { isMobile } = useBreakpoints();
  
  if (isMobile) {
    return (
      <div className={`p-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
