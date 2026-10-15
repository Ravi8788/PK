import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

// Cloudinary upload configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Firebase Firestore configuration
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

function isCloudinaryConfigured() {
  return (
    CLOUDINARY_CLOUD_NAME &&
    !CLOUDINARY_CLOUD_NAME.includes('your_') &&
    CLOUDINARY_UPLOAD_PRESET &&
    !CLOUDINARY_UPLOAD_PRESET.includes('your_')
  );
}

function isFirebaseConfigured() {
  return (
    FIREBASE_API_KEY &&
    FIREBASE_AUTH_DOMAIN &&
    FIREBASE_PROJECT_ID &&
    FIREBASE_STORAGE_BUCKET &&
    FIREBASE_MESSAGING_SENDER_ID &&
    FIREBASE_APP_ID
  );
}

let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured()) {
  const app = initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  });
  db = getFirestore(app);
}

function ensureFirestoreReady() {
  if (!db || !isFirebaseConfigured()) {
    throw new Error('Firestore is not configured. Set VITE_FIREBASE_* variables in .env');
  }
  return db;
}

function sortByCreatedAtDesc<T extends { created_at?: number }>(items: T[]) {
  return [...items].sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
}

async function getAllFromCollection(collectionName: string): Promise<any[]> {
  if (!db || !isFirebaseConfigured()) {
    return [];
  }

  const snapshot = await getDocs(collection(db, collectionName));
  const items = snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  return sortByCreatedAtDesc(items as Array<{ created_at?: number }>) as any[];
}

function withoutUndefined<T extends Record<string, unknown>>(item: T) {
  return Object.fromEntries(Object.entries(item).filter(([, value]) => value !== undefined)) as T;
}

async function addToCollection(collectionName: string, item: any) {
  const firestore = ensureFirestoreReady();
  const payload = withoutUndefined({
    ...item,
    created_at: item.created_at || Date.now(),
  });
  const created = await addDoc(collection(firestore, collectionName), payload);
  return {
    id: created.id,
    ...payload,
  };
}

async function updateInCollection(collectionName: string, id: string, updates: any) {
  const firestore = ensureFirestoreReady();
  await updateDoc(doc(firestore, collectionName, id), withoutUndefined(updates));
  return { id, ...updates };
}

async function deleteFromCollection(collectionName: string, id: string) {
  const firestore = ensureFirestoreReady();
  await deleteDoc(doc(firestore, collectionName, id));
  return null;
}

export const isBackendConfigured = () => isFirebaseConfigured();

export const authAPI = {
  async signin(email: string, password: string) {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.includes('your_')) {
      throw new Error('Admin credentials not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env');
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('pk_admin_token', 'admin-token');
      return {
        user: {
          uid: 'admin',
          email: ADMIN_EMAIL,
          name: 'Admin',
        },
        token: 'admin-token',
      };
    }

    throw new Error('Invalid email or password.');
  },

  async getSession() {
    const token = localStorage.getItem('pk_admin_token');
    if (token === 'admin-token') {
      return {
        user: {
          uid: 'admin',
          email: 'admin@pkgraphics.com',
          name: 'Admin',
        },
        token,
      };
    }
    return null;
  },

  async signOut() {
    localStorage.removeItem('pk_admin_token');
  },
};

export const storageAPI = {
  async uploadFile(file: File, mediaType: 'image' | 'video' = 'image'): Promise<string> {
    if (!isCloudinaryConfigured()) {
      throw new Error(
        'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env',
      );
    }

    const resourceType = mediaType === 'video' ? 'video' : 'image';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Cloudinary upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
  },
};



export const portfolioAPI = {
  async getAll() {
    return getAllFromCollection('portfolio');
  },

  async add(item: any) {
    return addToCollection('portfolio', item);
  },

  async update(id: string, updates: any) {
    return updateInCollection('portfolio', id, updates);
  },

  async delete(id: string) {
    return deleteFromCollection('portfolio', id);
  },
};

export const reelsAPI = {
  async getAll() {
    return getAllFromCollection('reels');
  },

  async add(item: any) {
    return addToCollection('reels', item);
  },

  async update(id: string, updates: any) {
    return updateInCollection('reels', id, updates);
  },

  async delete(id: string) {
    return deleteFromCollection('reels', id);
  },
};

export const testimonialsAPI = {
  async getAll() {
    return getAllFromCollection('testimonials');
  },

  async add(item: any) {
    return addToCollection('testimonials', item);
  },

  async update(id: string, updates: any) {
    return updateInCollection('testimonials', id, updates);
  },

  async delete(id: string) {
    return deleteFromCollection('testimonials', id);
  },
};

export const contactAPI = {
  async submit(formData: any) {
    return addToCollection('contacts', formData);
  },

  async getAll() {
    return getAllFromCollection('contacts');
  },
};
