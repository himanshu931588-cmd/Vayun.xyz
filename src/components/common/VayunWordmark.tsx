import React from 'react';

interface VayunWordmarkProps {
  height?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'dark' | 'light';
  alt?: string;
}

export const VayunWordmark: React.FC<VayunWordmarkProps> = ({
  height,
  size,
  className = '',
  theme = 'dark',
  alt = 'vayun.xyz_'
}) => {
  const isLight = theme === 'light';

  // Sizing map (aspect ratio is 865 / 132 ≈ 6.55)
  let resolvedHeight = 24;
  if (height) {
    resolvedHeight = height;
  } else if (size === 'sm') {
    resolvedHeight = 20;
  } else if (size === 'md') {
    resolvedHeight = 26;
  } else if (size === 'lg') {
    resolvedHeight = 34;
  } else if (size === 'xl') {
    resolvedHeight = 44;
  }

  return (
    <div 
      className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ height: `${resolvedHeight}px` }}
    >
      <img
        src="/brand-wordmark.png"
        alt={alt}
        style={{ height: `${resolvedHeight}px`, width: 'auto' }}
        className={`object-contain transition-all duration-150 ${
          isLight 
            ? 'filter brightness-0 opacity-90 hover:opacity-100' 
            : 'filter brightness-0 invert opacity-95 hover:opacity-100'
        }`}
        loading="eager"
      />
    </div>
  );
};

export default VayunWordmark;
