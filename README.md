# NSV Engineering Works Website

Premium dark industrial business website for **NSV Engineering Works**, a precision CNC machining, polishing, and engineering job-work business in Kannampalayam, Coimbatore.

## Project Structure

```text
/client
  /src
    /assets
      /gallery
      /hero
      /logo
    /components
    /data
    /utils
/server
  server.js
  enquiries.json
  package.json
```

The existing root files in this workspace are not required for this React/Express version.

## Install

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Run the Backend

```bash
cd server
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

Main endpoint:

```text
POST /api/enquiry
```

Enquiries are saved to:

```text
Supabase table: public.enquiries
```

For local development without Supabase env vars, the API falls back to:

```text
server/enquiries.json
```

## Supabase Enquiry Storage

Create the enquiries table by applying:

```text
supabase/migrations/20260512002500_create_enquiries_table.sql
```

The table stores every contact form input:

```text
id, submitted_at, full_name, phone, email, requirement_type, message
```

Configure the backend with `server/.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://127.0.0.1:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ENQUIRIES_TABLE=enquiries
```

Use the service role key only on the backend. Do not expose it through Vite or client-side code.

## Deploy to Vercel

This repository includes `vercel.json` for direct deployment from the repo root:

```text
Install Command: cd client && npm install
Build Command: cd client && npm run build
Output Directory: client/dist
```

The contact form posts to:

```text
/api/enquiry
```

on Vercel, so it uses the serverless function in:

```text
api/enquiry.js
```

Add these as Vercel Environment Variables for Production, Preview, and Development as needed:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ENQUIRIES_TABLE=enquiries
```

Do not add `SUPABASE_SERVICE_ROLE_KEY` to any `VITE_` variable. `VITE_` variables are bundled into browser code. The service role key must stay server-side only.

For local Vite development, `VITE_API_URL` can point at the local Express API:

```env
VITE_API_URL=http://localhost:5000
```

Do not set `VITE_API_URL` on Vercel unless the API is hosted on a separate backend.

## Run the Frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The Vite site runs on:

```text
http://localhost:5173
```

## Connecting Frontend to Backend

By default, the frontend submits enquiries to:

```text
http://localhost:5000/api/enquiry
```

To use a different backend URL, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Restart the Vite dev server after changing environment variables.

## Gallery Images

Real gallery photos are loaded from:

```text
client/public/gallery
```

The uploaded workshop images are installed as:

```text
gallery-01.jpeg
gallery-02.jpeg
gallery-03.jpeg
gallery-04.jpeg
gallery-05.jpeg
gallery-06.jpeg
```

The gallery metadata lives in `client/src/data/galleryData.js`. Keep the `image` paths and `alt` text clear when changing photos. The visible gallery is intentionally image-led without per-photo descriptions.

## Hero CNC Visual

Aligned CNC machine PNG states are stored in:

```text
client/src/assets/hero/cnc-closed.png
client/src/assets/hero/cnc-open.png
```

The hero crossfades between these two aligned machine states using Framer Motion scroll progress. The SVG source files are kept alongside them for easy regeneration.

## Logo

The NSV logo used in the navbar and footer is stored at:

```text
client/src/assets/logo/nsv-logo.png
```

## Production Build

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server
npm start
```

## Notes

- The site uses React, Vite, Tailwind CSS, Framer Motion, and Lucide React.
- The API uses Node.js, Express, CORS, and local JSON file persistence.
- The establishment year is kept as 2006 across the site.
