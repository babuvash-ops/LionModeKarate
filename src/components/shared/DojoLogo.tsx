import React from 'react';
import { Link } from 'react-router-dom';

const goldLogoIconSrc = '/gold-logo-icon.png';

export interface DojoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  showText?: boolean;
  title?: string;
  subtitle?: string;
  tagline?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
  glowing?: boolean;
}

const sizeConfig = {
  xs: {
    img: 'w-7 h-7',
    title: 'text-xs sm:text-sm tracking-wider',
    subtitle: 'text-[8px] tracking-[0.2em]',
    gap: 'gap-2',
  },
  sm: {
    img: 'w-9 h-9',
    title: 'text-sm sm:text-base tracking-wider',
    subtitle: 'text-[9px] tracking-[0.22em]',
    gap: 'gap-2.5',
  },
  md: {
    img: 'w-11 h-11 sm:w-12 sm:h-12',
    title: 'text-lg sm:text-xl tracking-wider',
    subtitle: 'text-[10px] tracking-[0.25em]',
    gap: 'gap-3',
  },
  lg: {
    img: 'w-16 h-16 sm:w-20 sm:h-20',
    title: 'text-2xl sm:text-3xl tracking-wider',
    subtitle: 'text-xs tracking-[0.28em]',
    gap: 'gap-3.5',
  },
  xl: {
    img: 'w-24 h-24 sm:w-28 sm:h-28',
    title: 'text-3xl sm:text-4xl tracking-wider',
    subtitle: 'text-xs sm:text-sm tracking-[0.3em]',
    gap: 'gap-4',
  },
  '2xl': {
    img: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
    title: 'text-3xl sm:text-5xl md:text-6xl tracking-wider',
    subtitle: 'text-xs sm:text-sm md:text-base tracking-[0.32em]',
    gap: 'gap-3 sm:gap-4',
  },
  hero: {
    img: 'w-36 h-36 sm:w-52 sm:h-52 md:w-60 md:h-60',
    title: 'text-4xl sm:text-6xl md:text-7xl tracking-wider',
    subtitle: 'text-sm sm:text-base md:text-lg tracking-[0.35em]',
    gap: 'gap-4 sm:gap-5',
  },
};

export default function DojoLogo({
  size = 'md',
  layout = 'horizontal',
  showText = true,
  title = 'LION MODE',
  subtitle = 'KARATE ACADEMY',
  tagline,
  className = '',
  href,
  onClick,
  glowing = true,
}: DojoLogoProps) {
  const cfg = sizeConfig[size] || sizeConfig.md;
  const isVertical = layout === 'vertical';
  const isIconOnly = layout === 'icon-only' || showText === false;

  const content = (
    <div
      className={`group inline-flex shrink-0 ${isVertical ? 'flex-col items-center text-center' : 'flex-row items-center text-left'} ${cfg.gap} select-none transition-transform active:scale-[0.99] ${className}`}
      onClick={onClick}
    >
      {/* Pure Gold Logo Icon - 100% Transparent Background, No White Backing, No Box */}
      <div className="relative shrink-0 flex items-center justify-center">
        {glowing && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/25 via-[#FFB800]/30 to-[#D4AF37]/25 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none scale-125" />
        )}
        <img
          src={goldLogoIconSrc}
          alt={title ? `${title} Logo Icon` : 'Lion Mode Gold Logo'}
          className={`relative ${cfg.img} object-contain filter drop-shadow-[0_4px_22px_rgba(212,175,55,0.45)] group-hover:drop-shadow-[0_6px_28px_rgba(255,184,0,0.6)] transition-all duration-500 group-hover:scale-105`}
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = '/lion-crest.png';
          }}
        />
      </div>

      {/* Optional Brand Typography (only rendered when showText is true and not icon-only) */}
      {!isIconOnly && (
        <div className={`flex flex-col justify-center min-w-0 max-w-full px-1 ${isVertical ? 'items-center mt-2' : ''}`}>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black uppercase text-white leading-none drop-shadow-sm whitespace-nowrap ${cfg.title}`}
              style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif" }}
            >
              {title}
            </span>
          </div>
          <span
            className={`font-heading font-bold uppercase text-[#D4AF37] mt-1 leading-none drop-shadow-sm whitespace-nowrap ${cfg.subtitle}`}
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {subtitle}
          </span>
          {tagline && (
            <span className="text-[9px] uppercase tracking-widest text-white/50 mt-1 font-mono whitespace-nowrap">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="inline-block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
