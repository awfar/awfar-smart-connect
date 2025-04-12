
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";

interface MobileOptimizedContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A container component optimized for mobile view with proper scrolling
 */
const MobileOptimizedContainer = ({
  children,
  className,
}: MobileOptimizedContainerProps) => {
  // Prevent body scrolling when modal is open on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className={cn(
        "w-full max-h-[90vh] overflow-y-auto flex flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedContainer;
