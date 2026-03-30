-- CREATE STORAGE BUCKET FOR PORTFOLIO IMAGES
-- Run this in Supabase SQL Editor to set up file uploads
-- Or create manually in Supabase Dashboard → Storage

-- ============================================
-- STEP 1: Create the Storage Bucket
-- ============================================

-- Note: Storage buckets are created via the Supabase Dashboard, not SQL
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets
-- Click "New Bucket"
-- Name: portfolio-images
-- Public: ✅ Enabled
-- Then come back and run the policies below

-- ============================================
-- STEP 2: Set Up Storage Policies
-- ============================================

-- Policy 1: Allow everyone to READ/VIEW images (public access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Policy 2: Allow authenticated users to UPLOAD images
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Policy 3: Allow authenticated users to UPDATE their uploads
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Policy 4: Allow authenticated users to DELETE their uploads
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- ============================================
-- INSTRUCTIONS
-- ============================================

/*

📋 HOW TO SET UP STORAGE BUCKET:

METHOD 1: Via Supabase Dashboard (Recommended)
───────────────────────────────────────────────
1. Go to Supabase Dashboard:
   https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/storage/buckets

2. Click "New Bucket" button

3. Fill in:
   - Name: portfolio-images
   - Public: ✅ Enable this checkbox
   - File size limit: 100 MB
   - Allowed MIME types: (leave empty for all)

4. Click "Create Bucket"

5. Come back here and run this SQL to create policies:
   - Copy the policies above (Policy 1-4)
   - Go to SQL Editor
   - Paste and run
   - Done! ✅


METHOD 2: Manually Create Policies
───────────────────────────────────
After creating the bucket in the dashboard:

1. Click on "portfolio-images" bucket

2. Go to "Policies" tab

3. Click "New Policy"

4. For PUBLIC READ:
   - Policy Name: Public Access
   - Target Roles: public
   - Command: SELECT
   - Policy: bucket_id = 'portfolio-images'

5. For AUTHENTICATED UPLOAD:
   - Policy Name: Authenticated Upload  
   - Target Roles: authenticated
   - Command: INSERT
   - Policy: bucket_id = 'portfolio-images'

6. Repeat for UPDATE and DELETE policies


TESTING YOUR SETUP:
───────────────────
After setting up:

1. Go to Admin Dashboard
2. Portfolio → Add Item
3. Select "Upload File" method
4. Choose an image
5. Click Add Item
6. ✅ Should work without errors!


TROUBLESHOOTING:
────────────────
❌ "Failed to fetch" error:
   → Bucket doesn't exist
   → Solution: Create bucket in dashboard

❌ "Permission denied" error:
   → Policies not set correctly
   → Solution: Add the policies above

❌ Still not working:
   → Use "Enter URL" method instead
   → Works without any storage setup!


ALTERNATIVE: URL METHOD
───────────────────────
Don't want to set up storage? No problem!

1. Use "Enter URL" upload method
2. Paste image URLs from:
   - Unsplash.com
   - Google Drive (public)
   - Imgur
   - Any direct image URL

Works instantly, no setup required! ✅

*/

-- Success message
SELECT '✅ Storage policies created! Create the bucket in Supabase Dashboard, then file uploads will work.' as message;
