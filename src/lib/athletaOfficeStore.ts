// Lion Mode Karate Academy (https://lionmodekarate.com)
// AthletaOffice: Comprehensive Dojo Business Management System Store
// Shared Interconnected Engine: CRM, Families, Scheduling, Attendance, Grading, Billing, Expenses, Messages, Events, Staff, Inventory & Automations

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface FamilyRecord {
  id: string;
  familyName: string;
  primaryGuardian: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
    emergencyContact: string;
    address: string;
  };
  studentIds: string[];
  siblingDiscountPercent: number;
  accountBalanceZAR: number;
  billingStatus: "good_standing" | "overdue" | "pending";
  membershipPlan: string;
  notes: string;
  updatedAt: string;
}

export interface StudentRecord {
  id: string;
  studentIdCode: string; // e.g. LMK-2024-001
  familyId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  photoURL: string;
  status: "active" | "trial" | "pending_approval" | "suspended" | "inactive";
  beltRank: string;
  beltColor: string;
  rankLevel: string;
  discipline: string;
  assignedInstructor: string;
  trainingProgram: string;
  currentStreak: number;
  classesAttendedAtCurrentBelt: number;
  requiredClassesForNextBelt: number;
  timeInGradeMonths: number;
  minMonthsRequired: number;
  isGradingEligible: boolean;
  medicalInfo: {
    conditions: string;
    allergies: string;
    injuries: string;
    signedWaiver: boolean;
  };
  tags: string[]; // e.g. ["INJURY", "VIP TRIAL", "COMPETITION SQUAD", "AUTO-PAY"]
  unsignedWaiver: boolean;
  physicalNotes?: string;
  oneRepMaxKg?: number;
  registrationDate: string;
}

export interface ClassScheduleRecord {
  id: string;
  title: string;
  discipline: string;
  dayOfWeek: number; // 1 = Mon, 6 = Sat, 7 = Sun
  dayName: string;
  startTime: string; // "16:30"
  endTime: string;   // "17:30"
  durationMinutes: number;
  venue: string;
  room: string;
  instructorName: string;
  assistantInstructor?: string;
  capacity: number;
  enrolledCount: number;
  enrolledStudentIds?: string[];
  eligibleBelts: string;
  ageRange: string;
  sessionFeeZAR: number;
  color: string;
  status: "active" | "full" | "cancelled";
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  className: string;
  date: string;
  studentId: string;
  studentName: string;
  beltRank: string;
  status: "present" | "absent" | "late" | "excused" | "makeup";
  checkInMethod: "instructor_tap" | "qr_kiosk" | "pin";
  timestamp: string;
  instructorName: string;
  notes?: string;
}

export interface BeltRankConfig {
  rank: string;
  name: string;
  color: string;
  sequence: number;
  stripesRequired: number;
  minClassesRequired: number;
  minMonthsRequired: number;
  gradingFeeZAR: number;
  curriculumTopics: string[];
}

export interface GradingEventRecord {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  chiefExaminer: string;
  candidateIds: string[];
  feeZAR: number;
  status: "upcoming" | "in_progress" | "completed";
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  familyId: string;
  familyName: string;
  studentNames: string[];
  invoiceDate: string;
  dueDate: string;
  billingPeriod: string;
  items: Array<{
    description: string;
    studentName?: string;
    amount: number;
    type: "tuition" | "grading" | "gear" | "annual_fee";
  }>;
  subtotal: number;
  discountZAR: number;
  totalZAR: number;
  status: "paid" | "issued" | "overdue";
  paymentMethod?: "eft" | "cash" | "card" | "payfast" | "yoco";
  paidDate?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: "Facility & Rent" | "Equipment & Gear" | "Marketing & Ads" | "Staff & Payroll" | "Software & Utilities" | "Insurance & Legal";
  description: string;
  amountZAR: number;
  vendor: string;
  recordedBy: string;
}

export interface MessageRecord {
  id: string;
  sentAt: string;
  subject: string;
  body: string;
  channel: "email" | "sms" | "whatsapp" | "in_app";
  recipientFilter: string;
  recipientCount: number;
  status: "delivered" | "sent" | "scheduled";
}

export interface MessageTemplateRecord {
  id: string;
  title: string;
  channel: "email" | "sms" | "whatsapp" | "in_app";
  subject: string;
  body: string;
  category: "Welcome" | "Billing" | "Grading" | "Absence" | "Holiday";
}

export interface EventTournamentRecord {
  id: string;
  title: string;
  type: "Tournament" | "Seminar" | "Grading" | "Camp" | "Demonstration";
  date: string;
  time: string;
  venue: string;
  feeZAR: number;
  capacity: number;
  registeredStudentIds: string[];
  status: "upcoming" | "in_progress" | "completed";
  categories: string[];
}

export interface OnlineRegistrationRecord {
  id: string;
  submittedAt: string;
  studentName: string;
  age: number;
  dob: string;
  guardianName: string;
  email: string;
  phone: string;
  program: string;
  medicalNotes: string;
  status: "pending" | "approved" | "rejected";
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  module: string;
}

export interface StaffMemberRecord {
  id: string;
  name: string;
  role: "Chief Instructor" | "Senior Sensei" | "Youth Coach" | "Assistant Instructor" | "Dojo Manager";
  martialArtsRank: string;
  email: string;
  phone: string;
  photoURL: string;
  payModel: "salary" | "per_class" | "hourly";
  baseRateZAR: number;
  classesTaughtMonth: number;
  permissions: {
    canManageInvoices: boolean;
    canViewAllSchedules: boolean;
    canTakeAttendance: boolean;
    canEditBeltRanks: boolean;
    canAccessReports: boolean;
    canLogExpenses: boolean;
  };
}

export interface AutomationWorkflowRecord {
  id: string;
  title: string;
  trigger: string;
  condition: string;
  action: string;
  channel: "email" | "sms" | "whatsapp" | "in_app";
  active: boolean;
  executionsCount: number;
}

export interface InventoryItemRecord {
  id: string;
  sku: string;
  name: string;
  category: "Uniforms" | "Sparring Gear" | "Belts" | "Accessories";
  size: string;
  purchaseCostZAR: number;
  sellingPriceZAR: number;
  stockCount: number;
  reorderThreshold: number;
}

