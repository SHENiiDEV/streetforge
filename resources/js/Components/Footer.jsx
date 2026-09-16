import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Mail, MapPin, FileText, Lock, FileCheck, ArrowUpRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
    const { company } = usePage().props;
    const year = new Date().getFullYear();

    const companyName = company?.name || 'StreetForge Ltd';
    const companyNumber = company?.number || '14829103';
    const companyAddress = company?.address || '128 City Road, London, EC1V 2NX, United Kingdom';
    const companyEmail = company?.email || 'support@streetforge.co.uk';

    const columns = [
        {
            title: 'Race Hub',
            links: [
                ['Race Lobby', '/race/lobby'],
                ['Garage & Tuning', '/garage'],
                ['Vehicle Showroom', '/shop'],
                ['Top-Up Credits', '/topup'],
                ['Seasonal Standings', '/leaderboard'],
                ['Paddock Wire', '/news'],
            ],
        },
        {
            title: 'Legal & Compliance',
            links: [
                ['Terms of Service', '/terms'],
                ['Privacy Policy (UK GDPR)', '/privacy'],
                ['Refund & Cancellation', '/refund-policy'],
                ['Sanctions & AML Policy', '/aml-sanctions'],
                ['Cookie Policy', '/cookie-policy'],
            ],
        },
        {
            title: 'Company',
            links: [
                ['About the Studio', '/about'],
                ['How It Works', '/how-it-works'],
                ['FAQ', '/faq'],
            ],
        },
    ];

    return (
        <footer className="relative bg-carbon-950 border-t border-white/[0.06] mt-auto overflow-hidden">
            {/* Trust strip */}
            <div className="border-b border-white/[0.06] bg-carbon-925/60">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-7">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-7">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 shrink-0 border border-white/[0.08] flex items-center justify-center text-cyan-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="font-display font-bold uppercase tracking-wide text-sm text-white">
                                    Secure payments &amp; data protection
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    256-bit TLS encrypted checkout through regulated UK/EU payment gateways.
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {[
                                ['/images/payments/visa.png', 'Visa', 'h-5'],
                                ['/images/payments/mastercard.png', 'Mastercard', 'h-6'],
                                ['/images/payments/pci-dss.png', 'PCI DSS Compliant', 'h-5'],
                            ].map(([src, alt, h]) => (
                                <div
                                    key={alt}
                                    className="h-10 px-4 border border-white/[0.07] hover:border-white/15 flex items-center justify-center transition-colors"
                                >
                                    <img src={src} alt={alt} className={`${h} w-auto object-contain opacity-80`} />
                                </div>
                            ))}
                            <div className="hidden sm:flex items-center gap-2 h-10 px-4 border border-emerald-400/20 text-emerald-400 label-tech">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Level 1 PCI
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-16">
                <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    <div className="col-span-2 lg:col-span-4 space-y-5">
                        <BrandLogo size="md" />
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                            Browser motorsport simulation with real-time tuning, vehicle ownership, custom liveries
                            and competitive multiplayer circuits. No downloads, no plugins.
                        </p>
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2 label-tech text-emerald-400/90">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Sanctions-compliant platform
                            </div>
                            <div className="flex items-center gap-2 label-tech text-cyan-400/90">
                                <FileCheck className="w-3.5 h-3.5" />
                                Automated PDF invoicing
                            </div>
                        </div>
                    </div>

                    {columns.map((col) => (
                        <div key={col.title} className="lg:col-span-2 space-y-4">
                            <h4 className="label-tech text-slate-300">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map(([label, href]) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="group inline-flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
                                        >
                                            {label}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="col-span-2 lg:col-span-2 space-y-4">
                        <h4 className="label-tech text-slate-300">Registered Office</h4>
                        <div className="space-y-3 text-xs text-slate-500">
                            <div className="font-display font-bold uppercase tracking-wide text-sm text-slate-200">
                                {companyName}
                            </div>
                            <div className="flex items-start gap-2">
                                <FileText className="w-3.5 h-3.5 text-slate-700 mt-0.5 shrink-0" />
                                <span>Reg. <span className="numeric text-slate-300">{companyNumber}</span></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-700 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">{companyAddress}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="w-3.5 h-3.5 text-slate-700 mt-0.5 shrink-0" />
                                <a href={`mailto:${companyEmail}`} className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                                    {companyEmail}
                                </a>
                            </div>
                            <div className="pt-1 text-[11px] text-slate-700 leading-relaxed">
                                Incorporated in England &amp; Wales under the Companies Act 2006.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-14 pt-7 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="label-tech text-slate-700 text-center md:text-left">
                        &copy; {year} {companyName} &mdash; All rights reserved
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        {[
                            ['Terms', '/terms'],
                            ['Privacy', '/privacy'],
                            ['Refunds', '/refund-policy'],
                            ['Sanctions', '/aml-sanctions'],
                            ['Cookies', '/cookie-policy'],
                        ].map(([label, href]) => (
                            <Link key={href} href={href} className="label-tech text-slate-700 hover:text-slate-300 transition-colors">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Oversized watermark */}
            <div className="pointer-events-none select-none overflow-hidden border-t border-white/[0.04]">
                <div className="headline text-[18vw] leading-[0.8] text-white/[0.022] text-center whitespace-nowrap py-2">
                    STREETFORGE
                </div>
            </div>
        </footer>
    );
}
