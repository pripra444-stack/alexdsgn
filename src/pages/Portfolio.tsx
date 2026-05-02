import { useRef, useEffect } from "react";
import { m, useInView, useMotionValue, useTransform, animate } from "framer-motion";

// ─── Links ───────────────────────────────────────────────────────────────────
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

// ─── Count-up animation ───────────────────────────────────────────────────────
function CountUp({
  to,
  prefix = "+",
  suffix = "%",
  duration = 1.8,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(count, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return ctrl.stop;
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref}>
      {prefix}
      <m.span>{rounded}</m.span>
      {suffix}
    </span>
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
        <a
          href="#"
          className="text-sm font-semibold tracking-[0.18em] uppercase text-white"
        >
          MAX<span className="text-accent">.</span>DESIGN
        </a>
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

// ─── HERO — floating product cards ───────────────────────────────────────────
//
// IMPORTANT: cards are SOURCE-OF-TRUTH design assets — do NOT recreate via CSS.
// Drop the 4 finished card images (PNG with transparent background recommended)
// into:
//   public/hero/card-headphones.png
//   public/hero/card-drill.png
//   public/hero/card-thermos.png
//   public/hero/card-serum.png
//
// Only positioning / rotation / float-animation / glow are added in code.

type HeroCard = {
  id: string;
  title: string; // alt text only — never rendered as visible text
  img: string;   // path under /public — single <img> tag, no CSS card chrome
  metric?: {
    label: string;
    num: number;
    prefix?: string;
    suffix?: string;
    chart?: "line" | "ring";
  };
  rotate: number;
  floatY: number;
  dur: number;
  delay: number;
  side: "left" | "right";
  vSide: "top" | "bottom";
};

const HERO_CARDS: HeroCard[] = [
  {
    id: "headphones",
    title: "Карточка наушников",
    img: "/hero/card-headphones.png",
    metric: { label: "CTR", num: 32, chart: "line" },
    rotate: -9,
    floatY: 14,
    dur: 5,
    delay: 0,
    side: "left",
    vSide: "top",
  },
  {
    id: "drill",
    title: "Карточка дрели",
    img: "/hero/card-drill.png",
    metric: { label: "Просмотры", num: 47, chart: "line" },
    rotate: 7,
    floatY: 10,
    dur: 4.5,
    delay: 1.3,
    side: "right",
    vSide: "top",
  },
  {
    id: "thermos",
    title: "Карточка термобутылки",
    img: "/hero/card-thermos.png",
    rotate: -5,
    floatY: 16,
    dur: 5.5,
    delay: 0.7,
    side: "left",
    vSide: "bottom",
  },
  {
    id: "serum",
    title: "Карточка сыворотки",
    img: "/hero/card-serum.png",
    metric: { label: "Конверсия", num: 28, chart: "ring" },
    rotate: 8,
    floatY: 12,
    dur: 4.8,
    delay: 2,
    side: "right",
    vSide: "bottom",
  },
];

/** Upward trend line SVG — matches the screenshot's chart lines */
function TrendLine({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="52"
      height="20"
      viewBox="0 0 52 20"
      fill="none"
      style={{ transform: flip ? "scaleX(-1)" : "none", marginTop: 5 }}
    >
      <polyline
        points="2,17 11,11 21,13 32,5 42,8 50,1"
        stroke="#CBFF00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

/** Donut/ring progress chart — used for the conversion metric */
function RingChart() {
  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = c * 0.72;
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ marginTop: 6 }}
      aria-hidden
    >
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="#CBFF00"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={c * 0.25}
        opacity="0.75"
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}

function FloatingCard({ card }: { card: HeroCard }) {
  const isLeft = card.side === "left";
  const isBottom = card.vSide === "bottom";

  const posClass = [
    isLeft ? "left-[3%]" : "right-[3%]",
    isBottom ? "bottom-0" : "top-14",
  ].join(" ");

  // 3D tilt: steep angle — outer corner faces viewer
  const rotX = isBottom ? 10 : -10;
  const rotY = isLeft ? 22 : -22;

  // Metric badge: flat, outside the 3D wrapper so it stays upright
  const metricStyle: React.CSSProperties = card.metric
    ? {
        position: "absolute",
        zIndex: 20,
        top: isBottom ? "auto" : 16,
        bottom: isBottom ? 16 : "auto",
        ...(isLeft
          ? { right: -84, textAlign: "left" as const }
          : { left: -84, textAlign: "right" as const }),
        width: 78,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: isLeft ? "flex-start" : "flex-end",
      }
    : {};

  return (
    <m.div
      className={`absolute ${posClass} w-[300px] lg:w-[320px]`}
      animate={{ y: [0, -card.floatY, 0] }}
      transition={{
        duration: card.dur,
        ease: "easeInOut",
        repeat: Infinity,
        delay: card.delay,
      }}
    >
      {/* ── Metric badge — flat, NOT inside the 3D wrapper ── */}
      {card.metric && (
        <div style={metricStyle}>
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "#666",
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              lineHeight: 1.6,
            }}
          >
            {card.metric.label}
          </span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#CBFF00",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            <CountUp to={card.metric.num} duration={2} />
          </span>
          {card.metric.chart === "ring" ? (
            <RingChart />
          ) : (
            <TrendLine flip={!isLeft} />
          )}
        </div>
      )}

      {/* ── 3D glass card: steep perspective tilt toward corner ── */}
      <div
        style={{
          transform: `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(${card.rotate}deg)`,
          position: "relative",
          opacity: 0.92,
        }}
      >
        {/* Neon glass shell:
            - overflow:hidden clips the PNG's rectangular white frame
            - scale(1.09) pushes the frame outside the rounded clip
            - border = lime neon edge
            - multi-layer box-shadow = inner glow + outer atmospheric halo */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(203,255,0,0.38)",
            boxShadow: [
              "0 0 0 1px rgba(203,255,0,0.10)",          /* tight rim */
              "0 0 18px 2px rgba(203,255,0,0.30)",       /* close neon glow */
              "0 0 55px 8px rgba(203,255,0,0.12)",       /* wide halo */
              "inset 0 0 22px rgba(203,255,0,0.06)",     /* inner glass light */
              "0 28px 55px rgba(0,0,0,0.80)",            /* depth shadow */
            ].join(", "),
          }}
        >
          <img
            src={card.img}
            alt={card.title}
            loading="eager"
            decoding="async"
            draggable={false}
            className="block w-full h-auto select-none"
            style={{
              transform: "scale(1.09)",
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Under-card green glow */}
        <div
          aria-hidden
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-52 h-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(203,255,0,0.32) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
      </div>
    </m.div>
  );
}