export interface AthletaOfficeData {
  families: FamilyRecord[];
  students: StudentRecord[];
  classes: ClassScheduleRecord[];
  attendanceLogs: AttendanceRecord[];
  beltRanks: BeltRankConfig[];
  gradingEvents: GradingEventRecord[];
  invoices: InvoiceRecord[];
  expenses: ExpenseRecord[];
  messages: MessageRecord[];
  templates: MessageTemplateRecord[];
  events: EventTournamentRecord[];
  registrations: OnlineRegistrationRecord[];
  staff: StaffMemberRecord[];
  automations: AutomationWorkflowRecord[];
  inventory: InventoryItemRecord[];
  auditLogs: AuditLogRecord[];
}

export const DEFAULT_BELT_RANKS: BeltRankConfig[] = [
  { rank: "white", name: "White Belt (9th Kyu)", color: "#FFFFFF", sequence: 1, stripesRequired: 2, minClassesRequired: 24, minMonthsRequired: 3, gradingFeeZAR: 350, curriculumTopics: ["Seiza & Dojo Etiquette", "Choku Zuki (Straight Punch)", "Age Uke (Rising Block)", "Mae Geri (Front Kick)"] },
  { rank: "yellow", name: "Yellow Belt (8th Kyu)", color: "#FFD700", sequence: 2, stripesRequired: 2, minClassesRequired: 32, minMonthsRequired: 3, gradingFeeZAR: 400, curriculumTopics: ["Heian Shodan Kata", "Zenkutsu Dachi Stance", "Gyaku Zuki (Reverse Punch)", "Soto Uke (Outside Block)"] },
  { rank: "orange", name: "Orange Belt (7th Kyu)", color: "#FF8C00", sequence: 3, stripesRequired: 3, minClassesRequired: 36, minMonthsRequired: 4, gradingFeeZAR: 450, curriculumTopics: ["Heian Nidan Kata", "Kokutsu Dachi Stance", "Shuto Uke (Knife Hand)", "Basic Kumite 5-Step"] },
  { rank: "green", name: "Green Belt (6th Kyu)", color: "#22C55E", sequence: 4, stripesRequired: 3, minClassesRequired: 44, minMonthsRequired: 5, gradingFeeZAR: 500, curriculumTopics: ["Heian Sandan Kata", "Kiba Dachi (Horse Stance)", "Yoko Geri Keage / Kekomi", "Semi-Free Kumite"] },
  { rank: "blue", name: "Blue Belt (5th Kyu)", color: "#3B82F6", sequence: 5, stripesRequired: 3, minClassesRequired: 48, minMonthsRequired: 6, gradingFeeZAR: 550, curriculumTopics: ["Heian Yondan Kata", "Mawashi Geri (Roundhouse Kick)", "Jiyu Kumite Fundamentals"] },
  { rank: "purple", name: "Purple Belt (4th Kyu)", color: "#A855F7", sequence: 6, stripesRequired: 3, minClassesRequired: 52, minMonthsRequired: 6, gradingFeeZAR: 600, curriculumTopics: ["Heian Godan Kata", "Uraken Uchi", "Continuous Sparring Drills"] },
  { rank: "brown_3", name: "Brown Belt (3rd Kyu)", color: "#92400E", sequence: 7, stripesRequired: 3, minClassesRequired: 60, minMonthsRequired: 8, gradingFeeZAR: 750, curriculumTopics: ["Tekki Shodan Kata", "Bassai Dai Kata", "Advanced Kumite Strategy"] },
  { rank: "black_1", name: "Shodan Black Belt (1st Dan)", color: "#1E293B", sequence: 8, stripesRequired: 0, minClassesRequired: 120, minMonthsRequired: 12, gradingFeeZAR: 1500, curriculumTopics: ["Kanku Dai Kata", "Jion Kata", "Bunkai Application", "Teaching Assistant Certification"] }
];

