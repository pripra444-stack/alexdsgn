import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

const ADMIN_FILE = join(dataDir, "admin.json");

let _db = null;

export function getDb() {
  if (!_db) {
    _db = new DatabaseSync(join(dataDir, "submissions.db"));
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
        name        TEXT,
        age         TEXT,
        city        TEXT,
        occupation  TEXT,
        experience  TEXT,
        goal        TEXT,
        income      TEXT,
        contact     TEXT
      );
    `);
  }
  return _db;
}

export function readAdminId() {
  if (!existsSync(ADMIN_FILE)) return null;
  try {
    return JSON.parse(readFileSync(ADMIN_FILE, "utf-8")).chatId ?? null;
  } catch {
    return null;
  }
}

export function saveAdminId(chatId) {
  writeFileSync(ADMIN_FILE, JSON.stringify({ chatId }), "utf-8");
}
