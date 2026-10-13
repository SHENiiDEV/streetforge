import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Mail, MapPin, FileText, Lock, ArrowUpRight, Clock, Building2, KeyRound } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { LEGAL_GROUPS } from './Legal/legalDocs';

const RACE_HUB = {
    title: 'Race Hub',
    docs: [
        { label: 'Race Lobby', href: '/race/lobby' },
        { label: 'Garage & Tuning', href: '/garage' },
        { label: 'Vehicle Showroom', href: '/shop' },
        { label: 'Top-Up Credits', href: '/topup' },
        { label: 'Seasonal Standings', href: '/leaderboard' },
        { label: 'Paddock Wire', href: '/news' },
    ],
};

function FooterLink({ href, children }) {
    return (
        <Link href={href} className="group inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-white transition-colors">
            {children}
            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
        </Link>
    );
}

export default function Footer() {
    const { company } = usePage().props;
    const year = new Date().getFullYear();

    const companyName = company?.name || 'StreetForge Ltd';
    const companyNumber = company?.number || '14829103';
    const companyAddress = company?.address || '128 City Road, London, EC1V 2NX, United Kingdom';
    const companyEmail = company?.email || 'support@streetforge.co.uk';

    const columns = [RACE_HUB, ...LEGAL_GROUPS];

    return (
        <footer className="relative bg-carbon-950 border-t border-white/[0.06] mt-auto overflow-hidden">
            {/* ── Payment trust strip ── */}
            <div className="border-b border-white/[0.06] bg-carbon-925/60">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-7">
                        <div className="flex items-start gap-4 max-w-2xl lg:flex-1">
                            <div className="w-11 h-11 shrink-0 border border-emerald-400/25 bg-emerald-400/[0.05] flex items-center justify-center text-emerald-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="font-display font-bold uppercase tracking-wide text-[15px] text-white">
                                    Payments on a PCI DSS Level 1 hosted page
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    At checkout you are redirected to our payment provider's secure page, certified to PCI DSS Level 1, with 3-D Secure
                                    authentication. Card details are entered only there and never reach StreetForge servers.{' '}
                                    <Link href="/payment-security" className="text-cyan-400 hover:text-cyan-300 whitespace-nowrap">
                                        How payments work →
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 shrink-0">
                            {[
                                ['/images/payments/visa.png', 'Visa', 'h-5'],
                                ['/images/payments/mastercard.png', 'Mastercard', 'h-6'],
                                ['/images/payments/pci-dss.png', 'PCI DSS Compliant', 'h-5'],
                            ].map(([src, alt, h]) => (
                                <div key={alt} className="h-10 px-4 border border-white/[0.07] hover:border-white/15 flex items-center justify-center transition-colors">
                                    <img src={src} alt={alt} className={`${h} w-auto object-contain opacity-80`} />
                                </div>
                            ))}
                            <div className="flex items-center gap-2 h-10 px-4 border border-emerald-400/20 text-emerald-400 label-tech">
                                <ShieldCheck className="w-3.5 h-3.5" /> Level 1 PCI
                            </div>
                            <div className="flex items-center gap-2 h-10 px-4 border border-cyan-400/20 text-cyan-300 label-tech">
                                <KeyRound className="w-3.5 h-3.5" /> 3-D Secure
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main ── */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 lg:pt-16">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-3 space-y-6">
                        <BrandLogo size="md" />
                        <p className="text-[13px] text-slate-500 leading-relaxed max-w-xs">
                            Browser motorsport simulation with real-time tuning, vehicle ownership, custom liveries and competitive circuits. No downloads,
                            no plugins.
                        </p>
                        <div className="surface p-4 space-y-3 max-w-xs">
                            <div className="label-tech text-slate-400">Need help?</div>
                            <a href={`mailto:${companyEmail}`} className="flex items-center gap-2 text-sm text-cyan-300 hover:text-white transition-colors break-all">
                                <Mail className="w-3.5 h-3.5 shrink-0" /> {companyEmail}
                            </a>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5 shrink-0 text-slate-600" /> Mon–Fri 09:00–20:00 UK
                            </div>
                            <Link href="/contact" className="inline-flex items-center gap-1.5 label-tech text-slate-300 hover:text-cyan-300 transition-colors">
                                All contacts <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
                        {columns.map((col) => (
                            <div key={col.title} className="space-y-4">
                                <h4 className="label-tech text-slate-300">{col.title}</h4>
                                <ul className="space-y-2.5">
                                    {col.docs.map((d) => (
                                        <li key={d.href}>
                                            <FooterLink href={d.href}>{d.label}</FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Company register band ── */}
                <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 border border-white/[0.06] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                    {[
                        { icon: Building2, k: 'Legal entity', v: companyName },
                        { icon: FileText, k: 'Company number', v: <span className="numeric">{companyNumber}</span> },
                        { icon: MapPin, k: 'Registered office', v: companyAddress },
                        { icon: Mail, k: 'Official contact', v: <a href={`mailto:${companyEmail}`} className="text-cyan-300 hover:text-white transition-colors break-all">{companyEmail}</a> },
                    ].map(({ icon: Icon, k, v }) => (
                        <div key={k} className="p-5 flex gap-3">
                            <Icon className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <div className="label-tech text-slate-600">{k}</div>
                                <div className="text-[13px] text-slate-300 leading-relaxed">{v}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Disclosures ── */}
                <div className="mt-8 grid lg:grid-cols-3 gap-6 text-[11.5px] leading-relaxed text-slate-600">
                    <p>
                        <span className="text-slate-400 font-semibold">18+ only.</span> StreetForge is a skill-based racing game. There are no paid random
                        rewards and no prizes with real-world value. See <Link href="/responsible-play" className="underline decoration-white/15 hover:text-slate-300">Responsible Play</Link>.
                    </p>
                    <p>
                        <span className="text-slate-400 font-semibold">Virtual Credits.</span> StreetForge Credits are a licence to use an in-game currency.
                        They have no cash value and cannot be withdrawn, transferred or exchanged. See <Link href="/virtual-credits" className="underline decoration-white/15 hover:text-slate-300">Virtual Credits Policy</Link>.
                    </p>
                    <p>
                        <span className="text-slate-400 font-semibold">Payments.</span> Card payments are processed by an independent PCI DSS Level 1 payment
                        service provider on its hosted page. Visa and Mastercard are trademarks of their respective owners.
                    </p>
                </div>

                {/* ── Bottom bar ── */}
                <div className="mt-10 py-7 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="label-tech text-slate-700 text-center md:text-left">
                        &copy; {year} {companyName} &mdash; Registered in England &amp; Wales No. {companyNumber}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        {[
                            ['Terms', '/terms'],
                            ['Privacy', '/privacy'],
                            ['Cookies', '/cookie-policy'],
                            ['Payments', '/payment-security'],
                            ['Refunds', '/refund-policy'],
                            ['Accessibility', '/accessibility'],
                            ['Legal Centre', '/legal'],
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
                <div className="headline text-[18vw] leading-[0.8] text-white/[0.022] text-center whitespace-nowrap py-2">STREETFORGE</div>
            </div>
        </footer>
    );
}