export const INITIAL_ATHLETA_OFFICE_DATA: AthletaOfficeData = {
  families: [
    {
      id: "FAM-001",
      familyName: "Naidoo Family",
      primaryGuardian: {
        name: "Priya Naidoo",
        email: "priya.naidoo@durbanmail.co.za",
        phone: "+27 82 445 9012",
        relationship: "Mother",
        emergencyContact: "+27 83 555 1200 (Rajen Naidoo)",
        address: "14 Umhlanga Rocks Drive, Durban North"
      },
      studentIds: ["LMK-2024-001", "LMK-2024-002"],
      siblingDiscountPercent: 15,
      accountBalanceZAR: 0,
      billingStatus: "good_standing",
      membershipPlan: "Family Shared Unlimited",
      notes: "Both siblings training 3x/week. Active since 2024.",
      updatedAt: "2026-11-09T10:00:00Z"
    },
    {
      id: "FAM-002",
      familyName: "van der Merwe Family",
      primaryGuardian: {
        name: "Gerhard van der Merwe",
        email: "gerhard.vdm@telkomsa.net",
        phone: "+27 71 889 2311",
        relationship: "Father",
        emergencyContact: "+27 82 990 4455 (Elize van der Merwe)",
        address: "28 Broadway, Durban North"
      },
      studentIds: ["LMK-2024-003"],
      siblingDiscountPercent: 0,
      accountBalanceZAR: 650,
      billingStatus: "overdue",
      membershipPlan: "Junior Warriors Standard",
      notes: "Follow up on October invoice via WhatsApp.",
      updatedAt: "2026-11-08T14:30:00Z"
    },
    {
      id: "FAM-003",
      familyName: "Dlamini Family",
      primaryGuardian: {
        name: "Sipho Dlamini",
        email: "sipho.dlamini@globalza.com",
        phone: "+27 84 332 7789",
        relationship: "Father",
        emergencyContact: "+27 84 555 9811 (Zanele Dlamini)",
        address: "7 Kensington Square, Durban North"
      },
      studentIds: ["LMK-2024-004"],
      siblingDiscountPercent: 0,
      accountBalanceZAR: 0,
      billingStatus: "good_standing",
      membershipPlan: "Cadet Competition Squad",
      notes: "High potential junior kumite competitor.",
      updatedAt: "2026-11-07T09:15:00Z"
    }
  ],

  students: [
    {
      id: "LMK-2024-001",
      studentIdCode: "LMK-2024-001",
      familyId: "FAM-001",
      firstName: "Aarav",
      lastName: "Naidoo",
      dob: "2015-06-14",
      gender: "Male",
      photoURL: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
      status: "active",
      beltRank: "green",
      beltColor: "#22C55E",
      rankLevel: "6th Kyu (Green Belt)",
      discipline: "Shotokan Karate",
      assignedInstructor: "Sensei Babu",
      trainingProgram: "Little Lions (Ages 8–12)",
      currentStreak: 28,
      classesAttendedAtCurrentBelt: 45,
      requiredClassesForNextBelt: 44,
      timeInGradeMonths: 6,
      minMonthsRequired: 5,
      isGradingEligible: true,
      medicalInfo: {
        conditions: "Mild seasonal asthma (inhaler kept in sports bag)",
        allergies: "None",
        injuries: "Cleared from sprained ankle June 2025",
        signedWaiver: true
      },
      tags: ["AUTO-PAY", "COMPETITION SQUAD"],
      unsignedWaiver: false,
      physicalNotes: "Strong kicking fundamentals, focuses on kata tempo.",
      oneRepMaxKg: 35,
      registrationDate: "2024-02-15"
    },
    {
      id: "LMK-2024-002",
      studentIdCode: "LMK-2024-002",
      familyId: "FAM-001",
      firstName: "Diya",
      lastName: "Naidoo",
      dob: "2018-09-22",
      gender: "Female",
      photoURL: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=400&q=80",
      status: "active",
      beltRank: "yellow",
      beltColor: "#FFD700",
      rankLevel: "8th Kyu (Yellow Belt)",
      discipline: "Shotokan Karate",
      assignedInstructor: "Coach Sarah",
      trainingProgram: "Lionmode Kids (Ages 3–8)",
      currentStreak: 18,
      classesAttendedAtCurrentBelt: 22,
      requiredClassesForNextBelt: 32,
      timeInGradeMonths: 2,
      minMonthsRequired: 3,
      isGradingEligible: false,
      medicalInfo: {
        conditions: "None",
        allergies: "Peanuts (epipen carried)",
        injuries: "None",
        signedWaiver: true
      },
      tags: ["SIBLING DISCOUNT", "LITTLE LION"],
      unsignedWaiver: false,
      physicalNotes: "Very agile, working on horse stance stability.",
      registrationDate: "2024-05-10"
    },
    {
      id: "LMK-2024-003",
      studentIdCode: "LMK-2024-003",
      familyId: "FAM-002",
      firstName: "Ruan",
      lastName: "van der Merwe",
      dob: "2012-04-03",
      gender: "Male",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      status: "active",
      beltRank: "blue",
      beltColor: "#3B82F6",
      rankLevel: "5th Kyu (Blue Belt)",
      discipline: "Sports Kumite",
      assignedInstructor: "Sensei Babu",
      trainingProgram: "Lionmode Teens (Ages 13–18)",
      currentStreak: 12,
      classesAttendedAtCurrentBelt: 49,
      requiredClassesForNextBelt: 48,
      timeInGradeMonths: 7,
      minMonthsRequired: 6,
      isGradingEligible: true,
      medicalInfo: {
        conditions: "Recent hip soreness",
        allergies: "None",
        injuries: "Hip strain under rehabilitation",
        signedWaiver: false
      },
      tags: ["INJURY", "OVERDUE ACCOUNT"],
      unsignedWaiver: true,
      physicalNotes: "Scale high kicks and jumping plyometrics due to hip rehab.",
      oneRepMaxKg: 60,
      registrationDate: "2023-08-01"
    },
    {
      id: "LMK-2024-004",
      studentIdCode: "LMK-2024-004",
      familyId: "FAM-003",
      firstName: "Thando",
      lastName: "Dlamini",
      dob: "2010-11-19",
      gender: "Male",
      photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      status: "active",
      beltRank: "brown_3",
      beltColor: "#92400E",
      rankLevel: "3rd Kyu (Brown Belt)",
      discipline: "Shotokan & Kumite",
      assignedInstructor: "Sensei Babu",
      trainingProgram: "Competition Squad",
      currentStreak: 35,
      classesAttendedAtCurrentBelt: 62,
      requiredClassesForNextBelt: 60,
      timeInGradeMonths: 9,
      minMonthsRequired: 8,
      isGradingEligible: true,
      medicalInfo: {
        conditions: "None",
        allergies: "None",
        injuries: "None",
        signedWaiver: true
      },
      tags: ["CHAMPIONSHIP SQUAD", "AUTO-PAY"],
      unsignedWaiver: false,
      physicalNotes: "Exceptional speed. Preparing for KZN Regional Championship.",
      oneRepMaxKg: 75,
      registrationDate: "2022-03-12"
    }
  ],

  classes: [
    {
      id: "CLS-101",
      title: "Lionmode Kids (Ages 3–8)",
      discipline: "Foundational Shotokan",
      dayOfWeek: 1, // Monday
      dayName: "Monday",
      startTime: "15:30",
      endTime: "16:15",
      durationMinutes: 45,
      venue: "Main Dojo Durban",
      room: "Tatami Hall A",
      instructorName: "Coach Sarah",
      assistantInstructor: "Sensei Kevin",
      capacity: 18,
      enrolledCount: 14,
      eligibleBelts: "White to Yellow",
      ageRange: "3–8 Years",
      sessionFeeZAR: 0,
      color: "#F59E0B",
      status: "active"
    },
    {
      id: "CLS-102",
      title: "Little Lions Junior Form (Ages 8–12)",
      discipline: "Heian Kata & Stances",
      dayOfWeek: 1, // Monday
      dayName: "Monday",
      startTime: "16:30",
      endTime: "17:30",
      durationMinutes: 60,
      venue: "Main Dojo Durban",
      room: "Tatami Hall A",
      instructorName: "Sensei Babu",
      capacity: 22,
      enrolledCount: 19,
      eligibleBelts: "White to Green",
      ageRange: "8–12 Years",
      sessionFeeZAR: 0,
      color: "#2563EB",
      status: "active"
    },
    {
      id: "CLS-103",
      title: "Cadet & Teens Kumite (Ages 13–18)",
      discipline: "WKF Sports Sparring",
      dayOfWeek: 2, // Tuesday
      dayName: "Tuesday",
      startTime: "17:45",
      endTime: "19:00",
      durationMinutes: 75,
      venue: "Main Dojo Durban",
      room: "Tatami Hall B",
      instructorName: "Sensei Babu",
      capacity: 16,
      enrolledCount: 15,
      eligibleBelts: "Green Belt & Above",
      ageRange: "13–18 Years",
      sessionFeeZAR: 0,
      color: "#8B5CF6",
      status: "active"
    },
    {
      id: "CLS-104",
      title: "Adult Traditional Karate & Self-Defense",
      discipline: "Shotokan Bunkai & Fitness",
      dayOfWeek: 3, // Wednesday
      dayName: "Wednesday",
      startTime: "18:30",
      endTime: "20:00",
      durationMinutes: 90,
      venue: "Main Dojo Durban",
      room: "Tatami Hall A",
      instructorName: "Sensei Babu",
      capacity: 20,
      enrolledCount: 16,
      eligibleBelts: "All Levels",
      ageRange: "18+ Years",
      sessionFeeZAR: 0,
      color: "#10B981",
      status: "active"
    },
    {
      id: "CLS-105",
      title: "Championship Tournament Squad Prep",
      discipline: "High Performance Kata & Kumite",
      dayOfWeek: 6, // Saturday
      dayName: "Saturday",
      startTime: "09:00",
      endTime: "11:00",
      durationMinutes: 120,
      venue: "Main Dojo Durban",
      room: "Full Floor",
      instructorName: "Sensei Babu",
      capacity: 24,
      enrolledCount: 20,
      eligibleBelts: "Selected Competitors",
      ageRange: "All Ages",
      sessionFeeZAR: 50,
      color: "#EF4444",
      status: "active"
    }
  ],

  attendanceLogs: [
    {
      id: "ATT-1001",
      classId: "CLS-102",
      className: "Little Lions Junior Form (Ages 8–12)",
      date: "2026-11-09",
      studentId: "LMK-2024-001",
      studentName: "Aarav Naidoo",
      beltRank: "Green Belt",
      status: "present",
      checkInMethod: "instructor_tap",
      timestamp: "2026-11-09T16:28:10Z",
      instructorName: "Sensei Babu"
    },
    {
      id: "ATT-1002",
      classId: "CLS-101",
      className: "Lionmode Kids (Ages 3–8)",
      date: "2026-11-09",
      studentId: "LMK-2024-002",
      studentName: "Diya Naidoo",
      beltRank: "Yellow Belt",
      status: "present",
      checkInMethod: "qr_kiosk",
      timestamp: "2026-11-09T15:26:40Z",
      instructorName: "Coach Sarah"
    },
    {
      id: "ATT-1003",
      classId: "CLS-103",
      className: "Cadet & Teens Kumite (Ages 13–18)",
      date: "2026-11-03",
      studentId: "LMK-2024-003",
      studentName: "Ruan van der Merwe",
      beltRank: "Blue Belt",
      status: "absent",
      checkInMethod: "instructor_tap",
      timestamp: "2026-11-03T17:45:00Z",
      instructorName: "Sensei Babu",
      notes: "School exam preparation"
    }
  ],

  beltRanks: DEFAULT_BELT_RANKS,

  gradingEvents: [
    {
      id: "GRD-2026-Q4",
      title: "End-of-Year Official Belt Grading & Showcase",
      date: "2026-11-28",
      venue: "Lion Mode Main Arena, Durban",
      chiefExaminer: "Sensei Babu (5th Dan Shihan)",
      candidateIds: ["LMK-2024-001", "LMK-2024-003", "LMK-2024-004"],
      feeZAR: 550,
      status: "upcoming"
    }
  ],

  invoices: [
    {
      id: "INV-2026-1101",
      invoiceNumber: "INV-LMK-089",
      familyId: "FAM-001",
      familyName: "Naidoo Family",
      studentNames: ["Aarav Naidoo", "Diya Naidoo"],
      invoiceDate: "2026-11-01",
      dueDate: "2026-11-07",
      billingPeriod: "November 2026",
      items: [
        { description: "Monthly Martial Arts Tuition (Aarav)", studentName: "Aarav Naidoo", amount: 850, type: "tuition" },
        { description: "Monthly Martial Arts Tuition (Diya - Sibling Discount 15%)", studentName: "Diya Naidoo", amount: 722.50, type: "tuition" },
        { description: "Q4 Grading Examination Registration Fee", studentName: "Aarav Naidoo", amount: 500, type: "grading" }
      ],
      subtotal: 2072.50,
      discountZAR: 127.50,
      totalZAR: 2072.50,
      status: "paid",
      paymentMethod: "eft",
      paidDate: "2026-11-03"
    },
    {
      id: "INV-2026-1102",
      invoiceNumber: "INV-LMK-090",
      familyId: "FAM-002",
      familyName: "van der Merwe Family",
      studentNames: ["Ruan van der Merwe"],
      invoiceDate: "2026-10-01",
      dueDate: "2026-10-07",
      billingPeriod: "October 2026",
      items: [
        { description: "Monthly Martial Arts Tuition", studentName: "Ruan van der Merwe", amount: 650, type: "tuition" }
      ],
      subtotal: 650,
      discountZAR: 0,
      totalZAR: 650,
      status: "overdue"
    }
  ],

  expenses: [
    { id: "EXP-01", date: "2026-11-01", category: "Facility & Rent", description: "Dojo Tatami Hall Lease - Umhlanga", amountZAR: 18500, vendor: "Durban Commercial Properties", recordedBy: "Sensei Babu" },
    { id: "EXP-02", date: "2026-11-03", category: "Equipment & Gear", description: "WKF Karate Tatami Mats & Focus Mitts", amountZAR: 4200, vendor: "Martial Supplies SA", recordedBy: "Sensei Babu" },
    { id: "EXP-03", date: "2026-11-05", category: "Staff & Payroll", description: "Youth Coaching Session Remuneration", amountZAR: 6160, vendor: "Coach Sarah", recordedBy: "Sensei Babu" },
    { id: "EXP-04", date: "2026-11-06", category: "Marketing & Ads", description: "VIP Trial Funnel Meta Ads", amountZAR: 2800, vendor: "Meta Ads SA", recordedBy: "Sensei Babu" }
  ],

  messages: [
    { id: "MSG-01", sentAt: "2026-11-09T14:00:00Z", subject: "Lion Mode End-of-Year Grading Examination Notice", body: "Dear Parents and Students, our official Q4 Belt Grading is scheduled for Saturday 28 November. Please verify training eligibility with Sensei Babu.", channel: "email", recipientFilter: "All Active Students", recipientCount: 28, status: "delivered" },
    { id: "MSG-02", sentAt: "2026-11-08T09:30:00Z", subject: "Overdue Tuition Friendly Reminder", body: "Hi from Lion Mode Karate, this is a reminder regarding October outstanding fees. Kindly settle via EFT or visit front desk.", channel: "sms", recipientFilter: "Overdue Accounts", recipientCount: 2, status: "delivered" },
    { id: "MSG-03", sentAt: "2026-11-07T11:00:00Z", subject: "Welcome to Lion Mode Dojo!", body: "Welcome to the Lion Mode family! Your student ID has been activated. See class schedules in your Member Portal.", channel: "whatsapp", recipientFilter: "New Students", recipientCount: 4, status: "delivered" }
  ],

  templates: [
    { id: "TPL-01", title: "New Student Welcome & Portal Access", channel: "email", subject: "Welcome to Lion Mode Karate Academy!", body: "Dear {{parent_name}},\n\nWelcome to Lion Mode Karate! {{student_name}} is now officially registered with Member ID {{student_id}}. Log in at app.lionmodekarate.com to access the belt passport and class schedule.\n\nOsu!\nSensei Babu", category: "Welcome" },
    { id: "TPL-02", title: "Belt Promotion Celebration", channel: "whatsapp", subject: "Congratulations on your belt promotion!", body: "Oss! Huge congratulations to {{student_name}} on passing their grading to {{new_belt}}! Keep up the spirit and discipline.", category: "Grading" },
    { id: "TPL-03", title: "Monthly Invoice Issued Notice", channel: "email", subject: "Lion Mode Karate Invoice: {{billing_period}}", body: "Dear {{parent_name}},\n\nYour monthly tuition statement (Invoice #{{invoice_number}}) for ZAR {{amount}} has been issued. Settle via EFT or in the Member Portal.\n\nThank you,\nLion Mode Administration", category: "Billing" },
    { id: "TPL-04", title: "Absence Follow-Up Check-in", channel: "sms", subject: "We missed you on the mat!", body: "Hi {{student_name}}, Sensei noticed you missed class this week. Hope all is well! Let us know if you need to book a make-up session.", category: "Absence" }
  ],

  events: [
    { id: "EVT-01", title: "KZN Open Martial Arts Championship", type: "Tournament", date: "2026-12-05", time: "08:30 - 17:00", venue: "Olive Convention Centre, Durban", feeZAR: 450, capacity: 50, registeredStudentIds: ["LMK-2024-001", "LMK-2024-004"], status: "upcoming", categories: ["Kata Boys 8-10", "Kumite Cadet 13-15", "Kata Senior"] },
    { id: "EVT-02", title: "Bunkai & Self-Defense Masterclass with Shihan", type: "Seminar", date: "2026-11-21", time: "10:00 - 13:00", venue: "Main Dojo Durban", feeZAR: 250, capacity: 30, registeredStudentIds: ["LMK-2024-001", "LMK-2024-003"], status: "upcoming", categories: ["Green Belt & Above"] }
  ],

  registrations: [
    { id: "REG-01", submittedAt: "2026-11-10T08:15:00Z", studentName: "Liam Botha", age: 9, dob: "2017-03-12", guardianName: "Johan Botha", email: "johan.botha@vodamail.co.za", phone: "+27 82 998 1234", program: "Little Lions (Ages 8–12)", medicalNotes: "No chronic conditions, signed digital waiver.", status: "pending" },
    { id: "REG-02", submittedAt: "2026-11-09T16:40:00Z", studentName: "Ayanda Zulu", age: 14, dob: "2012-08-20", guardianName: "Nomusa Zulu", email: "nomusa.zulu@gmail.com", phone: "+27 73 112 4590", program: "Lionmode Teens (Ages 13–18)", medicalNotes: "None", status: "pending" }
  ],

  staff: [
    {
      id: "STF-01",
      name: "Sensei Babu",
      role: "Chief Instructor",
      martialArtsRank: "5th Dan Black Belt",
      email: "babuvash@gmail.com",
      phone: "+27 82 555 0199",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      payModel: "salary",
      baseRateZAR: 28000,
      classesTaughtMonth: 38,
      permissions: {
        canManageInvoices: true,
        canViewAllSchedules: true,
        canTakeAttendance: true,
        canEditBeltRanks: true,
        canAccessReports: true,
        canLogExpenses: true
      }
    },
    {
      id: "STF-02",
      name: "Coach Sarah Jenkins",
      role: "Youth Coach",
      martialArtsRank: "3rd Dan Black Belt",
      email: "coach.sarah@lionmodekarate.com",
      phone: "+27 83 441 8820",
      photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      payModel: "per_class",
      baseRateZAR: 280,
      classesTaughtMonth: 22,
      permissions: {
        canManageInvoices: false,
        canViewAllSchedules: true,
        canTakeAttendance: true,
        canEditBeltRanks: true,
        canAccessReports: false,
        canLogExpenses: false
      }
    }
  ],

  automations: [
    {
      id: "AUTO-01",
      title: "Consecutive Absence Alert (3 Missed Classes)",
      trigger: "student_misses_3_classes",
      condition: "consecutive_absences >= 3",
      action: "Send friendly check-in WhatsApp to Parent & notify Sensei",
      channel: "whatsapp",
      active: true,
      executionsCount: 14
    },
    {
      id: "AUTO-02",
      title: "Belt Grading Eligibility Notification",
      trigger: "student_becomes_grading_eligible",
      condition: "classes_attended >= required && time_in_grade >= required",
      action: "Notify Parent Portal & invite to upcoming grading event",
      channel: "email",
      active: true,
      executionsCount: 28
    },
    {
      id: "AUTO-03",
      title: "Overdue Invoice 7-Day Follow-Up",
      trigger: "invoice_overdue_days >= 7",
      condition: "status == 'overdue'",
      action: "Issue gentle automated SMS reminder with EFT banking details",
      channel: "sms",
      active: true,
      executionsCount: 9
    }
  ],

  inventory: [
    {
      id: "INV-ITEM-01",
      sku: "GI-PRO-4",
      name: "Lion Mode Heavyweight Gi (Size 4)",
      category: "Uniforms",
      size: "Size 4 (170cm)",
      purchaseCostZAR: 650,
      sellingPriceZAR: 1299,
      stockCount: 18,
      reorderThreshold: 5
    },
    {
      id: "INV-ITEM-02",
      sku: "MITT-WKF-M",
      name: "WKF Approved Sparring Mitts (Red)",
      category: "Sparring Gear",
      size: "Medium",
      purchaseCostZAR: 220,
      sellingPriceZAR: 499,
      stockCount: 12,
      reorderThreshold: 4
    },
    {
      id: "INV-ITEM-03",
      sku: "BELT-GRN-3",
      name: "Official Rank Belt (Green)",
      category: "Belts",
      size: "260cm",
      purchaseCostZAR: 75,
      sellingPriceZAR: 195,
      stockCount: 8,
      reorderThreshold: 3
    }
  ],

  auditLogs: [
    { id: "LOG-01", timestamp: "2026-11-10T12:00:00Z", user: "babuvash@gmail.com", action: "SYSTEM_INITIALIZED", details: "AthletaOffice connected with Firestore & local persistence", module: "Core" },
    { id: "LOG-02", timestamp: "2026-11-09T16:28:10Z", user: "Sensei Babu", action: "ATTENDANCE_RECORDED", details: "Marked Aarav Naidoo PRESENT in CLS-102", module: "Attendance" },
    { id: "LOG-03", timestamp: "2026-11-08T10:15:00Z", user: "Sensei Babu", action: "INVOICE_GENERATED", details: "Issued INV-LMK-089 to Naidoo Family (ZAR 2072.50)", module: "Finance" }
  ]
};

