import { t, locale } from '../localization';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import CarVisualizer from '../Components/CarVisualizer';
import { Link, usePage } from '@inertiajs/react';
import {
    Gauge, Zap, Trophy, Flag, Wrench, CreditCard, ShieldCheck,
    ChevronRight, ChevronLeft, Flame, Cpu, FileText, Users,
    ArrowRight, ArrowUpRight, Play, Target, Palette, Newspaper,
    Clock, Timer, Route, Mountain, Building2, Wind, Lock,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════ */

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let done = false;
        let obs;

        const show = () => {
            if (done) return;
            done = true;
            setInView(true);
            if (obs) obs.disconnect();
            window.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };

        const check = () => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.92 && r.bottom > 0) show();
        };

        if (typeof IntersectionObserver !== 'undefined') {
            obs = new IntersectionObserver(
                ([e]) => { if (e.isIntersecting) show(); },
                { threshold, rootMargin: '0px 0px -60px 0px' }
            );
            obs.observe(el);
        }

        // Belt and braces: never leave content permanently hidden.
        window.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check);
        check();

        return () => {
            if (obs) obs.disconnect();
            window.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };
    }, [threshold]);
    return [ref, inView];
}

function useCountUp(end, duration = 1400, trigger = true) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        let raf;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(end * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [end, duration, trigger]);
    return value;
}

/* ═══════════════════════════════════════════════════════════════
   Primitives
   ═══════════════════════════════════════════════════════════════ */

function Eyebrow({ children, tone = 'cyan', className = '' }) {
    const tones = {
        cyan: 'text-cyan-300 border-cyan-400/25 bg-cyan-400/[0.06]',
        ember: 'text-orange-300 border-orange-400/25 bg-orange-400/[0.06]',
        neutral: 'text-slate-300 border-white/10 bg-white/[0.03]',
    };
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border label-tech ${tones[tone]} ${className}`}>
            {t(children)}
        </span>
    );
}

function LiveDot({ color = 'bg-cyan-400' }) {
    return (
        <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-60 animate-ping`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${color}`} />
        </span>
    );
}

function SectionHeading({ index, eyebrow, title, accent, lead, action, align = 'left' }) {
    const centered = align === 'center';
    return (
        <div className={`flex flex-col ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} gap-6 mb-12 lg:mb-16`}>
            <div className={`space-y-5 ${centered ? 'max-w-2xl' : 'max-w-2xl'}`}>
                <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
                    {index && (
                        <span className="label-tech text-slate-600 numeric">{t(index)}</span>
                    )}
                    <span className="h-px w-8 bg-white/15" />
                    <span className="label-tech text-cyan-300/90">{t(eyebrow)}</span>
                </div>
                <h2 className="headline text-4xl sm:text-5xl lg:text-6xl text-white text-balance">
                    {t(title)}{t(' ')}
                    {accent && <span className="text-cyan-400">{t(accent)}</span>}
                </h2>
                {lead && (
                    <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed max-w-xl">
                        {t(lead)}
                    </p>
                )}
            </div>
            {t(action)}
        </div>
    );
}

function Meter({ label, value, max, unit, tone = 'cyan', animate = true }) {
    const pct = Math.max(4, Math.min(100, Math.round((value / max) * 100)));
    const tones = {
        cyan: 'from-cyan-400 to-sky-500',
        ember: 'from-orange-400 to-red-500',
        mint: 'from-emerald-400 to-teal-500',
    };
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between">
                <span className="label-tech text-slate-500">{t(label)}</span>
                <span className="numeric text-white font-bold text-base leading-none">
                    {t(value)}
                    <span className="text-slate-600 text-[10px] font-semibold ml-1">{t(unit)}</span>
                </span>
            </div>
            <div className="h-[3px] w-full bg-white/[0.06] overflow-hidden rounded-full">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${tones[tone]} transition-[width] duration-700 ease-out`}
                    style={{ width: animate ? `${pct}%` : '0%' }}
                />
            </div>
        </div>
    );
}

