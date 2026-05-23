# Prompt Library — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Windows desktop app (Python + PyQt6) for searching image-generation prompts on PromptHero/Civitai/Reddit, saving them to a local SQLite library with bilingual (RU/EN) auto-tagging.

**Architecture:** Monolithic PyQt6 app. Business logic (scrapers, tagging, translation) in pure-Python modules independent of UI. SQLite for persistence in `%APPDATA%\PromptLibrary\`. Three tabs: Поиск, Библиотека, Настройки.

**Tech Stack:** Python 3.11+, PyQt6, aiohttp, beautifulsoup4, deep-translator, anthropic, openai, pytest, pytest-asyncio, PyInstaller

---

## Project Root

All paths below are relative to `D:\Documents\PromptLibrary\` — a new directory created in Task 1.

## File Structure

```
D:\Documents\PromptLibrary\
├── main.py
├── requirements.txt
├── build.ps1
├── .gitignore
├── settings.py
├── database/
│   ├── __init__.py
│   ├── db.py          # connection + schema
│   └── models.py      # Prompt + Tag CRUD
├── scrapers/
│   ├── __init__.py
│   ├── base.py        # PromptResult dataclass + BaseScraper
│   ├── civitai.py
│   ├── prompthero.py
│   ├── reddit.py
│   └── aggregator.py  # parallel search
├── tagging/
│   ├── __init__.py
│   ├── dictionary.py  # 200-term bilingual seed list
│   ├── local_tagger.py
│   └── ai_tagger.py
├── translation/
│   ├── __init__.py
│   └── translator.py
├── ui/
│   ├── __init__.py
│   ├── main_window.py
│   ├── prompt_card.py
│   ├── save_dialog.py
│   ├── search_tab.py
│   ├── library_tab.py
│   └── settings_tab.py
└── tests/
    ├── test_db.py
    ├── test_models.py
    ├── test_local_tagger.py
    ├── test_ai_tagger.py
    ├── test_translator.py
    ├── test_civitai.py
    ├── test_prompthero.py
    ├── test_reddit.py
    └── test_aggregator.py
```

---

### Task 1: Project setup

**Files:** `requirements.txt`, `.gitignore`, `main.py`, all `__init__.py` files

- [ ] **Step 1: Create directory and git repo**
```powershell
New-Item -ItemType Directory -Path D:\Documents\PromptLibrary
Set-Location D:\Documents\PromptLibrary
git init
```

- [ ] **Step 2: Create `requirements.txt`**
```
PyQt6==6.7.0
aiohttp==3.9.5
beautifulsoup4==4.12.3
deep-translator==1.11.4
anthropic==0.28.0
openai==1.35.0
pytest==8.2.2
pytest-asyncio==0.23.7
pyinstaller==6.8.0
```

- [ ] **Step 3: Create `.gitignore`**
```
__pycache__/
*.pyc
.venv/
dist/
build/
*.spec
```

- [ ] **Step 4: Create venv and install**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

- [ ] **Step 5: Create all package `__init__.py` files**
```powershell
foreach ($d in @("database","scrapers","tagging","translation","ui","tests")) {
    New-Item -ItemType Directory $d -Force
    New-Item -ItemType File "$d\__init__.py" -Force
}
```

- [ ] **Step 6: Create skeleton `main.py`**
```python
import sys
from PyQt6.QtWidgets import QApplication
from database.db import init_db, get_connection
from settings import Settings
from ui.main_window import MainWindow
from ui.search_tab import SearchTab
from ui.library_tab import LibraryTab
from ui.settings_tab import SettingsTab

def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    init_db()
    db = get_connection()
    settings = Settings()
    window = MainWindow()
    window.add_tab(SearchTab(db, settings))
    window.add_tab(LibraryTab(db))
    window.add_tab(SettingsTab(settings))
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
```

- [ ] **Step 7: Commit**
```bash
git add .
git commit -m "chore: project setup"
```

---

### Task 2: Database schema

**Files:** `database/db.py`, `tests/test_db.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_db.py
import sqlite3
from database.db import init_db, get_connection

def test_schema_creates_all_tables(tmp_path):
    db_path = str(tmp_path / "test.db")
    init_db(db_path)
    conn = sqlite3.connect(db_path)
    tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
    conn.close()
    assert tables == {"prompts", "tags", "prompt_tags"}

def test_prompts_columns(tmp_path):
    db_path = str(tmp_path / "test.db")
    init_db(db_path)
    conn = sqlite3.connect(db_path)
    cols = {r[1] for r in conn.execute("PRAGMA table_info(prompts)").fetchall()}
    conn.close()
    assert {"id", "text", "source_url", "source_site", "image_url", "saved_at"} <= cols
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_db.py -v
```
Expected: `ModuleNotFoundError`

- [ ] **Step 3: Implement `database/db.py`**
```python
import sqlite3, os

SCHEMA = """
CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    source_url TEXT,
    source_site TEXT,
    image_url TEXT,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL UNIQUE,
    name_ru TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS prompt_tags (
    prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, tag_id)
);
"""

def get_db_path() -> str:
    folder = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "PromptLibrary")
    os.makedirs(folder, exist_ok=True)
    return os.path.join(folder, "prompts.db")

def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path or get_db_path())
    conn.execute("PRAGMA foreign_keys = ON")
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path: str | None = None) -> None:
    conn = get_connection(db_path)
    conn.executescript(SCHEMA)
    conn.commit()
    conn.close()
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_db.py -v
```
Expected: `2 passed`

- [ ] **Step 5: Commit**
```bash
git add database/db.py tests/test_db.py
git commit -m "feat: database schema"
```

---

### Task 3: Prompt and Tag CRUD

**Files:** `database/models.py`, `tests/test_models.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_models.py
import pytest
from database.db import init_db, get_connection
from database.models import (
    save_prompt, get_prompt_by_id, get_all_prompts, delete_prompt,
    get_or_create_tag, link_tags_to_prompt, get_tags_for_prompt, get_all_tags
)

@pytest.fixture
def db(tmp_path):
    path = str(tmp_path / "test.db")
    init_db(path)
    conn = get_connection(path)
    yield conn
    conn.close()

def test_save_and_get_prompt(db):
    pid = save_prompt(db, text="sunset landscape", source_site="civitai",
                      source_url="https://civitai.com/1", image_url=None)
    assert pid > 0
    row = get_prompt_by_id(db, pid)
    assert row["text"] == "sunset landscape"

def test_delete_prompt(db):
    pid = save_prompt(db, text="delete me", source_site="reddit")
    delete_prompt(db, pid)
    assert get_prompt_by_id(db, pid) is None

def test_get_or_create_tag_idempotent(db):
    t1 = get_or_create_tag(db, "cinematic", "кинематографичный")
    t2 = get_or_create_tag(db, "cinematic", "кинематографичный")
    assert t1 == t2

def test_link_and_get_tags(db):
    pid = save_prompt(db, text="test", source_site="civitai")
    t1 = get_or_create_tag(db, "portrait", "портрет")
    t2 = get_or_create_tag(db, "8k", "8к")
    link_tags_to_prompt(db, pid, [t1, t2])
    tags = get_tags_for_prompt(db, pid)
    assert {t["name_en"] for t in tags} == {"portrait", "8k"}

def test_get_all_prompts_search(db):
    save_prompt(db, text="a cinematic portrait", source_site="civitai")
    save_prompt(db, text="fantasy landscape", source_site="reddit")
    results = get_all_prompts(db, search="portrait")
    assert len(results) == 1
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_models.py -v
```

- [ ] **Step 3: Implement `database/models.py`**
```python
import sqlite3
from typing import Optional

