import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'button';
  width?: string;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonLoaderProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'w-full h-64 rounded-lg';
      case 'circle':
        return 'w-12 h-12 rounded-full';
      case 'button':
        return 'w-24 h-10 rounded-md';
      case 'text':
      default:
        return 'w-full h-4 rounded';
    }
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <motion.div
      className={`bg-gradient-shimmer animate-shimmer ${getVariantClasses()} ${className}`}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
