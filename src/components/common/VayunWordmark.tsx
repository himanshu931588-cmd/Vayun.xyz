import React, { useState } from 'react';
import wordmarkWhite from '../../assets/brand-wordmark-white.png';
import wordmarkBlack from '../../assets/brand-wordmark-black.png';

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
  const [imageError, setImageError] = useState(false);
  const isLight = theme === 'light';

  // Sizing map (aspect ratio is 865 / 132 ≈ 6.553)
  let resolvedHeight = 24;
  if (height) {
    resolvedHeight = height;
  } else if (size === 'sm') {
    resolvedHeight = 20;
  } else if (size === 'md') {
    resolvedHeight = 24;
  } else if (size === 'lg') {
    resolvedHeight = 32;
  } else if (size === 'xl') {
    resolvedHeight = 44;
  }

  // Exact pixel width calculated to prevent any layout overflow or overlapping
  const resolvedWidth = Math.round(resolvedHeight * (865 / 132));

  // Pre-rendered pure white (#ffffff) for dark theme, pure black (#000000) for light theme
  // Zero CSS filter dependency to guarantee 100% visibility on all browsers & displays
  const imageSrc = isLight ? wordmarkBlack : wordmarkWhite;

  return (
    <div 
      className={`inline-flex items-center justify-start select-none shrink-0 ${className}`}
      style={{ height: `${resolvedHeight}px`, width: `${resolvedWidth}px`, minWidth: `${resolvedWidth}px` }}
    >
      {!imageError ? (
        <img
          src={imageSrc}
          alt={alt}
          onError={() => setImageError(true)}
          style={{ 
            height: `${resolvedHeight}px`, 
            width: `${resolvedWidth}px`,
            maxWidth: 'none',
            display: 'block'
          }}
          className="object-contain transition-opacity duration-150 opacity-95 hover:opacity-100"
          loading="eager"
        />
      ) : (
        /* Guaranteed Typographic Fallback if Image fails to render */
        <span 
          style={{ fontSize: `${Math.round(resolvedHeight * 0.72)}px`, lineHeight: 1 }}
          className={`font-mono font-bold tracking-tight inline-flex items-center ${
            isLight ? 'text-black' : 'text-white'
          }`}
        >
          <span>vayun</span>
          <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>.xyz</span>
          <span className="text-emerald-500 animate-pulse font-normal ml-0.5">_</span>
        </span>
      )}
    </div>
  );
};

export default VayunWordmark;
