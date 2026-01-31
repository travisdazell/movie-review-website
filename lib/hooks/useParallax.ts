import { useEffect, useState, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
}

/**
 * Custom hook for parallax scroll effects
 * @param ref - Reference to the element for parallax effect
 * @param options - Parallax configuration options
 * @returns transform value for parallax effect
 */
export function useParallax(
  ref: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
): string {
  const { speed = 0.5, direction = 'up' } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // Calculate offset when element is in viewport
      if (elementTop < windowHeight && elementTop > -element.offsetHeight) {
        const scrollProgress = (windowHeight - elementTop) / (windowHeight + element.offsetHeight);
        const parallaxOffset = scrollProgress * speed * 100;
        setOffset(direction === 'up' ? -parallaxOffset : parallaxOffset);
      }
    };

    // Throttle scroll events for 60fps performance
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
  }, [ref, speed, direction]);

  return `translateY(${offset}px)`;
}

/**
 * Custom hook for simple parallax effect based on scroll position
 * @param speed - Multiplier for parallax speed (0-1 for slower, >1 for faster)
 * @returns Y offset value
 */
export function useSimpleParallax(speed: number = 0.5): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

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
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [speed]);

  return offset;
}
