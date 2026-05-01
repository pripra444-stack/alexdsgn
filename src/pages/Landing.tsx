import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Users,
  Sparkles,
  TrendingUp,
  Play,
  Check,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Mic,
  Lightbulb,
  ChevronRight,
  Star,
  Target,
  Zap,
  Award,
  MessageSquare,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG      = "#07040F";
const CARD    = "#0E0A1C";
const CARD2   = "#130F22";
const V1      = "#8B5CF6";   // violet primary
const V2      = "#A855F7";   // violet lighter
const PINK    = "#D946EF";   // fuchsia accent
const BORDER  = "rgba(139,92,246,0.18)";
const BGCARD  = "rgba(255,255,255,0.03)";

// ─── Utilities ────────────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { type: "spring" as const, stiffness: 88, damping: 22 },
};

function Counter({ to, suffix = "", prefix = "", decimals = 0 }: {
  to: number; suffix?: string; prefix?: string; decimals?: number;
}) {
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 2, ease: "easeOut",
      onUpdate: v => setVal(decimals > 0 ? v.toFixed(decimals) : String(Math.round(v))),
    });
    return () => c.stop();
  }, [inView, to, decimals]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

function SoundWave() {
  const h = [3,7,12,8,15,6,11,14,7,12,5,9,13,8,6,10,14,7,11,5];
  return (
    <div className="flex items-center gap-[2px] h-9">
      {h.map((v, i) => (
        <motion.div key={i}
          style={{ backgroundColor: V1, height: v * 1.8, width: 3, borderRadius: 99, opacity: 0.8 }}
          animate={{ height: [v*1.4, v*3.2, v*1.2, v*2.8, v*1.4] }}
          transition={{ duration: 1.3+(i%4)*0.15, repeat: Infinity, ease: "easeInOut", delay: i*0.065 }}
        />
      ))}
    </div>
  );
}

// Точный логотип RConf из оригинального SVG-файла (speech bubble + dot + 2 lines)
function RConfLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="5 3 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Speech bubble */}
      <path
        d="M26 3C37.598 3 47 12.402 47 24C47 35.598 37.598 45 26 45C21.1389 45 16.6645 43.347 13.1055 40.5742C13.0225 40.6512 12.9277 40.7286 12.8145 40.7998C10.6459 42.1627 7.82286 41.9073 6.68262 41.6094C9.29295 40.1609 9.4057 37.7968 9.04395 36.3896C6.50181 32.9165 5 28.6339 5 24C5 12.402 14.402 3 26 3Z"
        fill="#6F66E6"
      />
      {/* Dot */}
      <rect x="18" y="18" width="3" height="3" rx="1.5" fill="white"/>
      {/* Long line */}
      <rect x="23" y="18" width="11" height="3" rx="1.5" fill="white"/>
      {/* Short line */}
      <rect x="17" y="24" width="11" height="3" rx="1.5" fill="white"/>
    </svg>
  );
}

