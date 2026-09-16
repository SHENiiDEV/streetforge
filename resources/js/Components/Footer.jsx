import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Mail, MapPin, FileText, Gauge, Lock, Award, Newspaper, FileCheck } from 'lucide-react';

import BrandLogo from './BrandLogo';

export default function Footer() {
    const { company } = usePage().props;
    const currentYear = new Date().getFullYear();

    const companyName = company?.name || 'StreetForge Ltd';
    const companyNumber = company?.number || '14829103';
    const companyAddress = company?.address || '128 City Road, London, EC1V 2NX, United Kingdom';
    const companyEmail = company?.email || 'support@streetforge.co.uk';

    return (
        <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-auto">
            {/* Payment & Security Trust Strip */}
            <div className="border-b border-slate-900 bg-slate-950/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white font-orbitron uppercase tracking-wider">
                                    Secure Payments & Data Protection
                                </div>
                                <div className="text-xs text-slate-400">
                                    256-bit TLS encrypted checkout. Processed through regulated UK/EU payment gateways.
                                </div>
                            </div>
                        </div>

                        {/* Payment Logos & Compliance Badges */}
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6">
                            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-center h-10 shadow-sm hover:border-slate-700 transition-colors">
                                <img
                                    src="/images/payments/visa.png"
                                    alt="Visa"
                                    className="h-6 w-auto object-contain brightness-110"
                                />
                            </div>
                            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-center h-10 shadow-sm hover:border-slate-700 transition-colors">
                                <img
                                    src="/images/payments/mastercard.png"
                                    alt="Mastercard"
                                    className="h-7 w-auto object-contain brightness-110"
                                />
                            </div>
                            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-center h-10 shadow-sm hover:border-slate-700 transition-colors">
                                <img
                                    src="/images/payments/pci-dss.png"
                                    alt="PCI DSS Compliant"
                                    className="h-6 w-auto object-contain brightness-110"
                                />
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Level 1 PCI Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    
                    {/* Col 1: Brand & Bio */}
                    <div className="space-y-4 lg:col-span-2">
                        <BrandLogo size="md" />
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            Next-generation browser racing simulation. Experience real-time tuning, vehicle ownership, custom liveries, telemetry analysis, and competitive multiplayer circuits.
                        </p>
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>Sanctions-Compliant & Verified Platform</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyan-400">
                                <FileCheck className="w-4 h-4 shrink-0" />
                                <span>Instant Automated PDF Invoicing</span>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Navigation */}
                    <div className="space-y-3">
                        <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-200">
                            Game Modes & Hub
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/race/lobby" className="hover:text-cyan-400 transition-colors">Race Lobby</Link></li>
                            <li><Link href="/garage" className="hover:text-cyan-400 transition-colors">Garage & Tuning</Link></li>
                            <li><Link href="/shop" className="hover:text-cyan-400 transition-colors">Vehicle Showroom</Link></li>
                            <li><Link href="/topup" className="hover:text-cyan-400 transition-colors">Top-Up Credits</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
                            <li><Link href="/news" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                                <span>News & Patch Notes</span>
                            </Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Legal & Information */}
                    <div className="space-y-3">
                        <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-200">
                            Legal & Compliance
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy (UK GDPR)</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-cyan-400 transition-colors">Refund & Cancellation</Link></li>
                            <li><Link href="/aml-sanctions" className="hover:text-cyan-400 transition-colors">Sanctions & AML Policy</Link></li>
                            <li><Link href="/cookie-policy" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Corporate Requisites (.env synced) */}
                    <div className="space-y-3">
                        <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-200">
                            Corporate Details
                        </h4>
                        <div className="space-y-2 text-xs text-slate-400">
                            <div className="font-bold text-slate-200 font-orbitron">{companyName}</div>
                            <div className="flex items-start gap-2">
                                <FileText className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                                <span>Reg No: <strong className="text-slate-300 font-mono">{companyNumber}</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                                <span className="leading-snug">{companyAddress}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                                <a href={`mailto:${companyEmail}`} className="text-cyan-400 hover:underline">{companyEmail}</a>
                            </div>
                            <div className="pt-2 text-[11px] text-slate-500">
                                Incorporated in England & Wales under the Companies Act 2006.
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sub-footer bottom bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div>
                        &copy; {currentYear} {companyName}. All rights reserved. Registered in the United Kingdom.
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
                        <Link href="/how-it-works" className="hover:text-slate-300 transition-colors">How It Works</Link>
                        <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
                        <Link href="/news" className="hover:text-slate-300 transition-colors">News</Link>
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                        <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">Refunds</Link>
                        <Link href="/aml-sanctions" className="hover:text-slate-300 transition-colors">Sanctions</Link>
                        <Link href="/cookie-policy" className="hover:text-slate-300 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

