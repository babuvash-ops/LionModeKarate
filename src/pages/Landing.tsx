import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Award, Users, Gift, Star, Bot, LogIn, Sparkles, Mail, ShoppingBag, ArrowRight, Check, Download, Smartphone } from "lucide-react";
import GoldButton from "../components/shared/GoldButton";
import { useSiteImages } from "@/hooks/useSiteImages";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useAuth } from "@/lib/AuthContext";
import DojoLogo from "@/components/shared/DojoLogo";
import ChatBotIcon from "@/components/shared/ChatBotIcon";
import { useCart } from "@/lib/cartStore";
import { PRODUCTS } from "@/data/products";
import InstallModal from "@/components/shared/InstallModal";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { toast } from "sonner";

const stats = [
  { icon: Award, value: "25+", label: "Years Experience" },
  { icon: Users, value: "All Ages", label: "Beginners Welcome" },
  { icon: Gift, value: "Free", label: "Trial Lesson" },
  { icon: Star, value: "4.9★", label: "Parent Rating" },
];

export default function Landing() {
  const navigate = useNavigate();
  const images = useSiteImages();
  const content = useSiteContent();
  const { user, profile, openAuthModal, signOut } = useAuth();
  const { items: cartItems } = useCart();
  const totalCartCount = cartItems.reduce((acc: number, item: any) => acc + (item.qty || 1), 0);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const { deferredPrompt, isInstalled, promptInstall } = usePWAInstall();

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const res = await promptInstall();
      if (res.success && res.outcome === 'accepted') {
        return;
      }
    }
    setIsInstallOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - Approved Template 01 (Minimal Luxury, Decluttered Top Band) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
          <DojoLogo size="md" href="/" />

          {/* Clean Navigation Links: Shop, About, Programs, Contact (Desktop: inline on top band) */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-heading uppercase tracking-wider text-white/70">
            <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
            <a href="#about" className="hover:text-[#D4AF37] transition-colors">About</a>
            <a href="#programs" className="hover:text-[#D4AF37] transition-colors">Programs</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </div>

          {/* Member Portal Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link to="/dashboard">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-[#D4AF37]" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFB800] text-black font-bold text-xs flex items-center justify-center font-heading">
                        {user.displayName?.[0] || 'M'}
                      </div>
                    )}
                    <span className="font-heading text-xs uppercase tracking-wider text-[#D4AF37] hidden sm:inline">
                      {user.displayName?.split(' ')[0] || 'Member'}
                    </span>
                  </div>
                </Link>
                <GoldButton size="sm" onClick={() => navigate('/dashboard')}>
                  Member Portal
                </GoldButton>
              </div>
            ) : (
              <GoldButton
                size="sm"
                onClick={() => openAuthModal('Enter your Student ID or sign in to access your confidential Member Portal & Student Passport')}
              >
                Member Portal
              </GoldButton>
            )}
          </div>
        </div>

        {/* Dedicated Responsive Second Row on Black Band for Tablets & Mobile Screens (< lg) */}
        <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A]/95 px-4 py-2">
          <div className="max-w-md mx-auto flex items-center justify-around text-xs sm:text-sm font-heading uppercase tracking-wider text-white/80">
            <Link to="/shop" className="hover:text-[#D4AF37] transition-colors px-2 py-0.5">Shop</Link>
            <span className="text-white/20 select-none">•</span>
            <a href="#about" className="hover:text-[#D4AF37] transition-colors px-2 py-0.5">About</a>
            <span className="text-white/20 select-none">•</span>
            <a href="#programs" className="hover:text-[#D4AF37] transition-colors px-2 py-0.5">Programs</a>
            <span className="text-white/20 select-none">•</span>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors px-2 py-0.5">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img
          src={images.hero_background || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85"}
          alt="Lionmode Karate student at the beach and sky"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/30 to-background" />
        <div className="relative min-h-screen flex flex-col justify-between pt-32 lg:pt-24 pb-7 px-4 sm:px-6 md:px-12">
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 flex flex-col items-center"
            >
              <DojoLogo size="hero" layout="icon-only" showText={false} glowing />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] tracking-tight text-white drop-shadow-md"
            >
              {content.hero.headingLine1} <span className="text-primary">{content.hero.headingHighlight}</span> {content.hero.headingLine2}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-sm md:text-base text-gray-200 font-body mt-5 max-w-md drop-shadow-md"
            >
              {content.hero.subtitle}
            </motion.p>

            {/* Primary Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-wrap gap-3.5 justify-center mt-7 items-center"
            >
              <Link to="/trial">
                <GoldButton size="lg">{content.hero.primaryButtonText}</GoldButton>
              </Link>
              <a href="#programs">
                <GoldButton variant="outline" size="lg">{content.hero.secondaryButtonText}</GoldButton>
              </a>
              <Link to="/shop">
                <GoldButton variant="outline" size="lg" className="flex items-center gap-2 border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>{content.hero.shopButtonText}</span>
                </GoldButton>
              </Link>
            </motion.div>

            {/* Secondary Actions Underneath Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-3 border-t border-white/10 w-full max-w-xl"
            >
              <Link to="/sensei">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] text-xs font-heading uppercase tracking-wider transition-all cursor-pointer">
                  <ChatBotIcon className="w-3.5 h-3.5" glow />
                  <span>Sensei AI Assistant</span>
                </button>
              </Link>
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] text-xs font-heading uppercase tracking-wider transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>{isInstalled ? "App Installed" : "Install App"}</span>
              </button>
              <button
                onClick={() => openAuthModal('Enter your Student ID to access your confidential student passport')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#FFB800]/10 hover:from-[#D4AF37]/30 hover:to-[#FFB800]/20 border border-[#D4AF37]/40 text-[#FFB800] text-xs font-heading uppercase tracking-wider transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Parent / Student ID Login</span>
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto w-full"
          >
            {[
              { icon: Users, value: content.hero.stat1Value, label: content.hero.stat1Label },
              { icon: Award, value: content.hero.stat2Value, label: content.hero.stat2Label },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl py-5 flex flex-col items-center">
                <Icon className="w-6 h-6 text-primary mb-2" />
                <p className="font-heading text-2xl md:text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Black Chat Bot Block on the Home Page */}
      <section className="relative py-10 px-6 bg-gradient-to-b from-background via-[#080808] to-[#0A0A0A] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-[#D4AF37]/30 p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)] group hover:border-[#D4AF37]/60 transition-all"
          >
            {/* Ambient Gold Glow Halo */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/25 transition-all" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between">
              <div className="flex items-center gap-5 sm:gap-6 text-center md:text-left flex-col md:flex-row">
                {/* Black Chat Bot Block with Gold Chat Bot Icon */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-[#D4AF37]/25 blur-xl rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-black border border-[#D4AF37]/60 p-3.5 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-300">
                    <ChatBotIcon className="w-full h-full" glow />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-heading uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {content.senseiAi.badge}
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
                    {content.senseiAi.title} <span className="text-[#D4AF37]">{content.senseiAi.highlight}</span>
                  </h3>
                  <p className="text-gray-300 font-body text-xs sm:text-sm max-w-lg leading-relaxed">
                    {content.senseiAi.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                <Link to="/sensei" className="w-full sm:w-auto">
                  <GoldButton size="lg" className="w-full flex items-center justify-center gap-2">
                    <ChatBotIcon className="w-4 h-4 text-black" />
                    {content.senseiAi.buttonText}
                  </GoldButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="relative py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-heading uppercase tracking-[0.3em] text-[#D4AF37]">
              {content.programs.eyebrow}
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase text-white leading-tight">
              {content.programs.heading} <span className="text-[#D4AF37]">{content.programs.highlight}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-body leading-relaxed">
              {content.programs.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.programs.list.map((prog, index) => {
              const defaultImages = [
                images.kids_training || "https://content.app-sources.com/s/09941769835917864/uploads/Images/20210909_175558-7415561.jpg",
                images.junior_kata || "https://content.app-sources.com/s/09941769835917864/uploads/Images/467284781_18123799843393050_739399674060152822_n-4431799.jpg",
                images.sparring_action || "https://content.app-sources.com/s/09941769835917864/uploads/Images/241426277_229185769151696_3286067128154972950_n-7424218.jpg",
                images.champion_medals || "https://content.app-sources.com/s/09941769835917864/uploads/Images/469533008_18125826691393050_7552599873704125080_n-4431896.jpg"
              ];
              const progImg = defaultImages[index % defaultImages.length];

              return (
                <motion.div
                  key={prog.id || prog.title}
                  whileHover={{ y: -6 }}
                  className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 rounded-3xl overflow-hidden backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={progImg}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-heading uppercase tracking-wider font-bold">
                        {prog.badge}
                      </span>
                      <span className="absolute bottom-3 right-3 text-xs bg-[#D4AF37] text-black font-heading uppercase px-2.5 py-0.5 rounded-lg font-bold">
                        {prog.age}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-heading text-2xl font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        {prog.desc}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-white/5">
                        {prog.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-300 font-body">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link to={`/trial?program=${encodeURIComponent(prog.title + " (" + prog.age + ")")}`} className="block w-full">
                      <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-[#D4AF37] font-heading uppercase tracking-wider text-xs font-semibold transition-all cursor-pointer">
                        {prog.buttonText || "Book Free VIP Trial Pass"}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pro Shop Featured Gear Section (Public & Member Shopping) */}
      <section id="shop-showcase" className="relative py-20 px-6 bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-heading uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-1.5 font-bold">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                {content.shopShowcase.eyebrow}
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase text-white leading-tight">
                {content.shopShowcase.heading} <span className="text-[#D4AF37]">{content.shopShowcase.highlight}</span>
              </h2>
              <p className="text-xs md:text-sm text-gray-400 font-body max-w-xl leading-relaxed">
                {content.shopShowcase.description}
              </p>
            </div>

            <Link to="/shop">
              <GoldButton size="md" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>{content.shopShowcase.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </GoldButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.slice(0, 4).map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 rounded-3xl overflow-hidden backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-black/60">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-heading uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/30 font-bold">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#D4AF37] text-black text-[9px] font-heading uppercase font-bold tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-heading text-lg font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-body line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="font-heading text-2xl font-bold text-white">
                        R {product.price.toLocaleString()}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-xs text-gray-500 line-through font-body">
                          R {product.compare_at_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link to={`/shop/${product.id}`} className="block w-full">
                    <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] text-white hover:text-black font-heading uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>View & Buy Item</span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative py-20 bg-[#080808]">
        <img
          src={images.about_background}
          alt="Lionmode Karate dojo"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#080808]/80 to-[#0A0A0A]" />
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <p className="font-heading text-sm uppercase tracking-[0.35em] mb-3 text-primary">
            {content.about.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase text-white leading-[0.95] mb-6">
            {content.about.heading} <span className="text-primary">{content.about.highlight}</span>
          </h2>
          <p className="text-[#A8A8A8] font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {content.about.storyParagraph1}
          </p>
          {content.about.storyParagraph2 && (
            <p className="text-[#A8A8A8] font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-4">
              {content.about.storyParagraph2}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex select-none items-center gap-2 px-7 py-3.5 rounded-full font-heading text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground transition hover:opacity-90 cursor-pointer"
            >
              {content.about.primaryButtonText}
            </a>
            <Link
              to="/classes"
              className="inline-flex select-none items-center gap-2 px-7 py-3.5 rounded-full font-heading text-sm font-bold uppercase tracking-wider bg-white/5 text-white border border-white/15 transition hover:bg-white/10 cursor-pointer"
            >
              {content.about.secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Free Trial Booking Section */}
      <section id="contact" className="relative py-24 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-heading uppercase tracking-[0.3em] text-[#D4AF37]">
              {content.contact.eyebrow}
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase text-white leading-tight">
              {content.contact.heading} <span className="text-[#D4AF37]">{content.contact.highlight}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-body leading-relaxed">
              {content.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-5 backdrop-blur-xl">
                <h3 className="font-heading text-2xl font-bold uppercase text-white">
                  {content.contact.dojoName}
                </h3>
                <p className="text-xs text-gray-400 font-body leading-relaxed">
                  {content.contact.dojoSubtitle}
                </p>

                <div className="space-y-4 pt-2 text-xs text-gray-300 font-body">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-heading text-gray-400">Email Address</p>
                      <a href={`mailto:${content.contact.email}`} className="text-white hover:text-[#D4AF37] transition-colors">
                        {content.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-heading text-gray-400">Head Master</p>
                      <p className="text-white">{content.contact.headMaster}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-heading text-gray-400">Dojo Training Hours</p>
                      <p className="text-white">{content.contact.trainingHours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trial Booking Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as any;
                  const name = form.student_name.value;
                  const phone = form.phone.value;
                  const email = form.email.value;
                  const program = form.program.value;
                  
                  import("@/api/base44Client").then(({ base44 }) => {
                    base44.entities.Lead.create({
                      name,
                      phone,
                      email,
                      program_interest: program,
                      stage: "trial",
                      source: "Website Trial Booking",
                      createdAt: new Date().toISOString()
                    });
                  });

                  import("sonner").then(({ toast }) => {
                    toast.success(`Osu! Free trial booked for ${name}!`, {
                      description: "Sensei Babu has received your details and will confirm your time slot."
                    });
                  });
                  form.reset();
                }}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4 backdrop-blur-xl"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-heading uppercase tracking-wider text-gray-300">
                    Student or Parent Full Name *
                  </label>
                  <input
                    name="student_name"
                    type="text"
                    placeholder="e.g. Liam Naidoo"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading uppercase tracking-wider text-gray-300">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      name="phone"
                      type="text"
                      placeholder="+27 82 ..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading uppercase tracking-wider text-gray-300">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="name@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-heading uppercase tracking-wider text-gray-300">
                    Program Selection
                  </label>
                  <select
                    name="program"
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Lionmode Kids (Ages 3–8)">Lionmode Kids (Ages 3–8)</option>
                    <option value="Little Lions (Ages 8–12)">Little Lions (Ages 8–12)</option>
                    <option value="Lionmode Teens (Ages 13–18)">Lionmode Teens (Ages 13–18)</option>
                    <option value="Adult Traditional Karate & Self-Defense">Adult Traditional Karate & Self-Defense</option>
                  </select>
                </div>

                <GoldButton type="submit" size="lg" className="w-full mt-2">
                  {content.contact.formButtonText}
                </GoldButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#080808] py-12 px-6 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center">
          {/* Black Icon Logo above email address */}
          <div className="relative group flex flex-col items-center justify-center mb-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
              <img
                src="/black-logo-icon.png"
                alt="Lionmode Karate Black Icon Logo"
                className="relative w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/lion-mode-logo.jpg";
                }}
              />
            </div>
            <span className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-white mt-2">
              {content.footer.brandName}
            </span>
            <span className="text-[10px] font-heading font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              {content.footer.brandSubtitle}
            </span>
          </div>

          {/* Email Address directly below the black icon logo */}
          <div className="space-y-1.5">
            <a
              href={`mailto:${content.footer.email}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 hover:text-[#D4AF37] font-body transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>{content.footer.email}</span>
            </a>
            <p className="text-xs text-gray-500 font-body">
              {content.footer.copyrightText}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-body text-gray-400">
              <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/privacy#deletion" className="hover:text-rose-400 transition-colors">Data Deletion</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* PWA Install Modal */}
      <InstallModal isOpen={isInstallOpen} onClose={() => setIsInstallOpen(false)} />
    </div>
  );
}
