import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'elevated' | 'glass';
}

export default function Card({ 
  children, 
  className = '',
  variant = 'standard' 
}: CardProps) {
  const baseStyles = 'overflow-hidden shadow rounded-lg';
  
  const variantStyles = {
    standard: 'bg-white',
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow',
    glass: 'glass backdrop-blur-lg border border-white/20',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}