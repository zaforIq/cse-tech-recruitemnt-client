This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Full‑Stack Setup 🛠️

This repository now includes a simple API backed by MongoDB. Follow these steps to run the app locally:

1. **Environment variables**
   - Copy `.env.local` from the template or create one in the project root.
   - Ensure it contains the following entries (the credentials below are already configured):
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     MONGODB_USER=xoy4444_db_user
     MONGODB_PASSWORD=4JHcmevahpHo818D
     MONGODB_URI=mongodb+srv://xoy4444_db_user:4JHcmevahpHo818D@cluster0.wlsf0s7.mongodb.net/?appName=Cluster0
     PORT=3001  # optional, default 3000 is used by Next.js
     ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The React frontend will fetch candidate data from the built-in API routes (`/api/candidates`).

4. **API Endpoints**
   - `GET /api/candidates` – returns all candidates from MongoDB.
   - `GET /api/candidates/:id` – returns a single candidate by MongoDB `_id`.

5. **Seeding data**
   - You can insert documents manually into the `candidates` collection using MongoDB Compass or the Mongo shell.
   - The front end expects fields such as `name`, `studentId`, `appliesFor`, `technicalSkills`, etc.

6. **Deployment**
   - Set the same environment variables in your deployment target (Vercel, etc.).
   - Ensure the MongoDB network access allows connections from your deployment.

---

Enjoy your full-stack recruitment portal! 🎓