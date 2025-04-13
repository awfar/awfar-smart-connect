
import React from 'react';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-1 md:p-4 ${className}`}>
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
