# Expense Tracker

Full-stack personal expense tracker.

## Stack

- **Backend:** NestJS, TypeORM, MySQL 8, class-validator — http://localhost:3000/api
- **Frontend:** React, TypeScript, Vite, Chart.js (react-chartjs-2) — http://localhost:5173

## Prerequisites

- Node.js >= 18.18
- MySQL 8 running locally

## Backend setup

1. Create the database (tables are created automatically by TypeORM):

   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS expense_tracker;"
   ```

2. Install dependencies and configure environment:

   ```bash
   cd backend
   npm install
   Copy-Item .env.example .env   # PowerShell (Linux/macOS: cp .env.example .env)
   ```

   Edit `.env` with your MySQL credentials.

3. Run:

   ```bash
   npm run start:dev
   ```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to the backend, so no extra CORS setup is needed in development.
