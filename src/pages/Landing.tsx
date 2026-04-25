import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Code2,
  MessageSquare,
  Rocket,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { type: "spring" as const, stiffness: 100, damping: 20 },
};

const ClaudeMark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M32 4 L37.2 25.8 L59 32 L37.2 38.2 L32 60 L26.8 38.2 L5 32 L26.8 25.8 Z"
      fill="currentColor"
    />
  </svg>
);

export default function Landing() {
  return (
    <div className="grain relative min-h-[100dvh] bg-ink-950 text-zinc-100 overflow-x-hidden">
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -10%, rgba(217,119,87,0.15), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(217,119,87,0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <LogoStrip />
        <About />
        <WhyBlock />
        <Program />
        <Results />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ClaudeMark className="w-6 h-6 text-accent" />
          <span className="font-medium tracking-tight">Макс · Вайбкодинг</span>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
          <a href="#about" className="hover:text-white transition">
            Обо мне
          </a>
          <a href="#program" className="hover:text-white transition">
            Программа
          </a>
          <a href="#results" className="hover:text-white transition">
            Результаты
          </a>
        </nav>
        <Link
          to="/anketa"
          className="group inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-sm text-white transition"
        >
          Записаться
          <ArrowUpRight className="w-4 h-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative max-w-[1200px] mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 w-fit"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        Набор на поток — апрель 2026
      </motion.div>

      <div className="mt-7 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-[44px] leading-[1.02] md:text-[84px] md:leading-[0.96] tracking-[-0.04em] font-medium"
          >
            Научись{" "}
            <span className="relative inline-block">
              <span className="text-accent">вайбкодить</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  d="M3 8 C 80 2, 180 12, 297 5"
                  stroke="#D97757"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            <br />
            с нейросетями <br className="hidden md:block" />
            <span className="text-zinc-400">и взять первые заказы.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-zinc-400 max-w-[58ch] leading-relaxed"
          >
            Пошаговая программа о том, как без бэкграунда в программировании выйти
            на <span className="text-white font-medium">100 000 ₽/мес</span> на
            фрилансе — за счёт Claude Code, Cursor и правильной системы поиска
            клиентов.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/anketa"
              className="group inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-400 text-white px-6 py-3.5 text-[15px] font-medium transition shadow-[0_10px_40px_-10px_rgba(217,119,87,0.6)]"
            >
              Заполнить анкету
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#program"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/5 px-6 py-3.5 text-[15px] text-zinc-200 transition"
            >
              Смотреть программу
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="md:col-span-4"
        >
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              </div>
              <span className="font-mono">claude-code · ~/freelance</span>
            </div>
            <div className="mt-4 font-mono text-[13px] leading-relaxed space-y-2">
              <p className="text-zinc-500">$ claude "собери лендинг под клиента"</p>
              <p className="text-accent/90">✦ Reading requirements...</p>
              <p className="text-zinc-300">→ создаю компоненты, настраиваю Tailwind</p>
              <p className="text-zinc-300">→ деплою на Vercel</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                className="text-emerald-400"
              >
                ✓ готово за 38 минут · +15 000 ₽
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LogoStrip() {
  const tools = [
    "Claude Code",
    "Cursor",
    "v0",
    "Vercel",
    "Supabase",
    "Figma",
    "Notion",
    "GitHub",
  ];
  return (
    <section className="border-y border-white/5 bg-white/[0.015]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 flex items-center gap-6 md:gap-10 overflow-hidden">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 shrink-0">
          Работаем с
        </span>
        <div className="flex gap-8 md:gap-12 overflow-hidden relative flex-1">
          <div className="flex gap-8 md:gap-12 marquee-row shrink-0">
            {[...tools, ...tools].map((t, i) => (
              <span
                key={i}
                className="text-zinc-400 text-sm md:text-base whitespace-nowrap"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const stats = [
    { k: "3+", v: "года в IT-продуктах" },
    { k: "50+", v: "сданных фриланс-проектов" },
    { k: "120k ₽", v: "личный рекорд за месяц" },
    { k: "0", v: "нужного опыта в коде" },
  ];
  return (
    <section id="about" className="max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <motion.div {...fadeUp} className="md:col-span-5">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=80"
              alt="Max"
              className="w-full h-full object-cover grayscale contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">автор курса</p>
              <p className="mt-1 text-2xl font-medium">Максим</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="md:col-span-7">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">обо мне</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
            Я не кодил{" "}
            <span className="text-zinc-500">до 2024-го.</span>
            <br />
            Сейчас зарабатываю на этом в свободное время.
          </h2>
          <div className="mt-6 space-y-4 text-zinc-400 text-[17px] leading-relaxed max-w-[60ch]">
            <p>
              Три года назад я был маркетологом без технического бэкграунда. Когда вышел
              Claude Code, понял: порог входа в разработку упал до уровня «умеешь
              формулировать задачу — умеешь строить продукты».
            </p>
            <p>
              За год я собрал с нейросетями больше 50 заказов — от лендингов и
              телеграм-ботов до интеграций с Notion и простых SaaS-MVP. Без степени в
              Computer Science. Без миллиона часов на Stack Overflow.
            </p>
            <p className="text-zinc-300">
              Курс — это выжимка всего, что я бы хотел узнать на старте.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
            {stats.map((s) => (
              <div key={s.v} className="bg-ink-950 p-5">
                <p className="text-2xl md:text-3xl font-medium tracking-tight">{s.k}</p>
                <p className="mt-1 text-[13px] text-zinc-500 leading-snug">{s.v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhyBlock() {
  const cards = [
    {
      icon: Sparkles,
      title: "Нейросети делают 80% работы",
      body: "Claude Code пишет фичи, фиксит баги и деплоит проекты. Твоя роль — правильно сформулировать задачу и проконтролировать результат.",
    },
    {
      icon: Target,
      title: "Фокус на первых заказах",
      body: "Мы не учим абстрактному программированию. Каждая неделя заканчивается работой, которую можно показать клиенту и выставить счёт.",
    },
    {
      icon: Wallet,
      title: "Понятная экономика",
      body: "Разбираем, где искать заказчиков, как называть цены, что писать в холодных сообщениях. Никакой магии — только система.",
    },
  ];
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <motion.div {...fadeUp} className="max-w-[60ch]">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">зачем это</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
            Не ещё один курс по Python.
            <br />
            <span className="text-zinc-500">
              Система под реальные деньги на фрилансе.
            </span>
          </h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-tight">{c.title}</h3>
              <p className="mt-3 text-[15px] text-zinc-400 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Program() {
  const weeks = [
    {
      n: "01",
      title: "Настройка рабочего места",
      icon: Code2,
      items: [
        "Установка Claude Code и Cursor",
        "Git, GitHub, первый деплой",
        "Как думать промптами",
      ],
    },
    {
      n: "02",
      title: "Первый проект под заказ",
      icon: Rocket,
      items: [
        "Лендинг за 2 вечера",
        "Tailwind, компоненты, адаптив",
        "Деплой на Vercel с кастомным доменом",
      ],
    },
    {
      n: "03",
      title: "Боты, формы, интеграции",
      icon: MessageSquare,
      items: [
        "Telegram-бот через Claude Code",
        "Подключение Google Sheets / Notion",
        "Автоматизация рутины клиента",
      ],
    },
    {
      n: "04",
      title: "Поиск клиентов и цены",
      icon: Target,
      items: [
        "Где сидят заказчики (и где точно нет)",
        "Холодные сообщения, которые читают",
        "Как называть цены без стеснения",
      ],
    },
    {
      n: "05",
      title: "Первая 100к",
      icon: Wallet,
      items: [
        "Портфолио и кейсы из курса",
        "Система на 4-6 активных проектов",
        "Масштабирование через агентов",
      ],
    },
    {
      n: "06",
      title: "Живая практика",
      icon: Zap,
      items: [
        "Разбор твоих проектов 1-на-1",
        "Ревью кода и переговоров с клиентом",
        "Пинок по дедлайнам",
      ],
    },
  ];

  return (
    <section id="program" className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-[60ch]">
            <p className="text-sm uppercase tracking-[0.2em] text-accent">программа</p>
            <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
              6 недель — от нуля до оплаченного проекта.
            </h2>
          </div>
          <p className="text-sm text-zinc-500">~6 часов в неделю · практика с первой недели</p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 gap-4">
          {weeks.map((w, i) => (
            <motion.div
              key={w.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.08, duration: 0.5 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:border-accent/30 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-accent">неделя {w.n}</span>
                </div>
                <w.icon className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">{w.title}</h3>
              <ul className="mt-5 space-y-2.5">
                {w.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2.5 text-[15px] text-zinc-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Results() {
  const cases = [
    {
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&q=80",
      name: "Аня, 27",
      bg: "SMM-менеджер",
      text: "Собрала первый лендинг за 3 дня, клиент заплатил 18 000 ₽. Кайф от того, что ты больше не «продаёшь услуги», а создаёшь продукт.",
      mrr: "18 000 ₽ за неделю",
    },
    {
      img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80",
      name: "Денис, 34",
      bg: "Офис-менеджер",
      text: "На 5 неделе закрыл заказ на бота для барбершопа на 45к. До курса боялся слова «терминал».",
      mrr: "45 000 ₽ · 1 заказ",
    },
    {
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
      name: "Лера, 22",
      bg: "Студентка",
      text: "Сейчас веду 3 проекта одновременно параллельно с универом. Вышла на стабильные 90к.",
      mrr: "90 000 ₽ / мес",
    },
  ];
  return (
    <section id="results" className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <motion.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">результаты</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium max-w-[20ch]">
            Те, кто уже прошёл прошлый поток.
          </h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {cases.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-zinc-500">{c.bg}</p>
                  </div>
                  <span className="rounded-full bg-accent/10 border border-accent/20 text-accent px-2.5 py-1 text-xs font-mono">
                    {c.mrr}
                  </span>
                </div>
                <p className="mt-4 text-[15px] text-zinc-400 leading-relaxed">"{c.text}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-36 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 md:p-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-40"
            style={{
              background: "radial-gradient(circle, #D97757 0%, transparent 70%)",
            }}
          />
          <div className="relative flex items-center gap-2 text-accent">
            <ClaudeMark className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.2em]">последний шаг</span>
          </div>
          <h2 className="relative mt-6 text-4xl md:text-6xl lg:text-7xl tracking-[-0.035em] leading-[0.98] font-medium max-w-[18ch]">
            Готов выйти на первые 100к?
          </h2>
          <p className="relative mt-6 text-lg text-zinc-400 max-w-[56ch]">
            Оставь заявку через короткую анкету — разберёмся, подходит ли тебе формат, и
            я лично свяжусь в течение дня.
          </p>
          <div className="relative mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/anketa"
              className="group inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-400 text-white px-7 py-4 text-base font-medium transition shadow-[0_20px_60px_-10px_rgba(217,119,87,0.6)]"
            >
              Заполнить анкету
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </Link>
            <span className="text-sm text-zinc-500">~2 минуты · без обязательств</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-2.5">
          <ClaudeMark className="w-4 h-4 text-accent" />
          <span>© 2026 Макс · Вайбкодинг</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-zinc-200 transition">
            Telegram
          </a>
          <a href="#" className="hover:text-zinc-200 transition">
            Политика
          </a>
          <a href="#" className="hover:text-zinc-200 transition">
            Оферта
          </a>
        </div>
      </div>
    </footer>
  );
}
