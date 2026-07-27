from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import tempfile
import os

app = FastAPI()

# "small" modeli sürət/keyfiyyət balansı üçün yaxşıdır, Azərbaycan+İngilis dəstəkləyir
# device="cpu" — GPU-n yoxdursa bu düzgündür, varsa "cuda" edə bilərsən
model = WhisperModel("small", device="cpu", compute_type="int8")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        segments, info = model.transcribe(tmp_path, beam_size=5)
        text = " ".join([segment.text.strip() for segment in segments])
        return {
            "text": text,
            "language": info.language,
        }
    finally:
        os.remove(tmp_path)


@app.get("/health")
async def health():
    return {"status": "ok"}