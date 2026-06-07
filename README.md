# Resume Screener Frontend

React + Vite UI for the Spring Boot resume screener API.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8080` (see `resume-screener-backend`)

## Setup

```bash
cd /home/bhuban/Downloads/resume-screener-frontend
npm install
cp .env.example .env   # optional — dev proxy works without this
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API integration

| Action | Method | Endpoint |
|--------|--------|----------|
| Upload & screen | `POST` | `/api/resumes/upload` |
| Get candidate | `GET` | `/api/resumes/{id}` |
| Delete resume | `DELETE` | `/api/resumes/{id}` |

In development, Vite proxies `/api` → `http://localhost:8080` (see `vite.config.js`).

For production builds, set:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Usage

1. Start MySQL and the Spring Boot backend.
2. Run `npm run dev`.
3. Open **Dashboard**, paste a job description, upload PDFs, click **Screen Resumes**.

Results are loaded from the backend and ranked by total score.
