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
            {children}
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
                        <span className="label-tech text-slate-600 numeric">{index}</span>
                    )}
                    <span className="h-px w-8 bg-white/15" />
                    <span className="label-tech text-cyan-300/90">{eyebrow}</span>
                </div>
                <h2 className="headline text-4xl sm:text-5xl lg:text-6xl text-white text-balance">
                    {title}{' '}
                    {accent && <span className="text-cyan-400">{accent}</span>}
                </h2>
                {lead && (
                    <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed max-w-xl">
                        {lead}
                    </p>
                )}
            </div>
            {action}
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
                <span className="label-tech text-slate-500">{label}</span>
                <span className="numeric text-white font-bold text-base leading-none">
                    {value}
                    <span className="text-slate-600 text-[10px] font-semibold ml-1">{unit}</span>
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
            {children}
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
                        <span className="label-tech text-slate-400 whitespace-nowrap">{item}</span>
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

    const tickerItems = (tracks.length ? tracks.map((t) => t.name) : ['Neon City Grand Prix', 'Cyber Highway Sprint', 'Canyon Drift Pass'])
        .concat(['Season ’26 Championship', '60 FPS Canvas Engine', 'Dyno Tuning Bay', 'Instant VAT Invoices', 'Global Leaderboard', 'No Downloads Required']);

    return (
        <PublicLayout>

            {/* ═════════════════════ HERO ═════════════════════ */}
            <section ref={heroRef} className="relative isolate overflow-hidden bg-grain">
                {/* Ambient light */}
                <div className="absolute inset-0 -z-10 bg-carbon-weave" />
                <div className="absolute top-[-18rem] left-1/2 -translate-x-1/2 w-[70rem] h-[48rem] -z-10 rounded-full bg-cyan-500/[0.07] blur-[140px]" />
                <div className="absolute top-24 right-[-16rem] w-[36rem] h-[36rem] -z-10 rounded-full bg-orange-600/[0.05] blur-[120px]" />
                <div className="road-grid -z-10">
                    <div className="road-grid__plane" />
                </div>
                <div className="absolute inset-0 -z-10 vignette" />

                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">

                        {/* ── Copy ── */}
                        <div className={`lg:col-span-5 space-y-8 reveal ${heroIn ? 'reveal-in' : ''}`}>
                            <Eyebrow>
                                <LiveDot />
                                Season &rsquo;26 &mdash; Championship Live
                            </Eyebrow>

                            <div className="space-y-4">
                                <h1 className="headline text-[3.4rem] sm:text-7xl lg:text-[5.4rem] text-white">
                                    Engineered
                                    <br />
                                    for the{' '}
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                                            apex
                                        </span>
                                        <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 to-transparent" />
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-[15px] sm:text-base leading-relaxed max-w-md">
                                    A deterministic 60&nbsp;FPS motorsport simulation that runs entirely in your browser.
                                    Own the machine, tune it on the dyno, and take it to the grid.
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {user ? (
                                    <Link
                                        href="/race/lobby"
                                        className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm hover:bg-cyan-300 transition-colors duration-300"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Enter Race Lobby
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/register"
                                            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm hover:bg-cyan-300 transition-colors duration-300"
                                        >
                                            <span className="absolute inset-y-0 w-14 bg-white/60 animate-sweep" aria-hidden="true" />
                                            <span className="relative flex items-center gap-2.5">
                                                Start Racing
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 hover:border-cyan-400/50 text-slate-200 hover:text-white font-display font-bold uppercase tracking-wider text-sm backdrop-blur-sm transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Inline trust rail */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                                {[
                                    { icon: Flame, text: '60 FPS Canvas', tone: 'text-orange-400' },
                                    { icon: FileText, text: 'Instant VAT Invoices', tone: 'text-cyan-400' },
                                    { icon: ShieldCheck, text: 'UK Compliant', tone: 'text-emerald-400' },
                                ].map((t) => (
                                    <div key={t.text} className="flex items-center gap-2">
                                        <t.icon className={`w-3.5 h-3.5 ${t.tone}`} />
                                        <span className="label-tech text-slate-500">{t.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Spec card ── */}
                        <div className={`lg:col-span-7 reveal ${heroIn ? 'reveal-in' : ''}`} style={{ transitionDelay: '140ms' }}>
                            <div className="relative">
                                {/* Corner ticks */}
                                <span className="absolute -top-px -left-px w-10 h-10 border-t border-l border-cyan-400/50 pointer-events-none" />
                                <span className="absolute -bottom-px -right-px w-10 h-10 border-b border-r border-cyan-400/25 pointer-events-none" />

                                <div className="surface-raised notch-tr p-6 sm:p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="label-tech text-cyan-300">{activeCar?.class_type || 'Sport'} Class</span>
                                                <span className="h-3 w-px bg-white/15" />
                                                <span className="label-tech text-slate-600">
                                                    {String(carIdx + 1).padStart(2, '0')} / {String(featuredVehicles.length || 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <h3 className="headline text-3xl sm:text-4xl text-white">
                                                {activeCar?.name || 'Apex Pulse GT'}
                                            </h3>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="label-tech text-slate-600 mb-1">Acquisition</div>
                                            <div className="numeric text-xl text-white font-bold leading-none">
                                                {activeCar?.price > 0
                                                    ? <>{Number(activeCar.price).toLocaleString()}<span className="text-slate-600 text-xs ml-1">CR</span></>
                                                    : <span className="text-emerald-400">INCLUDED</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Car stage */}
                                    <div className="relative bg-carbon-950/60 border border-white/[0.05] overflow-hidden">
                                        {/* Studio floor */}
                                        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_58%,rgba(255,255,255,0.055),transparent_70%)] pointer-events-none" />
                                        <div className="absolute inset-0 bg-cyber-grid opacity-60 pointer-events-none" />
                                        <div className="absolute inset-x-8 bottom-[28%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon-950 to-transparent pointer-events-none" />
                                        <div className="relative py-8 px-4">
                                            <CarVisualizer vehicle={activeCar} size="large" animated showUnderglow />
                                        </div>

                                        {featuredVehicles.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevCar}
                                                    aria-label="Previous vehicle"
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 border border-white/10 bg-carbon-900/80 text-slate-400 hover:text-white hover:border-cyan-400/50 backdrop-blur-sm transition-colors"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={nextCar}
                                                    aria-label="Next vehicle"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 border border-white/10 bg-carbon-900/80 text-slate-400 hover:text-white hover:border-cyan-400/50 backdrop-blur-sm transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Telemetry */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-7 mt-7">
                                        <Meter label="Top Speed" value={activeCar?.base_speed || 210} max={340} unit="KM/H" tone="cyan" animate={heroIn} />
                                        <Meter label="Acceleration" value={activeCar?.base_acceleration || 70} max={100} unit="PTS" tone="ember" animate={heroIn} />
                                        <Meter label="Handling" value={activeCar?.base_handling || 75} max={100} unit="PTS" tone="mint" animate={heroIn} />
                                    </div>

                                    {/* Selector */}
                                    {featuredVehicles.length > 1 && (
                                        <div className="mt-7 pt-5 border-t border-white/[0.06] flex gap-2 overflow-x-auto scrollbar-none">
                                            {featuredVehicles.map((car, idx) => (
                                                <button
                                                    key={car.id}
                                                    onClick={() => setCarIdx(idx)}
                                                    className={`shrink-0 px-3.5 py-2 label-tech transition-colors border ${
                                                        carIdx === idx
                                                            ? 'bg-cyan-400 text-carbon-950 border-cyan-400'
                                                            : 'text-slate-500 border-white/[0.07] hover:text-white hover:border-white/20'
                                                    }`}
                                                >
                                                    {car.name.split(' ').slice(0, 2).join(' ')}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                    {m.value}<span className="text-cyan-400">{m.suffix}</span>
                                </div>
                                <div className="label-tech text-slate-400 pt-2">{m.label}</div>
                                <div className="text-xs text-slate-600">{m.sub}</div>
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
                        title="Three circuits."
                        accent="One championship."
                        lead="Each layout rewards a different build. Street precision, raw top speed, or absolute corner discipline — pick your battleground."
                        action={
                            <Link
                                href="/race/lobby"
                                className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0"
                            >
                                All circuits
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {(tracks.length ? tracks : [
                            { id: 1, name: 'Neon City Grand Prix', theme: 'cyber_city', difficulty: 'Medium', laps: 2, length_meters: 2800, reward_currency_1st: 550, description: 'High-speed urban circuit through neon skyscrapers and underground speed tunnels.' },
                            { id: 2, name: 'Cyber Highway Sprint', theme: 'neon_highway', difficulty: 'Easy', laps: 2, length_meters: 2200, reward_currency_1st: 380, description: 'Wide elevated highway built for raw top speed, drafting and nitro timing.' },
                            { id: 3, name: 'Canyon Drift Pass', theme: 'canyon_drift', difficulty: 'Hard', laps: 3, length_meters: 3500, reward_currency_1st: 850, description: 'Mountain hairpins and switchbacks that punish anything but perfect handling.' },
                        ]).map((t, i) => {
                            const meta = TRACK_META[t.theme] || TRACK_META.cyber_city;
                            const Icon = meta.icon;
                            const diffTone = {
                                Easy: 'text-emerald-400 border-emerald-400/25',
                                Medium: 'text-cyan-300 border-cyan-400/25',
                                Hard: 'text-orange-400 border-orange-400/25',
                                Pro: 'text-red-400 border-red-400/25',
                            }[t.difficulty] || 'text-slate-400 border-white/10';

                            return (
                                <Link
                                    key={t.id}
                                    href="/race/lobby"
                                    className={`group surface notch-tr p-6 flex flex-col lift hover:border-white/20 reveal ${circuitsIn ? 'reveal-in' : ''}`}
                                    style={{ transitionDelay: `${i * 110}ms` }}
                                >
                                    <div className="flex items-start justify-between mb-5">
                                        <span className="label-tech text-slate-600 numeric">R{String(i + 1).padStart(2, '0')}</span>
                                        <span className={`label-tech px-2.5 py-1 border rounded-full ${diffTone}`}>{t.difficulty}</span>
                                    </div>

                                    <div className="h-36 mb-6 opacity-90 group-hover:opacity-100 transition-opacity">
                                        <TrackMap theme={t.theme} />
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="w-3.5 h-3.5" style={{ color: meta.tone }} />
                                        <span className="label-tech text-slate-500">{meta.label}</span>
                                    </div>

                                    <h3 className="headline text-2xl text-white group-hover:text-cyan-300 transition-colors">
                                        {t.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2 flex-1">
                                        {t.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                                        {[
                                            { icon: Route, v: `${(t.length_meters / 1000).toFixed(1)}`, u: 'KM' },
                                            { icon: Timer, v: t.laps, u: 'LAPS' },
                                            { icon: Trophy, v: Math.round(Number(t.reward_currency_1st)), u: 'CR' },
                                        ].map((s, k) => (
                                            <div key={k} className="space-y-1">
                                                <s.icon className="w-3 h-3 text-slate-600" />
                                                <div className="numeric text-lg text-white font-bold leading-none">
                                                    {s.v}<span className="text-[9px] text-slate-600 ml-1 font-semibold">{s.u}</span>
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
                                <span className="label-tech text-orange-300/90">The Dyno Bay</span>
                            </div>
                            <h2 className="headline text-4xl sm:text-5xl lg:text-6xl text-white">
                                Every tenth<br />is bought <span className="text-orange-400">in the garage</span>
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed max-w-lg">
                                Twenty-two components across four engineering disciplines. Stack stages, watch the dyno
                                curve move, then find out on track whether the setup was worth the credits.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-1">
                                <Link
                                    href="/garage"
                                    className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm hover:bg-orange-300 transition-colors"
                                >
                                    <Wrench className="w-4 h-4" />
                                    Open the Garage
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/15 hover:border-white/30 text-slate-200 font-display font-bold uppercase tracking-wider text-sm transition-colors"
                                >
                                    Showroom
                                </Link>
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
                                            <div className="font-display font-bold uppercase tracking-wide text-[15px] text-white">{row.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 truncate">{row.desc}</div>
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
                                            <span className="label-tech text-slate-600 ml-2 numeric">{row.stages}</span>
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
                            title="Pick your"
                            accent="weapon."
                            lead="From a free starter coupe to a carbon-tubbed hypercar. Every machine takes the full upgrade tree."
                            action={
                                <Link href="/shop" className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0">
                                    Visit showroom
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                                            <div className="label-tech text-cyan-300/70">{v.class_type}</div>
                                            <h4 className="font-display font-bold uppercase tracking-wide text-base text-white mt-1 truncate">
                                                {v.name}
                                            </h4>
                                        </div>
                                        <div className="numeric text-sm font-bold text-slate-400 shrink-0">
                                            {v.price > 0 ? Number(v.price).toLocaleString() : <span className="text-emerald-400">FREE</span>}
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
                                                <span className="numeric text-sm text-slate-300 font-semibold">{s.v}</span>
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
                        title="Grid slot in"
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
                                            {s.n}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold uppercase tracking-wide text-lg text-white">{s.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto lg:mx-0">{s.desc}</p>
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
                        title="From the"
                        accent="pit wall."
                        lead="Championship bulletins, engineering deep-dives and patch notes from the team building the sim."
                        action={
                            <Link href="/news" className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0">
                                All articles
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                                    <span className="label-tech px-2.5 py-1 border border-cyan-400/25 text-cyan-300 rounded-full">Championship</span>
                                    <span className="label-tech text-slate-600 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" /> 4 min read
                                    </span>
                                </div>
                                <h3 className="headline text-3xl sm:text-4xl text-white group-hover:text-cyan-300 transition-colors max-w-xl">
                                    Season &rsquo;26 kickoff: new circuits &amp; a 500k CR purse
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                                    The largest championship season yet opens with three world-class circuits, eight
                                    vehicle classes and the biggest credit distribution StreetForge has run.
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <span className="w-8 h-8 bg-cyan-400 text-carbon-950 font-display font-bold flex items-center justify-center text-sm">D</span>
                                    <div>
                                        <div className="text-xs font-semibold text-slate-200">Dominic Vance</div>
                                        <div className="label-tech text-slate-600">Motorsport Director &middot; Sep 14</div>
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
                                            <span className={`label-tech px-2.5 py-1 border rounded-full ${a.tone}`}>{a.cat}</span>
                                            <span className="label-tech text-slate-600">{a.read}</span>
                                        </div>
                                        <h3
                                            className="font-display font-bold uppercase tracking-wide text-xl text-white group-hover:text-cyan-300 transition-colors leading-tight"
                                            dangerouslySetInnerHTML={{ __html: a.title }}
                                        />
                                        <p className="text-xs text-slate-500 leading-relaxed">{a.excerpt}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: a.color }}>
                                                {a.author[0]}
                                            </span>
                                            <span className="label-tech text-slate-500">{a.author} &middot; {a.date}</span>
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
                        ].map((t) => (
                            <div key={t.title} className="flex items-start gap-4">
                                <div className="w-10 h-10 shrink-0 border border-white/[0.08] flex items-center justify-center text-cyan-400">
                                    <t.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-display font-bold uppercase tracking-wide text-sm text-white">{t.title}</div>
                                    <div className="text-xs text-slate-500 leading-relaxed">{t.desc}</div>
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
                        <Trophy className="w-3 h-3" />
                        Ready to race
                    </Eyebrow>

                    <h2 className="headline text-5xl sm:text-6xl lg:text-7xl text-white text-balance">
                        Claim your<br />
                        <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                            driver seat
                        </span>
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Sign up in thirty seconds. First sports car and <strong className="text-white">1,000&nbsp;CR</strong> on
                        the house. No card, no download, no plugin.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href={user ? '/race/lobby' : '/register'}
                            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm hover:bg-cyan-300 transition-colors"
                        >
                            <span className="absolute inset-y-0 w-14 bg-white/60 animate-sweep" aria-hidden="true" />
                            <span className="relative flex items-center gap-2.5">
                                {user ? <><Play className="w-4 h-4" /> Enter Race Lobby</> : <>Register Free<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>}
                            </span>
                        </Link>
                        {!user && (
                            <Link
                                href="/how-it-works"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/15 hover:border-white/30 text-slate-200 font-display font-bold uppercase tracking-wider text-sm transition-colors"
                            >
                                How it works
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6">
                        {['No credit card', 'No download', 'Instant access'].map((t) => (
                            <span key={t} className="label-tech text-slate-600 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
