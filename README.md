# Lab Management System

This repository contains a Lab Management System (frontend + backend) for managing laboratory bookings, schedules, and users.

Structure

- backend/: Node.js + Express + Mongoose backend
- frontend/: React frontend (Vite / Create React App style)

Quick start (development)

1. Start the backend

```bash
cd backend
npm install
# set environment variables in .env (do NOT commit .env)
npm run dev
```

2. Start the frontend

```bash
cd frontend
npm install
npm start
```

Notes

- Do not commit `.env` or other secrets. See `.gitignore` for defaults.
- The frontend expects `REACT_APP_API_URL` to point to the backend API.

How to push this workspace to an existing GitHub repo

1. Initialize a git repo (if not already):

```bash
cd c:\Users\HP\lab-management-system
git init
```

2. Add a minimal `.gitignore` to avoid committing secrets and node_modules (created automatically by the project).

3. Commit current files:

```bash
git add .
git commit -m "Initial import from local workspace"
```

4. Add remote and push (replace with your credentials or use SSH):

```bash
git remote add origin https://github.com/PrinceRuli/lab_management.git
git branch -M main
git push -u origin main
```

If the remote already exists and you want to overwrite its contents with your local workspace, you can force-push (careful: this will replace remote history):

```bash
git push -u origin main --force
```

If you need me to run these git commands here, I cannot push using your credentials. Run the commands above locally or provide a remote with credentials.