// Purple grid pattern overlay
function GridBg({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: `linear-gradient(${V1}${Math.round(opacity*255).toString(16).padStart(2,"0")} 1px, transparent 1px),
                        linear-gradient(90deg, ${V1}${Math.round(opacity*255).toString(16).padStart(2,"0")} 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
    }}/>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="relative min-h-[100dvh] text-zinc-100 overflow-x-hidden" style={{ background: BG }}>
      {/* Page-level ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{
        background: `radial-gradient(900px 800px at 80% -10%, ${V1}18, transparent 60%),
                     radial-gradient(600px 500px at -10% 90%, ${PINK}0D, transparent 60%)`,
      }}/>
      <div className="relative z-10">
        <Nav />
        <Hero />
        <StatsBar />
        <ICPSection />
        <TeamSection />
        <HowItWorks />
        <Results />
        <Cases />
        <FinalCTA />
        <SiteFooter />
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{
      background: `${BG}CC`, borderColor: BORDER,
    }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RConfLogo size={34}/>
          <span className="font-semibold text-white tracking-tight text-[15px]">RConf</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[14px] text-zinc-400">
          {[["#features","Продукт"],["#how","Как работает"],["#cases","Кейсы"],["#cta","Контакты"]].map(([h,l]) => (
            <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#how" className="hidden md:inline-flex items-center gap-1.5 text-[14px] text-zinc-300 hover:text-white transition-colors">
            <Play className="w-3 h-3 fill-current"/> Демо
          </a>
          <a href="#cta"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[14px] text-white font-medium transition-opacity hover:opacity-85"
            style={{ background: `linear-gradient(135deg, ${V1}, ${V2})`, boxShadow: `0 4px 24px -4px ${V1}70` }}>
            Попробовать бесплатно <ArrowRight className="w-3.5 h-3.5"/>
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero (wope.com layout — pixel perfect) ───────────────────────────────────
const RAYS = [
  {a:  0, l:520}, {a: 12, l:460}, {a: 24, l:540}, {a: 36, l:480}, {a: 48, l:500},
  {a: 60, l:470}, {a: 72, l:510}, {a: 84, l:450}, {a: 96, l:530}, {a:108, l:490},
  {a:120, l:560}, {a:132, l:440}, {a:144, l:550}, {a:156, l:470}, {a:168, l:530},
  {a:180, l:500}, {a:192, l:460}, {a:204, l:540}, {a:216, l:480}, {a:228, l:510},
  {a:240, l:470}, {a:252, l:520}, {a:264, l:450}, {a:276, l:530}, {a:288, l:490},
  {a:300, l:560}, {a:312, l:440}, {a:324, l:520}, {a:336, l:470}, {a:348, l:510},
];

function WopeRays() {
  return (
    <svg aria-hidden className="pointer-events-none"
      style={{ position:"absolute", left:"50%", top:0, transform:"translateX(-50%)",
        width:1200, height:700, overflow:"visible", zIndex:1 }}
      viewBox="-600 0 1200 700">
      <defs>
        <linearGradient id="rayFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={V1} stopOpacity="0"/>
          <stop offset="30%"  stopColor={V1} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={V1} stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="rayR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 340) scale(600 400)">
          <stop offset="0%"   stopColor={V1} stopOpacity="0.7"/>
          <stop offset="60%"  stopColor={V2} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={V1} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {RAYS.map(({a, l}, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={0} y1={340}
            x2={Math.cos(r) * l}
            y2={340 + Math.sin(r) * l}
            stroke={V1}
            strokeWidth={i % 5 === 0 ? 1.0 : 0.4}
            strokeOpacity={i % 5 === 0 ? 0.45 : 0.18}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.1 + i * 0.03, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
}

function Hero() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden" style={{ background:"#08051A" }}>

      {/* ── Тёмная сетка ── */}
      <GridBg opacity={0.025}/>

      {/* ── ГЛАВНЫЙ SPOTLIGHT (как у wope — яркое фиолетовое пятно по центру) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0"
        style={{ top: 220, height: 700, zIndex: 0,
          background:`radial-gradient(ellipse 800px 500px at 50% 0%,
            #7C3AED88 0%,
            #6D28D960 20%,
            #5B21B625 50%,
            transparent 75%)` }}/>

      {/* Дополнительный точечный блик в центре */}
      <div aria-hidden className="pointer-events-none absolute"
        style={{ left:"50%", top: 300, transform:"translate(-50%,-50%)",
          width:320, height:320, borderRadius:"50%", zIndex:0,
          background:`radial-gradient(circle, #A78BFA55 0%, #7C3AED22 40%, transparent 75%)`,
          filter:"blur(8px)" }}/>

      {/* ── Лучи (WopeRays позиционированы на y=340 от верха секции) ── */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex:1 }}>
        <WopeRays/>
      </div>

      {/* ── КОНТЕНТ ── */}
      <div className="relative" style={{ zIndex:2 }}>

        {/* ═══ Текстовый блок — точно как у wope ═══ */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
          textAlign:"center", padding:"72px 20px 0" }}>

          {/* H1 — крупный, uppercase, точно как на скриншоте */}
          <motion.h1
            initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.75, delay:0.05, ease:[0.22,1,0.36,1] }}
            style={{ fontWeight:800, color:"#FFFFFF", lineHeight:1.06,
              letterSpacing:"-0.01em", marginBottom:24, maxWidth:960,
              fontSize:"clamp(28px,3.6vw,52px)", textAlign:"center",
              textTransform:"uppercase", fontFeatureSettings:"normal",
              fontVariant:"normal", fontStyle:"normal" }}>
            Выявляйте слабые места команды<br/>после каждой сессии
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.15 }}
            style={{ fontSize:15, lineHeight:1.65, color:"#94A3B8",
              maxWidth:"56ch", marginBottom:28, textAlign:"center" }}>
            RConf AI анализирует встречи и показывает HR-директору,
            кто выгорает, кто готов к росту и где команда теряет эффективность —
            {" "}<span style={{ color:"#fff", fontWeight:500 }}>автоматически после каждой сессии.</span>
          </motion.p>

          {/* Email pill + кнопка */}
          <motion.div
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, delay:0.22 }}
            style={{ display:"flex", alignItems:"center", width:"100%", maxWidth:440,
              borderRadius:999, border:`1px solid rgba(139,92,246,0.22)`,
              background:"rgba(255,255,255,0.05)", padding:"5px 5px 5px 14px",
              marginBottom:12,
              boxShadow:`0 0 0 1px rgba(139,92,246,0.15), 0 8px 48px -8px rgba(124,58,237,0.55)` }}>
            <Mail style={{ width:15, height:15, color:"#475569", flexShrink:0 }}/>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ваш@email.ru"
              style={{ flex:1, background:"transparent", border:"none", outline:"none",
                fontSize:14, color:"#fff", padding:"5px 10px",
                caretColor: V2 }}/>
            <a href="#cta" style={{ flexShrink:0, display:"inline-flex", alignItems:"center",
              gap:6, borderRadius:999, padding:"9px 20px",
              fontSize:14, fontWeight:600, color:"#fff", textDecoration:"none",
              background:`linear-gradient(135deg, ${V1}, ${V2})`,
              boxShadow:`0 4px 20px -4px rgba(124,58,237,0.7)` }}>
              Попробовать <ArrowRight style={{ width:13, height:13 }}/>
            </a>
          </motion.div>

          {/* Hint строка */}
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.32 }}
            style={{ fontSize:13, color:"#334155", marginBottom:48, display:"flex",
              alignItems:"center", gap:8 }}>
            <span>Бесплатно</span>
            <span style={{ color:"#1E293B" }}>·</span>
            <span>Без карты</span>
            <span style={{ color:"#1E293B" }}>·</span>
            <span>Серверы РФ</span>
            <span style={{ color:"#1E293B" }}>·</span>
            <span>ФЗ-152</span>
          </motion.p>
        </div>

        {/* ── Browser mockup (точно как у wope — на всю ширину, снизу) ── */}
        <motion.div
          initial={{ opacity:0, y:60, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:1.1, delay:0.35, ease:[0.22,1,0.36,1] }}
          style={{ position:"relative", maxWidth:1160, margin:"0 auto", padding:"0 20px" }}>

          {/* Floating chip — ФЗ */}
          <motion.div
            animate={{ y:[0,-6,0] }} transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:1.3 }}
            style={{ position:"absolute", top:-18, right:32, zIndex:20,
              display:"inline-flex", alignItems:"center", gap:8,
              borderRadius:14, padding:"8px 14px", backdropFilter:"blur(20px)",
              background:"rgba(14,10,28,0.97)", border:`1px solid ${BORDER}`,
              boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
            <ShieldCheck style={{ width:15, height:15, color: V2 }}/>
            <span style={{ fontSize:13, fontWeight:500, color:"#fff" }}>ФЗ-152 · Серверы РФ</span>
          </motion.div>

          {/* Floating chip — эффективность */}
          <motion.div
            animate={{ y:[0,6,0] }} transition={{ duration:4.2, repeat:Infinity, ease:"easeInOut", delay:0.6 }}
            style={{ position:"absolute", top:-18, left:32, zIndex:20,
              display:"inline-flex", alignItems:"center", gap:8,
              borderRadius:14, padding:"8px 14px", backdropFilter:"blur(20px)",
              background:"rgba(14,10,28,0.97)", border:`1px solid ${PINK}35`,
              boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
            <TrendingUp style={{ width:15, height:15, color: PINK }}/>
            <span style={{ fontSize:13, fontWeight:500, color:"#fff" }}>+62% эффективность</span>
          </motion.div>

          {/* Browser frame */}
          <div style={{ borderRadius:"16px 16px 0 0", overflow:"hidden",
            border:`1px solid ${BORDER}`, borderBottom:"none",
            background: CARD,
            boxShadow:`0 -32px 100px -10px ${V1}40, 0 0 0 1px ${V1}12, inset 0 1px 0 rgba(255,255,255,0.06)` }}>

            {/* Chrome bar */}
            <div style={{ display:"flex", alignItems:"center", padding:"12px 20px",
              borderBottom:`1px solid ${BORDER}`, background:"rgba(7,4,15,0.85)" }}>
              {/* Dots */}
              <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                <span style={{ width:12, height:12, borderRadius:"50%", background:"#FF5F57" }}/>
                <span style={{ width:12, height:12, borderRadius:"50%", background:"#FEBC2E" }}/>
                <span style={{ width:12, height:12, borderRadius:"50%", background:"#28C840" }}/>
              </div>
              {/* URL bar centered */}
              <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10,
                  borderRadius:999, padding:"6px 16px", maxWidth:420, width:"100%",
                  background:"rgba(255,255,255,0.05)", border:`1px solid ${BORDER}`,
                  fontSize:12, fontFamily:"monospace", color:"#64748B" }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", flexShrink:0 }}/>
                  rconf.ru/dashboard · Ретроспектива Sprint 42
                </div>
              </div>
              {/* Live */}
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <span style={{ position:"relative", display:"inline-flex", width:8, height:8 }}>
                  <span className="animate-ping" style={{ position:"absolute", inset:0,
                    borderRadius:"50%", background:"#4ade80", opacity:0.6 }}/>
                  <span style={{ position:"relative", width:8, height:8, borderRadius:"50%", background:"#4ade80" }}/>
                </span>
                <span style={{ fontSize:12, color:"#4ade80", fontWeight:500 }}>Live</span>
              </div>
            </div>

            {/* Dashboard body */}
            <div style={{ display:"grid", gridTemplateColumns:"240px 1fr" }}>

              {/* Sidebar */}
              <div style={{ borderRight:`1px solid ${BORDER}`,
                background:"rgba(7,4,15,0.6)", padding:16 }}>
                <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase",
                  letterSpacing:"0.15em", color:`${V1}70`, marginBottom:12, padding:"0 8px" }}>
                  Сессии
                </p>
                {[
                  { name:"Ретроспектива Sprint 42", date:"14 апр", active:true  },
                  { name:"Планирование Q2",          date:"11 апр", active:false },
                  { name:"Оценка рисков",            date:"9 апр",  active:false },
                  { name:"1-on-1 с командой",        date:"7 апр",  active:false },
                ].map((s,i) => (
                  <div key={i} style={{ borderRadius:12, padding:"10px 12px", marginBottom:4,
                    background: s.active ? `${V1}22` : "transparent",
                    border:`1px solid ${s.active ? `${V1}40` : "transparent"}` }}>
                    <p style={{ fontSize:12, fontWeight:500, lineHeight:1.3,
                      color: s.active ? V2 : "rgba(255,255,255,0.4)", marginBottom:2 }}>
                      {s.name}
                    </p>
                    <p style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>{s.date}</p>
                  </div>
                ))}
              </div>

              {/* Main panel */}
              <div style={{ padding:20 }}>

                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <p style={{ fontSize:16, fontWeight:600, color:"#fff", marginBottom:3 }}>
                      Ретроспектива Sprint 42
                    </p>
                    <p style={{ fontSize:12, color:"#64748B" }}>
                      9 участников · 47 мин · 14 апр 2025
                    </p>
                  </div>
                  <span style={{ fontSize:12, padding:"5px 14px", borderRadius:999,
                    background:`${V1}20`, color: V2, border:`1px solid ${V1}30`,
                    fontWeight:500 }}>
                    Анализ готов
                  </span>
                </div>

                {/* KPI row */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                  {[
                    { l:"Эффективность", v:"8.4/10", c: V2      },
                    { l:"Вовлечённость", v:"71%",    c:"#4ade80" },
                    { l:"Решения",       v:"7 из 8", c: V2       },
                    { l:"Риски",         v:"1 чел.", c: PINK     },
                  ].map(m => (
                    <div key={m.l} style={{ borderRadius:12, padding:"12px 10px", textAlign:"center",
                      background:"rgba(255,255,255,0.025)", border:`1px solid ${BORDER}` }}>
                      <p style={{ fontSize:19, fontWeight:700, color: m.c, marginBottom:2 }}>{m.v}</p>
                      <p style={{ fontSize:11, color:"#64748B" }}>{m.l}</p>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                  {/* Timeline */}
                  <div style={{ borderRadius:12, padding:14, border:`1px solid ${BORDER}`,
                    background:"rgba(255,255,255,0.02)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center", marginBottom:10 }}>
                      <p style={{ fontSize:12, color:"#94A3B8", fontWeight:500 }}>
                        Вовлечённость по времени
                      </p>
                      <p style={{ fontSize:11, color: V2 }}>Ср. 71%</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:52 }}>
                      {[55,62,58,70,85,72,65,78,90,82,75,68,80,88,76,70,65,58,72,80,85,78,72,68].map((v,i) => (
                        <motion.div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0",
                          background: v>80 ? V2 : v>65 ? `${V1}90` : `${V1}40` }}
                          initial={{ height:0 }} animate={{ height:`${v}%` }}
                          transition={{ delay:0.5+i*0.02, duration:0.3 }}/>
                      ))}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      fontSize:10, color:"#334155", marginTop:6 }}>
                      <span>0:00</span><span>15:00</span><span>30:00</span><span>47:00</span>
                    </div>
                  </div>

                  {/* AI insight */}
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
                    style={{ borderRadius:12, padding:14, border:`1px solid ${PINK}25`,
                      background:`${PINK}08`, display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Lightbulb style={{ width:15, height:15, color: PINK, flexShrink:0 }}/>
                      <p style={{ fontSize:12, fontWeight:600, color: PINK }}>AI-инсайт</p>
                    </div>
                    <p style={{ fontSize:12, color:"#CBD5E1", lineHeight:1.5 }}>
                      Дмитрий В. вовлечён на 38% — риск выгорания.
                      Рекомендуется 1-on-1 с тимлидом до конца недели.
                    </p>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:"auto" }}>
                      <Brain style={{ width:11, height:11, color:`${V2}70` }}/>
                      <span style={{ fontSize:10, color:`${V2}55` }}>
                        Сгенерировано RConf AI · только что
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Participants */}
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[
                    { n:"Александр К.", r:"Тимлид",      pct:87, low:false },
                    { n:"Мария С.",     r:"Разработчик", pct:74, low:false },
                    { n:"Дмитрий В.",   r:"QA Engineer", pct:38, low:true  },
                    { n:"Елена П.",     r:"PM",          pct:81, low:false },
                  ].map((m,i) => (
                    <motion.div key={m.n}
                      initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.8+i*0.07 }}
                      style={{ display:"flex", alignItems:"center", gap:12,
                        borderRadius:12, padding:"10px 14px",
                        background: m.low ? `${PINK}08` : "rgba(255,255,255,0.02)",
                        border:`1px solid ${m.low ? `${PINK}22` : BORDER}` }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
                        background: m.low ? PINK : "#4ade80" }}/>
                      <span style={{ fontSize:13, color:"#E2E8F0", width:110,
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {m.n}
                      </span>
                      <span style={{ fontSize:11, color:"#64748B", flex:1 }}>{m.r}</span>
                      <div style={{ width:100, height:5, borderRadius:99,
                        background:"rgba(255,255,255,0.07)" }}>
                        <motion.div style={{ height:"100%", borderRadius:99,
                          background: m.low ? PINK : V2 }}
                          initial={{ width:0 }} animate={{ width:`${m.pct}%` }}
                          transition={{ delay:1+i*0.07, duration:0.7 }}/>
                      </div>
                      <span style={{ fontSize:12, fontFamily:"monospace", width:32,
                        textAlign:"right",
                        color: m.low ? PINK : "rgba(255,255,255,0.4)" }}>
                        {m.pct}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom gradient fade */}
            <div style={{ height:72, pointerEvents:"none",
              background:`linear-gradient(to bottom, transparent, #08051A)` }}/>
          </div>
        </motion.div>

        {/* ── Trust logos — российские компании ── */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}
          style={{ borderTop:`1px solid rgba(139,92,246,0.15)`, padding:"24px 20px 32px" }}>
          <p style={{ textAlign:"center", fontSize:11, textTransform:"uppercase",
            letterSpacing:"0.2em", color:"#1E293B", marginBottom:22 }}>
            Используют команды в компаниях
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center",
            justifyContent:"center", gap:"0 48px", rowGap:14 }}>
            {[
              { name:"Сбер",      w:700 },
              { name:"Яндекс",    w:700 },
              { name:"ВКонтакте", w:700 },
              { name:"МТС",       w:800 },
              { name:"Мегафон",   w:700 },
              { name:"Ozon",      w:700 },
            ].map(({ name, w }) => (
              <span key={name}
                style={{ fontSize:15, fontWeight:w, letterSpacing:"-0.02em",
                  color:"rgba(255,255,255,0.2)", cursor:"default",
                  transition:"color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color="rgba(255,255,255,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.2)")}>
                {name}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ─── Stats cards ──────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { to:40,  s:"%",     p:"+", label:"рост конверсии",        sub:"менеджеров", ctx:"за 3 месяца",    icon:TrendingUp, glow:V2   },
    { to:60,  s:"%",     p:"−", label:"сокращение адаптации",  sub:"новых сотрудников", ctx:"по клиентам", icon:Zap,     glow:V1   },
    { to:48,  s:"%",     p:"−", label:"снижение текучести",    sub:"руководителей",  ctx:"за полгода",  icon:Users,    glow:PINK  },
    { to:2.5, s:" млн",  p:"",  label:"экономия на обучении",  sub:"в год на компанию", ctx:"в среднем", icon:Award,   glow:V2, d:1 },
  ];

  return (
    <section className="border-t border-b" style={{ borderColor: BORDER }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}
              className="rounded-2xl p-5 md:p-6 border relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              style={{ background: CARD, borderColor:`${m.glow}25` }}>
              {/* Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity"
                style={{ background: m.glow }}/>
              <div className="relative">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background:`${m.glow}18`, color: m.glow }}>
                  <m.icon className="w-4 h-4"/>
                </div>
                <p className="font-black tracking-tight leading-none mb-1"
                  style={{ fontSize:"clamp(40px,5vw,60px)",
                    background:`linear-gradient(135deg, ${m.glow}, ${m.glow}CC)`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  <Counter to={m.to} suffix={m.s} prefix={m.p} decimals={m.d??0}/>
                </p>
                <p className="text-[14px] font-semibold text-white leading-snug">{m.label}</p>
                <p className="text-[12px] mt-0.5" style={{ color:`${m.glow}99` }}>{m.sub}</p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide"
                  style={{ background:`${m.glow}12`, color:`${m.glow}CC`, border:`1px solid ${m.glow}20` }}>
                  {m.ctx}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ICP — кому это ──────────────────────────────────────────────────────────
function ICPSection() {
  const roles = [
    {
      icon: Users,
      role: "HR-директор",
      pain: "Не знаете, кто на грани увольнения?",
      bullets: ["Видите риски выгорания до того, как сотрудник уйдёт", "Формируете кадровый резерв без интервью"],
      glow: V1,
    },
    {
      icon: BarChart3,
      role: "L&D специалист",
      pain: "Обучаете всех одинаково?",
      bullets: ["Получаете данные: кому нужен коучинг, а кто готов к повышению", "Один эксперт охватывает 5 команд вместо 2"],
      glow: V2,
    },
    {
      icon: Target,
      role: "Team Lead",
      pain: "Догадываетесь о проблемах после факта?",
      bullets: ["Получаете фидбек по своему стилю управления после каждой встречи", "Видите, кто молчит, хотя должен говорить"],
      glow: PINK,
    },
  ];

  return (
    <section id="features" className="border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <motion.div {...fadeUp} className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] mb-3" style={{ color: V2 }}>Кому это</p>
          <h2 className="text-3xl md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-white max-w-[24ch]">
            Сделано для тех,{" "}
            <span className="text-zinc-300">кто отвечает за людей.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {roles.map((r, i) => (
            <motion.div key={r.role}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}
              className="group rounded-2xl p-6 border relative overflow-hidden hover:scale-[1.015] transition-all duration-300"
              style={{ background: CARD, borderColor:`${r.glow}22` }}>
              <div className="absolute top-0 left-0 right-0 h-40 opacity-50 group-hover:opacity-80 transition-opacity"
                style={{ background:`linear-gradient(180deg, ${r.glow}15 0%, transparent 100%)` }}/>
              <div className="relative">
                {/* Role badge */}
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-5"
                  style={{ background:`${r.glow}18`, color: r.glow, border:`1px solid ${r.glow}30` }}>
                  <r.icon className="w-3 h-3"/> {r.role}
                </div>
                {/* Pain */}
                <p className="text-[18px] font-bold text-white mb-4 leading-snug">{r.pain}</p>
                {/* 2 bullets max */}
                <ul className="space-y-3">
                  {r.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ background: r.glow }}/>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Team section (product UI panels) ───────────────────────────────────────
function TeamSection() {
  return (
    <section className="border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 items-center">

          {/* Left text */}
          <motion.div {...fadeUp} className="md:col-span-5">
            <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: V2 }}>О сервисе</p>
            <h2 className="text-3xl md:text-[44px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
              Каждая встреча —<br/>
              <span style={{ background:`linear-gradient(135deg, ${V2}, ${PINK})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                точка роста команды.
              </span>
            </h2>
            <p className="text-[16px] text-zinc-400 leading-[1.65] mb-8">
              Большинство команд теряют до 30% эффективности из-за неструктурированных
              встреч и отсутствия обратной связи. RConf AI превращает каждое совещание
              в источник данных для роста каждого сотрудника.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Выявляет скрытых лидеров и таланты",
                "Определяет низкую вовлечённость до увольнения",
                "Даёт менеджеру фидбек после каждой встречи",
                "Масштабирует экспертизу без роста штата",
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-zinc-300">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background:`${V1}20` }}>
                    <Check className="w-3 h-3" style={{ color: V2 }}/>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#cta"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background:`linear-gradient(135deg, ${V1}, ${V2})`, boxShadow:`0 8px 30px -6px ${V1}60` }}>
              Обсудить для вашей команды <ArrowRight className="w-4 h-4"/>
            </a>
          </motion.div>

          {/* Right: product UI panels */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-3">

              {/* Большое фото — командная встреча + данные поверх */}
              <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ duration:0.7 }}
                className="col-span-2 rounded-2xl overflow-hidden relative border"
                style={{ borderColor: BORDER }}>
                <div className="aspect-[16/7] relative">
                  <img
                    src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="" className="w-full h-full object-cover"/>
                  {/* Overlay */}
                  <div className="absolute inset-0" style={{ background:`linear-gradient(135deg, ${BG}CC 0%, ${V1}55 100%)` }}/>
                  {/* Data overlay */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#4ade80" }}/>
                      <span className="text-[11px] font-medium text-emerald-400">Анализ в реальном времени</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { v:"+40%", l:"конверсия менеджеров", c: V2 },
                        { v:"8.4/10", l:"средняя эффективность", c:"#4ade80" },
                        { v:"−60%", l:"срок адаптации", c: PINK },
                      ].map(m => (
                        <div key={m.l} className="rounded-xl p-3 backdrop-blur-md border"
                          style={{ background:"rgba(7,4,15,0.75)", borderColor:`${m.c}30` }}>
                          <p className="text-[22px] font-black leading-none" style={{ color: m.c }}>{m.v}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">{m.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Фото 2 — 1-on-1 + риск */}
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:0.15, duration:0.6 }}
                className="rounded-2xl overflow-hidden relative border" style={{ borderColor: BORDER }}>
                <div className="aspect-square relative">
                  <img
                    src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0" style={{ background:`linear-gradient(160deg, ${BG}BB, ${PINK}44)` }}/>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="rounded-xl p-3 backdrop-blur-md border" style={{ background:"rgba(7,4,15,0.8)", borderColor:`${PINK}30` }}>
                      <p className="text-[10px] font-semibold mb-1" style={{ color: PINK }}>⚠ AI-инсайт</p>
                      <p className="text-[12px] text-white font-semibold">Риск выгорания выявлен</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">до того, как сотрудник решил уйти</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Фото 3 — встреча + рост */}
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:0.25, duration:0.6 }}
                className="rounded-2xl overflow-hidden relative border" style={{ borderColor: BORDER }}>
                <div className="aspect-square relative">
                  <img
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0" style={{ background:`linear-gradient(160deg, ${BG}BB, ${V2}44)` }}/>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="rounded-xl p-3 backdrop-blur-md border" style={{ background:"rgba(7,4,15,0.8)", borderColor:`${V2}30` }}>
                      <p className="text-[22px] font-black leading-none" style={{ color: V2 }}>−48%</p>
                      <p className="text-[11px] text-white font-semibold mt-0.5">текучесть руководителей</p>
                      <p className="text-[10px] text-zinc-400">за первые 6 месяцев</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n:"01", icon:Users,      title:"Команда проводит встречу",        body:"Ретроспектива, daily, переговоры или оценка зрелости — подключайте к любому формату.", color:V1 },
    { n:"02", icon:Brain,      title:"AI анализирует в реальном времени", body:"Фиксирует паттерны поведения, речи и вовлечённости каждого участника автоматически.",  color:V2 },
    { n:"03", icon:BarChart3,  title:"Дашборд с инсайтами",             body:"Через 5 минут — структурированный отчёт с персональными рекомендациями для каждого.",   color:PINK },
    { n:"04", icon:TrendingUp, title:"Рост команды",                    body:"Конкретные действия → измеримый результат → кадровый резерв без дополнительных ресурсов.", color:V1 },
  ];

  return (
    <section id="how" className="border-t relative" style={{ borderColor: BORDER }}>
      <GridBg opacity={0.025}/>
      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: V2 }}>Как работает</p>
          <h2 className="text-3xl md:text-[52px] font-bold tracking-[-0.03em] leading-[1.08] text-white">
            От встречи до роста эффективности —
            <br/><span className="text-zinc-300">четыре шага.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-5 mb-20">
          {steps.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.5 }}
              className="relative rounded-2xl p-6 border text-center group hover:scale-[1.02] transition-all duration-300"
              style={{ background: CARD, borderColor:`${s.color}25` }}>
              <div className="absolute top-0 left-0 right-0 h-24 rounded-t-2xl opacity-50"
                style={{ background:`linear-gradient(180deg, ${s.color}15, transparent)` }}/>
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
                  style={{ background:`${s.color}15`, borderColor:`${s.color}30`, color:s.color }}>
                  <s.icon className="w-5 h-5"/>
                </div>
                <p className="font-mono text-xs mb-3" style={{ color:`${s.color}90` }}>Шаг {s.n}</p>
                <h3 className="text-[16px] font-bold text-white mb-3 leading-snug">{s.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard mockup */}
        <motion.div {...fadeUp} className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, background: CARD }}>
          <div className="px-5 py-3 border-b flex items-center gap-2.5" style={{ borderColor: BORDER, background:`${BG}BB` }}>
            <div className="flex gap-1.5">
              {["rgba(255,255,255,0.1)","rgba(255,255,255,0.1)",`${V1}80`].map((c,i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }}/>
              ))}
            </div>
            <div className="flex-1 max-w-[240px] mx-auto rounded-md px-3 py-1 text-xs text-zinc-600 font-mono text-center"
              style={{ background:"rgba(255,255,255,0.04)" }}>rconf.ru · дашборд</div>
          </div>

          <div className="p-5 md:p-6 grid md:grid-cols-3 gap-4">
            {/* Team list */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-4">Команда · Sprint 42</p>
              {[
                { n:"Александр К.", r:"Тимлид",      s:92, d:"+5",  w:false },
                { n:"Мария С.",     r:"Разработчик", s:78, d:"+12", w:false },
                { n:"Дмитрий В.",   r:"QA",          s:43, d:"−8",  w:true  },
                { n:"Елена П.",     r:"PM",          s:85, d:"+3",  w:false },
              ].map(m => (
                <div key={m.n} className="flex items-center justify-between p-3 rounded-xl border mb-2"
                  style={{ borderColor: m.w?"rgba(236,72,153,0.2)":BORDER, background: m.w?`${PINK}08`:BGCARD }}>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{m.n}</p>
                    <p className="text-[11px] text-zinc-600">{m.r}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: m.w ? PINK : V2 }}>{m.s}</p>
                    <p className="text-[11px]" style={{ color: m.w?"rgba(236,72,153,0.7)":"rgba(52,211,153,0.7)" }}>{m.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="rounded-xl border p-4 flex flex-col" style={{ borderColor: BORDER, background: BGCARD }}>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-4">Эффективность · 8 недель</p>
              <div className="flex-1 flex items-end gap-2 pb-2">
                {[42,51,47,60,57,68,75,83].map((h,i) => (
                  <motion.div key={i} className="flex-1 rounded-t-sm"
                    style={{ background:`linear-gradient(to top, ${V1}80, ${V2}50)` }}
                    initial={{ height:0 }} whileInView={{ height:`${h}%` }}
                    viewport={{ once:true }} transition={{ delay:0.3+i*0.07, duration:0.55, ease:"easeOut" }}/>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-zinc-700 mt-2">
                {["Н1","Н2","Н3","Н4","Н5","Н6","Н7","Н8"].map(w => <span key={w}>{w}</span>)}
              </div>
            </div>

            {/* Insights */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-4">Инсайты AI</p>
              {[
                { e:"⚠️", t:"Дмитрий В. — низкая активность 3 встречи подряд", w:true  },
                { e:"⭐", t:"Мария С. — скрытый лидер, рекомендуем повышение",  w:false },
                { e:"💡", t:"Daily слишком длинные — сократить до 15 минут",    w:false },
                { e:"📈", t:"Команда растёт: +27% эффективность за спринт",    w:false },
              ].map((ins,i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border mb-2 text-[12px]"
                  style={{ borderColor: ins.w?`${PINK}25`:BORDER, background: ins.w?`${PINK}06`:BGCARD }}>
                  <span className="text-sm shrink-0">{ins.e}</span>
                  <p className="text-zinc-300 leading-relaxed">{ins.t}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function Results() {
  return (
    <section className="border-t relative overflow-hidden" style={{ borderColor: BORDER, background: CARD }}>
      <GridBg opacity={0.03}/>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] blur-[120px] pointer-events-none opacity-20"
        style={{ background:`radial-gradient(ellipse, ${V1} 0%, ${PINK}44 50%, transparent 70%)` }}/>

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: V2 }}>Результаты</p>
          <h2 className="text-3xl md:text-[52px] font-bold tracking-[-0.03em] leading-[1.08] text-white">
            Измеримый результат —<br/><span className="text-zinc-300">не обещания.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px rounded-3xl overflow-hidden border" style={{ borderColor: BORDER }}>
          {[
            { to:62, s:"%", p:"+", l:"рост эффективности команды",   sub:"в среднем по клиентам" },
            { to:35, s:"%", p:"−", l:"потери времени на митингах",   sub:"меньше лишних встреч"  },
            { to:3,  s:"×", p:"",  l:"быстрее принятие решений",     sub:"по данным кейсов"      },
          ].map((s, i) => (
            <motion.div key={s.l}
              initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.5 }}
              className="group px-8 py-14 text-center relative border-r last:border-0" style={{ borderColor: BORDER, background: BG }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background:`${V1}06` }}/>
              <p className="font-black tracking-[-0.04em] leading-none mb-4"
                style={{ fontSize:"clamp(56px,7vw,90px)",
                  background:`linear-gradient(135deg, ${V2}, ${PINK})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                <Counter to={s.to} suffix={s.s} prefix={s.p}/>
              </p>
              <p className="text-[18px] font-bold text-white mb-2">{s.l}</p>
              <p className="text-[14px] text-zinc-400">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cases ────────────────────────────────────────────────────────────────────
function Cases() {
  const cases = [
    { company:"ИТ-компания", detail:"3 000+ сотрудников", keyMetric:"−60%", keyLabel:"срок адаптации", keyCtx:"с 3 месяцев до 5 недель", secondary:[{v:"+40%",l:"конверсия менеджеров"},{v:"−2,5 млн ₽",l:"на обучении / год"}], quote:"Каждый руководитель получает фидбек после каждой встречи.", glow:V1 },
    { company:"Федеральный ритейлер", detail:"Сеть по всей России", keyMetric:"−48%", keyLabel:"текучесть руководителей", keyCtx:"за первые полгода", secondary:[{v:"+35%",l:"NPS сотрудников"},{v:"×3",l:"скорость выявления лидеров"}], quote:"ИИ видит потенциал там, где мы бы не посмотрели.", glow:V2 },
    { company:"Банк СНГ", detail:"Agile-трансформация", keyMetric:"1 → 5", keyLabel:"команд на эксперта", keyCtx:"без потери качества фидбека", secondary:[{v:"+60%",l:"соблюдение Agile"},{v:"×2,5",l:"охват без роста штата"}], quote:"Один коуч покрывает пять команд вместо двух.", glow:PINK },
  ];

  return (
    <section id="cases" className="border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <motion.div {...fadeUp} className="mb-14">
          <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: V2 }}>Кейсы клиентов</p>
          <h2 className="text-3xl md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-white">
            Реальные компании.<br/><span className="text-zinc-300">Конкретные цифры.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {cases.map((c, i) => (
            <motion.div key={c.company}
              initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}
              className="rounded-2xl border overflow-hidden flex flex-col"
              style={{ background: CARD, borderColor:`${c.glow}28` }}>
              {/* Header */}
              <div className="px-5 py-4 border-b" style={{ borderColor:`${c.glow}15` }}>
                <p className="font-bold text-white text-[15px]">{c.company}</p>
                <p className="text-[12px] text-zinc-400 mt-0.5">{c.detail}</p>
              </div>
              {/* KEY metric — hero of the card */}
              <div className="px-5 py-5 relative overflow-hidden" style={{ background:`${c.glow}0E` }}>
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl"
                  style={{ background: c.glow, opacity:0.25 }}/>
                <p className="font-black leading-none tracking-tight"
                  style={{ fontSize:"clamp(44px,5.5vw,60px)",
                    background:`linear-gradient(135deg, ${c.glow}, ${c.glow}BB)`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  {c.keyMetric}
                </p>
                <p className="text-[15px] font-semibold text-white mt-1.5">{c.keyLabel}</p>
                <p className="text-[12px] mt-1" style={{ color:`${c.glow}AA` }}>{c.keyCtx}</p>
              </div>
              {/* Secondary metrics */}
              <div className="grid grid-cols-2 border-t border-b" style={{ borderColor:`${c.glow}15` }}>
                {c.secondary.map(m => (
                  <div key={m.l} className="px-4 py-3 border-r last:border-r-0 text-center" style={{ borderColor:`${c.glow}15` }}>
                    <p className="text-[15px] font-bold text-white">{m.v}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{m.l}</p>
                  </div>
                ))}
              </div>
              {/* Quote */}
              <div className="px-5 py-4 flex-1">
                <p className="text-[13px] text-zinc-400 leading-relaxed italic">&ldquo;{c.quote}&rdquo;</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="cta" className="border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6 }}
          className="relative overflow-hidden rounded-3xl border p-8 md:p-14"
          style={{ background: CARD, borderColor: BORDER }}>

          {/* Glows */}
          <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
            style={{ background:`radial-gradient(circle, ${V1}, transparent 70%)`, opacity:0.15 }}/>
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
            style={{ background:`radial-gradient(circle, ${PINK}, transparent 70%)`, opacity:0.08 }}/>
          <GridBg opacity={0.03}/>

          <div className="relative grid md:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: V2 }}>Начать бесплатно</p>
              <h2 className="text-3xl md:text-[46px] font-bold tracking-[-0.035em] leading-[1.05] text-white mb-5">
                Готовы вырастить команду с помощью ИИ?
              </h2>
              <p className="text-[16px] text-zinc-400 leading-relaxed mb-8 max-w-[44ch]">
                Оставьте заявку — специалист свяжется в течение рабочего дня
                и предложит формат работы под ваши задачи.
              </p>
              <ul className="space-y-3.5">
                {["Бесплатный пилот для одной команды","Внедрение без IT-ресурса","Первые результаты за один спринт"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-zinc-300">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background:`${V1}20` }}>
                      <Check className="w-3 h-3" style={{ color: V2 }}/>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: BORDER, background:"rgba(255,255,255,0.025)" }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id:"name",    label:"Имя",       placeholder:"Александр",           type:"text" },
                  { id:"company", label:"Компания",  placeholder:"ООО «Пример»",        type:"text" },
                  { id:"email",   label:"Email",     placeholder:"a@company.ru",        type:"email" },
                  { id:"phone",   label:"Телефон",   placeholder:"+7 (___) ___-__-__",  type:"tel" },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">{f.label}</label>
                    <input id={f.id} type={f.type} placeholder={f.placeholder}
                      className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-zinc-700 focus:outline-none transition-all"
                      style={{ border:`1px solid ${BORDER}`, background:"rgba(255,255,255,0.04)" }}
                      onFocus={e => { e.currentTarget.style.borderColor = `${V1}60`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = BORDER;    e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="role" className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">Должность</label>
                <input id="role" type="text" placeholder="HR-директор, CHRO, Team Lead..."
                  className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-zinc-700 focus:outline-none transition-all"
                  style={{ border:`1px solid ${BORDER}`, background:"rgba(255,255,255,0.04)" }}
                  onFocus={e => { e.currentTarget.style.borderColor = `${V1}60`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = BORDER;    e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                />
              </div>
              <button
                className="w-full rounded-xl text-white py-3.5 text-[15px] font-bold flex items-center justify-center gap-2 group transition-opacity hover:opacity-85"
                style={{ background:`linear-gradient(135deg, ${V1}, ${V2})`, boxShadow:`0 10px 40px -8px ${V1}70` }}>
                Обсудить решение для команды <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5"/>
              </button>
              <p className="text-center text-[12px] text-zinc-700">Ответим в течение рабочего дня · Без обязательств · ФЗ-152</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: BORDER, background: CARD }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <RConfLogo size={34}/>
              <span className="font-bold text-white text-lg">RConf</span>
            </div>
            <p className="text-[14px] text-zinc-400 leading-relaxed max-w-[38ch] mb-6">
              Система для развития команд на основе искусственного интеллекта.
              Анализирует встречи, выявляет паттерны, даёт рекомендации.
            </p>
            <div className="space-y-3 text-[14px] text-zinc-400">
              {[
                { href:"tel:+74951084698",         icon:PhoneCall, text:"+7 (495) 108-46-98" },
                { href:"mailto:sales@cyberskill.net", icon:Mail,  text:"sales@cyberskill.net" },
              ].map(({ href, icon:Icon, text }) => (
                <a key={href} href={href} className="flex items-center gap-2.5 hover:text-zinc-200 transition-colors">
                  <Icon className="w-4 h-4 text-zinc-700"/> {text}
                </a>
              ))}
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-700 shrink-0"/> Москва, 2-й Обыденский пер. 12А
              </span>
            </div>
          </div>

          {[
            { title:"Продукт", links:["Найм","Оценка персонала","Развитие команды","Библиотека промтов","Личный кабинет"] },
            { title:"Компания", links:["О нас","Кейсы","Вебинары","Политика конф.","Оферта"] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-700 mb-4">{col.title}</p>
              <ul className="space-y-2.5 text-[14px] text-zinc-400">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-zinc-700"
          style={{ borderColor: BORDER }}>
          <span>© 2025 RConf AI · ООО «Киберскилл» · Рег. оператора ПД: 77-25-171605</span>
          <a href="https://account.rconf.ru" className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
            Личный кабинет <ChevronRight className="w-3.5 h-3.5"/>
          </a>
        </div>
      </div>
    </footer>
  );
}
