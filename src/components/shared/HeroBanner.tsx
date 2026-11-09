import { motion } from "framer-motion";
import { useSiteImages } from "@/hooks/useSiteImages";

export default function HeroBanner({ 
  image, 
  slot, 
  title, 
  subtitle, 
  children, 
  height = "h-64 md:h-80",
  showLogo = true 
}: any) {
  const images = useSiteImages();
  const resolved = (slot && (images as any)[slot]) || image;
  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <img src={resolved} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-full flex flex-col justify-end p-6 md:p-10 max-w-7xl mx-auto">
        {showLogo && (
          <div className="mb-2.5 flex items-center gap-2.5">
            <div className="relative group shrink-0 flex items-center justify-center">
              <img 
                src="/gold-logo-icon.png" 
                alt="Lion Mode" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)] shrink-0" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-[0.25em] text-[#D4AF37] leading-none">
                LION MODE KARATE
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono mt-0.5 leading-none">
                OFFICIAL SYSTEM
              </span>
            </div>
          </div>
        )}
        <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider text-foreground">{title}</h1>
        {subtitle && <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-xl">{subtitle}</p>}
        {children && <div className="mt-4">{children}</div>}
      </motion.div>
    </div>
  );
}
