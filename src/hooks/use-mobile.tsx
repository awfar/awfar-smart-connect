
import * as React from "react"

// Constants for breakpoints
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const SMALL_MOBILE_BREAKPOINT = 480

// Type for breakpoints
export type BreakpointState = {
  isSmallMobile: boolean; // Less than 480px
  isMobile: boolean;      // Less than 768px
  isTablet: boolean;      // Between 768px and 1024px
  isDesktop: boolean;     // Greater than 1024px
}

/**
 * Hook to check if the device is mobile
 * @returns boolean - Is the device mobile?
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value based on current window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    const updateSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener('resize', updateSize)
    
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return isMobile
}

/**
 * Hook to get complete information about all breakpoints
 * @returns Breakpoints - Object containing information about breakpoints
 */
export function useBreakpoints(): BreakpointState {
  const [breakpoints, setBreakpoints] = React.useState<BreakpointState>({
    isSmallMobile: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })
  
  React.useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        isSmallMobile: width < SMALL_MOBILE_BREAKPOINT,
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT
      })
    }
    
    // Initial check
    checkBreakpoints()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkBreakpoints)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoints)
  }, [])
  
  return breakpoints
}

/**
 * Debounce hook to improve resize response performance
 * @param value Value to be delayed
 * @param delay Delay in milliseconds
 * @returns Value after delay
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  
  return debouncedValue
}

/**
 * Hook to get current viewport width
 * @returns Current viewport width in pixels
 */
export function useViewportWidth(): number {
  const [width, setWidth] = React.useState<number>(0)
  
  React.useEffect(() => {
    // Set initial value
    setWidth(window.innerWidth)
    
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return width
}
