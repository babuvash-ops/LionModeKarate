import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Save,
  Info,
  Zap,
  Upload,
  BookOpen,
  X,
  MessageSquare,
  QrCode,
  Bell,
  ShieldCheck,
  ChevronRight,
  Megaphone,
  Check,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '@/services/NotificationService';
import { Switch } from '@/components/ui/switch';

export default function AdminSettings({ branding, setBranding }: any) {
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState('/lion-mode-logo.jpg');
  const [logoBase64, setLogoBase64] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroImageBase64, setHeroImageBase64] = useState('');
  const [dashboardHeroImageBase64, setDashboardHeroImageBase64] = useState('');
  const [bgImageBase64, setBgImageBase64] = useState('');

  // New Placeholder Images
  const [littleLionsImage, setLittleLionsImage] = useState('');
  const [youthWarriorsImage, setYouthWarriorsImage] = useState('');
  const [adultEliteImage, setAdultEliteImage] = useState('');
  const [instructor1Image, setInstructor1Image] = useState('');
  const [instructor2Image, setInstructor2Image] = useState('');
  const [galleryImagesList, setGalleryImagesList] = useState<string[]>([]);
  const [tagline, setTagline] = useState('');
  const [dojoName, setDojoName] = useState('ELITE COMMAND');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [whatsappAccessToken, setWhatsappAccessToken] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const dashboardHeroInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  const [permissions, setPermissions] = useState({
    manager: ['students', 'staff', 'schedule', 'crm', 'shop', 'inventory', 'payments', 'grading', 'attendance', 'comms'],
    parent: ['home', 'schedule', 'shop', 'payments'],
  });

  useEffect(() => {
    const isNotificationAvailable = typeof window !== 'undefined' && 'Notification' in window;
    setPushEnabled(isNotificationAvailable && Notification.permission === 'granted');
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'appSettings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroImages(data.heroImages || []);
          setLogoUrl(data.logoUrl || '/lion-mode-logo.jpg');
          setLogoBase64(data.logoBase64 || '');
          setHeroImageUrl(data.heroImageUrl || '');
          setHeroImageBase64(data.heroImageBase64 || '');
          setDashboardHeroImageBase64(data.dashboardHeroImageBase64 || '');
          setBgImageBase64(data.bgImageBase64 || '');
          setLittleLionsImage(data.littleLionsImage || '');
          setYouthWarriorsImage(data.youthWarriorsImage || '');
          setAdultEliteImage(data.adultEliteImage || '');
          setInstructor1Image(data.instructor1Image || '');
          setInstructor2Image(data.instructor2Image || '');
          setGalleryImagesList(data.galleryImages || []);
          setTagline(data.tagline || 'PRECISION. POWER. PERSISTENCE.');
          setDojoName(data.dojoName || 'DOJO OS');
          setWhatsappNumber(data.whatsappNumber || '');
          setWhatsappPhoneId(data.whatsappPhoneId || '');
          setWhatsappAccessToken(data.whatsappAccessToken || '');
          if (data.permissions) {
            setPermissions(data.permissions);
          }
        } else {
          // Defaults if no settings document exists yet (will be saved when admin clicks Save)
          setTagline('PRECISION. POWER. PERSISTENCE.');
          setDojoName('DOJO OS');
          setHeroImages([
            'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85',
            'https://content.app-sources.com/s/09941769835917864/uploads/Images/IMG-20210610-WA0134-8490785.jpg',
            'https://content.app-sources.com/s/09941769835917864/uploads/Images/20210909_175558-7415561.jpg',
            'https://content.app-sources.com/s/40806072080313136/uploads/Images/rawpixel-com-395554-unsplash-4348288.jpg',
            'https://content.app-sources.com/s/09941769835917864/uploads/Images/241426277_229185769151696_3286067128154972950_n-7424218.jpg'
          ]);
        }
      } catch (error: any) {
        console.error("Error loading settings:", error);
        if (error.message?.includes('permission-denied')) {
          console.log("Auth Protocol: Permission race detected, retrying silenced.");
        } else {
          toast.error(`System Protocol Error: ${error.message || 'Identity Parameters Unreachable'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleTogglePermission = (role: 'manager' | 'parent', section: string) => {
    setPermissions(prev => {
      const rolePerms = [...prev[role]];
      if (rolePerms.includes(section)) {
        return { ...prev, [role]: rolePerms.filter(s => s !== section) };
      } else {
        return { ...prev, [role]: [...rolePerms, section] };
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'appSettings', 'global'), {
        heroImages: heroImages,
        logoUrl: logoUrl,
        logoBase64: logoBase64,
        heroImageUrl: heroImageUrl,
        heroImageBase64: heroImageBase64,
        dashboardHeroImageBase64: dashboardHeroImageBase64,
        bgImageBase64: bgImageBase64,
        littleLionsImage: littleLionsImage,
        youthWarriorsImage: youthWarriorsImage,
        adultEliteImage: adultEliteImage,
        instructor1Image: instructor1Image,
        instructor2Image: instructor2Image,
        galleryImages: galleryImagesList,
        tagline: tagline,
        dojoName: dojoName,
        whatsappNumber: whatsappNumber,
        whatsappPhoneId: whatsappPhoneId,
        whatsappAccessToken: whatsappAccessToken,
        permissions: permissions,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setBranding({
        ...branding,
        logoUrl,
        logoBase64,
        heroImageUrl: heroImageBase64 || heroImageUrl,
        tagline,
        dojoName,
        whatsappNumber,
      });

      toast.success('Dojo archives synchronized');
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error('Failed to update archives');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddField = () => {
    if (!newImageUrl) {
      toast.error('URL required');
      return;
    }
    setGalleryImagesList([...galleryImagesList, newImageUrl]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImagesList(galleryImagesList.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) { // 800KB limit
      toast.error('File exceeds size limit (800KB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'logo') setLogoBase64(base64);
      if (type === 'hero') setHeroImageBase64(base64);
      if (type === 'dashboardHero') setDashboardHeroImageBase64(base64);
      if (type === 'bg') setBgImageBase64(base64);
      if (type === 'littleLions') setLittleLionsImage(base64);
      if (type === 'youthWarriors') setYouthWarriorsImage(base64);
      if (type === 'adultElite') setAdultEliteImage(base64);
      if (type === 'instructor1') setInstructor1Image(base64);
      if (type === 'instructor2') setInstructor2Image(base64);
      toast.success(`${type.toUpperCase()} asset encoded`);
    };
    reader.readAsDataURL(file);
  };

  const clearLogoBase64 = () => {
    setLogoBase64('');
    toast.info('Local asset purged');
  };

  const handleTogglePush = async () => {
    const granted = await notificationService.requestPermission();
    setPushEnabled(granted);
    if (granted) {
      toast.success('Push Intelligence Activated');
    } else {
      toast.error('Permission Denied by User');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-40 gap-6 opacity-30">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[12px] font-black uppercase tracking-[0.4em] italic">Decrypting Master Node...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <Badge className="bg-primary text-black font-black uppercase text-[12px] tracking-[0.5em] px-6 py-2 rounded-lg shadow-xl shadow-primary/10">Master Command Node</Badge>
          <h2 className="text-7xl font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">
            Identity <br />
            <span className="text-primary drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">Protocols</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase opacity-40">Architectural visual archives and neural interface configuration.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-[0.3em] h-20 px-14 rounded-[30px] shadow-2xl shadow-primary/20 text-[12px] transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
        >
          {isSaving ? 'SYNCHRONIZING...' : <><Save className="w-6 h-6" /> SYNC ARCHIVES</>}
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border border-white/5 bg-secondary/10 backdrop-blur-3xl shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="px-10 py-10 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Dojo Identity Protocol</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-muted-foreground opacity-60">Define the visual signature and tactical mission statement.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {/* Logo Section */}
                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Dojo Logo</Label>
                  <div className="flex items-center gap-6">
                    {logoBase64 ? (
                      <div className="relative group w-24 h-24 bg-secondary/50 rounded-2xl p-2 border border-primary/20 overflow-hidden shadow-2xl">
                        <img src={logoBase64} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                          onClick={() => setLogoBase64('')}
                          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-6 h-6 text-rose-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-secondary/20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={logoInputRef}
                        className="hidden" 
                        accept="image/png,image/jpeg"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                      />
                      <Button 
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="flex items-center justify-center gap-3 w-full h-16 bg-secondary/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 cursor-pointer rounded-2xl transition-all group"
                      >
                        <Upload className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Upload Logo</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hero Image Section */}
                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Main Hero Image (Home/Login)</Label>
                  <div className="flex items-center gap-6">
                    {heroImageBase64 ? (
                      <div className="relative group w-24 h-24 bg-secondary/50 rounded-2xl p-2 border border-primary/20 overflow-hidden shadow-2xl">
                        <img src={heroImageBase64} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                          onClick={() => setHeroImageBase64('')}
                          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-6 h-6 text-rose-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-secondary/20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={heroInputRef}
                        className="hidden" 
                        accept="image/png,image/jpeg"
                        onChange={(e) => handleFileUpload(e, 'hero')}
                      />
                      <Button 
                        type="button"
                        onClick={() => heroInputRef.current?.click()}
                        className="flex items-center justify-center gap-3 w-full h-16 bg-secondary/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 cursor-pointer rounded-2xl transition-all group"
                      >
                        <Upload className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Upload Home Hero</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Dashboard Hero Section */}
                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Dashboard Hero Image</Label>
                  <div className="flex items-center gap-6">
                    {dashboardHeroImageBase64 ? (
                      <div className="relative group w-24 h-24 bg-secondary/50 rounded-2xl p-2 border border-primary/20 overflow-hidden shadow-2xl">
                        <img src={dashboardHeroImageBase64} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                          onClick={() => setDashboardHeroImageBase64('')}
                          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-6 h-6 text-rose-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-secondary/20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={dashboardHeroInputRef}
                        className="hidden" 
                        accept="image/png,image/jpeg"
                        onChange={(e) => handleFileUpload(e, 'dashboardHero')}
                      />
                      <Button 
                        type="button"
                        onClick={() => dashboardHeroInputRef.current?.click()}
                        className="flex items-center justify-center gap-3 w-full h-16 bg-secondary/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 cursor-pointer rounded-2xl transition-all group"
                      >
                        <Upload className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Upload Dash Hero</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Background Image Section */}
                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Main Background Image (Home)</Label>
                  <div className="flex items-center gap-6">
                    {bgImageBase64 ? (
                      <div className="relative group w-24 h-24 bg-secondary/50 rounded-2xl p-2 border border-primary/20 overflow-hidden shadow-2xl">
                        <img src={bgImageBase64} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                          onClick={() => setBgImageBase64('')}
                          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-6 h-6 text-rose-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-secondary/20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={bgInputRef}
                        className="hidden" 
                        accept="image/png,image/jpeg"
                        onChange={(e) => handleFileUpload(e, 'bg')}
                      />
                      <Button 
                        type="button"
                        onClick={() => bgInputRef.current?.click()}
                        className="flex items-center justify-center gap-3 w-full h-16 bg-secondary/40 border border-white/5 hover:border-primary/40 hover:bg-white/5 cursor-pointer rounded-2xl transition-all group"
                      >
                        <Upload className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Upload BG</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="grid gap-3">
                  <Label htmlFor="dojo-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Dojo Name</Label>
                  <Input 
                    id="dojo-name" 
                    placeholder="DOJO OS" 
                    className="bg-secondary/40 border-white/5 h-16 rounded-2xl font-black text-xs uppercase tracking-widest px-6 focus:border-primary transition-all" 
                    value={dojoName}
                    onChange={(e) => setDojoName(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="whatsapp-number" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">WhatsApp Business Number</Label>
                  <div className="flex items-center gap-4 bg-secondary/40 border border-white/5 h-16 rounded-2xl px-6 focus-within:border-primary transition-all">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <Input 
                      id="whatsapp-number" 
                      placeholder="e.g. +27821234567" 
                      className="bg-transparent border-none font-black text-xs uppercase tracking-widest placeholder:text-white/10 h-full p-0 flex-1 shadow-none focus-visible:ring-0" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="dojo-tagline" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Tactical Tagline</Label>
                  <Input 
                    id="dojo-tagline" 
                    placeholder="OPERATIONAL EXCELLENCE ENFORCED" 
                    className="bg-secondary/40 border-white/5 h-16 rounded-2xl font-black text-xs uppercase tracking-widest px-6 focus:border-primary transition-all" 
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 relative overflow-hidden group min-h-[160px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em] italic mb-6 opacity-40">Identity Preview</p>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                      {logoBase64 || logoUrl ? (
                        <img src={logoBase64 || logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-black font-black text-2xl uppercase italic">{dojoName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="section-title uppercase italic tracking-tighter leading-none">{dojoName}</h4>
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-2 opacity-60 italic">{tagline}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-secondary/10 backdrop-blur-3xl shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="px-10 py-10 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Tactical Assets Matrix</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-muted-foreground opacity-60">Manage sector-specific imagery and personnel mosaics.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'littleLions', label: 'Little Lions (4-7)', state: littleLionsImage, setter: setLittleLionsImage },
                { id: 'youthWarriors', label: 'Youth Warriors (8-15)', state: youthWarriorsImage, setter: setYouthWarriorsImage },
                { id: 'adultElite', label: 'Adult Elite (16+)', state: adultEliteImage, setter: setAdultEliteImage },
                { id: 'instructor1', label: 'Sensei Marcus', state: instructor1Image, setter: setInstructor1Image },
                { id: 'instructor2', label: 'Shihan Elena', state: instructor2Image, setter: setInstructor2Image }
              ].map((img) => (
                <div key={img.id} className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">{img.label}</Label>
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/3] bg-secondary/20 rounded-2xl border border-white/5 overflow-hidden group relative">
                      {img.state ? (
                        <img src={img.state} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <Button 
                          onClick={() => img.setter('')}
                          variant="destructive" size="icon" className="h-12 w-12 rounded-xl"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => handleFileUpload(e, img.id);
                        input.click();
                      }}
                      className="bg-white/5 border border-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] h-12 rounded-xl"
                    >
                      Swap Neural Asset
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-secondary/10 backdrop-blur-3xl shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="px-10 py-10 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Permissions Matrix</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-muted-foreground opacity-60">Control module visibility for internal roles.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            {[
              { id: 'manager', label: 'Operational Managers', color: 'text-primary' },
              { id: 'parent', label: 'Parent Units', color: 'text-emerald-500' }
            ].map((role) => (
              <div key={role.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h4 className={cn("text-lg font-black uppercase italic tracking-tighter", role.color)}>{role.label}</h4>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'students', label: 'Roster' },
                    { id: 'staff', label: 'Staff' },
                    { id: 'schedule', label: 'Matrix' },
                    { id: 'crm', label: 'Capture' },
                    { id: 'shop', label: 'Station' },
                    { id: 'inventory', label: 'Depot' },
                    { id: 'payments', label: 'Ledger' },
                    { id: 'grading', label: 'Rankings' },
                    { id: 'attendance', label: 'Presence' },
                    { id: 'comms', label: 'Comms' },
                    { id: 'ai', label: 'Neural' },
                    { id: 'home', label: 'Portal' }
                  ].map((section) => (
                    <div 
                      key={section.id}
                      onClick={() => handleTogglePermission(role.id as any, section.id)}
                      className={cn(
                        "p-6 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 group",
                        permissions[role.id as keyof typeof permissions].includes(section.id)
                          ? "bg-primary/5 border-primary/20 text-primary shadow-lg shadow-primary/5"
                          : "bg-secondary/5 border-white/5 text-white/20 hover:border-white/10"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{section.label}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-medium uppercase opacity-40">{permissions[role.id as keyof typeof permissions].includes(section.id) ? 'AUTHORIZED' : 'LOCKED'}</span>
                        <div className={cn(
                          "w-3 h-3 rounded-full transition-all",
                          permissions[role.id as keyof typeof permissions].includes(section.id) ? "bg-primary animate-pulse" : "bg-white/5"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-secondary/10 backdrop-blur-3xl shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="px-10 py-10 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Signal Protocols</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-muted-foreground opacity-60">Push notification matrix and tactical alert synchronization.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
             <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-primary/20">
                <div className="flex items-center gap-6">
                   <div className={cn(
                     "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500",
                     pushEnabled ? "bg-emerald-500 text-black shadow-emerald-500/20" : "bg-secondary text-muted-foreground"
                   )}>
                      <ShieldCheck className={cn("w-8 h-8", pushEnabled && "animate-pulse")} />
                   </div>
                   <div>
                      <h4 className="text-[14px] font-black text-white uppercase tracking-widest italic">Operational Push Node</h4>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">
                        {pushEnabled ? "Active: Neural delivery protocols online" : "Inactive: Signal blocked at terminal level"}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Status: {pushEnabled ? 'GRANTED' : 'DENIED'}</span>
                   <Switch 
                     checked={pushEnabled} 
                     onCheckedChange={handleTogglePush}
                     className="data-[state=checked]:bg-emerald-500"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[32px] bg-secondary/20 border border-white/5 space-y-4">
                   <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary" />
                      <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Class Reminders</h5>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                      Tactical interval: 30 minutes pre-deployment. Global check every 15 minutes.
                   </p>
                </div>
                <div className="p-8 rounded-[32px] bg-secondary/20 border border-white/5 space-y-4">
                   <div className="flex items-center gap-3">
                      <Megaphone className="w-4 h-4 text-primary" />
                      <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Global Broadcasts</h5>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                      Instant mission-critical announcements synchronized across all linked units.
                   </p>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-secondary/10 backdrop-blur-3xl shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="px-10 py-10 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Integration Protocols</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-muted-foreground opacity-60">Neural links to external communications and WhatsApp Meta API.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid gap-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">WhatsApp Business Phone ID</Label>
                <Input 
                  placeholder="e.g. 109283736252" 
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  className="bg-secondary/40 border-white/5 h-14 rounded-2xl font-black text-xs uppercase tracking-widest px-6 focus:border-primary transition-all" 
                />
              </div>
              <div className="grid gap-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">API Access Token (Meta)</Label>
                <Input 
                  type="password"
                  placeholder="EAABw..." 
                  value={whatsappAccessToken}
                  onChange={(e) => setWhatsappAccessToken(e.target.value)}
                  className="bg-secondary/40 border-white/5 h-14 rounded-2xl font-black text-xs uppercase tracking-widest px-6 focus:border-primary transition-all" 
                />
              </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[24px] flex flex-col sm:flex-row items-center gap-6">
               <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                  <QrCode className="w-6 h-6 text-black" />
               </div>
               <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-1 italic">WhatsApp Business API Status</h4>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    Once IDs and Tokens are synchronized, the Nexus will be able to broadcast automated training alerts and grading notifications via the Meta Cloud API.
                  </p>
               </div>
               <Button className="h-10 bg-emerald-500 text-black font-black text-[9px] tracking-widest rounded-xl hover:bg-emerald-400">
                  VALIDATE LINK
               </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-secondary/10 backdrop-blur-3xl shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="px-10 py-10 border-b border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Dynamic Visual Core</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-muted-foreground opacity-60">Architectural hero banners and gallery manifests.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-10">
              <div className="grid gap-4">
                <Label htmlFor="image-url" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-1 mb-2">Ingest New Asset URL</Label>
                <div className="flex gap-4">
                  <Input 
                    id="image-url" 
                    placeholder="https://wsrv.nl/?url=images.unsplash.com/photo-...&output=webp" 
                    className="bg-secondary/40 border-white/5 h-16 text-xs focus:border-primary rounded-2xl px-6 font-black uppercase tracking-widest transition-all"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddField}
                    size="icon" 
                    className="h-16 w-16 bg-primary hover:bg-primary/90 rounded-2xl shrink-0 shadow-xl shadow-primary/10 transition-all hover:rotate-90"
                  >
                    <Plus className="w-6 h-6 text-black" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 px-2 mt-2 opacity-40">
                  <Info className="w-3 h-3 text-primary" />
                  <p className="text-[9px] text-white font-black uppercase tracking-[0.2em]">
                    High-bandwidth 16:9 4K assets recommended for cinematic clarity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroImages.map((src, i) => {
                  const isActive = (heroImageUrl === src) || (!heroImageUrl && i === 0);
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={src + i} 
                      className={cn(
                        "relative group aspect-video rounded-[24px] overflow-hidden border shadow-2xl transition-all",
                        isActive ? "border-gold ring-2 ring-gold/40 shadow-gold/20" : "border-white/5"
                      )}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm p-4">
                        {!isActive ? (
                          <Button 
                            type="button"
                            onClick={() => {
                              setHeroImageUrl(src);
                              setHeroImageBase64('');
                              setBranding((prev: any) => ({ ...prev, heroImageUrl: src, heroImageBase64: '' }));
                              toast.success("Hero image updated!");
                            }}
                            className="bg-gold text-black hover:bg-gold/90 font-bold uppercase tracking-wider text-xs rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg cursor-pointer"
                          >
                            <Star className="w-4 h-4 fill-black" />
                            Set As Active Hero
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/40 rounded-xl text-gold text-xs font-bold uppercase tracking-wider">
                            <Check className="w-4 h-4" />
                            Current Active Hero
                          </div>
                        )}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleRemoveImage(i)}
                          className="h-10 w-10 bg-rose-600 hover:bg-rose-500 rounded-xl shadow-xl hover:scale-110 transition-all cursor-pointer"
                          title="Purge Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">A-{i + 1}</span>
                        </div>
                        {isActive && (
                          <div className="px-3 py-1.5 bg-gold text-black font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            ACTIVE HERO
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-secondary/5 rounded-[40px] overflow-hidden relative group">
           <CardHeader className="px-10 py-10 border-b border-white/5">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-[20px] bg-secondary/50 flex items-center justify-center text-muted-foreground border border-white/5">
                    <Plus className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">System Configuration</h3>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2">Core operational parameters and entity naming.</p>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-10 grid md:grid-cols-2 gap-8">
              <div className="grid gap-3">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Entity Identifier</Label>
                 <Input 
                    value={dojoName} 
                    onChange={(e) => setDojoName(e.target.value)}
                    className="bg-secondary/40 border-white/5 h-14 rounded-2xl font-black text-xs uppercase tracking-widest px-6 focus:border-primary transition-all" 
                 />
              </div>
              <div className="grid gap-3">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Master Administrator</Label>
                 <Input value="sensei@elite.command" disabled className="bg-secondary/40 border-white/5 h-14 rounded-2xl font-black text-xs uppercase tracking-widest px-6 opacity-50 cursor-not-allowed" />
              </div>
           </CardContent>
           <div className="px-10 pb-10">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-4">
                 <Zap className="w-5 h-5 text-primary shrink-0" />
                 <p className="text-[10px] font-black uppercase text-primary tracking-[0.1em] leading-relaxed">
                   Authorized: Administrator Level Verified for Internal Protocol Modifications.
                 </p>
              </div>
           </div>
        </Card>

        <Card className="border border-primary/20 bg-primary/5 rounded-[40px] overflow-hidden relative group p-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <div className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                 </div>
                 <h3 className="section-title italic tracking-tighter">Strategic Manual</h3>
              </div>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-sm">
                Deep-dive training protocols for Admin, Manager, and Parent roles. Learn to navigate the Nexus.
              </p>
           </div>
           <Button 
            onClick={() => navigate('/manual')}
            className="h-16 px-10 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all hover:scale-105"
           >
            Open Documentation
           </Button>
        </Card>
      </div>
    </div>
  );
}
