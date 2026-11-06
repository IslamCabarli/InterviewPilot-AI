# Speech-to-Text Service (faster-whisper)

This service transcribes the candidate's spoken answers into text using
[faster-whisper](https://github.com/SYSTRAN/faster-whisper). It runs as a small
FastAPI server and is called by the Laravel backend over HTTP.

> **Why isn't this in Docker Compose?** It currently isn't containerized (see the
> main [README](../../README.md#known-limitations)) — dockerizing it is on the
> [roadmap](../../README.md#roadmap). For now it runs locally alongside the
> Docker services, which still talk to it over `host.docker.internal`.

## Requirements

- Python 3.11 or 3.12
- ~1-2GB free disk space (for the `small` Whisper model, downloaded automatically on first run)

## Setup

### 1. Create a virtual environment

**Windows (PowerShell):**
```powershell
cd services\stt
python -m venv venv
.\venv\Scripts\activate
```

**Linux / macOS / WSL:**
```bash
cd services/stt
python -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install faster-whisper fastapi uvicorn python-multipart
```

### 3. Run the server

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

The first request will download the `small` model (~500MB) — this only happens once,
it's cached afterward. Startup after that is fast.

### 4. Verify it's running

Open [http://localhost:8001/health](http://localhost:8001/health) in your browser.
You should see:

```json
{"status": "ok"}
```

## Keeping it running

This needs to stay running in its own terminal window while you use the app
(alongside `docker compose up`). If you close the terminal, voice input in the
app will stop working — text-based answers will still work fine.

## Configuration

The Laravel backend expects this service at the URL set in `WHISPER_URL`
(`apps/backend/.env`). If you're running Docker Compose for the rest of the
stack, this should point to your host machine:

```env
WHISPER_URL=http://host.docker.internal:8001
```

If you're running the backend locally too (not in Docker), use:

```env
WHISPER_URL=http://localhost:8001
```

## Model size / accuracy tradeoff

`main.py` currently loads the `small` model. If transcription accuracy isn't
good enough, or you have a stronger machine, you can swap to a larger model:

```python
model = WhisperModel("medium", device="cpu", compute_type="int8")
```

Available sizes: `tiny`, `base`, `small`, `medium`, `large-v3`. Larger models are
slower but more accurate. If you have an NVIDIA GPU, change `device="cpu"` to
`device="cuda"` for a significant speed boost.

## Language support

Whisper supports many languages out of the box, including English and
Azerbaijani, without any extra configuration — it auto-detects the spoken
language per request.