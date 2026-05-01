import { useRef } from "react";
import { m, useInView } from "framer-motion";

// ─── Links (replace with real) ───────────────────────────────────────────────
const TG_LINK = "https://t.me/AlexanderPanurin";
const BEHANCE_LINK = "https://www.behance.net/alexanderpanurin";

// ─── Animation helpers ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <m.p
      variants={fadeUp}
      className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent mb-5"
    >
      {children}
    </m.p>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const links = [
    { label: "Услуги", href: "#services" },
    { label: "Кейсы", href: "#cases" },
    { label: "Процесс", href: "#process" },
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/[0.06] backdrop-blur-xl bg-canvas/80">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-sm font-semibold tracking-[0.18em] uppercase text-white"
        >
          MAX<span className="text-accent">.</span>DESIGN
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={TG_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-9 px-5 rounded-full bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors duration-200"
        >
          Написать
        </a>
      </div>
    </header>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const platforms = ["WB", "Ozon", "e-commerce", "упаковка"];
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-16">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, #CBFF00 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10 py-20">
        {/* Badge */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400">
            Дизайн маркетплейсов · AI Creator
          </span>
        </m.div>

        {/* Headline */}
        <m.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[1.03] tracking-[-0.035em] text-white max-w-[900px]"
        >
          Создаю продающие карточки и HERO-визуалы для{" "}
          <span className="text-accent">WB и Ozon</span>
        </m.h1>

        {/* Sub */}
        <m.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-[620px]"
        >
          Помогаю выделиться в выдаче и увеличить CTR через коммерческий дизайн
          и AI-визуалы
        </m.p>

        {/* Platform pills */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2 mt-8"
        >
          {platforms.map((p) => (
            <span
              key={p}
              className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-zinc-400"
            >
              {p}
            </span>
          ))}
        </m.div>

        {/* CTAs */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-4 mt-10"
        >
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors duration-200 shadow-[0_0_40px_-8px_rgba(203,255,0,0.5)]"
          >
            <TelegramIcon />
            Написать в Telegram
          </a>
          <a
            href="#cases"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-white/15 text-white text-sm font-medium hover:border-white/30 hover:bg-white/[0.04] transition-all duration-200"
          >
            Смотреть кейсы
            <ArrowDownIcon />
          </a>
        </m.div>

        {/* Stats row */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-8 mt-16 pt-16 border-t border-white/[0.06]"
        >
          {[
            { value: "40+", label: "проектов" },
            { value: "+30%", label: "средний рост CTR" },
            { value: "24 ч", label: "первая версия" },
            { value: "AI+", label: "инструментарий" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "Wildberries",
    "Ozon",
    "Карточки товаров",
    "HERO-экраны",
    "AI-визуалы",
    "Упаковка",
    "CTR +30%",
    "e-commerce",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/[0.05] py-4 bg-surface/50">
      <div className="flex animate-marquee w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6">
            <span className="text-sm font-mono text-zinc-500 uppercase tracking-[0.15em] whitespace-nowrap">
              {item}
            </span>
            <span className="text-accent text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: "01",
    icon: "🟡",
    title: "Карточки товаров",
    subtitle: "WB / Ozon",
    desc: "Фото + инфографика + А+ контент. Дизайн, который работает на выдаче — тестирую гипотезы по CTR и конверсии.",
    tags: ["WB", "Ozon", "Инфографика", "А+ контент"],
  },
  {
    num: "02",
    icon: "⚡",
    title: "HERO-экраны",
    subtitle: "Первый слайд",
    desc: "Главный экран, который останавливает прокрутку. Сильный визуал + читаемое УТП = больше кликов в карточку.",
    tags: ["HERO", "CTR", "Конверсия"],
  },
  {
    num: "03",
    icon: "✦",
    title: "AI-визуалы",
    subtitle: "Midjourney · Flux",
    desc: "Генерирую уникальный визуал за часы. Без фотостудии, без долгих согласований — готово к публикации.",
    tags: ["AI", "Midjourney", "Flux", "Быстро"],
  },
  {
    num: "04",
    icon: "◈",
    title: "Дизайн упаковки",
    subtitle: "Print-ready",
    desc: "От идеи до макета, готового к производству. Этикетка, коробка, стикер — коммерческий уровень с первой итерации.",
    tags: ["Упаковка", "Print", "Этикетка"],
  },
];

function Services() {
  return (
    <section id="services" className="py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Услуги</Label>
          <m.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-14"
          >
            Что делаю
          </m.h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((s) => (
            <Reveal key={s.num}>
              <m.div
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-7 hover:border-accent/30 hover:bg-surface-2 transition-all duration-300 cursor-default"
              >
                {/* Number */}
                <span className="absolute top-6 right-7 text-xs font-mono text-zinc-700">
                  {s.num}
                </span>

                {/* Icon */}
                <span className="text-2xl mb-4 block">{s.icon}</span>

                <h3 className="text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="text-sm text-accent/70 font-mono mb-3">
                  {s.subtitle}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[11px] font-mono text-zinc-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              </m.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CASES ───────────────────────────────────────────────────────────────────
const CASES = [
  {
    id: 1,
    title: "Карточки для бренда натуральной косметики",
    result: "+34% CTR · ×2.1 конверсия",
    tags: ["WB", "Beauty"],
    gradient: "from-violet-900/80 via-purple-800/60 to-fuchsia-900/80",
    accent: "#C084FC",
    shapes: [
      { w: 140, h: 190, x: "58%", y: "8%", r: 12, op: 0.9 },
      { w: 110, h: 190, x: "74%", y: "18%", r: 12, op: 0.6 },
      { w: 80, h: 190, x: "87%", y: "28%", r: 12, op: 0.35 },
    ],
  },
  {
    id: 2,
    title: "HERO-экран для бренда умной электроники",
    result: "+28% CTR за первую неделю",
    tags: ["Ozon", "Electronics"],
    gradient: "from-blue-950/80 via-blue-800/60 to-cyan-900/70",
    accent: "#38BDF8",
    shapes: [
      { w: 200, h: 130, x: "52%", y: "20%", r: 16, op: 0.85 },
      { w: 160, h: 40, x: "55%", y: "60%", r: 8, op: 0.5 },
      { w: 120, h: 40, x: "55%", y: "72%", r: 8, op: 0.3 },
    ],
  },
  {
    id: 3,
    title: "AI-визуалы для линейки функциональных напитков",
    result: "В 3× быстрее продакшна · бюджет −70%",
    tags: ["AI", "FMCG"],
    gradient: "from-emerald-950/80 via-teal-800/60 to-green-900/70",
    accent: "#34D399",
    shapes: [
      { w: 60, h: 180, x: "56%", y: "10%", r: 30, op: 0.9 },
      { w: 60, h: 180, x: "67%", y: "18%", r: 30, op: 0.65 },
      { w: 60, h: 180, x: "78%", y: "26%", r: 30, op: 0.4 },
    ],
  },
  {
    id: 4,
    title: "Карточки для бренда уличной одежды",
    result: "Топ-3 выдачи через 14 дней",
    tags: ["WB", "Fashion"],
    gradient: "from-orange-950/80 via-amber-800/60 to-yellow-900/70",
    accent: "#FBBF24",
    shapes: [
      { w: 150, h: 200, x: "58%", y: "5%", r: 8, op: 0.9 },
      { w: 110, h: 200, x: "73%", y: "15%", r: 8, op: 0.55 },
    ],
  },
  {
    id: 5,
    title: "Дизайн упаковки для линейки здорового питания",
    result: "Выход в розничную сеть",
    tags: ["Packaging", "Food"],
    gradient: "from-rose-950/80 via-pink-800/60 to-red-900/70",
    accent: "#FB7185",
    shapes: [
      { w: 110, h: 160, x: "58%", y: "15%", r: 16, op: 0.9 },
      { w: 90, h: 160, x: "71%", y: "23%", r: 16, op: 0.6 },
      { w: 70, h: 160, x: "82%", y: "31%", r: 16, op: 0.35 },
    ],
  },
  {
    id: 6,
    title: "HERO + карточки для премиум-бренда на Ozon",
    result: "+41% CTR · рост в Топ-10 категории",
    tags: ["Ozon", "Premium"],
    gradient: "from-zinc-900/90 via-neutral-800/70 to-stone-900/80",
    accent: "#CBFF00",
    shapes: [
      { w: 180, h: 120, x: "52%", y: "22%", r: 14, op: 0.85 },
      { w: 140, h: 36, x: "54%", y: "58%", r: 8, op: 0.5 },
      { w: 100, h: 36, x: "54%", y: "70%", r: 8, op: 0.3 },
    ],
  },
];

type Shape = { w: number; h: number; x: string; y: string; r: number; op: number };

function CaseCard({ c }: { c: (typeof CASES)[0] }) {
  return (
    <Reveal>
      <m.article
        variants={fadeUp}
        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} border border-white/[0.07] h-[320px] md:h-[360px] cursor-default`}
      >
        {/* Abstract mockup shapes */}
        {(c.shapes as Shape[]).map((s, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute pointer-events-none transition-all duration-500 group-hover:scale-105"
            style={{
              width: s.w,
              height: s.h,
              left: s.x,
              top: s.y,
              borderRadius: s.r,
              background: `linear-gradient(145deg, ${c.accent}22, ${c.accent}08)`,
              border: `1px solid ${c.accent}${Math.round(s.op * 30).toString(16).padStart(2, "0")}`,
              opacity: s.op,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-7">
          {/* Tags */}
          <div className="flex gap-2 mb-3">
            {c.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium"
                style={{
                  background: `${c.accent}22`,
                  color: c.accent,
                  border: `1px solid ${c.accent}44`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="text-base md:text-lg font-semibold text-white leading-snug mb-2.5">
            {c.title}
          </h3>

          {/* Result */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: c.accent }}>
              ↑
            </span>
            <span className="text-sm font-mono text-zinc-300">{c.result}</span>
          </div>
        </div>
      </m.article>
    </Reveal>
  );
}

function Cases() {
  return (
    <section id="cases" className="py-28 md:py-36 bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Кейсы</Label>
          <m.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
          >
            Проекты
          </m.h2>
          <m.p variants={fadeUp} className="text-zinc-500 text-base mb-14">
            Реальные результаты — CTR, позиции в выдаче, конверсия
          </m.p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASES.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY ME ───────────────────────────────────────────────────────────────────
const WHY = [
  {
    n: "01",
    title: "Работа на результат",
    desc: "Не «красиво» — а CTR и продажи. Дизайн — это инструмент, а не искусство.",
  },
  {
    n: "02",
    title: "Знаю маркетплейсы изнутри",
    desc: "Понимаю алгоритмы, конкурентный анализ, логику выдачи WB и Ozon.",
  },
  {
    n: "03",
    title: "AI как конкурентное преимущество",
    desc: "Midjourney, Flux, ControlNet — генерирую уникальный визуал за часы, а не дни.",
  },
  {
    n: "04",
    title: "Коммерческий уровень",
    desc: "Дизайн как у топ-продавцов. Без стоков, без шаблонов, без «просто красиво».",
  },
  {
    n: "05",
    title: "Скорость без потери качества",
    desc: "Первые концепции — за 24–48 часов. Правки — в тот же день.",
  },
];

function WhyMe() {
  return (
    <section className="py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Почему я</Label>
          <m.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-14"
          >
            Как я работаю
          </m.h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
          {WHY.map((item, i) => (
            <Reveal key={item.n}>
              <m.div
                variants={fadeUp}
                className={`relative bg-canvas p-8 group hover:bg-surface transition-colors duration-300 ${
                  i === WHY.length - 1 && WHY.length % 3 !== 0
                    ? "md:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <span className="block text-[42px] font-bold text-white/[0.06] font-mono mb-5 leading-none group-hover:text-accent/15 transition-colors duration-300">
                  {item.n}
                </span>
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </m.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────
const PROCESS = [
  {
    n: "01",
    title: "Бриф",
    desc: "Разбираем задачу, нишу, конкурентов и цели.",
  },
  {
    n: "02",
    title: "Анализ",
    desc: "Смотрю топ выдачи, нахожу точки роста и слабые места.",
  },
  {
    n: "03",
    title: "Концепция",
    desc: "Предлагаю 2–3 направления на выбор.",
  },
  {
    n: "04",
    title: "Производство",
    desc: "Дизайн, итерации, правки — до финального результата.",
  },
  {
    n: "05",
    title: "Сдача",
    desc: "Готовые файлы в нужных форматах. Без доработок за доплату.",
  },
];

function Process() {
  return (
    <section id="process" className="py-28 md:py-36 bg-surface/20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Процесс</Label>
          <m.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-14"
          >
            Как работаем
          </m.h2>
        </Reveal>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-[28px] left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(203,255,0,0.2) 15%, rgba(203,255,0,0.2) 85%, transparent)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS.map((step) => (
              <Reveal key={step.n}>
                <m.div
                  variants={fadeUp}
                  className="relative flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-canvas p-6 hover:border-accent/25 hover:bg-surface transition-all duration-300"
                >
                  {/* Circle number */}
                  <div className="w-10 h-10 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-accent">
                      {step.n}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </m.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────────
function Contacts() {
  return (
    <section id="contacts" className="py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-surface p-10 md:p-16">
            {/* Glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, #CBFF00 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            <div className="relative">
              <m.p
                variants={fadeUp}
                className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent mb-5"
              >
                Контакты
              </m.p>
              <m.h2
                variants={fadeUp}
                className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4"
              >
                Готов к работе?
              </m.h2>
              <m.p
                variants={fadeUp}
                className="text-lg text-zinc-400 mb-10 max-w-[480px]"
              >
                Расскажите о задаче — отвечу в течение часа и предложу решение.
              </m.p>

              <m.div
                variants={fadeUp}
                className="flex flex-wrap gap-4"
              >
                <a
                  href={TG_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors duration-200 shadow-[0_0_40px_-8px_rgba(203,255,0,0.5)]"
                >
                  <TelegramIcon />
                  Написать в Telegram
                </a>
                <a
                  href={BEHANCE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full border border-white/15 text-white text-sm font-medium hover:border-white/30 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <BehanceIcon />
                  Behance
                </a>
              </m.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-8">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-mono text-zinc-700 uppercase tracking-widest">
          MAX<span className="text-accent/50">.</span>DESIGN
        </span>
        <div className="flex items-center gap-6">
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Telegram
          </a>
          <a
            href={BEHANCE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Behance
          </a>
        </div>
        <span className="text-xs text-zinc-800">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zm-7.shutterstock 2c.182-.629.29-1.36.29-2.2 0-2.042-.873-3.354-2.483-3.354-1.649 0-2.604 1.331-2.604 3.354v2.2h4.797zM7.628 23H0V1h7.628c4.46 0 7.179 1.765 7.179 5.17 0 2.37-1.35 3.953-3.43 4.736C13.85 11.685 15.5 13.3 15.5 15.94c0 4.244-3.208 7.06-7.872 7.06zm-.952-14.5c2.006 0 3.126-.968 3.126-2.742 0-1.79-1.12-2.658-3.126-2.658H3V8.5h3.676zm.337 8.4c2.2 0 3.41-1.082 3.41-3.038 0-1.957-1.21-2.962-3.41-2.962H3V16.9h4.013z" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <div className="grain bg-canvas text-white min-h-[100dvh]">
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Cases />
      <WhyMe />
      <Process />
      <Contacts />
      <Footer />
    </div>
  );
}
