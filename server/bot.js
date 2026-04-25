/**
 * Telegram-бот администратора.
 * Запускается вместе с API-сервером.
 *
 * Команды:
 *   /start  — регистрация первого пользователя как Admin (один раз)
 *   /list   — последние 10 заявок
 *   /stats  — общая статистика
 *   /help   — справка
 */

import { Telegraf, Markup } from "telegraf";
import { readAdminId, saveAdminId, getDb } from "./db.js";

export function createBot(token) {
  if (!token) {
    console.warn("[BOT] TELEGRAM_TOKEN не задан — бот отключён.");
    return null;
  }

  const bot = new Telegraf(token);

  // ── /start — первый запуск = стать админом ──────────────────────────
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

  // ── /list — последние заявки ─────────────────────────────────────────
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
    const total = db
      .prepare("SELECT COUNT(*) as n FROM submissions")
      .get().n;
    const today = db
      .prepare(
        "SELECT COUNT(*) as n FROM submissions WHERE date(created_at) = date('now','localtime')"
      )
      .get().n;
    ctx.reply(`📊 Статистика:\n• Всего заявок: ${total}\n• Сегодня: ${today}`);
  });

  // ── /help ─────────────────────────────────────────────────────────────
  bot.command("help", (ctx) => {
    ctx.reply(
      "Команды:\n/list — последние 10 заявок\n/stats — статистика\n/start — переинициализация"
    );
  });

  bot.launch();
  console.log("[BOT] Telegram-бот запущен");

  // Graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
}

// ── Отправить новую заявку администратору ────────────────────────────────
export async function notifyAdmin(bot, submission) {
  const adminId = readAdminId();
  if (!bot || !adminId) return;

  try {
    await bot.telegram.sendMessage(
      adminId,
      formatSubmission(submission),
      {
        parse_mode: "HTML",
        ...buildKeyboard(submission),
      }
    );
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
  const lines = [
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
  ];
  return lines.join("\n");
}

function buildKeyboard(r) {
  const buttons = [];

  // Кнопка «Написать» — открывает диалог в Telegram если есть @username
  const handle = extractHandle(r.contact);
  if (handle) {
    buttons.push(
      Markup.button.url(`✉️ Написать ${handle}`, `https://t.me/${handle.replace("@", "")}`)
    );
  }

  buttons.push(
    Markup.button.callback(`🗑 Удалить заявку #${r.id}`, `del_${r.id}`)
  );

  return Markup.inlineKeyboard([buttons]);
}

function extractHandle(contact) {
  if (!contact) return null;
  const m = contact.match(/@[\w\d_]{3,}/);
  return m ? m[0] : null;
}

function esc(v) {
  return v ?? "—";
}
