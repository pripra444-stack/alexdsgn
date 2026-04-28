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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>
      <GridBg opacity={0.035}/>

      {/* Dramatic background glows */}
      <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${V1}20, transparent 70%)` }}/>
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${PINK}12, transparent 70%)` }}/>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Left */}
          <div className="md:col-span-6">
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs mb-8"
              style={{ borderColor: `${V1}40`, background: `${V1}12`, color: V2 }}>
              <Sparkles className="w-3 h-3"/> AI-платформа для развития команд
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="font-bold text-white mb-6 leading-[1.03] tracking-[-0.04em]"
              style={{ fontSize: "clamp(36px,4.8vw,64px)" }}>
              Выявляйте{" "}
              <span style={{ background:`linear-gradient(135deg, ${V2}, ${PINK})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                слабые места
              </span>{" "}
              команды<br/>после каждой сессии.
            </motion.h1>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.65, delay:0.18 }}
              className="text-[17px] text-zinc-400 leading-[1.65] max-w-[50ch] mb-10">
              RConf AI анализирует встречи и показывает HR-директору,
              кто выгорает, кто готов к росту и где команда теряет эффективность —
              {" "}<span className="text-white font-medium">автоматически после каждой сессии.</span>
            </motion.p>

            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.28 }}
              className="flex flex-wrap gap-3 mb-12">
              <a href="#cta"
                className="group inline-flex items-center gap-2 rounded-full text-white px-7 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-85"
                style={{ background:`linear-gradient(135deg, ${V1}, ${V2})`, boxShadow:`0 14px 50px -8px ${V1}65` }}>
                Попробовать бесплатно
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5"/>
              </a>
              <a href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-white/20 px-7 py-3.5 text-[15px] text-zinc-200 transition-all"
                style={{ background:"rgba(255,255,255,0.04)" }}>
                <Play className="w-3.5 h-3.5 fill-current"/> Смотреть демо
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
              className="flex flex-wrap items-center gap-5">
              <div className="flex -space-x-2">
                {["photo-1507003211169-0a1dd7228f2d","photo-1494790108377-be9c29b29330","photo-1500648767791-00dcc994a43e"].map(id => (
                  <img key={id} src={`https://images.unsplash.com/${id}?w=64&q=80&fit=crop&crop=face`}
                    className="w-8 h-8 rounded-full border-2 object-cover" style={{ borderColor: BG }} alt=""/>
                ))}
              </div>
              <span className="text-sm text-zinc-400"><span className="text-white font-semibold">500+</span> команд уже используют</span>
              <div className="flex items-center gap-1">
                {Array.from({length:5}).map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>)}
                <span className="text-sm text-zinc-400 ml-1.5">4.9 / 5.0</span>
              </div>
            </motion.div>
          </div>

          {/* Right: UI hero — продукт как герой */}
          <div className="md:col-span-6 relative">
            <motion.div initial={{ opacity:0, y:28, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
              transition={{ duration:0.9, delay:0.25, ease:[0.22,1,0.36,1] }}
              className="relative rounded-2xl border overflow-hidden"
              style={{ background: CARD, borderColor: BORDER, boxShadow:`0 40px 100px -20px ${V1}30` }}>

              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER, background:`${BG}99` }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background:"rgba(255,255,255,0.12)" }}/>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background:"rgba(255,255,255,0.12)" }}/>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background:`${V1}80` }}/>
                </div>
                <div className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-mono text-zinc-500"
                  style={{ background:"rgba(255,255,255,0.04)" }}>
                  rconf.ru · сессия #42
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background:"#4ade80", opacity:0.7 }}/>
                    <span className="relative h-2 w-2 rounded-full" style={{ background:"#4ade80" }}/>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Live</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Session header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-white">Ретроспектива Sprint 42</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">9 участников · 47 мин · 14 апр 2025</p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ background:`${V1}20`, color: V2, border:`1px solid ${V1}30` }}>
                    Анализ готов
                  </span>
                </div>

                {/* Engagement timeline */}
                <div className="rounded-xl p-3 border" style={{ background:"rgba(255,255,255,0.025)", borderColor: BORDER }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] text-zinc-400 font-medium">Вовлечённость по времени</p>
                    <p className="text-[11px]" style={{ color: V2 }}>Ср. 71%</p>
                  </div>
                  <div className="flex items-end gap-[3px] h-10">
                    {[55,62,58,70,85,72,65,78,90,82,75,68,80,88,76,70,65,58,72,80,85,78,72,68,74,82,79,85,88,82].map((v,i) => (
                      <motion.div key={i} className="flex-1 rounded-t-[2px]"
                        style={{ background: v > 80 ? V2 : v > 65 ? `${V1}90` : `${V1}40` }}
                        initial={{ height:0 }} animate={{ height:`${v}%` }}
                        transition={{ delay:0.6+i*0.025, duration:0.3 }}/>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-700 mt-1.5">
                    <span>0:00</span><span>15:00</span><span>30:00</span><span>47:00</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-1.5">
                  {[
                    { n:"Александр К.", r:"Тимлид",      pct:87, status:"ok"  },
                    { n:"Мария С.",     r:"Разработчик", pct:74, status:"ok"  },
                    { n:"Дмитрий В.",   r:"QA Engineer", pct:38, status:"low" },
                    { n:"Елена П.",     r:"PM",          pct:81, status:"ok"  },
                  ].map((m, i) => (
                    <motion.div key={m.n}
                      initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.8+i*0.08 }}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                      style={{ background: m.status==="low" ? `${PINK}08` : "rgba(255,255,255,0.02)",
                        border:`1px solid ${m.status==="low" ? `${PINK}20` : BORDER}` }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: m.status==="low" ? PINK : "#4ade80" }}/>
                      <span className="text-[12px] text-zinc-300 w-24 truncate">{m.n}</span>
                      <span className="text-[10px] text-zinc-600 flex-1">{m.r}</span>
                      <div className="w-20 h-1 rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: m.status==="low" ? PINK : V2 }}
                          initial={{ width:0 }} animate={{ width:`${m.pct}%` }}
                          transition={{ delay:1.0+i*0.08, duration:0.8 }}/>
                      </div>
                      <span className="text-[11px] font-mono w-7 text-right"
                        style={{ color: m.status==="low" ? PINK : "rgba(255,255,255,0.5)" }}>{m.pct}%</span>
                    </motion.div>
                  ))}
                </div>

                {/* AI insight */}
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
                  className="rounded-xl p-3 border flex items-start gap-2.5"
                  style={{ background:`${PINK}08`, borderColor:`${PINK}25` }}>
                  <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: PINK }}/>
                  <div>
                    <p className="text-[11px] font-semibold mb-0.5" style={{ color: PINK }}>AI-инсайт</p>
                    <p className="text-[12px] text-zinc-300 leading-relaxed">
                      Дмитрий В. вовлечён на 38% — риск выгорания. Рекомендуется 1-on-1 с тимлидом.
                    </p>
                  </div>
                </motion.div>

                {/* Bottom metrics row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { l:"Эффективность", v:"8.4/10", c: V2 },
                    { l:"Решения приняты", v:"7 из 8", c:"#4ade80" },
                    { l:"Риски",          v:"1 чел.", c: PINK },
                  ].map(m => (
                    <div key={m.l} className="rounded-lg p-2.5 text-center border"
                      style={{ background:"rgba(255,255,255,0.025)", borderColor: BORDER }}>
                      <p className="text-[13px] font-bold" style={{ color: m.c }}>{m.v}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Float chips */}
            <motion.div
              animate={{ y:[0,-8,0] }} transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:1.2 }}
              className="absolute -top-4 -right-4 rounded-xl px-3 py-2 border backdrop-blur-xl shadow-xl"
              style={{ background:"rgba(14,10,28,0.95)", borderColor: BORDER }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: V2 }}/>
                <span className="text-xs font-medium text-white">ФЗ-152 · Серверы РФ</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ y:[0,7,0] }} transition={{ duration:4.2, repeat:Infinity, ease:"easeInOut", delay:0.8 }}
              className="absolute -bottom-4 -left-4 rounded-xl px-3 py-2 border backdrop-blur-xl shadow-xl"
              style={{ background:"rgba(14,10,28,0.95)", borderColor:`${PINK}30` }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: PINK }}/>
                <span className="text-xs font-medium text-white">+62% эффективность</span>
              </div>
            </motion.div>
          </div>
        </div>
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
                <p className="text-[12px] text-zinc-500 mt-0.5">{m.sub}</p>
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
            <span className="text-zinc-500">кто отвечает за людей.</span>
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

