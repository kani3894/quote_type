from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
import sqlite3, json, time
import shortuuid
from pathlib import Path

APP_DIR = Path(__file__).parent
DB_PATH = APP_DIR / 'data.sqlite'

app = FastAPI(title="QuoteType")
app.mount("/static", StaticFiles(directory=str(APP_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(APP_DIR / "templates"))

# ---- DB helpers ----

def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS posters (
              id TEXT PRIMARY KEY,
              payload TEXT NOT NULL,
              created_at INTEGER NOT NULL
            )
            """
        )
        conn.commit()

init_db()

# ---- Schemas ----
class PosterPayload(BaseModel):
    text: str = Field(min_length=1, max_length=500)
    author: str | None = None
    meta: str | None = None
    font: str = "Inter, sans-serif"
    weight: str = "400"
    size: int = 52
    line_height: float = 1.2
    align: str = "left"  # left | center | right
    padding: int = 72
    gradient: str = "g-ink"  # matches CSS class on stage container
    shadow: bool = True
    frame: bool = False
    show_author: bool = True
    show_meta: bool = True
    width: int = 1080
    height: int = 1350

class PosterCreate(BaseModel):
    payload: PosterPayload

# ---- Pages ----
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/p/{poster_id}", response_class=HTMLResponse)
async def view_poster(request: Request, poster_id: str):
    with db() as conn:
        row = conn.execute("SELECT payload FROM posters WHERE id = ?", (poster_id,)).fetchone()
    if not row:
        raise HTTPException(404, detail="Poster not found")
    payload = json.loads(row["payload"])  # dict
    return templates.TemplateResponse("view.html", {"request": request, "poster_id": poster_id, "payload": payload})

# ---- API ----
@app.post("/api/posters")
async def create_poster(data: PosterCreate):
    poster_id = shortuuid.uuid()[:8]
    with db() as conn:
        conn.execute(
            "INSERT INTO posters (id, payload, created_at) VALUES (?, ?, ?)",
            (poster_id, json.dumps(data.payload.model_dump()), int(time.time()))
        )
        conn.commit()
    return {"id": poster_id, "url": f"/p/{poster_id}"}

@app.get("/api/posters/{poster_id}")
async def get_poster(poster_id: str):
    with db() as conn:
        row = conn.execute("SELECT payload, created_at FROM posters WHERE id = ?", (poster_id,)).fetchone()
    if not row:
        raise HTTPException(404, detail="Poster not found")
    return {"id": poster_id, "payload": json.loads(row["payload"]), "created_at": row["created_at"]}

@app.get("/api/posters")
async def list_posters(limit: int = 12, offset: int = 0):
    with db() as conn:
        rows = conn.execute(
            "SELECT id, payload, created_at FROM posters ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (limit, offset)
        ).fetchall()
    return [{
        "id": r["id"],
        "payload": json.loads(r["payload"]),
        "created_at": r["created_at"]
    } for r in rows]

# ---- Dev runner ----
# Run: uvicorn main:app --reload --port 8000
