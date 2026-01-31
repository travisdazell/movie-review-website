import { useState, useEffect, RefObject, MouseEvent } from 'react';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

interface TiltAngles {
  rotateX: number;
  rotateY: number;
  scale: number;
}

/**
 * Custom hook for 3D tilt hover effects based on mouse position
 * @param ref - Reference to the element to apply tilt effect
 * @param options - Tilt configuration options
 * @returns tilt angles and CSS transform string
 */
export function use3DTilt(
  ref: RefObject<HTMLElement>,
  options: TiltOptions = {}
): {
  tiltAngles: TiltAngles;
  transform: string;
  handleMouseMove: (e: MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
} {
  const {
    maxTilt = 20,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
  } = options;

  const [tiltAngles, setTiltAngles] = useState<TiltAngles>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTiltAngles({
      rotateX,
      rotateY,
      scale,
    });
  };

  const handleMouseLeave = () => {
    setTiltAngles({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  };

  const transform = `perspective(${perspective}px) rotateX(${tiltAngles.rotateX}deg) rotateY(${tiltAngles.rotateY}deg) scale(${tiltAngles.scale})`;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set transition for smooth tilt effect
    element.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;

    return () => {
      element.style.transition = '';
    };
  }, [ref, speed]);

  return {
    tiltAngles,
    transform,
    handleMouseMove,
    handleMouseLeave,
  };
}

/**
 * Simpler hook that returns just the transform style
 * @param ref - Reference to the element
 * @param maxTilt - Maximum tilt angle in degrees
 * @returns CSS transform string
 */
export function useTiltTransform(
  ref: RefObject<HTMLElement>,
  maxTilt: number = 15
): {
  style: { transform: string };
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
} {
  const { transform, handleMouseMove, handleMouseLeave } = use3DTilt(ref, {
    maxTilt,
  });

  return {
    style: { transform },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}
