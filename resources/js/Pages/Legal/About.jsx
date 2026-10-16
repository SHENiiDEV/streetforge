import { t } from '../../localization';
import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Zap, 
    Trophy, 
    Cpu, 
    Users, 
    ChevronRight, 
    Gauge, 
    FileText, 
    Lock, 
    Globe, 
    Server, 
    Layers,
    Award
} from 'lucide-react';

export default function About() {
    const { company } = usePage().props;

    const companyName = company?.name || 'StreetForge Ltd';
    const companyNumber = company?.number || '14829103';
    const companyAddress = company?.address || '128 City Road, London, EC1V 2NX, United Kingdom';
    const companyEmail = company?.email || 'support@streetforge.co.uk';

    return (
        <PublicLayout>
            <div className="max-w-6xl mx-auto px-4 py-16">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">{t("Company Profile & Engineering Vision ")}</div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-extrabold text-white">{t("About ")}<span className="text-cyan-400">{t("StreetForge")}</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">{t("StreetForge is a London-based interactive entertainment and simulation technology studio. We engineer high-performance, browser-native automotive physics simulations paired with digital asset management, competitive leaderboards, and institutional-grade payment security. ")}</p>
                </div>

                {/* Company Story & Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-orbitron font-bold text-white">{t("Our Mission ")}</h2>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{t("Historically, authentic sim racing required gigabytes of proprietary software, complex launchers, and high-end hardware. StreetForge redefines this paradigm by bringing 60 FPS physics, dynamic atmospheric rendering, telemetry logging, and modular engine tuning straight into any modern web browser. ")}</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{t("Whether competing in our flagship Urban GP or mastering the treacherous turns of Drift Canyon, drivers experience real-time calculated slip angles, turbo boost curves, downforce calculations, and tire degradation algorithms. ")}</p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-orbitron font-bold text-white">{t("UK Corporate Transparency ")}</h2>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {t(companyName)}{t(" is a legally registered enterprise incorporated under the laws of England and Wales. We uphold the strictest standards of corporate governance, consumer protection under the Consumer Rights Act 2015, and data privacy under UK GDPR & Data Protection Act 2018. ")}</p>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5 font-mono">
                            <div><strong className="text-slate-200">{t("Legal Entity:")}</strong> {t(companyName)}</div>
                            <div><strong className="text-slate-200">{t("Company Number:")}</strong> {t(companyNumber)}</div>
                            <div><strong className="text-slate-200">{t("Registered Office:")}</strong> {t(companyAddress)}</div>
                            <div><strong className="text-slate-200">{t("Official Contact:")}</strong> {t(companyEmail)}</div>
                        </div>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="mb-16">
                    <h2 className="text-2xl font-orbitron font-bold text-white text-center mb-8">{t("Core Pillars of the StreetForge Platform ")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <h3 className="font-orbitron font-bold text-white text-base">{t("Physics Telemetry")}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{t("Client-side 60FPS deterministic physics engine calculating slip angles, tire friction, aero downforce, and nitrous fuel-air mixture ratios in real time. ")}</p>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="font-orbitron font-bold text-white text-base">{t("Verified Leaderboards")}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{t("Anti-cheat validation verifies telemetry checksums before registering lap times to the official global hall of fame. ")}</p>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="font-orbitron font-bold text-white text-base">{t("PCI-DSS Security")}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{t("Level 1 PCI-DSS certified payment infrastructure with 256-bit TLS encryption, 3D Secure 2.0, and instant PDF tax receipt generation. ")}</p>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="font-orbitron font-bold text-white text-base">{t("Global Sanctions Filter")}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{t("Proactive compliance adhering strictly to UK HM Treasury, OFAC, and EU restrictive measures prohibiting illicit transactions. ")}</p>
                        </div>
                    </div>
                </div>

                {/* Technology Architecture Section */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 sm:p-10 mb-16 space-y-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-3">
                        <Server className="w-6 h-6 text-cyan-400" />{t("Technology & Architecture Stack ")}</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">{t("StreetForge is engineered with a hybrid single-page architecture built on top of Laravel 13, React 18, and Inertia.js. This combines the security, transactional ACID compliance, and database integrity of enterprise PHP with the instant reactive responsiveness of modern client-side virtual DOM rendering. ")}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                            <div className="text-xs font-bold text-cyan-400 font-orbitron uppercase">{t("Core Backend")}</div>
                            <div className="text-sm font-semibold text-white">{t("Laravel 13 & PHP 8.4")}</div>
                            <p className="text-xs text-slate-400">{t("Robust transactional ORM, encrypted sessions, strict CSRF defense, and automated PDF invoice generation.")}</p>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                            <div className="text-xs font-bold text-cyan-400 font-orbitron uppercase">{t("Client State & UI")}</div>
                            <div className="text-sm font-semibold text-white">{t("React 18 & Inertia.js")}</div>
                            <p className="text-xs text-slate-400">{t("SPA navigation without slow API serialization delays, Tailwind CSS responsive layouts, and Lucide vector iconography.")}</p>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                            <div className="text-xs font-bold text-cyan-400 font-orbitron uppercase">{t("Canvas Engine")}</div>
                            <div className="text-sm font-semibold text-white">{t("HTML5 2D/WebGL Canvas")}</div>
                            <p className="text-xs text-slate-400">{t("High-performance sprite blitting, particle physics for tire smoke, nitro exhaust trails, and dynamic road curved parallax.")}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Banner */}
                <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white">{t("Join Over 1,400 Verified Racers Worldwide ")}</h2>
                    <p className="max-w-xl mx-auto text-slate-300 text-sm leading-relaxed">{t("Create your driver profile today. Unlock your first sports vehicle and 1,000 complimentary credits to tune your engine and hit the circuits. ")}</p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-orbitron font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
                        >{t("Register Driver Profile ")}<ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-sm border border-slate-700 transition-all"
                        >{t("How It Works ")}</Link>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}

