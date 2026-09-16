import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Flag, 
    Warehouse, 
    ShoppingBag, 
    CreditCard, 
    Trophy, 
    Newspaper, 
    LogOut, 
    User as UserIcon, 
    Menu, 
    X,
    PlusCircle,
    Zap,
    Shield,
    ChevronDown,
    FileText,
    HelpCircle,
    Sparkles,
    Flame,
    ArrowRight,
    Wrench,
    ExternalLink
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar() {
    const { auth, company } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileOpen]);

    // Close user dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        setUserDropdownOpen(false);
        setMobileOpen(false);
        router.post('/logout');
    };

    // Authenticated Navigation Items
    const authNavLinks = [
        { name: 'Race Lobby', href: '/race/lobby', icon: Flag, pulse: true },
        { name: 'Garage', href: '/garage', icon: Warehouse },
        { name: 'Showroom', href: '/shop', icon: ShoppingBag },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'News', href: '/news', icon: Newspaper },
    ];

    // Guest Navigation Items
    const guestNavLinks = [
        { name: 'Race Lobby', href: '/race/lobby', icon: Flag },
        { name: 'Showroom', href: '/shop', icon: ShoppingBag },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'News', href: '/news', icon: Newspaper },
        { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
    ];

    const activeLinks = user ? authNavLinks : guestNavLinks;

    return (
        <header className="sticky top-0 z-50 w-full select-none">
            {/* Top Glowing Micro-Border */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />

            {/* Main Navigation Bar */}
            <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-18">
                        
                        {/* Left: Brand Logo & Desktop Nav Links */}
                        <div className="flex items-center gap-4 xl:gap-6 min-w-0">
                            <BrandLogo size="md" />

                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-800/80">
                                {activeLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = window.location.pathname.startsWith(link.href);
                                    
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 group ${
                                                isActive
                                                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                                isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                                            }`} />
                                            <span>{link.name}</span>
                                            
                                            {/* Subtle Active Status Dot */}
                                            {isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4] shrink-0" />
                                            )}

                                            {link.pulse && !isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Area: Balance Chip, User Profile, or Auth CTA */}
                        <div className="hidden md:flex items-center gap-3 shrink-0">
                            {user ? (
                                <>
                                    {/* Top-Up Credits Pill Button */}
                                    <Link
                                        href="/topup"
                                        className="relative group flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-400/80 px-3.5 py-1.5 rounded-xl transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.08)] hover:shadow-[0_0_18px_rgba(6,182,212,0.2)] whitespace-nowrap"
                                        title="Purchase Credits & Invoices"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:rotate-12 transition-transform shrink-0">
                                            <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 leading-none">
                                                Balance
                                            </div>
                                            <div className="font-orbitron font-extrabold text-xs text-cyan-300 leading-tight flex items-baseline gap-1">
                                                {Number(user.game_balance).toLocaleString()}
                                                <span className="text-[9px] text-slate-400 font-bold font-mono">CR</span>
                                            </div>
                                        </div>
                                        <PlusCircle className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors ml-0.5 shrink-0" />
                                    </Link>

                                    {/* User Profile Pill Dropdown */}
                                    <div className="relative shrink-0" ref={dropdownRef}>
                                        <button
                                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all group text-left focus:outline-none whitespace-nowrap"
                                        >
                                            <div 
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-orbitron font-bold text-xs shadow-md border border-white/20 shrink-0"
                                                style={{ backgroundColor: user.avatar_color || '#06b6d4' }}
                                            >
                                                {user.name ? user.name[0].toUpperCase() : 'R'}
                                            </div>

                                            <div className="hidden lg:block text-left">
                                                <div className="text-xs font-bold text-slate-200 leading-tight group-hover:text-white truncate max-w-[100px]">
                                                    {user.name}
                                                </div>
                                                <div className="text-[10px] font-orbitron font-extrabold text-cyan-400 leading-none mt-0.5">
                                                    LVL {user.level}
                                                </div>
                                            </div>

                                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${userDropdownOpen ? 'transform rotate-180 text-cyan-400' : ''}`} />
                                        </button>

                                        {/* Profile Dropdown Menu */}
                                        {userDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 space-y-1 z-50 backdrop-blur-2xl">
                                                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-850 space-y-1">
                                                    <div className="font-bold text-sm text-white truncate">
                                                        {user.name} {user.surname}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono truncate">
                                                        {user.email}
                                                    </div>
                                                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800 mt-2">
                                                        <span className="text-slate-400">Driver License:</span>
                                                        <span className="font-orbitron font-bold text-cyan-400">
                                                            {user.level >= 10 ? 'Class A (Pro)' : 'Class B (Semi)'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        href="/garage"
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                                    >
                                                        <Warehouse className="w-4 h-4 text-cyan-400 shrink-0" />
                                                        <span>Garage & Vehicle Tuning</span>
                                                    </Link>
                                                    <Link
                                                        href="/topup"
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                                                        <span>Top-Up & Invoices</span>
                                                    </Link>
                                                    <Link
                                                        href="/leaderboard"
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                                    >
                                                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                                                        <span>Seasonal Leaderboard</span>
                                                    </Link>
                                                    <Link
                                                        href="/news"
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                                    >
                                                        <Newspaper className="w-4 h-4 text-cyan-400 shrink-0" />
                                                        <span>Motorsport News</span>
                                                    </Link>
                                                </div>

                                                <div className="pt-1 border-t border-slate-850">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4 text-red-400 shrink-0" />
                                                        <span>Sign Out Account</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Guest CTA Buttons */
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href="/login"
                                        className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white whitespace-nowrap transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                        <span>Create Account</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Right: Balance Badge + Menu Hamburger */}
                        <div className="flex lg:hidden items-center gap-2 shrink-0">
                            {user && (
                                <Link
                                    href="/topup"
                                    className="flex items-center gap-1 bg-slate-900 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-xs font-orbitron font-bold text-cyan-400 shadow-sm whitespace-nowrap"
                                >
                                    <Zap className="w-3 h-3 fill-cyan-400 shrink-0" />
                                    <span>{Number(user.game_balance).toLocaleString()} CR</span>
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors focus:outline-none"
                                aria-label="Toggle Navigation Menu"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer / Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[66px] bottom-0 z-50 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto border-t border-slate-800">
                    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
                        
                        {/* Mobile User Header or Welcome CTA */}
                        {user ? (
                            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 rounded-2xl border border-cyan-500/30 shadow-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-orbitron font-bold text-base shadow-md border border-white/20 shrink-0"
                                        style={{ backgroundColor: user.avatar_color || '#06b6d4' }}
                                    >
                                        {user.name ? user.name[0].toUpperCase() : 'R'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-white truncate max-w-[150px]">{user.name} {user.surname}</div>
                                        <div className="text-xs text-cyan-400 font-orbitron font-bold mt-0.5">LVL {user.level} Driver</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Credits</div>
                                    <div className="font-orbitron font-extrabold text-sm text-cyan-300">
                                        {Number(user.game_balance).toLocaleString()} CR
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 rounded-2xl border border-cyan-500/30 space-y-3">
                                <div>
                                    <div className="font-orbitron font-bold text-sm text-white">Join StreetForge Championship</div>
                                    <div className="text-xs text-slate-300 mt-0.5">Unlock your complimentary sports car & 1,000 CR starting bonus.</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="py-2.5 text-center text-xs font-bold text-slate-950 bg-cyan-400 rounded-xl shadow-md"
                                    >
                                        Create Account
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="py-2.5 text-center text-xs font-semibold text-white bg-slate-800 rounded-xl border border-slate-700"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Primary Fast Race Action */}
                        <Link
                            href="/race/lobby"
                            onClick={() => setMobileOpen(false)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-orbitron font-black text-sm shadow-xl shadow-cyan-500/20"
                        >
                            <span className="flex items-center gap-2.5">
                                <Flag className="w-5 h-5 fill-slate-950" />
                                <span>ENTER RACE CIRCUIT</span>
                            </span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        {/* Navigation Grid */}
                        <div className="space-y-2">
                            <div className="text-[11px] font-orbitron font-bold uppercase tracking-wider text-slate-400 px-1">
                                Game Hub & Navigation
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                {[
                                    { name: 'Race Lobby', href: '/race/lobby', icon: Flag },
                                    { name: 'Garage & Dyno', href: '/garage', icon: Warehouse },
                                    { name: 'Vehicle Showroom', href: '/shop', icon: ShoppingBag },
                                    { name: 'Top-Up Credits', href: '/topup', icon: CreditCard, highlight: true },
                                    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
                                    { name: 'News & Patches', href: '/news', icon: Newspaper },
                                    { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
                                    { name: 'About Studio', href: '/about', icon: Shield },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isActive = window.location.pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-medium transition-all ${
                                                isActive
                                                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                                                    : item.highlight
                                                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/60 font-semibold'
                                                    : 'bg-slate-900/80 text-slate-200 border border-slate-800'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 ${isActive || item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                                            <span className="truncate">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legal & Compliance quick footer */}
                        <div className="pt-2 border-t border-slate-850 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
                                <Link href="/terms" onClick={() => setMobileOpen(false)} className="hover:text-cyan-400">Terms</Link>
                                <Link href="/privacy" onClick={() => setMobileOpen(false)} className="hover:text-cyan-400">Privacy</Link>
                                <Link href="/refund-policy" onClick={() => setMobileOpen(false)} className="hover:text-cyan-400">Refunds</Link>
                                <Link href="/aml-sanctions" onClick={() => setMobileOpen(false)} className="hover:text-cyan-400">Sanctions</Link>
                                <Link href="/faq" onClick={() => setMobileOpen(false)} className="hover:text-cyan-400">FAQ</Link>
                            </div>

                            {user && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/30 text-red-400 border border-red-900/40 text-xs font-semibold hover:bg-red-900/30 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out Driver Profile</span>
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </header>
    );
}
