# Prompt Library — Design Spec
*2026-05-23*

## Overview

Windows desktop application for searching, saving, and managing image generation prompts. Built with Python + PyQt6, distributed as a single .exe.

---

## Screens & Navigation

Three tabs in a left sidebar:

### 1. Поиск (Search)
- Text input for search query (Russian or English)
- Checkboxes to select sources: PromptHero / Civitai / Reddit / All
- "Найти" button triggers parallel search across selected sites
- Results displayed as cards:
  - Thumbnail image (if available)
  - Prompt text (truncated, expandable)
  - Source badge (site name + link)
  - "Сохранить" button per card
- On "Сохранить": modal window appears with auto-suggested tags; user can add/remove tags, then confirms save

### 2. Библиотека (Library)
- Tag filter panel on the left (all user tags, bilingual display)
- Full-text search input at the top
- Prompt cards grid/list
- Click on a card → detail view:
  - Full prompt text with one-click copy to clipboard
  - All tags (editable)
  - Source URL
  - Save date

### 3. Настройки (Settings)
- API key fields: Claude API / OpenAI API
- Model selector for AI tagging (e.g. claude-haiku-4-5 for cost efficiency)
- Toggle: use AI tagging / local only
- Toggle: auto-translate queries / manual

---

## Data Model (SQLite — `prompts.db`)

```sql
prompts (
  id          INTEGER PRIMARY KEY,
  text        TEXT NOT NULL,
  source_url  TEXT,
  source_site TEXT,           -- 'prompthero' | 'civitai' | 'reddit'
  image_url   TEXT,
  saved_at    DATETIME DEFAULT CURRENT_TIMESTAMP
)

tags (
  id      INTEGER PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL
)

prompt_tags (
  prompt_id INTEGER REFERENCES prompts(id),
  tag_id    INTEGER REFERENCES tags(id),
  PRIMARY KEY (prompt_id, tag_id)
)
```

---

## Scrapers / APIs

| Source       | Method                                         | Notes                                  |
|--------------|------------------------------------------------|----------------------------------------|
| PromptHero   | HTML scraping (`requests` + `BeautifulSoup`)   | No public API; parses search results page |
| Civitai      | Official REST API (no key required for search) | `/api/v1/images` endpoint              |
| Reddit       | JSON API (no key required)                     | Searches r/StableDiffusion, r/midjourney, r/PromptDesign |

All scrapers run in parallel via `asyncio`. Results merged and deduplicated by URL before display.

---

## Bilingual Support

### Interface
- All UI labels, buttons, and messages in Russian.

### Search query translation
- User types query in Russian (or English — both work).
- If AI API key is configured: query sent to Claude/OpenAI for translation before search.
- If no API key: `deep-translator` library used (Google Translate, no key required, works online).
- Original query and translated query both shown to user in the search bar (e.g. "закат на горе → sunset on a mountain").

### Tags
- Every tag stored with both `name_ru` and `name_en`.
- UI always displays `name_ru`.
- Search and API calls always use `name_en`.
- Built-in seed dictionary of ~200 common prompt tags (styles, lighting, technique, subject) with RU+EN pairs.
- AI-suggested tags returned in English → automatically matched to seed dictionary or stored as new bilingual tag (AI also asked to provide Russian translation).

---

## Tag Suggestion Logic

Two-layer approach:

1. **Local (offline):** Scan prompt text against built-in keyword dictionary (~200 terms). Fast, no internet needed.
2. **AI (online):** If API key configured, send prompt text to Claude/OpenAI. Ask for 5–10 descriptive tags in English + Russian translation for each. Merge with local results.

Both layers run together; duplicates removed; combined list presented to user as suggestions in the save modal.

---

## Distribution

- Packaged with **PyInstaller** into a single `PromptLibrary.exe`
- Database `prompts.db` created on first launch in `%APPDATA%\PromptLibrary\`
- Settings stored in `%APPDATA%\PromptLibrary\settings.json`

---

## Out of Scope

- Image generation itself (no Stable Diffusion / Midjourney integration)
- Cloud sync / multi-device
- Prompt editing after save (v2 consideration)
- User accounts
