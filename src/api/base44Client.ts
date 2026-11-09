import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { 
  DUMMY_PRODUCTS, 
  DUMMY_STUDENTS, 
  DUMMY_CLASSES, 
  DUMMY_VIDEOS, 
  DUMMY_EVENTS, 
  DUMMY_INVOICES, 
  DUMMY_LEADS, 
  DUMMY_ORDERS 
} from '@/data/dummyData';
import { INITIAL_MEMBER_REGISTRATIONS } from '@/data/memberRegistrations';

const FALLBACK_REGISTRY: Record<string, any[]> = {
  Product: DUMMY_PRODUCTS,
  Student: DUMMY_STUDENTS,
  DojoClass: DUMMY_CLASSES,
  Video: DUMMY_VIDEOS,
  Event: DUMMY_EVENTS,
  Invoice: DUMMY_INVOICES,
  Lead: DUMMY_LEADS,
  Order: DUMMY_ORDERS,
  MemberRegistration: INITIAL_MEMBER_REGISTRATIONS,
};

// In-memory runtime cache for seamless local interactivity
const localStore: Record<string, any[]> = {};
Object.keys(FALLBACK_REGISTRY).forEach((key) => {
  localStore[key] = [...FALLBACK_REGISTRY[key]];
});

class EntityClient {
  constructor(public collectionName: string) {}

  private getLocalList(): any[] {
    if (!localStore[this.collectionName]) {
      localStore[this.collectionName] = FALLBACK_REGISTRY[this.collectionName] ? [...FALLBACK_REGISTRY[this.collectionName]] : [];
    }
    return localStore[this.collectionName];
  }

  async list(sort?: string, limitCount?: number): Promise<any[]> {
    let firestoreDocs: any[] = [];
    try {
      let q = query(collection(db, this.collectionName));
      if (sort) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        q = query(q, orderBy(field, isDesc ? 'desc' : 'asc'));
      }
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        firestoreDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      // Graceful fallback to local seed data
    }

    if (firestoreDocs.length > 0) {
      return firestoreDocs;
    }

    // Return rich local seed items
    let list = [...this.getLocalList()];
    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.substring(1) : sort;
      list.sort((a, b) => {
        const valA = a[field] ?? '';
        const valB = b[field] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return isDesc ? valB - valA : valA - valB;
        }
        return isDesc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
      });
    }
    if (limitCount) {
      list = list.slice(0, limitCount);
    }
    return list;
  }

  async get(id: string): Promise<any> {
    try {
      const d = await getDoc(doc(db, this.collectionName, id));
      if (d.exists()) return { id: d.id, ...d.data() };
    } catch (err) {
      // Fallback to local
    }
    const local = this.getLocalList().find(item => item.id === id);
    return local || null;
  }

  async create(data: any): Promise<any> {
    const id = data.id || `${this.collectionName.toLowerCase()}-${Date.now()}`;
    const d = { id, ...data, created_date: data.created_date || new Date().toISOString() };
    
    // Add to local store immediately
    this.getLocalList().unshift(d);

    try {
      const ref = await addDoc(collection(db, this.collectionName), d);
      return { ...d, id: ref.id };
    } catch (err) {
      return d;
    }
  }

  async update(id: string, data: any): Promise<any> {
    const list = this.getLocalList();
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
    }

    try {
      const ref = doc(db, this.collectionName, id);
      await updateDoc(ref, data);
    } catch (err) {
      // Silently fall back to in-memory updated
    }
    return { id, ...data };
  }

  async delete(id: string): Promise<boolean> {
    const list = this.getLocalList();
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (err) {
      // Local deleted
    }
    return true;
  }

  async filter(conditions: Record<string, any>, sort?: string, limitCount?: number): Promise<any[]> {
    let firestoreDocs: any[] = [];
    try {
      let q = query(collection(db, this.collectionName));
      for (const [key, value] of Object.entries(conditions)) {
        q = query(q, where(key, '==', value));
      }
      if (sort) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        q = query(q, orderBy(field, isDesc ? 'desc' : 'asc'));
      }
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        firestoreDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      // Ignore and fallback
    }

    if (firestoreDocs.length > 0) {
      return firestoreDocs;
    }

    // Local filter
    let list = this.getLocalList().filter(item => {
      for (const [key, value] of Object.entries(conditions)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.substring(1) : sort;
      list.sort((a, b) => {
        const valA = a[field] ?? '';
        const valB = b[field] ?? '';
        return isDesc ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
      });
    }

    if (limitCount) {
      list = list.slice(0, limitCount);
    }

    return list;
  }
}

export const base44 = {
  entities: {
    Student: new EntityClient('Student'),
    Lead: new EntityClient('Lead'),
    Product: new EntityClient('Product'),
    Order: new EntityClient('Order'),
    Attendance: new EntityClient('Attendance'),
    DojoClass: new EntityClient('DojoClass'),
    Event: new EntityClient('Event'),
    Video: new EntityClient('Video'),
    Invoice: new EntityClient('Invoice'),
    SiteImage: new EntityClient('SiteImage'),
    ReminderLog: new EntityClient('ReminderLog'),
    User: new EntityClient('User'),
    ChatSession: new EntityClient('chatSessions'),
    MemberRegistration: new EntityClient('MemberRegistration'),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }: { file: File }) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ file_url: reader.result as string });
          };
          reader.readAsDataURL(file);
        });
      },
      SendEmail: async (_args: any) => {
        return Promise.resolve({ ok: true });
      }
    }
  }
};
