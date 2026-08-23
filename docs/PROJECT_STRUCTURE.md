# Pawari Shodh Project Structure

This repository is organized as a Vite + React application with Firebase-backed content and administration.

## Application
- `src/App.tsx` — application entry component
- `src/components/public/` — public-facing views
- `src/components/admin/` — CMS/admin managers
- `src/components/common/` — reusable UI components
- `src/lib/` — Firebase, routing, PDF, import and utility logic
- `src/data/` — seed and cultural data
- `src/types/` — shared TypeScript types

## Static files
- `public/` — browser-served static assets
- `assets/` — project assets used by the application

## Backend/security configuration
- `firestore.rules` — Firestore authorization rules
- `storage.rules` — Firebase Storage authorization rules
- `cors.json` — Storage CORS configuration
- `firebase-blueprint.json` — Firebase project/deployment blueprint

## Tooling
- `package.json` — scripts and dependencies
- `vite.config.ts` — Vite configuration
- `tsconfig.json` — TypeScript configuration
- `.env.example` — environment variable template
- `.github/workflows/ci.yml` — build/lint CI

## Security
See `SECURITY_AUDIT.md` for the remediation checklist before production deployment.
