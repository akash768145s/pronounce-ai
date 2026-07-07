import json
import mimetypes
import shutil
import subprocess
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import Settings
from app.core.errors import AppError


ALLOWED_EXTENSIONS = {".wav", ".mp3", ".aac", ".m4a"}
ALLOWED_MIME_PREFIXES = {"audio/"}
ALLOWED_MIME_TYPES = {"application/octet-stream"}


class AudioService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def persist_upload(self, upload: UploadFile) -> Path:
        suffix = Path(upload.filename or "").suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            raise AppError("Please upload a WAV, MP3, AAC, or M4A recording.")
        content_type = upload.content_type or mimetypes.guess_type(upload.filename or "")[0] or ""
        if not (content_type.startswith(tuple(ALLOWED_MIME_PREFIXES)) or content_type in ALLOWED_MIME_TYPES):
            raise AppError("The uploaded file does not look like a supported audio file.")

        target = self.settings.temp_dir / f"{uuid4().hex}{suffix}"
        size = 0
        max_bytes = self.settings.max_upload_mb * 1024 * 1024
        with target.open("wb") as buffer:
            while chunk := await upload.read(1024 * 1024):
                size += len(chunk)
                if size > max_bytes:
                    target.unlink(missing_ok=True)
                    raise AppError(f"Audio files must be smaller than {self.settings.max_upload_mb} MB.")
                buffer.write(chunk)
        return target

    def duration_seconds(self, path: Path) -> float:
        if not shutil.which(self.settings.ffprobe_path):
            return 36.0
        command = [
            self.settings.ffprobe_path,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            str(path),
        ]
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=True,
            )
            return float(json.loads(result.stdout)["format"]["duration"])
        except (subprocess.CalledProcessError, KeyError, ValueError, json.JSONDecodeError) as exc:
            raise AppError("We could not read the audio duration. Please try a valid 30-45 second audio file.") from exc

    def validate_duration(self, duration: float) -> None:
        if duration < self.settings.min_duration_seconds:
            raise AppError("Recording is too short. Please upload 30-45 seconds of English speech.")
        if duration > self.settings.max_duration_seconds:
            raise AppError("Recording is too long. Please keep it under 45 seconds.")

    def normalize(self, path: Path) -> Path:
        normalized = path.with_suffix(".normalized.wav")
        if not shutil.which(self.settings.ffmpeg_path):
            return path
        command = [
            self.settings.ffmpeg_path,
            "-y",
            "-i",
            str(path),
            "-ac",
            "1",
            "-ar",
            "16000",
            "-vn",
            str(normalized),
        ]
        try:
            subprocess.run(
                command,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=True,
            )
        except subprocess.CalledProcessError as exc:
            raise AppError("We could not normalize this audio file. Please try another supported recording.") from exc
        return normalized

    def cleanup(self, *paths: Path) -> None:
        for path in paths:
            if path.exists() and self.settings.temp_dir in path.parents:
                path.unlink(missing_ok=True)
