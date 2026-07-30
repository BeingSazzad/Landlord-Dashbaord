# Landlord HQ — Admin Dashboard

Platform admin dashboard for the [Landlord HQ](https://github.com/BeingSazzad/Property-Listing-App) mobile app.

Separate repo from the mobile prototype. Uses mock data aligned with the mobile app's domain model.

## Stack

- React 19 + TypeScript + Vite
- React Router
- Redux Toolkit + RTK Query
- Tailwind CSS v4
- Zod (env validation)

## Demo login

- **Email:** `admin@landlordhq.co.uk`
- **Password:** `Admin123!`

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Structure

```
src/
├── pages/          # route entry points
├── components/     # feature + ui + layout + shared
├── router/         # routes + auth guard
├── store/          # Redux store
├── services/       # RTK Query API
├── hooks/          # global hooks
├── lib/            # utils, mock data
└── types/          # shared types
```

## Deploy

Build output is in `dist/`. Deploy to Vercel, Netlify, or GitHub Pages.
