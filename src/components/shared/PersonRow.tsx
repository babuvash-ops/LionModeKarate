import { motion } from "framer-motion";

export default function PersonRow({ name, subtitle, avatar, initials, right, onClick, index = 0, interactive = true }: any) {
  const Tag = interactive ? motion.button : motion.div;
  const extra = interactive ? { whileTap: { scale: 0.99 }, onClick } : {};
  return (
    <Tag layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 active:border-primary/60 transition-colors text-left select-none" {...extra}>
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-border bg-secondary font-heading font-bold text-lg text-primary">
        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <span>{initials}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-base text-foreground truncate">{name}</p>
        {subtitle && <p className="font-body text-sm text-muted-foreground truncate mt-0.5">{subtitle}</p>}
      </div>
      {right != null && <div className="flex items-center gap-2 flex-shrink-0">{right}</div>}
    </Tag>
  );
}
