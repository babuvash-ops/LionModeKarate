import React, { useState } from 'react';
import { 
  Trophy, 
  CheckSquare, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Star,
  Activity,
  ShieldCheck,
  Zap,
  Target,
  Shield,
  Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import GoldButton from './shared/GoldButton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BELTS = [
  { rank: 'White Belt', level: 9, bg: 'bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]' },
  { rank: 'Yellow Belt', level: 8, bg: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]' },
  { rank: 'Orange Belt', level: 7, bg: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' },
  { rank: 'Green Belt', level: 6, bg: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' },
  { rank: 'Blue Belt', level: 5, bg: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' },
  { rank: 'Purple Belt', level: 4, bg: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' },
  { rank: 'Brown Belt', level: 3, bg: 'bg-amber-800 shadow-[0_0_10px_rgba(146,64,14,0.3)]' },
  { rank: 'Black Belt', level: 1, bg: 'bg-black border border-amber-500/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]' },
];

const BELT_SKILLS: Record<string, { id: number; name: string; completed: boolean }[]> = {
  'White Belt': [
    { id: 101, name: 'Tachi-waza (Standing Stance Protocols)', completed: true },
    { id: 102, name: 'Rei-ho (Dojo Etiquette & Bowing)', completed: true },
    { id: 103, name: 'Basic Ukemi (Falling & Rolling Drills)', completed: true },
    { id: 104, name: 'Seiza Meditation & Core Breathing', completed: false },
    { id: 105, name: 'Introduction to Kihon (Basic Punch/Kick)', completed: false }
  ],
  'Yellow Belt': [
    { id: 201, name: 'Keri-waza (Front Snap Kick precision)', completed: true },
    { id: 202, name: 'Uke-waza (Upper & lower section blocking)', completed: true },
    { id: 203, name: 'Heian Shodan (First Kata sequence)', completed: false },
    { id: 204, name: 'Gohon Kumite (5-step structured sparring)', completed: false },
    { id: 205, name: 'Physical stamina & core agility benchmark', completed: false }
  ],
  'Orange Belt': [
    { id: 301, name: 'Mawashi-geri (Roundhouse execution template)', completed: true },
    { id: 302, name: 'Shuto-uke (Knife-hand blocking mechanics)', completed: true },
    { id: 303, name: 'Heian Nidan (Second Kata sequence)', completed: false },
    { id: 304, name: 'Kihon Ippon Kumite basic application', completed: false },
    { id: 305, name: 'Combative response stance synchronization', completed: false }
  ],
  'Green Belt': [
    { id: 401, name: 'Gyaku-zuki (Reverse punch calibration)', completed: true },
    { id: 402, name: 'Heian Sandan (Third Kata sequence)', completed: false },
    { id: 403, name: 'Jiyu Kumite introduction (Semi-contact drills)', completed: false },
    { id: 404, name: 'High-kick flex calibrations & target acquisition', completed: false },
    { id: 405, name: 'Cadet leadership assistance program stage-1', completed: false }
  ],
  'Blue Belt': [
    { id: 501, name: 'Ushiro-geri (Back kick alignment & recovery)', completed: true },
    { id: 502, name: 'Heian Yondan (Fourth Kata sequence)', completed: false },
    { id: 503, name: 'Dynamic sweeps & balance disturbance vectors', completed: false },
    { id: 504, name: 'Continuous sparring stamina & defense check', completed: false },
    { id: 505, name: 'Mentor credentials for junior training cohorts', completed: false }
  ],
  'Purple Belt': [
    { id: 601, name: 'Empi-uchi (Striking with elbow angles)', completed: true },
    { id: 602, name: 'Heian Godan (Fifth Kata sequence)', completed: false },
    { id: 603, name: 'High-density defensive sparring exercises', completed: false },
    { id: 604, name: 'Tactical lockouts & redirection systems', completed: false },
    { id: 605, name: 'Assistant coaching & dojo safety credentials', completed: false }
  ],
  'Brown Belt': [
    { id: 701, name: 'Tekki Shodan (Iron Horse foundational form)', completed: true },
    { id: 702, name: 'Jiyu Kumite (Continuous advanced tactical pacing)', completed: false },
    { id: 703, name: 'Joint manipulation & passive defense restraints', completed: false },
    { id: 704, name: 'High-stress psychological mastery & breath loop', completed: false },
    { id: 705, name: 'Senior Assistant Instructor technical review', completed: false }
  ],
  'Black Belt': [
    { id: 801, name: 'Bassai Dai (Kata Mastery & structural depth)', completed: false },
    { id: 802, name: 'Universal combative syllabus synthesis', completed: false },
    { id: 803, name: 'Multi-direction defensive responses', completed: false },
    { id: 804, name: 'Officer command protocol & lineage history', completed: false },
    { id: 805, name: 'Philosophical martial treatise formulation', completed: false }
  ]
};

export default function BeltGradingModule() {
  const [activeBelt, setActiveBelt] = useState(BELTS[0]);
  const [skillsModule, setSkillsModule] = useState<Record<string, { id: number; name: string; completed: boolean }[]>>(BELT_SKILLS);

  const currentSkills = skillsModule[activeBelt.rank] || [];
  const completedCount = currentSkills.filter(s => s.completed).length;
  const readinessPercent = currentSkills.length > 0 
    ? Math.round((completedCount / currentSkills.length) * 100) 
    : 0;

  const toggleSkill = (skillId: number) => {
    setSkillsModule(prev => {
      const beltName = activeBelt.rank;
      const updatedBeltSkills = prev[beltName].map(skill => 
        skill.id === skillId ? { ...skill, completed: !skill.completed } : skill
      );
      return {
        ...prev,
        [beltName]: updatedBeltSkills
      };
    });
  };

  const handleAscensionRequest = () => {
    if (readinessPercent < 100) {
      toast.error('AUTHENTICATION DECLINED', {
        description: `Your technical codex is incomplete (${readinessPercent}% sync). Please satisfy all parameters first.`
      });
      return;
    }

    toast.success('ASCENSION SEQUENCE INITIALIZED', {
      description: `Tactical telemetry for the ${activeBelt.rank} rank has been transmitted to core Command Staff.`
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        
        {/* HEADER SECTION - Beautiful Oswald Typography & Sizes */}
        <div className="text-left space-y-4">
          <span className="section-subtitle">
            Unit Ascension Protocols
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none animate-fade-in">
            RANK_ <br />
            <span className="text-primary">ASCENSION</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-xl">
            Technical assessment parameters and target criteria required for rank progression, credential logging, and physical merit recognition.
          </p>
        </div>

        {/* COMBINED INTERACTIVE CONSOLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Belt Progression Selector - Side Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="premium-card text-left space-y-6 shadow-2xl relative overflow-hidden overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.01] rounded-bl-[40px] pointer-events-none" />
              
              <div className="space-y-1.5 border-b border-white/5 pb-4">
                <span className="text-primary font-heading text-[10px] uppercase tracking-widest font-bold block leading-none">
                  COHORT MATRIX
                </span>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white leading-none block">
                  LINEAGE_PROTOCOL
                </h3>
              </div>
              
              <div className="space-y-2.5">
                {BELTS.map((belt, i) => (
                  <motion.button
                    key={belt.rank}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveBelt(belt)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all border text-left cursor-pointer",
                      activeBelt.rank === belt.rank 
                        ? "bg-primary text-primary-foreground border-primary shadow-glow-gold" 
                        : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-7 h-2 rounded-full border border-white/10 shrink-0", belt.bg)} />
                      <span className="font-heading text-xs font-bold uppercase tracking-wider italic leading-none">
                        {belt.rank}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] font-bold opacity-60 leading-none">
                      {belt.level} KYU
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="premium-card flex items-center gap-3 border border-white/5 text-left overflow-hidden">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">SYSTEM SYNC</span>
                  <span className="text-xs font-heading font-bold text-white uppercase tracking-wider italic leading-none block mt-1">SECURED</span>
                </div>
              </div>
              <div className="premium-card flex items-center gap-3 border border-white/5 text-left overflow-hidden">
                <Trophy className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">CERTIFICATE</span>
                  <span className="text-xs font-heading font-bold text-white uppercase tracking-wider italic leading-none block mt-1">METRIC LOG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Ascension Details / Interactive verification checklist */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBelt.rank}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="premium-card relative overflow-hidden text-left overflow-hidden"
              >
                {/* Visual grid decor to maintain elite theme */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-bl-[40px] pointer-events-none" />
                
                <div className="space-y-8">
                  {/* Premium info row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase font-black tracking-widest text-[8px] px-3 py-0.5 rounded-full italic inline-block">
                        RANK ASSESSMENT EVAL
                      </Badge>
                      <h2 className="font-heading text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                        {activeBelt.rank.replace(' ', '_')}
                      </h2>
                      <p className="font-sans text-xs text-white/50 italic leading-relaxed">
                        Assess tactical mechanical skills below to test current senior level calibrations.
                      </p>
                    </div>

                    {/* Circular percentage readiness widget */}
                    <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl shrink-0 self-start md:self-auto">
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4.5" />
                          <circle 
                            cx="32" cy="32" r="28" fill="none" stroke="#D4AF37" strokeWidth="4.5" 
                            strokeDasharray="176" 
                            strokeDashoffset={176 - (176 * readinessPercent) / 100}
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <span className="font-heading text-base font-bold text-white pl-0.5 italic">{readinessPercent}%</span>
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">READINESS PULSE</span>
                        <span className={cn(
                          "text-[10px] font-heading font-black uppercase tracking-wider italic leading-none block mt-1",
                          readinessPercent === 100 ? "text-primary" : "text-white/50"
                        )}>
                          {readinessPercent === 100 ? 'AUTHENTICATED' : 'SYNCHRONIZING'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details columns */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column: Interactive Codex Checks */}
                    <div className="md:col-span-7 space-y-4">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55 block">
                        TECHNICAL_CODEX (CLICK TO VERIFY)
                      </span>
                      
                      <div className="space-y-3">
                        {currentSkills.map((skill) => (
                          <div
                            key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            className="flex items-center gap-4 p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-primary/20 rounded-2xl cursor-pointer transition-all duration-300 group"
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0",
                              skill.completed 
                                ? 'bg-primary border-primary text-primary-foreground shadow-glow-gold' 
                                : 'bg-white/5 border-white/10 text-transparent'
                            )}>
                              <Star className="w-4 h-4 fill-current" />
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <span className={cn(
                                "text-xs font-heading font-bold uppercase tracking-wider italic block transition-colors leading-none truncate",
                                skill.completed ? 'text-white' : 'text-white/30'
                              )}>
                                {skill.name}
                              </span>
                              <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-[0.25em] block leading-none mt-0.5">
                                {skill.completed ? 'AUTHORIZED PROTOCOL' : 'LOCKED CRITERIA'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Insignia status & request */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55 block">
                          INSIGNIA_REWARDS
                        </span>
                        
                        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl text-left space-y-4 relative">
                          <p className="font-sans text-xs text-white/60 italic leading-relaxed">
                            Following complete technical codex validation, you will be authorized for rank {activeBelt.rank} insignia credentials, passport logs, and combat roster verification tags.
                          </p>
                          <div className="h-px bg-white/5 w-full" />
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-lg shrink-0">
                              <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-mono font-extrabold text-white/35 uppercase tracking-widest block">AWARD SPEC</span>
                              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider italic block">OFFICERS_DECREE</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ascension dynamic submit button */}
                      <div className="pt-2">
                        <GoldButton 
                          onClick={handleAscensionRequest}
                          className="w-full h-12 text-xs font-heading font-bold tracking-widest uppercase italic rounded-xl shadow-glow-gold hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
                        >
                          INITIATE_ASCENSION_REQUEST
                        </GoldButton>
                      </div>

                    </div>

                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM SECTION: DETAILED SPECIFICATIONS MANUAL */}
        <div className="space-y-8 pt-6 border-t border-white/5">
          <div className="text-left space-y-1">
            <span className="section-subtitle">Ascension Specifications</span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">LINEAGE_EVALUATION_SPECS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: 'MINIMUM FIELD TIME', a: 'Every belt tier requires a set number of minimum operational deployment hours logged in classes before an evaluation cycle is approved.' },
              { q: 'OFFICIAL ASSESSMENTS', a: 'Grading assessments are scheduled bi-annually. All candidate profiles must satisfy 100% technical codex sync parameters before physical invitation.' },
              { q: 'COGNITIVE PHILOSOPHY', a: 'Ascension is not purely muscular. Candidates are evaluated on mental clarity, active dojo citizenship, and compliance with the warrior lineage.' }
            ].map((spec, i) => (
              <div key={i} className="p-6 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-primary/20 rounded-[24px] text-left space-y-3 transition-all duration-300">
                <h5 className="font-heading text-base font-bold text-primary uppercase tracking-wide italic">{spec.q}</h5>
                <p className="text-white/50 text-xs italic font-medium leading-relaxed">{spec.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
