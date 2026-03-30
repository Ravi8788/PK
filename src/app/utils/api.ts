import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
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

const requiredFirebaseKeys = [
  'apiKey',
  'authDomain',
  'databaseURL',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
] as const;

function isPlaceholderValue(value: string | undefined) {
  if (!value) return true;
  return (
    value.includes('your_') ||
    value.includes('your-project') ||
    value.includes('example') ||
    value === '1234567890' ||
    value === '1:1234567890:web:abcdef123456'
  );
}

const missingFirebaseKeys = requiredFirebaseKeys.filter((key) =>
  isPlaceholderValue(firebaseConfig[key]),
);

const firebaseReady = missingFirebaseKeys.length === 0;

if (!firebaseReady) {
  console.warn(
    `Firebase configuration is incomplete. Missing or placeholder env vars: ${missingFirebaseKeys.join(', ')}`,
  );
}

const app = firebaseReady ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getDatabase(app) : null;

function ensureFirebaseReady() {
  if (!firebaseReady || !auth || !db) {
    throw new Error(
      `Firebase is not configured. Add valid VITE_FIREBASE_* environment variables. Missing: ${missingFirebaseKeys.join(', ')}`,
    );
  }

  return { auth, db };
}

function toArray<T extends object>(snapshotValue: unknown): Array<T & { id: string }> {
  if (!snapshotValue || typeof snapshotValue !== 'object') {
    return [];
  }

  return Object.entries(snapshotValue as Record<string, T>).map(([id, value]) => ({
    id,
    ...value,
  }));
}

function sortByCreatedAtDesc<T extends { created_at?: number | string }>(list: T[]) {
  return [...list].sort((a, b) => {
    const va =
      typeof a.created_at === 'number'
        ? a.created_at
        : Date.parse(String(a.created_at ?? 0));
    const vb =
      typeof b.created_at === 'number'
        ? b.created_at
        : Date.parse(String(b.created_at ?? 0));
    return vb - va;
  });
}

export const isBackendConfigured = () => firebaseReady;

export const authAPI = {
  async signup(email: string, password: string, name: string) {
    const { auth } = ensureFirebaseReady();
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
    const { auth } = ensureFirebaseReady();
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
    if (!firebaseReady || !auth) {
      return null;
    }

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
      const unsub = onAuthStateChanged(auth, async (currentUser) => {
        unsub();
        if (!currentUser) {
          resolve(null);
          return;
        }

        resolve({
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || '',
          },
          token: await currentUser.getIdToken(),
        });
      });
    });
  },

  async signOut() {
    const { auth } = ensureFirebaseReady();
    await signOut(auth);
  },
};

export const storageAPI = {
  async uploadFile(file: File, _path: string) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  },
};

export const portfolioAPI = {
  async getAll() {
    if (!firebaseReady || !db) {
      return [];
    }

    const snap = await get(ref(db, 'portfolio'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },

  async add(item: any) {
    const { db } = ensureFirebaseReady();
    const node = push(ref(db, 'portfolio'));
    const payload = {
      ...item,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },

  async update(id: string, updates: any) {
    const { db } = ensureFirebaseReady();
    await update(ref(db, `portfolio/${id}`), updates);
    return { id, ...updates };
  },

  async delete(id: string) {
    const { db } = ensureFirebaseReady();
    await remove(ref(db, `portfolio/${id}`));
    return null;
  },
};

export const reelsAPI = {
  async getAll() {
    if (!firebaseReady || !db) {
      return [];
    }

    const snap = await get(ref(db, 'reels'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },

  async add(item: any) {
    const { db } = ensureFirebaseReady();
    const node = push(ref(db, 'reels'));
    const payload = {
      ...item,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },

  async update(id: string, updates: any) {
    const { db } = ensureFirebaseReady();
    await update(ref(db, `reels/${id}`), updates);
    return { id, ...updates };
  },

  async delete(id: string) {
    const { db } = ensureFirebaseReady();
    await remove(ref(db, `reels/${id}`));
    return null;
  },
};

export const testimonialsAPI = {
  async getAll() {
    if (!firebaseReady || !db) {
      return [];
    }

    const snap = await get(ref(db, 'testimonials'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },

  async add(item: any) {
    const { db } = ensureFirebaseReady();
    const node = push(ref(db, 'testimonials'));
    const payload = {
      ...item,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },

  async update(id: string, updates: any) {
    const { db } = ensureFirebaseReady();
    await update(ref(db, `testimonials/${id}`), updates);
    return { id, ...updates };
  },

  async delete(id: string) {
    const { db } = ensureFirebaseReady();
    await remove(ref(db, `testimonials/${id}`));
    return null;
  },
};

export const contactAPI = {
  async submit(formData: any) {
    const { db } = ensureFirebaseReady();
    const node = push(ref(db, 'contacts'));
    const payload = {
      ...formData,
      created_at: Date.now(),
    };
    await set(node, payload);
    return { id: node.key, ...payload };
  },

  async getAll() {
    if (!firebaseReady || !db) {
      return [];
    }

    const snap = await get(ref(db, 'contacts'));
    return sortByCreatedAtDesc(toArray(snap.val()));
  },
};
