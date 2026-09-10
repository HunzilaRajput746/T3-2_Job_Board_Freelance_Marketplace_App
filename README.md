# Orbitwork

Orbitwork is a MERN job board and freelance marketplace for focused teams and independent talent. The project includes an Express/Mongoose API and a responsive React + Material UI dashboard.

## Run Locally

Prerequisites: Node.js 18+, npm, and MongoDB running locally or a MongoDB Atlas connection string.

```powershell
cd T3-2_Job_Board_Freelance_Marketplace_App
Copy-Item .env.example .env
npm install
npm --prefix client install
npm run dev
```

The API runs on `http://localhost:5000` and the client on `http://localhost:5173`. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in `.env` before using persistence. To load realistic sample data:

```powershell
npm run seed
```

Demo accounts: `employer@demo.com` and `candidate@demo.com`, both using password `Orbitwork2026!` after seeding.

New users can select **Candidate** or **Employer** on the registration screen. A fresher should register as a Candidate, then browse open roles and submit applications.

## Deploy Online

This is a two-service MERN app. Deploy the API first on Render and the React client on Netlify or Vercel. Streamlit is not suitable for this React/Express application.

### 1. Deploy the API on Render

1. Push this repository to GitHub.
2. In Render, choose **New > Blueprint** and select the repository. Render will detect `render.yaml`.
3. Set the service environment variables:
	- `MONGO_URI`: your MongoDB Atlas URI
	- `JWT_SECRET`: a new long random secret, never the example value
	- `CLIENT_URL`: the final Netlify/Vercel URL (temporarily use the frontend URL after step 2)
4. Deploy and verify `https://YOUR-API.onrender.com/api/health` returns `{ "status": "ok" }`.
5. Seed once from a local terminal using the same production `MONGO_URI`, or create the demo data before deployment.

### 2. Deploy the client on Netlify

1. Choose **Add new site > Import an existing project** and select the repository.
2. Set the base directory to `client`.
3. Netlify reads `client/netlify.toml`; build command is `npm run build` and publish directory is `dist`.
4. Add `VITE_API_URL=https://YOUR-API.onrender.com` in the site environment variables.
5. Deploy, copy the Netlify URL, then set that URL as `CLIENT_URL` in Render and redeploy the API.

Vercel also works: select the `client` directory as the project root, set `VITE_API_URL` to the Render API URL, and deploy with the default Vite settings.

## Roles and Lifecycle

- **Employer** accounts publish, edit, close, and delete only their own jobs. They can inspect applicants for their jobs and move applications through Pending, Reviewed, Accepted, and Rejected.
- **Candidate** accounts browse and search jobs, apply to open jobs once, and track their application status.
- Jobs begin as Open and can be Closed by their owner. Closed jobs reject new applications.
- JWT bearer tokens identify users. Every protected write checks both role and resource ownership on the server; frontend controls are not authorization boundaries.

## API Summary

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/jobs` | Public |
| POST | `/api/jobs` | Employer |
| PUT/DELETE | `/api/jobs/:id` | Owning Employer |
| POST | `/api/applications/:jobId` | Candidate |
| GET | `/api/applications/my-applications` | Candidate |
| GET | `/api/applications/job/:jobId` | Owning Employer |
| PUT | `/api/applications/:appId/status` | Owning Employer |

## Project Structure

- `server.js`: Express entry point and API registration
- `models/`: User, Job, and Application schemas
- `routes/`: auth, job, and application endpoints
- `middleware/auth.js`: JWT authentication and role middleware
- `client/src/`: React dashboard UI
- `seed.js`: repeatable demo data reset and seed script

Never commit `.env`; `.env.example` contains only safe configuration placeholders.
