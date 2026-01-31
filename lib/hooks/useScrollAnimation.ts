import { useEffect, useState, RefObject } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param ref - Reference to the element to observe
 * @param options - Intersection Observer options
 * @returns boolean indicating if element is in view
 */
export function useScrollAnimation(
  ref: RefObject<Element>,
  options: ScrollAnimationOptions = {}
): boolean {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once in view, stay in view (for entrance animations)
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin]);

  return isInView;
}

/**
 * Custom hook for scroll position tracking
 * @returns current scroll Y position
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Set initial position

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return scrollY;
}

/**
 * Custom hook to detect if user has scrolled past a threshold
 * @param threshold - Scroll position threshold in pixels
 * @returns boolean indicating if scrolled past threshold
 */
export function useScrollThreshold(threshold: number = 100): boolean {
  const scrollY = useScrollPosition();
  return scrollY > threshold;
}