/* Ghost number used as a watermark behind section content */
function GhostIndex({ children, className = '' }) {
    return (
        <span
            className={`headline pointer-events-none select-none absolute text-[16rem] leading-none text-white/[0.018] ${className}`}
            aria-hidden="true"
        >
            {t(children)}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Track map silhouettes
   ═══════════════════════════════════════════════════════════════ */

const TRACK_PATHS = {
    cyber_city:
        'M40 130 C 20 130 18 96 40 92 L 96 84 C 120 80 118 48 96 44 L 62 38 C 40 34 42 12 66 12 L 186 12 C 214 12 216 44 190 50 L 150 60 C 128 66 132 92 154 96 L 200 104 C 224 108 222 134 196 134 Z',
    neon_highway:
        'M24 122 L 70 122 C 104 122 104 76 72 72 L 52 68 C 26 62 30 20 60 20 L 196 20 C 224 20 228 58 202 66 L 170 76 C 146 84 152 118 178 122 L 214 128',
    canyon_drift:
        'M30 24 C 58 12 78 40 62 60 C 46 80 74 96 96 84 C 122 70 146 92 130 112 C 116 130 144 142 166 130 L 206 108 C 226 96 236 70 216 54 L 176 26',
};

const TRACK_META = {
    cyber_city: { icon: Building2, tone: '#38bdf8', label: 'Urban Street' },
    neon_highway: { icon: Wind, tone: '#a78bfa', label: 'High Speed' },
    canyon_drift: { icon: Mountain, tone: '#fb923c', label: 'Mountain Pass' },
};

function TrackMap({ theme = 'cyber_city', animate = true }) {
    const d = TRACK_PATHS[theme] || TRACK_PATHS.cyber_city;
    const tone = (TRACK_META[theme] || TRACK_META.cyber_city).tone;
    const uid = useMemo(() => `trk-${theme}-${Math.random().toString(36).slice(2, 7)}`, [theme]);

    return (
        <svg viewBox="0 0 240 150" className="w-full h-full overflow-visible" fill="none">
            <defs>
                <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={tone} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={tone} stopOpacity="0.35" />
                </linearGradient>
                <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Track bed */}
            <path d={d} stroke="rgba(255,255,255,0.10)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 7" strokeLinecap="round" />
            {/* Racing line */}
            <path
                d={d}
                stroke={`url(#${uid}-g)`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#${uid}-glow)`}
            />
            {/* Moving pace car */}
            {animate && (
                <circle r="3.5" fill="#fff">
                    <animateMotion dur="7s" repeatCount="indefinite" path={d} rotate="auto" />
                </circle>
            )}
            {/* Start/finish */}
            <g>
                <rect x="34" y="118" width="4" height="16" fill="#fff" fillOpacity="0.55" />
            </g>
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Marquee ticker
   ═══════════════════════════════════════════════════════════════ */

function Ticker({ items }) {
    const row = [...items, ...items];
    return (
        <div className="relative border-y border-white/[0.06] bg-carbon-925/80 py-3 overflow-hidden marquee-mask">
            <div className="flex w-max animate-marquee">
                {row.map((item, i) => (
                    <span key={i} className="flex items-center gap-3 px-6 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-cyan-400/70" />
                        <span className="label-tech text-slate-400 whitespace-nowrap">{t(item)}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function Landing({ featuredVehicles = [], tracks = [], stats = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    /* Vehicle carousel */
    const [carIdx, setCarIdx] = useState(0);
    const activeCar = featuredVehicles[carIdx] || featuredVehicles[0];
    const nextCar = () => setCarIdx((i) => (i + 1) % Math.max(1, featuredVehicles.length));
    const prevCar = () => setCarIdx((i) => (i - 1 + featuredVehicles.length) % Math.max(1, featuredVehicles.length));

    useEffect(() => {
        if (featuredVehicles.length < 2) return;
        const id = setInterval(() => setCarIdx((i) => (i + 1) % featuredVehicles.length), 6000);
        return () => clearInterval(id);
    }, [featuredVehicles.length]);

    /* Reveal refs */
    const [heroRef, heroIn] = useInView(0.05);
    const [statsRef, statsIn] = useInView(0.3);
    const [circuitsRef, circuitsIn] = useInView();
    const [tuneRef, tuneIn] = useInView();
    const [rosterRef, rosterIn] = useInView();
    const [stepsRef, stepsIn] = useInView();
    const [newsRef, newsIn] = useInView();

    const racerCount = useCountUp(stats.racers || 1420, 1600, statsIn);
    const trackCount = useCountUp(stats.tracks || 3, 900, statsIn);
    const vehicleCount = useCountUp(stats.vehicles || featuredVehicles.length || 7, 1100, statsIn);

    const tickerItems = (tracks.length ? tracks.map((track) => track.name) : ['Neon City Grand Prix', 'Cyber Highway Sprint', 'Canyon Drift Pass'])
        .concat(['Season ’26 Championship', '60 FPS Canvas Engine', 'Dyno Tuning Bay', 'Instant VAT Invoices', 'Global Leaderboard', 'No Downloads Required']);

    return (
        <PublicLayout>

            {/* ═════════════════════ HERO: HORIZON PADDOCK STAGE ═════════════════════ */}
            <section ref={heroRef} className="relative isolate overflow-hidden bg-grain pt-8 pb-16 lg:pt-14 lg:pb-24">
                {/* Ambient dynamic glows & cyber grid */}
                <div className="absolute inset-0 -z-10 bg-carbon-weave" />
                <div className="absolute top-[-14rem] left-1/2 -translate-x-1/2 w-[85rem] h-[38rem] -z-10 rounded-full bg-cyan-500/[0.08] blur-[140px]" />
                <div className="absolute top-32 -left-20 w-[35rem] h-[35rem] -z-10 rounded-full bg-blue-600/[0.06] blur-[120px]" />
                <div className="absolute top-32 -right-20 w-[35rem] h-[35rem] -z-10 rounded-full bg-orange-500/[0.05] blur-[120px]" />
                <div className="road-grid -z-10">
                    <div className="road-grid__plane" />
                </div>
                <div className="absolute inset-0 -z-10 vignette" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* ── Top Centered Hero Header ── */}
                    <div className={`text-center max-w-4xl mx-auto space-y-6 reveal ${heroIn ? 'reveal-in' : ''}`}>
                        <div className="inline-flex items-center justify-center">
                            <Eyebrow tone="cyan" className="shadow-lg shadow-cyan-500/10">
                                <LiveDot color="bg-cyan-400" />
                                <span className="font-semibold tracking-wider">{t("SEASON ’26 CHAMPIONSHIP")}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400">{t("540+ ACTIVE RACERS ON GRID")}</span>
                            </Eyebrow>
                        </div>

                        <h1 className="headline text-4xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] text-white tracking-tight leading-[1.05]">{t("PRECISION MOTORSPORT. ")}<br />
                            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">{t("DOMINATE THE CIRCUIT. ")}</span>
                        </h1>

                        <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">{t("A high-fidelity 60 FPS motorsport engine running natively in your browser. Forge your machine on the dyno, dial in gear ratios, and race for championship prize pools. ")}</p>

                        {/* High-Octane Action CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            {user ? (
                                <Link
                                    href="/race/lobby"
                                    className="w-full sm:w-auto group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-cyan-400 hover:bg-cyan-300 text-carbon-950 font-display font-black uppercase tracking-wider text-sm shadow-xl shadow-cyan-400/20 transition-all duration-300"
                                >
                                    <span className="absolute inset-y-0 w-16 bg-white/40 animate-sweep" aria-hidden="true" />
                                    <Flag className="w-4 h-4" />
                                    <span className="relative">{t("Enter Race Lobby")}</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        className="w-full sm:w-auto group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-cyan-400 hover:bg-cyan-300 text-carbon-950 font-display font-black uppercase tracking-wider text-sm shadow-xl shadow-cyan-400/20 transition-all duration-300"
                                    >
                                        <span className="absolute inset-y-0 w-16 bg-white/40 animate-sweep" aria-hidden="true" />
                                        <Zap className="w-4 h-4" />
                                        <span className="relative">{t("Claim Starter Car & 1,000 CR")}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="/garage"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 border border-white/15 hover:border-cyan-400/40 text-slate-200 hover:text-white font-display font-bold uppercase tracking-wider text-sm backdrop-blur-md bg-white/[0.02] transition-colors"
                                    >
                                        <Wrench className="w-4 h-4 text-cyan-400" />
                                        <span>{t("Dyno Tuning Bay")}</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Quick Trust Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-xs">
                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                                <Flame className="w-3.5 h-3.5 text-orange-400" />{t(" 60 FPS Canvas Physics ")}</span>
                            <span className="text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                                <Cpu className="w-3.5 h-3.5 text-cyan-400" />{t(" Zero Downloads Required ")}</span>
                            <span className="text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />{t(" 500,000 CR Season Purse ")}</span>
                            <span className="text-slate-700">•</span>
                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />{t(" UK Tax & Invoices ")}</span>
                        </div>
                    </div>

                    {/* ── Panoramic Interactive Paddock Stage (Horizon Deck) ── */}
                    <div className={`mt-10 lg:mt-14 reveal ${heroIn ? 'reveal-in' : ''}`} style={{ transitionDelay: '120ms' }}>
                        <div className="relative surface-raised border border-white/10 rounded-none overflow-hidden">
                            {/* Accent corners */}
                            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
                            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-20" />
                            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
                            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-20" />

                            {/* Top Command Bar */}
                            <div className="px-5 py-3.5 bg-carbon-950/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />{t("DYNO TELEMETRY ACTIVE ")}</div>
                                    <span className="text-xs text-slate-500 hidden sm:inline font-mono">{t("CHASSIS ID: SF-")}{t((activeCar?.id || 1).toString().padStart(4, '0'))}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-mono">
                                    <span className="text-slate-400">{t("CLASS: ")}<strong className="text-white font-bold">{t(activeCar?.class_type || 'SPORT')}</strong></span>
                                    <span className="text-slate-600">|</span>
                                    <span className="text-slate-400">{t("TIER: ")}<strong className="text-cyan-400 font-bold">{t("STAGE 3 TUNED")}</strong></span>
                                </div>
                            </div>

                            {/* 3-Column Cockpit Deck */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] bg-carbon-900/40">
                                
                                {/* ─ Left Column: Telemetry Gauge Cluster ─ */}
                                <div className="lg:col-span-3 p-6 flex flex-col justify-between space-y-6 bg-carbon-950/40">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="label-tech text-cyan-400/90">{t("DYNO OUTPUT")}</span>
                                            <span className="label-tech text-slate-500">{t("REAL-TIME")}</span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-3.5 bg-carbon-925 border border-white/[0.06]">
                                                <div className="text-[11px] font-mono text-slate-400 uppercase">{t("Estimated Power")}</div>
                                                <div className="numeric text-3xl font-black text-white mt-0.5 flex items-baseline gap-1.5">
                                                    {t(Math.round((activeCar?.base_speed || 220) * 2.45))}
                                                    <span className="text-xs font-mono text-cyan-400">{t("BHP")}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3.5 pt-2">
                                                <Meter label="Top Velocity" value={activeCar?.base_speed || 210} max={340} unit="KM/H" tone="cyan" animate={heroIn} />
                                                <Meter label="Acceleration" value={activeCar?.base_acceleration || 70} max={100} unit="PTS" tone="ember" animate={heroIn} />
                                                <Meter label="Cornering Grip" value={activeCar?.base_handling || 75} max={100} unit="PTS" tone="mint" animate={heroIn} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-mono">{t("WEIGHT DIST.")}</span>
                                        <span className="numeric text-white font-bold">48 : 52 %</span>
                                    </div>
                                </div>

                                {/* ─ Center Column: Horizon Vehicle Stage ─ */}
                                <div className="lg:col-span-6 relative p-6 sm:p-10 flex flex-col justify-between items-center min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-carbon-900/60 to-carbon-950 overflow-hidden">
                                    {/* Horizon platform styling */}
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_65%,rgba(6,182,212,0.12),transparent_75%)] pointer-events-none" />
                                    <div className="absolute inset-x-12 bottom-20 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
                                    <div className="absolute inset-0 bg-cyber-grid opacity-35 pointer-events-none" />

                                    {/* Car Headline & Specs */}
                                    <div className="w-full flex items-start justify-between z-10">
                                        <div>
                                            <span className="label-tech text-cyan-300 font-semibold">{t(activeCar?.class_type || 'Sport')}{t(" Class Machine")}</span>
                                            <h2 className="headline text-2xl sm:text-4xl text-white tracking-wide mt-1">
                                                {t(activeCar?.name || 'Apex Pulse GT')}
                                            </h2>
                                        </div>
                                        <div className="text-right">
                                            <div className="label-tech text-slate-500">{t("VALUATION")}</div>
                                            <div className="numeric text-xl font-bold text-white mt-0.5">
                                                {activeCar?.price > 0 ? (
                                                    <>{t(Number(activeCar.price).toLocaleString(locale()))} <span className="text-xs text-cyan-400 font-mono">{t("CR")}</span></>
                                                ) : (
                                                    <span className="text-emerald-400 font-mono">{t("STARTER FREE")}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interactive Visualizer Canvas */}
                                    <div className="w-full my-auto py-4 relative z-10 flex items-center justify-center">
                                        <CarVisualizer vehicle={activeCar} size="large" animated showUnderglow />
                                    </div>

                                    {/* Quick Next/Prev Carousel Controls */}
                                    {featuredVehicles.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevCar}
                                                aria-label={t("Previous vehicle")}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 border border-white/10 bg-carbon-950/80 hover:bg-carbon-900 text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextCar}
                                                aria-label={t("Next vehicle")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 border border-white/10 bg-carbon-950/80 hover:bg-carbon-900 text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}

                                    {/* Quick direct links */}
                                    <div className="w-full flex items-center justify-between z-10 pt-4 border-t border-white/[0.06] text-xs">
                                        <span className="text-slate-400 font-mono">{t("SELECTION: ")}<span className="text-white font-bold">{t(carIdx + 1)}</span> / {t(featuredVehicles.length || 1)}
                                        </span>
                                        <Link
                                            href="/garage"
                                            className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 font-mono uppercase tracking-wider font-semibold transition-colors"
                                        >
                                            <Wrench className="w-3.5 h-3.5" />{t("Tune Setup ")}<ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* ─ Right Column: Live Circuit Radar & Matchmaking ─ */}
                                <div className="lg:col-span-3 p-6 flex flex-col justify-between space-y-6 bg-carbon-950/40">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="label-tech text-cyan-400/90">{t("LIVE CIRCUIT RADAR")}</span>
                                            <span className="label-tech text-emerald-400 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />{t("QUALIFYING ")}</span>
                                        </div>

                                        {/* Mini track layout */}
                                        <div className="p-4 bg-carbon-925 border border-white/[0.06] mb-4">
                                            <div className="h-28 relative">
                                                <TrackMap theme={tracks[0]?.theme || 'cyber_city'} />
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="font-display text-sm font-bold text-white uppercase truncate">
                                                    {t(tracks[0]?.name || 'Neon City Grand Prix')}
                                                </span>
                                                <span className="text-xs font-mono text-cyan-400 shrink-0">
                                                    {t(tracks[0]?.length_meters ? `${(tracks[0].length_meters / 1000).toFixed(1)} KM` : '2.8 KM')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Circuit Session Stats */}
                                        <div className="space-y-2 text-xs font-mono">
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">{t("SESSION PURSE")}</span>
                                                <span className="text-amber-400 font-bold">{t("550 CR")}</span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                                                <span className="text-slate-500">{t("LAP RECORD")}</span>
                                                <span className="text-white font-bold">1:14.288</span>
                                            </div>
                                            <div className="flex justify-between py-1.5">
                                                <span className="text-slate-500">{t("DIFFICULTY")}</span>
                                                <span className="text-cyan-400 font-bold">{t("PRO-TIER")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action button in radar column */}
                                    <Link
                                        href="/race/lobby"
                                        className="w-full group inline-flex items-center justify-center gap-2 py-3 bg-white hover:bg-cyan-300 text-carbon-950 font-display font-bold uppercase tracking-wider text-xs transition-colors"
                                    >
                                        <Flag className="w-3.5 h-3.5" />
                                        <span>{t("Join Matchmaking")}</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>

                            </div>

                            {/* ─ Pit Lane Dock: Machine Selector Ribbon ─ */}
                            {featuredVehicles.length > 1 && (
                                <div className="p-4 bg-carbon-950 border-t border-white/[0.08]">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <span className="label-tech text-slate-500">{t("PIT LANE SHOWROOM • SELECT VEHICLE")}</span>
                                        <span className="label-tech text-slate-600 hidden sm:inline">{t("CLICK TO INSPECT")}</span>
                                    </div>
                                    <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
                                        {featuredVehicles.map((car, idx) => {
                                            const isActive = carIdx === idx;
                                            return (
                                                <button
                                                    key={car.id}
                                                    onClick={() => setCarIdx(idx)}
                                                    className={`shrink-0 px-4 py-3 flex items-center gap-3 text-left transition-all border ${
                                                        isActive
                                                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                                                            : 'bg-carbon-900/60 border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
                                                    }`}
                                                >
                                                    <span className={`font-mono text-xs font-bold ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                                                        0{t(idx + 1)}
                                                    </span>
                                                    <div>
                                                        <div className="font-display font-bold uppercase text-xs tracking-wider whitespace-nowrap text-white">
                                                            {t(car.name)}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                                                            <span>{t(car.class_type)}</span>
                                                            <span>{t("•")}</span>
                                                            <span className="text-cyan-400">{t(car.base_speed)}{t(" KM/H")}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* ═════════════════════ TICKER ═════════════════════ */}
            <Ticker items={tickerItems} />

            {/* ═════════════════════ STATS ═════════════════════ */}
            <section ref={statsRef} className="bg-carbon-950">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06] border-x border-white/[0.06]">
                        {[
                            { value: trackCount, suffix: '', label: 'Championship Circuits', sub: 'Hand-tuned layouts' },
                            { value: racerCount, suffix: '+', label: 'Registered Drivers', sub: 'Season ’26 grid' },
                            { value: vehicleCount, suffix: '', label: 'Machines Available', sub: 'Street to hypercar' },
                            { value: 60, suffix: ' FPS', label: 'Deterministic Engine', sub: 'Zero downloads' },
                        ].map((m, i) => (
                            <div
                                key={m.label}
                                className={`px-5 sm:px-7 py-10 lg:py-14 space-y-2 border-b lg:border-b-0 border-white/[0.06] reveal ${statsIn ? 'reveal-in' : ''}`}
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="numeric text-4xl sm:text-5xl font-bold text-white leading-none">
                                    {t(m.value)}<span className="text-cyan-400">{t(m.suffix)}</span>
                                </div>
                                <div className="label-tech text-slate-400 pt-2">{t(m.label)}</div>
                                <div className="text-xs text-slate-600">{t(m.sub)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═════════════════════ CIRCUITS ═════════════════════ */}
            <section ref={circuitsRef} className="relative bg-carbon-950 py-24 lg:py-32 overflow-hidden">
                <GhostIndex className="top-6 -left-6 hidden lg:block">01</GhostIndex>
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                    <SectionHeading
                        index="01"
                        eyebrow="The Calendar"
                        title={t("Three circuits.")}
                        accent="One championship."
                        lead="Each layout rewards a different build. Street precision, raw top speed, or absolute corner discipline — pick your battleground."
                        action={
                            <Link
                                href="/race/lobby"
                                className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0"
                            >{t("All circuits ")}<ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {(tracks.length ? tracks : [
                            { id: 1, name: 'Neon City Grand Prix', theme: 'cyber_city', difficulty: 'Medium', laps: 2, length_meters: 2800, reward_currency_1st: 550, description: 'High-speed urban circuit through neon skyscrapers and underground speed tunnels.' },
                            { id: 2, name: 'Cyber Highway Sprint', theme: 'neon_highway', difficulty: 'Easy', laps: 2, length_meters: 2200, reward_currency_1st: 380, description: 'Wide elevated highway built for raw top speed, drafting and nitro timing.' },
                            { id: 3, name: 'Canyon Drift Pass', theme: 'canyon_drift', difficulty: 'Hard', laps: 3, length_meters: 3500, reward_currency_1st: 850, description: 'Mountain hairpins and switchbacks that punish anything but perfect handling.' },
                        ]).map((track, i) => {
                            const meta = TRACK_META[track.theme] || TRACK_META.cyber_city;
                            const Icon = meta.icon;
                            const diffTone = {
                                Easy: 'text-emerald-400 border-emerald-400/25',
                                Medium: 'text-cyan-300 border-cyan-400/25',
                                Hard: 'text-orange-400 border-orange-400/25',
                                Pro: 'text-red-400 border-red-400/25',
                            }[track.difficulty] || 'text-slate-400 border-white/10';

                            return (
                                <Link
                                    key={track.id}
                                    href="/race/lobby"
                                    className={`group surface notch-tr p-6 flex flex-col lift hover:border-white/20 reveal ${circuitsIn ? 'reveal-in' : ''}`}
                                    style={{ transitionDelay: `${i * 110}ms` }}
                                >
                                    <div className="flex items-start justify-between mb-5">
                                        <span className="label-tech text-slate-600 numeric">R{t(String(i + 1).padStart(2, '0'))}</span>
                                        <span className={`label-tech px-2.5 py-1 border rounded-full ${diffTone}`}>{t(track.difficulty)}</span>
                                    </div>

                                    <div className="h-36 mb-6 opacity-90 group-hover:opacity-100 transition-opacity">
                                        <TrackMap theme={track.theme} />
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="w-3.5 h-3.5" style={{ color: meta.tone }} />
                                        <span className="label-tech text-slate-500">{t(meta.label)}</span>
                                    </div>

                                    <h3 className="headline text-2xl text-white group-hover:text-cyan-300 transition-colors">
                                        {t(track.name)}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2 flex-1">
                                        {t(track.description)}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                                        {[
                                            { icon: Route, v: `${(track.length_meters / 1000).toFixed(1)}`, u: 'KM' },
                                            { icon: Timer, v: track.laps, u: 'LAPS' },
                                            { icon: Trophy, v: Math.round(Number(track.reward_currency_1st)), u: 'CR' },
                                        ].map((s, k) => (
                                            <div key={k} className="space-y-1">
                                                <s.icon className="w-3 h-3 text-slate-600" />
                                                <div className="numeric text-lg text-white font-bold leading-none">
                                                    {t(s.v)}<span className="text-[9px] text-slate-600 ml-1 font-semibold">{t(s.u)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═════════════════════ TUNING BAY ═════════════════════ */}
            <section ref={tuneRef} className="relative border-y border-white/[0.06] bg-carbon-925 py-24 lg:py-32 overflow-hidden">
                <div className="absolute top-1/2 -left-40 w-[40rem] h-[40rem] -translate-y-1/2 rounded-full bg-orange-600/[0.05] blur-[130px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                        <div className={`lg:col-span-5 space-y-7 reveal ${tuneIn ? 'reveal-in' : ''}`}>
                            <div className="flex items-center gap-3">
                                <span className="label-tech text-slate-600 numeric">02</span>
                                <span className="h-px w-8 bg-white/15" />
                                <span className="label-tech text-orange-300/90">{t("The Dyno Bay")}</span>
                            </div>
                            <h2 className="headline text-4xl sm:text-5xl lg:text-6xl text-white">{t("Every tenth")}<br />{t("is bought ")}<span className="text-orange-400">{t("in the garage")}</span>
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed max-w-lg">{t("Twenty-two components across four engineering disciplines. Stack stages, watch the dyno curve move, then find out on track whether the setup was worth the credits. ")}</p>

                            <div className="flex flex-wrap gap-3 pt-1">
                                <Link
                                    href="/garage"
                                    className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm hover:bg-orange-300 transition-colors"
                                >
                                    <Wrench className="w-4 h-4" />{t("Open the Garage ")}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/15 hover:border-white/30 text-slate-200 font-display font-bold uppercase tracking-wider text-sm transition-colors"
                                >{t("Showroom ")}</Link>
                            </div>
                        </div>

                        {/* Upgrade ladder */}
                        <div className={`lg:col-span-7 reveal ${tuneIn ? 'reveal-in' : ''}`} style={{ transitionDelay: '140ms' }}>
                            <div className="surface notch-bl divide-y divide-white/[0.06]">
                                {[
                                    { icon: Cpu, name: 'ECU Stage Remaps', stages: 5, tone: 'bg-cyan-400', desc: 'Fuel maps, ignition timing, rev limiter' },
                                    { icon: Flame, name: 'Forced Induction', stages: 4, tone: 'bg-orange-400', desc: 'Single, twin-scroll and compound turbo kits' },
                                    { icon: Target, name: 'Coilovers & Slicks', stages: 5, tone: 'bg-emerald-400', desc: 'Damping, camber, compound selection' },
                                    { icon: Zap, name: 'Nitrous Injection', stages: 4, tone: 'bg-violet-400', desc: 'Wet shot through cryogenic direct feed' },
                                    { icon: Wind, name: 'Aero & Weight', stages: 3, tone: 'bg-sky-400', desc: 'Carbon panels, diffuser, active rear wing' },
                                ].map((row, i) => (
                                    <div key={row.name} className="group flex items-center gap-5 p-5 sm:p-6 hover:bg-white/[0.02] transition-colors">
                                        <div className="w-11 h-11 shrink-0 border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/20 transition-colors">
                                            <row.icon className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-display font-bold uppercase tracking-wide text-[15px] text-white">{t(row.name)}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 truncate">{t(row.desc)}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {Array.from({ length: 5 }).map((_, k) => (
                                                <span
                                                    key={k}
                                                    className={`h-6 w-[3px] rounded-full transition-all duration-500 ${
                                                        k < row.stages ? row.tone : 'bg-white/[0.07]'
                                                    }`}
                                                    style={{
                                                        opacity: tuneIn ? 1 : 0.15,
                                                        transitionDelay: `${i * 90 + k * 60}ms`,
                                                    }}
                                                />
                                            ))}
                                            <span className="label-tech text-slate-600 ml-2 numeric">{t(row.stages)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════ ROSTER ═════════════════════ */}
            {featuredVehicles.length > 0 && (
                <section ref={rosterRef} className="relative bg-carbon-950 py-24 lg:py-32 overflow-hidden">
                    <GhostIndex className="top-10 right-0 hidden lg:block">03</GhostIndex>
                    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                        <SectionHeading
                            index="03"
                            eyebrow="The Roster"
                            title={t("Pick your")}
                            accent="weapon."
                            lead="From a free starter coupe to a carbon-tubbed hypercar. Every machine takes the full upgrade tree."
                            action={
                                <Link href="/shop" className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0">{t("Visit showroom ")}<ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            }
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredVehicles.map((v, i) => (
                                <button
                                    key={v.id}
                                    onClick={() => setCarIdx(i)}
                                    className={`group text-left surface notch-tr p-5 lift reveal ${rosterIn ? 'reveal-in' : ''} ${
                                        carIdx === i ? 'border-cyan-400/40' : 'hover:border-white/20'
                                    }`}
                                    style={{ transitionDelay: `${(i % 4) * 90}ms` }}
                                >
                                    <div className="relative bg-carbon-925/70 border border-white/[0.04] py-4 mb-5 overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(65%_75%_at_50%_60%,rgba(255,255,255,0.05),transparent_72%)]" />
                                        <div className="relative">
                                            <CarVisualizer vehicle={v} size="medium" animated={carIdx === i} showUnderglow={carIdx === i} />
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="label-tech text-cyan-300/70">{t(v.class_type)}</div>
                                            <h4 className="font-display font-bold uppercase tracking-wide text-base text-white mt-1 truncate">
                                                {t(v.name)}
                                            </h4>
                                        </div>
                                        <div className="numeric text-sm font-bold text-slate-400 shrink-0">
                                            {v.price > 0 ? Number(v.price).toLocaleString(locale()) : <span className="text-emerald-400">{t("FREE")}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                                        {[
                                            { icon: Gauge, v: v.base_speed },
                                            { icon: Zap, v: v.base_acceleration },
                                            { icon: Cpu, v: v.base_handling },
                                        ].map((s, k) => (
                                            <div key={k} className="flex items-center gap-1.5">
                                                <s.icon className="w-3 h-3 text-slate-600" />
                                                <span className="numeric text-sm text-slate-300 font-semibold">{t(s.v)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═════════════════════ HOW IT WORKS ═════════════════════ */}
            <section ref={stepsRef} className="relative border-y border-white/[0.06] bg-carbon-925 py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <SectionHeading
                        index="04"
                        eyebrow="Quick Start"
                        title={t("Grid slot in")}
                        accent="under a minute."
                        align="center"
                    />

                    <div className="relative">
                        {/* connector */}
                        <div className="hidden lg:block absolute top-[2.4rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                            {[
                                { n: '01', icon: Users, title: 'Create Account', desc: 'Email sign-up. A starter car and 1,000 CR land in your garage immediately.' },
                                { n: '02', icon: Wrench, title: 'Tune on the Dyno', desc: 'Install ECU stages, forced induction, slicks and nitrous. Watch the numbers move.' },
                                { n: '03', icon: Palette, title: 'Apply a Livery', desc: 'Paint, carbon, neon and glow packages so the grid knows whose car that is.' },
                                { n: '04', icon: Flag, title: 'Take the Grid', desc: 'Choose a circuit, race the field, bank credits and XP toward the next build.' },
                            ].map((s, i) => (
                                <div
                                    key={s.n}
                                    className={`relative text-center lg:text-left space-y-4 reveal ${stepsIn ? 'reveal-in' : ''}`}
                                    style={{ transitionDelay: `${i * 110}ms` }}
                                >
                                    <div className="relative z-10 w-[4.8rem] h-[4.8rem] mx-auto lg:mx-0 border border-white/[0.08] bg-carbon-925 flex items-center justify-center">
                                        <s.icon className="w-6 h-6 text-cyan-400" />
                                        <span className="absolute -top-2.5 -right-2.5 numeric text-xs font-bold text-carbon-950 bg-cyan-400 px-1.5 py-0.5">
                                            {t(s.n)}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold uppercase tracking-wide text-lg text-white">{t(s.title)}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto lg:mx-0">{t(s.desc)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════ PADDOCK WIRE ═════════════════════ */}
            <section ref={newsRef} className="relative bg-carbon-950 py-24 lg:py-32 overflow-hidden">
                <GhostIndex className="bottom-0 -left-4 hidden lg:block">05</GhostIndex>
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                    <SectionHeading
                        index="05"
                        eyebrow="Paddock Wire"
                        title={t("From the")}
                        accent="pit wall."
                        lead="Championship bulletins, engineering deep-dives and patch notes from the team building the sim."
                        action={
                            <Link href="/news" className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0">{t("All articles ")}<ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        }
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Featured */}
                        <Link
                            href="/news/season-26-championship-kickoff"
                            className={`lg:col-span-7 group relative surface notch-tr p-8 sm:p-10 flex flex-col justify-end min-h-[24rem] overflow-hidden lift hover:border-cyan-400/30 reveal ${newsIn ? 'reveal-in' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-transparent to-transparent" />
                            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-500/[0.07] blur-[80px]" />
                            <div className="absolute inset-0 checkers opacity-[0.12]" />

                            <div className="relative space-y-5">
                                <div className="flex items-center gap-3">
                                    <span className="label-tech px-2.5 py-1 border border-cyan-400/25 text-cyan-300 rounded-full">{t("Championship")}</span>
                                    <span className="label-tech text-slate-600 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />{t(" 4 min read ")}</span>
                                </div>
                                <h3 className="headline text-3xl sm:text-4xl text-white group-hover:text-cyan-300 transition-colors max-w-xl">{t("Season ’26 kickoff: new circuits & a 500k CR purse ")}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{t("The largest championship season yet opens with three world-class circuits, eight vehicle classes and the biggest credit distribution StreetForge has run. ")}</p>
                                <div className="flex items-center gap-3 pt-2">
                                    <span className="w-8 h-8 bg-cyan-400 text-carbon-950 font-display font-bold flex items-center justify-center text-sm">D</span>
                                    <div>
                                        <div className="text-xs font-semibold text-slate-200">{t("Dominic Vance")}</div>
                                        <div className="label-tech text-slate-600">{t("Motorsport Director · Sep 14")}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Side list */}
                        <div className="lg:col-span-5 flex flex-col gap-5">
                            {[
                                {
                                    slug: 'dyno-tuning-guide-ecu-turbos-slicks',
                                    cat: 'Engineering',
                                    tone: 'border-orange-400/25 text-orange-300',
                                    title: 'Mastering dyno tuning: ECU, turbo &amp; slicks',
                                    excerpt: 'How suspension rigidity and gear ratios decide corner-exit velocity.',
                                    author: 'Marcus Thorne',
                                    color: '#f97316',
                                    date: 'Sep 10',
                                    read: '6 min',
                                },
                                {
                                    slug: 'patch-v2-4-engine-telemetry-overdrive',
                                    cat: 'Patch Notes',
                                    tone: 'border-violet-400/25 text-violet-300',
                                    title: 'Patch 2.4: 60 FPS canvas, cryo nitrous, audio engine',
                                    excerpt: 'Web Audio pitch synthesis, tire mark rendering and a rebuilt render loop.',
                                    author: 'Elena Rostova',
                                    color: '#a855f7',
                                    date: 'Sep 02',
                                    read: '3 min',
                                },
                            ].map((a, i) => (
                                <Link
                                    key={a.slug}
                                    href={`/news/${a.slug}`}
                                    className={`group surface p-6 flex-1 flex flex-col justify-between lift hover:border-white/20 reveal ${newsIn ? 'reveal-in' : ''}`}
                                    style={{ transitionDelay: `${(i + 1) * 120}ms` }}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`label-tech px-2.5 py-1 border rounded-full ${a.tone}`}>{t(a.cat)}</span>
                                            <span className="label-tech text-slate-600">{t(a.read)}</span>
                                        </div>
                                        <h3
                                            className="font-display font-bold uppercase tracking-wide text-xl text-white group-hover:text-cyan-300 transition-colors leading-tight"
                                            dangerouslySetInnerHTML={{ __html: a.title }}
                                        />
                                        <p className="text-xs text-slate-500 leading-relaxed">{t(a.excerpt)}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: a.color }}>
                                                {t(a.author[0])}
                                            </span>
                                            <span className="label-tech text-slate-500">{t(a.author)}{t(" · ")}{t(a.date)}</span>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════ TRUST STRIP ═════════════════════ */}
            <section className="border-y border-white/[0.06] bg-carbon-925">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            { icon: Lock, title: 'Encrypted Checkout', desc: '256-bit TLS through regulated UK/EU payment gateways.' },
                            { icon: FileText, title: 'Automated VAT Invoices', desc: 'A pixel-perfect PDF tax invoice for every single purchase.' },
                            { icon: ShieldCheck, title: 'Sanctions Compliant', desc: 'UK GDPR, Data Protection Act 2018, HM Treasury & OFAC screening.' },
                        ].map((benefit) => (
                            <div key={benefit.title} className="flex items-start gap-4">
                                <div className="w-10 h-10 shrink-0 border border-white/[0.08] flex items-center justify-center text-cyan-400">
                                    <benefit.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-display font-bold uppercase tracking-wide text-sm text-white">{t(benefit.title)}</div>
                                    <div className="text-xs text-slate-500 leading-relaxed">{t(benefit.desc)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═════════════════════ FINAL CTA ═════════════════════ */}
            <section className="relative bg-carbon-950 py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 checkers opacity-[0.5]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] rounded-full bg-cyan-500/[0.08] blur-[130px]" />
                <div className="absolute inset-0 vignette" />

                <div className="relative max-w-3xl mx-auto px-5 sm:px-6 text-center space-y-8">
                    <Eyebrow tone="neutral">
                        <Trophy className="w-3 h-3" />{t("Ready to race ")}</Eyebrow>

                    <h2 className="headline text-5xl sm:text-6xl lg:text-7xl text-white text-balance">{t("Claim your")}<br />
                        <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600 bg-clip-text text-transparent">{t("driver seat ")}</span>
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">{t("Sign up in thirty seconds. First sports car and ")}<strong className="text-white">{t("1,000 CR")}</strong>{t(" on the house. No card, no download, no plugin. ")}</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href={user ? '/race/lobby' : '/register'}
                            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm hover:bg-cyan-300 transition-colors"
                        >
                            <span className="absolute inset-y-0 w-14 bg-white/60 animate-sweep" aria-hidden="true" />
                            <span className="relative flex items-center gap-2.5">
                                {user ? <><Play className="w-4 h-4" />{t(" Enter Race Lobby")}</> : <>{t("Register Free")}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>}
                            </span>
                        </Link>
                        {!user && (
                            <Link
                                href="/how-it-works"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/15 hover:border-white/30 text-slate-200 font-display font-bold uppercase tracking-wider text-sm transition-colors"
                            >{t("How it works ")}</Link>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6">
                        {['No credit card', 'No download', 'Instant access'].map((benefit) => (
                            <span key={benefit} className="label-tech text-slate-600 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                {t(benefit)}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
