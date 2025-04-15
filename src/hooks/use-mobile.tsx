
import * as React from "react"

// ثوابت لنقاط التجاوب
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const SMALL_MOBILE_BREAKPOINT = 480

// نوع بيانات لنقاط التجاوب
export type Breakpoints = {
  isSmallMobile: boolean; // أقل من 480px
  isMobile: boolean;      // أقل من 768px
  isTablet: boolean;      // بين 768px و 1024px
  isDesktop: boolean;     // أكبر من 1024px
}

/**
 * هوك للتحقق من ما إذا كان الجهاز محمولاً
 * @returns boolean - هل الجهاز محمول؟
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // تعيين القيمة الأولية بناءً على عرض النافذة الحالي
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
 * هوك للحصول على معلومات متكاملة عن جميع نقاط التجاوب
 * @returns Breakpoints - كائن يحتوي على معلومات عن نقاط التجاوب
 */
export function useBreakpoints(): Breakpoints {
  const [breakpoints, setBreakpoints] = React.useState<Breakpoints>({
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
    
    // فحص أولي
    checkBreakpoints()
    
    // إضافة مستمع لحدث تغيير حجم النافذة
    window.addEventListener('resize', checkBreakpoints)
    
    // التنظيف
    return () => window.removeEventListener('resize', checkBreakpoints)
  }, [])
  
  return breakpoints
}

/**
 * هوك debounce لتحسين أداء استجابة تغيير الحجم
 * @param value القيمة التي سيتم تأخيرها
 * @param delay مدة التأخير بالميلي ثانية
 * @returns القيمة بعد التأخير
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
 * هوك للحصول على عرض الشاشة الحالي
 * @returns عرض الشاشة الحالي بالبكسل
 */
export function useViewportWidth(): number {
  const [width, setWidth] = React.useState<number>(0)
  
  React.useEffect(() => {
    // تعيين القيمة الأولية
    setWidth(window.innerWidth)
    
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return width
}
