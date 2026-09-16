import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { Warehouse, ShoppingBag, CreditCard, Flag, Wrench, Shield, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            num: '01',
            icon: Warehouse,
            title: 'Claim Your Starter Vehicle',
            desc: 'Register your verified driver profile to instantly unlock the Apex Pulse GT along with 1,000 CR starting bonus in your garage.',
            badge: 'Garage Unlocked',
        },
        {
            num: '02',
            icon: Wrench,
            title: 'Tune Performance & Liveries',
            desc: 'Upgrade ECU chips, forced induction twin-turbos, racing slicks, and nitrous oxide bottles. Apply custom neon and carbon fiber skins in the tuning bay.',
            badge: 'Tuning Bay',
        },
        {
            num: '03',
            icon: Flag,
            title: 'Compete in Real-Time Races',
            desc: 'Enter the Race Lobby, select a championship circuit (Urban GP, Drift Canyon, Expressway Sprint), and battle AI drivers using arrow keys / WASD controls and nitro boosts.',
            badge: '60 FPS Physics',
        },
        {
            num: '04',
            icon: ShoppingBag,
            title: 'Earn Credits & Expand Fleet',
            desc: 'Finish on the podium to win currency payouts and XP. Level up your license to unlock higher tier hypercars and muscle beasts in the Car Showroom.',
            badge: 'Championship Rewards',
        },
        {
            num: '05',
            icon: CreditCard,
            title: 'Instant Top-Ups & Invoices',
            desc: 'Need faster upgrades? Choose a top-up credit bundle. Receive automated PDF tax invoices and immediate wallet crediting via secure checkout.',
            badge: 'Automated Invoicing',
        },
    ];

    return (
        <PublicLayout>
            <div className="max-w-5xl mx-auto px-4 py-16">
                
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        Driver Guide & Gameplay Mechanics
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white">
                        How <span className="text-cyan-400">It Works</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-base leading-relaxed">
                        From garage tuning to podium finishes: follow our streamlined progression system to dominate the global leaderboard.
                    </p>
                </div>

                {/* Steps Timeline */}
                <div className="space-y-6 mb-16">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.num}
                                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all group"
                            >
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="font-orbitron font-black text-3xl sm:text-4xl text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                                        {step.num}
                                    </span>
                                    <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-orbitron font-bold text-lg text-white">
                                            {step.title}
                                        </h3>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                                            {step.badge}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls Cheat-Sheet */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 mb-16">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                        <Flag className="w-5 h-5 text-cyan-400" />
                        In-Game Driver Controls
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="font-orbitron font-bold text-cyan-400 text-lg">W / &uarr;</div>
                            <div className="text-xs text-slate-400 mt-1">Accelerate</div>
                        </div>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="font-orbitron font-bold text-cyan-400 text-lg">S / &darr;</div>
                            <div className="text-xs text-slate-400 mt-1">Brake / Reverse</div>
                        </div>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="font-orbitron font-bold text-cyan-400 text-lg">A &bull; D / &larr; &bull; &rarr;</div>
                            <div className="text-xs text-slate-400 mt-1">Steering / Drift</div>
                        </div>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="font-orbitron font-bold text-orange-400 text-lg">SPACE / SHIFT</div>
                            <div className="text-xs text-slate-400 mt-1">Nitrous Boost</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-orbitron font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                    >
                        Enter The Championship Now
                    </Link>
                </div>

            </div>
        </PublicLayout>
    );
}
