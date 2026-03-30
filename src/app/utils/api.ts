import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  get,
  push,
  set,
  update,
  remove,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function toArray(snapshotValue: any) {
  if (!snapshotValue) return [];
  return Object.entries(snapshotValue).map(([id, value]: any) => ({ id, ...value }));
}

function sortByCreatedAtDesc<T extends { created_at?: number | string }>(list: T[]) {
  return [...list].sort((a, b) => {
    const va = typeof a.created_at === 'number' ? a.created_at : Date.parse(String(a.created_at || 0));
    const vb = typeof b.created_at === 'number' ? b.created_at : Date.parse(String(b.created_at || 0));
    return vb - va;
  });
}

export const isBackendConfigured = () => true;

export const authAPI = {
  async signup(email: string, password: string, name: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    return {
      user: {
        uid: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName || name,
      },
      token: await cred.user.getIdToken(),
    };
  },

  async signin(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: {
        uid: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName || '',
      },
      token: await cred.user.getIdToken(),
    };
  },

  async getSession() {
    const user = auth.currentUser;
    if (user) {
      return {
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
        },
        token: await user.getIdToken(),
      };
    }

    return new Promise<any>((resolve) => {
      const unsub = onAuthStateChanged(auth, async (u) => {
        unsub();
        if (!u) return resolve(null);
        resolve({
          user: {
            uid: u.uid,
            email: u.email,
            name: u.displayName || '',
          },
          token: await u.getIdToken(),
        });
      });
    });
  },

  async signOut() {
    await signOut(auth);
  },
};

export const storageAPI = {
  async uploadFile(file: File, path: string) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        // Get base64 string
        const base64String = reader.result as string;
        resolve(base64String);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Read file as data URL (base64)
      reader.readAsDataURL(file);
    });
  },
};

export const portfolioAPI = {
  async getAll() {
    const snap = await get(ref(db, 'portfolio'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },
  async add(item: any) {
    const node = push(ref(db, 'portfolio'));
    const payload = {
      ...item,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },
  async update(id: string, updates: any) {
    await update(ref(db, `portfolio/${id}`), updates);
    return { id, ...updates };
  },
  async delete(id: string) {
    await remove(ref(db, `portfolio/${id}`));
    return null;
  },
};

export const reelsAPI = {
  async getAll() {
    const snap = await get(ref(db, 'reels'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },
  async add(item: any) {
    const node = push(ref(db, 'reels'));
    const payload = {
      ...item,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },
  async update(id: string, updates: any) {
    await update(ref(db, `reels/${id}`), updates);
    return { id, ...updates };
  },
  async delete(id: string) {
    await remove(ref(db, `reels/${id}`));
    return null;
  },
};

export const testimonialsAPI = {
  async getAll() {
    const snap = await get(ref(db, 'testimonials'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },
  async add(item: any) {
    const node = push(ref(db, 'testimonials'));
    const payload = {
      ...item,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },
  async update(id: string, updates: any) {
    await update(ref(db, `testimonials/${id}`), updates);
    return { id, ...updates };
  },
  async delete(id: string) {
    await remove(ref(db, `testimonials/${id}`));
    return null;
  },
};

export const contactAPI = {
  async submit(formData: any) {
    const node = push(ref(db, 'contacts'));
    const payload = {
      ...formData,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },
  async getAll() {
    const snap = await get(ref(db, 'contacts'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },
};
