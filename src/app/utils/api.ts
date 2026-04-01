// Cloudinary upload configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

function isConfigured() {
  return (
    CLOUDINARY_CLOUD_NAME &&
    !CLOUDINARY_CLOUD_NAME.includes('your_') &&
    CLOUDINARY_UPLOAD_PRESET &&
    !CLOUDINARY_UPLOAD_PRESET.includes('your_')
  );
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getStoredData(key: string) {
  try {
    const data = localStorage.getItem(`pk_${key}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStoredData(key: string, data: any[]) {
  localStorage.setItem(`pk_${key}`, JSON.stringify(data));
}

export const isBackendConfigured = () => isConfigured();

export const authAPI = {
  async signin(password: string) {
    if (!ADMIN_PASSWORD || ADMIN_PASSWORD.includes('your_')) {
      throw new Error('Admin password not configured. Set VITE_ADMIN_PASSWORD in .env');
    }

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('pk_admin_token', 'admin-token');
      return {
        user: {
          uid: 'admin',
          email: 'admin@pkgraphics.com',
          name: 'Admin',
        },
        token: 'admin-token',
      };
    }

    throw new Error('Invalid password.');
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
  async uploadFile(file: File, _path: string): Promise<string> {
    if (!isConfigured()) {
      throw new Error(
        'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env',
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  },
};



export const portfolioAPI = {
  async getAll() {
    return getStoredData('portfolio');
  },

  async add(item: any) {
    const items = getStoredData('portfolio');
    const newItem = {
      id: generateId(),
      ...item,
      created_at: Date.now(),
    };
    items.unshift(newItem);
    setStoredData('portfolio', items);
    return newItem;
  },

  async update(id: string, updates: any) {
    const items = getStoredData('portfolio');
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      setStoredData('portfolio', items);
    }
    return { id, ...updates };
  },

  async delete(id: string) {
    let items = getStoredData('portfolio');
    items = items.filter((item: any) => item.id !== id);
    setStoredData('portfolio', items);
    return null;
  },
};

export const reelsAPI = {
  async getAll() {
    return getStoredData('reels');
  },

  async add(item: any) {
    const items = getStoredData('reels');
    const newItem = {
      id: generateId(),
      ...item,
      created_at: Date.now(),
    };
    items.unshift(newItem);
    setStoredData('reels', items);
    return newItem;
  },

  async update(id: string, updates: any) {
    const items = getStoredData('reels');
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      setStoredData('reels', items);
    }
    return { id, ...updates };
  },

  async delete(id: string) {
    let items = getStoredData('reels');
    items = items.filter((item: any) => item.id !== id);
    setStoredData('reels', items);
    return null;
  },
};

export const testimonialsAPI = {
  async getAll() {
    return getStoredData('testimonials');
  },

  async add(item: any) {
    const items = getStoredData('testimonials');
    const newItem = {
      id: generateId(),
      ...item,
      created_at: Date.now(),
    };
    items.unshift(newItem);
    setStoredData('testimonials', items);
    return newItem;
  },

  async update(id: string, updates: any) {
    const items = getStoredData('testimonials');
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      setStoredData('testimonials', items);
    }
    return { id, ...updates };
  },

  async delete(id: string) {
    let items = getStoredData('testimonials');
    items = items.filter((item: any) => item.id !== id);
    setStoredData('testimonials', items);
    return null;
  },
};

export const contactAPI = {
  async submit(formData: any) {
    const items = getStoredData('contacts');
    const newItem = {
      id: generateId(),
      ...formData,
      created_at: Date.now(),
    };
    items.unshift(newItem);
    setStoredData('contacts', items);
    return newItem;
  },

  async getAll() {
    return getStoredData('contacts');
  },
};
