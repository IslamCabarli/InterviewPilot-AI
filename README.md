# InterviewPilot AI

> Practice real technical interviews with an AI interviewer — fully open-source, runs locally.

InterviewPilot AI is a self-hosted mock interview platform. It conducts real-time, voice-enabled
technical interviews using a local LLM (Ollama), transcribes your spoken answers (Whisper), and
speaks back to you (Piper TTS) — all running on your own machine, no API keys or cloud costs required.

## Features

- 🎙️ Voice-based interviews (speak your answers, AI speaks back)
- 🤖 Local LLM via Ollama — no OpenAI/Claude API key needed
- 📊 AI-generated evaluation reports (score breakdown, strengths, weaknesses, recommendations)
- 📄 CV-aware interviews (upload your CV, questions adapt to your background)
- 🎮 Lightweight gamification (XP, levels, streaks, badges)
- 🛠️ Admin panel (Filament) for managing users and interviews
- 🐳 Docker Compose setup for core services

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.4 |
| Frontend | React 19.2, TypeScript, Vite, Tailwind CSS |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis |
| LLM | Ollama (llama3.1:8b) |
| Speech-to-Text | faster-whisper |
| Text-to-Speech | Piper TTS |
| Realtime | Laravel Reverb |
| Admin | Filament 5 |

## Prerequisites

- Docker & Docker Compose
- Python 3.11+ (for STT/TTS services, run outside Docker — see below)
- ~8GB free disk space (for the Ollama model)

## Installation

### 1. Clone and start core services

\`\`\`bash
git clone https://github.com/IslamCabarli/InterviewPilot-AI.git
cd InterviewPilot-AI
cp apps/backend/.env.example apps/backend/.env
docker compose up -d --build
\`\`\`

### 2. Run migrations and seed the database

\`\`\`bash
docker compose exec backend php artisan migrate --seed
\`\`\`

> **Important:** seeding is required, not optional — it creates the `user`/`admin` roles that
> registration depends on. Running `migrate` alone will leave signup broken.

### 3. Pull the Ollama model

\`\`\`bash
docker exec -it interviewpilot-ollama ollama pull llama3.1:8b
\`\`\`

This downloads ~4.9GB and only needs to be done once (stored in a persistent volume).

### 4. Set up Speech-to-Text and Text-to-Speech (run locally, not in Docker)

These currently run outside Docker (see [Roadmap](#roadmap)).

**STT (faster-whisper):**
\`\`\`bash
cd services/stt
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install faster-whisper fastapi uvicorn python-multipart
uvicorn main:app --host 0.0.0.0 --port 8001
\`\`\`

**TTS (Piper):** download a Windows/Linux Piper release and a voice model — see
[`services/tts/README.md`](services/tts/README.md) for full steps.


### 4.5 (Optional) Enable voice input/output

Voice features require two small services running locally, in addition to
Docker Compose:

- [STT setup guide](services/stt/README.md) — lets you speak your answers
- [TTS setup guide](services/tts/README.md) — lets the AI speak back

Without these, the app works fine in **text-only mode**.
### 5. Open the app

- Frontend: http://localhost:5173
- API docs (Swagger): http://localhost:8000/api/documentation
- Admin panel: http://localhost:8000/admin (requires an `admin` role — see below)

### Creating an admin user

\`\`\`bash
docker compose exec backend php artisan tinker
\`\`\`
\`\`\`php
$user = \App\Models\User::where('email', 'you@example.com')->first();
$user->assignRole('admin');
\`\`\`

## Configuration

Key environment variables (`apps/backend/.env`):

| Variable | Default | Description |
|---|---|---|
| `AI_PROVIDER` | `ollama` | LLM provider (extensible — see `AiProviderInterface`) |
| `OLLAMA_URL` | `http://ollama:11434` | Ollama endpoint (Docker network) |
| `OLLAMA_MODEL` | `llama3.1:8b` | Model name |
| `WHISPER_URL` | `http://host.docker.internal:8001` | STT service (runs on host) |
| `PIPER_URL` | `http://host.docker.internal:8002` | TTS service (runs on host) |

## Screenshots

_(add screenshots here — Dashboard, Interview chat, Report page)_

## Known Limitations

- **Voice input/output requires manual setup.** `docker compose up` alone only
  gives you text-based interviews. To enable speaking and listening, you also
  need to run the STT and TTS services locally — see
  [`services/stt/README.md`](services/stt/README.md) and
  [`services/tts/README.md`](services/tts/README.md). Dockerizing these is on
  the roadmap; PRs welcome.
- Piper TTS currently only supports English voices — there is no Azerbaijani
  TTS model available yet.
- Realtime token-by-token streaming (Reverb) is implemented on the backend but
  not yet wired up on the frontend — interview responses currently arrive as
  complete messages rather than streaming live.


## Roadmap

- [ ] Coding interview mode (Monaco Editor)
- [ ] Whiteboard / system-design diagramming
- [ ] Company-specific interview styles
- [ ] Full avatar (Live2D / Three.js)
- [ ] Dockerize STT/TTS
- [ ] Complete frontend realtime streaming

## License

MIT — see [LICENSE](LICENSE)

## Contributing

Contributions are welcome. Please open an issue before submitting large PRs.