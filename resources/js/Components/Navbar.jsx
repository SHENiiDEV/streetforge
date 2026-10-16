import { t, locale } from '../localization';
import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Flag, Warehouse, ShoppingBag, CreditCard, Trophy, Newspaper,
    LogOut, Menu, X, Plus, Zap, Shield, ChevronDown, FileText,
    HelpCircle, ArrowRight,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import SitePreferences from './SitePreferences';

function usePathname() {
    const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
    const { url } = usePage();
    useEffect(() => {
        if (typeof window !== 'undefined') setPath(window.location.pathname);
    }, [url]);
    return path;
}

function useScrollProgress() {
    const [state, setState] = useState({ progress: 0, scrolled: false });
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            setState({
                progress: h > 0 ? Math.min(1, window.scrollY / h) : 0,
                scrolled: window.scrollY > 12,
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return state;
}

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const dropdownRef = useRef(null);
    const pathname = usePathname();
    const { progress, scrolled } = useScrollProgress();

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileOpen]);

    useEffect(() => {
        const onClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        setUserOpen(false);
        setMobileOpen(false);
        router.post('/logout');
    };

    const authNavLinks = [
        { name: 'Race', href: '/race/lobby', icon: Flag, pulse: true },
        { name: 'Garage', href: '/garage', icon: Warehouse },
        { name: 'Showroom', href: '/shop', icon: ShoppingBag },
        { name: 'Standings', href: '/leaderboard', icon: Trophy },
        { name: 'Paddock', href: '/news', icon: Newspaper },
    ];

    const guestNavLinks = [
        { name: 'Circuits', href: '/race/lobby', icon: Flag },
        { name: 'Showroom', href: '/shop', icon: ShoppingBag },
        { name: 'Standings', href: '/leaderboard', icon: Trophy },
        { name: 'Paddock', href: '/news', icon: Newspaper },
        { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
    ];

    const activeLinks = user ? authNavLinks : guestNavLinks;
    const isActive = (href) => pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <header className="sticky top-0 z-50 w-full select-none">
            <SitePreferences />
            {/* Scroll progress */}
            <div className="absolute top-0 left-0 h-px w-full bg-white/[0.06]">
                <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-[width] duration-150 ease-out"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            <nav
                className={`border-b transition-all duration-300 ${
                    scrolled
                        ? 'bg-carbon-950/92 backdrop-blur-xl border-white/[0.08] shadow-[0_14px_40px_-24px_rgba(0,0,0,1)]'
                        : 'bg-carbon-950/70 backdrop-blur-md border-white/[0.05]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">

                        {/* Brand + desktop links */}
                        <div className="flex items-center gap-7 min-w-0">
                            <BrandLogo size="md" />

                            <div className="hidden lg:flex items-stretch h-[4.5rem]">
                                {activeLinks.map((link) => {
                                    const active = isActive(link.href);
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`relative flex items-center gap-2 px-4 label-tech transition-colors duration-200 ${
                                                active ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                                            }`}
                                        >
                                            <link.icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : ''}`} />
                                            <span>{t(link.name)}</span>
                                            {link.pulse && !active && (
                                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                            )}
                                            <span
                                                className={`absolute bottom-0 left-3 right-3 h-[2px] bg-cyan-400 transition-transform duration-300 origin-left ${
                                                    active ? 'scale-x-100' : 'scale-x-0'
                                                }`}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="hidden md:flex items-center gap-3 shrink-0">
                            {user ? (
                                <>
                                    <Link
                                        href="/topup"
                                        title={t("Top up credits")}
                                        className="group flex items-center gap-3 border border-white/[0.08] hover:border-cyan-400/40 px-3.5 py-2 transition-colors"
                                    >
                                        <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                                        <span className="text-left leading-none">
                                            <span className="block label-tech text-slate-600 mb-1">{t("Balance")}</span>
                                            <span className="numeric text-sm font-bold text-white">
                                                {t(Number(user.game_balance).toLocaleString(locale()))}
                                                <span className="text-[10px] text-slate-600 ml-1">{t("CR")}</span>
                                            </span>
                                        </span>
                                        <Plus className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                    </Link>

                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setUserOpen(!userOpen)}
                                            className="flex items-center gap-2.5 p-1.5 pr-3 border border-white/[0.08] hover:border-white/20 transition-colors focus:outline-none"
                                        >
                                            <span
                                                className="w-8 h-8 flex items-center justify-center text-white font-display font-bold text-sm"
                                                style={{ backgroundColor: user.avatar_color || '#06b6d4' }}
                                            >
                                                {t(user.name ? user.name[0].toUpperCase() : 'R')}
                                            </span>
                                            <span className="hidden xl:block text-left leading-none">
                                                <span className="block text-xs font-semibold text-slate-200 truncate max-w-[92px]">{user.name}</span>
                                                <span className="block label-tech text-cyan-400 mt-1">{t("LVL ")}{t(user.level)}</span>
                                            </span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${userOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                                        </button>

                                        {userOpen && (
                                            <div className="absolute right-0 mt-2 w-64 surface-raised p-2 z-50">
                                                <div className="p-3.5 border border-white/[0.06] bg-carbon-900/60 space-y-2">
                                                    <div className="font-display font-bold uppercase tracking-wide text-sm text-white truncate">
                                                        {user.name} {user.surname}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                                                        <span className="label-tech text-slate-600">{t("Licence")}</span>
                                                        <span className="label-tech text-cyan-400">
                                                            {t(user.level >= 10 ? 'Class A' : 'Class B')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="py-1.5">
                                                    {[
                                                        { href: '/garage', icon: Warehouse, label: 'Garage & Tuning', tone: 'text-cyan-400' },
                                                        { href: '/topup', icon: FileText, label: 'Top-Up & Invoices', tone: 'text-cyan-400' },
                                                        { href: '/leaderboard', icon: Trophy, label: 'Seasonal Standings', tone: 'text-amber-400' },
                                                        { href: '/news', icon: Newspaper, label: 'Paddock Wire', tone: 'text-cyan-400' },
                                                    ].map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setUserOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                                                        >
                                                            <item.icon className={`w-4 h-4 ${item.tone}`} />
                                                            {t(item.label)}
                                                        </Link>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 border-t border-white/[0.06] transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />{t("Sign Out ")}</button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="px-4 py-2.5 label-tech text-slate-400 hover:text-white transition-colors">{t("Sign In ")}</Link>
                                    <Link
                                        href="/register"
                                        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-xs hover:bg-cyan-300 transition-colors"
                                    >{t("Start Racing ")}<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile */}
                        <div className="flex lg:hidden items-center gap-2 shrink-0">
                            {user && (
                                <Link
                                    href="/topup"
                                    className="flex items-center gap-1.5 border border-white/[0.08] px-2.5 py-1.5 numeric text-xs font-bold text-cyan-300"
                                >
                                    <Zap className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                                    {t(Number(user.game_balance).toLocaleString(locale()))}
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label={t("Toggle navigation")}
                                className="p-2.5 border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 transition-colors"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[104px] bottom-0 z-50 bg-carbon-950/97 backdrop-blur-2xl overflow-y-auto border-t border-white/[0.06]">
                    <div className="max-w-lg mx-auto px-5 py-7 space-y-7">

                        {user ? (
                            <div className="surface p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-11 h-11 flex items-center justify-center text-white font-display font-bold text-lg"
                                        style={{ backgroundColor: user.avatar_color || '#06b6d4' }}
                                    >
                                        {t(user.name ? user.name[0].toUpperCase() : 'R')}
                                    </span>
                                    <div>
                                        <div className="font-display font-bold uppercase tracking-wide text-sm text-white truncate max-w-[140px]">
                                            {user.name} {user.surname}
                                        </div>
                                        <div className="label-tech text-cyan-400 mt-1">{t("Level ")}{t(user.level)}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="label-tech text-slate-600 mb-1">{t("Credits")}</div>
                                    <div className="numeric text-base font-bold text-white">
                                        {t(Number(user.game_balance).toLocaleString(locale()))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="surface p-5 space-y-4">
                                <div>
                                    <div className="font-display font-bold uppercase tracking-wide text-base text-white">{t("Join the Season ’26 grid ")}</div>
                                    <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t("Free starter car and 1,000 CR the moment you sign up. ")}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="py-3 text-center label-tech text-carbon-950 bg-white hover:bg-cyan-300 transition-colors"
                                    >{t("Create Account ")}</Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="py-3 text-center label-tech text-slate-200 border border-white/15"
                                    >{t("Sign In ")}</Link>
                                </div>
                            </div>
                        )}

                        <Link
                            href="/race/lobby"
                            onClick={() => setMobileOpen(false)}
                            className="w-full flex items-center justify-between p-5 bg-white text-carbon-950 font-display font-bold uppercase tracking-wider text-sm"
                        >
                            <span className="flex items-center gap-2.5">
                                <Flag className="w-5 h-5" />{t("Enter Race Circuit ")}</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <div className="space-y-3">
                            <div className="label-tech text-slate-600">{t("Navigation")}</div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Race Lobby', href: '/race/lobby', icon: Flag },
                                    { name: 'Garage & Dyno', href: '/garage', icon: Warehouse },
                                    { name: 'Showroom', href: '/shop', icon: ShoppingBag },
                                    { name: 'Top-Up Credits', href: '/topup', icon: CreditCard, highlight: true },
                                    { name: 'Standings', href: '/leaderboard', icon: Trophy },
                                    { name: 'Paddock Wire', href: '/news', icon: Newspaper },
                                    { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
                                    { name: 'About Studio', href: '/about', icon: Shield },
                                ].map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 p-4 label-tech border transition-colors ${
                                                active
                                                    ? 'text-cyan-300 border-cyan-400/30 bg-cyan-400/[0.06]'
                                                    : item.highlight
                                                    ? 'text-cyan-300 border-white/[0.08]'
                                                    : 'text-slate-400 border-white/[0.06]'
                                            }`}
                                        >
                                            <item.icon className={`w-4 h-4 ${active || item.highlight ? 'text-cyan-400' : 'text-slate-600'}`} />
                                            <span className="truncate">{t(item.name)}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-5 border-t border-white/[0.06] space-y-5">
                            <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                                {[
                                    ['Terms', '/terms'],
                                    ['Privacy', '/privacy'],
                                    ['Payments', '/payment-security'],
                                    ['Refunds', '/refund-policy'],
                                    ['Contact', '/contact'],
                                    ['FAQ', '/faq'],
                                    ['Legal Centre', '/legal'],
                                ].map(([label, href]) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        className="label-tech text-slate-600 hover:text-cyan-400 transition-colors"
                                    >
                                        {t(label)}
                                    </Link>
                                ))}
                            </div>

                            {user && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 label-tech text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />{t("Sign Out ")}</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
