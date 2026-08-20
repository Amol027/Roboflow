# Roboflow Frontend

The React and Vite dashboard for the computer-vision platform. It contains authentication screens, project and deployment views, workflow builders, monitoring screens, and controls for supported vision features.

## Run locally

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

By default, the frontend calls `http://127.0.0.1:8000`. Set `VITE_API_BASE_URL` in `.env` when the FastAPI backend uses a different address.

```powershell
npm run build
npm run lint
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend |
