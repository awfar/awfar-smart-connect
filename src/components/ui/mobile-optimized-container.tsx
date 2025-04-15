
import React from 'react';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-2 md:p-4 max-w-full overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
