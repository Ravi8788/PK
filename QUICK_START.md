# 🚀 QUICK START - Get Your Site Running Now!

## ⚡ 2-Minute Setup

### **Step 1: Create Your Account (30 seconds)**

1. Open your site: `/admin/login`
2. Click the **"Sign Up"** tab at the top
3. Fill in:
   - **Name:** Your name
   - **Email:** kudaleprathamesh0@gmail.com
   - **Password:** (make one up, remember it!)
4. Click **"Create Account"**
5. ✅ Done! You're logged in!

### **Step 2: Add Optional Database Column (30 seconds)**

**Only if you want to upload videos to portfolio:**

1. Go to Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/sql/new
   ```

2. Copy and paste this:
   ```sql
   ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
   ```

3. Click **"Run"**
4. ✅ Done!

**OR** just skip this - images will work fine without it!

### **Step 3: Upload Your First Item (1 minute)**

1. You're already in the admin dashboard
2. Click **"Portfolio"** tab
3. Click **"Add Item"** button
4. Fill the form:
   - Title: "My First Photo"
   - Category: Wedding Shoots
   - Media Type: Image
   - Click upload area → select a photo
5. Click **"Add Item"**
6. ✅ Done! See it in the dashboard!

---

## 🎯 That's It!

You're now ready to:
- ✅ Upload portfolio items (images and videos)
- ✅ Upload reels with thumbnails
- ✅ Add testimonials
- ✅ Manage your content
- ✅ Show clients your amazing work!

---

## 📱 Quick Links

### **Admin Areas:**
- Login/Signup: `/admin/login`
- Dashboard: `/admin` (after login)

### **Public Site:**
- Home: `/`
- Portfolio: `/#portfolio`
- Reels: `/#reels`
- Contact: `/#contact`

### **Supabase Dashboard:**
- Users: https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/auth/users
- Tables: https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/editor
- Storage: https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/storage/buckets

---

## 🆘 Having Issues?

### **"Invalid email or password"**
→ You haven't signed up yet! Click **"Sign Up"** tab, not "Sign In"

### **"Could not find column"**
→ Run the SQL script from Step 2 above

### **"Failed to upload"**
→ Check file size (max 100MB for videos)
→ Check internet connection

### **Still stuck?**
→ Open browser console (Press F12)
→ Share the error messages
→ Check `/ERRORS_FIXED_GUIDE.md` for detailed help

---

## 💡 Pro Tips

**Uploading Images:**
- Use high-quality photos
- JPG or PNG format
- Any size (will be optimized)

**Uploading Videos:**
- MP4 format recommended
- Max 100MB size
- Compress large files first

**Testing:**
- Click "View Site" button to see public site
- Click any image/video to open lightbox
- Everything updates in real-time!

**Organizing:**
- Use clear titles
- Choose correct categories
- Add descriptions for SEO

---

## ✅ Checklist

Use this to track your progress:

**Account Setup:**
- [ ] Created admin account
- [ ] Logged into dashboard
- [ ] Can see all tabs

**Content Upload:**
- [ ] Uploaded first portfolio image
- [ ] Uploaded first reel
- [ ] Added first testimonial
- [ ] Tested contact form

**Testing:**
- [ ] Viewed public site
- [ ] Clicked portfolio items
- [ ] Watched reel in lightbox
- [ ] Checked on mobile

**Ready to Launch:**
- [ ] Added at least 10 portfolio items
- [ ] Added at least 5 reels
- [ ] Added at least 3 testimonials
- [ ] Filled About Me section
- [ ] Tested all links
- [ ] Shared with first client!

---

## 🎉 Welcome to PK Graphics Admin!

Your professional portfolio website is ready to showcase your amazing photography and videography work. Start adding content and watch your business grow!

**Questions?** Check the detailed guides:
- `/START_HERE.md` - Complete overview
- `/ERRORS_FIXED_GUIDE.md` - Troubleshooting
- `/VIDEO_UPLOAD_GUIDE.md` - Video features
- `/ADMIN_GUIDE.md` - Full admin guide

**Let's build something amazing! 🚀📸🎥**
