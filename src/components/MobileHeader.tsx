import { ChevronLeft, Home, Zap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  logoUrl?: string;
  dojoName?: string;
}

export default function MobileHeader({ title, onBack, onHome, logoUrl, dojoName }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 safe-area-top flex flex-col">
      <div className="h-16 md:h-18 flex items-center justify-between px-4 sm:px-6">
        <div className="w-1/4 flex items-center">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              aria-label="Go Back"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all min-w-[44px] min-h-[44px]"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
        </div>
        
        <div className="w-2/4 flex flex-col items-center text-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-10 sm:h-12 w-auto max-w-[90px] object-contain rounded-xl p-0.5 border border-gold/40 mb-0.5" />
          ) : (
            <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">{dojoName || 'LION MODE'}</p>
          )}
          <h2 className="text-[11px] font-black uppercase text-white tracking-widest leading-none truncate opacity-80">
            {title}
          </h2>
        </div>

        <div className="w-1/4 flex items-center justify-end gap-2.5">
          <img 
            src={logoUrl || "/lion-mode-logo.jpg"} 
            alt="Lionmode Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain border-2 border-gold/40 p-0.5 bg-black/70 shadow-lg shrink-0" 
            onError={(e) => { e.currentTarget.src = "/lion-mode-logo.jpg"; }}
          />
          {onHome && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onHome}
              aria-label="Go Home"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all min-w-[44px] min-h-[44px]"
            >
              <Home className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
