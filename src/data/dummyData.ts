// Lion Mode Karate Academy (https://lionmodekarate.com)
// Comprehensive Production Seed & Dummy Data for Dojo OS

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category: string;
  images: string[];
  image?: string;
  sizes?: string[];
  stock: number;
  rating: number;
  badge?: string;
  is_active: boolean;
  created_date?: string;
}

export const DUMMY_PRODUCTS: ProductItem[] = [
  {
    id: "gi-tournament-pro",
    name: "Lion Mode Heavyweight Tournament Gi",
    price: 1299,
    compare_at_price: 1550,
    category: "Uniforms",
    images: [
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    description: "Official 14oz brushed Japanese cotton canvas Gi featuring the Lion Mode crest embroidery. Stiff snap on punches, reinforced lapel, and WKF compliant cut.",
    sizes: ["Size 3 (160cm)", "Size 4 (170cm)", "Size 5 (180cm)", "Size 6 (190cm)"],
    stock: 24,
    rating: 4.9,
    badge: "Official Team Gear",
    is_active: true,
    created_date: "2026-01-10T08:00:00Z"
  },
  {
    id: "gi-student-club",
    name: "Lion Mode Club Student Gi",
    price: 799,
    compare_at_price: 899,
    category: "Uniforms",
    images: [
      "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80",
    description: "Lightweight 8oz poly-cotton student Gi designed for daily training and beginners. Highly breathable, pre-shrunk, with elastic drawstring trousers.",
    sizes: ["Kids 00 (110cm)", "Kids 0 (120cm)", "Kids 1 (130cm)", "Kids 2 (140cm)", "Adult 3 (160cm)", "Adult 4 (170cm)"],
    stock: 45,
    rating: 4.8,
    badge: "Best Seller",
    is_active: true,
    created_date: "2026-01-12T08:00:00Z"
  },
  {
    id: "kumite-gloves-wkf",
    name: "Lion Mode WKF Approved Kumite Gloves",
    price: 480,
    compare_at_price: 550,
    category: "Equipment",
    images: [
      "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80",
    description: "High-density polyurethane impact foam mitts for tournament and dojo kumite. Wide hook-and-loop wrist closure prevents slipping during high-speed exchanges.",
    sizes: ["Small (Red)", "Small (Blue)", "Medium (Red)", "Medium (Blue)", "Large (Red)", "Large (Blue)"],
    stock: 38,
    rating: 4.7,
    badge: "Tournament Ready",
    is_active: true,
    created_date: "2026-01-15T08:00:00Z"
  },
  {
    id: "shin-instep-guards",
    name: "Lion Mode Shin & Instep Guards",
    price: 550,
    category: "Equipment",
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80",
    description: "Ergonomic pre-curved foam shin protectors with detachable instep foot guard. Anti-slip inner lining absorbs high impact roundhouse kicks.",
    sizes: ["Small", "Medium", "Large"],
    stock: 19,
    rating: 4.6,
    is_active: true,
    created_date: "2026-01-18T08:00:00Z"
  },
  {
    id: "satin-black-belt",
    name: "Lion Mode Satin Master Black Belt",
    price: 380,
    compare_at_price: 450,
    category: "Belts",
    images: [
      "https://images.unsplash.com/photo-1543326168-5f2ca03db82d?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1543326168-5f2ca03db82d?w=800&q=80",
    description: "100% thick woven cotton inner core with lustrous Japanese satin finish. Features 12 rows of longitudinal heavy stitching and gold Lion Mode end tag.",
    sizes: ["280cm (Size 4)", "300cm (Size 5)", "320cm (Size 6)"],
    stock: 15,
    rating: 5.0,
    badge: "Master Grade",
    is_active: true,
    created_date: "2026-01-20T08:00:00Z"
  },
  {
    id: "belt-progression-set",
    name: "Lion Mode Kyu Belt Progression Set",
    price: 220,
    category: "Belts",
    images: [
      "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80",
    description: "Full colored belt progression (Yellow, Orange, Green, Blue, Purple, Brown) with non-fade dyed cotton. Ideal for rising students climbing the ranks.",
    sizes: ["240cm (Junior)", "280cm (Senior)"],
    stock: 50,
    rating: 4.8,
    is_active: true,
    created_date: "2026-01-22T08:00:00Z"
  },
  {
    id: "dojo-duffel-tactical",
    name: "Lion Mode Tactical Duffel Bag (55L)",
    price: 690,
    compare_at_price: 850,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    description: "Heavy-duty 600D water-resistant ripstop duffel bag. Features dedicated ventilated Gi & footwear compartment, hydration bottle sleeves, and gold accents.",
    stock: 32,
    rating: 4.9,
    badge: "Staff Pick",
    is_active: true,
    created_date: "2026-01-25T08:00:00Z"
  },
  {
    id: "curved-focus-mitts",
    name: "Lion Mode Curved Focus Mitts (Pair)",
    price: 520,
    category: "Equipment",
    images: [
      "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80",
    description: "Hand-stitched synthetic leather focus pads engineered for speed combinations, gyaku-zuki precision, and counter striking drills. Contoured palm dome.",
    stock: 22,
    rating: 4.7,
    is_active: true,
    created_date: "2026-01-28T08:00:00Z"
  },
  {
    id: "rashguard-gold-edition",
    name: "Lion Mode Performance Rashguard (Gold Edition)",
    price: 450,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    description: "Thermal regulating compression long-sleeve rashguard with sublimated gold lion crest that never peels or cracks. Flatlock anti-chafing seams.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 40,
    rating: 4.8,
    badge: "Popular",
    is_active: true,
    created_date: "2026-02-01T08:00:00Z"
  },
  {
    id: "pro-mouthguard",
    name: "Pro Dual-Layer Boil & Bite Mouthguard",
    price: 150,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1c2a9c3a5e2d?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1c2a9c3a5e2d?w=800&q=80",
    description: "Medical-grade food-safe silicone with internal shock dampening gel frame. Includes ventilated anti-bacterial hygiene storage container.",
    stock: 65,
    rating: 4.5,
    is_active: true,
    created_date: "2026-02-05T08:00:00Z"
  },
  {
    id: "kick-shield-heavy",
    name: "Lion Mode Heavy Duty Kicking Shield",
    price: 680,
    compare_at_price: 790,
    category: "Equipment",
    images: [
      "https://images.unsplash.com/photo-1552072805-2a9039d00e57?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?w=800&q=80",
    description: "Oversized target strike shield with multi-layered compressed foam core for absorbing heavy roundhouse kicks, side kicks, and knee thrusts.",
    stock: 14,
    rating: 4.9,
    is_active: true,
    created_date: "2026-02-08T08:00:00Z"
  },
  {
    id: "hoodie-lion-gold",
    name: "Lion Mode Obsidian & Gold Fleece Hoodie",
    price: 580,
    category: "Apparel",
    images: [
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80"
    ],
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    description: "Premium 360gsm heavyweight organic cotton fleece hoodie with metallic gold Lion Mode chest insignia and double lined warm hood.",
    sizes: ["S", "M", "L", "XL"],
    stock: 28,
    rating: 4.9,
    badge: "Limited Drop",
    is_active: true,
    created_date: "2026-02-12T08:00:00Z"
  }
];

export const DUMMY_STUDENTS = [
  {
    id: "std-1",
    student_id_code: "LMK-2024-001",
    first_name: "Liam",
    last_name: "Naidoo",
    belt_rank: "brown",
    rank_level: "3rd Kyu",
    current_streak: 28,
    attendance_rate: 96,
    status: "active",
    program: "junior_fighters",
    email: "liam.naidoo@gmail.com",
    phone: "+27 82 345 6789",
    parent_name: "Priya Naidoo",
    parent_phone: "+27 82 345 6780",
    passport_id: "ZA-2013-0514-N",
    emergency_contact: "Priya Naidoo (+27 82 345 6780)",
    date_of_birth: "2013-05-14",
    join_date: "2024-02-15",
    total_classes: 142,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    notes: "Demonstrates exceptional mastery in Bassai Dai. Preparing for junior brown belt second bar."
  },
  {
    id: "std-2",
    student_id_code: "LMK-2024-002",
    first_name: "Sipho",
    last_name: "Dlamini",
    belt_rank: "green",
    rank_level: "5th Kyu",
    current_streak: 19,
    attendance_rate: 92,
    status: "active",
    program: "teen_warriors",
    email: "sipho.d@outlook.co.za",
    phone: "+27 83 234 5678",
    parent_name: "Mandla Dlamini",
    parent_phone: "+27 83 234 5670",
    passport_id: "ZA-2009-0822-D",
    emergency_contact: "Mandla Dlamini (+27 83 234 5670)",
    date_of_birth: "2009-08-22",
    join_date: "2024-04-10",
    total_classes: 98,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    notes: "Strong counter-punching in kumite sparring. Dedicated and punctual."
  },
  {
    id: "std-3",
    student_id_code: "LMK-2024-003",
    first_name: "Chloe",
    last_name: "van der Merwe",
    belt_rank: "blue",
    rank_level: "4th Kyu",
    current_streak: 14,
    attendance_rate: 88,
    status: "active",
    program: "teen_warriors",
    email: "chloe.vdm@gmail.com",
    phone: "+27 71 890 1234",
    parent_name: "Annelize van der Merwe",
    parent_phone: "+27 71 890 1230",
    passport_id: "ZA-2010-1103-V",
    emergency_contact: "Annelize vdm (+27 71 890 1230)",
    date_of_birth: "2010-11-03",
    join_date: "2024-05-01",
    total_classes: 76,
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    notes: "Clean chambering on roundhouse kick (mawashi geri). Ready for purple belt testing."
  },
  {
    id: "std-4",
    student_id_code: "LMK-2023-004",
    first_name: "Ethan",
    last_name: "Govender",
    belt_rank: "black_1",
    rank_level: "1st Dan",
    current_streak: 42,
    attendance_rate: 98,
    status: "active",
    program: "competition_team",
    email: "ethan.g@gmail.com",
    phone: "+27 84 567 8901",
    parent_name: "Ravi Govender",
    parent_phone: "+27 84 567 8900",
    passport_id: "ZA-2006-0319-G",
    emergency_contact: "Ravi Govender (+27 84 567 8900)",
    date_of_birth: "2006-03-19",
    join_date: "2023-01-10",
    total_classes: 285,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    notes: "KZN Provincial Kumite finalist. Assists Sensei Babu in coaching junior squad."
  },
  {
    id: "std-5",
    student_id_code: "LMK-2024-005",
    first_name: "Aaliyah",
    last_name: "Patel",
    belt_rank: "yellow",
    rank_level: "7th Kyu",
    current_streak: 11,
    attendance_rate: 90,
    status: "active",
    program: "little_warriors",
    email: "patel.family@gmail.com",
    phone: "+27 72 456 7890",
    parent_name: "Farhana Patel",
    parent_phone: "+27 72 456 7899",
    passport_id: "ZA-2018-0912-P",
    emergency_contact: "Farhana Patel (+27 72 456 7899)",
    date_of_birth: "2018-09-12",
    join_date: "2024-07-12",
    total_classes: 34,
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    notes: "Enthusiastic and respectful in Lionmode Kids. Great spirit and loud kiai."
  },
  {
    id: "std-6",
    student_id_code: "LMK-2024-006",
    first_name: "Joshua",
    last_name: "Khumalo",
    belt_rank: "orange",
    rank_level: "6th Kyu",
    current_streak: 8,
    attendance_rate: 85,
    status: "active",
    program: "junior_fighters",
    email: "joshua.k@gmail.com",
    phone: "+27 79 123 4567",
    parent_name: "Sindi Khumalo",
    parent_phone: "+27 79 123 4560",
    passport_id: "ZA-2014-0130-K",
    emergency_contact: "Sindi Khumalo (+27 79 123 4560)",
    date_of_birth: "2014-01-30",
    join_date: "2024-06-20",
    total_classes: 48,
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
    notes: "Improving hip torque on reverse punch. Very focused during meditation."
  },
  {
    id: "std-7",
    student_id_code: "LMK-2024-007",
    first_name: "Maya",
    last_name: "Moodley",
    belt_rank: "white",
    rank_level: "8th Kyu",
    current_streak: 16,
    attendance_rate: 94,
    status: "active",
    program: "little_warriors",
    email: "maya.m@gmail.com",
    phone: "+27 81 234 9876",
    parent_name: "Devan Moodley",
    parent_phone: "+27 81 234 9870",
    passport_id: "ZA-2017-0618-M",
    emergency_contact: "Devan Moodley (+27 81 234 9870)",
    date_of_birth: "2017-06-18",
    join_date: "2024-08-01",
    total_classes: 22,
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
    notes: "Mastered fundamental stances: Zenkutsu-dachi and Kiba-dachi."
  },
  {
    id: "std-8",
    first_name: "David",
    last_name: "Pillay",
    belt_rank: "brown",
    rank_level: "1st Kyu",
    current_streak: 22,
    attendance_rate: 91,
    status: "active",
    program: "adult_martial_arts",
    email: "david.pillay@yahoo.com",
    phone: "+27 82 789 0123",
    emergency_contact: "Nisha Pillay (+27 82 789 0120)",
    date_of_birth: "1994-12-05",
    join_date: "2023-09-15",
    total_classes: 195,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    notes: "Candidate for upcoming Shodan (1st Dan Black Belt) examination. High endurance."
  }
];

export const DUMMY_CLASSES = [
  {
    id: "class-1",
    name: "Lionmode Kids (Ages 3–8)",
    description: "Play-based martial arts learning to increase attention span, build balance, hand-eye coordination, and foster deep respect.",
    program: "little_warriors",
    instructor: "Sensei Babu & Coach Sarah",
    startTime: "16:00",
    endTime: "16:45",
    days: ["monday", "wednesday"],
    capacity: 20,
    enrolled: 16,
    category: "KARATE",
    location: "Lion Mode Main Mat A",
    recurring: true
  },
  {
    id: "class-2",
    name: "Little Lions (Ages 8–12)",
    description: "Focus, self-control, and confidence through action-packed classes. Fundamental kata forms, block/strike coordination, and discipline.",
    program: "junior_fighters",
    instructor: "Sensei Babu",
    startTime: "16:30",
    endTime: "17:30",
    days: ["tuesday", "thursday"],
    capacity: 25,
    enrolled: 22,
    category: "KARATE",
    location: "Lion Mode Main Mat A",
    recurring: true
  },
  {
    id: "class-3",
    name: "Lionmode Teens & Cadets (Ages 13–18)",
    description: "Martial arts foundation, mental toughness, goal-setting, self-defense, conflict resolution, strength conditioning, and kumite sparring.",
    program: "teen_warriors",
    instructor: "Sensei Babu",
    startTime: "17:30",
    endTime: "18:45",
    days: ["monday", "wednesday", "friday"],
    capacity: 22,
    enrolled: 19,
    category: "SPARRING",
    location: "Lion Mode Combat Mat B",
    recurring: true
  },
  {
    id: "class-4",
    name: "Adult Traditional Karate & Self-Defense",
    description: "Full Shotokan and sports karate curriculum, practical street self-defense, physical flexibility, joint conditioning, and breath control.",
    program: "adult_martial_arts",
    instructor: "Sensei Babu",
    startTime: "18:30",
    endTime: "20:00",
    days: ["tuesday", "thursday"],
    capacity: 25,
    enrolled: 20,
    category: "TRADITIONAL",
    location: "Lion Mode Main Mat A",
    recurring: true
  },
  {
    id: "class-5",
    name: "Black Belt Elite & Tournament Squad",
    description: "Advanced bunkai applications, competitive WKF sparring tactics, rapid scoring footwork, and national championship preparation.",
    program: "competition_team",
    instructor: "Sensei Babu",
    startTime: "10:00",
    endTime: "12:00",
    days: ["saturday"],
    capacity: 15,
    enrolled: 12,
    category: "ELITE",
    location: "Lion Mode Combat Mat B",
    recurring: true
  },
  {
    id: "class-6",
    name: "Weekend Warrior All-Levels Open Mat",
    description: "Supervised open training, partner drill practice, belt testing syllabus review, and conditioning circuits for all academy members.",
    program: "adult_martial_arts",
    instructor: "Coach Sarah",
    startTime: "08:30",
    endTime: "10:00",
    days: ["saturday"],
    capacity: 30,
    enrolled: 24,
    category: "CONDITIONING",
    location: "Lion Mode Main Mat A",
    recurring: true
  }
];

export const DUMMY_VIDEOS = [
  {
    id: "vid-1",
    title: "Heian Shodan & Nidan: Comprehensive Kata Breakdown & Bunkai",
    description: "Step-by-step masterclass on foundational Shotokan kata with practical combat bunkai applications against real attacks.",
    category: "kata",
    duration_minutes: 18,
    views: 2840,
    is_premium: true,
    thumbnail_url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Sensei Babu",
    belt_level: "White to Green Belt"
  },
  {
    id: "vid-2",
    title: "Kumite Distance Management & Counter-Punching (Gyaku-Zuki)",
    description: "Learn how to bait your opponent, evade incoming lunges, and counter instantaneously with precise reverse punches.",
    category: "sparring",
    duration_minutes: 14,
    views: 4120,
    is_premium: false,
    thumbnail_url: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Sensei Babu",
    belt_level: "All Belts"
  },
  {
    id: "vid-3",
    title: "Front Kick (Mae Geri) & Roundhouse (Mawashi Geri) Biomechanics",
    description: "Proper chambering, hip thrust mechanics, ankle protection, and speed recovery to avoid getting swept or caught.",
    category: "fundamentals",
    duration_minutes: 12,
    views: 1980,
    is_premium: false,
    thumbnail_url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Coach Sarah",
    belt_level: "Beginner to Intermediate"
  },
  {
    id: "vid-4",
    title: "Lion Mode Syllabus: White to Yellow Belt Examination Protocol",
    description: "Complete testing requirements: 5 basic strikes, 4 blocks, 3 stances, Heian Shodan, and basic Yakusoku kumite.",
    category: "grading_prep",
    duration_minutes: 22,
    views: 3450,
    is_premium: true,
    thumbnail_url: "https://images.unsplash.com/photo-1543326168-5f2ca03db82d?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Sensei Babu",
    belt_level: "White & Yellow Belts"
  },
  {
    id: "vid-5",
    title: "Practical Self-Defense: Wrist Escapes, Chokes & Spatial Guard",
    description: "Real-world awareness, de-escalation posture, breakaways, and explosive counter-attacks for teens and adult karate students.",
    category: "self_defense",
    duration_minutes: 16,
    views: 5600,
    is_premium: false,
    thumbnail_url: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Sensei Babu",
    belt_level: "All Belts"
  },
  {
    id: "vid-6",
    title: "Dojo Core Stability, Hip Mobility & Plyometric Power",
    description: "20-minute conditioning circuit designed to maximize striking velocity, kick height, and stamina on the tatami.",
    category: "fitness",
    duration_minutes: 20,
    views: 1420,
    is_premium: false,
    thumbnail_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Coach Sarah",
    belt_level: "All Belts"
  },
  {
    id: "vid-7",
    title: "Bassai Dai Masterclass: Storming the Fortress Kata Analysis",
    description: "In-depth analysis of power shifts, open hand strikes, joint releases, and stance stability in Bassai Dai.",
    category: "kata",
    duration_minutes: 25,
    views: 3900,
    is_premium: true,
    thumbnail_url: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Sensei Babu",
    belt_level: "Brown & Black Belts"
  },
  {
    id: "vid-8",
    title: "Tournament Scoring: Speed Blitz & Kizami-Zuki Execution",
    description: "Angles of attack, deceptive feints, and explosive lead hand jabs to secure Ippon and Waza-ari in competition.",
    category: "competition",
    duration_minutes: 15,
    views: 2750,
    is_premium: true,
    thumbnail_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=80",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    instructor: "Sensei Babu",
    belt_level: "Intermediate to Advanced"
  }
];

export const DUMMY_EVENTS = [
  {
    id: "evt-1",
    title: "Lion Mode Winter Belt Grading Examination",
    description: "Official rank evaluation for Little Lions, Teens, and Adults. Candidates must have verified 90%+ attendance and instructor sign-off.",
    date: "July 25, 2026",
    time: "09:00 AM – 01:00 PM",
    location: "Lion Mode Main Dojo Hall, Durban",
    event_type: "belt_grading",
    category: "Grading",
    price: 250,
    capacity: 50,
    registered_count: 38,
    status: "upcoming",
    image_url: "https://images.unsplash.com/photo-1543326168-5f2ca03db82d?w=800&q=80"
  },
  {
    id: "evt-2",
    title: "KZN Inter-Dojo Kumite Championship 2026",
    description: "Provincial sports karate championship across age groups: U10, U14, Cadets, Juniors, and Seniors. Medals and trophies awarded.",
    date: "August 15, 2026",
    time: "08:30 AM – 04:30 PM",
    location: "Westville Sports Arena, Durban",
    event_type: "tournament",
    category: "Competition",
    price: 350,
    capacity: 120,
    registered_count: 85,
    status: "upcoming",
    image_url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80"
  },
  {
    id: "evt-3",
    title: "Masterclass with Sensei Babu: Kata Bunkai & Striking Power",
    description: "Intensive 3.5 hour seminar exploring practical street applications of classical kata movements, joint locks, and rapid recovery.",
    date: "September 05, 2026",
    time: "10:00 AM – 01:30 PM",
    location: "Lion Mode Main Dojo, Durban",
    event_type: "seminar",
    category: "Seminar",
    price: 200,
    capacity: 35,
    registered_count: 26,
    status: "upcoming",
    image_url: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?w=800&q=80"
  },
  {
    id: "evt-4",
    title: "Parent & Child Karate Workshop & Self-Defense Day",
    description: "Engaging family training session where parents step onto the tatami with their children for fun coordination and awareness games.",
    date: "September 26, 2026",
    time: "11:00 AM – 01:00 PM",
    location: "Lion Mode Main Dojo, Durban",
    event_type: "workshop",
    category: "Community",
    price: 0,
    capacity: 40,
    registered_count: 32,
    status: "upcoming",
    image_url: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80"
  }
];

export const DUMMY_INVOICES = [
  {
    id: "inv-101",
    invoice_number: "INV-2026-001",
    student_name: "Liam Naidoo",
    description: "Monthly Tuition - Lion Mode Junior Warriors (July 2026)",
    amount: 850,
    status: "paid",
    date: "2026-07-01",
    due_date: "2026-07-05",
    payment_method: "EFT / PayFast"
  },
  {
    id: "inv-102",
    invoice_number: "INV-2026-002",
    student_name: "Sipho Dlamini",
    description: "Monthly Tuition - Lion Mode Teen Cadets (July 2026)",
    amount: 850,
    status: "paid",
    date: "2026-07-01",
    due_date: "2026-07-05",
    payment_method: "Credit Card (Yoco)"
  },
  {
    id: "inv-103",
    invoice_number: "INV-2026-003",
    student_name: "Ethan Govender",
    description: "Lion Mode Tournament Heavyweight Gi + Embroidery",
    amount: 1299,
    status: "paid",
    date: "2026-07-03",
    due_date: "2026-07-03",
    payment_method: "Credit Card (Yoco)"
  },
  {
    id: "inv-104",
    invoice_number: "INV-2026-004",
    student_name: "Chloe van der Merwe",
    description: "Monthly Tuition - Lion Mode Teen Cadets (July 2026)",
    amount: 850,
    status: "pending",
    date: "2026-07-01",
    due_date: "2026-07-15",
    payment_method: "Pending EFT"
  },
  {
    id: "inv-105",
    invoice_number: "INV-2026-005",
    student_name: "Aaliyah Patel",
    description: "Winter Belt Grading Examination Registration",
    amount: 250,
    status: "paid",
    date: "2026-07-04",
    due_date: "2026-07-10",
    payment_method: "Cash Dojo Reception"
  },
  {
    id: "inv-106",
    invoice_number: "INV-2026-006",
    student_name: "Joshua Khumalo",
    description: "Lion Mode WKF Approved Kumite Gloves (Red)",
    amount: 480,
    status: "pending",
    date: "2026-07-04",
    due_date: "2026-07-12",
    payment_method: "Pending Card"
  },
  {
    id: "inv-107",
    invoice_number: "INV-2026-007",
    student_name: "David Pillay",
    description: "Adult Unlimited Monthly Karate & Conditioning",
    amount: 950,
    status: "paid",
    date: "2026-07-02",
    due_date: "2026-07-05",
    payment_method: "Debit Order"
  },
  {
    id: "inv-108",
    invoice_number: "INV-2026-008",
    student_name: "Sarah Jenkins",
    description: "KZN Championship Tournament Registration",
    amount: 350,
    status: "overdue",
    date: "2026-06-25",
    due_date: "2026-07-02",
    payment_method: "Awaiting Payment"
  }
];

export const DUMMY_LEADS = [
  {
    id: "lead-1",
    name: "Sarah Jenkins",
    phone: "+27 82 111 2233",
    email: "sjenkins@gmail.com",
    program_interest: "Lionmode Kids (Ages 3–8)",
    child_name: "Oliver (Age 6)",
    stage: "new",
    source: "lionmodekarate.com Website",
    notes: "Wants to improve Oliver's focus, attention span, and coordination before primary school.",
    createdAt: "2026-07-05T09:30:00Z"
  },
  {
    id: "lead-2",
    name: "Thabo Cele",
    phone: "+27 73 444 5566",
    email: "thabo.cele@workmail.co.za",
    program_interest: "Adult Traditional Karate & Self-Defense",
    stage: "contacted",
    source: "Instagram / Website",
    notes: "Former rugby player looking for high discipline martial arts and self-defense.",
    createdAt: "2026-07-04T14:15:00Z"
  },
  {
    id: "lead-3",
    name: "Priya Naicker",
    phone: "+27 84 777 8899",
    email: "priya.n@gmail.com",
    program_interest: "Little Lions (Ages 8–12)",
    child_name: "Aiden (Age 10)",
    stage: "trial",
    trial_date: "2026-07-14 at 16:30",
    source: "Google Search (Karate Durban)",
    notes: "Free trial scheduled for Tuesday Little Lions class. Very excited to try.",
    createdAt: "2026-07-03T11:00:00Z"
  },
  {
    id: "lead-4",
    name: "Marcus Smith",
    phone: "+27 81 999 0011",
    email: "marcus.smith@school.co.za",
    program_interest: "Lionmode Teens (Ages 13–18)",
    stage: "enrolled",
    source: "Student Referral (Ethan Govender)",
    notes: "Attended trial class on Saturday and registered immediately! Enrolled for Teen Cadets.",
    createdAt: "2026-06-28T16:00:00Z"
  },
  {
    id: "lead-5",
    name: "Zanele Sithole",
    phone: "+27 79 333 4455",
    email: "zanele.s@gmail.com",
    program_interest: "Lionmode Kids (Ages 3–8)",
    child_name: "Lwazi & Lwandle (Age 4 Twins)",
    stage: "new",
    source: "lionmodekarate.com Website",
    notes: "Looking for Saturday morning classes for twins to learn discipline and balance.",
    createdAt: "2026-07-05T12:45:00Z"
  }
];

export const DUMMY_ORDERS = [
  {
    id: "ord-8421",
    order_ref: "ORD-8421",
    customer_name: "David Pillay",
    customer_email: "david.pillay@yahoo.com",
    items: [
      { product_name: "Lion Mode Heavyweight Tournament Gi", qty: 1, price: 1299, size: "Size 4 (170cm)" },
      { product_name: "Lion Mode WKF Approved Kumite Gloves", qty: 1, price: 480, size: "Medium (Red)" }
    ],
    total: 1779,
    total_amount: 1779,
    status: "shipped",
    payment_status: "paid",
    tracking_number: "LION-ZA-99120",
    date: "2026-07-02",
    created_date: "2026-07-02T10:30:00Z"
  },
  {
    id: "ord-8422",
    order_ref: "ORD-8422",
    customer_name: "Liam Naidoo",
    customer_email: "liam.naidoo@gmail.com",
    items: [
      { product_name: "Lion Mode Curved Focus Mitts (Pair)", qty: 1, price: 520 }
    ],
    total: 520,
    total_amount: 520,
    status: "completed",
    payment_status: "paid",
    date: "2026-07-03",
    created_date: "2026-07-03T14:15:00Z"
  },
  {
    id: "ord-8423",
    order_ref: "ORD-8423",
    customer_name: "Sipho Dlamini",
    customer_email: "sipho.d@outlook.co.za",
    items: [
      { product_name: "Lion Mode Shin & Instep Guards", qty: 1, price: 550, size: "Medium" }
    ],
    total: 550,
    total_amount: 550,
    status: "processing",
    payment_status: "paid",
    date: "2026-07-04",
    created_date: "2026-07-04T09:00:00Z"
  },
  {
    id: "ord-8424",
    order_ref: "ORD-8424",
    customer_name: "Chloe van der Merwe",
    customer_email: "chloe.vdm@gmail.com",
    items: [
      { product_name: "Lion Mode Performance Rashguard", qty: 1, price: 450, size: "S" }
    ],
    total: 450,
    total_amount: 450,
    status: "paid",
    payment_status: "paid",
    date: "2026-07-04",
    created_date: "2026-07-04T16:20:00Z"
  },
  {
    id: "ord-8425",
    order_ref: "ORD-8425",
    customer_name: "Aaliyah Patel",
    customer_email: "patel.family@gmail.com",
    items: [
      { product_name: "Lion Mode Club Student Gi", qty: 1, price: 799, size: "Kids 1 (130cm)" }
    ],
    total: 799,
    total_amount: 799,
    status: "pending",
    payment_status: "pending",
    date: "2026-07-05",
    created_date: "2026-07-05T11:45:00Z"
  }
];
