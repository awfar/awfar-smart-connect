
import React, { ReactNode } from 'react';

interface MobileOptimizedContainerProps {
  children: ReactNode;
  className?: string;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