// ─── Team section (photos) ────────────────────────────────────────────────────
function TeamSection() {
  const photos = [
    { src:"photo-1573497491208-6b1acb260507", caption:"Команда разрабатывает стратегию" },
    { src:"photo-1542744173-8e7e53415bb0",    caption:"Обсуждение результатов спринта" },
    { src:"photo-1556761175-b413da4baf72",    caption:"Планирование и расстановка приоритетов" },
  ];

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

          {/* Right: photo collage */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-3">
              {/* Large photo */}
              <motion.div
                initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ duration:0.7 }}
                className="col-span-2 rounded-2xl overflow-hidden relative border" style={{ borderColor: BORDER }}>
                <div className="aspect-[21/9] relative">
                  <img src={`https://images.unsplash.com/${photos[0].src}?w=1000&q=80`}
                    alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0"
                    style={{ background:`linear-gradient(135deg, ${V1}25, ${BG}40)` }}/>
                  <div className="absolute bottom-4 left-4 bg-white/5 backdrop-blur-md rounded-xl px-3 py-2 border" style={{ borderColor: BORDER }}>
                    <p className="text-xs text-zinc-300">{photos[0].caption}</p>
                  </div>
                </div>
              </motion.div>

              {photos.slice(1).map((p, i) => (
                <motion.div key={p.src}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay:0.15+i*0.1, duration:0.6 }}
                  className="rounded-2xl overflow-hidden relative border" style={{ borderColor: BORDER }}>
                  <div className="aspect-square relative">
                    <img src={`https://images.unsplash.com/${p.src}?w=600&q=80`}
                      alt="" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0"
                      style={{ background:`linear-gradient(135deg, ${V1}20, ${BG}55)` }}/>
                    <div className="absolute bottom-3 left-3 bg-white/5 backdrop-blur-md rounded-lg px-2.5 py-1.5 border" style={{ borderColor: BORDER }}>
                      <p className="text-[11px] text-zinc-300">{p.caption}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
            <br/><span className="text-zinc-500">четыре шага.</span>
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
                <p className="text-[13px] text-zinc-500 leading-relaxed">{s.body}</p>
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
            Измеримый результат —<br/><span className="text-zinc-500">не обещания.</span>
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
              <p className="text-[14px] text-zinc-500">{s.sub}</p>
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
            Реальные компании.<br/><span className="text-zinc-500">Конкретные цифры.</span>
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
                <p className="text-[12px] text-zinc-500 mt-0.5">{c.detail}</p>
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
                    <p className="text-[11px] text-zinc-500 mt-0.5">{m.l}</p>
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
                    <label htmlFor={f.id} className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5">{f.label}</label>
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
                <label htmlFor="role" className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5">Должность</label>
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
            <p className="text-[14px] text-zinc-500 leading-relaxed max-w-[38ch] mb-6">
              Система для развития команд на основе искусственного интеллекта.
              Анализирует встречи, выявляет паттерны, даёт рекомендации.
            </p>
            <div className="space-y-3 text-[14px] text-zinc-500">
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
              <ul className="space-y-2.5 text-[14px] text-zinc-500">
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
