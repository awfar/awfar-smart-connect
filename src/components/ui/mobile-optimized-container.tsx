
import React from 'react';
import { useBreakpoints } from '@/hooks/use-mobile';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  noPadding?: boolean;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ 
  children, 
  className = '',
  fullHeight = false,
  noPadding = false
}) => {
  const { isMobile, isSmallMobile } = useBreakpoints();
  
  return (
    <div 
      className={`
        ${noPadding ? '' : isSmallMobile ? 'p-2' : isMobile ? 'p-3' : 'p-4'}
        ${fullHeight ? 'h-full' : ''}
        max-w-full overflow-x-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
