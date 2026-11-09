import { getMessagingInstance, db, auth } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

class NotificationService {
  private static instance: NotificationService;
  private vapidKey: string = 'BGZ8c8Ew7r9z4pYQ1p6-zG9kF5_6Z6f4p8q_K5B-Z7m-M6F-qZ5p-zG9kF5_6Z6f4p8q_K5B-Z7m-M6F-qZ5p'; // Placeholder, ideally from config

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission() {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications.');
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        await this.registerPushToken();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private async registerPushToken() {
    try {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      const token = await getToken(messaging, {
        vapidKey: this.vapidKey
      });

      if (token && auth.currentUser) {
        // Store token in Firestore for targeted notifications
        await setDoc(doc(db, 'pushTokens', auth.currentUser.uid), {
          userId: auth.currentUser.uid,
          token: token,
          platform: 'web',
          updatedAt: serverTimestamp()
        });
        console.log('Push token registered successfully.');
      }
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  }

  public async listenForMessages() {
    const messaging = await getMessagingInstance();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      const { title, body } = payload.notification || {};
      
      if (title && body) {
        toast(title, {
          description: body,
          action: {
            label: 'View',
            onClick: () => console.log('Notification clicked')
          }
        });
      }
    });
  }

  // Local helper for "Push-like" behavior when FCM isn't fully set up (e.g. in dev)
  public showLocalNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: icon || '/logo.png'
      });
    }
  }
}

export const notificationService = NotificationService.getInstance();
