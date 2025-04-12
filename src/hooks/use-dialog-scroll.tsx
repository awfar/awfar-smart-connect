
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook to manage scrolling behavior for dialogs and overlays
 * @param isOpen - Whether the dialog is open
 * @param contentRef - Reference to the dialog content element
 */
export function useDialogScroll(isOpen: boolean, contentId?: string) {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isOpen) return;
    
    // For mobile devices, prevent body scroll when dialog is open
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      
      // Ensure dialog content is scrollable
      if (contentId) {
        const contentElement = document.getElementById(contentId);
        if (contentElement) {
          contentElement.style.maxHeight = '90vh';
          contentElement.style.overflowY = 'auto';
          contentElement.style.WebkitOverflowScrolling = 'touch';
        }
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile, contentId]);
}
