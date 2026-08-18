# Text-to-Speech Service (Piper)

This service converts the AI interviewer's text responses into speech using
[Piper TTS](https://github.com/rhasspy/piper). It runs as a small FastAPI
wrapper around the Piper binary and is called by the Laravel backend over HTTP.

> **Why isn't this in Docker Compose?** It currently isn't containerized (see the
> main [README](../../README.md#known-limitations)) — dockerizing it is on the
> [roadmap](../../README.md#roadmap). Piper does have Linux binaries, so this is
> mainly a matter of time, not a hard blocker — contributions welcome. For now
> it runs locally alongside the Docker services, which talk to it over
> `host.docker.internal`.

## Requirements

- Python 3.11 or 3.12
- ~100MB free disk space (for the Piper binary + voice model)

## Setup

### 1. Download Piper

Go to the [Piper releases page](https://github.com/rhasspy/piper/releases) and
download the build for your OS:

- **Windows:** `piper_windows_amd64.zip`
- **Linux:** `piper_linux_x86_64.tar.gz` (or `_arm64` for ARM)
- **macOS:** `piper_macos_x64.tar.gz` (or `_aarch64` for Apple Silicon)

Extract it into `services/tts/piper/`, so you end up with:

```
services/tts/piper/
├── piper.exe        (Windows) or piper (Linux/macOS)
└── ... (supporting files)
```

**Linux/macOS:** make the binary executable after extracting:
```bash
chmod +x services/tts/piper/piper
```

### 2. Download a voice model

Voice models are hosted on
[Hugging Face — rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices).
This project uses `en_US-amy-medium` by default. Download both files:

- `en_US-amy-medium.onnx`
- `en_US-amy-medium.onnx.json`

and place them in `services/tts/piper/voices/`.

> Voice models aren't included in this repo to keep it lightweight. Only
> English voices are currently available from Piper — there is no
> Azerbaijani TTS model yet (see [Known Limitations](../../README.md#known-limitations)).

### 3. Test Piper directly (optional but recommended)

**Windows:**
```powershell
cd services\tts\piper
echo "Hello, this is a test." | .\piper.exe --model voices\en_US-amy-medium.onnx --output_file test.wav
```

**Linux/macOS:**
```bash
cd services/tts/piper
echo "Hello, this is a test." | ./piper --model voices/en_US-amy-medium.onnx --output_file test.wav
```

Play `test.wav` — if you hear a voice, Piper itself is working correctly.

### 4. Set up the Python environment and run the API wrapper

```bash
cd services/tts
python -m venv venv
```

**Windows:** `.\venv\Scripts\activate`
**Linux/macOS:** `source venv/bin/activate`

```bash
pip install fastapi uvicorn
uvicorn main:app --host 0.0.0.0 --port 8002
```

### 5. Verify it's running

Open [http://localhost:8002/health](http://localhost:8002/health):

```json
{"status": "ok"}
```

## Keeping it running

Like the STT service, this needs to stay running in its own terminal window
while you use the app. If it's not running, the AI's responses simply won't be
spoken aloud — everything else (text chat, evaluation, etc.) still works.

## Configuration

The Laravel backend expects this service at the URL set in `PIPER_URL`
(`apps/backend/.env`):

```env
# If the backend runs in Docker:
PIPER_URL=http://host.docker.internal:8002

# If the backend runs locally too:
PIPER_URL=http://localhost:8002
```

## Using a different voice

Piper has many English voices at different quality/speed tradeoffs (see the
[voices page](https://huggingface.co/rhasspy/piper-voices)). To switch, download
a different `.onnx`/`.onnx.json` pair into `voices/` and update `VOICE_MODEL` in
`main.py` accordingly.