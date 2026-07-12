# Bakins — Setup Guide

This is a bakery menu website (React + Vite) with a Firebase-backed admin dashboard.
Customers browse the menu; the owner logs in at `/admin/login` to add, edit, or delete
items. There is no server — the browser talks to Firebase directly, which is fine for
a low-traffic site (~50 visits/day) and stays within Firebase's free "Spark" plan.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com/ and click **Add project**.
2. Name it (e.g. `bakins`), disable Google Analytics (not needed), click **Create project**.
3. In the left sidebar, click the **</>** (web) icon to register a web app. Name it
   anything (e.g. `bakins-web`). You do **not** need Firebase Hosting — skip that step.
4. Firebase will show a `firebaseConfig` object with keys like `apiKey`, `authDomain`,
   etc. Keep this tab open — you'll copy these values into `.env` in step 4.

## 2. Enable Firestore (the database)

1. In the Firebase console sidebar: **Build → Firestore Database → Create database**.
2. Choose **Start in production mode**, pick a location close to your users, click **Enable**.
3. Go to the **Rules** tab and replace the contents with what's in [`firestore.rules`](firestore.rules)
   in this repo (public read on `products`, writes require sign-in). Click **Publish**.

## 3. Enable Firebase Authentication (owner login)

1. **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password**.
3. Go to the **Users** tab → **Add user**. Enter the owner's email and a password —
   this is what the owner will use to log into `/admin/login`. You can add more than
   one owner account later the same way.

## 4. Configure local environment variables

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Fill in the values from the `firebaseConfig` object from step 1:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
   `.env` is already git-ignored — it will never be committed.

## 5. Run it locally

```
npm install
npm run dev
```

Open the printed local URL. Visit `/admin/login` and sign in with the user you created
in step 3. Add a few menu items (name, description, price, category, image URL) and
confirm they show up on the homepage under **Menu**.

Note: Firebase's `apiKey` is not a secret — it's safe to ship in the frontend bundle.
Real protection comes from the Firestore rules (step 2), which is why only signed-in
users can write data.

## 6. Customize branding

Edit [`src/siteConfig.js`](src/siteConfig.js) — shop name, tagline, about text, phone
number, WhatsApp number, address, and hours. No database needed for this; it's just
part of the source code.

## 7. Push to GitHub

Your repo is already set up at `git@github.com:SourabhSaraswat-191939/Bakings.git`.
From this project folder:

```
git init
git remote add origin git@github.com:SourabhSaraswat-191939/Bakings.git
git add .
git commit -m "Initial bakery website with admin dashboard"
git branch -M main
git push -u origin main
```

(Double-check `git status` before committing — `.env` should **not** appear in the list.)

## 8. Deploy for free on Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. **Add New → Project**, select the `Bakings` repo.
3. Vercel auto-detects Vite. Leave build settings as default
   (`npm run build`, output directory `dist`).
4. Before deploying, add the same six `VITE_FIREBASE_*` variables from your `.env`
   under **Environment Variables**.
5. Click **Deploy**. You'll get a free `*.vercel.app` URL.

Every future `git push` to `main` automatically redeploys.

## 9. Lock down Firebase for your live domain (recommended)

In the Firebase console: **Authentication → Settings → Authorized domains**, add your
`*.vercel.app` URL (and any custom domain later). This prevents other sites from using
your Firebase Auth in the sign-in flow.

## How the pieces fit together

- **Public site** (`/`): reads `products` from Firestore in real time and groups them
  by category. No login needed.
- **Admin dashboard** (`/admin`): protected by Firebase Auth. Lets the owner add, edit,
  and delete products (name, description, price, category, image URL, available toggle).
- **Images**: the owner pastes a direct image link (e.g. from Google Photos share link,
  Imgur, or any public image host) into the "Image URL" field — no file upload/storage
  needed, which keeps this entirely on Firebase's free tier.
