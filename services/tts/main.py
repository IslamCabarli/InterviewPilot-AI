from fastapi import FastAPI
from fastapi.responses import Response
from pydantic import BaseModel
import subprocess
import tempfile
import os

app = FastAPI()

PIPER_EXE = os.path.join("piper", "piper.exe")
VOICE_MODEL = os.path.join("piper", "voices", "en_US-amy-medium.onnx")


class SynthesizeRequest(BaseModel):
    text: str


@app.post("/synthesize")
async def synthesize(req: SynthesizeRequest):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        output_path = tmp.name

    try:
        process = subprocess.run(
            [
                PIPER_EXE,
                "--model",
                VOICE_MODEL,
                "--output_file",
                output_path,
            ],
            input=req.text.encode("utf-8"),
            capture_output=True,
            check=False,
        )

        if process.returncode != 0:
            return {
                "error": process.stderr.decode("utf-8", errors="ignore")
            }

        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        return Response(
            content=audio_bytes,
            media_type="audio/wav",
        )

    finally:
        if os.path.exists(output_path):
            os.remove(output_path)


@app.get("/health")
async def health():
    return {"status": "ok"}