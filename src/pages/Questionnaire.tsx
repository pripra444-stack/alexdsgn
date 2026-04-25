import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

/* ─── questions config ───────────────────────────────────────────── */
type Q = {
  id: string;
  label: string;
  hint: string;
  validate?: (v: string) => string | null;
};

const QUESTIONS: Q[] = [
  {
    id: "name",
    label: "Как тебя зовут?",
    hint: "Имя",
    validate: (v) => (v.trim().length < 2 ? "Слишком короткое" : null),
  },
  {
    id: "age",
    label: "Сколько тебе лет?",
    hint: "Возраст",
    validate: (v) => {
      const n = Number(v);
      return !Number.isFinite(n) || n < 14 || n > 90 ? "Введи цифрами, 14–90" : null;
    },
  },
  {
    id: "city",
    label: "Из какого ты города?",
    hint: "Город",
  },
  {
    id: "occupation",
    label: "Чем занимаешься сейчас?",
    hint: "Работа / учёба / проект",
  },
  {
    id: "experience",
    label: "Есть ли опыт в IT или программировании?",
    hint: "Можно «ноль» — всё ок",
  },
  {
    id: "goal",
    label: "Зачем тебе вайбкодинг?",
    hint: "Цель в 1–2 предложения",
  },
  {
    id: "income",
    label: "Какую сумму хочешь зарабатывать?",
    hint: "Например: 100 000 ₽ в месяц",
  },
  {
    id: "contact",
    label: "Оставь контакт — куда написать?",
    hint: "@username в Telegram",
    validate: (v) => (v.trim().length < 2 ? "Укажи контакт" : null),
  },
];

/* ─── animation variants ─────────────────────────────────────────── */
const questionVariants = {
  enter: {
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
    transition: { duration: 0.01 },
  },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: -48,
    filter: "blur(10px)",
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const },
  },
};

/* ─── ClaudeMark icon ─────────────────────────────────────────────── */
const ClaudeMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path
      d="M32 4 L37.2 25.8 L59 32 L37.2 38.2 L32 60 L26.8 38.2 L5 32 L26.8 25.8 Z"
      fill="currentColor"
    />
  </svg>
);

/* ─── Main component ──────────────────────────────────────────────── */
export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const current = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);

  const handleSend = useCallback(
    async (raw: string) => {
      if (done || submitting) return;
      const value = raw.trim();
      if (!value) return;

      const err = current?.validate?.(value) ?? null;
      if (err) {
        setError(err);
        return;
      }
      setError(null);

      const next = { ...answers, [current.id]: value };
      setAnswers(next);

      if (step + 1 >= QUESTIONS.length) {
        setSubmitting(true);
        // send to DB
        try {
          await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          });
        } catch (e) {
          console.error("Submit failed:", e);
        }
        setSubmitting(false);
        setDone(true);
      } else {
        setStep((s) => s + 1);
      }
    },
    [done, submitting, current, answers, step]
  );

  return (
    <div className="relative min-h-[100dvh] bg-ink-950 text-zinc-100 overflow-hidden flex flex-col">
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -5%, rgba(217,119,87,0.18), transparent 65%)",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 h-16 border-b border-white/5 backdrop-blur-xl bg-ink-950/60 shrink-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="flex items-center gap-2">
          <ClaudeMark className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium">Анкета</span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-28 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: done ? "100%" : `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {done ? "✓" : `${step + 1}/${QUESTIONS.length}`}
          </span>
        </div>
      </header>

      {/* ── Main area ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pb-8">
        <div className="w-full max-w-[680px] flex flex-col items-center gap-10">

          {/* Question / Done card */}
          <div className="w-full min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  <DoneCard answers={answers} />
                </motion.div>
              ) : (
                <motion.div
                  key={`q-${step}`}
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex flex-col items-center text-center gap-4"
                >
                  {/* Step badge */}
                  <span className="text-xs font-mono uppercase tracking-[0.22em] text-accent">
                    вопрос {step + 1} из {QUESTIONS.length}
                  </span>

                  {/* Big question text */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-[-0.035em] leading-[1.08]">
                    {current.label}
                  </h1>

                  {/* Error hint */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Prompt input — hidden when done */}
          <AnimatePresence>
            {!done && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="w-full"
              >
                <PromptInputBox
                  onSend={handleSend}
                  placeholder={current?.hint ?? "Твой ответ..."}
                  isLoading={submitting}
                />
                <p className="mt-3 text-center text-[11px] text-zinc-600">
                  Enter — отправить &nbsp;·&nbsp; Shift + Enter — новая строка
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ─── Done card ─────────────────────────────────────────────────── */
function DoneCard({ answers }: { answers: Record<string, string> }) {
  const labels: Record<string, string> = {
    name: "Имя", age: "Возраст", city: "Город",
    occupation: "Занятие", experience: "Опыт",
    goal: "Цель", income: "Доход", contact: "Контакт",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 md:p-12">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #D97757 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-lg">Отправлено!</p>
            <p className="text-sm text-zinc-400">Макс напишет в течение 24 часов</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(answers).map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
                {labels[k] ?? k}
              </p>
              <p className="mt-1 text-[15px] text-zinc-100 break-words">{v}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-400 px-5 py-3 text-sm font-medium text-white transition shadow-[0_8px_30px_-8px_rgba(217,119,87,0.5)]"
          >
            <Sparkles className="w-4 h-4" />
            На главную
          </Link>
          <span className="self-center text-xs text-zinc-500">
            Ответы сохранены в базе данных
          </span>
        </div>
      </div>
    </div>
  );
}
