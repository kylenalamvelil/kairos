from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import workflows, traces, events, approvals, replay, ingest


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Kairos",
    description="The control layer for autonomous operations.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router, prefix="/v1")
app.include_router(workflows.router, prefix="/v1")
app.include_router(traces.router, prefix="/v1")
app.include_router(events.router, prefix="/v1")
app.include_router(approvals.router, prefix="/v1")
app.include_router(replay.router, prefix="/v1")


@app.get("/health")
@app.get("/v1/health")
async def health():
    return {"status": "operational", "service": "kairos-core"}


@app.get("/v1")
async def api_root():
    return {
        "name": "Kairos API",
        "version": "v1",
        "positioning": "The control layer for autonomous operations",
        "product": "Kairos Trace",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
    }
