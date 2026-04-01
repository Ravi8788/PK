# Security and Performance Checklist

## 1) Realtime Database rules
Deploy `database.rules.json` to lock writes behind Firebase Auth and keep contact messages private.

## 2) URL-only media policy
This app now stores only URL references in Realtime Database.
Do not store raw base64 media in database records.

## 3) Admin access hardening
Use strong passwords and enable email verification in Firebase Authentication.
Optionally enforce admin-only writes using custom claims (`auth.token.admin == true`).

## 4) Performance
- Keep records small and query by indexed fields (`created_at`, `category`).
- Paginate long lists and avoid reading entire nodes.
- Host media on CDN/Firebase Storage and store URL in Realtime Database.

## 5) Monitoring
Track usage in Firebase Console: Realtime Database -> Usage.
Set billing budgets/alerts for Blaze plan.
