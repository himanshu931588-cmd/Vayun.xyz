import React from 'react';

interface VayunLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'squircle' | 'raw';
  alt?: string;
}

export const VayunLogo: React.FC<VayunLogoProps> = ({
  size = 28,
  className = '',
  variant = 'squircle',
  alt = 'Vayun'
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${
        variant === 'squircle' ? 'rounded-lg shadow-sm border border-neutral-700/50' : ''
      } ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src="/logo.png"
        alt={alt}
        className="w-full h-full object-cover select-none"
        loading="eager"
      />
    </div>
  );
};

export default VayunLogo;
