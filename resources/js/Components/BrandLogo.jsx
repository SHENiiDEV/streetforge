import React from 'react';
import { Link } from '@inertiajs/react';

export default function BrandLogo({ 
    size = 'md', 
    showSubtitle = true, 
    showText = true, 
    linkTo = '/', 
    className = '',
    animated = true
}) {
    const sizeMap = {
        sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[8px]', gap: 'gap-2' },
        md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[9px]', gap: 'gap-2.5' },
        lg: { icon: 'w-11 h-11', text: 'text-xl', sub: 'text-[10px]', gap: 'gap-3' },
        xl: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-xs', gap: 'gap-3.5' },
    };

    const currentSize = sizeMap[size] || sizeMap.md;

    const LogoContent = (
        <div className={`inline-flex items-center ${currentSize.gap} group select-none whitespace-nowrap shrink-0 ${className}`}>
            {/* Aerodynamic SF Forge Emblem */}
            <div className={`relative ${currentSize.icon} shrink-0 transition-transform duration-300 ${animated ? 'group-hover:scale-105' : ''}`}>
                {/* Outer Glow Halo */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/40 via-sky-500/20 to-blue-600/40 blur-md group-hover:blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300" />
                
                {/* SVG Shield / Turbine Icon */}
                <svg 
                    viewBox="0 0 48 48" 
                    className="relative w-full h-full drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="emblemBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#0f172a" />
                            <stop offset="50%" stopColor="#090d16" />
                            <stop offset="100%" stopColor="#020617" />
                        </linearGradient>

                        <linearGradient id="emblemBorder" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>

                        <linearGradient id="emblemCyan" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>

                        <linearGradient id="nitroSpark" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                    </defs>

                    {/* Outer Hexagon / Shield Container */}
                    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#emblemBg)" />
                    <rect x="2" y="2" width="44" height="44" rx="12" stroke="url(#emblemBorder)" strokeWidth="1.5" />

                    {/* Inner Dynamic Speed Slanted Wings (SF monogram geometry) */}
                    <path d="M12 16 L21 8 L25 12 L18 18 L27 25 L24 32 L13 24 Z" fill="url(#emblemCyan)" />
                    <path d="M36 32 L27 40 L23 36 L30 30 L21 23 L24 16 L35 24 Z" fill="url(#emblemCyan)" />

                    {/* Central Supersonic Apex Diamond */}
                    <polygon points="24,13 32,21 24,29 16,21" fill="#ffffff" fillOpacity="0.95" />
                    <polygon points="24,17 28,21 24,25 20,21" fill="url(#nitroSpark)" />

                    {/* Speed Accents */}
                    <circle cx="10" cy="38" r="1.5" fill="#38bdf8" />
                    <circle cx="38" cy="10" r="1.5" fill="#f97316" />
                </svg>
            </div>

            {/* Typography */}
            {showText && (
                <div className="flex flex-col whitespace-nowrap leading-none">
                    <div className={`font-orbitron font-extrabold ${currentSize.text} tracking-wider text-white flex items-center leading-none`}>
                        <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">STREET</span>
                        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent ml-1 font-black drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            FORGE
                        </span>
                    </div>
                    {showSubtitle && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                            <span className={`font-mono uppercase tracking-widest text-slate-400 font-semibold ${currentSize.sub}`}>
                                Dyno &bull; Motorsport
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (linkTo) {
        return (
            <Link href={linkTo} className="focus:outline-none shrink-0 inline-flex">
                {LogoContent}
            </Link>
        );
    }

    return LogoContent;
}
