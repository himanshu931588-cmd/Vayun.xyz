import React from 'react';

interface VayunWordmarkProps {
  height?: number;
  className?: string;
  theme?: 'dark' | 'light';
  alt?: string;
}

export const VayunWordmark: React.FC<VayunWordmarkProps> = ({
  height = 24,
  className = '',
  theme = 'dark',
  alt = 'vayun.xyz_'
}) => {
  const isLight = theme === 'light';

  // The source image is 1024x572 (ratio ~1.79) with white background and black text.
  // With invert(1) on dark mode, background becomes pure #000000 and text becomes pure #ffffff.
  // With mix-blend-mode: screen (dark) or multiply (light), it blends seamlessly with any background!
  return (
    <div 
      className={`inline-flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{ height }}
    >
      <img
        src="/brand-wordmark.png"
        alt={alt}
        className={`h-full w-auto object-contain transition-all duration-200 ${
          isLight 
            ? 'mix-blend-multiply opacity-95' 
            : 'invert filter mix-blend-screen opacity-95'
        }`}
        loading="eager"
      />
    </div>
  );
};

export default VayunWordmark;
