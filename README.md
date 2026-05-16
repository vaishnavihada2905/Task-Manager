# Team Task Manager (Full Stack)

Beginner-friendly full-stack app using React + Vite + Tailwind, Node + Express, SQLite, and JWT.

## Folder Structure

- `backend/` API + SQLite
- `frontend/` React app

## Features
- Signup/Login with JWT
- Roles: admin/member
- Admin: create projects, create tasks, assign tasks
- Member: view assigned tasks and update status
- Dashboard stats: total, completed, pending, overdue

## Demo Credentials (seeded automatically)
- Admin: `admin@example.com` / `admin123`
- Member: `member@example.com` / `member123`

---

## Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
JWT_SECRET=dev_secret_key_change_me
FRONTEND_URL=http://localhost:5173
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Frontend Environment Variables (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Routes
### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Projects
- `GET /api/projects` (auth)
- `POST /api/projects` (admin)

### Tasks
- `GET /api/tasks` (auth)
- `POST /api/tasks` (admin)
- `PUT /api/tasks/:id` (auth - own task for member)
- `GET /api/tasks/dashboard/stats` (auth)
- `GET /api/tasks/members/list` (admin)

---

## Railway Deployment (Backend)
1. Push project to GitHub.
2. In Railway, create a new project from repo.
3. Set root directory to `backend`.
4. Add env vars in Railway:
   - `JWT_SECRET=your-production-secret`
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app` (or Railway frontend URL)
5. Deploy. Railway uses `npm start`.
6. Copy the generated Railway backend URL, for example `https://your-backend.up.railway.app`.

## Frontend Deployment (Vercel or Railway)
1. Deploy the `frontend` folder.
2. Add env variable:
   - `VITE_API_URL=https://your-backend-domain.up.railway.app/api`
3. Redeploy frontend.
4. Put the final frontend URL into Railway's backend `FRONTEND_URL` variable and redeploy the backend.

---

## GitHub Push Commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_LINK
git push -u origin main
```

---

## Notes
- SQLite file is auto-created at `backend/database/task_manager.db`.
- Seed data runs automatically at backend startup if DB is empty.
- Keep `JWT_SECRET` strong in production.
