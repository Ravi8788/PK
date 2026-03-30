# 🚀 Supabase Setup Guide for PK Graphics

## ⚠️ Error: "Database error querying schema"

If you're seeing this error, it means **you haven't run the database migration yet**. Follow the steps below to fix it.

---

## 📋 Quick Fix (3 Steps)

### **Step 1: Go to Supabase SQL Editor**

1. Open your browser and go to: https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/sql
2. Click **"New Query"**

### **Step 2: Copy and Run the Migration**

1. Open the file `/supabase/migrations/20240101000000_initial_schema.sql` in your code editor
2. Copy **ALL** the SQL code (it's about 143 lines)
3. Paste it into the Supabase SQL Editor
4. Click the **"Run"** button (bottom right)
5. Wait for the green success message

### **Step 3: Try Signing Up Again**

1. Go back to your website's `/admin/login` page
2. Click the **"Sign Up"** tab
3. Fill in:
   - Name: Your name
   - Email: Your email address
   - Password: Choose a strong password
4. Click **"Create Account"**

✅ You should now be logged in and redirected to the admin dashboard!

---

## 🔍 What Does the Migration Do?

The migration creates:

### **Database Tables:**
- `portfolio` - Stores portfolio items (images, categories, descriptions)
- `reels` - Stores video reels and thumbnails
- `testimonials` - Stores client testimonials and ratings
- `contacts` - Stores contact form submissions

### **Storage Buckets:**
- `portfolio-images` - For uploading images

### **Security Policies:**
- Public can view all content
- Only authenticated admins can create/update/delete content
- Row Level Security (RLS) enabled on all tables

---

## 📊 Checking Your Database

### **View Tables:**
https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/editor

### **View Authentication (Admin Users):**
https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/auth/users

### **View Storage:**
https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/storage/buckets

---

## 🆘 Still Having Issues?

### **"Failed to fetch" Error**
- Check your internet connection
- Make sure Supabase isn't down: https://status.supabase.com/

### **"Invalid login credentials" Error**
- You haven't created an account yet - use **"Sign Up"** first
- Or you're using the wrong email/password

### **Tables Still Don't Exist**
1. Go to SQL Editor: https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/sql
2. Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```
3. If you see no results, run the migration again (Step 2 above)

---

## 🎯 Complete Migration SQL

Here's the full SQL you need to run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reels table
CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_image TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  project_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  service TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Enable RLS (Row Level Security)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Portfolio policies
CREATE POLICY "Anyone can read portfolio"
ON portfolio FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert portfolio"
ON portfolio FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update portfolio"
ON portfolio FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete portfolio"
ON portfolio FOR DELETE
USING (auth.role() = 'authenticated');

-- Reels policies
CREATE POLICY "Anyone can read reels"
ON reels FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert reels"
ON reels FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update reels"
ON reels FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete reels"
ON reels FOR DELETE
USING (auth.role() = 'authenticated');

-- Testimonials policies
CREATE POLICY "Anyone can read testimonials"
ON testimonials FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
ON testimonials FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonials"
ON testimonials FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonials"
ON testimonials FOR DELETE
USING (auth.role() = 'authenticated');

-- Contacts policies
CREATE POLICY "Anyone can insert contacts"
ON contacts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can read contacts"
ON contacts FOR SELECT
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_created_at ON portfolio(created_at DESC);
CREATE INDEX idx_reels_created_at ON reels(created_at DESC);
CREATE INDEX idx_testimonials_rating ON testimonials(rating DESC);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
```

---

## ✅ Verification Checklist

After running the migration, verify:

- [ ] Tables exist in Table Editor
- [ ] Storage bucket `portfolio-images` exists
- [ ] Can create admin account on `/admin/login`
- [ ] Can log in with created account
- [ ] Can access admin dashboard at `/admin`

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Main Dashboard** | https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa |
| **SQL Editor** | https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/sql |
| **Table Editor** | https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/editor |
| **Authentication** | https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/auth/users |
| **Storage** | https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/storage/buckets |

---

## 📞 Need More Help?

If you're still experiencing issues after following this guide:

1. Check the browser console for detailed error messages
2. Verify your Supabase project is active and not paused
3. Make sure you're using the correct Supabase project URL
4. Try clearing your browser cache and cookies

---

**Last Updated:** February 17, 2026  
**Project ID:** xtrsqkhsdceudbwemowa
