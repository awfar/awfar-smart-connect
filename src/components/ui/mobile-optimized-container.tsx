
import React from 'react';
import { useBreakpoints } from '@/hooks/use-mobile';

export interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ 
  children, 
  className = '',
  noPadding = false 
}) => {
  const { isMobile } = useBreakpoints();
  
  return (
    <div className={`
      ${isMobile ? 'w-full' : 'max-w-3xl mx-auto'} 
      ${!noPadding ? 'p-4' : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
