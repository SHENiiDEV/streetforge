import React, { useId } from 'react';

/**
 * Side-profile render of a mid-engine race machine.
 * Colour comes from the applied skin, falling back to the vehicle's own livery.
 */
export default function CarVisualizer({
    vehicle,
    skin,
    size = 'large',
    animated = true,
    showUnderglow = true,
}) {
    const uid = useId().replace(/:/g, '');
    const primary = skin?.color_hex || vehicle?.primary_color || '#06b6d4';
    const secondary = skin?.secondary_color_hex || '#0b0d12';
    const glow = skin?.glow_color || primary;

    const sizeClasses = {
        small: 'w-40 h-[4.5rem]',
        medium: 'w-full max-w-[16rem] h-[6.5rem]',
        large: 'w-full max-w-lg h-48',
        xlarge: 'w-full max-w-xl h-56',
    };

    const BODY =
        'M 56 158 L 56 124 C 58 110 68 103 90 100 L 150 92 L 206 62 ' +
        'C 216 56 232 52 252 52 L 282 52 C 300 52 312 58 320 70 L 344 100 ' +
        'L 404 108 C 430 112 446 122 448 134 L 448 152 C 448 156 446 158 442 158 Z';

    const Wheel = ({ cx, cy, r }) => (
        <g>
            {/* Tyre */}
            <circle cx={cx} cy={cy} r={r} fill="#08090c" stroke="#1c2029" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke="#14171d" strokeWidth="4" />

            {/* Rim assembly */}
            <g
                className={animated ? 'animate-wheel' : undefined}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
                <circle cx={cx} cy={cy} r={r - 9} fill={`url(#${uid}-rim)`} />
                {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i * Math.PI * 2) / 8;
                    return (
                        <line
                            key={i}
                            x1={cx + Math.cos(a) * 3}
                            y1={cy + Math.sin(a) * 3}
                            x2={cx + Math.cos(a) * (r - 10)}
                            y2={cy + Math.sin(a) * (r - 10)}
                            stroke="#5a6272"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    );
                })}
                {/* Brake disc hint */}
                <circle cx={cx} cy={cy} r={r - 13} fill="none" stroke="#2a2f3a" strokeWidth="3" />
            </g>

            {/* Caliper */}
            <rect x={cx - 3} y={cy - r + 9} width="6" height="9" rx="2" fill={glow} opacity="0.85" />
            {/* Hub */}
            <circle cx={cx} cy={cy} r="3.5" fill="#e2e8f0" />
        </g>
    );

    return (
        <div className={`relative flex items-center justify-center mx-auto select-none ${sizeClasses[size] || sizeClasses.large}`}>
            {/* Ambient underglow */}
            {showUnderglow && (
                <div
                    className={`absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[70%] h-6 rounded-full blur-2xl opacity-55 ${animated ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: glow }}
                />
            )}

            <svg
                viewBox="0 0 500 200"
                className={`relative z-10 w-full h-full overflow-visible ${animated ? 'animate-float-slow' : ''}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id={`${uid}-body`} x1="60" y1="52" x2="420" y2="158" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={primary} stopOpacity="0.95" />
                        <stop offset="45%" stopColor={primary} />
                        <stop offset="100%" stopColor={secondary} />
                    </linearGradient>

                    <linearGradient id={`${uid}-top`} x1="0" y1="52" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
                        <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id={`${uid}-glass`} x1="0" y1="50" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.45" />
                        <stop offset="55%" stopColor="#1e293b" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
                    </linearGradient>

                    <radialGradient id={`${uid}-rim`}>
                        <stop offset="0%" stopColor="#8b93a3" />
                        <stop offset="70%" stopColor="#3c434f" />
                        <stop offset="100%" stopColor="#20242d" />
                    </radialGradient>

                    <radialGradient id={`${uid}-shadow`}>
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>

                    <filter id={`${uid}-lamp`} x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="3.5" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Contact shadow */}
                <ellipse cx="252" cy="181" rx="200" ry="11" fill={`url(#${uid}-shadow)`} />
                <ellipse cx="252" cy="179" rx="120" ry="4" fill="#000" opacity="0.55" />

                {/* Rear wing */}
                <g>
                    <path d="M 68 86 L 134 80 L 134 86 L 68 92 Z" fill="#0a0c11" stroke={primary} strokeOpacity="0.45" strokeWidth="1" />
                    <rect x="82" y="90" width="3.5" height="10" fill="#0a0c11" />
                    <rect x="120" y="86" width="3.5" height="10" fill="#0a0c11" />
                </g>

                {/* Body */}
                <path d={BODY} fill={`url(#${uid}-body)`} />
                <path d={BODY} fill={`url(#${uid}-top)`} />
                <path d={BODY} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.25" />

                {/* Shoulder crease */}
                <path
                    d="M 96 103 C 180 98 300 100 402 110"
                    stroke="#ffffff"
                    strokeOpacity="0.22"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />

                {/* Lower body / side skirt */}
                <path d="M 118 142 L 392 146 L 386 158 L 124 158 Z" fill="#05060a" opacity="0.8" />

                {/* Livery stripe */}
                <path
                    d="M 104 128 L 420 134"
                    stroke={glow}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.75"
                    filter={`url(#${uid}-lamp)`}
                />

                {/* Glasshouse */}
                <path
                    d="M 218 68 C 228 60 242 56 256 56 L 280 56 C 296 56 306 61 313 71 L 334 97 L 232 88 Z"
                    fill={`url(#${uid}-glass)`}
                    stroke="#93c5fd"
                    strokeOpacity="0.28"
                    strokeWidth="1"
                />
                {/* Reflection streak on glass */}
                <path d="M 238 78 L 292 62" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
                {/* B-pillar */}
                <path d="M 266 56 L 276 90" stroke="#05060a" strokeWidth="4" opacity="0.9" />

                {/* Side intake */}
                <path d="M 176 104 L 212 100 L 208 118 L 172 120 Z" fill="#05060a" opacity="0.75" />
                <path d="M 180 108 L 206 105" stroke={glow} strokeOpacity="0.5" strokeWidth="1.5" />

                {/* Door handle */}
                <rect x="296" y="106" width="14" height="3" rx="1.5" fill="#ffffff" opacity="0.3" />

                {/* Wheel arches */}
                <path d="M 104 150 A 38 38 0 0 1 180 150" stroke="#05060a" strokeWidth="5" opacity="0.75" fill="none" />
                <path d="M 330 150 A 38 38 0 0 1 406 150" stroke="#05060a" strokeWidth="5" opacity="0.75" fill="none" />

                {/* Front splitter */}
                <path d="M 428 158 L 470 160 L 470 166 L 422 163 Z" fill="#05060a" />

                {/* Rear diffuser fins */}
                <g fill="#05060a">
                    <rect x="58" y="146" width="4" height="14" />
                    <rect x="70" y="148" width="4" height="12" />
                    <rect x="82" y="150" width="4" height="10" />
                </g>

                {/* Headlight */}
                <path d="M 408 112 L 442 122 L 440 129 L 406 120 Z" fill="#f8fafc" filter={`url(#${uid}-lamp)`} />
                <path d="M 412 116 L 436 124" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />

                {/* Tail light bar */}
                <rect x="58" y="113" width="16" height="4" rx="2" fill="#f43f5e" opacity="0.9" filter={`url(#${uid}-lamp)`} />

                {/* Exhaust glow */}
                {animated && (
                    <ellipse cx="60" cy="143" rx="8" ry="3" fill={glow} opacity="0.55" filter={`url(#${uid}-lamp)`} className="animate-pulse" />
                )}

                <Wheel cx={142} cy={150} r={30} />
                <Wheel cx={368} cy={150} r={30} />
            </svg>
        </div>
    );
}
