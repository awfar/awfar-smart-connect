
import React from 'react';

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
}

const MobileOptimizedContainer: React.FC<MobileOptimizedContainerProps> = ({ children }) => {
  return (
    <div className="p-1 md:p-4">
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
