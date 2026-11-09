import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';
import { DUMMY_STUDENTS } from '@/data/dummyData';
import { getMemberRegistrations } from '@/data/memberRegistrations';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'student' | 'instructor';
  belt?: string;
  rank?: string;
  studentId?: string;
  studentIdCode?: string;
  childName?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface TestPersona {
  id: 'super_admin' | 'staff' | 'parent';
  name: string;
  title: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  roleLabel: string;
  belt: string;
  rank: string;
  studentId?: string;
  photoURL: string;
  description: string;
  badges: string[];
}

export const DUMMY_TEST_PERSONAS: TestPersona[] = [
  {
    id: 'super_admin',
    name: 'Sensei Babu',
    title: 'Head Master & Academy Founder',
    email: 'babuvash@gmail.com',
    role: 'admin',
    roleLabel: 'Super Admin',
    belt: 'Black Belt 5th Dan',
    rank: 'Shihan / Head Sensei',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    description: 'Full administrative access: Command Center, Revenue, Roster, Classes, Media Assets & Funnels.',
    badges: ['Owner', '5th Dan Black Belt', 'Full Access']
  },
  {
    id: 'staff',
    name: 'Coach Sarah Jenkins',
    title: 'Youth Development Director & Head Coach',
    email: 'coach.sarah@lionmodekarate.com',
    role: 'instructor',
    roleLabel: 'Staff / Instructor',
    belt: 'Black Belt 3rd Dan',
    rank: 'Sensei / Coach',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    description: 'Instructor access: Session attendance roster, grading evaluations, lesson plans, and curriculum.',
    badges: ['Staff Coach', '3rd Dan Black Belt', 'Youth Director']
  },
  {
    id: 'parent',
    name: 'Priya Naidoo',
    title: 'Parent & Guardian (Liam Naidoo)',
    email: 'priya.naidoo@gmail.com',
    role: 'student',
    roleLabel: 'Parent / Member',
    belt: 'Brown Belt (Liam - 3rd Kyu)',
    rank: 'Little Lions / Junior Fighters',
    studentId: 'std-1',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    description: 'Parent view: Student belt progress, class schedules, shop orders, tuition invoices, Sensei AI.',
    badges: ['Parent Guardian', 'Liam Naidoo (Brown Belt)']
  }
];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isStaff: boolean;
  isParent: boolean;
  authorizedStudentId: string | null;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: any;
  isAuthModalOpen: boolean;
  authModalReason: string;
  activePersona: TestPersona | null;
  switchPersona: (personaId: 'super_admin' | 'staff' | 'parent' | null) => void;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<User | null>;
  signInWithStudentId: (studentIdInput: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  navigateToLogin: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_EMAIL = 'babuvash@gmail.com';
const PERSONA_STORAGE_KEY = 'lionmode_active_test_persona';
const STUDENT_SESSION_KEY = 'lionmode_student_id_session';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activePersona, setActivePersona] = useState<TestPersona | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('Sign in to access your Dojo OS student profile & AI Sensei features');

  // Load saved persona or student session on mount
  useEffect(() => {
    try {
      // 1. Check student ID session
      const savedStudentSession = localStorage.getItem(STUDENT_SESSION_KEY);
      if (savedStudentSession) {
        const student = JSON.parse(savedStudentSession);
        if (student && student.id) {
          applyStudentSession(student);
          setIsLoadingAuth(false);
          return;
        }
      }

      // 2. Check test persona
      const savedPersonaId = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (savedPersonaId) {
        const found = DUMMY_TEST_PERSONAS.find(p => p.id === savedPersonaId);
        if (found) {
          applyPersona(found);
          setIsLoadingAuth(false);
          return;
        }
      }
    } catch (e) {
      // localStorage error fallback
    }

    // Safety fallback: Never leave user on infinite loading if network or domain checks lag
    const safetyTimeout = setTimeout(() => {
      setIsLoadingAuth(false);
    }, 2500);

    const unsub = onAuthStateChanged(auth, async (u) => {
      clearTimeout(safetyTimeout);
      // Only set from firebase if no persona or student session is active
      const savedPersonaId = localStorage.getItem(PERSONA_STORAGE_KEY);
      const savedStudentSession = localStorage.getItem(STUDENT_SESSION_KEY);
      if (savedPersonaId || savedStudentSession) return;

      setUser(u);
      if (u) {
        try {
          await syncUserProfile(u);
        } catch (e) {
          console.warn('[AUTH] Profile sync error:', e);
        }
      } else {
        setProfile(null);
      }
      setIsLoadingAuth(false);
    }, (err) => {
      clearTimeout(safetyTimeout);
      console.error('[AUTH] State change error:', err);
      setAuthError(err);
      setIsLoadingAuth(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsub();
    };
  }, []);

  const applyStudentSession = (student: any) => {
    const childFullName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.studentName || 'Student';
    const parentDisplayName = student.parent_name || student.parentName || `Parent of ${childFullName}`;
    
    const mockUser: any = {
      uid: `student-${student.id}`,
      email: student.email || student.parentEmail || null,
      displayName: parentDisplayName,
      photoURL: student.avatar_url || null,
      emailVerified: true
    };

    const mockProfile: UserProfile = {
      uid: `student-${student.id}`,
      email: student.email || student.parentEmail || null,
      displayName: parentDisplayName,
      photoURL: student.avatar_url || null,
      role: 'student',
      belt: student.belt_rank || 'White Belt',
      rank: student.rank_level || 'Beginner',
      studentId: student.id,
      studentIdCode: student.student_id_code || student.allocatedStudentId || 'LMK-STUDENT',
      childName: childFullName,
      lastLogin: new Date().toISOString(),
      createdAt: student.join_date || student.createdAt || new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setActivePersona(null);
  };

  const applyPersona = (persona: TestPersona) => {
    setActivePersona(persona);
    const mockUser: any = {
      uid: `persona-${persona.id}`,
      email: persona.email,
      displayName: persona.name,
      photoURL: persona.photoURL,
      emailVerified: true
    };
    const mockProfile: UserProfile = {
      uid: `persona-${persona.id}`,
      email: persona.email,
      displayName: persona.name,
      photoURL: persona.photoURL,
      role: persona.role,
      belt: persona.belt,
      rank: persona.rank,
      studentId: persona.studentId,
      lastLogin: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00Z'
    };

    setUser(mockUser);
    setProfile(mockProfile);
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, persona.id);
    } catch (e) {}
  };

  const switchPersona = (personaId: 'super_admin' | 'staff' | 'parent' | null) => {
    if (!personaId) {
      setActivePersona(null);
      try {
        localStorage.removeItem(PERSONA_STORAGE_KEY);
      } catch (e) {}
      setUser(auth.currentUser);
      if (auth.currentUser) {
        syncUserProfile(auth.currentUser);
      } else {
        setProfile(null);
      }
      toast.info('Switched to default standard user view');
      return;
    }

    const target = DUMMY_TEST_PERSONAS.find(p => p.id === personaId);
    if (target) {
      applyPersona(target);
      toast.success(`Switched role to: ${target.name} (${target.roleLabel})`, {
        description: target.description
      });
    }
  };

  const syncUserProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      const isUserAdmin = (firebaseUser.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (userSnap.exists()) {
        const data = userSnap.data() as Partial<UserProfile>;
        const updatedProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || data.displayName || 'Warrior Student',
          photoURL: firebaseUser.photoURL || data.photoURL || null,
          role: isUserAdmin ? 'admin' : (data.role || 'student'),
          belt: data.belt || 'White Belt',
          rank: data.rank || 'Beginner',
          lastLogin: new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString()
        };
        await setDoc(userRef, { lastLogin: updatedProfile.lastLogin, role: updatedProfile.role }, { merge: true });
        setProfile(updatedProfile);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Warrior Student',
          photoURL: firebaseUser.photoURL || null,
          role: isUserAdmin ? 'admin' : 'student',
          belt: 'White Belt',
          rank: 'Beginner',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      // Fallback in-memory profile
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Warrior Student',
        photoURL: firebaseUser.photoURL || null,
        role: (firebaseUser.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student',
        belt: 'White Belt',
        rank: 'Beginner',
        createdAt: new Date().toISOString()
      });
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      // Clear persona when doing explicit Google sign-in
      setActivePersona(null);
      localStorage.removeItem(PERSONA_STORAGE_KEY);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user);
      setIsAuthModalOpen(false);
      toast.success(`Welcome to the Dojo, ${result.user.displayName || 'Warrior'}!`);
      return result.user;
    } catch (err: any) {
      console.error('[AUTH] Google Sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error(err.message || 'Failed to sign in with Google');
      }
      return null;
    }
  };

  const signInWithStudentId = async (studentIdInput: string): Promise<boolean> => {
    const queryStr = (studentIdInput || '').trim().toLowerCase();
    if (!queryStr) {
      toast.error('Please enter a valid Student ID');
      return false;
    }

    // 1. Look up in DUMMY_STUDENTS
    const match = DUMMY_STUDENTS.find((s: any) => {
      const codeMatch = (s.student_id_code || '').toLowerCase() === queryStr;
      const idMatch = (s.id || '').toLowerCase() === queryStr;
      const passportMatch = (s.passport_id || '').toLowerCase() === queryStr;
      const nameMatch = `${s.first_name} ${s.last_name}`.toLowerCase() === queryStr;
      return codeMatch || idMatch || passportMatch || nameMatch;
    });

    if (match) {
      applyStudentSession(match);
      try {
        localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(match));
      } catch (e) {}
      setIsAuthModalOpen(false);
      toast.success(`Welcome to Lion Mode Karate Member Portal!`, {
        description: `Logged in to view ${match.first_name}'s confidential student passport & notes.`
      });
      return true;
    }

    // 2. Look up in member registrations
    const registrations = getMemberRegistrations();
    const regMatch = registrations.find(r => 
      (r.allocatedStudentId && r.allocatedStudentId.toLowerCase() === queryStr) ||
      (r.passportId && r.passportId.toLowerCase() === queryStr) ||
      (r.studentName && r.studentName.toLowerCase() === queryStr)
    );

    if (regMatch) {
      const pseudoStudent = {
        id: regMatch.id,
        student_id_code: regMatch.allocatedStudentId || 'LMK-PENDING',
        first_name: regMatch.studentName.split(' ')[0] || 'Student',
        last_name: regMatch.studentName.split(' ').slice(1).join(' ') || '',
        parent_name: regMatch.parentName,
        parent_phone: regMatch.parentPhone,
        email: regMatch.parentEmail,
        passport_id: regMatch.passportId,
        belt_rank: 'white',
        rank_level: 'White Belt (8th Kyu)',
        program: regMatch.program || 'little_warriors',
        status: 'active',
        current_streak: 1,
        attendance_rate: 100
      };
      applyStudentSession(pseudoStudent);
      try {
        localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(pseudoStudent));
      } catch (e) {}
      setIsAuthModalOpen(false);
      toast.success(`Welcome to Lion Mode Karate Member Portal!`, {
        description: `Logged in to view ${pseudoStudent.first_name}'s student passport.`
      });
      return true;
    }

    toast.error('Student ID not found', {
      description: `No student record found for "${studentIdInput}". Please check the ID or submit a Member Registration below.`
    });
    return false;
  };

  const signOut = async () => {
    try {
      setActivePersona(null);
      localStorage.removeItem(PERSONA_STORAGE_KEY);
      localStorage.removeItem(STUDENT_SESSION_KEY);
      await fbSignOut(auth);
      setUser(null);
      setProfile(null);
      toast.info('Signed out of Dojo OS');
    } catch (err: any) {
      console.error('[AUTH] Sign out error:', err);
      toast.error('Failed to sign out');
    }
  };

  const openAuthModal = (reason?: string) => {
    if (reason) setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const navigateToLogin = () => {
    openAuthModal('Sign in to continue to member portals');
  };

  const refreshProfile = async () => {
    if (user && !activePersona) {
      await syncUserProfile(user);
    }
  };

  const isAdmin = !!(
    activePersona?.role === 'admin' ||
    (user && (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || profile?.role === 'admin'))
  );

  const isStaff = !!(
    isAdmin ||
    activePersona?.role === 'instructor' ||
    profile?.role === 'instructor'
  );

  const isParent = !!(
    !isAdmin &&
    !isStaff &&
    (activePersona?.id === 'parent' || profile?.role === 'student' || !!profile?.studentId)
  );

  const authorizedStudentId = profile?.studentId || (activePersona?.id === 'parent' ? 'std-1' : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isStaff,
        isParent,
        authorizedStudentId,
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError,
        isAuthModalOpen,
        authModalReason,
        activePersona,
        switchPersona,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithStudentId,
        signOut,
        navigateToLogin,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