const LOCAL_STORAGE_KEY = "lionmode_athleta_office_v1";
const FIRESTORE_DOC_PATH = "site_settings/athleta_office";

export function getInitialAthletaData(): AthletaOfficeData {
  if (typeof window === "undefined") return INITIAL_ATHLETA_OFFICE_DATA;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_ATHLETA_OFFICE_DATA, ...parsed };
    }
  } catch (e) {
    console.warn("Could not read AthletaOffice data from localStorage", e);
  }
  return INITIAL_ATHLETA_OFFICE_DATA;
}

export function useAthletaOffice() {
  const [data, setData] = useState<AthletaOfficeData>(getInitialAthletaData);

  useEffect(() => {
    const handleUpdate = () => {
      setData(getInitialAthletaData());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("lionmode_athleta_updated", handleUpdate);

    // Sync with Firestore
    const fetchRemote = async () => {
      try {
        const snap = await getDoc(doc(db, FIRESTORE_DOC_PATH));
        if (snap.exists()) {
          const remoteData = snap.data();
          if (remoteData && typeof remoteData === "object") {
            const merged = { ...INITIAL_ATHLETA_OFFICE_DATA, ...remoteData };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            setData(merged as AthletaOfficeData);
          }
        }
      } catch (err) {
        // Fallback silently to localStorage
      }
    };
    fetchRemote();

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("lionmode_athleta_updated", handleUpdate);
    };
  }, []);

  // Action methods
  const saveAllData = async (updated: Partial<AthletaOfficeData>) => {
    try {
      const current = getInitialAthletaData();
      const merged = { ...current, ...updated };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("lionmode_athleta_updated"));
      setData(merged);

      try {
        await setDoc(doc(db, FIRESTORE_DOC_PATH), merged, { merge: true });
      } catch (firestoreErr) {
        console.warn("Firestore sync error, saved locally", firestoreErr);
      }
    } catch (e) {
      console.error("Failed to save AthletaOffice data", e);
      throw e;
    }
  };

  const logAudit = async (action: string, details: string, moduleName: string = "Admin") => {
    const current = getInitialAthletaData();
    const newLog: AuditLogRecord = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Sensei Babu",
      action,
      details,
      module: moduleName
    };
    await saveAllData({ auditLogs: [newLog, ...(current.auditLogs || [])] });
  };

  const addStudent = async (student: Partial<StudentRecord>) => {
    const current = getInitialAthletaData();
    const newId = `LMK-2026-${String(current.students.length + 1).padStart(3, "0")}`;
    const newStudent: StudentRecord = {
      id: newId,
      studentIdCode: newId,
      familyId: student.familyId || "FAM-001",
      firstName: student.firstName || "New",
      lastName: student.lastName || "Martial Artist",
      dob: student.dob || "2016-01-01",
      gender: student.gender || "Male",
      photoURL: student.photoURL || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
      status: "active",
      beltRank: student.beltRank || "white",
      beltColor: student.beltColor || "#FFFFFF",
      rankLevel: student.rankLevel || "White Belt (9th Kyu)",
      discipline: student.discipline || "Shotokan Karate",
      assignedInstructor: student.assignedInstructor || "Sensei Babu",
      trainingProgram: student.trainingProgram || "Little Lions (Ages 8–12)",
      currentStreak: 1,
      classesAttendedAtCurrentBelt: 0,
      requiredClassesForNextBelt: 24,
      timeInGradeMonths: 0,
      minMonthsRequired: 3,
      isGradingEligible: false,
      medicalInfo: student.medicalInfo || { conditions: "None", allergies: "None", injuries: "None", signedWaiver: true },
      tags: student.tags || ["NEW MEMBER"],
      unsignedWaiver: false,
      physicalNotes: student.physicalNotes || "",
      oneRepMaxKg: student.oneRepMaxKg || 20,
      registrationDate: new Date().toISOString().split("T")[0]
    };
    const updatedStudents = [newStudent, ...current.students];
    await saveAllData({ students: updatedStudents });
    await logAudit("STUDENT_REGISTERED", `Registered ${newStudent.firstName} ${newStudent.lastName} (${newId})`, "Students");
    return newStudent;
  };

  const updateStudent = async (id: string, updates: Partial<StudentRecord>) => {
    const current = getInitialAthletaData();
    const updatedStudents = current.students.map(s => (s.id === id ? { ...s, ...updates } : s));
    await saveAllData({ students: updatedStudents });
    await logAudit("STUDENT_UPDATED", `Updated student record ${id}`, "Students");
  };

  const deleteStudent = async (id: string) => {
    const current = getInitialAthletaData();
    const target = current.students.find(s => s.id === id);
    const updatedStudents = current.students.filter(s => s.id !== id);
    await saveAllData({ students: updatedStudents });
    await logAudit("STUDENT_DELETED", `Removed student ${target?.firstName} ${target?.lastName} (${id})`, "Students");
  };

  const uploadStudentPhoto = async (id: string, photoURL: string) => {
    await updateStudent(id, { photoURL });
    await logAudit("PHOTO_UPLOADED", `Uploaded photo for student ${id}`, "Students");
  };

  const addFamily = async (family: Partial<FamilyRecord>) => {
    const current = getInitialAthletaData();
    const newId = `FAM-${String((current.families?.length || 0) + 1).padStart(3, "0")}`;
    const newFamily: FamilyRecord = {
      id: newId,
      familyName: family.familyName || "New Family",
      primaryGuardian: family.primaryGuardian || {
        name: "Guardian Name",
        email: "parent@durbanmail.co.za",
        phone: "+27 82 000 0000",
        relationship: "Parent",
        emergencyContact: "+27 82 000 0000",
        address: "Durban"
      },
      studentIds: family.studentIds || [],
      siblingDiscountPercent: family.siblingDiscountPercent || 0,
      accountBalanceZAR: family.accountBalanceZAR || 0,
      billingStatus: "good_standing",
      membershipPlan: family.membershipPlan || "Standard Plan",
      notes: family.notes || "",
      updatedAt: new Date().toISOString()
    };
    await saveAllData({ families: [...(current.families || []), newFamily] });
    await logAudit("FAMILY_ADDED", `Created family account ${newFamily.familyName}`, "Families");
    return newFamily;
  };

  const updateFamily = async (id: string, updates: Partial<FamilyRecord>) => {
    const current = getInitialAthletaData();
    const updatedFamilies = (current.families || []).map(f => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f));
    await saveAllData({ families: updatedFamilies });
    await logAudit("FAMILY_UPDATED", `Updated family account ${id}`, "Families");
  };

  const addClass = async (cls: Partial<ClassScheduleRecord>) => {
    const current = getInitialAthletaData();
    const newId = `CLS-${Date.now().toString().slice(-4)}`;
    const newClass: ClassScheduleRecord = {
      id: newId,
      title: cls.title || "New Martial Arts Class",
      discipline: cls.discipline || "Shotokan Karate",
      dayOfWeek: cls.dayOfWeek || 1,
      dayName: cls.dayName || "Monday",
      startTime: cls.startTime || "16:00",
      endTime: cls.endTime || "17:00",
      durationMinutes: cls.durationMinutes || 60,
      venue: cls.venue || "Main Dojo Durban",
      room: cls.room || "Tatami Hall A",
      instructorName: cls.instructorName || "Sensei Babu",
      capacity: cls.capacity || 20,
      enrolledCount: cls.enrolledCount || 0,
      eligibleBelts: cls.eligibleBelts || "All Belts",
      ageRange: cls.ageRange || "All Ages",
      sessionFeeZAR: cls.sessionFeeZAR || 0,
      color: cls.color || "#2563EB",
      status: "active"
    };
    await saveAllData({ classes: [...(current.classes || []), newClass] });
    await logAudit("CLASS_SCHEDULED", `Added class ${newClass.title}`, "Schedule");
    return newClass;
  };

  const updateClass = async (id: string, updates: Partial<ClassScheduleRecord>) => {
    const current = getInitialAthletaData();
    const updatedClasses = (current.classes || []).map(c => (c.id === id ? { ...c, ...updates } : c));
    await saveAllData({ classes: updatedClasses });
    await logAudit("CLASS_UPDATED", `Updated class ${id}`, "Schedule");
  };

  const deleteClass = async (id: string) => {
    const current = getInitialAthletaData();
    const updatedClasses = (current.classes || []).map(c => (c.id === id ? { ...c, status: "cancelled" as const } : c));
    await saveAllData({ classes: updatedClasses });
    await logAudit("CLASS_CANCELLED", `Cancelled class ${id}`, "Schedule");
  };

  const recordAttendance = async (attendanceItem: Omit<AttendanceRecord, "id" | "timestamp">) => {
    const current = getInitialAthletaData();
    const newId = `ATT-${Date.now()}`;
    const newRecord: AttendanceRecord = {
      ...attendanceItem,
      id: newId,
      timestamp: new Date().toISOString()
    };

    // Update streak and classes attended
    const updatedStudents = current.students.map(s => {
      if (s.id === attendanceItem.studentId) {
        const isPresent = attendanceItem.status === "present" || attendanceItem.status === "late";
        const newAttended = isPresent ? s.classesAttendedAtCurrentBelt + 1 : s.classesAttendedAtCurrentBelt;
        const newStreak = isPresent ? s.currentStreak + 1 : Math.max(0, s.currentStreak - 1);
        const isEligible = newAttended >= s.requiredClassesForNextBelt && s.timeInGradeMonths >= s.minMonthsRequired;
        return {
          ...s,
          classesAttendedAtCurrentBelt: newAttended,
          currentStreak: newStreak,
          isGradingEligible: isEligible
        };
      }
      return s;
    });

    await saveAllData({
      attendanceLogs: [newRecord, ...current.attendanceLogs],
      students: updatedStudents
    });
    await logAudit("ATTENDANCE_TAKEN", `Marked ${attendanceItem.studentName} ${attendanceItem.status.toUpperCase()} in ${attendanceItem.className}`, "Attendance");
  };

  const promoteStudentBelt = async (studentId: string, nextRankKey: string) => {
    const current = getInitialAthletaData();
    const rankConfig = current.beltRanks.find(r => r.rank === nextRankKey);
    if (!rankConfig) return;

    const targetStudent = current.students.find(s => s.id === studentId);
    const updatedStudents = current.students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          beltRank: rankConfig.rank,
          beltColor: rankConfig.color,
          rankLevel: rankConfig.name,
          classesAttendedAtCurrentBelt: 0,
          requiredClassesForNextBelt: rankConfig.minClassesRequired,
          timeInGradeMonths: 0,
          minMonthsRequired: rankConfig.minMonthsRequired,
          isGradingEligible: false
        };
      }
      return s;
    });

    await saveAllData({ students: updatedStudents });
    await logAudit("BELT_PROMOTION", `Promoted ${targetStudent?.firstName} ${targetStudent?.lastName} to ${rankConfig.name}`, "Curriculum");
  };

  const createInvoice = async (invoice: Partial<InvoiceRecord>) => {
    const current = getInitialAthletaData();
    const count = (current.invoices?.length || 0) + 1;
    const invNumber = `INV-LMK-${String(count).padStart(3, "0")}`;
    const newInvoice: InvoiceRecord = {
      id: `INV-${Date.now()}`,
      invoiceNumber: invNumber,
      familyId: invoice.familyId || "FAM-001",
      familyName: invoice.familyName || "Valued Family",
      studentNames: invoice.studentNames || ["Student"],
      invoiceDate: invoice.invoiceDate || new Date().toISOString().split("T")[0],
      dueDate: invoice.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      billingPeriod: invoice.billingPeriod || "Current Month",
      items: invoice.items || [{ description: "Monthly Martial Arts Tuition", amount: 750, type: "tuition" }],
      subtotal: invoice.subtotal || 750,
      discountZAR: invoice.discountZAR || 0,
      totalZAR: invoice.totalZAR || 750,
      status: invoice.status || "issued",
      paymentMethod: invoice.paymentMethod
    };
    await saveAllData({ invoices: [newInvoice, ...(current.invoices || [])] });
    await logAudit("INVOICE_CREATED", `Issued invoice ${invNumber} for ZAR ${newInvoice.totalZAR}`, "Finance");
    return newInvoice;
  };

  const markInvoicePaid = async (invoiceId: string, paymentMethod: "eft" | "cash" | "card" | "payfast" | "yoco") => {
    const current = getInitialAthletaData();
    const updatedInvoices = current.invoices.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: "paid" as const,
          paymentMethod,
          paidDate: new Date().toISOString().split("T")[0]
        };
      }
      return inv;
    });
    await saveAllData({ invoices: updatedInvoices });
    await logAudit("PAYMENT_RECORDED", `Marked invoice ${invoiceId} as PAID via ${paymentMethod.toUpperCase()}`, "Finance");
  };

  const addExpense = async (exp: Partial<ExpenseRecord>) => {
    const current = getInitialAthletaData();
    const newExpense: ExpenseRecord = {
      id: `EXP-${Date.now()}`,
      date: exp.date || new Date().toISOString().split("T")[0],
      category: exp.category || "Equipment & Gear",
      description: exp.description || "Dojo operational expense",
      amountZAR: exp.amountZAR || 0,
      vendor: exp.vendor || "Supplier",
      recordedBy: exp.recordedBy || "Sensei Babu"
    };
    await saveAllData({ expenses: [newExpense, ...(current.expenses || [])] });
    await logAudit("EXPENSE_RECORDED", `Logged expense ZAR ${newExpense.amountZAR} (${newExpense.category})`, "Finance");
    return newExpense;
  };

  const deleteExpense = async (id: string) => {
    const current = getInitialAthletaData();
    const updated = (current.expenses || []).filter(e => e.id !== id);
    await saveAllData({ expenses: updated });
    await logAudit("EXPENSE_DELETED", `Removed expense ${id}`, "Finance");
  };

  const sendMessage = async (msg: Omit<MessageRecord, "id" | "sentAt">) => {
    const current = getInitialAthletaData();
    const newMsg: MessageRecord = {
      ...msg,
      id: `MSG-${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    await saveAllData({ messages: [newMsg, ...(current.messages || [])] });
    await logAudit("MESSAGE_SENT", `Dispatched ${msg.channel.toUpperCase()} to ${msg.recipientCount} recipients (${msg.subject})`, "Communications");
    return newMsg;
  };

  const createEvent = async (event: Partial<EventTournamentRecord>) => {
    const current = getInitialAthletaData();
    const newEvt: EventTournamentRecord = {
      id: `EVT-${Date.now()}`,
      title: event.title || "New Championship Event",
      type: event.type || "Tournament",
      date: event.date || "2026-12-01",
      time: event.time || "09:00 - 15:00",
      venue: event.venue || "Main Dojo Durban",
      feeZAR: event.feeZAR || 350,
      capacity: event.capacity || 40,
      registeredStudentIds: event.registeredStudentIds || [],
      status: "upcoming",
      categories: event.categories || ["General"]
    };
    await saveAllData({ events: [...(current.events || []), newEvt] });
    await logAudit("EVENT_CREATED", `Organized event ${newEvt.title}`, "Events");
    return newEvt;
  };

  const registerForEvent = async (eventId: string, studentId: string) => {
    const current = getInitialAthletaData();
    const updatedEvents = (current.events || []).map(ev => {
      if (ev.id === eventId) {
        const set = new Set(ev.registeredStudentIds || []);
        set.add(studentId);
        return { ...ev, registeredStudentIds: Array.from(set) };
      }
      return ev;
    });
    await saveAllData({ events: updatedEvents });
    await logAudit("EVENT_REGISTRATION", `Registered student ${studentId} for event ${eventId}`, "Events");
  };

  const approveOnlineRegistration = async (regId: string) => {
    const current = getInitialAthletaData();
    const reg = (current.registrations || []).find(r => r.id === regId);
    if (!reg) return;

    // Convert to student
    const names = reg.studentName.split(" ");
    const firstName = names[0] || "New";
    const lastName = names.slice(1).join(" ") || "Student";
    await addStudent({
      firstName,
      lastName,
      dob: reg.dob,
      trainingProgram: reg.program,
      medicalInfo: {
        conditions: reg.medicalNotes || "None",
        allergies: "None",
        injuries: "None",
        signedWaiver: true
      }
    });

    const updatedRegs = (current.registrations || []).map(r => (r.id === regId ? { ...r, status: "approved" as const } : r));
    await saveAllData({ registrations: updatedRegs });
    await logAudit("REGISTRATION_APPROVED", `Approved online registration for ${reg.studentName}`, "Registration");
  };

  const rejectOnlineRegistration = async (regId: string) => {
    const current = getInitialAthletaData();
    const updatedRegs = (current.registrations || []).map(r => (r.id === regId ? { ...r, status: "rejected" as const } : r));
    await saveAllData({ registrations: updatedRegs });
    await logAudit("REGISTRATION_REJECTED", `Rejected online registration ${regId}`, "Registration");
  };

  const resetToFactoryDefaults = async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ATHLETA_OFFICE_DATA));
    window.dispatchEvent(new Event("lionmode_athleta_updated"));
    setData(INITIAL_ATHLETA_OFFICE_DATA);
    try {
      await setDoc(doc(db, FIRESTORE_DOC_PATH), INITIAL_ATHLETA_OFFICE_DATA);
    } catch (e) {
      console.warn("Could not reset Firestore", e);
    }
  };

  return {
    data,
    saveAllData,
    logAudit,
    addStudent,
    updateStudent,
    deleteStudent,
    uploadStudentPhoto,
    addFamily,
    updateFamily,
    addClass,
    updateClass,
    deleteClass,
    recordAttendance,
    promoteStudentBelt,
    createInvoice,
    markInvoicePaid,
    addExpense,
    deleteExpense,
    sendMessage,
    createEvent,
    registerForEvent,
    approveOnlineRegistration,
    rejectOnlineRegistration,
    resetToFactoryDefaults
  };
}
