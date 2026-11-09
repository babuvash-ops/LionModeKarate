import React from 'react';
import DojoLogo from './shared/DojoLogo';

interface SplashScreenProps {
  logoUrl?: string;
  tagline?: string;
  dojoName?: string;
}

export default function SplashScreen({ tagline, dojoName }: SplashScreenProps) {
  return (
    <div 
      className="fixed inset-0 z-[1000] bg-[#0A0A0A] flex items-center justify-center overflow-hidden select-none"
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
        <div className="relative animate-pulse">
          <DojoLogo 
            size="2xl" 
            layout="vertical" 
            title={dojoName || "LION MODE"} 
            subtitle={tagline || "KARATE ACADEMY"}
            glowing 
          />
        </div>
        
        <div className="mt-10 flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
          <p className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
            INITIALIZING DOJO OS
          </p>
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
