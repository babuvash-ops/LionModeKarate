import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import GoldButton from './shared/GoldButton';

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const posts = [
    {
      title: "The Discipline Paradox: Why Soft Skills Build Hard Fighters",
      excerpt: "Exploring the psychological bridge between traditional martial arts discipline and modern high-performance success in the corporate arena.",
      author: "Sensei Marcus",
      date: "May 12, 2026",
      readTime: "6 min read",
      category: "PHILOSOPHY",
      image: "https://images.unsplash.com/photo-1540206276207-3af25c08abbb?q=80&w=800"
    },
    {
      title: "Tactical Breathwork: Performance Under Pressure",
      excerpt: "Deep dive into the physiology of breathing techniques used by elite martial artists and special operations personnel to regulate heart rate.",
      author: "Dojo Ops",
      date: "May 08, 2026",
      readTime: "8 min read",
      category: "TACTICS",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800"
    },
    {
      title: "Nutrition for Recovery: The Warrior's Plate",
      excerpt: "How to fuel your body for maximum metabolic efficiency and accelerated tissue repair following a high-intensity combat session.",
      author: "Dr. Sarah",
      date: "May 02, 2026",
      readTime: "5 min read",
      category: "LIFESTYLE",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800"
    },
    {
      title: "The History of Our Lineage",
      excerpt: "Tracing the roots of our school back through the centuries, connecting ancient wisdom with our modern operational readiness system.",
      author: "Shihan Davis",
      date: "April 24, 2026",
      readTime: "12 min read",
      category: "HISTORY",
      image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=800"
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Identity sync error. Email address required.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success('COMMS COMPILED', {
        description: 'Your terminal frequency is subscribed to active newsletter updates.'
      });
      setEmail('');
      setSubmitting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Visual artifacts */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      {/* HEADER SECTION - Consistent with others */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-20 animate-fade-in">
        <div className="text-left space-y-4 max-w-3xl">
          <span className="section-subtitle">
            Field Intelligence
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            THE_ <br />
            <span className="text-primary">DOJO_INTEL_LOG</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
            Strategic insights, physical tactical updates, and deep philosophical analyses covering the modern warrior path.
          </p>
        </div>
      </section>

      {/* RECENT STORIES BLOG FEED */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {posts.map((post, i) => (
          <motion.div
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col sm:flex-row gap-6 p-6 glass rounded-[28px] border border-white/5 hover:border-primary/20 hover:shadow-glow-gold transition-all duration-300 cursor-pointer text-left"
          >
            {/* Visual Header */}
            <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 bg-neutral-900 relative">
              <img 
                src={`${post.image}&auto=format&fit=crop&q=80&w=600`} 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700" 
                alt="Post Preview" 
              />
            </div>

            {/* Information Context */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase font-black text-[8px] tracking-widest">
                    {post.category}
                  </Badge>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Clock className="w-3 h-3 text-primary" /> {post.readTime}
                  </span>
                </div>
                
                <h3 className="font-heading text-xl font-bold text-white uppercase italic tracking-wide group-hover:text-primary transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="font-sans text-xs text-white/50 leading-relaxed italic line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-sans font-black text-white/30 uppercase tracking-wider block">
                  {post.author} • {post.date}
                </span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* INTEL NEWSLETTER SUBSCRIBE SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="premium-card text-left space-y-8 border border-white/5 shadow-2xl relative overflow-hidden overflow-hidden">
          <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-primary/[0.015] rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-3 max-w-xl">
            <span className="section-subtitle">Tactical Broadcast</span>
            <h2 className="section-title">
              ENABLE_ <br /><span className="text-primary">BROADCAST_UPLINK</span>
            </h2>
            <p className="body-text-premium text-white/50 text-xs md:text-sm leading-relaxed">
              Sign up with your personal network signal to recieve weekly technical tutorials, special event reminders, and grading schedules direct to your core inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full max-w-2xl gap-4 pt-2">
            <input 
              type="email"
              required
              placeholder="e.g. operator@dojo.os" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white font-sans text-sm focus:border-primary/40 focus:outline-none placeholder-white/20 font-semibold" 
            />
            <GoldButton 
              type="submit" 
              isLoading={submitting}
              className="h-12 px-8 text-xs font-heading font-bold tracking-widest uppercase italic rounded-xl shadow-glow-gold hover:scale-[1.01]"
            >
              SUBSCRIBE_UPLINK
            </GoldButton>
          </form>
        </div>
      </div>

    </div>
  );
}