def save_prompt(conn, text: str, source_site: str,
                source_url: str = None, image_url: str = None) -> int:
    cur = conn.execute(
        "INSERT INTO prompts (text, source_site, source_url, image_url) VALUES (?,?,?,?)",
        (text, source_site, source_url, image_url))
    conn.commit()
    return cur.lastrowid

def get_prompt_by_id(conn, prompt_id: int) -> Optional[sqlite3.Row]:
    return conn.execute("SELECT * FROM prompts WHERE id=?", (prompt_id,)).fetchone()

def get_all_prompts(conn, search: str = "", tag_ids: list[int] = None) -> list:
    if tag_ids:
        ph = ",".join("?" * len(tag_ids))
        return conn.execute(
            f"SELECT DISTINCT p.* FROM prompts p JOIN prompt_tags pt ON p.id=pt.prompt_id "
            f"WHERE pt.tag_id IN ({ph}) AND p.text LIKE ? ORDER BY p.saved_at DESC",
            (*tag_ids, f"%{search}%")).fetchall()
    return conn.execute(
        "SELECT * FROM prompts WHERE text LIKE ? ORDER BY saved_at DESC",
        (f"%{search}%",)).fetchall()

def delete_prompt(conn, prompt_id: int) -> None:
    conn.execute("DELETE FROM prompts WHERE id=?", (prompt_id,))
    conn.commit()

def get_or_create_tag(conn, name_en: str, name_ru: str) -> int:
    row = conn.execute("SELECT id FROM tags WHERE name_en=?", (name_en,)).fetchone()
    if row:
        return row["id"]
    cur = conn.execute("INSERT INTO tags (name_en, name_ru) VALUES (?,?)", (name_en, name_ru))
    conn.commit()
    return cur.lastrowid

def link_tags_to_prompt(conn, prompt_id: int, tag_ids: list[int]) -> None:
    conn.executemany(
        "INSERT OR IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES (?,?)",
        [(prompt_id, tid) for tid in tag_ids])
    conn.commit()

def get_tags_for_prompt(conn, prompt_id: int) -> list:
    return conn.execute(
        "SELECT t.* FROM tags t JOIN prompt_tags pt ON t.id=pt.tag_id WHERE pt.prompt_id=?",
        (prompt_id,)).fetchall()

def get_all_tags(conn) -> list:
    return conn.execute("SELECT * FROM tags ORDER BY name_ru").fetchall()
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_models.py -v
```
Expected: `5 passed`

- [ ] **Step 5: Commit**
```bash
git add database/models.py tests/test_models.py
git commit -m "feat: prompt and tag CRUD"
```

---

### Task 4: Settings

**Files:** `settings.py`, `tests/test_settings.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_settings.py
import json
from settings import Settings

def test_defaults():
    s = Settings(config_path=":memory:")
    assert s.claude_api_key == ""
    assert s.use_ai_tagging is True
    assert s.auto_translate is True

def test_save_and_load(tmp_path):
    path = str(tmp_path / "s.json")
    s = Settings(config_path=path)
    s.claude_api_key = "sk-ant-test"
    s.save()
    s2 = Settings(config_path=path)
    assert s2.claude_api_key == "sk-ant-test"

def test_missing_keys_get_defaults(tmp_path):
    path = str(tmp_path / "s.json")
    with open(path, "w") as f:
        json.dump({"claude_api_key": "abc"}, f)
    s = Settings(config_path=path)
    assert s.claude_api_key == "abc"
    assert s.openai_api_key == ""
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_settings.py -v
```

- [ ] **Step 3: Implement `settings.py`**
```python
import json, os
from dataclasses import dataclass, asdict, field

def _default_path() -> str:
    folder = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "PromptLibrary")
    os.makedirs(folder, exist_ok=True)
    return os.path.join(folder, "settings.json")

