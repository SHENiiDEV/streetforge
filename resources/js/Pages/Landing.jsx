import React, { useState, useEffect, useRef } from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import CarVisualizer from '../Components/CarVisualizer';
import StatBar from '../Components/StatBar';
import { Link, usePage } from '@inertiajs/react';
import {
    Gauge,
    Zap,
    Trophy,
    Flag,
    Wrench,
    CreditCard,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Flame,
    Cpu,
    Layers,
    FileText,
    Users,
    Timer,
    Sparkles,
    ArrowRight,
    Star,
    Play,
    CircleDot,
    Target,
    Medal,
    Palette,
    Newspaper,
    Calendar,
    Clock,
} from 'lucide-react';

/* ─────────────────── Animated counter hook ─────────────────── */
function useCountUp(end, duration = 1800, trigger = true) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        let start = 0;
        const step = Math.max(1, Math.floor(end / (duration / 16)));
        const id = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(id); }
            else setCount(start);
        }, 16);
        return () => clearInterval(id);
    }, [end, trigger]);
    return count;
}

/* ─────────────────── Intersection observer hook ─────────────────── */
function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2, ...options });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

/* ─────────────────── Speed‑lines canvas (hero bg) ─────────────────── */
function SpeedLines() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        const lines = Array.from({ length: 40 }, () => ({
            x: Math.random() * 1600,
            y: Math.random() * 900,
            len: 60 + Math.random() * 180,
            speed: 2 + Math.random() * 6,
            opacity: 0.04 + Math.random() * 0.12,
        }));
        function resize() { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; }
        resize();
        window.addEventListener('resize', resize);
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const l of lines) {
                ctx.strokeStyle = `rgba(6,182,212,${l.opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(l.x * (canvas.width / 1600), l.y * (canvas.height / 900));
                ctx.lineTo((l.x + l.len) * (canvas.width / 1600), l.y * (canvas.height / 900));
                ctx.stroke();
                l.x += l.speed;
                if (l.x > 1600) { l.x = -l.len; l.y = Math.random() * 900; }
            }
            raf = requestAnimationFrame(draw);
        }
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Landing({ featuredVehicles = [], stats = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    /* Vehicle carousel */
    const [carIdx, setCarIdx] = useState(0);
    const activeCar = featuredVehicles[carIdx] || featuredVehicles[0];
    const prevCar = () => setCarIdx((i) => (i === 0 ? featuredVehicles.length - 1 : i - 1));
    const nextCar = () => setCarIdx((i) => (i === featuredVehicles.length - 1 ? 0 : i + 1));

    /* Auto‑rotate carousel every 5s */
    useEffect(() => {
        if (featuredVehicles.length < 2) return;
        const id = setInterval(nextCar, 5000);
        return () => clearInterval(id);
    }, [featuredVehicles.length]);

    /* Section visibility */
    const [metricsRef, metricsVisible] = useInView();
    const [featuresRef, featuresVisible] = useInView();
    const [stepsRef, stepsVisible] = useInView();

    /* Animated counters */
    const trackCount = useCountUp(stats.tracks || 3, 800, metricsVisible);
    const racerCount = useCountUp(stats.racers || 1420, 1400, metricsVisible);

    return (
        <PublicLayout>

            {/* ════════════ HERO ════════════ */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-36">
                {/* Layered ambient background */}
                <SpeedLines />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/8 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute top-40 -right-40 w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                        {/* ── Text column ── */}
                        <div className="lg:col-span-6 space-y-7 text-center lg:text-left">

                            {/* Season badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                                </span>
                                Season&rsquo;26 Championship Live
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-orbitron font-black text-white tracking-tight leading-[0.95]">
                                DOMINATE
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent text-glow-cyan">
                                    THE CIRCUIT
                                </span>
                            </h1>

                            {/* Sub */}
                            <p className="text-slate-300/90 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Build your dream garage, tune supercars to the limit, apply neon liveries, and compete in 60&nbsp;FPS browser races.{' '}
                                <span className="text-slate-400">No downloads. No plugins. Pure speed.</span>
                            </p>

                            {/* CTA row */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                                {user ? (
                                    <Link
                                        href="/race/lobby"
                                        className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        <Flag className="w-5 h-5" />
                                        Launch Race Lobby
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                        <Link
                                            href="/register"
                                            className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <Gauge className="w-5 h-5" />
                                            <span>Start Racing &bull; Free Car</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-orbitron font-bold text-xs border border-white/10 hover:border-cyan-500/30 backdrop-blur-sm transition-all"
                                        >
                                            Sign In to Garage
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Trust signals */}
                            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-slate-400">
                                {[
                                    { icon: ShieldCheck, text: 'Sanctions Compliant', color: 'text-emerald-400' },
                                    { icon: FileText, text: 'Instant PDF Invoices', color: 'text-cyan-400' },
                                    { icon: Flame, text: '60 FPS HTML5 Canvas', color: 'text-orange-400' },
                                ].map((t) => (
                                    <div key={t.text} className="flex items-center gap-1.5">
                                        <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                                        <span>{t.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Interactive car showcase card ── */}
                        <div className="lg:col-span-6 w-full">
                            <div className="relative bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/[0.08] rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">

                                {/* Subtle corner accents */}
                                <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
                                <div className="absolute top-0 left-0 h-16 w-px bg-gradient-to-b from-cyan-500/60 to-transparent" />
                                <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-l from-cyan-500/30 to-transparent" />
                                <div className="absolute bottom-0 right-0 h-16 w-px bg-gradient-to-t from-cyan-500/30 to-transparent" />

                                {/* Header row */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-900/60">
                                            {activeCar?.class_type || 'Sport'} Class
                                        </span>
                                        <h3 className="font-orbitron font-bold text-xl sm:text-2xl text-white mt-1.5 tracking-tight">
                                            {activeCar?.name || 'Apex Pulse GT'}
                                        </h3>
                                    </div>
                                    <span className="font-orbitron font-bold text-sm text-slate-400 mt-1">
                                        {activeCar?.price > 0 ? `${Number(activeCar.price).toLocaleString()} CR` : 'STARTER'}
                                    </span>
                                </div>

                                {/* Vehicle render with nav arrows */}
                                <div className="relative my-3 py-6 bg-slate-950/50 rounded-2xl border border-white/[0.04]">
                                    <CarVisualizer vehicle={activeCar} size="large" animated={true} />
                                    {featuredVehicles.length > 1 && (
                                        <>
                                            <button onClick={prevCar} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all" aria-label="Previous car">
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button onClick={nextCar} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all" aria-label="Next car">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Telemetry bars */}
                                <div className="space-y-2.5 pt-1">
                                    <StatBar label="Top Speed" value={activeCar?.base_speed || 210} max={320} unit="km/h" color="cyan" icon={Gauge} />
                                    <StatBar label="Acceleration" value={activeCar?.base_acceleration || 70} max={100} unit="pts" color="orange" icon={Zap} />
                                    <StatBar label="Handling" value={activeCar?.base_handling || 75} max={100} unit="pts" color="emerald" icon={Cpu} />
                                </div>

                                {/* Horizontal Scrollable Vehicle Selector */}
                                {featuredVehicles.length > 1 && (
                                    <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/[0.05] overflow-x-auto pb-1 scrollbar-none snap-x">
                                        {featuredVehicles.map((car, idx) => (
                                            <button
                                                key={car.id}
                                                onClick={() => setCarIdx(idx)}
                                                className={`shrink-0 whitespace-nowrap snap-center px-3 py-1.5 rounded-xl text-xs font-orbitron transition-all ${
                                                    carIdx === idx
                                                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                                                        : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
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
            </section>

            {/* ════════════ LIVE METRICS BAR ════════════ */}
            <section ref={metricsRef} className="relative border-y border-white/[0.04] bg-slate-950/90 py-10 overflow-hidden">
                {/* Decorative horizontal neon line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-600/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 text-center">
                        {[
                            { value: trackCount, suffix: '', label: 'Championship Circuits', color: 'text-cyan-400', icon: Target },
                            { value: racerCount, suffix: '+', label: 'Registered Drivers', color: 'text-white', icon: Users },
                            { value: 60, suffix: ' FPS', label: 'Canvas Game Engine', color: 'text-orange-400', icon: Flame },
                            { value: 100, suffix: '%', label: 'Automated PDF Invoicing', color: 'text-emerald-400', icon: FileText },
                        ].map((m) => (
                            <div key={m.label} className="space-y-2">
                                <m.icon className={`w-5 h-5 mx-auto ${m.color} opacity-60`} />
                                <div className={`text-3xl sm:text-4xl font-orbitron font-extrabold ${m.color} tabular-nums`}>
                                    {metricsVisible ? m.value : 0}{m.suffix}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ CORE FEATURES ════════════ */}
            <section ref={featuresRef} className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
                        <Layers className="w-3.5 h-3.5" />
                        Core Systems
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white">
                        Built for Pure <span className="text-cyan-400">Performance</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
                        Every system&mdash;from precision engine tuning to encrypted tax receipts&mdash;is integrated into a seamless single-page experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Wrench,
                            title: 'Garage & Dyno Tuning',
                            desc: 'Install stage 1‑3 ECU chips, forced induction twin‑turbos, racing compound slicks, and cryogenic nitrous bottles to boost speed and handling.',
                            href: '/garage',
                            linkText: 'Explore Garage',
                            color: 'cyan',
                            border: 'hover:border-cyan-500/30',
                        },
                        {
                            icon: Flag,
                            title: 'Real-Time Circuit Racing',
                            desc: 'Take the wheel in top‑down 2D canvas circuits. Control throttle, braking, drift trajectories, and overtake AI opponents to climb the podium.',
                            href: '/race/lobby',
                            linkText: 'View Race Circuits',
                            color: 'orange',
                            border: 'hover:border-orange-500/30',
                        },
                        {
                            icon: CreditCard,
                            title: 'Top-Up & PDF Invoicing',
                            desc: 'Replenish balance with credit bundles, webhook confirmation, and instant pixel-perfect PDF tax invoices compliant with EU legal requisites.',
                            href: '/topup',
                            linkText: 'Check Credit Packages',
                            color: 'emerald',
                            border: 'hover:border-emerald-500/30',
                        },
                    ].map((f, i) => {
                        const Icon = f.icon;
                        const colorMap = {
                            cyan: { bg: 'bg-cyan-500/10', ring: 'border-cyan-500/20', text: 'text-cyan-400' },
                            orange: { bg: 'bg-orange-500/10', ring: 'border-orange-500/20', text: 'text-orange-400' },
                            emerald: { bg: 'bg-emerald-500/10', ring: 'border-emerald-500/20', text: 'text-emerald-400' },
                        }[f.color];
                        return (
                            <div
                                key={f.title}
                                className={`group relative bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-white/[0.05] ${f.border} rounded-2xl p-8 space-y-4 transition-all duration-300`}
                                style={{
                                    opacity: featuresVisible ? 1 : 0,
                                    transform: featuresVisible ? 'translateY(0)' : 'translateY(24px)',
                                    transition: `opacity 0.5s ${i * 0.12}s, transform 0.5s ${i * 0.12}s`,
                                }}
                            >
                                <div className={`w-12 h-12 rounded-xl ${colorMap.bg} border ${colorMap.ring} flex items-center justify-center ${colorMap.text} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-orbitron font-bold text-lg text-white">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                                <Link href={f.href} className={`inline-flex items-center gap-1.5 text-xs font-bold ${colorMap.text} group-hover:underline underline-offset-4`}>
                                    {f.linkText} <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ════════════ HOW IT WORKS ════════════ */}
            <section ref={stepsRef} className="py-24 border-y border-white/[0.04] bg-slate-950/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" />
                            Quick Start
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white">
                            From Zero to <span className="text-cyan-400">Pole Position</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
                            Get on the track in under a minute. No downloads, no installs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', icon: Users, title: 'Create Account', desc: 'Sign up with email and get your free starter car and 1,000 CR bonus instantly.' },
                            { step: '02', icon: Wrench, title: 'Tune Your Ride', desc: 'Visit the Garage to install ECU chips, turbos, and slicks. Boost your stats before race day.' },
                            { step: '03', icon: Palette, title: 'Apply Liveries', desc: 'Choose from neon skins and custom liveries to make your car stand out on the circuit.' },
                            { step: '04', icon: Flag, title: 'Hit the Track', desc: 'Choose a circuit, line up against AI opponents, and race for XP, credits, and glory.' },
                        ].map((s, i) => (
                            <div
                                key={s.step}
                                className="relative bg-gradient-to-b from-slate-900/50 to-transparent border border-white/[0.04] rounded-2xl p-6 pt-8 space-y-3"
                                style={{
                                    opacity: stepsVisible ? 1 : 0,
                                    transform: stepsVisible ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
                                }}
                            >
                                <span className="absolute -top-3 left-6 font-orbitron font-black text-sm text-cyan-400 bg-slate-950 border border-cyan-800/50 px-3 py-0.5 rounded-full">
                                    {s.step}
                                </span>
                                <s.icon className="w-7 h-7 text-slate-500" />
                                <h3 className="font-orbitron font-bold text-base text-white">{s.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ VEHICLE SHOWCASE GALLERY ════════════ */}
            {featuredVehicles.length > 0 && (
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
                            <CircleDot className="w-3.5 h-3.5" />
                            Vehicle Roster
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white">
                            Choose Your <span className="text-cyan-400">Machine</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {featuredVehicles.map((v, i) => (
                            <div
                                key={v.id}
                                className={`group bg-gradient-to-b from-slate-900/70 to-slate-950/70 border rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
                                    carIdx === i ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/10' : 'border-white/[0.05] hover:border-white/10'
                                }`}
                                onClick={() => setCarIdx(i)}
                            >
                                <div className="bg-slate-950/60 rounded-xl border border-white/[0.03] py-3 mb-4">
                                    <CarVisualizer vehicle={v} size="medium" animated={carIdx === i} showUnderglow={carIdx === i} />
                                </div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-400/70">{v.class_type} Class</span>
                                        <h4 className="font-orbitron font-bold text-sm text-white mt-0.5">{v.name}</h4>
                                    </div>
                                    <span className="text-xs font-orbitron font-bold text-slate-500 mt-1">
                                        {v.price > 0 ? `${Number(v.price).toLocaleString()} CR` : 'FREE'}
                                    </span>
                                </div>
                                <div className="mt-3 flex gap-3 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {v.base_speed}</span>
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {v.base_acceleration}</span>
                                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {v.base_handling}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ════════════ LATEST MOTORSPORT NEWS & TELEMETRY ════════════ */}
            <section className="py-24 border-y border-white/[0.04] bg-slate-950/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-[11px] font-orbitron font-bold uppercase tracking-widest">
                                <Newspaper className="w-3.5 h-3.5" />
                                Paddock Wire
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white">
                                Latest News & <span className="text-cyan-400">Telemetry</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                                Engineering tuning guides, championship announcements, patch notes, and esports driver spotlights.
                            </p>
                        </div>

                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-cyan-400 text-xs font-orbitron font-bold transition-all shrink-0"
                        >
                            <span>Browse All Articles</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                slug: 'season-26-championship-kickoff',
                                category: 'Championship',
                                categoryColor: 'border-cyan-800 bg-cyan-950/60 text-cyan-400',
                                title: "Season '26 Championship Kickoff: New Circuits & 500k CR Purse",
                                excerpt: "StreetForge opens its largest championship season yet with three world-class circuits, eight specialized vehicle classes, and massive credit prize distributions.",
                                author: 'Dominic Vance',
                                authorRole: 'Motorsport Director',
                                avatarColor: '#06b6d4',
                                date: 'Sep 14, 2026',
                                readTime: '4 min read',
                            },
                            {
                                slug: 'dyno-tuning-guide-ecu-turbos-slicks',
                                category: 'Engineering',
                                categoryColor: 'border-orange-800 bg-orange-950/60 text-orange-400',
                                title: 'Mastering Dyno Tuning: How to Optimize ECU, Turbo & Slicks',
                                excerpt: "An engineer's deep dive into our 22-part upgrade ecosystem. Learn how suspension rigidity and gear ratios affect corner exit velocity.",
                                author: 'Marcus Thorne',
                                authorRole: 'Lead Dyno Technician',
                                avatarColor: '#f97316',
                                date: 'Sep 10, 2026',
                                readTime: '6 min read',
                            },
                            {
                                slug: 'patch-v2-4-engine-telemetry-overdrive',
                                category: 'Patch Notes',
                                categoryColor: 'border-purple-800 bg-purple-950/60 text-purple-400',
                                title: 'Patch 2.4 Notes: 60 FPS Canvas, Cryo Nitrous & Audio Engine',
                                excerpt: "Detailed changelog for our latest update: upgraded 60 FPS HTML5 canvas engine, Web Audio pitch synthesis, and tire mark rendering.",
                                author: 'Elena Rostova',
                                authorRole: 'Lead WebGL Engineer',
                                avatarColor: '#a855f7',
                                date: 'Sep 02, 2026',
                                readTime: '3 min read',
                            },
                        ].map((article) => (
                            <Link
                                key={article.slug}
                                href={`/news/${article.slug}`}
                                className="group bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold border ${article.categoryColor}`}>
                                            {article.category}
                                        </span>
                                        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-500" />
                                            {article.readTime}
                                        </span>
                                    </div>

                                    <h3 className="font-orbitron font-bold text-base text-white group-hover:text-cyan-300 transition-colors leading-snug">
                                        {article.title}
                                    </h3>

                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                </div>

                                <div className="pt-5 mt-5 border-t border-slate-850 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                                            style={{ backgroundColor: article.avatarColor }}
                                        >
                                            {article.author[0]}
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-slate-200">{article.author}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">{article.date}</div>
                                        </div>
                                    </div>

                                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ FINAL CTA ════════════ */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/20 rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
                    {/* Decorative glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-blue-500/6 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-700/40 text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
                            <Trophy className="w-3.5 h-3.5" />
                            Ready to Race?
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white leading-tight">
                            Claim Your Driver Seat
                        </h2>
                        <p className="text-slate-300/80 text-sm sm:text-base leading-relaxed">
                            Sign up in 30 seconds. Receive your first sports car and <strong className="text-white">1,000&nbsp;CR</strong> starting bonus. No credit card required.
                        </p>
                        <div className="pt-2 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/register"
                                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-extrabold text-sm shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-0.5"
                            >
                                Register Now &bull; Free Starter Car
                                <ArrowRight className="w-4 h-4 inline ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-orbitron font-bold text-sm border border-white/10 hover:border-cyan-500/30 transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
