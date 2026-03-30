# 🚀 PK Graphics - Setup Instructions

## ⚠️ IMPORTANT: Database Migration Required

Your application has been updated to use **Supabase directly** instead of Edge Functions. This provides better reliability, performance, and simplicity.

## ✅ Current Status

The application now includes **graceful error handling**:
- ✅ No more "Failed to fetch" errors displayed to users
- ✅ Empty states show helpful messages instead of errors
- ✅ Admin panel shows clear configuration status
- ✅ Public site works even without Supabase configured (displays empty sections)
- ✅ All API calls safely handle missing Supabase credentials or tables

**This means your site won't break if Supabase isn't set up yet!**

## 📋 Setup Steps

### Step 1: Run the Database Migration

You need to create the database tables before the application will work. Choose one of the methods below:

#### Option A: Via Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `/supabase/migrations/20240101000000_initial_schema.sql` in this project
5. Copy and paste the **entire content** into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

You should see a success message. This creates:
- ✅ 4 database tables (portfolio, reels, testimonials, contacts)
- ✅ A storage bucket for images (portfolio-images)
- ✅ Security policies (Row Level Security)

#### Option B: Via Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref xtrsqkhsdceudbwemowa

# Run migration
supabase db push
```

### Step 2: Verify the Setup

1. After running the migration, go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `portfolio`
   - `reels`
   - `testimonials`
   - `contacts`

3. Go to **Storage** in your Supabase dashboard
4. You should see a bucket named `portfolio-images`

### Step 3: Test the Application

1. **Create an admin account:**
   - Navigate to `/admin/login`
   - Click "Sign Up"
   - Enter your email and password
   - This will create your admin account

2. **Access the admin dashboard:**
   - Log in with your credentials
   - You should now see the admin dashboard
   - Try adding a portfolio item, reel, or testimonial

3. **View the public website:**
   - Navigate to `/` to see your portfolio website
   - All content you add in the admin panel will appear here

## 🔧 What Changed?

### Before (Edge Functions)
- Application tried to call Supabase Edge Functions
- Required complex server-side setup
- Edge Functions weren't deployed, causing errors

### After (Direct Client Integration)
- Application uses Supabase client SDK directly
- Simpler, more reliable architecture
- No Edge Functions needed
- Better performance

## 📊 Database Structure

### Portfolio Table
- `id`: Unique identifier
- `title`: Portfolio item title
- `category`: Wedding Shoots, Pre-Wedding Shoots, etc.
- `image_url`: URL to the image
- `description`: Optional description
- `created_at`: Timestamp

### Reels Table
- `id`: Unique identifier
- `title`: Reel title
- `video_url`: URL to the video (YouTube, Instagram, etc.)
- `thumbnail_url`: URL to the thumbnail image
- `description`: View count or description
- `created_at`: Timestamp

### Testimonials Table
- `id`: Unique identifier
- `client_name`: Client's name
- `client_image`: URL to client photo
- `rating`: 1-5 stars
- `text`: Testimonial text
- `project_type`: Type of project (Wedding, Pre-Wedding, etc.)
- `created_at`: Timestamp

### Contacts Table
- `id`: Unique identifier
- `name`: Contact name
- `email`: Contact email
- `phone`: Optional phone number
- `message`: Contact message
- `service`: Service they're interested in
- `created_at`: Timestamp

## 🔐 Security (Row Level Security)

The migration automatically sets up secure access:
- **Public reads**: Anyone can view portfolio, reels, and testimonials
- **Authenticated writes**: Only logged-in admins can add/edit/delete content
- **Public contact form**: Anyone can submit contact forms
- **Storage**: Authenticated users can upload, public can view

## 🎨 Storage Bucket

Images and videos are stored in the `portfolio-images` bucket:
- Organized by type: `/portfolio/`, `/reels/`, `/testimonials/`
- Public access for viewing
- Protected upload (admin only)
- Files are automatically served with optimal CDN caching

## ❓ Troubleshooting

### Error: "Failed to fetch portfolio/reels/testimonials"
- **Solution**: You haven't run the migration yet. Follow Step 1 above.

### Error: "Permission denied"
- **Solution**: Make sure you're logged in to the admin panel.

### Images not uploading
- **Solution**: Check that the `portfolio-images` storage bucket exists in your Supabase dashboard.

### Can't create admin account
- **Solution**: Check your Supabase Auth settings. Make sure email signup is enabled.

## 📞 Next Steps

1. ✅ Run the database migration
2. ✅ Create your admin account
3. ✅ Add your first portfolio item
4. ✅ Customize the website content
5. ✅ Share your portfolio with clients!

## 🎉 You're All Set!

Once the migration is complete, your PK Graphics portfolio website is ready to use. All the errors you were experiencing should now be resolved.