import { useRef, useEffect, useState } from "react";
import { m, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

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
// Continuous ping-pong: counts 0 → N → 0 → N … at medium speed
function CountUp({
  to,
  prefix = "+",
  suffix = "%",
  duration = 3,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const ctrl = animate(count, to, {
      duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror", // counts up then back down, forever
      repeatDelay: 0.4,     // brief pause at top and bottom
    });
    return ctrl.stop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        {/* Logo — left on desktop, hidden on mobile (appears right on mobile below) */}
        <a href="#" className="hidden md:block text-sm font-semibold tracking-[0.18em] uppercase text-white">
          ALEXDSGN
        </a>
        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a key={label} href={href}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
              {label}
            </a>
          ))}
        </nav>
        {/* Mobile: logo on right, no button */}
        <a href="#" className="md:hidden ml-auto text-sm font-semibold tracking-[0.18em] uppercase text-white">
          ALEXDSGN
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
  title: string;
  img: string;
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
  pos: React.CSSProperties;    // absolute CSS position within the card layer
  rotX: number;                // 3-D tilt: negative = top card, positive = bottom
  rotY: number;                // 3-D tilt: positive = left card, negative = right
  metricDir: "left" | "right"; // which side the metric badge extends toward
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
    pos: { top: "5%", left: "7%" },
    rotX: -10,
    rotY: 22,
    metricDir: "right",
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
    pos: { top: "5%", right: "13%" },
    rotX: -10,
    rotY: -22,
    metricDir: "left",
  },
  {
    id: "thermos",
    title: "Карточка термобутылки",
    img: "/hero/card-thermos.png",
    rotate: -5,
    floatY: 16,
    dur: 5.5,
    delay: 0.7,
    pos: { bottom: "5%", left: "7%" },
    rotX: 10,
    rotY: 22,
    metricDir: "right",
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
    pos: { bottom: "5%", right: "20%" },
    rotX: 10,
    rotY: -22,
    metricDir: "left",
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
  const isLeft   = card.metricDir === "right"; // badge extends right → card is on left side
  const isBottom = card.rotX > 0;

  // Metric badge: flat, stays upright outside the 3D wrapper
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
      className="absolute w-[300px] lg:w-[320px]"
      style={card.pos}
      animate={{ y: [0, -card.floatY, 0] }}
      transition={{
        duration: card.dur,
        ease: "easeInOut",
        repeat: Infinity,
        delay: card.delay,
      }}
      whileHover={{ scale: 1.04 }}
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

      {/* ── 3D glass card ── */}
      <div
        style={{
          transform: `perspective(700px) rotateX(${card.rotX}deg) rotateY(${card.rotY}deg) rotate(${card.rotate}deg)`,
          position: "relative",
          opacity: 0.92,
        }}
      >
        {/* Neon glass shell */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(203,255,0,0.38)",
            boxShadow: [
              "0 0 0 1px rgba(203,255,0,0.10)",
              "0 0 18px 2px rgba(203,255,0,0.30)",
              "0 0 55px 8px rgba(203,255,0,0.12)",
              "inset 0 0 22px rgba(203,255,0,0.06)",
              "0 28px 55px rgba(0,0,0,0.80)",
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
            style={{ transform: "scale(1.09)", transformOrigin: "center center" }}
          />
        </div>

        {/* Under-card green glow */}
        <div
          aria-hidden
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-52 h-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(203,255,0,0.32) 0%, transparent 70%)",
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

// Shared pulse timing — avatar photo and "продающие" use identical values to stay in sync
const PULSE = { duration: 4, ease: "easeInOut" as const, repeat: Infinity };

// ─── CYBER TUNNEL ─────────────────────────────────────────────────────────────
/** Animated concentric dashed rings — glowing orbital halo around the avatar */
function CyberTunnel() {
  const SIZE = 620;
  const CX   = SIZE / 2; // 310
  const rings = [
    { r: 118, dash: "8 14",  dur: 28, dir:  1, op: 0.55 },
    { r: 150, dash: "4 18",  dur: 38, dir: -1, op: 0.40 },
    { r: 184, dash: "14 8",  dur: 22, dir:  1, op: 0.30 },
    { r: 216, dash: "6 16",  dur: 48, dir: -1, op: 0.20 },
    { r: 248, dash: "3 22",  dur: 62, dir:  1, op: 0.13 },
    { r: 278, dash: "18 6",  dur: 34, dir: -1, op: 0.08 },
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none"
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}
    >
      <defs>
        <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {rings.map((ring, i) => (
        <m.g
          key={i}
          style={{ originX: `${CX}px`, originY: `${CX}px` }}
          animate={{ rotate: ring.dir * 360 }}
          transition={{ duration: ring.dur, ease: "linear", repeat: Infinity }}
        >
          <circle
            cx={CX}
            cy={CX}
            r={ring.r}
            fill="none"
            stroke="#CBFF00"
            strokeWidth={1}
            strokeDasharray={ring.dash}
            opacity={ring.op}
            filter="url(#cyberGlow)"
          />
        </m.g>
      ))}
    </svg>
  );
}

// ─── AUDIO WAVEFORM ───────────────────────────────────────────────────────────
/** Deterministic bar heights — computed once so they're stable across renders */
const WAVE_BARS = Array.from({ length: 32 }, (_, i) => {
  const s = i * 7.3 + 1.2;
  return {
    h:     8 + (Math.sin(s) * 0.5 + 0.5) * 56,
    dur:   1.4 + (Math.cos(s * 2.1) * 0.5 + 0.5) * 1.4,
    delay: (Math.sin(s * 1.7) * 0.5 + 0.5) * 1.2,
  };
});

/** Horizontal frequency bars — decorative band behind avatar */
function AudioWaveform() {
  return (
    <div
      aria-hidden
      className="pointer-events-none"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        width: 420,
        opacity: 0.55,
        zIndex: 0,
      }}
    >
      {WAVE_BARS.map((bar, i) => (
        <m.div
          key={i}
          style={{
            flex: "none",
            width: 3,
            background: "linear-gradient(to top, rgba(203,255,0,0.9), rgba(203,255,0,0.05))",
            borderRadius: 2,
          }}
          animate={{ height: [bar.h, bar.h * 0.22, bar.h * 0.72, bar.h * 0.18, bar.h] }}
          transition={{
            duration: bar.dur,
            ease: "easeInOut",
            repeat: Infinity,
            delay: bar.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── CONVERSION CARD ──────────────────────────────────────────────────────────
/** Analytics glassmorphism card with animated donut and stat rows */
function ConversionCard() {
  const r    = 44;
  const circ = 2 * Math.PI * r;

  return (
    <m.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 200,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(203,255,0,0.22)",
        borderRadius: 20,
        padding: "22px 18px",
        boxShadow: [
          "0 0 40px rgba(203,255,0,0.07)",
          "0 20px 50px rgba(0,0,0,0.55)",
          "inset 0 0 20px rgba(203,255,0,0.03)",
        ].join(", "),
      }}
    >
      {/* Header */}
      <p style={{
        fontSize: 9,
        fontFamily: "monospace",
        color: "#555",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: 18,
      }}>
        Аналитика · 30 дней
      </p>

      {/* Donut chart */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden>
          {/* track */}
          <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          {/* animated fill: offset ping-pongs from 28% shown → 15% → 28% */}
          <m.circle
            cx="55"
            cy="55"
            r={r}
            fill="none"
            stroke="#CBFF00"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            transform="rotate(-90 55 55)"
            opacity={0.88}
            animate={{ strokeDashoffset: [circ * 0.28, circ * 0.82, circ * 0.28] }}
            transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
          />
        </svg>
        {/* Center label */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: "#CBFF00", lineHeight: 1 }}>
            <CountUp to={28} prefix="+" suffix="%" duration={2.5} />
          </p>
          <p style={{
            fontSize: 9,
            color: "#555",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginTop: 3,
          }}>
            CTR
          </p>
        </div>
      </div>

      {/* Stat rows */}
      {[
        { label: "Конверсия", val: "+28%" },
        { label: "Просмотры", val: "+47%" },
        { label: "В корзину",  val: "×2.1"  },
      ].map(({ label, val }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 9,
          }}
        >
          <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#CBFF00", fontFamily: "monospace" }}>{val}</span>
        </div>
      ))}

      {/* Bottom neon rule */}
      <div style={{
        height: 1,
        background: "linear-gradient(to right, transparent, rgba(203,255,0,0.35), transparent)",
        marginTop: 12,
      }} />
    </m.div>
  );
}

// ─── AVATAR PANEL ────────────────────────────────────────────────────────────
function AvatarPanel() {
  return (
    // opacity pulse: 100% → 50% → 100%, slow breathe
    <m.div
      className="relative flex-shrink-0"
      style={{ width: "clamp(460px, 48vw, 680px)" }}
      animate={{ opacity: [1, 0.88, 1] }}
      transition={PULSE}
    >
      {/* Raw image — no border, no shadow, no rounded clip.
          Dark background in the PNG matches the site canvas so edges vanish. */}
      <img
        src="/hero/avatar.png"
        alt="Alex"
        className="w-full h-auto block select-none"
        draggable={false}
        style={{ filter: "drop-shadow(0 0 80px rgba(203,255,0,0.10))" }}
      />
    </m.div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-end overflow-hidden pt-16 pb-16 xl:pb-24">

      {/* ── Background photo — BG HS 1.png as full-cover hero image ── */}
      <div aria-hidden className="absolute inset-0 z-0">
        <img
          src="/hero/BG HS 2.png"
          alt=""
          className="w-full h-full object-cover object-center select-none brightness-75 md:brightness-100"
          draggable={false}
        />
        {/* gradient overlays: darken bottom-left for text legibility, dim top slightly */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to top, rgba(8,8,8,0.82) 0%, rgba(8,8,8,0.30) 45%, transparent 70%)",
              "linear-gradient(to right, rgba(8,8,8,0.55) 0%, transparent 45%)",
            ].join(", "),
          }}
        />
      </div>

      {/* ── Floating product cards — z-10 ── */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        {HERO_CARDS.map((card) => (
          <FloatingCard key={card.id} card={card} />
        ))}
      </div>

      {/* ── Animated donut analytics card — z-20, bottom-right corner ── */}
      <div
        className="hidden xl:block absolute z-20 pointer-events-none"
        style={{ right: "2%", bottom: "7%" }}
      >
        <ConversionCard />
      </div>

      {/* ── Text content — z-30, lower-left ── */}
      <div className="relative z-30 w-full max-w-[1280px] mx-auto px-5 md:px-10">
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
            className="font-luna text-[clamp(2.2rem,4.8vw,3.8rem)] font-bold leading-[1.05] tracking-[0.06em] text-white"
          >
            Создаю{" "}
            <span>продающие</span>{" "}
            карточки<br />и HERO-визуалы для{" "}
            <span className="text-accent">WB и Ozon</span>
          </m.h1>

          {/* Subtext */}
          <m.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-zinc-400 leading-relaxed"
          >
            Помогаю выделиться в выдаче и увеличить CTR через коммерческий
            дизайн и AI-визуалы
          </m.p>

          {/* CTAs */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-white/[0.08]"
          >
            {[
              { value: "40+",  label: "проектов" },
              { value: "+30%", label: "средний рост CTR" },
              { value: "24 ч", label: "первая версия" },
              { value: "AI+",  label: "инструментарий" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </m.div>

        </div>
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
    "Воронка продаж",
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
    icon: "◎",
    title: "Анализ воронки продаж",
    subtitle: "WB · Ozon · Unit-экономика",
    desc: "Разбираю, где теряются покупатели: CTR, конверсия, корзина. Нахожу точки роста и даю конкретные рекомендации по дизайну.",
    tags: ["CTR", "Конверсия", "Аналитика", "Рост"],
  },
];

// ─── Slideshow slide sets ─────────────────────────────────────────────────────
const SHOWCASE_SLIDES = [
  { img: "/hero/card%2001.png", label: "Первый слайд" },
  { img: "/hero/card%2002.png", label: "Второй слайд" },
  { img: "/hero/card%2003.png", label: "Третий слайд" },
];

const HERO_SLIDES = [
  { img: "/hero/hero%20001.png", label: "Робот-мойщик окон" },
  { img: "/hero/hero%20002.png", label: "Аппликатор Кузнецова" },
  { img: "/hero/hero%20003.png", label: "Машинка для стрижки волос" },
  { img: "/hero/hero%20004.png", label: "Наушники" },
];

const AI_SLIDES = [
  { img: "/hero/ai%20visual%20001.png", label: "Прохладительные напитки" },
  { img: "/hero/ai%20visual%20002.png", label: "Собачий корм" },
  { img: "/hero/ai%20visual%20003.png", label: "Зубная паста" },
];

const VORONKA_SLIDES = [
  { img: "/hero/voronka%2001.png", label: "Воронка 1" },
  { img: "/hero/voronka%2002.png", label: "Воронка 2" },
  { img: "/hero/voronka%2003.png", label: "Воронка 3" },
];

const PROJECT_SLIDES = [
  { img: "/hero/project%20card%2001.png", label: "Исходная карточка" },
  { img: "/hero/project%20card%2002.png", label: "Разработка воронки" },
  { img: "/hero/project%20card%2003.png", label: "Готовая карточка" },
  { img: "/hero/project%20card%2004.png", label: "Результат" },
];

const HERO_PROJECT_SLIDES = [
  { img: "/hero/hero%20project%2001.svg", label: "Исходный Hero-экран" },
  { img: "/hero/hero%20project%2002.svg", label: "Разработка" },
  { img: "/hero/hero%20project%2003.svg", label: "Готовый Hero-экран" },
  { img: "/hero/hero%20project%2004.svg", label: "Результат" },
];

const FASHION_SLIDES = [
  { img: "/hero/Project%20jacket%20Card%20001.png", label: "Задача" },
  { img: "/hero/Project%20jacket%20Card%20002.png", label: "Визуальная система" },
  { img: "/hero/Project%20jacket%20Card%20003.png", label: "Серия из 9 слайдов" },
  { img: "/hero/Project%20jacket%20Card%20004.png", label: "Результат" },
];

const SWIM_SLIDES: SlideEntry[] = [
  { component: GogglesSlide1, label: "Плохая читаемость" },
  { component: GogglesSlide2, label: "Переработка структуры" },
  { component: GogglesSlide3, label: "Новый Hero-визуал" },
  { component: GogglesSlide4, label: "Дополнительные слайды" },
];

// ─── Swim Goggles card constants ─────────────────────────────────────────────
const SWIM_BADGES = [
  { text: "ANTI-FOG",      col: "#22d3ee" },
  { text: "UV PROTECTION", col: "#86efac" },
  { text: "SOFT SILICONE", col: "#fdba74" },
  { text: "WIDE VIEW",     col: "#c4b5fd" },
] as const;

const SWIM_BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 4 + (i * 33 + 13) % 92,
  size: 2 + (i * 3 + 5) % 8,
  dur: 3 + (i * 1.1 + 0.4) % 4.5,
  delay: (i * 0.85 + 0.1) % 7,
  opa: 0.2 + (i * 0.08) % 0.45,
}));

function ServiceCard({
  s,
  idx,
  onOpen,
}: {
  s: (typeof SERVICES)[0];
  idx: number;
  onOpen?: () => void;
}) {
  const hasSlideshow = idx === 0 || idx === 1 || idx === 2 || idx === 3;
  return (
    <Reveal>
      <m.div
        variants={fadeUp}
        className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-7 hover:bg-accent hover:border-accent transition-colors duration-300"
        style={{ cursor: hasSlideshow ? "pointer" : "default" }}
        onClick={hasSlideshow ? onOpen : undefined}
      >
        <span className="absolute top-6 right-7 text-xs font-mono text-zinc-700 group-hover:text-black/40 transition-colors duration-300">{s.num}</span>
        <h3 className="text-lg font-semibold text-white group-hover:text-black transition-colors duration-300 mt-2 mb-2">{s.title}</h3>
        <p className="text-sm text-accent/70 font-mono mb-3 group-hover:text-black/55 transition-colors duration-300">{s.subtitle}</p>
        <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-black/65 transition-colors duration-300">{s.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {s.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[11px] font-mono text-zinc-500 group-hover:bg-black/10 group-hover:text-black/55 transition-colors duration-300">
              {t}
            </span>
          ))}
        </div>
        {hasSlideshow && (
          <span className="absolute bottom-4 right-5 text-[10px] font-mono text-accent/35 uppercase tracking-[0.15em] group-hover:text-black/45 transition-colors duration-200">
            смотреть примеры →
          </span>
        )}
      </m.div>
    </Reveal>
  );
}

