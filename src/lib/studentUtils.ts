export const getRankColor = (rank: string) => {
  const r = (rank || '').toLowerCase();
  if (r.includes('white')) return 'bg-white/10 text-white border-white/20';
  if (r.includes('yellow')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  if (r.includes('orange')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  if (r.includes('green')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  if (r.includes('blue')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  if (r.includes('purple')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  if (r.includes('brown')) return 'bg-amber-800/20 text-amber-600 border-amber-800/30';
  if (r.includes('black')) return 'bg-gold/10 text-gold border-gold shadow-[0_0_20px_rgba(245,197,24,0.25)]';
  return 'bg-secondary/20 text-muted-foreground border-border';
};
