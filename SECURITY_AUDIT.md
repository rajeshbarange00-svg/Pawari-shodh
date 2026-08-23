# Pawari Shodh Patrika — Security Remediation

Applied to this build:
- Firebase Storage deny-by-default catch-all.
- Admin-only writes for shared media/articles/books/documents.
- Owner-only private user uploads.
- Public manuscript/contribution intake limited by file type and size.
- Firestore media/user_files writes restricted to staff/admin roles.
- CORS wildcard removed and replaced with known app origins.
- Duplicate literal Windows-style public asset paths normalized where safe.

Before Firebase deployment:
- Verify the admin email/custom claim used by the rules.
- Run Firebase Rules Emulator tests.
- Restrict Firebase API keys in Google Cloud.
- Confirm the production Vercel domain in Firebase Authorized Domains.
