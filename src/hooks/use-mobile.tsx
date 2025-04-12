
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

type Breakpoints = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useBreakpoints(): Breakpoints {
  const [breakpoints, setBreakpoints] = React.useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })
  
  React.useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT
      })
    }
    
    // Initial check
    checkBreakpoints()
    
    // Add window resize listener
    window.addEventListener('resize', checkBreakpoints)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoints)
  }, [])
  
  return breakpoints
}

// Debounce helper for resize optimization
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
