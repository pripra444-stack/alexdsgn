import express from "express";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "./db.js";
import { createBot, notifyAdmin } from "./bot.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

// ── Load .env (только локально, на Railway env vars приходят через платформу)
const envPath = join(__dirname, "..", ".env");
if (!isProd && existsSync(envPath)) {
  readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const [k, ...v] = line.split("=");
      if (k && v.length) process.env[k.trim()] = v.join("=").trim();
    });
}

const db = getDb();

const insertStmt = db.prepare(`
  INSERT INTO submissions (name, age, city, occupation, experience, goal, income, contact)
  VALUES (:name, :age, :city, :occupation, :experience, :goal, :income, :contact)
`);

// ── Telegram bot ─────────────────────────────────────────────────────────
const bot = createBot(process.env.TELEGRAM_TOKEN);

// ── Express ──────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// CORS нужен только в dev (в prod Express сам отдаёт фронтенд)
if (!isProd) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
}

// ── API routes ────────────────────────────────────────────────────────────

// POST /api/submissions — сохранить заявку + уведомить бота
app.post("/api/submissions", (req, res) => {
  try {
    const b = req.body ?? {};
    const result = insertStmt.run({
      name:       b.name       ?? null,
      age:        b.age        ?? null,
      city:       b.city       ?? null,
      occupation: b.occupation ?? null,
      experience: b.experience ?? null,
      goal:       b.goal       ?? null,
      income:     b.income     ?? null,
      contact:    b.contact    ?? null,
    });

    const saved = db
      .prepare("SELECT * FROM submissions WHERE id = ?")
      .get(result.lastInsertRowid);

    console.log(`[DB] Заявка #${saved.id} — ${saved.name ?? "?"} ${saved.contact ?? ""}`);
    notifyAdmin(bot, saved).catch(() => {});

    res.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error("[DB] Ошибка:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// GET /api/submissions — все заявки
app.get("/api/submissions", (_req, res) => {
  const rows = db.prepare("SELECT * FROM submissions ORDER BY id DESC").all();
  res.json(rows);
});

// DELETE /api/submissions/:id
app.delete("/api/submissions/:id", (req, res) => {
  db.prepare("DELETE FROM submissions WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Serve built frontend in production ────────────────────────────────────
if (isProd) {
  const distPath = join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  // SPA fallback — все не-API маршруты отдают index.html
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(join(distPath, "index.html"));
  });
}

// ── Listen ────────────────────────────────────────────────────────────────
// Railway инжектит PORT автоматически; локально — 3001
const PORT = process.env.PORT ?? process.env.API_PORT ?? 3001;
app.listen(PORT, () =>
  console.log(`\n  Сервер: http://localhost:${PORT}  [${isProd ? "production" : "dev"}]\n  DB:     ${process.env.DATA_DIR ?? "data"}/submissions.db\n`)
);
