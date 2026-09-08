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
