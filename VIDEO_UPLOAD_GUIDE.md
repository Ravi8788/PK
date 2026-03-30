# 📹 Video & Image Upload Feature - Complete Guide

## ✅ WHAT'S NEW

Both the **Portfolio** and **Reels** admin forms now support uploading videos in addition to images!

---

## 🎬 REELS UPLOAD (Admin Dashboard)

When you go to **Admin → Reels → Add Reel**, you now have:

### **Upload Options:**

1. **Thumbnail Image** (Required)
   - Upload a cover image for your reel
   - Accepts: JPG, PNG, GIF, etc.

2. **Upload Type** (Choose one):
   
   **Option A: File Upload**
   - Click "File" button
   - Upload video directly from your computer
   - Accepts: MP4, MOV, AVI, etc.
   - Maximum size: 100MB
   - Video will be stored in Supabase
   
   **Option B: URL**
   - Click "URL" button
   - Paste link from YouTube, Instagram, etc.
   - Example: `https://youtube.com/watch?v=...`

### **Form Fields:**
- **Title:** Name of your reel
- **View Count:** e.g., "10K", "100K"
- **Description:** Details about the video
- **Thumbnail:** Cover image
- **Video:** Upload file OR paste URL

---

## 🖼️ PORTFOLIO UPLOAD (Admin Dashboard)

When you go to **Admin → Portfolio → Add Item**, you now have:

### **Media Type Selection:**

Choose between:
- **Image** - Upload photo
- **Video** - Upload video

### **For Images:**
- Upload JPG, PNG, GIF, etc.
- Shows image preview
- Perfect for photo shoots

### **For Videos:**
- Upload MP4, MOV, AVI, etc.
- Maximum size: 100MB
- Shows video preview with controls
- Perfect for video shoots

### **Form Fields:**
- **Title:** Name of the shoot
- **Category:** Wedding, Pre-Wedding, Reels, Creative
- **Description:** Details (optional)
- **Media Type:** Image or Video
- **Media File:** Upload your file

---

## 🎯 HOW IT WORKS

### **Step 1: Navigate to Upload Form**
```
Admin Dashboard → Reels → Add Reel
OR
Admin Dashboard → Portfolio → Add Item
```

### **Step 2: Fill in Details**
- Enter title, category, description
- Upload thumbnail (for reels)

### **Step 3: Choose Upload Method**

**For Reels:**
1. Upload thumbnail image
2. Choose "File" or "URL" for video
3. If File: Click upload area → Select video
4. If URL: Paste video link

**For Portfolio:**
1. Select "Image" or "Video" from dropdown
2. Click upload area
3. Select your file
4. See preview

### **Step 4: Submit**
- Click "Add Reel" or "Add Item"
- Files upload to Supabase automatically
- Item appears on website immediately!

---

## 📋 TECHNICAL DETAILS

### **File Size Limits:**
- **Images:** No strict limit (reasonable sizes)
- **Videos:** 100MB maximum

### **Supported Formats:**

**Images:**
- JPG, JPEG
- PNG
- GIF
- WebP

**Videos:**
- MP4 (recommended)
- MOV
- AVI
- WebM

### **Storage:**
- All files stored in Supabase Storage
- Organized in buckets: `portfolio/` and `reels/`
- Public URLs generated automatically

---

## 🎨 LIGHTBOX VIEWING

When users click on portfolio or reel items:

**For Images:**
- Opens in full-screen lightbox
- Zoom in/out functionality
- Navigate between items

**For Videos:**
- Opens in video player
- Full playback controls
- Auto-play enabled
- Navigate between videos

---

## ⚡ QUICK TIPS

### **Best Practices:**

1. **Video Quality:**
   - Use MP4 format for best compatibility
   - Compress large videos before upload
   - Aim for under 50MB if possible

2. **Thumbnails:**
   - Use high-quality images
   - Match the video content
   - 16:9 or 9:16 aspect ratio

3. **Organization:**
   - Use clear, descriptive titles
   - Add detailed descriptions
   - Choose correct categories

4. **Testing:**
   - Upload a test video first
   - Check playback in lightbox
   - Verify on mobile devices

---

## 🚀 EXAMPLE WORKFLOW

### **Adding a Wedding Reel:**

```
1. Go to Admin → Reels → Add Reel

2. Fill in:
   - Title: "Sarah & John - Wedding Highlights"
   - View Count: "5K"
   - Description: "Beautiful wedding at sunset venue"

3. Upload Thumbnail:
   - Click thumbnail upload area
   - Select cover image (couple photo)

4. Choose Upload Type:
   - Click "File" button
   - Click video upload area
   - Select wedding_highlight.mp4 (45MB)
   - See video preview

5. Click "Add Reel"
   - Wait for upload (shows progress)
   - Done! ✅

6. View on Website:
   - Go to Reels section
   - Click your reel
   - Watch in lightbox!
```

---

## 🔧 TROUBLESHOOTING

### **"Video file too large" error**
→ Video exceeds 100MB. Compress it first.

### **Upload fails**
→ Check internet connection
→ Try smaller file
→ Check file format (use MP4)

### **Video doesn't play**
→ Use MP4 format
→ Re-encode video
→ Try URL method instead

### **Thumbnail not showing**
→ Make sure image uploaded successfully
→ Check file format (JPG/PNG)
→ Refresh the page

---

## ✅ WHAT'S WORKING

- ✅ Upload images for portfolio
- ✅ Upload videos for portfolio
- ✅ Upload videos for reels (file or URL)
- ✅ Upload thumbnails for reels
- ✅ Preview before upload
- ✅ File size validation
- ✅ Progress indicators
- ✅ Lightbox viewing for all media
- ✅ Video playback controls
- ✅ Responsive on all devices

---

## 🎉 YOU'RE ALL SET!

Now you can:
1. ✅ Upload photos for portfolio
2. ✅ Upload videos for portfolio
3. ✅ Upload reels with video files
4. ✅ Or use video URLs for reels
5. ✅ View everything in beautiful lightbox

Start adding your amazing content! 🚀
