import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Play, 
  Calendar, 
  Shield, 
  DollarSign, 
  UserPlus, 
  LayoutGrid, 
  Tv, 
  ShoppingBag, 
  X, 
  Flame, 
  Globe, 
  BookOpen, 
  Bot, 
  Package, 
  ClipboardList,
  LogOut,
  LogIn,
  Sparkles,
  Download
} from "lucide-react";
import InstallModal from "@/components/shared/InstallModal";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import DojoLogo from "@/components/shared/DojoLogo";
import ChatBotIcon from "@/components/shared/ChatBotIcon";

const menuGroups = [
  { title: "Main", items: [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/sensei", icon: ChatBotIcon, label: "Sensei AI Hub", badge: "AI" },
    { path: "/students", icon: Users, label: "Students" },
    { path: "/videos", icon: Play, label: "Video Library" },
    { path: "/events", icon: Calendar, label: "Events" },
  ]},
  { title: "Operations", items: [
    { path: "/classes", icon: LayoutGrid, label: "Classes" },
    { path: "/instructor", icon: BookOpen, label: "Instructor Portal" },
    { path: "/invoices", icon: DollarSign, label: "Invoices" },
    { path: "/leads", icon: UserPlus, label: "CRM / Leads" },
  ]},
  { title: "Tools", items: [
    { path: "/trial", icon: Flame, label: "VIP Trial Funnel", badge: "Funnel" },
    { path: "/admin", icon: Shield, label: "Command Center" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/orders", icon: ClipboardList, label: "Orders" },
    { path: "/shop", icon: ShoppingBag, label: "Pro Shop" },
    { path: "/tv", icon: Tv, label: "TV Mode" },
  ]},
];

export default function Sidebar({ open, onClose }: any) {
  const location = useLocation();
  const { user, profile, signOut, openAuthModal, isParent, authorizedStudentId } = useAuth();
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

  const activeGroups = isParent ? [
    { title: "Parent Portal", items: [
      { path: "/dashboard", icon: Home, label: "My Member Portal" },
      { path: `/students/${authorizedStudentId || 'std-1'}`, icon: Shield, label: "Child's Passport" },
      { path: "/sensei", icon: ChatBotIcon, label: "Sensei AI Hub", badge: "AI" },
    ]},
    { title: "Training & Dojo", items: [
      { path: "/classes", icon: LayoutGrid, label: "Class Schedule" },
      { path: "/videos", icon: Play, label: "Curriculum Videos" },
      { path: "/events", icon: Calendar, label: "Events & Testing" },
      { path: "/shop", icon: ShoppingBag, label: "Pro Shop Gear" },
    ]}
  ] : menuGroups;

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40">
        <div className="p-4 border-b border-border bg-black/40 backdrop-blur-md">
          <DojoLogo size="lg" href="/" />
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {activeGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-2 px-3">{group.title}</p>
              <div className="space-y-1">
                {group.items.map(({ path, icon: Icon, label, badge }: any) => {
                  const isActive = location.pathname.startsWith(path);
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-body transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-heading uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Auth Section */}
        <div className="p-4 border-t border-border space-y-2">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-primary/50" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-heading font-bold text-xs">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{user.displayName || 'Warrior'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{profile?.belt || 'Member'}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-background transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('Sign in to link your belt passport & saved AI drills')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-heading uppercase tracking-wider font-semibold transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Google Sign-In</span>
            </button>
          )}

          <button
            onClick={handleInstallClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading uppercase tracking-wider text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 hover:bg-[#FFB800]/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FFB800]" />
            <span>{isInstalled ? "App Installed" : "Install App"}</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 md:hidden overflow-y-auto flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-border bg-black/40 backdrop-blur-md">
                <DojoLogo size="md" href="/" onClick={onClose} />
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-6">
                {activeGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-2 px-3">{group.title}</p>
                    <div className="space-y-1">
                      {group.items.map(({ path, icon: Icon, label, badge }: any) => {
                        const isActive = location.pathname.startsWith(path);
                        return (
                          <Link
                            key={path}
                            to={path}
                            onClick={onClose}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-body transition-all ${
                              isActive
                                ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4" />
                              <span>{label}</span>
                            </div>
                            {badge && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-heading uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                                {badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-border space-y-2">
                {user ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-primary/50" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-heading font-bold text-xs">
                          {user.displayName?.[0] || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{user.displayName || 'Warrior'}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{profile?.belt || 'Member'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-background transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      openAuthModal('Sign in to link your belt passport & saved AI drills');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-heading uppercase tracking-wider font-semibold transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Google Sign-In</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    handleInstallClick();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading uppercase tracking-wider text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 hover:bg-[#FFB800]/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#FFB800]" />
                  <span>{isInstalled ? "App Installed" : "Install App"}</span>
                </button>

                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Back to Website</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* PWA Install Modal */}
      <InstallModal isOpen={isInstallOpen} onClose={() => setIsInstallOpen(false)} />
    </>
  );
}
