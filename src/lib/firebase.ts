import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

let messagingInstance: any = null;

export const getMessagingInstance = async () => {
    if (typeof window === 'undefined') return null;
    if (messagingInstance) return messagingInstance;
    
    try {
        const supported = await isSupported();
        if (supported) {
            messagingInstance = getMessaging(app);
            return messagingInstance;
        }
    } catch (e) {
        console.warn("Messaging initialization skipped:", e);
    }
    return null;
};

// For backward compatibility but it might be null initially
export const messaging = null; 

// Removed problematic setPersistence
setPersistence(auth, browserSessionPersistence).catch(err => {
    console.warn("Auth Persistence Error:", err);
});
