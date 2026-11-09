import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Calendar, 
  Flame, 
  Shield, 
  Zap, 
  Compass, 
  Bookmark, 
  ChevronRight,
  BookOpen,
  MessageSquare,
  ExternalLink,
  ArrowUpRight,
  Layers,
  Dumbbell
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import HeroBanner from '@/components/shared/HeroBanner';
import GoldButton from '@/components/shared/GoldButton';
import ChatBotIcon from '@/components/shared/ChatBotIcon';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
  modelUsed?: string;
}

export interface QuickPromptItem {
  id: string;
  category: 'all' | 'navigation' | 'technique';
  icon: React.ElementType;
  title: string;
  badge: string;
  prompt: string;
  route?: string;
  routeLabel?: string;
}

const QUICK_PROMPTS: QuickPromptItem[] = [
  {
    id: 'schedule',
    category: 'navigation',
    icon: Calendar,
    title: "Check Class Schedule",
    badge: "Schedule",
    prompt: "Sensei, please share this week's Dojo class schedule and recommend which sessions I should attend for my skill level.",
    route: '/classes',
    routeLabel: 'Open Schedule'
  },
  {
    id: 'belts',
    category: 'navigation',
    icon: Shield,
    title: "Explain Belt Requirements",
    badge: "Syllabus",
    prompt: "Sensei, what are the specific technical syllabus and kata requirements to qualify and test for the next karate belt rank?",
    route: '/dashboard',
    routeLabel: 'Belt Roadmap'
  },
  {
    id: 'events',
    category: 'navigation',
    icon: Flame,
    title: "View Upcoming Events",
    badge: "Events",
    prompt: "What upcoming tournaments, belt promotion ceremonies, and special training clinics are scheduled at Lionmode Karate?",
    route: '/events',
    routeLabel: 'Events Calendar'
  },
  {
    id: 'kata',
    category: 'technique',
    icon: Compass,
    title: "Kata Biomechanics",
    badge: "Geometry",
    prompt: "Sensei, break down the transition between front stance (zenkutsu-dachi) and back stance (kokutsu-dachi) in Heian Nidan. What are the common hip mistakes?"
  },
  {
    id: 'kumite',
    category: 'technique',
    icon: Zap,
    title: "Kumite Sparring Reflexes",
    badge: "Timing",
    prompt: "I want to improve my counter-punch timing (Gyaku-tsuki) against a rushing opponent. Give me a 3-stage partner drill and solo shadow drill."
  },
  {
    id: 'conditioning',
    category: 'technique',
    icon: Dumbbell,
    title: "Stance & Core Power",
    badge: "Conditioning",
    prompt: "Sensei, design a 15-minute karate conditioning routine for explosive leg power in kiba-dachi and core stability."
  }
];

