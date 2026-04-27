/**
 * Telegram-бот администратора.
 *
 * Команды:
 *   /start  — регистрация первого пользователя как Admin (один раз)
 *   /list   — последние 10 заявок
 *   /stats  — общая статистика
 *   /export — выгрузить все заявки в CSV-файл
 *   /help   — справка
 */

import { Telegraf, Markup } from "telegraf";
import { readAdminId, saveAdminId, getDb } from "./db.js";

const COLUMNS = ["id", "created_at", "name", "age", "city", "occupation", "experience", "goal", "income", "contact"];
const HEADERS = ["ID", "Дата", "Имя", "Возраст", "Город", "Занятие", "Опыт в IT", "Цель", "Доход", "Контакт"];

export function createBot(token) {
  if (!token) {
    console.warn("[BOT] TELEGRAM_TOKEN не задан — бот отключён.");
    return null;
  }

  const bot = new Telegraf(token);

  // ── /start ────────────────────────────────────────────────────────────
  bot.command("start", async (ctx) => {
    const existingAdmin = readAdminId();

    if (!existingAdmin) {
      saveAdminId(ctx.chat.id);
      await ctx.reply(
        `✅ *Добро пожаловать, Администратор\\!*\n\n` +
          `Твой ID: \`${ctx.chat.id}\`\n\n` +
          `Теперь все новые заявки с лендинга будут приходить сюда\\.\n\n` +
          `Команды:\n` +
          `/list — последние 10 заявок\n` +
          `/export — выгрузить всё в CSV\n` +
          `/stats — статистика\n` +
          `/help — справка`,
        { parse_mode: "MarkdownV2" }
      );
    } else if (existingAdmin === ctx.chat.id) {
      await ctx.reply("Привет! Ты уже зарегистрирован как администратор 👋");
    } else {
      await ctx.reply("Доступ запрещён. Бот работает только для администратора.");
    }
  });

  // ── /list — последние 10 заявок ───────────────────────────────────────
  bot.command("list", async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply("⛔ Доступ запрещён.");
    const db = getDb();
    const rows = db
      .prepare("SELECT * FROM submissions ORDER BY id DESC LIMIT 10")
      .all();

    if (!rows.length) return ctx.reply("Заявок пока нет.");

    for (const row of rows) {
      await ctx.replyWithHTML(formatSubmission(row), buildKeyboard(row));
    }
  });

  // ── /stats ────────────────────────────────────────────────────────────
  bot.command("stats", async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply("⛔ Доступ запрещён.");
    const db = getDb();
    const total = db.prepare("SELECT COUNT(*) as n FROM submissions").get().n;
    const today = db
      .prepare("SELECT COUNT(*) as n FROM submissions WHERE date(created_at) = date('now','localtime')")
      .get().n;
    const week = db
      .prepare("SELECT COUNT(*) as n FROM submissions WHERE created_at >= datetime('now','-7 days','localtime')")
      .get().n;
    ctx.reply(
      `📊 Статистика:\n• Всего заявок: ${total}\n• За 7 дней: ${week}\n• Сегодня: ${today}`
    );
  });

  // ── /export — выгрузить все заявки CSV ───────────────────────────────
  bot.command("export", async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply("⛔ Доступ запрещён.");
    const db = getDb();
    const rows = db.prepare("SELECT * FROM submissions ORDER BY id ASC").all();

    if (!rows.length) return ctx.reply("Заявок пока нет — нечего выгружать.");

    const csv = buildCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `submissions_${date}.csv`;

    await ctx.replyWithDocument(
      { source: Buffer.from("﻿" + csv, "utf-8"), filename },
      { caption: `📥 Все заявки (${rows.length} шт.) · ${date}` }
    );
  });

  // ── /help ─────────────────────────────────────────────────────────────
  bot.command("help", (ctx) => {
    ctx.reply(
      "Команды:\n" +
      "/list — последние 10 заявок\n" +
      "/export — выгрузить все заявки в CSV\n" +
      "/stats — статистика\n" +
      "/start — переинициализация"
    );
  });

  // ── Inline-кнопка «Удалить заявку» ────────────────────────────────────
  bot.action(/^del_(\d+)$/, async (ctx) => {
    if (!isAdmin(ctx)) return ctx.answerCbQuery("⛔ Доступ запрещён.");
    const id = ctx.match[1];
    const db = getDb();
    db.prepare("DELETE FROM submissions WHERE id = ?").run(id);
    await ctx.answerCbQuery(`✅ Заявка #${id} удалена`);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // убираем кнопки
    await ctx.editMessageText(
      ctx.callbackQuery.message.text + `\n\n🗑 <i>Заявка #${id} удалена</i>`,
      { parse_mode: "HTML" }
    );
  });

  bot.launch();
  console.log("[BOT] Telegram-бот запущен");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
}

// ── Отправить новую заявку администратору ────────────────────────────────
export async function notifyAdmin(bot, submission) {
  const adminId = readAdminId();
  if (!bot || !adminId) return;

  try {
    await bot.telegram.sendMessage(adminId, formatSubmission(submission), {
      parse_mode: "HTML",
      ...buildKeyboard(submission),
    });
  } catch (err) {
    console.error("[BOT] Ошибка отправки уведомления:", err.message);
  }
}

// ── Вспомогательные ──────────────────────────────────────────────────────
function isAdmin(ctx) {
  const adminId = readAdminId();
  return adminId && ctx.chat.id === adminId;
}

function formatSubmission(r) {
  return [
    `📋 <b>Заявка #${r.id}</b> · ${r.created_at}`,
    ``,
    `👤 <b>Имя:</b> ${esc(r.name)}`,
    `🎂 <b>Возраст:</b> ${esc(r.age)}`,
    `🌆 <b>Город:</b> ${esc(r.city)}`,
    `💼 <b>Занятие:</b> ${esc(r.occupation)}`,
    `💻 <b>Опыт в IT:</b> ${esc(r.experience)}`,
    `🎯 <b>Цель:</b> ${esc(r.goal)}`,
    `💰 <b>Желаемый доход:</b> ${esc(r.income)}`,
    `✈️ <b>Контакт:</b> ${esc(r.contact)}`,
  ].join("\n");
}

function buildKeyboard(r) {
  const buttons = [];
  const handle = extractHandle(r.contact);
  if (handle) {
    buttons.push(
      Markup.button.url(`✉️ Написать ${handle}`, `https://t.me/${handle.replace("@", "")}`)
    );
  }
  buttons.push(Markup.button.callback(`🗑 Удалить заявку #${r.id}`, `del_${r.id}`));
  return Markup.inlineKeyboard([buttons]);
}

function buildCsv(rows) {
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    // Wrap in quotes if contains comma, newline or quote
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const header = HEADERS.join(",");
  const body = rows.map((r) =>
    COLUMNS.map((col) => escape(r[col])).join(",")
  );

  return [header, ...body].join("\r\n");
}

function extractHandle(contact) {
  if (!contact) return null;
  const m = contact.match(/@[a-zA-Z0-9_]{5,32}/);
  return m ? m[0] : null;
}

function esc(v) {
  return v ?? "—";
}
