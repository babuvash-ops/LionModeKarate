import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Mic, 
  BrainCircuit, 
  Sparkles,
  ArrowRight,
  Send,
  ShieldCheck,
  Terminal,
  Eraser,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';

// Lazy initialization for Gemini
let aiClient: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiClient) {
    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '';
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIHub({ branding }: any) {
  const [activeView, setActiveView] = useState<'voice' | 'chat'>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Tactical Intelligence Node online. Ready for martial arts protocols or operational queries." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = getAI();
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: `You are the ${branding?.dojoName || 'DOJO'} Strategic Intelligence Node.
          Operational Matrix Expertise:
          - Martial Arts Disciplines: Heian Shodan (Kata Mastery), Strike Velocity X (Sparring Dynamics), Precision Fundamentals (Fundamental Biomechanics).
          - Operational Modules: Master Manifest (Student Profiles), Rotation Protocols (Class Schedules), Asset Credits (Operational Payments), Strategic Events.
          - Protocol Navigation: Admin Protocol (Head of Command), Manager Protocol (Tactical Operations), Client Protocol (Parent/Student Engagement).
          Tone: Highly tactical, authoritative, and precise. Use phrasing like 'Operational Viability', 'Combat Readiness Matrix', and 'Strategic Deployment'.
          Constraints: Respond in plain text without markdown formatting. Keep answers concise and operational.`
        }
      });

      const reply = response.text || "Protocol failure. No signal received.";
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      toast.error("Neural link interrupted. Try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setResult(null);
    toast.info("Acoustic Capture Active. Speak your command.");
  };

  const simulateProcessing = () => {
    setIsRecording(false);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setResult("Processed Task: 'Schedule review for Student Marcus tomorrow at 2PM and alert parents regarding payment delay.'");
      toast.success("Intelligence Extracted Successfully.");
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-3xl p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col gap-6 py-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                 <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                 <h2 className="section-title italic tracking-tighter text-white">Neural Hub</h2>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 italic">Operational AI OS</p>
              </div>
           </div>

           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                onClick={() => setActiveView('chat')}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeView === 'chat' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                )}
              >
                Tactical Intel
              </button>
              <button 
                onClick={() => setActiveView('voice')}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeView === 'voice' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                )}
              >
                Acoustic Command
              </button>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {activeView === 'chat' ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col premium-card border-white/5 bg-black/40 overflow-hidden"
              >
                {/* Chat Display */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex flex-col max-w-[80%] gap-2",
                        m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                          {m.role === 'user' ? 'Admin Node' : 'Intelligence'}
                        </span>
                        {m.role === 'model' && <ShieldCheck className="w-3 h-3 text-primary/40" />}
                      </div>
                      <div className={cn(
                        "p-5 rounded-[24px] text-sm font-bold leading-relaxed",
                        m.role === 'user' 
                          ? "bg-primary text-black rounded-tr-none shadow-[0_10px_30px_rgba(212,175,55,0.2)]" 
                          : "bg-white/5 text-white/80 border border-white/5 rounded-tl-none italic"
                      )}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex flex-col items-start gap-2 max-w-[80%]">
                       <div className="flex items-center gap-2 px-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate">Processing Signal</span>
                          <Loader2 className="w-3 h-3 text-primary animate-spin" />
                       </div>
                       <div className="p-5 rounded-[24px] rounded-tl-none bg-white/5 border border-white/10">
                          <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                          </div>
                       </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                  <form onSubmit={handleSendMessage} className="relative group">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Input Tactical Query..."
                      className="w-full h-16 bg-black border border-white/5 focus:border-primary/40 rounded-2xl pl-6 pr-20 text-[11px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/10 outline-none transition-all shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Button 
                         type="button" 
                         variant="ghost" 
                         className="h-10 w-10 p-0 text-white/20 hover:text-white rounded-xl"
                         onClick={() => setMessages([{ role: 'model', content: "Memory buffer purged. Intelligence Node reset." }])}
                       >
                          <Eraser className="w-4 h-4" />
                       </Button>
                       <Button 
                         type="submit" 
                         disabled={!input.trim() || isTyping}
                         className="h-10 w-10 p-0 bg-primary text-black hover:bg-primary/80 rounded-xl"
                       >
                          <Send className="w-4 h-4" />
                       </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col justify-center gap-12"
              >
                {/* Voice Command UI */}
                <div className="premium-card border-primary/20 bg-primary/5 relative overflow-hidden group text-center">
                   <div className="absolute top-0 right-0 p-8 text-primary/10">
                      <Mic className="w-48 h-48 rotate-12" />
                   </div>
                   
                   <div className="relative z-10 flex flex-col items-center gap-10">
                      <div className="space-y-4">
                        <Badge className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em] px-6 py-2 border border-primary/20 rounded-full">Acoustic Logic Interface</Badge>
                        <h3 className="section-title uppercase italic tracking-tighter">Command Capture</h3>
                        <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                          Speak operational updates to update matrices automatically.
                        </p>
                      </div>

                      {!processing && !result && (
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={isRecording ? simulateProcessing : startRecording}
                           className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 relative ${
                             isRecording ? 'bg-rose-500 shadow-rose-500/40' : 'bg-primary shadow-primary/40'
                           }`}
                        >
                           {isRecording ? <div className="text-white font-black text-xs uppercase tracking-widest animate-pulse">TERMINATE</div> : <Mic className="w-16 h-16 text-black" />}
                           {isRecording && (
                             <div className="absolute inset-[-20px] border-4 border-rose-500/20 rounded-full animate-ping" />
                           )}
                        </motion.button>
                      )}

                      {processing && (
                        <div className="w-full max-w-md space-y-8">
                           <div className="flex items-center justify-center gap-4 mb-4">
                              <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
                              <span className="text-[12px] font-black text-primary uppercase tracking-[0.4em] italic">Deconstructing Signal Link...</span>
                           </div>
                           <Progress value={65} className="h-3 bg-white/5 rounded-full" indicatorClassName="bg-primary shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
                           <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] italic">Synthesizing Tactical Nodes</p>
                        </div>
                      )}

                      {result && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full bg-black border border-primary/30 p-10 rounded-[40px] space-y-8 shadow-2xl"
                        >
                           <div className="flex items-center justify-between border-b border-white/5 pb-6">
                             <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-3">
                               <Sparkles className="w-5 h-5" /> Logic Output
                             </span>
                             <button className="text-white/20 hover:text-white transition-colors" onClick={() => setResult(null)}>
                                <Eraser className="w-5 h-5" />
                             </button>
                           </div>
                           <p className="section-title leading-tight italic tracking-tight">
                             "{result}"
                           </p>
                           <div className="flex gap-4">
                              <Button className="flex-1 h-14 bg-primary text-black font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                Validate & Deploy
                              </Button>
                              <Button variant="outline" className="flex-1 h-14 border-white/10 text-white/40 hover:text-white font-black text-[11px] uppercase tracking-widest rounded-2xl">
                                Abort
                              </Button>
                           </div>
                        </motion.div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tactical Suggestions */}
        <div className="grid grid-cols-3 gap-6">
           {[
             { label: 'Injury Protocol', icon: ShieldCheck },
             { label: 'Kata Mastery', icon: Terminal },
             { label: 'Retention Strategy', icon: BrainCircuit }
           ].map((item, i) => (
             <button 
               key={i}
               onClick={() => {
                 setInput(`Explain ${item.label} training protocols.`);
                 setActiveView('chat');
               }}
               className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left"
             >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10">
                   <item.icon className="w-5 h-5 text-primary/60 group-hover:text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{item.label}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
