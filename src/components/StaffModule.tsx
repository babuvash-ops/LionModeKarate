import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Zap, 
  Trash2, 
  Edit3, 
  Search,
  CheckCircle2,
  XCircle,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Target,
  Activity,
  Plus,
  Crown,
  Medal,
  Dumbbell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import GoldButton from './shared/GoldButton';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'manager' | 'admin';
  permissions?: string[];
  photoUrl?: string;
  specialization?: string;
  rank?: string;
  status: 'active' | 'on-leave' | 'deployed';
}

const PERMISSION_OPTIONS = [
  'Students', 'Payments', 'Attendance', 'Events', 
  'Videos', 'Messaging', 'Belt Grading', 'Reports', 
  'Staff', 'Inventory', 'Marketing'
];

export default function StaffModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  // Dummy Initial Data for Force Personnel
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', name: 'Master Kenji', email: 'kenji@dojo.hq', role: 'admin', rank: '7th Dan Black Belt', specialization: 'Combat Strategy', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'Commander Sarah', email: 'sarah@dojo.hq', role: 'manager', rank: '4th Dan Black Belt', specialization: 'Operations', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Instructor Mike', email: 'mike@dojo.hq', role: 'instructor', rank: '2nd Dan Black Belt', specialization: 'Youth Division', status: 'deployed', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  ]);

  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    email: '',
    role: 'instructor',
    permissions: [],
    specialization: '',
    rank: 'Black Belt',
    status: 'active'
  });

  const handleSaveStaff = () => {
    if (!formData.name || !formData.email) {
      toast.error('Identity Identification Required.');
      return;
    }

    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...formData } as StaffMember : s));
      toast.success('Force Personnel Records Updated.');
    } else {
      const newStaff: StaffMember = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        name: formData.name || '',
        email: formData.email || '',
        role: formData.role || 'instructor',
        status: 'active'
      };
      setStaff([...staff, newStaff]);
      toast.success('Elite Personnel Mobilized.');
    }
    setIsAddDialogOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'instructor',
      permissions: [],
      specialization: '',
      rank: 'Black Belt',
      status: 'active'
    });
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
    toast.success('Personnel Decommissioned.');
  };

  const togglePermission = (permission: string) => {
    const currentPermissions = formData.permissions || [];
    if (currentPermissions.includes(permission)) {
      setFormData({ ...formData, permissions: currentPermissions.filter(p => p !== permission) });
    } else {
      setFormData({ ...formData, permissions: [...currentPermissions, permission] });
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="relative group flex-1 max-w-xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="SCAN_FORCE_PERSONNEL..." 
            className="w-full h-16 bg-secondary/30 border border-border/50 focus:bg-secondary/50 focus:border-primary/20 pl-16 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.3em] text-foreground italic outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <GoldButton 
          size="md"
          className="h-16 px-10 rounded-[24px]"
          onClick={() => { setEditingStaff(null); setFormData({ role: 'instructor', permissions: [], status: 'active' }); setIsAddDialogOpen(true); }}
        >
          <UserPlus className="w-5 h-5 mr-3" /> Mobilize Personnel
        </GoldButton>
      </div>

      {/* Force Registry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStaff.map((person, idx) => (
            <motion.div
              key={person.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <Card className="premium-card h-full border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all rounded-[45px] overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 z-20">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-2 border shadow-xl italic rounded-full",
                    person.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 
                    person.role === 'manager' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  )}>
                    {person.role === 'admin' ? <Crown className="w-3 h-3 mr-2" /> : <Medal className="w-3 h-3 mr-2" />}
                    {person.role}
                  </Badge>
                </div>

                <div className="p-10 space-y-10 h-full flex flex-col">
                  {/* Persona Header */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-[32px] overflow-hidden border-[6px] border-background shadow-2xl relative z-10 bg-secondary group-hover:scale-110 transition-transform duration-700">
                        <img 
                          src={person.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`} 
                          alt={person.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary flex items-center justify-center border-4 border-background z-20 shadow-xl group-hover:rotate-12 transition-transform">
                        <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-3xl font-heading font-bold text-foreground leading-none tracking-tight group-hover:text-primary transition-colors uppercase italic">{person.name}</h4>
                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] italic">{person.email}</p>
                    </div>
                  </div>

                  {/* Tactical Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[28px] bg-background/40 border border-border/10 flex flex-col items-center text-center justify-center group-hover:border-primary/10 transition-all">
                       <p className="text-[8px] font-bold text-primary uppercase tracking-[0.4em] mb-2 italic leading-none">Seniority</p>
                       <p className="text-[11px] font-bold text-foreground uppercase tracking-tight italic leading-none">{person.rank || 'N/A'}</p>
                    </div>
                    <div className="p-6 rounded-[28px] bg-background/40 border border-border/10 flex flex-col items-center text-center justify-center group-hover:border-primary/10 transition-all">
                       <p className="text-[8px] font-bold text-primary uppercase tracking-[0.4em] mb-2 italic leading-none">Ops_Sector</p>
                       <p className="text-[11px] font-bold text-foreground uppercase tracking-tight italic leading-none truncate w-full">{person.specialization || 'Tactical'}</p>
                    </div>
                  </div>

                  {/* Sector Access */}
                  {person.permissions && person.permissions.length > 0 && (
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em] italic">Access_Clearances</p>
                         <div className="h-[1px] flex-1 mx-4 bg-muted-foreground/5" />
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {person.permissions.slice(0, 3).map(p => (
                            <Badge key={p} variant="ghost" className="bg-secondary/50 border border-border/10 text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 italic text-muted-foreground/40">
                              {p}
                            </Badge>
                          ))}
                          {person.permissions.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[8px] font-bold text-primary italic">
                              +{person.permissions.length - 3}
                            </div>
                          )}
                       </div>
                    </div>
                  )}

                  <div className="mt-auto pt-8 flex gap-4 border-t border-border/10">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-14 rounded-2xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground font-bold uppercase text-[9px] tracking-widest transition-all italic border border-border/30"
                      onClick={() => { setEditingStaff(person); setFormData(person); setIsAddDialogOpen(true); }}
                    >
                      <Edit3 className="w-4 h-4 mr-3" /> Edit Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-14 w-14 rounded-2xl bg-secondary/50 border border-border/30 text-rose-500 hover:bg-rose-500/10 transition-all shadow-sm"
                      onClick={() => handleDeleteStaff(person.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Force Deployment Notice */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 rounded-[50px] bg-secondary/10 border border-border/50 text-foreground relative overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center gap-10"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
        <div className="w-20 h-20 rounded-[30px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_10px_30px_rgba(244,224,47,0.2)] shrink-0">
          <Activity className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-3 text-center md:text-left relative z-10">
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic leading-none mb-1">Personnel Ops Dashboard v1.4</p>
           <h5 className="text-2xl font-heading font-bold text-foreground uppercase italic tracking-tight leading-none mb-2 underline decoration-primary/30">System Status: Integrity Nominal</h5>
           <p className="text-sm font-medium text-muted-foreground/60 italic leading-relaxed max-w-4xl">Monitoring centralized command structure for the Dojo HQ Network. All elite instructors and managerial units are synchronized with central operational protocols.</p>
        </div>
      </motion.div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-background border-border/50 text-foreground max-w-2xl rounded-[60px] p-0 overflow-hidden shadow-2xl">
          <div className="p-12 border-b border-border/10 bg-secondary/20">
            <DialogHeader className="text-left">
              <DialogTitle className="text-5xl font-heading font-bold uppercase italic tracking-tighter leading-none">Council Auth_</DialogTitle>
              <DialogDescription className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 mt-4 italic leading-none">Initialize Force Personnel Unit Data.</DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-12 space-y-12 h-[60vh] overflow-y-auto no-scrollbar bg-secondary/5">
            <div className="grid grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary italic ml-2">Alias_ID</Label>
                <input 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="EX: MASTER_ZEN"
                  className="w-full h-16 bg-secondary/40 border border-border/50 focus:bg-secondary focus:border-primary/20 px-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] text-foreground outline-none transition-all placeholder:text-muted-foreground/10 italic"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary italic ml-2">Deployment_Email</Label>
                <input 
                   value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="OPS@SECTOR-ZERO.COM"
                  className="w-full h-16 bg-secondary/40 border border-border/50 focus:bg-secondary focus:border-primary/20 px-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] text-foreground outline-none transition-all placeholder:text-muted-foreground/10 italic"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 text-left">
              <div className="space-y-4">
                <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary italic ml-2">Rank_ Tier</Label>
                <input 
                  value={formData.rank || ''}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  placeholder="EX: 4TH_DAN"
                  className="w-full h-16 bg-secondary/40 border border-border/50 focus:bg-secondary focus:border-primary/20 px-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] text-foreground outline-none transition-all placeholder:text-muted-foreground/10 italic"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary italic ml-2">Specialization</Label>
                <input 
                  value={formData.specialization || ''}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="EX: GRAPPLING"
                  className="w-full h-16 bg-secondary/40 border border-border/50 focus:bg-secondary focus:border-primary/20 px-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] text-foreground outline-none transition-all placeholder:text-muted-foreground/10 italic"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary italic ml-2">Tier_Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val: any) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger className="h-16 bg-secondary/40 border-border/50 focus:ring-0 focus:border-primary/20 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] italic text-muted-foreground/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/50">
                    <SelectItem value="instructor" className="text-[10px] uppercase font-bold italic">Instructor</SelectItem>
                    <SelectItem value="manager" className="text-[10px] uppercase font-bold italic">Manager</SelectItem>
                    <SelectItem value="admin" className="text-[10px] uppercase font-bold italic">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.role === 'manager' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-8 pt-8 overflow-hidden"
              >
                <Separator className="bg-border/30" />
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground italic">Authorized Access Grid</Label>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 bg-secondary/20 p-8 rounded-[40px] border border-border/10">
                  {PERMISSION_OPTIONS.map((perm) => (
                    <div key={perm} className="flex items-center space-x-3 group cursor-pointer" onClick={() => togglePermission(perm)}>
                      <Checkbox 
                        id={`perm-${perm}`} 
                        checked={formData.permissions?.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                        className="border-border/50 h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all rounded-lg"
                      />
                      <Label 
                        htmlFor={`perm-${perm}`} 
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-primary transition-colors cursor-pointer italic"
                      >
                        {perm}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-12 border-t border-border/10 bg-secondary/20">
            <GoldButton 
              onClick={handleSaveStaff}
              className="w-full h-18 rounded-[32px] italic shadow-2xl"
            >
               Authorize Force Personnel Deployment
            </GoldButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
