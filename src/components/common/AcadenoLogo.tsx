import React from 'react';
import acadenoLogoPng from '../../assets/acadeno-logo.png';

interface AcadenoLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProductTag?: boolean;
}

export const AcadenoLogo: React.FC<AcadenoLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showProductTag = true,
}) => {
  // Height and dimension mappings for pixel perfection
  const heightStyles = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const isIconOnly = variant === 'icon';

  // Icon only rendering (focusing on the dynamic "A" and arrow emblem)
  if (isIconOnly) {
    return (
      <div className={`inline-flex items-center justify-center relative select-none ${className}`}>
        <div className={`${iconSizes[size]} rounded-2xl overflow-hidden bg-white/95 p-1 shadow-sm border border-slate-200/80 flex items-center justify-center hover:scale-105 transition-transform duration-200`}>
          <img
            src={acadenoLogoPng}
            alt="ACADENO Icon"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Dark / White backdrop variant (for dark navigation, login split-screen, or dark cards)
  if (variant === 'white') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-lg shadow-black/10 flex items-center gap-3 transition-all hover:bg-white group">
          <img
            src={acadenoLogoPng}
            alt="ACADENO Technologies"
            className={`${heightStyles[size]} w-auto object-contain transition-transform group-hover:scale-102`}
            loading="eager"
          />
          {showProductTag && (
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs uppercase tracking-wider">
              EventLink
            </span>
          )}
        </div>
      </div>
    );
  }

  // Badge variant
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <img
            src={acadenoLogoPng}
            alt="ACADENO Technologies"
            className={`${heightStyles[size]} w-auto object-contain`}
            loading="eager"
          />
          {showProductTag && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs uppercase tracking-wider">
              EventLink
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default 'full' variant (clean transparent container)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src={acadenoLogoPng}
        alt="ACADENO Technologies"
        className={`${heightStyles[size]} w-auto object-contain drop-shadow-xs hover:scale-101 transition-transform`}
        loading="eager"
      />

      {showProductTag && (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs uppercase tracking-wider shrink-0 self-center">
          EventLink
        </span>
      )}
    </div>
  );
};

