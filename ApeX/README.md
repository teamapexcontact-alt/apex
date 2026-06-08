# ApeX

Premium futuristic studio website with Supabase-backed admin and a modern Next.js App Router experience.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Supabase

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
```

## Run Production Server

```bash
npm run start
```

## Project structure

```
ApeX/
+-- frontend/
   +-- src/                 # Next.js app, components, hooks, lib, and pages
   +-- public/              # Static assets served by Next.js
   +-- tsconfig.json        # Frontend TypeScript config
   +-- next.config.ts       # Next.js config for frontend
+-- backend/
   +-- scripts/             # Server-side scripts and Supabase helpers
   +-- .env.local*          # Server secrets (moved for production safety)
+-- data/                      # Site content JSON files (shared)
+-- package.json               # Root scripts orchestrate frontend/backend tasks
```

## Content Management

All content is managed through JSON files in the `data/` directory. The frontend consumes `frontend/src` and `data/` at build time.

## Deployment

This repo is split into `frontend/` (Next.js) and `backend/` (server scripts). Root `npm` scripts run the frontend build and dev server.

- `npm run build` to compile the frontend
- `npm run start` to serve the frontend production app

## Scripts

| Command        | Description               |
|----------------|---------------------------|
| `npm run dev`  | Development server        |
| `npm run build`| Build for production      |
| `npm run start`| Run the production server |
| `npm run lint` | Run ESLint                |

## Important Notes

- Admin dashboard is available at `/admin`
- Supabase protects admin authentication and contact request access
- All API and auth behavior runs inside the Next.js app
- Content updates require editing JSON files and rebuilding
