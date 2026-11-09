// Lion Mode Karate Academy - Member Registrations & Student ID Directory
// Manages parent registrations and Sensei Student ID allocations

export interface MemberRegistration {
  id: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  passportId: string;
  program?: string;
  notes?: string;
  status: 'pending' | 'allocated' | 'rejected';
  allocatedStudentId?: string;
  createdAt: string;
  allocatedAt?: string;
}

const REGISTRATION_STORAGE_KEY = 'lionmode_member_registrations';

export const INITIAL_MEMBER_REGISTRATIONS: MemberRegistration[] = [
  {
    id: 'reg-101',
    parentName: 'Priya Naidoo',
    parentPhone: '+27 82 345 6780',
    parentEmail: 'priya.naidoo@gmail.com',
    studentName: 'Liam Naidoo',
    passportId: 'ZA-2013-0514-N',
    program: 'junior_fighters',
    notes: 'Brown Belt 3rd Kyu student, transferring from dojo junior roster.',
    status: 'allocated',
    allocatedStudentId: 'LMK-2024-001',
    createdAt: '2026-10-15T09:30:00Z',
    allocatedAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'reg-102',
    parentName: 'Mandla Dlamini',
    parentPhone: '+27 83 234 5670',
    parentEmail: 'sipho.d@outlook.co.za',
    studentName: 'Sipho Dlamini',
    passportId: 'ZA-2009-0822-D',
    program: 'teen_warriors',
    notes: 'Green belt student competing in youth kumite circuit.',
    status: 'allocated',
    allocatedStudentId: 'LMK-2024-002',
    createdAt: '2026-10-18T14:15:00Z',
    allocatedAt: '2026-10-18T16:00:00Z'
  },
  {
    id: 'reg-103',
    parentName: 'Sarah Connor',
    parentPhone: '+27 82 123 4567',
    parentEmail: 'sarah.connor@gmail.com',
    studentName: 'John Connor',
    passportId: 'ZA-2015-0912-C',
    program: 'little_warriors',
    notes: 'Beginner registration for Lionmode Kids class. Interested in weekend sessions.',
    status: 'pending',
    createdAt: '2026-11-06T10:20:00Z'
  },
  {
    id: 'reg-104',
    parentName: 'David & Thandi Sithole',
    parentPhone: '+27 76 998 1234',
    parentEmail: 'd.sithole@icloud.com',
    studentName: 'Zane Sithole',
    passportId: 'ZA-2016-0402-S',
    program: 'junior_fighters',
    notes: 'Completed 1-week free trial pass. Ready for formal dojo enrollment.',
    status: 'pending',
    createdAt: '2026-11-07T06:45:00Z'
  }
];

export function getMemberRegistrations(): MemberRegistration[] {
  try {
    const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load member registrations from localStorage', e);
  }
  return INITIAL_MEMBER_REGISTRATIONS;
}

export function saveMemberRegistrations(registrations: MemberRegistration[]): void {
  try {
    localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(registrations));
  } catch (e) {
    console.warn('Failed to save member registrations to localStorage', e);
  }
}

export function submitMemberRegistration(data: {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  passportId: string;
  program?: string;
  notes?: string;
}): MemberRegistration {
  const current = getMemberRegistrations();
  const newReg: MemberRegistration = {
    id: `reg-${Date.now()}`,
    parentName: data.parentName.trim(),
    parentPhone: data.parentPhone.trim(),
    parentEmail: data.parentEmail.trim(),
    studentName: data.studentName.trim(),
    passportId: data.passportId.trim().toUpperCase(),
    program: data.program || 'little_warriors',
    notes: data.notes || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const updated = [newReg, ...current];
  saveMemberRegistrations(updated);

  // Trigger Sensei email notification mailto / dispatch log
  console.log('[SENSEI NOTIFICATION] New member registration submitted:', {
    to: 'babuvash@gmail.com',
    subject: `[LION MODE] New Member Registration: ${newReg.studentName} (Parent: ${newReg.parentName})`,
    body: `New Dojo Member Registration Details:
Parent Name: ${newReg.parentName}
Parent Phone / WhatsApp: ${newReg.parentPhone}
Parent Email: ${newReg.parentEmail}
Student Name: ${newReg.studentName}
Passport / ID Number: ${newReg.passportId}
Program: ${newReg.program}
Submitted: ${new Date(newReg.createdAt).toLocaleString()}

Please allocate a Student ID in Dojo OS Admin and notify the parent.`
  });

  return newReg;
}

export function allocateStudentId(
  registrationId: string, 
  studentIdCode: string
): MemberRegistration | null {
  const current = getMemberRegistrations();
  const index = current.findIndex(r => r.id === registrationId);
  if (index === -1) return null;

  const updatedItem: MemberRegistration = {
    ...current[index],
    status: 'allocated',
    allocatedStudentId: studentIdCode.trim().toUpperCase(),
    allocatedAt: new Date().toISOString()
  };

  current[index] = updatedItem;
  saveMemberRegistrations(current);
  return updatedItem;
}

export function generateNextStudentId(): string {
  const current = getMemberRegistrations();
  const year = new Date().getFullYear();
  const count = current.filter(r => r.status === 'allocated').length + 5;
  const numStr = String(count).padStart(3, '0');
  return `LMK-${year}-${numStr}`;
}
