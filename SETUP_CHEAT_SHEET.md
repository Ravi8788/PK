# 🚀 PK GRAPHICS - SETUP CHEAT SHEET

## ⚡ 2-Minute Setup (Do This Now!)

### 🔧 STEP 0: Disable Email Confirmation
```
→ https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/auth/providers
→ Find "Email Auth" section
→ Toggle OFF "Enable email confirmations"
→ Click "Save"
```

### 📊 STEP 1: Run Database Migration
```
→ https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/sql
→ Click "New Query"
→ Open: /supabase/migrations/20240101000000_initial_schema.sql
→ Copy ALL and paste
→ Click "Run"
```

### 🔐 STEP 2: Create Admin Account
```
→ Go to your site: /admin/login
→ Click "Sign Up" tab
→ Enter name, email, password
→ Click "Create Account"
→ DONE! ✅
```

---

## 🆘 Error Quick Fix

| Error | Fix |
|-------|-----|
| **"Email not confirmed"** | Do Step 0 above ↑ |
| **"Database error"** | Do Step 1 above ↑ |
| **"Rate limit... X seconds"** | Wait X seconds, try again |
| **"Failed to fetch"** | Check internet connection |
| **"Invalid email or password"** | Use "Sign Up" first |

---

## 🔗 Quick Links

| Need | Link |
|------|------|
| **Disable Email Confirmation** | [Auth Providers](https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/auth/providers) |
| **Run SQL Migration** | [SQL Editor](https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/sql) |
| **View Admin Users** | [User Management](https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/auth/users) |
| **View Database** | [Table Editor](https://supabase.com/dashboard/project/xtrsqkhsdceudbwemowa/editor) |
| **Admin Login** | `/admin/login` |

---

## 📖 Full Documentation

- **Quick Start:** `/QUICK_START.md` (5 min read)
- **Setup Guide:** `/SUPABASE_SETUP_GUIDE.md` (detailed)
- **Error Fixes:** `/ALL_ERRORS_FIXED.md` (complete)
- **Email Issues:** `/EMAIL_CONFIRMATION_FIX.md`
- **Database Issues:** `/DATABASE_ERROR_FIXED.md`

---

## ✅ Verification

After setup:
- [ ] Can access `/admin/login`
- [ ] "Sign Up" works without email confirmation
- [ ] Can sign in immediately
- [ ] Can access `/admin` dashboard
- [ ] No error messages

---

## 💡 Pro Tips

- **No pre-configured login exists** - You must create your account
- **Disable email confirmation first** - Saves headaches
- **Run migration before signup** - Prevents database errors
- **Wait for rate limits** - Don't keep trying
- **Save your credentials** - Email + password you choose

---

**Project ID:** xtrsqkhsdceudbwemowa  
**Setup Time:** ~2 minutes  
**Error Handling:** ✅ All fixed  
**Ready to use!** 🎉
