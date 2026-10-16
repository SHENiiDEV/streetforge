import { t } from '../localization';
import React from 'react';

export default function StatBar({ label, value, max = 350, unit = '', color = 'cyan', icon: Icon }) {
    const percentage = Math.min(100, Math.round((value / max) * 100));

    const colorClasses = {
        cyan: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]',
        orange: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]',
        purple: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]',
        emerald: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]',
        red: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]',
    };

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 font-medium uppercase tracking-wider">
                    {Icon && <Icon className="w-3.5 h-3.5 text-slate-300" />}
                    {t(label)}
                </span>
                <span className="font-orbitron font-bold text-slate-200">
                    {t(value)} <span className="text-slate-500 text-[10px] font-normal">{t(unit)}</span>
                </span>
            </div>
            <div className="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color] || colorClasses.cyan}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