type Slide = { img: string; label: string };

function Services() {
  const [activeSlides, setActiveSlides] = useState<Slide[] | null>(null);
  const [active, setActive] = useState(0);
  const [hovSvc, setHovSvc] = useState<number | null>(null);

  function openSlideshow(slides: Slide[]) {
    setActive(0);
    setActiveSlides(slides);
  }

  function closeSlideshow() {
    setActiveSlides(null);
  }

  const SVC_COLS = 2;
  function svcStyle(idx: number): React.CSSProperties {
    const T = "transform 0.52s cubic-bezier(0.22,1,0.36,1), filter 0.42s ease";
    if (hovSvc === null) return { transition: T, willChange: "transform" };
    if (idx === hovSvc) return {
      transition: T, willChange: "transform",
      transform: "scale(1.035) translateZ(28px)",
      zIndex: 10,
    };
    const dC = (idx % SVC_COLS) - (hovSvc % SVC_COLS);
    const dR = Math.floor(idx / SVC_COLS) - Math.floor(hovSvc / SVC_COLS);
    const rotY = dC * 22;
    const rotX = dR * -8;
    const bright = Math.max(0.48, 1 - (Math.abs(dC) + Math.abs(dR)) * 0.22);
    return {
      transition: T, willChange: "transform",
      transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(0.965) translateZ(-45px)`,
      filter: `brightness(${bright})`,
      zIndex: 4,
    };
  }

  return (
    <section id="services" className="py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Услуги</Label>
          <m.h2
            variants={fadeUp}
            className="font-luna text-4xl md:text-5xl font-bold tracking-[0.06em] text-white mb-14"
          >
            Что делаю
          </m.h2>
        </Reveal>

        <div style={{ perspective: "1000px", perspectiveOrigin: "50% 40%" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((s, idx) => (
              <div
                key={s.num}
                onMouseEnter={() => setHovSvc(idx)}
                onMouseLeave={() => setHovSvc(null)}
                style={{ position: "relative", ...svcStyle(idx) }}
              >
                <ServiceCard
                  s={s}
                  idx={idx}
                  onOpen={
                    idx === 0 ? () => openSlideshow(SHOWCASE_SLIDES) :
                    idx === 1 ? () => openSlideshow(HERO_SLIDES) :
                    idx === 2 ? () => openSlideshow(AI_SLIDES) :
                    idx === 3 ? () => openSlideshow(VORONKA_SLIDES) :
                    undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full-screen product slideshow modal ── */}
      <AnimatePresence>
        {activeSlides && (
          <m.div
            key="slideshow-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 overflow-hidden"
            style={{
              background: "rgba(8,8,8,0.94)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeSlideshow(); }}
          >
            {/* Close button */}
            <button
              onClick={closeSlideshow}
              className="absolute top-6 right-7 w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/25 transition-all duration-200"
              aria-label="Закрыть"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Top label */}
            <m.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent mb-10"
            >
              {activeSlides === HERO_SLIDES    ? "Примеры HERO-экранов"        :
               activeSlides === AI_SLIDES     ? "Примеры AI-визуалов"          :
               activeSlides === VORONKA_SLIDES ? "Анализ воронки продаж"       :
                                                 "Примеры карточек товаров"}
            </m.p>

            {/* ── MOBILE: single card + prev/next arrows ── */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
              className="flex md:hidden items-center gap-4 w-full justify-center"
            >
              {/* Prev */}
              <button
                onClick={() => setActive((active + activeSlides.length - 1) % activeSlides.length)}
                className="flex-shrink-0 w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/25 transition-all duration-200"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              {/* Active card */}
              <AnimatePresence mode="wait">
                <m.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    width: "min(72vw, 300px)",
                    flexShrink: 0,
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1.5px solid rgba(203,255,0,0.65)",
                    boxShadow: [
                      "0 0 0 1px rgba(203,255,0,0.12)",
                      "0 0 36px rgba(203,255,0,0.20)",
                      "0 20px 50px rgba(0,0,0,0.75)",
                    ].join(", "),
                  }}
                >
                  <img
                    src={activeSlides[active].img}
                    alt={activeSlides[active].label}
                    draggable={false}
                    className="block w-full h-auto select-none"
                  />
                </m.div>
              </AnimatePresence>

              {/* Next */}
              <button
                onClick={() => setActive((active + 1) % activeSlides.length)}
                className="flex-shrink-0 w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/25 transition-all duration-200"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </m.div>

            {/* ── DESKTOP: 3D coverflow ── */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="hidden md:block relative w-full"
              style={{ height: "min(62vh, 620px)", perspective: "1400px", perspectiveOrigin: "50% 50%" }}
            >
              {activeSlides.map((slide, i) => {
                const off = i - active;
                const abs = Math.abs(off);
                if (abs > 2) return null;
                const spreadX = off === 0 ? 0 : Math.sign(off) * (abs === 1 ? 255 : 460);
                const rotY    = off * -44;
                const depth   = -abs * 210;
                const scl     = [1, 0.87, 0.70][abs];
                const bright  = [1, 0.52, 0.28][abs];
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    style={{
                      position: "absolute",
                      left: "50%", top: "50%",
                      width: "min(24vw, 400px)",
                      borderRadius: 18,
                      overflow: "hidden",
                      cursor: abs > 0 ? "pointer" : "default",
                      zIndex: 10 - abs,
                      transform: `translateX(calc(-50% + ${spreadX}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${depth}px) scale(${scl})`,
                      filter: `brightness(${bright})`,
                      transition: "transform 0.58s cubic-bezier(0.22,1,0.36,1), filter 0.48s ease, border-color 0.3s ease, box-shadow 0.48s ease",
                      border: abs === 0 ? "2px solid rgba(203,255,0,0.65)" : "1.5px solid rgba(255,255,255,0.07)",
                      boxShadow: abs === 0
                        ? "0 0 0 1px rgba(203,255,0,0.10), 0 0 48px rgba(203,255,0,0.22), 0 32px 80px rgba(0,0,0,0.85)"
                        : "0 10px 40px rgba(0,0,0,0.65)",
                    }}
                  >
                    <img src={slide.img} alt={slide.label} draggable={false} className="block w-full h-auto select-none" />
                  </div>
                );
              })}
            </m.div>

            {/* Active label */}
            <AnimatePresence mode="wait">
              <m.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="mt-8 text-sm font-mono text-zinc-400 uppercase tracking-[0.18em]"
              >
                {activeSlides[active].label}
              </m.p>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex items-center gap-2 mt-3">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={activeSlides[i].label}
                  style={{
                    padding: 0,
                    border: "none",
                    borderRadius: 3,
                    background: i === active ? "#CBFF00" : "rgba(255,255,255,0.18)",
                    width: i === active ? 22 : 6,
                    height: 6,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
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
    gradient: "from-zinc-950/90 via-neutral-900/70 to-zinc-950/90",
    accent: "#CBFF00",
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
    accent: "#CBFF00",
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
    accent: "#CBFF00",
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
    accent: "#CBFF00",
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
    accent: "#CBFF00",
    shapes: [
      { w: 110, h: 160, x: "58%", y: "15%", r: 16, op: 0.9 },
      { w: 90, h: 160, x: "71%", y: "23%", r: 16, op: 0.6 },
      { w: 70, h: 160, x: "82%", y: "31%", r: 16, op: 0.35 },
    ],
  },
  {
    id: 6,
    title: "Hero + карточки для спорт-бренда на Ozon",
    result: "+28–35% CTR · очки FitSmile в Топ выдачи",
    tags: ["Ozon", "Sport"],
    gradient: "from-sky-950/90 via-cyan-900/70 to-blue-950/80",
    accent: "#CBFF00",
    shapes: [
      { w: 180, h: 120, x: "52%", y: "22%", r: 14, op: 0.85 },
      { w: 140, h: 36, x: "54%", y: "58%", r: 8, op: 0.5 },
      { w: 100, h: 36, x: "54%", y: "70%", r: 8, op: 0.3 },
    ],
  },
];

type Shape = { w: number; h: number; x: string; y: string; r: number; op: number };

// ─── Animated Case Card infrastructure ───────────────────────────────────────
function hexToRgb(hex: string): string {
  const v = hex.replace("#", "");
  return `${parseInt(v.slice(0,2),16)},${parseInt(v.slice(2,4),16)},${parseInt(v.slice(4,6),16)}`;
}

const CARD_BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  id: i, x: 4 + (i * 33 + 13) % 92,
  size: 2 + (i * 3 + 5) % 7,
  dur: 3 + (i * 1.1 + 0.4) % 4.5,
  delay: (i * 0.85 + 0.1) % 7,
  opa: 0.18 + (i * 0.08) % 0.42,
}));

const CASE_BADGES: Record<number, readonly string[]> = {
  1: ["CTR +34%",     "HYDRATION",    "ANTI-AGING",  "NATURAL"    ],
  2: ["HERO SCREEN",  "+28% CTR",     "REDESIGN",    "NEOTECH"    ],
  3: ["AI GENERATED", "×3 FASTER",    "MIDJOURNEY",  "FMCG"       ],
  4: ["ТОП-3 ВЫДАЧА", "STREET STYLE", "WB FASHION",  "MARUZE"     ],
  5: ["ECO DESIGN",   "RETAIL READY", "ORGANIC",     "HEALTHY"    ],
  6: ["ANTI-FOG",     "UV PROTECT",   "SOFT SILICONE","WIDE VIEW"  ],
};

const CASE_BG_DARK = "radial-gradient(ellipse at 50% 0%, #181818 0%, #0a0a0a 55%, #050505 100%)";
const CASE_BG: Record<number, string> = {
  1: CASE_BG_DARK, 2: CASE_BG_DARK, 3: CASE_BG_DARK,
  4: CASE_BG_DARK, 5: CASE_BG_DARK, 6: CASE_BG_DARK,
};

// ─── Product scene: Beauty / cosmetics ───────────────────────────────────────
function BeautyScene({ hovered }: { hovered: boolean }) {
  const ac = hovered ? "#111111" : "#CBFF00";
  return (
    <svg viewBox="-230 -115 460 200" style={{ width:"100%", height:"auto", overflow:"visible" }}>
      <defs>
        <linearGradient id="bsCard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a"/><stop offset="100%" stopColor="#080808"/>
        </linearGradient>
        <linearGradient id="bsImg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" stopOpacity="0.5"/><stop offset="100%" stopColor="#111111" stopOpacity="0.3"/>
        </linearGradient>
        <filter id="bsGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style={{ fillOpacity: hovered ? 0 : 1, transition: "fill-opacity 0.38s ease" }}>
      {/* Back card */}
      <g transform="rotate(-16) translate(-88,4)">
        <rect x="-40" y="-65" width="80" height="130" rx="8" fill="url(#bsCard)" stroke={ac} strokeWidth="0.8" strokeOpacity="0.32"/>
        <rect x="-32" y="-57" width="64" height="73" rx="5" fill="url(#bsImg)"/>
        <ellipse cx="0" cy="-18" rx="16" ry="20" fill={ac} opacity="0.32"/>
        <ellipse cx="0" cy="-18" rx="10" ry="13" fill={ac} opacity="0.22"/>
        <rect x="-32" y="22" width="64" height="5" rx="2.5" fill={ac} opacity="0.28"/>
        <rect x="-32" y="32" width="44" height="3.5" rx="1.5" fill={ac} opacity="0.18"/>
        <rect x="-32" y="40" width="28" height="7" rx="3" fill={ac} opacity="0.38"/>
      </g>
      {/* Middle card */}
      <g transform="rotate(-4) translate(0,-8)">
        <rect x="-40" y="-65" width="80" height="130" rx="8" fill="url(#bsCard)" stroke={ac} strokeWidth="1" strokeOpacity="0.48"/>
        <rect x="-32" y="-57" width="64" height="73" rx="5" fill="url(#bsImg)"/>
        <rect x="-8" y="-50" width="16" height="50" rx="5" fill={ac} opacity="0.48"/>
        <ellipse cx="0" cy="-54" rx="5" ry="4" fill={ac} opacity="0.58"/>
        <ellipse cx="0" cy="0" rx="12" ry="4" fill={ac} opacity="0.32"/>
        <rect x="-32" y="22" width="64" height="5" rx="2.5" fill={ac} opacity="0.33"/>
        <rect x="-32" y="32" width="44" height="3.5" rx="1.5" fill={ac} opacity="0.2"/>
        <rect x="-32" y="40" width="28" height="7" rx="3" fill={ac} opacity="0.42"/>
      </g>
      {/* Front card */}
      <g transform="rotate(13) translate(88,4)" filter={hovered ? "url(#bsGlow)" : undefined}>
        <rect x="-40" y="-65" width="80" height="130" rx="8" fill="url(#bsCard)"
          stroke={ac} strokeWidth={hovered ? 1.6 : 1.1} strokeOpacity={hovered ? 0.82 : 0.55}/>
        <rect x="-32" y="-57" width="64" height="73" rx="5" fill="url(#bsImg)"/>
        <ellipse cx="0" cy="-12" rx="24" ry="17" fill={ac} opacity="0.52"/>
        <ellipse cx="0" cy="-12" rx="16" ry="11" fill={ac} opacity="0.3"/>
        <rect x="-24" y="5" width="48" height="4" rx="2" fill={ac} opacity="0.58"/>
        <rect x="-32" y="22" width="64" height="5" rx="2.5" fill={ac} opacity="0.38"/>
        <rect x="-32" y="32" width="44" height="3.5" rx="1.5" fill={ac} opacity="0.24"/>
        <rect x="-32" y="40" width="28" height="7" rx="3" fill={ac} opacity="0.48"/>
      </g>
      </g>
    </svg>
  );
}

// ─── Product scene: Electronics HERO screen ───────────────────────────────────
function ElectronicsScene({ hovered }: { hovered: boolean }) {
  const ac = hovered ? "#111111" : "#CBFF00";
  return (
    <svg viewBox="-230 -118 460 210" style={{ width:"100%", height:"auto", overflow:"visible" }}>
      <defs>
        <linearGradient id="esScr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#181818"/><stop offset="100%" stopColor="#060606"/>
        </linearGradient>
        <filter id="esF" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style={{ fillOpacity: hovered ? 0 : 1, transition: "fill-opacity 0.38s ease" }}>
      {/* Monitor outer frame */}
      <rect x="-165" y="-92" width="330" height="196" rx="14" fill="#0d0d0d"
        stroke={ac} strokeWidth="1.5" strokeOpacity={hovered ? 0.72 : 0.55}/>
      {/* Screen bezel */}
      <rect x="-157" y="-84" width="314" height="176" rx="10" fill="url(#esScr)"/>
      {/* Nav bar */}
      <rect x="-147" y="-74" width="294" height="26" rx="4" fill="rgba(255,255,255,0.04)"/>
      <rect x="-139" y="-67" width="58" height="8" rx="4" fill={ac} opacity="0.58"/>
      <rect x="62" y="-67" width="38" height="8" rx="4" fill={ac} opacity="0.28"/>
      <rect x="108" y="-67" width="28" height="8" rx="4" fill={ac} opacity="0.28"/>
      {/* Hero left panel */}
      <rect x="-147" y="-42" width="198" height="120" rx="6" fill="rgba(255,255,255,0.04)"/>
      <rect x="-139" y="-30" width="138" height="16" rx="4" fill={ac}
        opacity={hovered ? 0.82 : 0.52} filter={hovered ? "url(#esF)" : undefined}/>
      <rect x="-139" y="-9" width="98" height="8" rx="4" fill={ac} opacity="0.28"/>
      <rect x="-139" y="5" width="78" height="8" rx="4" fill={ac} opacity="0.2"/>
      <rect x="-139" y="28" width="68" height="22" rx="6" fill={ac} opacity={hovered ? 0.72 : 0.45}/>
      {/* Hero right image panel */}
      <rect x="57" y="-42" width="90" height="120" rx="6" fill="rgba(255,255,255,0.05)"/>
      <rect x="67" y="-32" width="70" height="68" rx="8" fill="rgba(255,255,255,0.07)"/>
      <ellipse cx="102" cy="2" rx="24" ry="19" fill={ac} opacity="0.23"/>
      {/* Data dots */}
      {[0,1,2,3,4].map(i=>(
        <circle key={i} cx={-139+i*16} cy="72" r="3" fill={ac} opacity={hovered ? 0.7 : 0.38}/>
      ))}
      {/* Stand */}
      <rect x="-18" y="104" width="36" height="11" rx="4" fill="#0d0d0d" stroke={ac} strokeWidth="1" strokeOpacity="0.35"/>
      <rect x="-28" y="115" width="56" height="6" rx="3" fill="#0d0d0d" stroke={ac} strokeWidth="1" strokeOpacity="0.22"/>
      </g>
    </svg>
  );
}

// ─── Product scene: AI drinks ─────────────────────────────────────────────────
function DrinksScene({ hovered }: { hovered: boolean }) {
  const ac = hovered ? "#111111" : "#CBFF00";
  return (
    <svg viewBox="-230 -120 460 210" style={{ width:"100%", height:"auto", overflow:"visible" }}>
      <defs>
        <linearGradient id="dsBot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a1a"/><stop offset="100%" stopColor="#080808"/>
        </linearGradient>
        <linearGradient id="dsLbl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ac} stopOpacity="0.15"/>
          <stop offset="50%" stopColor={ac} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={ac} stopOpacity="0.15"/>
        </linearGradient>
        <filter id="dsF">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style={{ fillOpacity: hovered ? 0 : 1, transition: "fill-opacity 0.38s ease" }}>
      {/* Left bottle */}
      <g transform="translate(-82,10)" opacity="0.68">
        <rect x="-20" y="-90" width="40" height="140" rx="12" fill="url(#dsBot)" stroke={ac} strokeWidth="0.8" strokeOpacity="0.38"/>
        <rect x="-14" y="-28" width="28" height="55" rx="4" fill="url(#dsLbl)"/>
        <rect x="-10" y="-18" width="20" height="5" rx="2.5" fill={ac} opacity="0.68"/>
        <rect x="-10" y="-8"  width="20" height="3" rx="1.5" fill={ac} opacity="0.43"/>
        <ellipse cx="0" cy="-90" rx="12" ry="6" fill={ac} opacity="0.33"/>
        <rect x="-6" y="-104" width="12" height="14" rx="4" fill={ac} opacity="0.43"/>
      </g>
      {/* Center bottle */}
      <g transform="translate(0,0)" filter={hovered ? "url(#dsF)" : undefined}>
        <rect x="-22" y="-102" width="44" height="158" rx="13" fill="url(#dsBot)"
          stroke={ac} strokeWidth={hovered ? 2 : 1.2} strokeOpacity={hovered ? 0.92 : 0.56}/>
        <rect x="-16" y="-32" width="32" height="62" rx="5" fill="url(#dsLbl)"/>
        <rect x="-12" y="-20" width="24" height="6"  rx="3" fill={ac} opacity={hovered ? 0.92 : 0.7}/>
        <rect x="-12" y="-8"  width="24" height="4"  rx="2" fill={ac} opacity="0.48"/>
        <rect x="-12" y="2"   width="24" height="4"  rx="2" fill={ac} opacity="0.33"/>
        <text x="0" y="19" textAnchor="middle" fontSize="14" fill={ac} opacity="0.8">✦</text>
        <ellipse cx="0" cy="-102" rx="14" ry="7" fill={ac} opacity="0.43"/>
        <rect x="-7" y="-116"  width="14" height="14" rx="4" fill={ac} opacity="0.53"/>
        <rect x="-14" y="-84" width="5" height="62" rx="2.5" fill="white" opacity="0.09"/>
      </g>
      {/* Right bottle */}
      <g transform="translate(82,10)" opacity="0.68">
        <rect x="-20" y="-90" width="40" height="140" rx="12" fill="url(#dsBot)" stroke={ac} strokeWidth="0.8" strokeOpacity="0.38"/>
        <rect x="-14" y="-28" width="28" height="55" rx="4" fill="url(#dsLbl)"/>
        <rect x="-10" y="-18" width="20" height="5" rx="2.5" fill={ac} opacity="0.68"/>
        <rect x="-10" y="-8"  width="20" height="3" rx="1.5" fill={ac} opacity="0.43"/>
        <ellipse cx="0" cy="-90" rx="12" ry="6" fill={ac} opacity="0.33"/>
        <rect x="-6" y="-104" width="12" height="14" rx="4" fill={ac} opacity="0.43"/>
      </g>
      </g>
    </svg>
  );
}

// ─── Product scene: Street fashion jacket ─────────────────────────────────────
function FashionScene({ hovered }: { hovered: boolean }) {
  const ac = hovered ? "#111111" : "#CBFF00";
  return (
    <svg viewBox="-230 -125 460 215" style={{ width:"100%", height:"auto", overflow:"visible" }}>
      <defs>
        <linearGradient id="fsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a"/><stop offset="100%" stopColor="#080808"/>
        </linearGradient>
        <filter id="fsGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style={{ fillOpacity: hovered ? 0 : 1, transition: "fill-opacity 0.38s ease" }}>
      {/* Jacket body */}
      <path d="M -80 -30 C -80 -90 -60 -112 0 -112 C 60 -112 80 -90 80 -30 L 80 72 C 80 80 73 87 65 87 L -65 87 C -73 87 -80 80 -80 72 Z"
        fill="url(#fsGrad)" stroke={ac} strokeWidth={hovered ? 2 : 1.2}
        strokeOpacity={hovered ? 0.9 : 0.5} filter={hovered ? "url(#fsGlow)" : undefined}/>
      {/* Left sleeve */}
      <path d="M -80 -30 C -100 -36 -142 -22 -162 8 C -172 30 -167 52 -152 57 L -112 62 C -96 60 -86 46 -80 30 Z"
        fill="url(#fsGrad)" stroke={ac} strokeWidth="1" strokeOpacity="0.42"/>
      {/* Right sleeve */}
      <path d="M 80 -30 C 100 -36 142 -22 162 8 C 172 30 167 52 152 57 L 112 62 C 96 60 86 46 80 30 Z"
        fill="url(#fsGrad)" stroke={ac} strokeWidth="1" strokeOpacity="0.42"/>
      {/* Collar */}
      <path d="M -36 -112 L 0 -82 L 36 -112" fill="none" stroke={ac} strokeWidth="2" strokeOpacity="0.62" strokeLinecap="round"/>
      {/* Zipper */}
      <line x1="0" y1="-77" x2="0" y2="82" stroke={ac} strokeWidth="1.5" strokeOpacity="0.48" strokeDasharray="6 4"/>
      <rect x="-5" y="-80" width="10" height="8" rx="2" fill={ac} opacity="0.72"/>
      {/* Pockets */}
      <rect x="-72" y="18" width="46" height="28" rx="6" fill="none" stroke={ac} strokeWidth="1" strokeOpacity="0.42"/>
      <rect x="26"  y="18" width="46" height="28" rx="6" fill="none" stroke={ac} strokeWidth="1" strokeOpacity="0.42"/>
      {/* Cuffs */}
      <rect x="-163" y="46" width="24" height="14" rx="4" fill="none" stroke={ac} strokeWidth="1.2" strokeOpacity="0.48"/>
      <rect x="139"  y="46" width="24" height="14" rx="4" fill="none" stroke={ac} strokeWidth="1.2" strokeOpacity="0.48"/>
      {/* Brand badge */}
      <rect x="-26" y="-62" width="52" height="19" rx="4" fill={ac} opacity="0.14"/>
      <text x="0" y="-49" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ac} opacity="0.72" letterSpacing="2">MARUZE</text>
      </g>
    </svg>
  );
}

// ─── Product scene: Food packaging ───────────────────────────────────────────
function FoodScene({ hovered }: { hovered: boolean }) {
  const ac = hovered ? "#111111" : "#CBFF00";
  return (
    <svg viewBox="-230 -112 460 192" style={{ width:"100%", height:"auto", overflow:"visible" }}>
      <defs>
        <linearGradient id="pkB1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a1a"/><stop offset="100%" stopColor="#080808"/>
        </linearGradient>
        <linearGradient id="pkB2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#202020"/><stop offset="100%" stopColor="#0d0d0d"/>
        </linearGradient>
        <filter id="pkF">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style={{ fillOpacity: hovered ? 0 : 1, transition: "fill-opacity 0.38s ease" }}>
      {/* Left box */}
      <g transform="translate(-90,15)" opacity="0.72">
        <rect x="-42" y="-65" width="84" height="110" rx="8" fill="url(#pkB1)" stroke={ac} strokeWidth="0.8" strokeOpacity="0.28"/>
        <path d="M 42 -65 L 58 -78 L 58 17 L 42 30" fill={ac} opacity="0.05"/>
        <rect x="-30" y="-52" width="60" height="50" rx="5" fill={ac} opacity="0.11"/>
        <ellipse cx="0" cy="-26" rx="18" ry="22" fill={ac} opacity="0.23" transform="rotate(12)"/>
        <ellipse cx="0" cy="-26" rx="10" ry="14" fill={ac} opacity="0.16" transform="rotate(12)"/>
        <rect x="-30" y="12" width="60" height="5" rx="2.5" fill={ac} opacity="0.28"/>
        <rect x="-30" y="22" width="42" height="3.5" rx="1.5" fill={ac} opacity="0.18"/>
      </g>
      {/* Center tall box */}
      <g transform="translate(0,0)" filter={hovered ? "url(#pkF)" : undefined}>
        <rect x="-45" y="-92" width="90" height="148" rx="10" fill="url(#pkB2)"
          stroke={ac} strokeWidth={hovered ? 1.8 : 1.1} strokeOpacity={hovered ? 0.88 : 0.52}/>
        <rect x="-45" y="-92" width="90" height="20" rx="10" fill={ac} opacity="0.17"/>
        <rect x="-35" y="-63" width="70" height="80" rx="6" fill={ac} opacity="0.11"/>
        <ellipse cx="0" cy="-28" rx="16" ry="20" fill={ac} opacity="0.28" transform="rotate(8)"/>
        <ellipse cx="0" cy="-28" rx="9"  ry="13" fill={ac} opacity="0.18" transform="rotate(8)"/>
        <line x1="0" y1="-8" x2="0" y2="18" stroke={ac} strokeWidth="1.5" strokeOpacity="0.38"/>
        <rect x="-28" y="26" width="56" height="7" rx="3.5" fill={ac} opacity={hovered ? 0.65 : 0.38}/>
        <rect x="-20" y="37" width="40" height="5"  rx="2.5" fill={ac} opacity="0.26"/>
        <rect x="-15" y="46" width="30" height="5"  rx="2.5" fill={ac} opacity="0.18"/>
        <rect x="-36" y="-82" width="6" height="128" rx="3" fill="white" opacity="0.06"/>
      </g>
      {/* Right pouch */}
      <g transform="translate(90,20)" opacity="0.72">
        <path d="M -35 -56 Q -38 -72 0 -74 Q 38 -72 35 -56 L 35 52 Q 35 62 0 64 Q -35 62 -35 52 Z"
          fill="url(#pkB1)" stroke={ac} strokeWidth="0.8" strokeOpacity="0.34"/>
        <ellipse cx="0" cy="-62" rx="28" ry="8" fill={ac} opacity="0.23"/>
        <rect x="-25" y="-42" width="50" height="56" rx="5" fill={ac} opacity="0.1"/>
        <ellipse cx="0" cy="-14" rx="14" ry="17" fill={ac} opacity="0.2"/>
        <rect x="-20" y="22" width="40" height="5" rx="2.5" fill={ac} opacity="0.28"/>
        <rect x="-15" y="31" width="30" height="4" rx="2"   fill={ac} opacity="0.18"/>
      </g>
      </g>
    </svg>
  );
}

// ─── Swim Goggles: SVG scene ──────────────────────────────────────────────────
function GogglesScene({ hovered }: { hovered: boolean }) {
  const ac = hovered ? "#111111" : "#CBFF00";
  return (
    <svg viewBox="-230 -130 460 210" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <radialGradient id="gsLensL" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#2a2a2a" stopOpacity="0.7"/>
          <stop offset="50%" stopColor="#141414" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#060606" stopOpacity="0.95"/>
        </radialGradient>
        <radialGradient id="gsLensR" cx="65%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#2a2a2a" stopOpacity="0.7"/>
          <stop offset="50%" stopColor="#141414" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#060606" stopOpacity="0.95"/>
        </radialGradient>
        <radialGradient id="gsDeep" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.4"/>
          <stop offset="55%" stopColor="#0d0d0d" stopOpacity="0.82"/>
          <stop offset="100%" stopColor="#050505" stopOpacity="0.97"/>
        </radialGradient>
        <linearGradient id="gsFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#080808"/>
        </linearGradient>
        <clipPath id="gsClipL"><ellipse cx="-100" cy="-2" rx="90" ry="76"/></clipPath>
        <clipPath id="gsClipR"><ellipse cx="100" cy="-2" rx="90" ry="76"/></clipPath>
        <filter id="gsGlowSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style={{ fillOpacity: hovered ? 0 : 1, transition: "fill-opacity 0.38s ease" }}>

      {/* Hover glow aura */}
      {hovered && (
        <ellipse cx="0" cy="-2" rx="208" ry="94" fill="none"
          stroke={ac} strokeWidth="1.5" strokeOpacity="0.28"
          filter="url(#gsGlowSoft)"/>
      )}

      {/* Left strap */}
      <path d="M -190 -8 C -215 -2 -226 18 -220 40" stroke="#080808" strokeWidth="20" strokeLinecap="round" fill="none"/>
      <path d="M -190 -8 C -215 -2 -226 18 -220 40" stroke="#181818" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <path d="M -190 -8 C -215 -2 -226 18 -220 40" stroke="#2a2a2a" strokeWidth="5"  strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Right strap */}
      <path d="M 190 -8 C 215 -2 226 18 220 40" stroke="#080808" strokeWidth="20" strokeLinecap="round" fill="none"/>
      <path d="M 190 -8 C 215 -2 226 18 220 40" stroke="#181818" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <path d="M 190 -8 C 215 -2 226 18 220 40" stroke="#2a2a2a" strokeWidth="5"  strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Left lens: dark + subtle highlight lines */}
      <g clipPath="url(#gsClipL)">
        <ellipse cx="-100" cy="-2" rx="90" ry="76" fill="url(#gsDeep)"/>
        <path d="M -165 -58 Q -136 -44 -108 -54 Q -80 -64 -55 -50" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none"/>
        <path d="M -165 -38 Q -139 -26 -104 -34 Q -72 -42 -50 -31" stroke="rgba(255,255,255,0.04)" strokeWidth="1"   fill="none"/>
        <path d="M -165 -18 Q -140  -8 -100 -14 Q -62 -20 -46 -12" stroke="rgba(255,255,255,0.02)" strokeWidth="1"   fill="none"/>
        <ellipse cx="-100" cy="40" rx="14" ry="6" fill="rgba(5,5,5,0.72)"/>
        <ellipse cx="-100" cy="29" rx="8" ry="12" fill="rgba(5,5,5,0.72)"/>
        <path d="M -123 16 Q -100 13 -77 16" stroke="rgba(5,5,5,0.55)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
      <ellipse cx="-100" cy="-2" rx="90" ry="76" fill="url(#gsLensL)"/>
      <ellipse cx="-100" cy="-2" rx="97" ry="83" fill="none" stroke="url(#gsFrame)" strokeWidth="16"/>
      <ellipse cx="-100" cy="-2" rx="90" ry="76" fill="none" stroke={ac}
        strokeWidth={hovered ? 2 : 1.2} strokeOpacity={hovered ? 0.8 : 0.55}/>

      {/* Right lens: dark + subtle highlight lines */}
      <g clipPath="url(#gsClipR)">
        <ellipse cx="100" cy="-2" rx="90" ry="76" fill="url(#gsDeep)"/>
        <path d="M 55  -58 Q 84  -44 112 -54 Q 140 -64 165 -50" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none"/>
        <path d="M 50  -38 Q 79  -26 104 -34 Q 132 -42 160 -31" stroke="rgba(255,255,255,0.04)" strokeWidth="1"   fill="none"/>
        <path d="M 48  -18 Q 72  -8  100 -14 Q 128 -20 158 -12" stroke="rgba(255,255,255,0.02)" strokeWidth="1"   fill="none"/>
        <ellipse cx="100" cy="40" rx="14" ry="6" fill="rgba(5,5,5,0.72)"/>
        <ellipse cx="100" cy="29" rx="8" ry="12" fill="rgba(5,5,5,0.72)"/>
        <path d="M 77 16 Q 100 13 123 16" stroke="rgba(5,5,5,0.55)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
      <ellipse cx="100" cy="-2" rx="90" ry="76" fill="url(#gsLensR)"/>
      <ellipse cx="100" cy="-2" rx="97" ry="83" fill="none" stroke="url(#gsFrame)" strokeWidth="16"/>
      <ellipse cx="100" cy="-2" rx="90" ry="76" fill="none" stroke={ac}
        strokeWidth={hovered ? 2 : 1.2} strokeOpacity={hovered ? 0.8 : 0.55}/>

      {/* Nose bridge */}
      <path d="M -10 22 Q 0 36 10 22" stroke="#080808" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <path d="M -10 22 Q 0 36 10 22" stroke="#1a1a1a" strokeWidth="7"  strokeLinecap="round" fill="none"/>

      {/* Center connector */}
      <rect x="-10" y="-14" width="20" height="26" rx="4" fill="#0d0d0d"/>
      <rect x="-6"  y="-10" width="12" height="18" rx="3" fill="#1a1a1a"/>

      {/* Left reflection highlights */}
      <ellipse cx="-128" cy="-45" rx="26" ry="13" fill="white"
        opacity={hovered ? 0.22 : 0.1} transform="rotate(-28 -128 -45)"/>
      <ellipse cx="-116" cy="-36" rx="9"  ry="5"  fill="white"
        opacity={hovered ? 0.38 : 0.18} transform="rotate(-28 -116 -36)"/>

      {/* Right reflection highlights */}
      <ellipse cx="72" cy="-45" rx="26" ry="13" fill="white"
        opacity={hovered ? 0.22 : 0.1} transform="rotate(-28 72 -45)"/>
      <ellipse cx="84" cy="-36" rx="9"  ry="5"  fill="white"
        opacity={hovered ? 0.38 : 0.18} transform="rotate(-28 84 -36)"/>

      {/* Brand text */}
      <text x="0" y="-110" textAnchor="middle" fontFamily="monospace" fontSize="10"
        fill={ac} opacity="0.55" letterSpacing="4">FITSMILE</text>
      </g>
    </svg>
  );
}

// ─── Generalized animated case card ──────────────────────────────────────────
function AnimatedCaseCard({ c, onOpen }: {
  c: (typeof CASES)[0];
  onOpen?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [badgeIdx, setBadgeIdx] = useState(0);
  const badges = CASE_BADGES[c.id] ?? ["PORTFOLIO"];
  // All accents are now #CBFF00; on hover everything inverts to dark
  const eRgb  = hovered ? "17,17,17"  : "203,255,0";
  const acCol = hovered ? "#111111"   : "#CBFF00";
  const textCol = hovered ? "#0a0a0a" : "white";

  useEffect(() => {
    const t = setInterval(() => setBadgeIdx(p => (p + 1) % badges.length), 2300);
    return () => clearInterval(t);
  }, [badges.length]);

  const scene = (h: boolean): React.ReactNode => {
    switch (c.id) {
      case 1: return <BeautyScene hovered={h}/>;
      case 2: return <ElectronicsScene hovered={h}/>;
      case 3: return <DrinksScene hovered={h}/>;
      case 4: return <FashionScene hovered={h}/>;
      case 5: return <FoodScene hovered={h}/>;
      case 6: return <GogglesScene hovered={h}/>;
      default: return null;
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer select-none h-[320px] md:h-[360px]"
      style={{
        background: CASE_BG[c.id] ?? "#080808",
        border: hovered ? "1.5px solid rgba(0,0,0,0.18)" : "1px solid rgba(203,255,0,0.16)",
        transition: "border-color 0.38s ease, box-shadow 0.38s ease",
        boxShadow: hovered
          ? "0 0 70px rgba(203,255,0,0.28), 0 30px 80px rgba(0,0,0,0.7)"
          : "0 0 0px rgba(203,255,0,0), 0 20px 60px rgba(0,0,0,0.6)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* ── Acid hover overlay ── */}
      <div style={{
        position:"absolute", inset:0, background:"#CBFF00", pointerEvents:"none",
        opacity: hovered ? 1 : 0, transition:"opacity 0.38s ease", zIndex:0,
      }}/>

      {/* Light rays */}
      {[0,1,2,3,4].map(i => (
        <m.div key={i} style={{
          position:"absolute", top:0, left:`${8+i*19}%`, width:`${5+i*2}%`, height:"65%",
          background:`linear-gradient(180deg,rgba(${eRgb},${hovered ? 0.06+i*0.016 : 0.04+i*0.012}) 0%,transparent 100%)`,
          transform:`skewX(${-14+i*7}deg)`, transformOrigin:"top center",
          borderRadius:"0 0 60% 60%", pointerEvents:"none", zIndex:1,
        }}
        animate={{ opacity: hovered ? [0.5,0.8,0.5] : [0.3,0.55,0.3] }}
        transition={{ duration:3.2+i*0.8, repeat:Infinity, ease:"easeInOut", delay:i*0.5 }}/>
      ))}

      {/* Caustic blobs */}
      {[0,1,2,3,4,5].map(i => (
        <m.div key={i} style={{
          position:"absolute", pointerEvents:"none", borderRadius:"50%", zIndex:1,
          width:50+i*18, height:35+i*12,
          left:`${5+(i*39)%80}%`, top:`${8+(i*27)%62}%`,
          background:`radial-gradient(circle,rgba(${eRgb},${hovered ? 0.1+i*0.025 : 0.07+i*0.02}) 0%,transparent 70%)`,
          filter:"blur(10px)",
        }}
        animate={{ x:[0,14,-8,10,0], y:[0,-10,5,-7,0],
          opacity: hovered ? [0.5,0.75,0.5,0.7,0.5] : [0.3,0.55,0.35,0.5,0.3] }}
        transition={{ duration:4.5+i*1.1, repeat:Infinity, ease:"easeInOut", delay:i*0.65 }}/>
      ))}

      {/* Bubbles */}
      {CARD_BUBBLES.map(b => (
        <m.div key={b.id} style={{
          position:"absolute", pointerEvents:"none", zIndex:1,
          left:`${b.x}%`, bottom:-(b.size+4), width:b.size, height:b.size, borderRadius:"50%",
          background:"transparent",
          border:`1px solid rgba(${eRgb},${b.opa})`,
          boxShadow:`0 0 ${b.size}px rgba(${eRgb},${b.opa*0.5})`,
        }}
        animate={{ y:[0,-380], x:[0,Math.sin(b.id*1.4)*10,0], opacity:[0,b.opa,b.opa*0.85,0] }}
        transition={{ duration:b.dur, repeat:Infinity, delay:b.delay, ease:"linear" }}/>
      ))}

      {/* Sparkles */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <m.div key={i} style={{
          position:"absolute", pointerEvents:"none", zIndex:1,
          width:2, height:2, borderRadius:"50%", background:`rgba(${eRgb},0.9)`,
          left:`${12+(i*43)%76}%`, top:`${15+(i*29)%60}%`,
        }}
        animate={{ opacity:[0,1,0], scale:[0,1.8,0] }}
        transition={{ duration:1.4, repeat:Infinity, delay:i*0.7, ease:"easeInOut" }}/>
      ))}

      {/* Scene glow halo */}
      <m.div style={{
        position:"absolute", left:"50%", top:"50%", width:"85%", aspectRatio:"2/1",
        transform:"translate(-50%,-50%)", borderRadius:"50%", zIndex:1,
        background:`radial-gradient(ellipse,rgba(${eRgb},${hovered ? 0.12 : 0.07}) 0%,transparent 70%)`,
        filter:"blur(22px)", pointerEvents:"none",
      }}
      animate={{ opacity:hovered?1:0.45, scale:hovered?1.18:1 }}
      transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}/>

      {/* Product scene */}
      <m.div style={{ position:"absolute", left:"50%", top:"48%", width:"85%", zIndex:2 }}
        animate={{ x:"-50%", y:hovered?"-54%":"-50%", scale:hovered?1.07:1 }}
        transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>
        <m.div animate={{ y:[0,-9,0], rotate:[-0.6,0.6,-0.6] }}
          transition={{ duration:4.2, repeat:Infinity, ease:"easeInOut" }}>
          {scene(hovered)}
        </m.div>
      </m.div>

      {/* Tags */}
      <div style={{ position:"absolute", top:16, left:16, display:"flex", gap:6, pointerEvents:"none", zIndex:3 }}>
        {c.tags.map(t => (
          <span key={t} style={{
            padding:"3px 10px", borderRadius:100,
            background: hovered ? "rgba(0,0,0,0.12)" : "rgba(203,255,0,0.13)",
            border: hovered ? "1px solid rgba(0,0,0,0.28)" : "1px solid rgba(203,255,0,0.38)",
            color: acCol, fontSize:10, fontFamily:"monospace", fontWeight:600,
            transition:"all 0.35s ease",
          }}>{t}</span>
        ))}
      </div>

      {/* Open hint */}
      {onOpen && (
        <m.div style={{
          position:"absolute", top:16, right:16, zIndex:3,
          background: hovered ? "rgba(0,0,0,0.12)" : "rgba(203,255,0,0.12)",
          border: hovered ? "1px solid rgba(0,0,0,0.28)" : "1px solid rgba(203,255,0,0.30)",
          borderRadius:8, padding:"3px 10px",
          color: hovered ? "#0a0a0a" : "rgba(203,255,0,0.88)",
          fontSize:10, fontFamily:"monospace", letterSpacing:"0.06em",
          transition:"all 0.35s ease",
        }}
        animate={{ opacity:hovered?1:0, y:hovered?0:-5 }}
        transition={{ duration:0.22 }}>
          смотреть →
        </m.div>
      )}

      {/* Badge cycling */}
      <div style={{ position:"absolute", bottom:56, left:0, right:0, display:"flex", justifyContent:"center", pointerEvents:"none", zIndex:3 }}>
        <AnimatePresence mode="wait">
          <m.div key={badgeIdx}
            initial={{ opacity:0, y:8, scale:0.88 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.88 }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
            style={{
              padding:"5px 16px", borderRadius:100,
              background: hovered ? "rgba(0,0,0,0.12)" : "rgba(203,255,0,0.14)",
              border: hovered ? "1px solid rgba(0,0,0,0.28)" : "1px solid rgba(203,255,0,0.45)",
              color: acCol, fontSize:10, fontFamily:"monospace", letterSpacing:"0.20em", fontWeight:700,
              transition:"all 0.35s ease",
            }}>
            ◆ {badges[badgeIdx]}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Bottom label */}
      <div style={{ position:"absolute", bottom:20, left:20, right:20, pointerEvents:"none", zIndex:3 }}>
        <p style={{ color: textCol, fontSize:14, fontWeight:700, margin:0, lineHeight:1.3, transition:"color 0.35s ease" }}>{c.title}</p>
        <p style={{ color: hovered ? "#1a1a1a" : "rgba(203,255,0,0.62)", fontSize:11, margin:"3px 0 0 0", fontFamily:"monospace", transition:"color 0.35s ease" }}>{c.result}</p>
      </div>
    </div>
  );
}

// ─── Slide entry type (image or animated component) ─────────────────────────
type SlideEntry = { label: string } & (
  | { img: string;  component?: undefined }
  | { component: () => JSX.Element; img?: undefined }
);

// ─── Swim goggles — Slide 1: «Плохая читаемость» ─────────────────────────────
const GS1_PROBLEMS = [
  { icon: "◎", title: "ПЕРЕГРУЖЕННЫЙ ВИЗУАЛ",  desc: "слишком много элементов и текста"            },
  { icon: "▼", title: "СЛАБЫЙ КОНТРАСТ",       desc: "важные смыслы теряются"                      },
  { icon: "◈", title: "НЕОЧЕВИДНЫЕ УТП",       desc: "польза товара не считывается с первого взгляда" },
] as const;

function GogglesSlide1() {
  const E = [0.22, 1, 0.36, 1] as const;
  const fly = (delay: number, x = 0, y = 0) => ({
    initial: { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.52, ease: E, delay },
  });

  return (
    <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start md:items-center"
      style={{ padding: "8px 4px 12px" }}>

      {/* ── LEFT: text analysis ── */}
      <div style={{ flex: "0 0 44%", minWidth: 0 }}>

        {/* Title block */}
        <m.div {...fly(0.08, -32)}>
          <p style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 900, color: "white",   margin: 0, lineHeight: 1.05 }}>ПЛОХАЯ</p>
          <p style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 900, color: "#CBFF00", margin: "0 0 6px 0", lineHeight: 1.05 }}>ЧИТАЕМОСТЬ</p>
          <p style={{ fontSize: "clamp(11px,1.3vw,14px)", color: "rgba(255,255,255,0.38)", margin: 0 }}>карточка не выделялась в выдаче Ozon</p>
        </m.div>

        {/* Divider */}
        <m.div {...fly(0.26, -16)} style={{ height: 1, background: "rgba(203,255,0,0.18)", margin: "14px 0" }}/>

        {/* Problem list */}
        {GS1_PROBLEMS.map((p, i) => (
          <m.div key={i} {...fly(0.36 + i * 0.14, 0, 18)}
            style={{ display: "flex", gap: 11, marginBottom: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: "rgba(203,255,0,0.08)", border: "1px solid rgba(203,255,0,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#CBFF00", fontSize: 14, fontWeight: 700,
            }}>{p.icon}</div>
            <div>
              <p style={{ fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, letterSpacing: "0.06em" }}>{p.title}</p>
              <p style={{ fontSize: "clamp(10px,1.1vw,12px)", color: "#52525b", margin: "3px 0 0 0", lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          </m.div>
        ))}

        {/* ВЫВОД + ИТОГ */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {([
            { key: "v", label: "ВЫВОД", text: "карточка не привлекает внимание и не вызывает желания кликнуть", d: 0.84 },
            { key: "i", label: "ИТОГ",  text: "карточка теряется среди конкурентов и не доносит ключевые выгоды", d: 0.96 },
          ] as const).map(b => (
            <m.div key={b.key} {...fly(b.d, 0, 14)} style={{
              flex: 1, padding: "10px 12px", borderRadius: 10,
              background: "rgba(203,255,0,0.05)", border: "1px solid rgba(203,255,0,0.18)",
            }}>
              <p style={{ fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, color: "#CBFF00", margin: "0 0 4px 0", letterSpacing: "0.1em" }}>◆ {b.label}</p>
              <p style={{ fontSize: "clamp(10px,1.0vw,11.5px)", color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: 1.45 }}>{b.text}</p>
            </m.div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: product card swimming in ── */}
      <div style={{ flex: "1 1 auto", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 260 }}>
        {/* Glow halo */}
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.6, ease: E }}
          style={{
            position: "absolute", inset: "-22%", borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(203,255,0,0.18) 0%, transparent 65%)",
            filter: "blur(28px)", pointerEvents: "none",
          }}
        />
        {/* Card — entrance from right, then endless gentle float */}
        <m.div
          initial={{ opacity: 0, x: 110, rotate: 20 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: 5,
            y: [0, -10, 0],
          }}
          transition={{
            opacity:  { duration: 0.7, delay: 0.45 },
            x:        { duration: 0.75, ease: E, delay: 0.45 },
            rotate:   { duration: 0.75, ease: E, delay: 0.45 },
            y:        { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1.25 },
          }}
          style={{
            position: "relative", borderRadius: 16, maxWidth: "100%",
            boxShadow: "0 22px 60px rgba(0,0,0,0.70), 0 0 32px rgba(203,255,0,0.18)",
          }}
        >
          <img src="/hero/goggles-product.png" alt="Карточка до редизайна" draggable={false}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}/>
        </m.div>
      </div>

    </div>
  );
}

// ─── Swim goggles — Slide 2: «Переработка структуры» ────────────────────────
const GS2_POINTS = [
  { icon: "★", title: "АКЦЕНТ НА ГЛАВНЫХ УТП",          desc: "выгоды товара видны с первого взгляда" },
  { icon: "◑", title: "УСИЛЕН КОНТРАСТ И ЧИТАЕМОСТЬ",   desc: "текст и элементы легко считываются"     },
  { icon: "♡", title: "ЭМОЦИОНАЛЬНЫЙ И ДИНАМИЧНЫЙ ВИЗУАЛ", desc: "создаёт желание кликнуть"            },
  { icon: "✓", title: "ЧИСТАЯ КОМПОЗИЦИЯ",               desc: "ничего лишнего, всё на месте"          },
] as const;

function GogglesSlide2() {
  const E = [0.22, 1, 0.36, 1] as const;
  const fly = (delay: number, x = 0, y = 0) => ({
    initial: { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.52, ease: E, delay },
  });


  return (
    <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start md:items-center"
      style={{ padding: "8px 4px 12px" }}>

      {/* ── LEFT: text ── */}
      <div style={{ flex: "0 0 44%", minWidth: 0 }}>

        {/* Title */}
        <m.div {...fly(0.06, -32)}>
          <p style={{ fontSize: "clamp(24px,3.2vw,40px)", fontWeight: 900, color: "white",   margin: 0, lineHeight: 1.05 }}>ПЕРЕРАБОТКА</p>
          <p style={{ fontSize: "clamp(24px,3.2vw,40px)", fontWeight: 900, color: "#CBFF00", margin: "0 0 5px 0", lineHeight: 1.05 }}>СТРУКТУРЫ</p>
        </m.div>

        {/* Goal line */}
        <m.p {...fly(0.18, -16)} style={{ fontSize: "clamp(10px,1.2vw,13px)", color: "rgba(255,255,255,0.38)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
          Наша цель — сделать карточку{" "}
          <span style={{ color: "#CBFF00" }}>заметной, понятной</span>
          {" "}и <span style={{ color: "#CBFF00" }}>продающей</span> с первого взгляда
        </m.p>

        {/* Divider */}
        <m.div {...fly(0.26, -12)} style={{ height: 1, background: "rgba(203,255,0,0.18)", margin: "0 0 12px 0" }}/>

        {/* 4 points */}
        {GS2_POINTS.map((p, i) => (
          <m.div key={i} {...fly(0.32 + i * 0.12, 0, 16)}
            style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, flexShrink: 0,
              background: "rgba(203,255,0,0.08)", border: "1px solid rgba(203,255,0,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#CBFF00", fontSize: 13, fontWeight: 700,
            }}>{p.icon}</div>
            <div>
              <p style={{ fontSize: "clamp(10px,1.15vw,12.5px)", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, letterSpacing: "0.05em" }}>{p.title}</p>
              <p style={{ fontSize: "clamp(9px,1.05vw,11.5px)", color: "#52525b", margin: "2px 0 0 0", lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          </m.div>
        ))}

        {/* Hypothesis block */}
        <m.div {...fly(0.84, 0, 14)} style={{
          marginTop: 12, padding: "10px 12px", borderRadius: 10,
          background: "rgba(203,255,0,0.05)", border: "1px solid rgba(203,255,0,0.18)",
          display: "flex", gap: 9, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
          <div>
            <p style={{ fontSize: "clamp(9px,1.05vw,11px)", fontWeight: 700, color: "#CBFF00", margin: "0 0 3px 0", letterSpacing: "0.1em" }}>ГИПОТЕЗА</p>
            <p style={{ fontSize: "clamp(9px,1.0vw,11px)", color: "#52525b", margin: 0, lineHeight: 1.5 }}>
              если сделать карточку более контрастной, сфокусироваться на выгодах и добавить динамичный визуал — она будет выделяться и привлекать больше кликов
            </p>
          </div>
        </m.div>
      </div>

      {/* ── RIGHT: 3 photos fanned ── */}
      <div style={{ flex: "1 1 auto", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 260 }}>
        {/* Purple glow */}
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.55, ease: E }}
          style={{
            position: "absolute", inset: "-20%", borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(203,255,0,0.15) 0%, transparent 65%)",
            filter: "blur(28px)", pointerEvents: "none",
          }}
        />
        {/* Collage: pool bg → swimmer → goggles front */}
        <div style={{ position: "relative", width: "100%", height: 290 }}>
          {/* Layer 1 — Pool background, slides in from right */}
          <m.div
            initial={{ opacity: 0, x: 55, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.68, ease: E, delay: 0.42 }}
            style={{
              position: "absolute", right: "0%", top: "8%", width: "70%", zIndex: 1,
              borderRadius: 22, overflow: "hidden",
              boxShadow: "0 18px 52px rgba(0,0,0,0.70)",
            }}
          >
            <img src="/hero/goggles-slide2-b.png" alt="Фон бассейн" draggable={false}
              style={{ width: "100%", height: "auto", display: "block" }}/>
          </m.div>
          {/* Layer 2 — Swimmer, transparent bg, right side overlapping pool */}
          <m.div
            initial={{ opacity: 0, x: 45, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.65, ease: E, delay: 0.62 }}
            style={{
              position: "absolute", right: "-2%", top: "-6%", width: "50%", zIndex: 2,
              filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.65))",
            }}
          >
            <img src="/hero/goggles-slide2-c.png" alt="Пловец" draggable={false}
              style={{ width: "100%", height: "auto", display: "block" }}/>
          </m.div>
          {/* Layer 3 — Goggles, large foreground-left */}
          <m.div
            initial={{ opacity: 0, x: -44, y: 26, rotate: -10 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
            transition={{ duration: 0.75, ease: E, delay: 0.82 }}
            style={{
              position: "absolute", left: "-2%", bottom: "0%", width: "66%", zIndex: 3,
              filter: "drop-shadow(0 20px 42px rgba(0,0,0,0.82)) drop-shadow(0 0 28px rgba(203,255,0,0.22))",
            }}
          >
            <img src="/hero/goggles-slide2-a.png" alt="Очки" draggable={false}
              style={{ width: "100%", height: "auto", display: "block" }}/>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ─── Swim goggles — Slide 3: «Новый Hero-визуал» ─────────────────────────────
const GS3_ANNOTS = [
  { icon: "◎", title: "АНТИЗАПОТЕВАНИЕ", desc: "наглядно показали технологию через визуал и текст" },
  { icon: "180°", title: "ШИРОКИЙ ОБЗОР", desc: "понятное преимущество с акцентом на выгоду для пользователя" },
] as const;

const GS3_POINTS = [
  { icon: "★", title: "СИЛЬНЫЙ ЗАГОЛОВОК",  desc: "крупный шрифт и контрастные флашки цепляют внимание" },
  { icon: "◆", title: "ЧИСТАЯ КОМПОЗИЦИЯ",  desc: "ничего лишнего — всё внимание на продукт" },
  { icon: "✦", title: "ПОНЯТНЫЕ ТРИГГЕРЫ",  desc: "ключевые выгоды выделены и легко считываются" },
] as const;

function GogglesSlide3() {
  const E = [0.22, 1, 0.36, 1] as const;
  const fly = (delay: number, x = 0, y = 0) => ({
    initial: { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.52, ease: E, delay },
  });

  return (
    <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start md:items-center"
      style={{ padding: "8px 4px 12px" }}>

      {/* ── LEFT: text ── */}
      <div style={{ flex: "0 0 44%", minWidth: 0 }}>

        {/* Title */}
        <m.div {...fly(0.06, -32)}>
          <p style={{ fontSize: "clamp(22px,3.0vw,38px)", fontWeight: 900, color: "white",   margin: 0, lineHeight: 1.05 }}>НОВЫЙ</p>
          <p style={{ fontSize: "clamp(22px,3.0vw,38px)", fontWeight: 900, color: "#CBFF00", margin: "0 0 4px 0", lineHeight: 1.05 }}>HERO-ВИЗУАЛ</p>
          <p style={{ fontSize: "clamp(10px,1.2vw,13px)", color: "rgba(255,255,255,0.38)", margin: 0 }}>фокус на продукте и выгодах</p>
        </m.div>

        {/* Divider */}
        <m.div {...fly(0.18, -12)} style={{ height: 1, background: "rgba(203,255,0,0.18)", margin: "12px 0" }}/>

        {/* Annotation features (eye + 180°) */}
        {GS3_ANNOTS.map((p, i) => (
          <m.div key={i} {...fly(0.26 + i * 0.13, 0, 14)}
            style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, flexShrink: 0,
              background: "rgba(203,255,0,0.08)", border: "1px solid rgba(203,255,0,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#CBFF00", fontSize: 10, fontWeight: 800, letterSpacing: "0",
            }}>{p.icon}</div>
            <div>
              <p style={{ fontSize: "clamp(10px,1.15vw,12.5px)", fontWeight: 700, color: "#CBFF00", margin: 0, letterSpacing: "0.06em" }}>{p.title}</p>
              <p style={{ fontSize: "clamp(9px,1.05vw,11.5px)", color: "#52525b", margin: "2px 0 0 0", lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          </m.div>
        ))}

        {/* Secondary divider */}
        <m.div {...fly(0.54, -8)} style={{ height: 1, background: "rgba(203,255,0,0.12)", margin: "10px 0" }}/>

        {/* Quality points */}
        {GS3_POINTS.map((p, i) => (
          <m.div key={i} {...fly(0.60 + i * 0.10, 0, 12)}
            style={{ display: "flex", gap: 9, marginBottom: 8, alignItems: "flex-start" }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background: "rgba(203,255,0,0.06)", border: "1px solid rgba(203,255,0,0.20)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#CBFF00", fontSize: 11, fontWeight: 700,
            }}>{p.icon}</div>
            <div>
              <p style={{ fontSize: "clamp(9.5px,1.1vw,12px)", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: 0, letterSpacing: "0.05em" }}>{p.title}</p>
              <p style={{ fontSize: "clamp(9px,1.0vw,11px)", color: "#52525b", margin: "2px 0 0 0", lineHeight: 1.4 }}>{p.desc}</p>
            </div>
          </m.div>
        ))}

        {/* Conclusion box */}
        <m.div {...fly(0.92, 0, 14)} style={{
          marginTop: 10, padding: "9px 12px", borderRadius: 10,
          background: "rgba(203,255,0,0.05)", border: "1px solid rgba(203,255,0,0.18)",
          display: "flex", gap: 9, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>🎯</span>
          <div>
            <p style={{ fontSize: "clamp(9px,1.05vw,11px)", fontWeight: 700, color: "#CBFF00", margin: "0 0 3px 0", letterSpacing: "0.1em" }}>ЧТО СДЕЛАЛИ</p>
            <p style={{ fontSize: "clamp(9px,1.0vw,11px)", color: "rgba(255,255,255,0.40)", margin: 0, lineHeight: 1.5 }}>
              собрали сильный визуал, который моментально показывает продукт и его преимущества,{" "}
              <span style={{ color: "rgba(203,255,0,0.80)" }}>выделяя карточку в выдаче</span>
            </p>
          </div>
        </m.div>
      </div>

      {/* ── RIGHT: product card at 3D angle ── */}
      <div style={{
        flex: "1 1 auto", position: "relative",
        display: "flex", justifyContent: "center", alignItems: "center",
        minHeight: 260, perspective: "900px", perspectiveOrigin: "50% 50%",
      }}>
        {/* Purple glow */}
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.55, ease: E }}
          style={{
            position: "absolute", inset: "-20%", borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(203,255,0,0.16) 0%, transparent 65%)",
            filter: "blur(28px)", pointerEvents: "none",
          }}
        />
        {/* 3D card — enters from right with perspective tilt, then floats */}
        <m.div
          initial={{ opacity: 0, x: 90, rotateY: 42, rotateZ: 6, scale: 0.82 }}
          animate={{
            opacity: 1,
            x: 0,
            rotateY: 14,
            rotateZ: 2,
            scale: 1,
            y: [0, -9, 0],
          }}
          transition={{
            opacity:  { duration: 0.7,  delay: 0.42 },
            x:        { duration: 0.78, ease: E, delay: 0.42 },
            rotateY:  { duration: 0.78, ease: E, delay: 0.42 },
            rotateZ:  { duration: 0.78, ease: E, delay: 0.42 },
            scale:    { duration: 0.78, ease: E, delay: 0.42 },
            y:        { duration: 4.5,  ease: "easeInOut", repeat: Infinity, delay: 1.4 },
          }}
          style={{
            position: "relative",
            maxWidth: "90%",
            borderRadius: 16,
            boxShadow: [
              "0 24px 64px rgba(0,0,0,0.72)",
              "-10px 10px 36px rgba(203,255,0,0.14)",
              "0 0 0 1px rgba(255,255,255,0.06)",
            ].join(", "),
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src="/hero/goggles-card.png"
            alt="Новый Hero-визуал — FitSmile очки"
            draggable={false}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}
          />
        </m.div>
      </div>

    </div>
  );
}

// ─── Swim goggles — Slide 4: «Дополнительные слайды» ────────────────────────
const GS4_CARDS = [
  { n: "1", title: "НЕ ЗАПОТЕВАЮТ",  sub: "Anti-fog покрытие",  img: "/hero/goggles-extra-1.png" },
  { n: "2", title: "МЯГКАЯ ПОСАДКА", sub: "без следов и давления", img: "/hero/goggles-extra-2.png" },
  { n: "3", title: "ГЕРМЕТИЧНОСТЬ",  sub: "100% — ни капли воды",  img: "/hero/goggles-extra-3.png" },
  { n: "4", title: "ТОЧНАЯ ПОСАДКА", sub: "все размеры в наличии", img: "/hero/goggles-extra-4.png" },
] as const;

const GS4_RESULTS = [
  "больше пользы на каждом слайде",
  "снижение сомнений перед покупкой",
  "выше вовлечённость и кликабельность",
  "больше заказов при том же трафике",
] as const;

function GogglesSlide4() {
  const E = [0.22, 1, 0.36, 1] as const;
  const fly = (delay: number, x = 0, y = 0) => ({
    initial: { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.52, ease: E, delay },
  });

  return (
    <div className="relative flex flex-col w-full" style={{ padding: "8px 4px 12px", gap: 10 }}>

      {/* ── TOP: Title ── */}
      <m.div {...fly(0.06, 0, -18)} style={{ textAlign: "center" }}>
        <p style={{ fontSize: "clamp(17px,2.4vw,30px)", fontWeight: 900, color: "white", margin: 0, lineHeight: 1.05 }}>
          ДОПОЛНИТЕЛЬНЫЕ{" "}
          <span style={{ color: "#CBFF00" }}>СЛАЙДЫ</span>
        </p>
        <p style={{ fontSize: "clamp(9px,1.05vw,11.5px)", color: "rgba(255,255,255,0.38)", margin: "3px 0 0", lineHeight: 1.4 }}>
          которые усиливают карточку и повышают CTR
        </p>
      </m.div>

      {/* ── CENTER: 4 cards in a row (full portrait height) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, position: "relative" }}>
        {/* Acid glow */}
        <m.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: E }}
          style={{
            position: "absolute", inset: "-20%", borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(203,255,0,0.14) 0%, transparent 65%)",
            filter: "blur(20px)", pointerEvents: "none",
          }}
        />
        {GS4_CARDS.map((card, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, x: 55 + i * 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.62, ease: E, delay: 0.22 + i * 0.11 }}
            style={{
              position: "relative",
              borderRadius: 9,
              overflow: "hidden",
              boxShadow: "0 10px 28px rgba(0,0,0,0.65), 0 0 0 1px rgba(203,255,0,0.12)",
              border: "1px solid rgba(203,255,0,0.22)",
            }}
          >
            <img
              src={card.img}
              alt={card.title}
              draggable={false}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {/* Badge */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "18px 6px 5px",
              background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)",
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                background: "rgba(203,255,0,0.15)", borderRadius: 5,
                border: "1px solid rgba(203,255,0,0.35)",
                padding: "2px 6px", color: "#CBFF00", fontSize: 8, fontWeight: 800, letterSpacing: "0.05em",
              }}>
                {card.n} {card.title}
              </span>
            </div>
          </m.div>
        ))}
      </div>

      {/* ── BOTTOM: ЧТО СДЕЛАЛИ + РЕЗУЛЬТАТ ── */}
      <m.div {...fly(0.72, 0, 16)} style={{
        display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap",
      }}>

        {/* ЧТО СДЕЛАЛИ */}
        <div style={{
          flex: "1 1 auto", minWidth: 160,
          padding: "8px 11px", borderRadius: 9,
          background: "rgba(203,255,0,0.05)", border: "1px solid rgba(203,255,0,0.18)",
          display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>💡</span>
          <div>
            <p style={{ fontSize: "clamp(9px,1.05vw,11px)", fontWeight: 700, color: "#CBFF00", margin: "0 0 3px 0", letterSpacing: "0.1em" }}>ЧТО СДЕЛАЛИ</p>
            <p style={{ fontSize: "clamp(8.5px,0.98vw,10.5px)", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>
              добавили информативные слайды, раскрывающие{" "}
              <span style={{ color: "rgba(203,255,0,0.75)" }}>ключевые преимущества</span>
              {" "}и снимающие возражения
            </p>
          </div>
        </div>

        {/* РЕЗУЛЬТАТ */}
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 5 }}>
            <span style={{ fontSize: "clamp(26px,3.4vw,44px)", fontWeight: 900, color: "#CBFF00", lineHeight: 1 }}>+28–35%</span>
            <span style={{ fontSize: "clamp(13px,1.7vw,20px)", fontWeight: 900, color: "#CBFF00", letterSpacing: "0.06em", lineHeight: 1 }}>РОСТ CTR</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
            {GS4_RESULTS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
                <span style={{ color: "#CBFF00", fontSize: 7, marginTop: 4, flexShrink: 0 }}>▸</span>
                <p style={{ fontSize: "clamp(8.5px,0.96vw,10.5px)", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.35 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>

      </m.div>

    </div>
  );
}

// ─── Card-deck modal for case studies ────────────────────────────────────────
function CaseDeckModal({ slides, title, onClose }: {
  slides: SlideEntry[];
  title: string;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const n = slides.length;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <m.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center w-full px-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-0 right-4 md:right-8 w-9 h-9 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/25 transition-all duration-200"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        {/* Title */}
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent mb-8">{title}</p>

        {/* ── MOBILE: arrows flanking slide card ── */}
        <div className="flex md:hidden items-center gap-3 w-full justify-center mb-4">
          {/* Prev */}
          <button
            onClick={() => setActive((active + n - 1) % n)}
            className="flex-shrink-0 w-9 h-9 rounded-full border border-white/10 bg-white/[0.06] flex items-center justify-center text-zinc-300 active:scale-95 transition-all duration-150"
            style={{ zIndex: 10 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Slide card */}
          <AnimatePresence mode="wait">
            {(() => {
              const MSlide = slides[active].component;
              return (
                <m.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    width: MSlide ? "min(74vw, 480px)" : "min(68vw, 360px)",
                    flexShrink: 0,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1.5px solid rgba(203,255,0,0.55)",
                    boxShadow: "0 0 36px rgba(203,255,0,0.18), 0 20px 50px rgba(0,0,0,0.75)",
                    background: MSlide ? "rgba(10,8,20,0.95)" : undefined,
                    padding: MSlide ? "12px 10px" : undefined,
                  }}
                >
                  {MSlide
                    ? <MSlide />
                    : <img src={slides[active].img} alt={slides[active].label} draggable={false} className="block w-full h-auto select-none" />
                  }
                </m.div>
              );
            })()}
          </AnimatePresence>

          {/* Next */}
          <button
            onClick={() => setActive((active + 1) % n)}
            className="flex-shrink-0 w-9 h-9 rounded-full border border-white/10 bg-white/[0.06] flex items-center justify-center text-zinc-300 active:scale-95 transition-all duration-150"
            style={{ zIndex: 10 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* ── DESKTOP: fixed-height area — arrows always at same Y position ── */}
        <div
          className="hidden md:block relative w-full"
          style={{ height: "min(65vh, 660px)", perspective: "1400px", perspectiveOrigin: "50% 50%" }}
        >
          {slides[active].component ? (
            /* Component slide — centered card inside fixed area */
            <AnimatePresence mode="wait">
              {(() => {
                const DSlide = slides[active].component!;
                return (
                  <m.div
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: "absolute",
                      left: "50%", top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "min(88vw, 1000px)",
                      overflow: "hidden",
                      background: "rgba(10,8,20,0.6)",
                      borderRadius: 20,
                      padding: "24px 28px",
                    }}
                  >
                    <DSlide />
                  </m.div>
                );
              })()}
            </AnimatePresence>
          ) : (
            /* Image slides — coverflow */
            slides.map((slide, i) => {
              if (!slide.img) return null;
              const off  = i - active;
              const abs  = Math.abs(off);
              if (abs > 2) return null;
              const spreadX = off === 0 ? 0 : Math.sign(off) * (abs === 1 ? 275 : 490);
              const rotY    = off * -46;
              const depth   = -abs * 230;
              const scl     = [1, 0.86, 0.68][abs];
              const bright  = [1, 0.50, 0.25][abs];
              return (
                <div
                  key={i}
                  onClick={() => abs > 0 && setActive(i)}
                  style={{
                    position: "absolute",
                    left: "50%", top: "50%",
                    width: "min(28vw, 480px)",
                    borderRadius: 20,
                    overflow: "hidden",
                    cursor: abs > 0 ? "pointer" : "default",
                    zIndex: 10 - abs,
                    transform: `translateX(calc(-50% + ${spreadX}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${depth}px) scale(${scl})`,
                    filter: `brightness(${bright})`,
                    transition: "transform 0.60s cubic-bezier(0.22,1,0.36,1), filter 0.50s ease, border-color 0.32s ease, box-shadow 0.50s ease",
                    border: abs === 0 ? "2px solid rgba(203,255,0,0.68)" : "1.5px solid rgba(255,255,255,0.07)",
                    boxShadow: abs === 0
                      ? "0 0 0 1px rgba(203,255,0,0.10), 0 0 52px rgba(203,255,0,0.24), 0 36px 90px rgba(0,0,0,0.90)"
                      : "0 10px 44px rgba(0,0,0,0.72)",
                  }}
                >
                  <img src={slide.img} alt={slide.label} draggable={false} className="block w-full h-auto select-none" />
                </div>
              );
            })
          )}
        </div>
        {/* Desktop nav arrows */}
        <div className="hidden md:flex items-center gap-6 mt-6">
          <button
            onClick={() => setActive((active + n - 1) % n)}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-zinc-300 hover:border-white/25 hover:text-white active:scale-95 transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="text-xs font-mono text-zinc-500 tabular-nums">{active + 1} / {n}</span>
          <button
            onClick={() => setActive((active + 1) % n)}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-zinc-300 hover:border-white/25 hover:text-white active:scale-95 transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Label + dots */}
        <AnimatePresence mode="wait">
          <m.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-6 md:mt-2 text-sm font-mono text-zinc-400 uppercase tracking-[0.18em]"
          >
            {slides[active].label}
          </m.p>
        </AnimatePresence>
        <div className="flex items-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                padding: 0, border: "none", borderRadius: 3, cursor: "pointer",
                background: i === active ? "#CBFF00" : "rgba(255,255,255,0.18)",
                width: i === active ? 22 : 6,
                height: 6,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </m.div>
    </m.div>
  );
}

function CaseCard({ c, onOpen, isHovered }: { c: (typeof CASES)[0]; onOpen?: () => void; isHovered?: boolean }) {
  const T = "0.38s ease";
  return (
    <Reveal>
      <m.article
        variants={fadeUp}
        onClick={onOpen}
        className={`group relative overflow-hidden rounded-2xl h-[320px] md:h-[360px] ${onOpen ? "cursor-pointer" : "cursor-default"}`}
        style={{
          border: isHovered ? `1.5px solid ${c.accent}` : "1px solid rgba(255,255,255,0.07)",
          transition: `border-color ${T}`,
        }}
      >
        {/* Gradient bg — fades out on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
          style={{ opacity: isHovered ? 0 : 1, transition: `opacity ${T}` }}
        />
        {/* Solid accent bg — fades in on hover */}
        <div
          className="absolute inset-0"
          style={{ background: c.accent, opacity: isHovered ? 1 : 0, transition: `opacity ${T}` }}
        />
        {c.id === 1 ? (
          /* Case 1 — product card preview */
          <img
            aria-hidden
            src="/hero/project%20card%2003.png"
            alt=""
            draggable={false}
            className="absolute pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
            style={{
              right: "-8%",
              top: "50%",
              transform: "translateY(-50%) rotate(10deg)",
              width: "58%",
              height: "auto",
              borderRadius: 14,
              opacity: 0.88,
              boxShadow: "0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(192,132,252,0.25)",
            }}
          />
        ) : c.id === 2 ? (
          /* Case 2 — hero screen preview */
          <img
            aria-hidden
            src="/hero/hero%20project%2003.svg"
            alt=""
            draggable={false}
            className="absolute pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
            style={{
              right: "-6%",
              top: "50%",
              transform: "translateY(-50%) rotate(-8deg)",
              width: "62%",
              height: "auto",
              borderRadius: 14,
              opacity: 0.88,
              boxShadow: "0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(56,189,248,0.25)",
            }}
          />
        ) : c.id === 4 ? (
          /* Case 4 — fashion jacket brand preview */
          <img
            aria-hidden
            src="/hero/Project%20jacket%20Card%20004.png"
            alt=""
            draggable={false}
            className="absolute pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
            style={{
              right: "-8%",
              top: "50%",
              transform: "translateY(-50%) rotate(-7deg)",
              width: "64%",
              height: "auto",
              borderRadius: 14,
              opacity: 0.88,
              boxShadow: "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,191,36,0.25)",
            }}
          />
        ) : c.id === 6 ? (
          /* Case 6 — swim goggles sport brand preview */
          <img
            aria-hidden
            src="/hero/Project%20Card%20003.png"
            alt=""
            draggable={false}
            className="absolute pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
            style={{
              right: "-5%",
              top: "50%",
              transform: "translateY(-50%) rotate(6deg)",
              width: "65%",
              height: "auto",
              borderRadius: 14,
              opacity: 0.9,
              boxShadow: "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.25)",
            }}
          />
        ) : (
          (c.shapes as Shape[]).map((s, i) => (
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
          ))
        )}
        {/* Dark overlay — fades out on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
          style={{ opacity: isHovered ? 0 : 1, transition: `opacity ${T}` }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-7">
          <div className="flex gap-2 mb-3">
            {c.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium"
                style={{
                  background: isHovered ? "rgba(0,0,0,0.15)" : `${c.accent}22`,
                  color: isHovered ? "rgba(0,0,0,0.7)" : c.accent,
                  border: isHovered ? "1px solid rgba(0,0,0,0.12)" : `1px solid ${c.accent}44`,
                  transition: `all ${T}`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <h3
            className="text-base md:text-lg font-semibold leading-snug mb-2.5"
            style={{ color: isHovered ? "rgba(0,0,0,0.85)" : "white", transition: `color ${T}` }}
          >
            {c.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: isHovered ? "rgba(0,0,0,0.6)" : c.accent, transition: `color ${T}` }}>↑</span>
              <span className="text-sm font-mono" style={{ color: isHovered ? "rgba(0,0,0,0.65)" : "#d4d4d8", transition: `color ${T}` }}>{c.result}</span>
            </div>
            {onOpen && (
              <span
                className="text-[10px] font-mono uppercase tracking-[0.15em] transition-opacity duration-200"
                style={{
                  color: isHovered ? "rgba(0,0,0,0.5)" : c.accent,
                  opacity: isHovered ? 1 : 0,
                  transition: `color ${T}, opacity 0.2s ease`,
                }}
              >
                смотреть →
              </span>
            )}
          </div>
        </div>
      </m.article>
    </Reveal>
  );
}

function Cases() {
  const [caseModal, setCaseModal] = useState<{ slides: SlideEntry[]; title: string } | null>(null);
  const [hovCase, setHovCase] = useState<number | null>(null);

  const CASE_COLS = 3;
  function caseStyle(idx: number): React.CSSProperties {
    const T = "transform 0.52s cubic-bezier(0.22,1,0.36,1), filter 0.42s ease";
    if (hovCase === null) return { transition: T, willChange: "transform" };
    if (idx === hovCase) return {
      transition: T, willChange: "transform",
      transform: "scale(1.04) translateZ(32px)",
      zIndex: 10,
    };
    const dC = (idx % CASE_COLS) - (hovCase % CASE_COLS);
    const dR = Math.floor(idx / CASE_COLS) - Math.floor(hovCase / CASE_COLS);
    const rotY = dC * 18;
    const rotX = dR * -7;
    const bright = Math.max(0.45, 1 - (Math.abs(dC) + Math.abs(dR)) * 0.20);
    return {
      transition: T, willChange: "transform",
      transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(0.962) translateZ(-50px)`,
      filter: `brightness(${bright})`,
      zIndex: 4,
    };
  }

  return (
    <section id="cases" className="py-28 md:py-36 bg-surface/30">
      <AnimatePresence>
        {caseModal && (
          <CaseDeckModal
            slides={caseModal.slides}
            title={caseModal.title}
            onClose={() => setCaseModal(null)}
          />
        )}
      </AnimatePresence>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <Reveal>
          <Label>Кейсы</Label>
          <m.h2 variants={fadeUp} className="font-luna text-4xl md:text-5xl font-bold tracking-[0.06em] text-white mb-3">
            Проекты
          </m.h2>
          <m.p variants={fadeUp} className="text-zinc-500 text-base mb-14">
            Реальные результаты — CTR, позиции в выдаче, конверсия
          </m.p>
        </Reveal>
        <div style={{ perspective: "1100px", perspectiveOrigin: "50% 40%" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASES.map((c, idx) => (
              <div
                key={c.id}
                onMouseEnter={() => setHovCase(idx)}
                onMouseLeave={() => setHovCase(null)}
                style={{ position: "relative", ...caseStyle(idx) }}
              >
                <AnimatedCaseCard
                  c={c}
                  onOpen={
                    c.id === 1 ? () => setCaseModal({ slides: PROJECT_SLIDES,      title: "Карточки для бренда натуральной косметики" }) :
                    c.id === 2 ? () => setCaseModal({ slides: HERO_PROJECT_SLIDES, title: "HERO-экран для бренда умной электроники" }) :
                    c.id === 4 ? () => setCaseModal({ slides: FASHION_SLIDES,      title: "Карточки для бренда уличной одежды" }) :
                    c.id === 6 ? () => setCaseModal({ slides: SWIM_SLIDES,         title: "Hero + карточки для спорт-бренда на Ozon" }) :
                    undefined
                  }
                />
              </div>
            ))}
          </div>
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
          <m.h2 variants={fadeUp} className="font-luna text-4xl md:text-5xl font-bold tracking-[0.06em] text-white mb-14">
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
          <m.h2 variants={fadeUp} className="font-luna text-4xl md:text-5xl font-bold tracking-[0.06em] text-white mb-14">
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
              <m.h2 variants={fadeUp} className="font-luna text-4xl md:text-6xl font-bold tracking-[0.06em] text-white mb-4">
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
          ALEXDSGN
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
