# Ride-Zilla

Ride-Zilla is a sample ride-hailing application (backend + frontend) built with Node.js, Express, React and a relational database. This repository contains a modular backend API, a React frontend, socket support for realtime events, and SQL scripts for schema and seed data.

## Tech stack

- Backend: Node.js, Express
- Frontend: React (Vite/Create React App)
- Database: SQL (see `database/schema.sql`)
- Realtime: WebSockets / Socket.IO (socket handlers in `backend/socket`)

## Repository structure

- `backend/` — server code, routes, controllers, services, models
- `frontend/` — React app, components, pages, redux slices
- `database/` — `schema.sql` and `seeders.sql`
- `docs/` — project documentation

## Prerequisites

- Node.js 18+ and npm/yarn
- A SQL-compatible database (Postgres/MySQL/SQLite depending on config)

## Quick start

1. Clone the repo and install dependencies for backend and frontend:

```bash
git clone https://github.com/ashutoshlalganj/Ride-Zilla.git
cd Ride-Zilla
cd backend
npm install
cd ../frontend
npm install
```

2. Configure environment variables

- Backend: create a `.env` in `backend/` with entries similar to:

```
PORT=5000
DB_HOST=localhost
DB_USER=youruser
DB_PASS=yourpass
DB_NAME=ride_zilla
JWT_SECRET=change_this
RZ_KEY_ID=your_razorpay_key
RZ_KEY_SECRET=your_razorpay_secret
```

- Frontend: create a `.env` in `frontend/` if needed (e.g. `VITE_API_URL=http://localhost:5000`)

3. Create and seed the database

- Use the SQL files in `database/schema.sql` and `database/seeders.sql` with your DB client to create tables and seed sample data.

4. Run the backend and frontend (concurrently in separate terminals)

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

The backend listens on `PORT` (default 5000). The frontend dev server runs on its configured port (e.g. 3000 or 5173).

## Scripts

- Backend (in `backend/package.json`): `npm run dev`, `npm start`, `npm test` (if present)
- Frontend (in `frontend/package.json`): `npm run dev`, `npm build`, `npm start` (production)

## Development notes

- API routes are under `backend/src/routes/` and implemented in controllers in `backend/src/controllers/`.
- Services are in `backend/src/services/` and handle business logic and third-party integrations (e.g. Razorpay).
- Socket code lives in `backend/src/socket/` (`events.js`, `handlers.js`) and the frontend uses `frontend/src/services/socketService.js`.
- Redux slices live in `frontend/src/redux/slices/`.

## Database

- The project includes `database/schema.sql` to create the tables and `database/seeders.sql` to insert sample data. Adjust SQL dialect if you switch DB engines.

## Contributing

- Fork the repo, make a feature branch, and open a pull request with a clear description.
- Please follow existing code style and add tests for significant changes.

## Troubleshooting

- If environment variables are missing, the server will fail to connect to the DB or to start JWT/third-party integrations — verify `.env` values.
- Check the backend logs for stack traces and the frontend console for network errors.

## License

This project does not include a license file. Add a `LICENSE` if you plan to open-source this repository.

---

If you want, I can also:

- Add example `.env.example` files for both backend and frontend
- Add npm scripts to run both servers concurrently
- Add a short developer setup guide for Docker / Docker Compose

Updated `README.md` to include setup and usage instructions.
# Ride-Zilla