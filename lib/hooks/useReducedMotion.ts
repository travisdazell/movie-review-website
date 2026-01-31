import { useEffect, useState } from 'react';

/**
 * Custom hook to detect and respect user's prefers-reduced-motion setting
 * @returns boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper hook that returns appropriate animation duration based on reduced motion preference
 * @param normalDuration - Duration in ms when animations are enabled
 * @param reducedDuration - Duration in ms when reduced motion is preferred (default: 0)
 * @returns duration in ms
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}

/**
 * Helper hook for conditional Framer Motion animation variants
 * @param normalVariant - Animation variant when motion is enabled
 * @param reducedVariant - Animation variant when reduced motion is preferred
 * @returns appropriate variant based on user preference
 */
export function useMotionVariant<T>(
  normalVariant: T,
  reducedVariant: T
): T {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedVariant : normalVariant;
}
