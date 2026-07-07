from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Livo Pronunciation AI"
    environment: str = Field(default="development")
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "https://pronounce-ai-green.vercel.app",
        ]
    )
    max_upload_mb: int = 25
    min_duration_seconds: float = 30
    max_duration_seconds: float = 45
    temp_dir: Path = Path("/tmp/livo-ai")
    ffmpeg_path: str = "ffmpeg"
    ffprobe_path: str = "ffprobe"
    openai_api_key: str | None = None
    llm_model: str = "gpt-4.1-mini"
    enable_whisperx: bool = False
    rate_limit_per_minute: int = 12

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.temp_dir.mkdir(parents=True, exist_ok=True)
    return settings
