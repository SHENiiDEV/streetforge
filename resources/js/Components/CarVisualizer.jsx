import React from 'react';

export default function CarVisualizer({ 
    vehicle, 
    skin, 
    size = 'large', 
    animated = true,
    showUnderglow = true 
}) {
    const primaryColor = skin?.color_hex || vehicle?.primary_color || '#06b6d4';
    const secondaryColor = skin?.secondary_color_hex || '#0f172a';
    const glowColor = skin?.glow_color || primaryColor;

    const sizeClasses = {
        small: 'w-36 h-20',
        medium: 'w-56 h-28',
        large: 'w-full max-w-md h-52',
        xlarge: 'w-full max-w-lg h-64',
    };

    return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size] || sizeClasses.large} mx-auto select-none`}>
            {/* Ambient Underglow Light */}
            {showUnderglow && (
                <div 
                    className={`absolute bottom-4 w-3/4 h-8 rounded-full blur-xl opacity-75 transition-all duration-700 ${animated ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: glowColor }}
                />
            )}

            {/* SVG Stylized Cyber Racer Profile */}
            <svg
                viewBox="0 0 400 160"
                className="w-full h-full drop-shadow-2xl overflow-visible relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id={`carGrad-${primaryColor}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={primaryColor} />
                        <stop offset="100%" stopColor={secondaryColor} />
                    </linearGradient>
                    <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Ground Shadow */}
                <ellipse cx="200" cy="148" rx="160" ry="10" fill="#000000" fillOpacity="0.6" />

                {/* Vehicle Chassis Body */}
                <path
                    d="M 40 120 L 70 120 L 85 95 L 140 75 L 260 75 L 320 100 L 370 110 L 375 125 L 340 125 C 335 110 305 110 300 125 L 130 125 C 125 110 95 110 90 125 L 40 125 Z"
                    fill={`url(#carGrad-${primaryColor})`}
                    stroke="#ffffff"
                    strokeOpacity="0.2"
                    strokeWidth="1.5"
                />

                {/* Cabin / Windshield Glass */}
                <path
                    d="M 148 78 L 245 78 L 285 98 L 125 98 Z"
                    fill="url(#glassGrad)"
                    stroke="#38bdf8"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                />

                {/* Cockpit Pillar */}
                <path d="M 200 78 L 205 98" stroke="#0f172a" strokeWidth="4" />

                {/* Aerodynamic Side Skirts & Livery Decals */}
                <path
                    d="M 135 110 L 290 110 L 275 118 L 145 118 Z"
                    fill={secondaryColor}
                    opacity="0.9"
                />

                {/* Race Livery Stripe */}
                <path
                    d="M 90 102 L 350 108"
                    stroke={glowColor}
                    strokeWidth="3"
                    filter="url(#neonGlow)"
                    opacity="0.85"
                />

                {/* Rear Spoiler / Wing */}
                <path
                    d="M 38 90 L 60 90 L 52 108 L 44 108 Z"
                    fill="#0f172a"
                    stroke={primaryColor}
                    strokeWidth="1.5"
                />
                <rect x="30" y="86" width="35" height="5" rx="2" fill={primaryColor} />

                {/* Front Headlight LED Beam */}
                <polygon
                    points="368,112 376,118 360,118"
                    fill="#ffffff"
                    filter="url(#neonGlow)"
                />
                <circle cx="368" cy="115" r="3" fill="#ffffff" />

                {/* Rear Taillight Strip */}
                <rect x="42" y="112" width="6" height="8" rx="2" fill="#ef4444" filter="url(#neonGlow)" />

                {/* Wheel 1 (Rear) */}
                <g transform="translate(110, 125)">
                    <circle cx="0" cy="0" r="22" fill="#090d16" stroke="#334155" strokeWidth="2" />
                    <circle cx="0" cy="0" r="14" fill="#1e293b" />
                    {/* Alloy Rim Spokes */}
                    <circle cx="0" cy="0" r="7" fill={primaryColor} />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                </g>

                {/* Wheel 2 (Front) */}
                <g transform="translate(320, 125)">
                    <circle cx="0" cy="0" r="22" fill="#090d16" stroke="#334155" strokeWidth="2" />
                    <circle cx="0" cy="0" r="14" fill="#1e293b" />
                    {/* Alloy Rim Spokes */}
                    <circle cx="0" cy="0" r="7" fill={primaryColor} />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                </g>

                {/* Exhaust Flame / Nitro Jet */}
                {animated && (
                    <polygon
                        points="35,122 15,125 35,128"
                        fill="#38bdf8"
                        filter="url(#neonGlow)"
                        className="animate-pulse"
                    />
                )}
            </svg>
        </div>
    );
}