@dataclass
class Settings:
    claude_api_key: str = ""
    openai_api_key: str = ""
    ai_model: str = "claude-haiku-4-5-20251001"
    use_ai_tagging: bool = True
    auto_translate: bool = True
    config_path: str = field(default_factory=_default_path, repr=False)

    def __post_init__(self):
        if self.config_path != ":memory:":
            self._load()

    def _load(self):
        if not os.path.exists(self.config_path):
            return
        with open(self.config_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for k, v in data.items():
            if hasattr(self, k) and k != "config_path":
                setattr(self, k, v)

    def save(self):
        data = {k: v for k, v in asdict(self).items() if k != "config_path"}
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_settings.py -v
```
Expected: `3 passed`

- [ ] **Step 5: Commit**
```bash
git add settings.py tests/test_settings.py
git commit -m "feat: settings load/save"
```

---

### Task 5: Tag dictionary + local tagger

**Files:** `tagging/dictionary.py`, `tagging/local_tagger.py`, `tests/test_local_tagger.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_local_tagger.py
from tagging.dictionary import SEED_TAGS, find_tag_by_en, find_tag_by_keyword
from tagging.local_tagger import suggest_tags_local

def test_seed_tags_not_empty():
    assert len(SEED_TAGS) >= 50

def test_find_tag_by_en():
    tag = find_tag_by_en("cinematic")
    assert tag is not None
    assert tag["ru"] == "кинематографичный"

def test_find_by_keyword():
    tags = find_tag_by_keyword("cinematic portrait in 8k")
    names = [t["en"] for t in tags]
    assert "cinematic" in names and "portrait" in names and "8k" in names

def test_suggest_local_no_duplicates():
    tags = suggest_tags_local("cinematic cinematic portrait")
    assert len([t["en"] for t in tags]) == len({t["en"] for t in tags})

def test_suggest_local_empty():
    assert suggest_tags_local("") == []
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_local_tagger.py -v
```

- [ ] **Step 3: Implement `tagging/dictionary.py`**
```python
SEED_TAGS: list[dict] = [
    # Styles
    {"en": "cinematic", "ru": "кинематографичный"},
    {"en": "photorealistic", "ru": "фотореализм"},
    {"en": "hyperrealistic", "ru": "гиперреализм"},
    {"en": "fantasy", "ru": "фэнтези"},
    {"en": "sci-fi", "ru": "научная фантастика"},
    {"en": "anime", "ru": "аниме"},
    {"en": "oil painting", "ru": "масляная живопись"},
    {"en": "watercolor", "ru": "акварель"},
    {"en": "digital art", "ru": "цифровое искусство"},
    {"en": "concept art", "ru": "концепт-арт"},
    {"en": "illustration", "ru": "иллюстрация"},
    {"en": "surreal", "ru": "сюрреализм"},
    {"en": "gothic", "ru": "готика"},
    {"en": "steampunk", "ru": "стимпанк"},
    {"en": "cyberpunk", "ru": "киберпанк"},
    {"en": "impressionism", "ru": "импрессионизм"},
    {"en": "abstract", "ru": "абстракция"},
    {"en": "minimalist", "ru": "минимализм"},
    {"en": "baroque", "ru": "барокко"},
    # Lighting
    {"en": "golden hour", "ru": "золотой час"},
    {"en": "soft light", "ru": "мягкий свет"},
    {"en": "dramatic lighting", "ru": "драматическое освещение"},
    {"en": "backlit", "ru": "контровой свет"},
    {"en": "neon lights", "ru": "неоновый свет"},
    {"en": "moonlight", "ru": "лунный свет"},
    {"en": "sunlight", "ru": "солнечный свет"},
    {"en": "candlelight", "ru": "свет свечи"},
    {"en": "studio lighting", "ru": "студийное освещение"},
    {"en": "volumetric lighting", "ru": "объёмный свет"},
    {"en": "rim light", "ru": "краевая подсветка"},
    # Subjects
    {"en": "portrait", "ru": "портрет"},
    {"en": "landscape", "ru": "пейзаж"},
    {"en": "cityscape", "ru": "городской пейзаж"},
    {"en": "architecture", "ru": "архитектура"},
    {"en": "nature", "ru": "природа"},
    {"en": "forest", "ru": "лес"},
    {"en": "ocean", "ru": "океан"},
    {"en": "mountains", "ru": "горы"},
    {"en": "space", "ru": "космос"},
    {"en": "dragon", "ru": "дракон"},
    {"en": "warrior", "ru": "воин"},
    {"en": "woman", "ru": "женщина"},
    {"en": "man", "ru": "мужчина"},
    {"en": "cat", "ru": "кошка"},
    {"en": "wolf", "ru": "волк"},
    {"en": "robot", "ru": "робот"},
    {"en": "castle", "ru": "замок"},
    {"en": "city", "ru": "город"},
    # Technical
    {"en": "8k", "ru": "8к"},
    {"en": "4k", "ru": "4к"},
    {"en": "ultra detailed", "ru": "ультрадетализированный"},
    {"en": "bokeh", "ru": "боке"},
    {"en": "depth of field", "ru": "глубина резкости"},
    {"en": "long exposure", "ru": "длинная выдержка"},
    {"en": "macro", "ru": "макросъёмка"},
    {"en": "wide angle", "ru": "широкоугольный"},
    # Color/Mood
    {"en": "dark", "ru": "тёмный"},
    {"en": "bright", "ru": "яркий"},
    {"en": "colorful", "ru": "красочный"},
    {"en": "monochrome", "ru": "монохромный"},
    {"en": "black and white", "ru": "чёрно-белый"},
    {"en": "vibrant colors", "ru": "насыщенные цвета"},
    {"en": "pastel", "ru": "пастельный"},
    {"en": "neon", "ru": "неоновый"},
    {"en": "atmospheric", "ru": "атмосферный"},
    {"en": "epic", "ru": "эпичный"},
    {"en": "mystical", "ru": "мистический"},
    {"en": "peaceful", "ru": "умиротворённый"},
    # Camera
    {"en": "close-up", "ru": "крупный план"},
    {"en": "aerial view", "ru": "вид с воздуха"},
    {"en": "bird's eye view", "ru": "вид сверху"},
    {"en": "low angle", "ru": "нижний угол"},
    {"en": "symmetrical", "ru": "симметричный"},
]

def find_tag_by_en(name_en: str) -> dict | None:
    for tag in SEED_TAGS:
        if tag["en"].lower() == name_en.lower():
            return tag
    return None

def find_tag_by_keyword(prompt_text: str) -> list[dict]:
    low = prompt_text.lower()
    return [t for t in SEED_TAGS if t["en"].lower() in low]
```

- [ ] **Step 4: Implement `tagging/local_tagger.py`**
```python
from tagging.dictionary import find_tag_by_keyword

def suggest_tags_local(prompt_text: str) -> list[dict]:
    if not prompt_text.strip():
        return []
    seen, result = set(), []
    for tag in find_tag_by_keyword(prompt_text):
        if tag["en"] not in seen:
            seen.add(tag["en"])
            result.append(tag)
    return result
```

- [ ] **Step 5: Run — expect PASS**
```powershell
pytest tests/test_local_tagger.py -v
```
Expected: `5 passed`

- [ ] **Step 6: Commit**
```bash
git add tagging/dictionary.py tagging/local_tagger.py tests/test_local_tagger.py
git commit -m "feat: bilingual tag dictionary and local tagger"
```

---

### Task 6: AI tagger

**Files:** `tagging/ai_tagger.py`, `tests/test_ai_tagger.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_ai_tagger.py
from unittest.mock import patch, MagicMock
from tagging.ai_tagger import suggest_tags_ai

MOCK_TEXT = "portrait|портрет\ncinematic|кинематографичный\nbadline\n8k|8к"

def _mock_claude(text):
    msg = MagicMock()
    msg.content = [MagicMock(text=text)]
    return msg

def test_parses_response():
    with patch("tagging.ai_tagger.anthropic.Anthropic") as M:
        M.return_value.messages.create.return_value = _mock_claude(MOCK_TEXT)
        tags = suggest_tags_ai("dark cinematic portrait", api_key="sk-ant-test")
    assert any(t["en"] == "portrait" and t["ru"] == "портрет" for t in tags)
    assert len(tags) == 3  # badline skipped

def test_returns_empty_on_error():
    with patch("tagging.ai_tagger.anthropic.Anthropic") as M:
        M.return_value.messages.create.side_effect = Exception("fail")
        assert suggest_tags_ai("prompt", api_key="sk-ant-test") == []
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_ai_tagger.py -v
```

- [ ] **Step 3: Implement `tagging/ai_tagger.py`**
```python
import anthropic, openai

_PROMPT = """Given this image generation prompt, suggest 5-10 descriptive tags.
Return ONLY tags, one per line, format: english_tag|russian_translation
No explanations, no numbering.

Prompt: {prompt}"""

def suggest_tags_ai(prompt_text: str, api_key: str, provider: str = "claude",
                    model: str = "claude-haiku-4-5-20251001") -> list[dict]:
    try:
        if provider == "claude":
            return _claude(prompt_text, api_key, model)
        return _openai(prompt_text, api_key)
    except Exception:
        return []

def _claude(prompt_text: str, api_key: str, model: str) -> list[dict]:
    client = anthropic.Anthropic(api_key=api_key)
    msg = client.messages.create(
        model=model, max_tokens=512,
        messages=[{"role": "user", "content": _PROMPT.format(prompt=prompt_text)}])
    return _parse(msg.content[0].text)

def _openai(prompt_text: str, api_key: str) -> list[dict]:
    client = openai.OpenAI(api_key=api_key)
    resp = client.chat.completions.create(
        model="gpt-4o-mini", max_tokens=512,
        messages=[{"role": "user", "content": _PROMPT.format(prompt=prompt_text)}])
    return _parse(resp.choices[0].message.content)

def _parse(text: str) -> list[dict]:
    tags = []
    for line in text.strip().splitlines():
        parts = line.strip().split("|")
        if len(parts) == 2:
            en, ru = parts[0].strip(), parts[1].strip()
            if en and ru:
                tags.append({"en": en, "ru": ru})
    return tags
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_ai_tagger.py -v
```
Expected: `2 passed`

- [ ] **Step 5: Commit**
```bash
git add tagging/ai_tagger.py tests/test_ai_tagger.py
git commit -m "feat: AI tagger (Claude + OpenAI)"
```

---

### Task 7: Translation service

**Files:** `translation/translator.py`, `tests/test_translator.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_translator.py
from unittest.mock import patch, MagicMock
from translation.translator import translate_to_english, is_english

def test_is_english_true():
    assert is_english("beautiful sunset over mountains") is True

def test_is_english_false():
    assert is_english("красивый закат над горами") is False

def test_no_translation_if_already_english():
    result, translated = translate_to_english("cinematic portrait")
    assert translated is False
    assert result == "cinematic portrait"

def test_uses_google_when_no_api_key():
    with patch("translation.translator.GoogleTranslator") as M:
        M.return_value.translate.return_value = "sunset over mountains"
        result, translated = translate_to_english("закат над горами", api_key=None)
    assert result == "sunset over mountains"
    assert translated is True

def test_uses_claude_when_api_key_given():
    with patch("translation.translator.anthropic.Anthropic") as M:
        msg = MagicMock()
        msg.content = [MagicMock(text="sunset over mountains")]
        M.return_value.messages.create.return_value = msg
        result, translated = translate_to_english("закат над горами", api_key="sk-ant-test")
    assert result == "sunset over mountains"
    assert translated is True
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_translator.py -v
```

- [ ] **Step 3: Implement `translation/translator.py`**
```python
import anthropic
from deep_translator import GoogleTranslator

def is_english(text: str) -> bool:
    non_ascii = sum(1 for c in text if ord(c) > 127)
    return non_ascii / max(len(text), 1) < 0.1

def translate_to_english(text: str, api_key: str = None,
                          model: str = "claude-haiku-4-5-20251001") -> tuple[str, bool]:
    if is_english(text):
        return text, False
    if api_key:
        client = anthropic.Anthropic(api_key=api_key)
        msg = client.messages.create(
            model=model, max_tokens=256,
            messages=[{"role": "user",
                        "content": f"Translate to English. Return ONLY the translation:\n{text}"}])
        return msg.content[0].text.strip(), True
    return GoogleTranslator(source="auto", target="en").translate(text), True
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_translator.py -v
```
Expected: `5 passed`

- [ ] **Step 5: Commit**
```bash
git add translation/translator.py tests/test_translator.py
git commit -m "feat: bilingual translation service"
```

---

### Task 8: Scrapers — base + Civitai

**Files:** `scrapers/base.py`, `scrapers/civitai.py`, `tests/test_civitai.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_civitai.py
import pytest
from unittest.mock import patch, AsyncMock
from scrapers.civitai import CivitaiScraper
from scrapers.base import PromptResult

MOCK_DATA = {"items": [
    {"meta": {"prompt": "cinematic landscape 8k"}, "url": "https://img.civitai.com/a.jpg", "id": 1},
    {"meta": {}, "url": "https://img.civitai.com/b.jpg", "id": 2},  # no prompt, skip
]}

def _mock_session(status=200, json_data=None, exc=None):
    mock_resp = AsyncMock()
    mock_resp.status = status
    mock_resp.json = AsyncMock(return_value=json_data)
    mock_resp.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_resp.__aexit__ = AsyncMock(return_value=False)
    mock_session = AsyncMock()
    if exc:
        mock_session.get.side_effect = exc
    else:
        mock_session.get.return_value = mock_resp
    mock_session.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session.__aexit__ = AsyncMock(return_value=False)
    return mock_session

@pytest.mark.asyncio
async def test_civitai_parses_results():
    with patch("scrapers.civitai.aiohttp.ClientSession", return_value=_mock_session(json_data=MOCK_DATA)):
        results = await CivitaiScraper().search("landscape")
    assert len(results) == 1
    assert isinstance(results[0], PromptResult)
    assert results[0].source_site == "civitai"

@pytest.mark.asyncio
async def test_civitai_empty_on_error():
    with patch("scrapers.civitai.aiohttp.ClientSession", return_value=_mock_session(exc=Exception("net"))):
        assert await CivitaiScraper().search("x") == []
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_civitai.py -v
```

- [ ] **Step 3: Implement `scrapers/base.py`**
```python
from dataclasses import dataclass
from typing import Optional
from abc import ABC, abstractmethod

@dataclass
class PromptResult:
    text: str
    source_site: str
    source_url: Optional[str] = None
    image_url: Optional[str] = None

class BaseScraper(ABC):
    @abstractmethod
    async def search(self, query: str) -> list[PromptResult]:
        pass
```

- [ ] **Step 4: Implement `scrapers/civitai.py`**
```python
import aiohttp
from scrapers.base import BaseScraper, PromptResult

class CivitaiScraper(BaseScraper):
    async def search(self, query: str) -> list[PromptResult]:
        params = {"limit": 20, "query": query, "sort": "Most Reactions", "nsfw": "false"}
        try:
            async with aiohttp.ClientSession() as s:
                async with s.get("https://civitai.com/api/v1/images", params=params,
                                  timeout=aiohttp.ClientTimeout(total=10)) as r:
                    if r.status != 200:
                        return []
                    data = await r.json()
        except Exception:
            return []
        results = []
        for item in data.get("items", []):
            text = item.get("meta", {}).get("prompt", "")
            if not text:
                continue
            results.append(PromptResult(
                text=text, source_site="civitai",
                source_url=f"https://civitai.com/images/{item.get('id','')}",
                image_url=item.get("url")))
        return results
```

- [ ] **Step 5: Run — expect PASS**
```powershell
pytest tests/test_civitai.py -v
```
Expected: `2 passed`

- [ ] **Step 6: Commit**
```bash
git add scrapers/base.py scrapers/civitai.py tests/test_civitai.py
git commit -m "feat: base scraper + Civitai"
```

---

### Task 9: PromptHero scraper

**Files:** `scrapers/prompthero.py`, `tests/test_prompthero.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_prompthero.py
import pytest
from unittest.mock import patch, AsyncMock
from scrapers.prompthero import PromptHeroScraper

MOCK_HTML = """<html><body>
<article class="prompt-card">
  <p class="prompt-text">dragon over mountains, fantasy, 8k</p>
  <img src="https://cdn.prompthero.com/img1.jpg"/>
  <a href="/prompt/abc">View</a>
</article>
<article class="prompt-card">
  <p class="prompt-text">cyberpunk city, neon lights</p>
  <img src="https://cdn.prompthero.com/img2.jpg"/>
  <a href="/prompt/def">View</a>
</article></body></html>"""

def _mock_session(html=None, exc=None):
    mock_resp = AsyncMock()
    mock_resp.status = 200
    mock_resp.text = AsyncMock(return_value=html)
    mock_resp.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_resp.__aexit__ = AsyncMock(return_value=False)
    mock_s = AsyncMock()
    if exc:
        mock_s.get.side_effect = exc
    else:
        mock_s.get.return_value = mock_resp
    mock_s.__aenter__ = AsyncMock(return_value=mock_s)
    mock_s.__aexit__ = AsyncMock(return_value=False)
    return mock_s

@pytest.mark.asyncio
async def test_parses_results():
    with patch("scrapers.prompthero.aiohttp.ClientSession", return_value=_mock_session(MOCK_HTML)):
        results = await PromptHeroScraper().search("dragon")
    assert len(results) == 2
    assert results[0].source_site == "prompthero"
    assert "dragon" in results[0].text

@pytest.mark.asyncio
async def test_empty_on_error():
    with patch("scrapers.prompthero.aiohttp.ClientSession", return_value=_mock_session(exc=Exception("net"))):
        assert await PromptHeroScraper().search("x") == []
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_prompthero.py -v
```

- [ ] **Step 3: Implement `scrapers/prompthero.py`**

Note: CSS selectors below match current PromptHero structure and may need updating if site redesigns.

```python
import aiohttp
from bs4 import BeautifulSoup
from scrapers.base import BaseScraper, PromptResult

BASE = "https://prompthero.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

class PromptHeroScraper(BaseScraper):
    async def search(self, query: str) -> list[PromptResult]:
        try:
            async with aiohttp.ClientSession() as s:
                async with s.get(f"{BASE}/search", params={"q": query}, headers=HEADERS,
                                  timeout=aiohttp.ClientTimeout(total=15)) as r:
                    if r.status != 200:
                        return []
                    html = await r.text()
        except Exception:
            return []
        soup = BeautifulSoup(html, "html.parser")
        results = []
        for card in soup.select("article.prompt-card"):
            el = card.select_one("p.prompt-text")
            if not el:
                continue
            img = card.select_one("img")
            link = card.select_one("a[href^='/prompt/']")
            results.append(PromptResult(
                text=el.get_text(strip=True),
                source_site="prompthero",
                source_url=BASE + link.get("href") if link else None,
                image_url=img.get("src") if img else None))
        return results
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_prompthero.py -v
```
Expected: `2 passed`

- [ ] **Step 5: Commit**
```bash
git add scrapers/prompthero.py tests/test_prompthero.py
git commit -m "feat: PromptHero HTML scraper"
```

---

### Task 10: Reddit scraper

**Files:** `scrapers/reddit.py`, `tests/test_reddit.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_reddit.py
import pytest
from unittest.mock import patch, AsyncMock
from scrapers.reddit import RedditScraper

MOCK_JSON = {"data": {"children": [
    {"data": {"selftext": "photorealistic portrait, golden hour, bokeh 8k",
              "title": "My prompt", "url": "https://reddit.com/r/SD/abc",
              "thumbnail": "https://i.redd.it/t.jpg", "subreddit": "StableDiffusion"}},
    {"data": {"selftext": "", "title": "No text", "url": "https://reddit.com/r/SD/def",
              "thumbnail": "self", "subreddit": "StableDiffusion"}},
]}}

def _mock_session(json_data=None, exc=None):
    mock_resp = AsyncMock()
    mock_resp.status = 200
    mock_resp.json = AsyncMock(return_value=json_data)
    mock_resp.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_resp.__aexit__ = AsyncMock(return_value=False)
    mock_s = AsyncMock()
    if exc:
        mock_s.get.side_effect = exc
    else:
        mock_s.get.return_value = mock_resp
    mock_s.__aenter__ = AsyncMock(return_value=mock_s)
    mock_s.__aexit__ = AsyncMock(return_value=False)
    return mock_s

@pytest.mark.asyncio
async def test_parses_results():
    with patch("scrapers.reddit.aiohttp.ClientSession", return_value=_mock_session(MOCK_JSON)):
        results = await RedditScraper().search("portrait")
    assert len(results) == 1
    assert results[0].source_site == "reddit"

@pytest.mark.asyncio
async def test_empty_on_error():
    with patch("scrapers.reddit.aiohttp.ClientSession", return_value=_mock_session(exc=Exception("t"))):
        assert await RedditScraper().search("x") == []
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_reddit.py -v
```

- [ ] **Step 3: Implement `scrapers/reddit.py`**
```python
import aiohttp
from scrapers.base import BaseScraper, PromptResult

SUBREDDITS = ["StableDiffusion", "midjourney", "PromptDesign", "aiArt"]
HEADERS = {"User-Agent": "PromptLibrary/1.0"}

class RedditScraper(BaseScraper):
    async def search(self, query: str) -> list[PromptResult]:
        results = []
        try:
            async with aiohttp.ClientSession(headers=HEADERS) as s:
                for sub in SUBREDDITS:
                    try:
                        async with s.get(
                            f"https://www.reddit.com/r/{sub}/search.json",
                            params={"q": query, "restrict_sr": "1", "sort": "relevance", "limit": 10},
                            timeout=aiohttp.ClientTimeout(total=10)) as r:
                            if r.status != 200:
                                continue
                            data = await r.json()
                            for child in data.get("data", {}).get("children", []):
                                post = child.get("data", {})
                                text = post.get("selftext", "").strip()
                                if not text or len(text) < 20:
                                    continue
                                thumb = post.get("thumbnail", "")
                                results.append(PromptResult(
                                    text=text, source_site="reddit",
                                    source_url=post.get("url"),
                                    image_url=thumb if thumb.startswith("http") else None))
                    except Exception:
                        continue
        except Exception:
            return []
        return results
```

- [ ] **Step 4: Run — expect PASS**
```powershell
pytest tests/test_reddit.py -v
```
Expected: `2 passed`

- [ ] **Step 5: Commit**
```bash
git add scrapers/reddit.py tests/test_reddit.py
git commit -m "feat: Reddit scraper"
```

---

### Task 11: Search aggregator

**Files:** `scrapers/aggregator.py`, `tests/test_aggregator.py`

- [ ] **Step 1: Write failing tests**
```python
# tests/test_aggregator.py
import pytest
from unittest.mock import AsyncMock
from scrapers.aggregator import SearchAggregator
from scrapers.base import PromptResult

def _results(site, texts):
    return [PromptResult(text=t, source_site=site, source_url=f"https://{site}/{i}")
            for i, t in enumerate(texts)]

@pytest.mark.asyncio
async def test_combines_results():
    agg = SearchAggregator(sites=["civitai", "reddit"])
    agg.civitai.search = AsyncMock(return_value=_results("civitai", ["a"]))
    agg.reddit.search = AsyncMock(return_value=_results("reddit", ["b"]))
    results = await agg.search("test")
    assert len(results) == 2
    assert {r.source_site for r in results} == {"civitai", "reddit"}

@pytest.mark.asyncio
async def test_deduplicates_by_url():
    agg = SearchAggregator(sites=["civitai"])
    dup = [PromptResult(text="x", source_site="civitai", source_url="https://civitai/1")] * 2
    agg.civitai.search = AsyncMock(return_value=dup)
    results = await agg.search("test")
    assert len(results) == 1

@pytest.mark.asyncio
async def test_continues_on_failure():
    agg = SearchAggregator(sites=["civitai", "reddit"])
    agg.civitai.search = AsyncMock(side_effect=Exception("fail"))
    agg.reddit.search = AsyncMock(return_value=_results("reddit", ["ok"]))
    results = await agg.search("test")
    assert len(results) == 1
```

- [ ] **Step 2: Run — expect FAIL**
```powershell
pytest tests/test_aggregator.py -v
```

- [ ] **Step 3: Implement `scrapers/aggregator.py`**
```python
import asyncio
from scrapers.base import PromptResult
from scrapers.civitai import CivitaiScraper
from scrapers.prompthero import PromptHeroScraper
from scrapers.reddit import RedditScraper

ALL_SITES = ["civitai", "prompthero", "reddit"]

class SearchAggregator:
    def __init__(self, sites: list[str] = None):
        self.sites = sites or ALL_SITES
        self.civitai = CivitaiScraper()
        self.prompthero = PromptHeroScraper()
        self.reddit = RedditScraper()

    async def search(self, query: str) -> list[PromptResult]:
        tasks = []
        if "civitai" in self.sites:
            tasks.append(self._safe(self.civitai, query))
        if "prompthero" in self.sites:
            tasks.append(self._safe(self.prompthero, query))
        if "reddit" in self.sites:
            tasks.append(self._safe(self.reddit, query))
        all_results = []
        for batch in await asyncio.gather(*tasks):
            all_results.extend(batch)
        return self._dedup(all_results)

    async def _safe(self, scraper, query: str) -> list[PromptResult]:
        try:
            return await scraper.search(query)
        except Exception:
            return []

    def _dedup(self, results: list[PromptResult]) -> list[PromptResult]:
        seen, unique = set(), []
        for r in results:
            key = r.source_url or r.text[:80]
            if key not in seen:
                seen.add(key)
                unique.append(r)
        return unique
```

- [ ] **Step 4: Run all tests**
```powershell
pytest tests/ -v
```
Expected: all tests pass

- [ ] **Step 5: Commit**
```bash
git add scrapers/aggregator.py tests/test_aggregator.py
git commit -m "feat: parallel search aggregator"
```

---

### Task 12: Main window

No TDD for UI — manual testing instructions at each step.

**Files:** `ui/main_window.py`

- [ ] **Step 1: Implement `ui/main_window.py`**
```python
from PyQt6.QtWidgets import QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QPushButton, QStackedWidget, QLabel
from PyQt6.QtGui import QFont

class SidebarButton(QPushButton):
    def __init__(self, text: str, parent=None):
        super().__init__(text, parent)
        self.setCheckable(True)
        self.setFixedHeight(48)
        self.setFont(QFont("Segoe UI", 10))
        self.setStyleSheet("""
            QPushButton { background:transparent; border:none; border-left:3px solid transparent;
                          color:#aaa; text-align:left; padding-left:16px; }
            QPushButton:checked { color:#fff; border-left:3px solid #7c5cfc; background:rgba(124,92,252,0.15); }
            QPushButton:hover:!checked { background:rgba(255,255,255,0.05); color:#ddd; }
        """)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Prompt Library")
        self.setMinimumSize(1100, 700)
        self._setup_ui()
        self._nav_buttons[0].setChecked(True)

    def _setup_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        layout = QHBoxLayout(central)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        sidebar = QWidget()
        sidebar.setFixedWidth(180)
        sidebar.setStyleSheet("background:#1a1a2e;")
        sb = QVBoxLayout(sidebar)
        sb.setContentsMargins(0, 16, 0, 0)
        sb.setSpacing(4)

        logo = QLabel("Prompt Library")
        logo.setFont(QFont("Segoe UI", 12, QFont.Weight.Bold))
        logo.setStyleSheet("color:#fff; padding-left:16px; padding-bottom:16px;")
        sb.addWidget(logo)

        self.stack = QStackedWidget()
        self._nav_buttons = []
        for label, idx in [("Поиск", 0), ("Библиотека", 1), ("Настройки", 2)]:
            btn = SidebarButton(label)
            btn.clicked.connect(lambda _, i=idx, b=btn: self._switch(i, b))
            sb.addWidget(btn)
            self._nav_buttons.append(btn)
        sb.addStretch()

        self.stack.setStyleSheet("background:#16213e;")
        layout.addWidget(sidebar)
        layout.addWidget(self.stack)
        self.setStyleSheet("background:#16213e; color:#eee;")

    def _switch(self, index: int, btn: SidebarButton):
        for b in self._nav_buttons:
            b.setChecked(False)
        btn.setChecked(True)
        self.stack.setCurrentIndex(index)

    def add_tab(self, widget: QWidget):
        self.stack.addWidget(widget)
```

- [ ] **Step 2: Commit**
```bash
git add ui/main_window.py
git commit -m "feat: main window with sidebar"
```

---

### Task 13: Prompt card widget

**Files:** `ui/prompt_card.py`

- [ ] **Step 1: Implement `ui/prompt_card.py`**
```python
from PyQt6.QtWidgets import QFrame, QVBoxLayout, QHBoxLayout, QLabel, QPushButton
from PyQt6.QtCore import pyqtSignal
from scrapers.base import PromptResult

SITE_COLORS = {"civitai": "#1d7a8a", "prompthero": "#7a3d8a", "reddit": "#8a3d1d"}

class PromptCard(QFrame):
    save_clicked = pyqtSignal(object)
    copy_clicked = pyqtSignal(str)

    def __init__(self, result: PromptResult, show_save: bool = True, parent=None):
        super().__init__(parent)
        self.result = result
        self.setFrameShape(QFrame.Shape.StyledPanel)
        self.setStyleSheet("""
            QFrame { background:#1e2a45; border-radius:8px; border:1px solid #2a3a5a; }
            QFrame:hover { border:1px solid #7c5cfc; }
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(8)

        text = result.text[:200] + ("…" if len(result.text) > 200 else "")
        lbl = QLabel(text)
        lbl.setWordWrap(True)
        lbl.setStyleSheet("color:#ddd; font-size:13px;")

        site = result.source_site or "unknown"
        badge = QLabel(site.upper())
        badge.setStyleSheet(f"background:{SITE_COLORS.get(site,'#555')}; color:#fff; "
                            f"border-radius:4px; padding:2px 6px; font-size:10px;")
        badge.setFixedWidth(90)

        row = QHBoxLayout()
        row.addWidget(badge)
        row.addStretch()

        copy_btn = QPushButton("Копировать")
        copy_btn.setStyleSheet("background:#2a3a5a; color:#fff; border:none; border-radius:5px; padding:5px 12px;")
        copy_btn.clicked.connect(lambda: self.copy_clicked.emit(result.text))
        row.addWidget(copy_btn)

        if show_save:
            save_btn = QPushButton("Сохранить")
            save_btn.setStyleSheet("background:#7c5cfc; color:#fff; border:none; border-radius:5px; padding:5px 12px;")
            save_btn.clicked.connect(lambda: self.save_clicked.emit(result))
            row.addWidget(save_btn)

        layout.addWidget(lbl)
        layout.addLayout(row)
```

- [ ] **Step 2: Commit**
```bash
git add ui/prompt_card.py
git commit -m "feat: prompt card widget"
```

---

### Task 14: Save dialog

**Files:** `ui/save_dialog.py`

- [ ] **Step 1: Implement `ui/save_dialog.py`**
```python
from PyQt6.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
                               QPushButton, QTextEdit, QWidget)
from PyQt6.QtCore import Qt

class TagChip(QPushButton):
    def __init__(self, tag: dict, parent=None):
        super().__init__(tag["ru"], parent)
        self.tag = tag
        self.setCheckable(True)
        self.setChecked(True)
        self.toggled.connect(self._style)
        self._style()

    def _style(self):
        if self.isChecked():
            self.setStyleSheet("background:#7c5cfc; color:#fff; border:none; border-radius:12px; padding:4px 10px;")
        else:
            self.setStyleSheet("background:#2a3a5a; color:#888; border:none; border-radius:12px; padding:4px 10px;")

class SaveDialog(QDialog):
    def __init__(self, prompt_text: str, suggested_tags: list[dict], parent=None):
        super().__init__(parent)
        self.setWindowTitle("Сохранить промпт")
        self.setMinimumWidth(520)
        self.setStyleSheet("background:#16213e; color:#eee;")
        self._chips: list[TagChip] = []
        layout = QVBoxLayout(self)
        layout.setSpacing(12)
        layout.setContentsMargins(20, 20, 20, 20)

        layout.addWidget(QLabel("Текст промпта:"))
        tv = QTextEdit(prompt_text)
        tv.setReadOnly(True)
        tv.setMaximumHeight(90)
        tv.setStyleSheet("background:#1e2a45; color:#ddd; border-radius:6px; padding:6px;")
        layout.addWidget(tv)

        layout.addWidget(QLabel("Теги:"))
        chips_w = QWidget()
        self._chips_layout = QHBoxLayout(chips_w)
        self._chips_layout.setContentsMargins(0, 0, 0, 0)
        self._chips_layout.setSpacing(6)
        self._chips_layout.setAlignment(Qt.AlignmentFlag.AlignLeft)
        for tag in suggested_tags:
            chip = TagChip(tag)
            self._chips.append(chip)
            self._chips_layout.addWidget(chip)
        layout.addWidget(chips_w)

        add_row = QHBoxLayout()
        self._en = QLineEdit(); self._en.setPlaceholderText("Тег (англ.)")
        self._en.setStyleSheet("background:#1e2a45; color:#fff; border-radius:4px; padding:4px;")
        self._ru = QLineEdit(); self._ru.setPlaceholderText("Тег (рус.)")
        self._ru.setStyleSheet("background:#1e2a45; color:#fff; border-radius:4px; padding:4px;")
        add_btn = QPushButton("Добавить")
        add_btn.setStyleSheet("background:#2a3a5a; color:#fff; border:none; border-radius:4px; padding:4px 10px;")
        add_btn.clicked.connect(self._add_tag)
        add_row.addWidget(self._en); add_row.addWidget(self._ru); add_row.addWidget(add_btn)
        layout.addLayout(add_row)

        btns = QHBoxLayout(); btns.addStretch()
        cancel = QPushButton("Отмена")
        cancel.setStyleSheet("background:#2a3a5a; color:#fff; border:none; border-radius:5px; padding:8px 20px;")
        cancel.clicked.connect(self.reject)
        ok = QPushButton("Сохранить")
        ok.setStyleSheet("background:#7c5cfc; color:#fff; border:none; border-radius:5px; padding:8px 20px;")
        ok.clicked.connect(self.accept)
        btns.addWidget(cancel); btns.addWidget(ok)
        layout.addLayout(btns)

    def _add_tag(self):
        en, ru = self._en.text().strip(), self._ru.text().strip()
        if en and ru:
            chip = TagChip({"en": en, "ru": ru})
            self._chips.append(chip)
            self._chips_layout.addWidget(chip)
            self._en.clear(); self._ru.clear()

    def get_selected_tags(self) -> list[dict]:
        return [c.tag for c in self._chips if c.isChecked()]
```

- [ ] **Step 2: Commit**
```bash
git add ui/save_dialog.py
git commit -m "feat: save dialog with tag chips"
```

---

### Task 15: Search tab

**Files:** `ui/search_tab.py`

- [ ] **Step 1: Implement `ui/search_tab.py`**
```python
import asyncio, threading
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLineEdit,
                               QPushButton, QCheckBox, QScrollArea, QLabel, QApplication)
from PyQt6.QtCore import QObject, pyqtSignal
from scrapers.aggregator import SearchAggregator, ALL_SITES
from scrapers.base import PromptResult
from translation.translator import translate_to_english
from tagging.local_tagger import suggest_tags_local
from tagging.ai_tagger import suggest_tags_ai
from database.models import save_prompt, get_or_create_tag, link_tags_to_prompt
from ui.prompt_card import PromptCard
from ui.save_dialog import SaveDialog

class _Worker(QObject):
    done = pyqtSignal(list)
    error = pyqtSignal(str)
    def __init__(self, query, sites, api_key):
        super().__init__()
        self.query, self.sites, self.api_key = query, sites, api_key
    def run(self):
        try:
            en, _ = translate_to_english(self.query, self.api_key)
            self.done.emit(asyncio.run(SearchAggregator(self.sites).search(en)))
        except Exception as e:
            self.error.emit(str(e))

class SearchTab(QWidget):
    def __init__(self, db_conn, settings, parent=None):
        super().__init__(parent)
        self.db, self.settings = db_conn, settings
        self._setup_ui()

    def _setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(10)

        row = QHBoxLayout()
        self.q = QLineEdit()
        self.q.setPlaceholderText("Введите запрос на русском или английском…")
        self.q.setStyleSheet("background:#1e2a45; color:#fff; border-radius:8px; padding:10px; font-size:14px; border:1px solid #2a3a5a;")
        self.q.returnPressed.connect(self._search)
        self.btn = QPushButton("Найти")
        self.btn.setStyleSheet("background:#7c5cfc; color:#fff; border:none; border-radius:8px; padding:10px 24px; font-size:14px;")
        self.btn.clicked.connect(self._search)
        row.addWidget(self.q); row.addWidget(self.btn)

        src_row = QHBoxLayout()
        src_row.addWidget(QLabel("Источники:"))
        self._checks = {}
        for s in ALL_SITES:
            cb = QCheckBox(s.capitalize()); cb.setChecked(True)
            cb.setStyleSheet("color:#ccc;")
            self._checks[s] = cb; src_row.addWidget(cb)
        src_row.addStretch()

        self.status = QLabel("")
        self.status.setStyleSheet("color:#888; font-size:12px;")

        scroll = QScrollArea(); scroll.setWidgetResizable(True); scroll.setStyleSheet("border:none;")
        self._rc = QWidget()
        self._rl = QVBoxLayout(self._rc)
        self._rl.setSpacing(10); self._rl.addStretch()
        scroll.setWidget(self._rc)

        layout.addLayout(row); layout.addLayout(src_row)
        layout.addWidget(self.status); layout.addWidget(scroll)

    def _search(self):
        q = self.q.text().strip()
        if not q: return
        sites = [s for s, cb in self._checks.items() if cb.isChecked()]
        if not sites:
            self.status.setText("Выберите источник"); return
        self.btn.setEnabled(False); self.status.setText("Поиск…")
        self._clear()
        w = _Worker(q, sites, self.settings.claude_api_key or None)
        w.done.connect(self._on_results); w.error.connect(self._on_error)
        self._w = w
        threading.Thread(target=w.run, daemon=True).start()

    def _on_results(self, results):
        self.btn.setEnabled(True)
        self.status.setText(f"Найдено: {len(results)}")
        self._clear()
        for r in results:
            card = PromptCard(r, show_save=True)
            card.save_clicked.connect(self._save)
            card.copy_clicked.connect(lambda t: QApplication.clipboard().setText(t))
            self._rl.insertWidget(self._rl.count() - 1, card)

    def _on_error(self, msg):
        self.btn.setEnabled(True); self.status.setText(f"Ошибка: {msg}")

    def _clear(self):
        while self._rl.count() > 1:
            item = self._rl.takeAt(0)
            if item.widget(): item.widget().deleteLater()

    def _save(self, result: PromptResult):
        local = suggest_tags_local(result.text)
        ai = []
        if self.settings.use_ai_tagging and self.settings.claude_api_key:
            ai = suggest_tags_ai(result.text, self.settings.claude_api_key,
                                  model=self.settings.ai_model)
        combined = {t["en"]: t for t in local + ai}
        dlg = SaveDialog(result.text, list(combined.values()), self)
        if dlg.exec():
            tags = dlg.get_selected_tags()
            pid = save_prompt(self.db, result.text, result.source_site,
                               result.source_url, result.image_url)
            ids = [get_or_create_tag(self.db, t["en"], t["ru"]) for t in tags]
            link_tags_to_prompt(self.db, pid, ids)
            self.status.setText("Сохранено в библиотеку")
```

- [ ] **Step 2: Commit**
```bash
git add ui/search_tab.py
git commit -m "feat: search tab"
```

---

### Task 16: Library tab

**Files:** `ui/library_tab.py`

- [ ] **Step 1: Implement `ui/library_tab.py`**
```python
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLineEdit, QPushButton,
                               QScrollArea, QLabel, QListWidget, QListWidgetItem,
                               QSplitter, QApplication)
from PyQt6.QtCore import Qt
from database.models import get_all_prompts, get_all_tags, get_tags_for_prompt
from scrapers.base import PromptResult
from ui.prompt_card import PromptCard

class LibraryTab(QWidget):
    def __init__(self, db_conn, parent=None):
        super().__init__(parent)
        self.db = db_conn
        self._tag_ids: list[int] = []
        self._setup_ui()
        self.refresh()

    def _setup_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        sp = QSplitter(Qt.Orientation.Horizontal)

        tag_panel = QWidget()
        tag_panel.setFixedWidth(200)
        tag_panel.setStyleSheet("background:#1a1a2e;")
        tl = QVBoxLayout(tag_panel)
        tl.setContentsMargins(12, 12, 12, 12)
        tl.addWidget(QLabel("Теги:"))
        self.tag_list = QListWidget()
        self.tag_list.setSelectionMode(QListWidget.SelectionMode.MultiSelection)
        self.tag_list.setStyleSheet("background:#1e2a45; color:#ccc; border:none; border-radius:6px;")
        self.tag_list.itemSelectionChanged.connect(self._filter)
        tl.addWidget(self.tag_list)
        clear = QPushButton("Сбросить")
        clear.setStyleSheet("background:#2a3a5a; color:#fff; border:none; border-radius:4px; padding:6px;")
        clear.clicked.connect(self._clear_filter)
        tl.addWidget(clear)

        right = QWidget()
        rl = QVBoxLayout(right)
        rl.setContentsMargins(16, 16, 16, 16); rl.setSpacing(10)
        self.search = QLineEdit()
        self.search.setPlaceholderText("Поиск по тексту…")
        self.search.setStyleSheet("background:#1e2a45; color:#fff; border-radius:6px; padding:8px; border:1px solid #2a3a5a;")
        self.search.textChanged.connect(self._load_prompts)
        self.count = QLabel("")
        self.count.setStyleSheet("color:#888; font-size:12px;")
        scroll = QScrollArea(); scroll.setWidgetResizable(True); scroll.setStyleSheet("border:none;")
        self._rc = QWidget()
        self._rl = QVBoxLayout(self._rc); self._rl.setSpacing(10); self._rl.addStretch()
        scroll.setWidget(self._rc)
        rl.addWidget(self.search); rl.addWidget(self.count); rl.addWidget(scroll)

        sp.addWidget(tag_panel); sp.addWidget(right)
        layout.addWidget(sp)

    def refresh(self):
        self.tag_list.clear()
        for tag in get_all_tags(self.db):
            item = QListWidgetItem(tag["name_ru"])
            item.setData(Qt.ItemDataRole.UserRole, tag["id"])
            self.tag_list.addItem(item)
        self._load_prompts()

    def _load_prompts(self):
        while self._rl.count() > 1:
            item = self._rl.takeAt(0)
            if item.widget(): item.widget().deleteLater()
        rows = get_all_prompts(self.db, search=self.search.text(), tag_ids=self._tag_ids or None)
        self.count.setText(f"Промптов: {len(rows)}")
        for row in rows:
            card = PromptCard(PromptResult(row["text"], row["source_site"],
                                           row["source_url"], row["image_url"]), show_save=False)
            card.copy_clicked.connect(lambda t: QApplication.clipboard().setText(t))
            self._rl.insertWidget(self._rl.count() - 1, card)

    def _filter(self):
        self._tag_ids = [i.data(Qt.ItemDataRole.UserRole) for i in self.tag_list.selectedItems()]
        self._load_prompts()

    def _clear_filter(self):
        self.tag_list.clearSelection(); self._tag_ids = []; self._load_prompts()
```

- [ ] **Step 2: Commit**
```bash
git add ui/library_tab.py
git commit -m "feat: library tab"
```

---

### Task 17: Settings tab

**Files:** `ui/settings_tab.py`

- [ ] **Step 1: Implement `ui/settings_tab.py`**
```python
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QFormLayout, QLineEdit,
                               QComboBox, QCheckBox, QPushButton, QLabel, QGroupBox)
from PyQt6.QtCore import Qt

class SettingsTab(QWidget):
    def __init__(self, settings, parent=None):
        super().__init__(parent)
        self.settings = settings
        layout = QVBoxLayout(self)
        layout.setContentsMargins(32, 32, 32, 32); layout.setSpacing(20)
        layout.setAlignment(Qt.AlignmentFlag.AlignTop)

        inp = "background:#1e2a45; color:#fff; border-radius:6px; padding:8px; border:1px solid #2a3a5a;"
        grp_style = "QGroupBox{color:#aaa; border:1px solid #2a3a5a; border-radius:8px; padding:16px; margin-top:8px;}"

        api = QGroupBox("API Ключи"); api.setStyleSheet(grp_style)
        af = QFormLayout(api)
        self.claude_k = QLineEdit(settings.claude_api_key)
        self.claude_k.setEchoMode(QLineEdit.EchoMode.Password)
        self.claude_k.setStyleSheet(inp); self.claude_k.setPlaceholderText("sk-ant-…")
        self.openai_k = QLineEdit(settings.openai_api_key)
        self.openai_k.setEchoMode(QLineEdit.EchoMode.Password)
        self.openai_k.setStyleSheet(inp); self.openai_k.setPlaceholderText("sk-…")
        self.model = QComboBox()
        self.model.addItems(["claude-haiku-4-5-20251001", "claude-sonnet-4-6", "claude-opus-4-7"])
        idx = self.model.findText(settings.ai_model)
        if idx >= 0: self.model.setCurrentIndex(idx)
        self.model.setStyleSheet(inp)
        af.addRow("Claude API Key:", self.claude_k)
        af.addRow("OpenAI API Key:", self.openai_k)
        af.addRow("Модель:", self.model)

        beh = QGroupBox("Поведение"); beh.setStyleSheet(grp_style)
        bl = QVBoxLayout(beh)
        self.ai_cb = QCheckBox("Использовать AI для тегов"); self.ai_cb.setChecked(settings.use_ai_tagging)
        self.tr_cb = QCheckBox("Автопереводить запросы"); self.tr_cb.setChecked(settings.auto_translate)
        self.ai_cb.setStyleSheet("color:#ccc;"); self.tr_cb.setStyleSheet("color:#ccc;")
        bl.addWidget(self.ai_cb); bl.addWidget(self.tr_cb)

        save = QPushButton("Сохранить")
        save.setStyleSheet("background:#7c5cfc; color:#fff; border:none; border-radius:8px; padding:10px 24px;")
        save.clicked.connect(self._save)
        self.status = QLabel(""); self.status.setStyleSheet("color:#4caf50; font-size:12px;")

        layout.addWidget(api); layout.addWidget(beh)
        layout.addWidget(save); layout.addWidget(self.status)

    def _save(self):
        s = self.settings
        s.claude_api_key = self.claude_k.text().strip()
        s.openai_api_key = self.openai_k.text().strip()
        s.ai_model = self.model.currentText()
        s.use_ai_tagging = self.ai_cb.isChecked()
        s.auto_translate = self.tr_cb.isChecked()
        s.save(); self.status.setText("Сохранено")
```

- [ ] **Step 2: Commit**
```bash
git add ui/settings_tab.py
git commit -m "feat: settings tab"
```

---

### Task 18: Wire up and smoke test

**Files:** `main.py` (already created in Task 1, verify it matches below)

- [ ] **Step 1: Verify `main.py` content**
```python
import sys
from PyQt6.QtWidgets import QApplication
from database.db import init_db, get_connection
from settings import Settings
from ui.main_window import MainWindow
from ui.search_tab import SearchTab
from ui.library_tab import LibraryTab
from ui.settings_tab import SettingsTab

def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    init_db()
    db = get_connection()
    settings = Settings()
    window = MainWindow()
    search_tab = SearchTab(db, settings)
    library_tab = LibraryTab(db)
    window.add_tab(search_tab)
    window.add_tab(library_tab)
    window.add_tab(SettingsTab(settings))
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run the app**
```powershell
python main.py
```

Manual test checklist:
1. Window opens with dark sidebar — 3 nav buttons
2. "Поиск" tab shows search bar + source checkboxes
3. "Библиотека" tab shows empty tag list + prompt area
4. "Настройки" tab shows API key fields
5. Enter API keys in Settings, save — no error
6. In Search, type "portrait" + click Найти — results load (requires internet)
7. Click "Сохранить" on a card — dialog opens with tag chips, can confirm
8. Switch to Библиотека — saved prompt appears
9. Click "Копировать" — prompt copied to clipboard

- [ ] **Step 3: Run all unit tests**
```powershell
pytest tests/ -v
```
Expected: all tests pass

- [ ] **Step 4: Commit**
```bash
git add main.py
git commit -m "feat: wire all components — app complete"
```

---

### Task 19: PyInstaller packaging

**Files:** `build.ps1`

- [ ] **Step 1: Create `build.ps1`**
```powershell
.\.venv\Scripts\Activate.ps1
pyinstaller `
    --onefile `
    --windowed `
    --name "PromptLibrary" `
    --add-data ".venv\Lib\site-packages\deep_translator;deep_translator" `
    main.py
Write-Host "Done: dist\PromptLibrary.exe"
```

- [ ] **Step 2: Build**
```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```
Expected: `dist\PromptLibrary.exe` created (~50–90 MB)

- [ ] **Step 3: Smoke-test the .exe**
```powershell
.\dist\PromptLibrary.exe
```
Expected: app opens identically to `python main.py`

- [ ] **Step 4: Commit**
```bash
git add build.ps1
git commit -m "chore: PyInstaller build script"
```
