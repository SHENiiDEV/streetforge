import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Flag, 
    Warehouse, 
    ShoppingBag, 
    Trophy, 
    Newspaper, 
    Zap,
    HelpCircle,
    User as UserIcon,
    CreditCard
} from 'lucide-react';

export default function MobileBottomNav() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const navItems = [
        { 
            name: 'Race', 
            href: '/race/lobby', 
            icon: Flag, 
            pulse: true 
        },
        { 
            name: user ? 'Garage' : 'Guide', 
            href: user ? '/garage' : '/how-it-works', 
            icon: user ? Warehouse : HelpCircle 
        },
        { 
            name: 'Showroom', 
            href: '/shop', 
            icon: ShoppingBag 
        },
        { 
            name: 'Leaderboard', 
            href: '/leaderboard', 
            icon: Trophy 
        },
        { 
            name: 'News', 
            href: '/news', 
            icon: Newspaper 
        },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-950/92 backdrop-blur-2xl border-t border-slate-800/80 shadow-[0_-8px_32px_rgba(0,0,0,0.85)] px-2 py-1.5 safe-area-bottom">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 group min-w-[58px] ${
                                isActive
                                    ? 'text-cyan-300'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {/* Icon with Active Glow Background */}
                            <div className={`relative p-1 rounded-xl transition-all duration-200 ${
                                isActive 
                                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] scale-110' 
                                    : 'group-hover:scale-105'
                            }`}>
                                <Icon className="w-5 h-5" />

                                {/* Micro Pulse Badge for Live Events */}
                                {item.pulse && !isActive && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                )}
                            </div>

                            {/* Label */}
                            <span className={`text-[10px] font-sans tracking-tight mt-1 leading-none ${
                                isActive ? 'font-bold text-cyan-300' : 'font-medium text-slate-400'
                            }`}>
                                {item.name}
                            </span>

                            {/* Active Micro-Indicator Dot */}
                            {isActive && (
                                <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
