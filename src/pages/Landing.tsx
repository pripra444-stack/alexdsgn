import { Link } from "react-router-dom";
import { m } from "framer-motion";
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
  X,
  ChevronDown,
  Users,
  Star,
  Clock,
  TrendingUp,
  Monitor,
  Gift,
  Shield,
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { type: "spring" as const, stiffness: 100, damping: 20 },
};

const ClaudeMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path d="M32 4 L37.2 25.8 L59 32 L37.2 38.2 L32 60 L26.8 38.2 L5 32 L26.8 25.8 Z" fill="currentColor" />
  </svg>
);

export default function Landing() {
  return (
    <div className="grain relative min-h-[100dvh] bg-ink-950 text-zinc-100 overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -10%, rgba(217,119,87,0.13), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(217,119,87,0.07), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <SocialProofStrip />
        <LogoStrip />
        <About />
        <WhyBlock />
        <ForWhom />
        <Program />
        <Included />
        <Pricing />
        <Results />
        <Faq />
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
          <a href="#about" className="hover:text-white transition">Обо мне</a>
          <a href="#program" className="hover:text-white transition">Программа</a>
          <a href="#pricing" className="hover:text-white transition">Стоимость</a>
          <a href="#results" className="hover:text-white transition">Результаты</a>
        </nav>
        <Link
          to="/anketa"
          className="group inline-flex items-center gap-1.5 rounded-full bg-accent hover:bg-accent-400 px-4 py-2 text-sm text-white font-medium transition shadow-[0_8px_30px_-8px_rgba(217,119,87,0.5)]"
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
    <section className="relative max-w-[1200px] mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent w-fit"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        Набор на поток — апрель 2026 · осталось 7 мест
      </m.div>

      <div className="mt-7 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-[44px] leading-[1.02] md:text-[84px] md:leading-[0.96] tracking-[-0.04em] font-medium"
          >
            Научись{" "}
            <span className="relative inline-block">
              <span className="text-accent">вайбкодить</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <m.path
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
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-zinc-400 max-w-[58ch] leading-relaxed"
          >
            Пошаговая программа: без бэкграунда в программировании — на{" "}
            <span className="text-white font-medium">100 000 ₽/мес</span> на фрилансе
            за счёт Claude Code, Cursor и правильной системы поиска клиентов.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/anketa"
              className="group inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-400 text-white px-6 py-3.5 text-[15px] font-medium transition shadow-[0_10px_40px_-10px_rgba(217,119,87,0.6)]"
            >
              Заполнить анкету — бесплатно
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#program"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/5 px-6 py-3.5 text-[15px] text-zinc-200 transition"
            >
              Смотреть программу
            </a>
          </m.div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-sm text-zinc-600"
          >
            ~2 минуты · без оплаты · я лично отвечу каждому
          </m.p>
        </div>

        <m.div
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
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                className="text-emerald-400"
              >
                ✓ готово за 38 минут · +15 000 ₽
              </m.p>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function SocialProofStrip() {
  const stats = [
    { icon: Users, value: "47", label: "учеников прошли курс" },
    { icon: TrendingUp, value: "82к ₽", label: "средний доход через 2 мес" },
    { icon: Star, value: "4.9", label: "средняя оценка потока" },
    { icon: Clock, value: "6 нед", label: "до первого оплаченного заказа" },
  ];
  return (
    <section className="border-y border-white/5 bg-white/[0.015]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden">
          {stats.map((s) => (
            <m.div
              key={s.label}
              {...fadeUp}
              className="bg-ink-950/80 px-6 py-5 flex items-center gap-4"
            >
              <s.icon className="w-5 h-5 text-accent shrink-0" />
              <div>
                <p className="text-xl font-medium tracking-tight">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{s.label}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoStrip() {
  const tools = ["Claude Code", "Cursor", "v0", "Vercel", "Supabase", "Figma", "Notion", "GitHub"];
  return (
    <section className="border-b border-white/5 bg-white/[0.01]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 flex items-center gap-6 md:gap-10 overflow-hidden">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 shrink-0">Инструменты</span>
        <div className="flex gap-8 md:gap-12 overflow-hidden relative flex-1">
          <div className="flex gap-8 md:gap-12 marquee-row shrink-0">
            {[...tools, ...tools].map((t, i) => (
              <span key={i} className="text-zinc-400 text-sm md:text-base whitespace-nowrap">
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
    { k: "120к ₽", v: "личный рекорд за месяц" },
    { k: "0", v: "нужного опыта в коде" },
  ];
  return (
    <section id="about" className="max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <m.div {...fadeUp} className="md:col-span-5">
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
        </m.div>

        <m.div {...fadeUp} className="md:col-span-7">
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
        </m.div>
      </div>
    </section>
  );
}

function WhyBlock() {
  const cards = [
    {
      icon: Sparkles,
      title: "Нейросети делают 80% работы",
      body: "Claude Code пишет фичи, фиксит баги и деплоит. Твоя роль — правильно сформулировать задачу и проконтролировать результат.",
    },
    {
      icon: Target,
      title: "Фокус на первых заказах",
      body: "Не абстрактное программирование. Каждая неделя заканчивается работой, которую можно показать клиенту и выставить счёт.",
    },
    {
      icon: Wallet,
      title: "Понятная экономика",
      body: "Где искать заказчиков, как называть цены, что писать в холодных сообщениях. Никакой магии — только система.",
    },
    {
      icon: Zap,
      title: "Старт без капитала",
      body: "Нужен только ноутбук. Claude Code, Cursor и Vercel — бесплатны или почти бесплатны на старте. Вкладываешь время, не деньги.",
    },
  ];
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <m.div {...fadeUp} className="max-w-[60ch]">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">зачем это</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
            Не ещё один курс по Python.
            <br />
            <span className="text-zinc-500">Система под реальные деньги на фрилансе.</span>
          </h2>
        </m.div>

        <div className="mt-14 grid md:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <m.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-tight">{c.title}</h3>
              <p className="mt-3 text-[15px] text-zinc-400 leading-relaxed">{c.body}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWhom() {
  const yes = [
    "Хочешь дополнительный доход без переучивания на 3 года",
    "Работаешь в маркетинге, дизайне или контенте — и хочешь добавить разработку",
    "Уже пробовал фриланс, но не знал как технически реализовывать идеи",
    "Готов вкладывать 4–6 часов в неделю на протяжении 6 недель",
    "Хочешь продавать готовые продукты, а не снова «часы своей работы»",
  ];
  const no = [
    "Хочешь стать senior-разработчиком в крупной компании",
    "Ожидаешь пассивный доход без работы с клиентами",
    "Не готов общаться с людьми и искать заказчиков",
    "Ищешь волшебную таблетку без практики",
  ];
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <m.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">для кого</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium max-w-[26ch]">
            Кому подойдёт этот курс?
          </h2>
        </m.div>

        <div className="mt-14 grid md:grid-cols-2 gap-4">
          <m.div
            {...fadeUp}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-7"
          >
            <p className="text-sm font-medium text-emerald-400 uppercase tracking-[0.15em]">Подойдёт ✓</p>
            <ul className="mt-5 space-y-3.5">
              {yes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </m.div>

          <m.div
            {...fadeUp}
            className="rounded-2xl border border-white/10 bg-white/[0.015] p-7"
          >
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-[0.15em]">Не подойдёт ✗</p>
            <ul className="mt-5 space-y-3.5">
              {no.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-zinc-500">
                  <X className="w-5 h-5 text-zinc-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </m.div>
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
      items: ["Установка Claude Code и Cursor", "Git, GitHub, первый деплой", "Как думать промптами"],
    },
    {
      n: "02",
      title: "Первый проект под заказ",
      icon: Rocket,
      items: ["Лендинг за 2 вечера", "Tailwind, компоненты, адаптив", "Деплой на Vercel с кастомным доменом"],
    },
    {
      n: "03",
      title: "Боты, формы, интеграции",
      icon: MessageSquare,
      items: ["Telegram-бот через Claude Code", "Подключение Google Sheets / Notion", "Автоматизация рутины клиента"],
    },
    {
      n: "04",
      title: "Поиск клиентов и цены",
      icon: Target,
      items: ["Где сидят заказчики (и где точно нет)", "Холодные сообщения, которые читают", "Как называть цены без стеснения"],
    },
    {
      n: "05",
      title: "Первая 100к",
      icon: Wallet,
      items: ["Портфолио и кейсы из курса", "Система на 4–6 активных проектов", "Масштабирование через агентов"],
    },
    {
      n: "06",
      title: "Живая практика",
      icon: Zap,
      items: ["Разбор твоих проектов 1-на-1", "Ревью кода и переговоров с клиентом", "Пинок по дедлайнам"],
    },
  ];

  return (
    <section id="program" className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <m.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-[60ch]">
            <p className="text-sm uppercase tracking-[0.2em] text-accent">программа</p>
            <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
              6 недель — от нуля до оплаченного проекта.
            </h2>
          </div>
          <p className="text-sm text-zinc-500">~6 часов в неделю · практика с первой недели</p>
        </m.div>

        <div className="mt-14 grid md:grid-cols-2 gap-4">
          {weeks.map((w, i) => (
            <m.div
              key={w.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.08, duration: 0.5 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:border-accent/30 transition"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-accent">неделя {w.n}</span>
                <w.icon className="w-5 h-5 text-zinc-600" />
              </div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">{w.title}</h3>
              <ul className="mt-5 space-y-2.5">
                {w.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[15px] text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Included() {
  const items = [
    { icon: Monitor, title: "6 живых эфиров", body: "Каждую неделю — разбор новой темы в прямом эфире с вопросами" },
    { icon: Clock, title: "Записи навсегда", body: "Все эфиры остаются у тебя — пересматривай в любое время" },
    { icon: MessageSquare, title: "Чат потока", body: "Закрытый Telegram-чат с участниками и обратная связь от меня" },
    { icon: Code2, title: "Ревью твоих проектов", body: "Смотрю твой код и сделки с клиентами — даю конкретную обратную связь" },
    { icon: Gift, title: "Шаблоны и промпты", body: "Готовые промпты для Claude Code, шаблон первого лендинга, скрипт переговоров" },
    { icon: Shield, title: "Гарантия результата", body: "Если в конце 6 недель не возьмёшь ни одного заказа — верну деньги" },
  ];
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <m.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">что включено</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
            Всё что нужно — <br />
            <span className="text-zinc-500">уже внутри.</span>
          </h2>
        </m.div>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <m.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-[14px] text-zinc-500 leading-relaxed">{item.body}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <m.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">стоимость</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
            Один поток — одна цена.
          </h2>
        </m.div>

        <div className="mt-14 grid md:grid-cols-12 gap-6">
          <m.div
            {...fadeUp}
            className="md:col-span-7 relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-ink-900 to-ink-950 p-8 md:p-10"
          >
            <div
              aria-hidden
              className="absolute -top-32 -right-16 w-[400px] h-[400px] rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #D97757 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-medium tracking-tight">29 900 ₽</span>
                <span className="text-zinc-500 line-through text-xl">45 000 ₽</span>
              </div>
              <p className="mt-1 text-sm text-accent">цена раннего доступа · до 1 мая</p>

              <ul className="mt-8 space-y-3">
                {[
                  "6 живых эфиров с разбором тем",
                  "Записи всех занятий навсегда",
                  "Закрытый чат потока",
                  "Личное ревью проектов и переговоров",
                  "Шаблоны, промпты, скрипты продаж",
                  "Гарантия возврата если нет заказов",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-zinc-200">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/anketa"
                className="group relative mt-10 inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-400 text-white px-8 py-4 text-[15px] font-medium transition shadow-[0_20px_60px_-10px_rgba(217,119,87,0.55)]"
              >
                Занять место на потоке
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-sm text-zinc-600">Сначала анкета — потом оплата. Без обязательств.</p>
            </div>
          </m.div>

          <m.div {...fadeUp} className="md:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex-1">
              <p className="text-sm text-zinc-500 uppercase tracking-[0.15em]">Рассрочка</p>
              <p className="mt-3 text-3xl font-medium tracking-tight">4 983 ₽ / мес</p>
              <p className="mt-1 text-sm text-zinc-500">6 платежей без переплат · через банк</p>
              <p className="mt-4 text-[14px] text-zinc-400 leading-relaxed">
                Рассрочка доступна после прохождения анкеты — уточни при записи.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Гарантия результата</p>
                  <p className="mt-1.5 text-[14px] text-zinc-500 leading-relaxed">
                    Если после 6 недель не возьмёшь ни одного заказа — верну деньги без вопросов.
                  </p>
                </div>
              </div>
            </div>
          </m.div>
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
        <m.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">результаты</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium max-w-[20ch]">
            Те, кто уже прошёл прошлый поток.
          </h2>
        </m.div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {cases.map((c, i) => (
            <m.div
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
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "Нужен ли опыт в программировании?",
      a: "Нет. Курс специально построен для людей без технического бэкграунда. Всё начинается с нуля — установка, первые команды, первый деплой.",
    },
    {
      q: "Сколько времени нужно в неделю?",
      a: "4–6 часов. Один живой эфир (~1.5 часа) + практика по теме недели. Если не успел — есть запись.",
    },
    {
      q: "Mac или Windows — есть разница?",
      a: "Никакой. Claude Code и Cursor работают на обоих. Разбираем оба варианта на первом занятии.",
    },
    {
      q: "Когда начинается следующий поток?",
      a: "Старт — 5 мая 2026. После анкеты я пришлю точные даты и всё необходимое для подготовки.",
    },
    {
      q: "Как работает гарантия возврата?",
      a: "Если к концу 6 недели ты честно выполнял задания, но не взял ни одного заказа — возвращаю деньги полностью. Пишешь мне в Telegram, без суда и бюрократии.",
    },
    {
      q: "Есть ли рассрочка?",
      a: "Да — 6 платежей по 4 983 ₽ без переплат через банк. Оформляется после прохождения анкеты.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 border-t border-white/5">
        <m.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">вопросы</p>
          <h2 className="mt-4 text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] font-medium">
            Частые вопросы.
          </h2>
        </m.div>

        <div className="mt-14 max-w-[780px] space-y-2">
          {items.map((item, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-[16px] font-medium pr-4">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-[15px] text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                  {item.a}
                </div>
              )}
            </m.div>
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
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 md:p-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, #D97757 0%, transparent 70%)" }}
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
            <span className="text-sm text-zinc-500">~2 минуты · без обязательств · мест осталось 7</span>
          </div>
        </m.div>
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
          <a href="https://t.me/maxvibecode" target="_blank" rel="noopener" className="hover:text-zinc-200 transition">
            Telegram
          </a>
          <a href="#" className="hover:text-zinc-200 transition">Политика</a>
          <a href="#" className="hover:text-zinc-200 transition">Оферта</a>
        </div>
      </div>
    </footer>
  );
}