export default function SenseiChatPage() {
  const navigate = useNavigate();
  const { user, profile, openAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'navigation' | 'technique'>('all');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `**Osu! Welcome to the Sensei Chamber.** 🥋\n\nI am your **Dojo Sensei and Technical Advisor** for Lionmode Karate. Whether you are refining your kata geometry, preparing for kumite, conditioning for your next belt rank, or inquiring about class schedules, I am here to guide your path with precision.\n\nHow may I direct your training today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    const studentContext = profile ? {
      name: profile.displayName || user?.displayName,
      belt: profile.belt || 'White Belt',
      rank: profile.rank || 'Beginner'
    } : null;

    try {

      let data: any = null;
      try {
        const { getApiUrl } = await import('@/lib/apiEndpoint');
        const endpoint = window.location.hostname.includes('run.app') || window.location.hostname === 'localhost'
          ? '/api/gemini/chat'
          : getApiUrl('/api/gemini/chat');

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
            model: selectedModel,
            studentContext
          })
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (networkErr) {
        console.warn('[SENSEI] Upstream server call bypassed, routing to Sensei Core:', networkErr);
      }

      // If server response wasn't received (CORS, 302, offline, or static cPanel host), synthesize with Sensei Intelligence Engine!
      if (!data || !data.content) {
        const { generateSenseiResponse } = await import('@/lib/senseiEngine');
        data = generateSenseiResponse([...messages, userMsg], studentContext);
      }

      const modelMsg: Message = {
        role: 'model',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel
      };

      setMessages(prev => [...prev, modelMsg]);

      // If user is logged in, auto-save / update chat session in Firestore
      if (user) {
        try {
          await base44.entities.ChatSession.create({
            userId: user.uid,
            title: textToSend.slice(0, 45) + (textToSend.length > 45 ? '...' : ''),
            model: data.modelUsed || selectedModel,
            messages: [...messages, userMsg, modelMsg]
          });
        } catch (e) {
          console.warn('[FIRESTORE] Auto-save session error:', e);
        }
      }
    } catch (err: any) {
      console.error('[SENSEI] Unexpected error:', err);
      const { generateSenseiResponse } = await import('@/lib/senseiEngine');
      const fallback = generateSenseiResponse([...messages, userMsg], studentContext);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: fallback.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: fallback.modelUsed
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success('Copied drill notes to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveToProfile = async (content: string, index: number) => {
    if (!user) {
      openAuthModal('Sign in to save this training drill to your permanent student record');
      return;
    }
    try {
      await base44.entities.ChatSession.create({
        userId: user.uid,
        title: 'Saved Sensei Drill',
        savedAt: new Date().toISOString(),
        content
      });
      setSavedIndex(index);
      toast.success('Drill saved to your Dojo Passport!');
      setTimeout(() => setSavedIndex(null), 2500);
    } catch (e) {
      toast.error('Failed to save drill');
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'model',
        content: `**Osu! The training mat has been cleared.** 🥋 What martial concept or drill would you like to master next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <HeroBanner 
        slot="hero_sensei" 
        title="Dojo Sensei AI" 
        subtitle="Technical Advisor for Kata, Sparring Tactics, Drills & Schedules" 
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            {/* Black Chat Bot Block with Gold Chat Bot Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-md rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/60 flex items-center justify-center p-2 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                <ChatBotIcon className="w-full h-full transform group-hover:scale-110 transition-transform" glow />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base font-bold uppercase tracking-wider text-white">
                  Sensei Technical Advisor
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  Lion Mode
                </span>
              </div>
              <p className="text-xs text-white/50">
                {profile ? `${profile.displayName} • ${profile.belt || 'White Belt'}` : 'Guest Explorer Mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Selector */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <label htmlFor="model-select" className="sr-only">AI Model</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-white/90 outline-none cursor-pointer text-xs"
              >
                <option value="gemini-3.8-flash" className="bg-[#111] text-white">Gemini 3.8 Flash (Recommended)</option>
                <option value="gemini-3.1-flash-lite" className="bg-[#111] text-white">Gemini 3.1 Flash Lite (Fastest)</option>
                <option value="gemini-4-argon" className="bg-[#111] text-white">Gemini 4 Argon (Deep Analysis)</option>
              </select>
            </div>

            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs flex items-center gap-1.5"
              title="Clear dialogue"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Quick Prompts Hero Grid (Shown on start or when dialogue is concise) */}
        {messages.length <= 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-wider font-heading text-white/60 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Common Sensei Requests
              </span>
              <span className="text-[11px] text-[#D4AF37]/90 font-medium">Direct Dojo Guidance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {QUICK_PROMPTS.map((qp) => (
                <div
                  key={qp.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 text-left transition-all group flex flex-col justify-between hover:shadow-[0_4px_24px_rgba(212,175,55,0.08)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center group-hover:bg-[#D4AF37]/25 transition-colors">
                          <qp.icon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <span className="font-heading text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                          {qp.title}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-mono">
                        {qp.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/55 line-clamp-2 leading-relaxed mb-3">
                      {qp.prompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2.5 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleSend(qp.prompt)}
                      disabled={isLoading}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37]/15 border border-white/10 hover:border-[#D4AF37]/40 text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-all font-heading uppercase tracking-wider text-[11px]"
                    >
                      <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                      Ask Sensei
                    </button>
                    {qp.route && (
                      <button
                        type="button"
                        onClick={() => navigate(qp.route!)}
                        title={qp.routeLabel || `Navigate to ${qp.title}`}
                        className="py-1.5 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center gap-1 transition-all text-[11px] font-heading uppercase tracking-wider"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="hidden sm:inline">{qp.routeLabel || 'Open'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation Thread */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-4 sm:p-6 min-h-[460px] max-h-[640px] overflow-y-auto space-y-5 backdrop-blur-sm">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    user?.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-[#D4AF37]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFB800] text-black font-bold flex items-center justify-center text-xs">
                        {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                      </div>
                    )
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/60 flex items-center justify-center shadow-md p-1.5 shrink-0">
                      <ChatBotIcon className="w-full h-full" glow />
                    </div>
                  )}
                </div>

                {/* Bubble Container */}
                <div className="space-y-1.5">
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#FFB800] text-black font-medium rounded-tr-none shadow-lg'
                        : 'bg-white/[0.05] border border-white/10 text-white/90 rounded-tl-none shadow-md backdrop-blur-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-body text-xs sm:text-sm space-y-2">
                      {msg.content}
                    </div>
                  </div>

                  {/* Footnote / Action Buttons for Model responses */}
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-3 px-1 text-[11px] text-white/40">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && <span className="opacity-60">• {msg.modelUsed}</span>}
                      
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="hover:text-white transition-colors flex items-center gap-1 ml-2"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSaveToProfile(msg.content, idx)}
                        className="hover:text-white transition-colors flex items-center gap-1"
                        title="Save to profile"
                      >
                        {savedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-[#D4AF37]" />
                            <span className="text-[#D4AF37]">Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3 h-3" />
                            <span>Save Drill</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/60 flex items-center justify-center p-1.5 shrink-0 animate-pulse">
                <ChatBotIcon className="w-full h-full" glow />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white/[0.05] border border-white/10 flex items-center gap-3">
                <span className="text-xs text-[#D4AF37] font-heading uppercase tracking-wider animate-pulse flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Sensei is formulating instruction...
                </span>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Tray (Always docked above input bar for rapid access) */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-2.5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Zap className="w-3 h-3" />
              </div>
              <span className="font-heading text-xs uppercase font-bold tracking-wider text-white/90">
                Quick Prompts Tray
              </span>
              <span className="text-[10px] text-white/40 hidden sm:inline">• Tap to ask Sensei or jump to portal</span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('navigation')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider transition-all ${
                  activeCategory === 'navigation'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Dojo Navigation
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('technique')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider transition-all ${
                  activeCategory === 'technique'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Techniques
              </button>
            </div>
          </div>

          {/* Scrollable button tray */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
            {QUICK_PROMPTS.filter(p => activeCategory === 'all' || p.category === activeCategory).map((qp) => (
              <div
                key={qp.id}
                className="group shrink-0 flex items-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D4AF37]/50 transition-all p-1 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-left transition-colors"
                  title={qp.prompt}
                >
                  <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center group-hover:bg-[#D4AF37]/30 transition-colors shrink-0">
                    <qp.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                    {qp.title}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[#D4AF37]/80 shrink-0">
                    {qp.badge}
                  </span>
                </button>

                {qp.route && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(qp.route!);
                    }}
                    title={qp.routeLabel || `Navigate to ${qp.title}`}
                    className="p-1.5 mr-1 rounded-lg hover:bg-[#D4AF37]/20 text-white/40 hover:text-[#D4AF37] transition-all border border-transparent hover:border-[#D4AF37]/30"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sensei about stances, sparring counters, belt exams, or dojo schedules..."
            disabled={isLoading}
            className="flex-1 bg-white/[0.04] border border-white/15 focus:border-[#D4AF37] rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-white/40 outline-none transition-all focus:ring-1 focus:ring-[#D4AF37]/40 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-md font-bold"
            aria-label="Send message to Sensei"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Public explorer banner if not logged in */}
        {!user && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs">
            <div className="flex items-center gap-3 text-white/80">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>You are exploring in guest mode. Sign in to save drill routines & synchronize your belt ranking.</span>
            </div>
            <button
              onClick={() => openAuthModal('Sign in with Google to synchronize your Sensei training records')}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all shrink-0 uppercase tracking-wider text-[11px] font-heading"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
