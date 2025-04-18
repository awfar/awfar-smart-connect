
import React from 'react';
import { useBreakpoints } from '@/hooks/use-mobile';

export interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean; // Add noPadding prop
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ 
  children, 
  className = "",
  noPadding = false
}) => {
  const { isMobile } = useBreakpoints();
  
  if (isMobile) {
    return (
      <div className={`${noPadding ? '' : 'p-4'} ${className}`}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={`${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
