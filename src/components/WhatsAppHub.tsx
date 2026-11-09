import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  Search, 
  MoreVertical, 
  CheckCheck,
  User,
  Zap,
  Bot,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const chats: Chat[] = [
  { id: '1', name: 'Marcus Sterling', lastMessage: 'Is the 5 PM class still on?', time: '10:45 AM', unread: 2, online: true },
  { id: '2', name: 'Lead: Elena Rodriguez', lastMessage: 'The trial was amazing, thank you!', time: 'Yesterday', unread: 0, online: false },
  { id: '3', name: 'Parent: David Chen', lastMessage: 'Attached the medical form.', time: 'Monday', unread: 0, online: true },
];

export default function WhatsAppHub({ branding }: any) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [message, setMessage] = useState('');

  const templates = [
    { name: 'Trial Reminder', text: "Hi! We're excited for your trial session at the Dojo today! 🥋 Just a quick reminder to arrive 10 mins early. See you on the mats!" },
    { name: 'Payment Due', text: "Attention. Our systems indicate a payment delay on your account. 💰 Please settle this to maintain active operational status. Let us know if you need help." },
    { name: 'New Rank', text: "Congratulations on your new rank! 🏆 Your hard work and discipline are showing. Keep pushing boundaries!" },
    { name: 'Trial Follow-up', text: "Great work in your trial today! 🔥 Ready to begin your journey? Reply 'STRIVE' to see our membership tiers." }
  ];

  const handleTemplateSelect = (text: string) => {
    setMessage(text);
  };

  const handleInitiateComms = (name: string) => {
    toast.info(`Opening secure channel to ${name}...`);
    if (branding?.whatsappNumber) {
        window.open(`https://wa.me/${branding.whatsappNumber.replace(/\D/g, '')}`, '_blank');
    }
  };

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl overflow-hidden">
      <div className="w-full md:w-96 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white italic">WhatsApp Hub</h2>
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mt-1">Direct Comms Online</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
              placeholder="Scan Conversations..." 
              className="h-12 bg-white/5 border-white/10 pl-11 rounded-2xl text-xs font-bold text-white focus:border-primary tracking-widest"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "w-full p-6 flex items-start gap-4 transition-all border-b border-white/5",
                selectedChat?.id === chat.id ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-white/5"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center border border-white/10 overflow-hidden">
                  <User className="w-6 h-6 text-white/20" />
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[13px] font-black text-white uppercase tracking-wider truncate">{chat.name}</h3>
                  <span className="text-[9px] font-bold text-white/20 uppercase shrink-0">{chat.time}</span>
                </div>
                <p className="text-[11px] font-medium text-white/40 mt-1 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-black">{chat.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col relative">
        {selectedChat ? (
          <>
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-white/10">
                  <User className="w-5 h-5 text-white/20" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{selectedChat.name}</h3>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">
                    {selectedChat.online ? 'Active Now' : 'Encrypted Signal'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-white/10 text-white/40 h-10 px-4 rounded-xl hover:text-primary hover:border-primary/40">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-8 flex flex-col custom-scrollbar">
              <div className="flex justify-center">
                 <Badge className="bg-white/5 text-white/20 text-[9px] font-black uppercase tracking-[0.3em] py-1 px-4 rounded-full border border-white/10">
                   Today, 10:45 AM
                 </Badge>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-end gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center border border-white/10 shrink-0">
                    <User className="w-4 h-4 text-white/20" />
                  </div>
                  <div className="bg-secondary/20 border border-white/10 p-5 rounded-[24px] rounded-bl-none">
                    <p className="text-sm font-bold text-white/80 leading-relaxed">
                      Hey Instructor! Is the 5 PM sparring class still happening today considering the rain? 🥋☔
                    </p>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2 block">10:45 AM</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 self-end max-w-[80%]">
                  <div className="bg-primary text-black p-5 rounded-[24px] rounded-br-none shadow-xl shadow-primary/10">
                    <p className="text-sm font-black leading-relaxed">
                      Affirmative Marcus! All operations are indoor today. We maintain maximum intensity regardless of conditions. See you on the mats! 🔥
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2 group">
                      <span className="text-[9px] font-black uppercase tracking-widest">10:47 AM</span>
                      <CheckCheck className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* AI Suggestion Bubble */}
                <div className="self-center w-full max-w-md pt-8">
                   <div className="premium-card bg-primary/5 border-primary/20 p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest italic">AI Quick Response</h4>
                        <p className="text-[11px] font-bold text-white/60 mt-1">The student just confirmed attendance. Should I mark them checked in?</p>
                      </div>
                      <Button className="h-10 bg-primary/20 hover:bg-primary text-primary hover:text-black font-black text-[9px] uppercase tracking-widest rounded-xl transition-all">
                        Execute
                      </Button>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-2 px-4 shadow-inner focus-within:border-primary transition-all">
                <Button variant="ghost" className="h-10 w-10 text-white/40 hover:text-primary p-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input 
                  placeholder="Transmit Message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-bold placeholder:text-white/20 tracking-wider h-12"
                />
                <Button variant="ghost" className="h-10 w-10 text-white/40 hover:text-primary p-0">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button className="h-10 w-10 btn-primary rounded-xl p-0 shadow-lg shadow-primary/20">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic shrink-0">Templates:</span>
                 {templates.map((t) => (
                   <Button 
                    key={t.name} 
                    variant="outline" 
                    onClick={() => handleTemplateSelect(t.text)}
                    className="h-8 border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:border-primary/40 rounded-full px-4 shrink-0 transition-all active:scale-95"
                   >
                     {t.name}
                   </Button>
                 ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row divide-x divide-white/5 bg-black/20">
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 rounded-[40px] bg-secondary/20 flex items-center justify-center border border-white/5 mb-8 animate-pulse">
                <Zap className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Signal Search Initiated</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-3">Select a target conversation to begin encryption</p>
            </div>

            <div className="hidden lg:flex w-80 flex-col p-6 space-y-8 bg-black/40">
               <div>
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic mb-4">Strategic Follow-ups</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'James Wilson', stage: 'New Lead', signal: 'Web High engagement', alert: 'rose-500' },
                      { name: 'Elena Rodriguez', stage: 'Trial Done', signal: 'Ready to convert', alert: 'emerald-500' },
                      { name: 'David Chen', stage: 'Active', signal: 'Payment Overdue', alert: 'rose-500' },
                    ].map((lead, i) => (
                      <div key={i} className="premium-card space-y-3 group cursor-pointer hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between">
                          <span className={`w-2 h-2 rounded-full bg-${lead.alert}`} />
                          <Badge variant="outline" className="text-[8px] font-black border-white/5 text-white/40">{lead.stage}</Badge>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-wider">{lead.name}</p>
                          <p className="text-[9px] font-bold text-white/30 uppercase mt-1 italic">{lead.signal}</p>
                        </div>
                        <Button 
                          onClick={() => handleInitiateComms(lead.name)}
                          className="w-full h-8 bg-primary/10 hover:bg-primary text-primary hover:text-black text-[8px] font-black uppercase tracking-widest rounded-lg"
                        >
                          Initiate Comms
                        </Button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
