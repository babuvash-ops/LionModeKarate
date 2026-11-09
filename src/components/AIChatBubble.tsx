import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Flame, 
  Calendar, 
  RotateCcw,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import ChatBotIcon from '@/components/shared/ChatBotIcon';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const QUICK_SUGGESTIONS = [
  { label: "Class Schedule", text: "What classes are scheduled today at Lionmode Karate?" },
  { label: "Kata Drill", text: "Sensei, give me a quick 5-minute footwork drill for Heian Shodan." },
  { label: "Sparring Tip", text: "How do I maintain guard distance when countering a reverse punch?" },
  { label: "Belt Requirements", text: "What are the core testing requirements for Green Belt?" }
];

export default function AIChatBubble() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Osu! I am your Dojo Sensei & Assistant. How can I assist your training or schedule today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = textToSend;
    if (!overrideText) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
              role: m.role,
              content: m.content
            })),
            model: 'gemini-3.8-flash',
            studentContext
          })
        });

        if (res.ok) {
          data = await res.json();
        }
      } catch (err: any) {
        console.warn('[CHAT_BUBBLE] Upstream server call bypassed, routing to Sensei Core:', err);
      }

      if (!data || !data.content) {
        const { generateSenseiResponse } = await import('@/lib/senseiEngine');
        data = generateSenseiResponse(
          [...messages, { role: 'user', content: userMessage }],
          studentContext
        );
      }

      setMessages(prev => [...prev, { role: 'model', content: data.content }]);
    } catch (err: any) {
      console.error('[CHAT_BUBBLE] Error:', err);
      const { generateSenseiResponse } = await import('@/lib/senseiEngine');
      const fallback = generateSenseiResponse(
        [...messages, { role: 'user', content: userMessage }],
        studentContext
      );
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: fallback.content
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLast = () => {
    const lastModel = [...messages].reverse().find(m => m.role === 'model');
    if (lastModel) {
      navigator.clipboard.writeText(lastModel.content);
      setCopied(true);
      toast.success('Copied Sensei instruction');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 64 : 520,
              width: "min(calc(100vw - 32px), 390px)"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 flex flex-col overflow-hidden pointer-events-auto bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/60 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0 group">
                  <ChatBotIcon className="w-full h-full" glow />
                </div>
                <div>
                  <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    Sensei Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-body">
                    Lion Mode Karate AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  to="/sensei"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-[#D4AF37] hover:bg-white/5 transition-all"
                  title="Open Full Sensei Hub"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition-all"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Feed */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent text-xs"
                >
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'model' && (
                        <div className="w-7 h-7 rounded-lg bg-black border border-[#D4AF37]/50 flex items-center justify-center p-1 shadow-sm shrink-0 mt-0.5">
                          <ChatBotIcon className="w-full h-full" />
                        </div>
                      )}
                      <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                        <div
                          className={`p-3.5 rounded-2xl leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black font-medium rounded-tr-none shadow-md'
                              : 'bg-white/[0.06] border border-white/10 text-white/90 rounded-tl-none shadow-sm'
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-body">
                            {m.content}
                          </div>
                        </div>
                        <span className="text-[9px] text-white/30 uppercase tracking-wider mt-1 px-1">
                          {m.role === 'user' ? (profile?.displayName || 'Student') : 'Sensei'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 w-fit">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                      <span className="text-[11px] text-[#D4AF37] font-heading uppercase tracking-wider">
                        Formulating instruction...
                      </span>
                    </div>
                  )}
                </div>

                {/* Suggestions Carousel */}
                <div className="p-2.5 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/10 bg-black/30">
                  {QUICK_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s.text)}
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/50 text-[10px] font-medium text-white/70 hover:text-white transition-all active:scale-95 whitespace-nowrap"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white/[0.02] border-t border-white/10">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Sensei for advice or schedules..."
                      disabled={isLoading}
                      className="w-full bg-white/[0.05] border border-white/15 focus:border-[#D4AF37] rounded-2xl py-3 pl-4 pr-11 text-xs text-white placeholder-white/40 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#FFB800] text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 transition-all font-bold"
                      aria-label="Send query"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isOpen) setIsMinimized(false);
          setIsOpen(!isOpen);
        }}
        aria-label="Open Sensei AI Assistant"
        className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/40 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center relative pointer-events-auto group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFB800]/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
        {isOpen ? (
          <X className="w-6 h-6 text-white/80 group-hover:text-rose-400 transition-colors" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <ChatBotIcon className="w-7 h-7 transform group-hover:scale-110 transition-transform" glow />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
            </div>
            <span className="text-[8px] font-heading font-bold uppercase tracking-widest text-[#D4AF37] mt-0.5 leading-none">
              Sensei
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
