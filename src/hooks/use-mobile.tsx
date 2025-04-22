
import React, { useEffect, useState } from "react";

export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean;
}

export function useBreakpoints(): BreakpointState {
  const [state, setState] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isSmallMobile: false,
  });

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setState({
        isSmallMobile: width < 480,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return state;
}

// For backward compatibility
export const useIsMobile = () => {
  const { isMobile } = useBreakpoints();
  return isMobile;
};
