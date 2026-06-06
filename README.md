# Smart E-Learning Platform

Vue 3 and Vite demo platform for Khmer-language digital learning. It includes a course catalog, lessons, practice labs, quizzes, certificates, student profiles, discussions, and an admin course editor.

The frontend also includes light/dark themes, toast notifications, admin confirmations, course filtering, and JSON backup/restore for browser data.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Setup

```sh
npm install
npm run dev
```

## Verification

```sh
npm run test
npm run build
```

Run both checks with:

```sh
npm run check
```

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `alex@example.com` | `password` |
| Admin | `admin@smartlearn.kh` | `admin123` |

Registered demo accounts and learning data are stored locally in the current browser. Passwords for registered accounts are hashed before storage, but this remains a frontend-only demonstration and is not a replacement for server-side authentication.

## Data Model

- Session: browser `localStorage`
- Per-user data: enrollments, favorites, lesson progress, quizzes, notifications, settings, and lab drafts
- Shared demo data: custom courses, reviews, and discussions

For production, replace browser storage with a backend API, database, server-side sessions, authorization, email reset flow, and a sandboxed code execution service.

## Deployment

The project uses Vue Router history mode. `vercel.json` and `public/_redirects` provide SPA fallback rules for Vercel and Netlify.

```sh
npm run build
```

Deploy the generated `dist` directory.
