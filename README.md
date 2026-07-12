# Bakins — Bakery Menu Website

A React + Firebase bakery website: a public menu (products grouped by category, with
image, description, and price) and an owner-only dashboard to add/edit/delete menu
items. No backend server — the frontend talks to Firebase (Firestore + Auth) directly.

See [SETUP.md](SETUP.md) for step-by-step instructions to create the Firebase project,
run locally, and deploy for free on Vercel.

## Stack

- React + Vite
- Tailwind CSS v4
- Firebase Firestore (menu data) + Firebase Authentication (owner login)
- React Router

## Quick start

```
npm install
cp .env.example .env   # then fill in your Firebase config, see SETUP.md
npm run dev
```

## Project structure

- `src/pages/Home.jsx` — public menu page
- `src/admin/` — owner login + dashboard (protected by Firebase Auth)
- `src/siteConfig.js` — shop name, tagline, contact info (edit directly, no DB needed)
- `firestore.rules` — public read on menu items, writes require sign-in

## Brand logo

The logo lives at `public/logo.jpg` and appears in the header, hero section, and browser
tab icon. To replace it, swap the file (keep the same name) or update the `logo.jpg`
references in `src/components/Header.jsx`, `src/components/Hero.jsx`, and `index.html`
if you use a different filename/extension.

## PWA (installable app)

The site is a Progressive Web App via `vite-plugin-pwa` (configured in `vite.config.js`):
installable on phones/desktops, with an app icon, splash/theme color, and offline loading
of the app shell (the page itself loads with no network). Menu data and admin login always
go over the network live — nothing Firestore-related is cached, so customers and the owner
never see stale data.

- Manifest + icons regenerate automatically at build time (`npm run build`) — nothing to
  maintain by hand.
- To change the icons, regenerate `public/pwa-192x192.png`, `public/pwa-512x512.png`,
  `public/maskable-icon-512x512.png`, and `public/apple-touch-icon.png` from your logo
  (the maskable one needs extra padding so Android's icon mask doesn't clip it), and
  update `theme_color`/`background_color` in the `VitePWA` config if your brand colors
  change.
- PWA support (manifest + service worker) only appears in `npm run build` /
  `npm run preview` output, not in plain `npm run dev` (unless `devOptions.enabled` is
  used, which is already on for local testing).
