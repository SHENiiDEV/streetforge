import React, { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    ChevronDown, 
    HelpCircle, 
    ShieldAlert, 
    FileText, 
    Zap, 
    Wrench, 
    CreditCard, 
    ShieldCheck,
    Gauge,
    Mail,
    Search
} from 'lucide-react';

export default function FAQ() {
    const { company } = usePage().props;
    const [openIndex, setOpenIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');

    const companyEmail = company?.email || 'support@streetforge.co.uk';

    const categories = [
        { id: 'all', label: 'All Questions' },
        { id: 'gameplay', label: 'Gameplay & Physics' },
        { id: 'garage', label: 'Tuning & Garage' },
        { id: 'billing', label: 'Billing & Invoices' },
        { id: 'compliance', label: 'Sanctions & Security' },
    ];

    const faqs = [
        {
            category: 'gameplay',
            q: 'How does the browser physics engine simulate vehicle telemetry?',
            a: 'StreetForge runs a custom 60 FPS deterministic physics model directly in the browser. It computes acceleration curves, tire friction coefficients, weight transfer under braking, aerodynamic downforce, and nitrous injection boost multipliers. Because it runs client-side with server-side validation hashes, you experience zero input latency regardless of connection ping.',
        },
        {
            category: 'gameplay',
            q: 'What controls are supported during races?',
            a: 'You can control your vehicle using standard keyboard keys: W or UP Arrow to accelerate, S or DOWN Arrow for braking/reverse, A / D or LEFT / RIGHT Arrows for steering and counter-steering during drifts, and SPACE or SHIFT to engage the pressurized nitrous oxide booster.',
        },
        {
            category: 'gameplay',
            q: 'How do leaderboard rankings and driver levels work?',
            a: 'Finishing podium positions in Grand Prix races awards driver XP and Credits. Every 250 XP earned advances your Driver Level. Higher license tiers grant access to elite supercars, rare liveries, and high-stakes championship brackets.',
        },
        {
            category: 'garage',
            q: 'Can I install multiple upgrade stages on a single vehicle?',
            a: 'Yes. StreetForge features a comprehensive 5-tier upgrade tree for every vehicle. You can upgrade Stage 1 through Stage 5 across four distinct systems: ECU Stage remapping (Top Speed), Twin Turbo Forced Induction (Acceleration), Sport Suspension & Aero Slicks (Handling), and High-Flow Nitrous Oxide Injection (Boost Duration & Multiplier).',
        },
        {
            category: 'garage',
            q: 'Can I customize vehicle paint and custom liveries?',
            a: 'Yes. The Garage workshop allows you to select custom Hex color finishes (Gloss, Matte, Metallic, Pearl) and install bespoke vinyl livery packages, including Neon Cyberpunk, Midnight Drift, and Formula Carbon.',
        },
        {
            category: 'billing',
            q: 'How do top-up credit purchases work?',
            a: 'Buy credits in the Top-Up section by credit or debit card. Top Values includes 2,750 CR for $25 and 15,000 CR for $100, with bonus credits included. You can also choose a custom quantity from 100 CR with no upper limit at $1 per 100 CR, without a bonus. Your balance updates after successful payment.',
        },
        {
            category: 'billing',
            q: 'Where do I find my official PDF Tax Invoices?',
            a: 'Every completed purchase automatically generates a pixel-perfect, VAT-compliant PDF invoice detailing company registration, transaction reference numbers, payment timestamps, and credit quantities. You can download these anytime from your Top-Up History dashboard or receive them via automated email.',
        },
        {
            category: 'billing',
            q: 'What payment methods are supported?',
            a: 'We accept all major Visa and Mastercard credit and debit cards, as well as digital wallets powered by Level 1 PCI-DSS certified payment gateways with 3D Secure 2.0 biometric verification.',
        },
        {
            category: 'billing',
            q: 'What is your refund and cancellation policy?',
            a: 'Under the UK Consumer Contracts Regulations 2013 and our Refund Policy, virtual digital currency that has been spent, partially used, or applied to car upgrades is non-refundable. However, unspent credit balances purchased within the last 14 days can be refunded upon request to our support desk.',
        },
        {
            category: 'compliance',
            q: 'Why are certain jurisdictions blocked from registering or purchasing?',
            a: 'In accordance with UK HM Treasury Sanctions Regulations, EU Restrictive Measures, and US OFAC guidelines, StreetForge strictly prohibits access, account creation, and financial transactions from comprehensively sanctioned territories (including Russia, Belarus, Iran, North Korea, Syria, Cuba, and occupied regions of Ukraine). Automated IP geo-fencing and identity checks enforce these compliance rules.',
        },
        {
            category: 'compliance',
            q: 'How is driver personal data protected?',
            a: 'StreetForge operates strictly in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. We do not sell player data to third parties. All sensitive database records are salted and hashed using bcrypt and industry standard AES-256 protocols.',
        },
        {
            category: 'compliance',
            q: 'Who operates the StreetForge platform?',
            a: 'StreetForge is owned and operated by StreetForge Ltd, a limited liability company incorporated in England and Wales under Company Registration Number 14829103, located at 128 City Road, London, EC1V 2NX, United Kingdom.',
        },
    ];

    const filteredFaqs = activeCategory === 'all'
        ? faqs
        : faqs.filter(f => f.category === activeCategory);

    return (
        <PublicLayout>
            <div className="max-w-5xl mx-auto px-4 py-16">
                
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        Driver Knowledge Base & Help Desk
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white">
                        Frequently Asked <span className="text-cyan-400">Questions</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-base leading-relaxed">
                        Find answers regarding gameplay mechanics, garage dyno tuning, payment processing, PDF invoices, and international sanctions compliance.
                    </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setOpenIndex(0);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all ${
                                activeCategory === cat.id
                                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 mb-16">
                    {filteredFaqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`border rounded-2xl transition-all overflow-hidden ${
                                    isOpen 
                                        ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5' 
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left font-orbitron font-bold text-slate-100 hover:text-cyan-400 transition-colors"
                                >
                                    <span className="flex items-center gap-3 text-sm sm:text-base pr-4">
                                        <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-cyan-400' : 'text-slate-500'}`} />
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                                            isOpen ? 'transform rotate-180 text-cyan-400' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 pt-2 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/40">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                    <Link
                        href="/how-it-works"
                        className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl space-y-3 group transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Gauge className="w-5 h-5" />
                        </div>
                        <h4 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                            Driver Gameplay Guide
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Learn about throttle control, nitro management, and cornering lines on each championship track.
                        </p>
                    </Link>

                    <Link
                        href="/refund-policy"
                        className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl space-y-3 group transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h4 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                            Refunds & Invoices
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Review our automated VAT billing, 14-day digital statutory rights, and dispute procedures.
                        </p>
                    </Link>

                    <Link
                        href="/aml-sanctions"
                        className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl space-y-3 group transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <h4 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                            Sanctions Bulletin
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            See the complete schedule of prohibited countries under UK HM Treasury and international law.
                        </p>
                    </Link>
                </div>

                {/* Support Contact Box */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-8 sm:p-10 text-center space-y-4">
                    <h3 className="text-xl font-orbitron font-bold text-white">
                        Have a Specific Technical or Billing Inquiry?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Our London operations team and telemetry support specialists respond to inquiries within 24 business hours.
                    </p>
                    <div className="pt-2">
                        <a
                            href={`mailto:${companyEmail}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-orbitron font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Email Support ({companyEmail})
                        </a>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
