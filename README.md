# Orbitwork

Orbitwork is a MERN job board and freelance marketplace. Employers publish roles and manage applicants; Candidates browse open roles, apply, and track application status.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB local installation or MongoDB Atlas
- Git (only required for GitHub deployment)

## Project Layout

```text
.
|-- server.js                 Express API entry point
|-- config/db.js              MongoDB connection
|-- models/                   Mongoose schemas
|-- routes/                   Auth, jobs, and applications API
|-- middleware/auth.js        JWT authentication and RBAC
|-- seed.js                   Demo database seeder
|-- client/                   React + Vite + Material UI frontend
|-- .env.example              Backend environment template
`-- package.json              Backend scripts and dependencies
```

## Environment Variables

### Backend: `.env`

Create the file in the project root by copying `.env.example`:

```powershell
Copy-Item .env.example .env
```

Then configure:

| Variable | Required | Description | Local example |
| --- | --- | --- | --- |
| `PORT` | No | Express API port | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb://127.0.0.1:27017/orbitwork` |
| `JWT_SECRET` | Yes | Long random JWT signing secret | `replace-with-a-long-random-secret` |
| `CLIENT_URL` | Yes | Frontend origin used by CORS | `http://localhost:5173` |

Never commit `.env`. In production, use a new strong `JWT_SECRET` and rotate any MongoDB password that has been exposed.

### Frontend: optional `.env.local`

The frontend defaults to `http://localhost:5000`. For a hosted frontend, create `client/.env.local` or set the variable in the hosting dashboard:

```env
VITE_API_URL=https://your-api-domain.example.com
```

`VITE_API_URL` must contain the API origin only, without the trailing `/api` because the frontend adds that path itself.

## Install and Run Locally

Open PowerShell in the project directory:

```powershell
cd "D:\My_projects\A Enliven AI Work\T3-2_Job_Board_Freelance_Marketplace_App"
Copy-Item .env.example .env
npm install
npm --prefix client install
```

Start both API and frontend together:

```powershell
npm run dev
```

Open `http://localhost:5173`.

The API is available at `http://localhost:5000`. Verify it with:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok","service":"orbitwork-api"}
```

### Run Services Separately

Use two PowerShell terminals from the project directory:

Terminal 1:

```powershell
npm run server
```

Terminal 2:

```powershell
npm run client
```

If you see `EADDRINUSE`, another process is already using port `5000` or `5173`; close the old server or use a free port.

## Seed Demo Data

Make sure `MONGO_URI` is configured, then run:

```powershell
npm run seed
```

The seeder clears the existing Orbitwork users, jobs, and applications before inserting realistic demo data.

Demo accounts after seeding:

```text
Employer:  employer@demo.com
Candidate: candidate@demo.com
Password:  Orbitwork2026!
```

New users can register from the application and choose `Candidate` or `Employer`. A fresher/freelancer should choose `Candidate`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start backend and frontend together |
| `npm run server` | Start backend with Node watch mode |
| `npm run client` | Start Vite frontend |
| `npm start` | Start backend in production mode |
| `npm run seed` | Reset and insert demo MongoDB data |
| `npm run install-all` | Install root and client dependencies |
| `npm --prefix client run build` | Build frontend for production |

## Roles and Authorization

- **Employer:** creates jobs and can edit/delete only jobs they created. They can view applicants and update application status.
- **Candidate:** views jobs, applies only to Open jobs, cannot apply to the same job twice, and views their own applications.
- **Job lifecycle:** jobs are `Open` by default and can be changed to `Closed`. Closed jobs reject new applications.
- **Application lifecycle:** `Pending`, `Reviewed`, `Accepted`, or `Rejected`.
- JWT bearer tokens, role middleware, and server-side resource ownership checks protect the API. Frontend controls are not authorization boundaries.

## API Routes

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/jobs` | Public |
| POST | `/api/jobs` | Employer |
| PUT | `/api/jobs/:id` | Owning Employer |
| DELETE | `/api/jobs/:id` | Owning Employer |
| POST | `/api/applications/:jobId` | Candidate |
| GET | `/api/applications/my-applications` | Candidate |
| GET | `/api/applications/job/:jobId` | Owning Employer |
| PUT | `/api/applications/:appId/status` | Owning Employer |

Protected requests can send the token as:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Deploying Online

This project should be deployed as two services. Streamlit is not suitable because the application uses a React frontend and Express API.

### Backend on Render

1. Push the repository to GitHub.
2. Create a Render Web Service from the GitHub repository.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add these environment variables in Render:

```text
MONGO_URI=your-production-mongodb-atlas-uri
JWT_SECRET=your-long-random-production-secret
CLIENT_URL=https://your-frontend-domain.netlify.app
NODE_ENV=production
```

6. Deploy and verify `https://your-api-domain.onrender.com/api/health`.
7. Seed production data only when desired. Prefer creating production users through registration rather than using demo credentials.

### Frontend on Netlify or Vercel

1. Import the same GitHub repository.
2. Set the frontend root/base directory to `client`.
3. Build command: `npm run build`.
4. Publish/output directory: `dist`.
5. Add this frontend environment variable:

```text
VITE_API_URL=https://your-api-domain.onrender.com
```

6. Deploy the frontend.
7. Copy the final frontend URL into Render's `CLIENT_URL` and redeploy the API.

For Netlify SPA refresh support, add a redirect from `/*` to `/index.html` with status `200`, or use the included `client/netlify.toml` when present.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT authentication and Employer/Candidate RBAC are enforced server-side.
- Job ownership is checked for edits, deletion, applicant viewing, and status changes.
- Duplicate applications are prevented by both route logic and a MongoDB compound unique index.
- Use HTTPS, a strong production JWT secret, rate limiting, Helmet security headers, input validation, and secure HttpOnly cookies before handling real production traffic.
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
