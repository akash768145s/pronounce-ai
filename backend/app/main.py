from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.api.routes import router
from app.core.config import get_settings
from app.core.errors import register_error_handlers
from app.middleware.rate_limit import InMemoryRateLimitMiddleware

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Production-oriented API for English pronunciation assessment.",
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(InMemoryRateLimitMiddleware, limit_per_minute=settings.rate_limit_per_minute)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["POST", "DELETE", "GET"],
    allow_headers=["*"],
)

register_error_handlers(app)
app.include_router(router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