/** Neon light waves sweeping across the hero background */
function HeroStreaks() {
  // Wave paths: smooth sinusoidal curves sweeping full width
  // Each wave is rendered 3×: wide halo → mid glow → bright core
  const waves = [
    // upper band — sweeps from left edge through top-left card area, arcs toward center-top
    "M -100 180  C 200 60,  480 320, 760 200  S 1200 40,  1500 180  S 1800 320, 2020 220",
    // second wave — offset lower, opposite phase
    "M -100 340  C 240 480, 520 220, 820 360  S 1280 480, 1560 320  S 1840 180, 2020 340",
    // mid wave — cuts through card zone at center height
    "M -100 520  C 280 380, 600 620, 900 480  S 1360 340, 1640 500  S 1880 640, 2020 500",
    // lower band — mirrors upper, feeds bottom-left/right cards
    "M -100 700  C 220 840, 540 580, 840 720  S 1320 860, 1600 700  S 1860 560, 2020 700",
    // bottom edge sweep
    "M -100 860  C 300 740, 640 920, 960 820  S 1440 700, 1740 860  S 1940 960, 2020 860",
  ];

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1920 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 5 }}
    >
      <defs>
        <filter id="wH" x="-60%" y="-300%" width="220%" height="700%">
          <feGaussianBlur stdDeviation="32" />
        </filter>
        <filter id="wG" x="-20%" y="-150%" width="140%" height="400%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="wC" x="-5%" y="-60%" width="110%" height="220%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>

        {/* Horizontal mask: bright on left+right edges, transparent in center */}
        <linearGradient id="edgeFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="white" stopOpacity="1"   />
          <stop offset="18%"  stopColor="white" stopOpacity="1"   />
          <stop offset="36%"  stopColor="white" stopOpacity="0"   />
          <stop offset="64%"  stopColor="white" stopOpacity="0"   />
          <stop offset="82%"  stopColor="white" stopOpacity="1"   />
          <stop offset="100%" stopColor="white" stopOpacity="1"   />
        </linearGradient>
        <mask id="edgeMask">
          <rect x="0" y="0" width="1920" height="900" fill="url(#edgeFade)" />
        </mask>
      </defs>

      <g style={{ mixBlendMode: "screen" }} mask="url(#edgeMask)">
        {waves.map((d, i) => {
          const baseOp = [0.22, 0.16, 0.20, 0.16, 0.12][i];
          const glowOp = [0.70, 0.52, 0.62, 0.50, 0.40][i];
          const coreOp = [1.00, 0.88, 0.95, 0.82, 0.65][i];
          return (
            <g key={i}>
              {/* halo */}
              <path d={d} stroke="#CBFF00" strokeWidth="90" fill="none"
                filter="url(#wH)" opacity={baseOp} strokeLinecap="round" />
              {/* glow */}
              <path d={d} stroke="#CBFF00" strokeWidth="10" fill="none"
                filter="url(#wG)" opacity={glowOp} strokeLinecap="round" />
              {/* core */}
              <path d={d} stroke="#CBFF00" strokeWidth="1.6" fill="none"
                filter="url(#wC)" opacity={coreOp} strokeLinecap="round" />
            </g>
          );
        })}

        {/* floating glint particles */}
        {[
          [160,  150, 2.2, 0.85], [310,  90,  1.4, 0.65], [420,  270, 1.8, 0.60],
          [680,  200, 1.2, 0.50], [890,  420, 2.0, 0.70], [1060, 340, 1.4, 0.55],
          [1240, 180, 1.8, 0.60], [1440, 310, 2.2, 0.80], [1620, 120, 1.4, 0.65],
          [1780, 250, 1.6, 0.55], [240,  680, 1.8, 0.70], [520,  760, 1.4, 0.55],
          [780,  640, 2.0, 0.75], [1100, 720, 1.4, 0.55], [1380, 660, 1.8, 0.65],
          [1680, 740, 2.2, 0.80], [1840, 620, 1.4, 0.55],
        ].map(([cx, cy, r, op], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#CBFF00"
            opacity={op} filter="url(#wC)" />
        ))}
      </g>
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16">

      {/* ── Corner ambient glows (subtle, since wisps add their own light) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -left-40 -top-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(203,255,0,0.07) 0%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute -right-40 -top-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(203,255,0,0.07) 0%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute -left-40 bottom-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(203,255,0,0.05) 0%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute -right-40 bottom-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(203,255,0,0.05) 0%, transparent 60%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* ── Wisp / streak energy lines (z-5, behind cards) ── */}
      <HeroStreaks />

      {/* ── Floating product cards (visible md+) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        {HERO_CARDS.map((card) => (
          <FloatingCard key={card.id} card={card} />
        ))}
      </div>

      {/* ── Center text content ── */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-center gap-10 xl:gap-14">

        {/* ── Avatar photo ── */}
        <div className="hidden lg:block flex-shrink-0">
          <div
            className="relative w-[200px] xl:w-[230px] rounded-3xl overflow-hidden"
            style={{
              border: "1px solid rgba(203,255,0,0.30)",
              boxShadow: "0 0 24px rgba(203,255,0,0.20), 0 0 60px rgba(203,255,0,0.08)",
              aspectRatio: "3/4",
            }}
          >
            <img
              src="/hero/avatar.png"
              alt="Max"
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            {/* subtle neon overlay on bottom */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(203,255,0,0.08), transparent)",
              }}
            />
          </div>
        </div>

        <div className="max-w-[480px]">

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
            className="text-[clamp(2.1rem,4.5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white"
          >
            Создаю продающие карточки и HERO-визуалы для{" "}
            <span className="text-accent">WB и Ozon</span>
          </m.h1>

          {/* Sub */}
          <m.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-zinc-400 leading-relaxed"
          >
            Помогаю выделиться в выдаче и увеличить CTR через коммерческий
            дизайн и AI-визуалы
          </m.p>

          {/* Platform pills */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mt-6"
          >
            {["WB", "Ozon", "e-commerce", "упаковка"].map((p) => (
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
            className="flex flex-wrap items-center gap-4 mt-8"
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

          {/* Stats */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-8 mt-12 pt-12 border-t border-white/[0.06]"
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
        </div>{/* end photo+text flex */}
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
                <span className="absolute top-6 right-7 text-xs font-mono text-zinc-700">
                  {s.num}
                </span>
                <span className="text-2xl mb-4 block">{s.icon}</span>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-accent/70 font-mono mb-3">{s.subtitle}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
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
                <div className="absolute bottom-0 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-7">
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: c.accent }}>↑</span>
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
          <m.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
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
  { n: "01", title: "Работа на результат", desc: "Не «красиво» — а CTR и продажи. Дизайн — это инструмент, а не искусство." },
  { n: "02", title: "Знаю маркетплейсы изнутри", desc: "Понимаю алгоритмы, конкурентный анализ, логику выдачи WB и Ozon." },
  { n: "03", title: "AI как конкурентное преимущество", desc: "Midjourney, Flux, ControlNet — генерирую уникальный визуал за часы, а не дни." },
  { n: "04", title: "Коммерческий уровень", desc: "Дизайн как у топ-продавцов. Без стоков, без шаблонов, без «просто красиво»." },
  { n: "05", title: "Скорость без потери качества", desc: "Первые концепции — за 24–48 часов. Правки — в тот же день." },
];

function WhyMe() {
  return (
    <section className="py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Почему я</Label>
          <m.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-14">
            Как я работаю
          </m.h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
          {WHY.map((item) => (
            <Reveal key={item.n}>
              <m.div
                variants={fadeUp}
                className="relative bg-canvas p-8 group hover:bg-surface transition-colors duration-300"
              >
                <span className="block text-[42px] font-bold text-white/[0.06] font-mono mb-5 leading-none group-hover:text-accent/15 transition-colors duration-300">
                  {item.n}
                </span>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
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
  { n: "01", title: "Бриф", desc: "Разбираем задачу, нишу, конкурентов и цели." },
  { n: "02", title: "Анализ", desc: "Смотрю топ выдачи, нахожу точки роста и слабые места." },
  { n: "03", title: "Концепция", desc: "Предлагаю 2–3 направления на выбор." },
  { n: "04", title: "Производство", desc: "Дизайн, итерации, правки — до финального результата." },
  { n: "05", title: "Сдача", desc: "Готовые файлы в нужных форматах. Без доработок за доплату." },
];

function Process() {
  return (
    <section id="process" className="py-28 md:py-36 bg-surface/20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Процесс</Label>
          <m.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-14">
            Как работаем
          </m.h2>
        </Reveal>
        <div className="relative">
          <div
            aria-hidden
            className="hidden lg:block absolute top-[28px] left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(203,255,0,0.2) 15%, rgba(203,255,0,0.2) 85%, transparent)" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS.map((step) => (
              <Reveal key={step.n}>
                <m.div
                  variants={fadeUp}
                  className="relative flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-canvas p-6 hover:border-accent/25 hover:bg-surface transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-accent">{step.n}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1.5">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
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
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, #CBFF00 0%, transparent 70%)", filter: "blur(60px)" }}
            />
            <div className="relative">
              <m.p variants={fadeUp} className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent mb-5">
                Контакты
              </m.p>
              <m.h2 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                Готов к работе?
              </m.h2>
              <m.p variants={fadeUp} className="text-lg text-zinc-400 mb-10 max-w-[480px]">
                Расскажите о задаче — отвечу в течение часа и предложу решение.
              </m.p>
              <m.div variants={fadeUp} className="flex flex-wrap gap-4">
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
          <a href={TG_LINK} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Telegram</a>
          <a href={BEHANCE_LINK} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">Behance</a>
        </div>
        <span className="text-xs text-zinc-800">© {new Date().getFullYear()}</span>
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
    <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M20 4h8v2h-8zM6 4h9c3 0 5 1.5 5 4.5S17 13 14 13H6zm0 11h9c3.5 0 6 1.8 6 5.2S18.5 26 15 26H6zM9 7v4h4c1.5 0 2.5-.8 2.5-2S14.5 7 13 7zm0 11v5h5c1.8 0 3-1 3-2.5S15.8 18 14 18zm13.5 0c-3 0-5.5 2-5.5 5.5S19.5 29 22.5 29c2.3 0 4.2-1.2 5-3h-3c-.5.8-1.2 1.2-2 1.2-1.5 0-2.5-1-2.8-2.5H28v-1c0-3.3-2.2-5.7-5.5-5.7zm-2.8 4.5c.3-1.3 1.3-2 2.8-2s2.5.8 2.8 2z" />
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
