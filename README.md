# CredNest

B2B debt-capital marketing site + API.

## Structure

```
CrediNest/
├── react-app/     # Frontend (Vite + React)
├── backend/       # Express + MongoDB API
└── docs/          # Project guides
```

## Frontend

```bash
cd react-app
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run start   # or: node server.js
```

Copy `backend/env.example` to `backend/.env` and set `MONGODB_URI` / `JWT_SECRET`.

## Docs

- [Domain connection](docs/domain-connection-guide.md)
- Backend guides live in [`backend/docs/`](backend/docs/)
