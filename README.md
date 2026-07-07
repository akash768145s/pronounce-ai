# Livo AI Pronunciation Assessment

Production-oriented AI SaaS for English pronunciation assessment. Users upload a 30-45 second recording and receive weighted pronunciation scores, word-level issues, timestamped transcript highlights, and personalized coaching feedback.

## Features

- Next.js App Router frontend with responsive premium UI
- FastAPI backend with service-oriented AI pipeline
- Drag-and-drop audio upload with consent gate
- FFmpeg normalization to 16kHz mono WAV
- Modular WhisperX/OpenAI Whisper adapter boundary
- Deterministic weighted scoring engine
- Timestamped pronunciation issues and highlighted transcript
- JSON export and privacy-first retention model
- Docker and Docker Compose support

## Run Locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

If port `3000` is already in use:

```bash
npm run dev -- -H 127.0.0.1 -p 3002
```

Backend:

Requires `uv` and Python 3.13. Install `uv` from `https://docs.astral.sh/uv/` if it is not already available.

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

Open `http://localhost:3000`. The API runs on `http://localhost:8000`.

## Environment Variables

Frontend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend:

```bash
CORS_ORIGINS=["http://localhost:3000"]
OPENAI_API_KEY=
ENABLE_WHISPERX=false
RATE_LIMIT_PER_MINUTE=12
```

## Docker

```bash
docker compose up --build
```

## API

`POST /api/analyze`

Multipart form data:

- `file`: `.wav`, `.mp3`, `.aac`, or `.m4a`
- `consent`: `true`

Returns:

- `overallScore`
- `fluency`
- `clarity`
- `confidence`
- `speechRate`
- `transcript`
- `highlightedTranscript`
- `pronunciationIssues`
- `strengths`
- `improvements`
- `feedback`

`DELETE /api/data` confirms no persistent audio data is stored.

## Folder Structure

```text
backend/app/api          FastAPI routers and dependencies
backend/app/core         config and error handling
backend/app/middleware   rate limiting
backend/app/schemas      Pydantic response models
backend/app/services     audio, transcription, scoring, feedback orchestration
frontend/src/app         Next.js app routes
frontend/src/components  reusable UI primitives
frontend/src/features    pronunciation assessment feature
frontend/src/lib         shared utilities
frontend/src/providers   React Query provider
```

## Deployment

- Frontend: deploy `frontend` to Vercel and set `NEXT_PUBLIC_API_BASE_URL`.
- Backend: deploy `backend` to Railway with the Dockerfile or `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Install FFmpeg in the backend runtime.

## Screenshots

Add screenshots after first deployment:

- Landing and upload
- Processing pipeline
- Results report
- Transcript timeline

## Roadmap

- Connect production WhisperX GPU workers
- Add direct microphone recording
- Add PDF reports
- Add user-approved history
- Add phoneme-level feedback
- Add billing, organizations, and team analytics
