# PK Graphics

PK Graphics is a cinematography and photography website for showcasing creative work, reels, testimonials, and client enquiries. The project includes a polished public-facing portfolio and an admin area for managing content.

This repository currently contains:

- A Vite + React + TypeScript frontend for the public website and admin dashboard
- Firebase Authentication and Firebase Realtime Database integration used by the live client app
- An additional Express + PostgreSQL + Cloudinary server in `server/` that is included in the repo for API-driven deployment or future migration work

## Project Overview

The website is designed for a photography and cinematography brand and highlights:

- Hero landing section with branding and call-to-action
- About section for the studio / creator story
- Portfolio gallery with category filtering and lightbox preview
- Reels and short-video showcase
- Services section for wedding, event, commercial, and creative work
- Testimonials pulled from data storage
- Contact form for lead collection
- Admin login and dashboard for content management

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Motion animations
- React Router
- Firebase Auth
- Firebase Realtime Database

### Backend Included In Repo

- Node.js
- Express
- PostgreSQL
- Cloudinary
- JWT authentication

## Current Architecture

There are two backend-related paths in this repository:

1. `src/app/utils/api.ts`
   The frontend is currently wired to Firebase for auth, content data, and contact submissions.

2. `server/`
   A separate Express API with PostgreSQL and Cloudinary routes is also present in the repo.

In other words, the client app works from Firebase today, while the `server/` folder is available as a more traditional backend setup that can be used later or in a different deployment flow.

## Main Features

- Responsive one-page public website with smooth section navigation
- Dedicated admin login page at `/admin/login`
- Admin dashboard at `/admin` for:
  - Portfolio items
  - Reels / short videos
  - Testimonials
  - Contact messages
- Lightbox viewer for images and video content
- Brand-specific design for PK Graphics with orange-on-black visual styling

## Frontend Setup

### Prerequisites

- Node.js 18+
- npm
- A Firebase project

### Install

```bash
npm install
```

### Configure Environment

Create a `.env` file in the project root based on `.env.example`.

Required variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### Run Frontend

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Build Frontend

```bash
npm run build
```

## Optional Server Setup

If you want to use the Express backend included in `server/`:

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`, then configure:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Run the server:

```bash
npm run dev
```

The API runs on `http://localhost:4000`.

## Database Content Used By The Frontend

When using the current Firebase-powered frontend, the main collections / nodes are:

- `portfolio`
- `reels`
- `testimonials`
- `contacts`

Firebase Authentication is used for admin sign-in and sign-up.

## Project Structure

```text
.
├─ public/
│  └─ images/                Static brand assets
├─ src/
│  ├─ app/
│  │  ├─ components/         Public site sections, forms, UI, lightbox
│  │  ├─ pages/              Public site and admin pages
│  │  ├─ utils/api.ts        Firebase-based client data layer
│  │  └─ routes.ts           App routing
│  └─ styles/                Global styles and theme files
├─ server/
│  ├─ src/routes/            Express API routes
│  ├─ src/config/            DB and Cloudinary config
│  └─ db/                    SQL init and migration scripts
└─ README.md
```

## Important Notes

- The root frontend package was originally scaffolded from a design/code export and has since been adapted into the PK Graphics website.
- Some older markdown guides are still present in the repo for setup/history, but the current README should be treated as the main project entry point.
- The Vite dev server includes an `/api` proxy to `http://localhost:4000`, though the current frontend data layer uses Firebase directly.

## Brand / Business Context

This project is built for **PK Graphics**, a photography and cinematography brand focused on:

- Wedding photography
- Wedding videography
- Pre-wedding shoots
- Reels and social media video content
- Event coverage
- Creative and commercial shoots

## Suggested Next Cleanup

To keep the repository easier to maintain, the next recommended step would be to choose one backend path and document it as the primary production setup:

- Keep Firebase as the main backend and remove unused server code, or
- Migrate the frontend to the Express/PostgreSQL API and retire the Firebase client layer

## License

This repository is private unless you choose otherwise. Add your preferred license before public release.
