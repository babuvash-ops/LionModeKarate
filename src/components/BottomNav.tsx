import { motion } from 'motion/react';
import { 
  Home, 
  Users, 
  PlayCircle, 
  Calendar, 
  Settings,
  LayoutDashboard,
  Target,
  MessageSquare,
  Shield,
  ShoppingBag,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavTab = string;

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: any) => void;
  user?: any;
}

export default function BottomNav({ activeTab, setActiveTab, user }: BottomNavProps) {
  const publicNavItems = [
    { id: 'home', label: 'HUB', icon: Home },
    { id: 'programs', label: 'OPS', icon: Shield },
    { id: 'events', label: 'INTEL', icon: Calendar },
    { id: 'about', label: 'PHIL', icon: Target },
    { id: 'contact', label: 'COMMS', icon: MessageSquare },
    { id: 'login', label: 'AUTH', icon: ShieldCheck },
  ];

  const privateNavItems = [
    { id: 'dashboard', label: 'CMD', icon: Home },
    { id: 'students', label: 'UNIT', icon: Users },
    { id: 'schedule', label: 'MATRIX', icon: Calendar },
    { id: 'training', label: 'TAC', icon: PlayCircle },
    { id: 'shop', label: 'DEPOT', icon: ShoppingBag },
    { id: 'payments', label: 'CREDIT', icon: CreditCard },
  ];

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] w-full flex justify-center pointer-events-none pb-6 md:pb-10">
      <nav className="p-1 md:p-1.5 flex items-center bg-secondary/80 backdrop-blur-3xl rounded-full border border-border/50 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] pointer-events-auto mx-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative h-10 md:h-12 flex items-center justify-center transition-all duration-500 rounded-full group outline-none",
                isActive 
                  ? "bg-primary px-5 md:px-6 shadow-[0_0_20px_rgba(251,191,36,0.3)] w-auto" 
                  : "w-10 md:w-16 hover:bg-primary/5"
              )}
            >
              <div className={cn(
                "flex items-center gap-2.5 relative z-10",
                isActive ? "text-primary-foreground" : "text-muted-foreground/30 group-hover:text-primary"
              )}>
                <item.icon className={cn("w-4 h-4 transition-transform", isActive ? "stroke-[2.5px] scale-110" : "group-hover:scale-110")} />
                {isActive && (
                  <span className="font-heading text-[10px] font-bold uppercase tracking-widest italic whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-white/10 rounded-full pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
