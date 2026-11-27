# To-Do List

A task manager with a React + TypeScript frontend and an Express + PostgreSQL backend, designed for easy deployment to Netlify or standalone Node hosting.

## Features
- Add tasks, update completion status, rename inline, delete tasks
- Search, filter by status, and sort
- PostgreSQL storage with automatic table initialization (`tasks` table)
- Ready for Netlify deployment with Netlify Serverless Functions & SPA routing

## Running Locally

Requirements: Node.js 18+ and a PostgreSQL database.

1. Install dependencies:
```bash
npm install
npm run install:all
```

2. Configure environment:
Copy `server/.env.example` to `server/.env` and update your database URL:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
```

3. Start development server:
```bash
npm run dev
```
Client runs at `http://localhost:5173` and proxies API requests to `http://localhost:4000`.

## Deploying to Netlify

1. Push your repository to GitHub / GitLab.
2. Link the repository in Netlify.
3. Set your environment variables in Netlify site settings:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Supabase, Neon, Railway, or Netlify Database).
4. Build settings are automatically detected via `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - Functions directory: `netlify/functions`
