import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    FileText, 
    ShieldCheck, 
    ShieldAlert, 
    Scale, 
    CreditCard, 
    Ban, 
    HelpCircle,
    CheckCircle2,
    Lock
} from 'lucide-react';

export default function Terms() {
    const { company } = usePage().props;

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        <Scale className="w-3.5 h-3.5" />
                        Legal Agreement & Service Conditions
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white tracking-tight">
                        Terms & <span className="text-cyan-400">Conditions</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                        Last Updated: September 16, 2026 &bull; Version 3.2 &bull; Effective for all registered drivers and platform visitors.
                    </p>
                </div>

                {/* Main Legal Content Container */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed backdrop-blur-xl shadow-2xl">
                    
                    {/* Section 1 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">1.</span> Contracting Entity & Acceptance of Agreement
                        </h2>
                        <p>
                            These Terms and Conditions constitute a legally binding contract between you (the "User", "Driver", or "Player") and <strong>{company?.name || 'StreetForge Ltd'}</strong>, a private limited company incorporated under the laws of the United Kingdom with Company Registration Number <code>{company?.number || '14829103'}</code>, having its registered office at <strong>{company?.address || '128 City Road, London, EC1V 2NX, United Kingdom'}</strong> (hereinafter referred to as "StreetForge", "we", "our", or "us").
                        </p>
                        <p>
                            By registering an account, accessing, browsing, or utilizing any services provided on <code>streetforge.co.uk</code> or associated subdomains, you explicitly confirm that you have read, understood, and agreed to be bound by these Terms, our <Link href="/privacy" className="text-cyan-400 underline">Privacy Policy</Link>, and our <Link href="/refund-policy" className="text-cyan-400 underline">Refund Policy</Link>.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">2.</span> User Eligibility & Account Registration
                        </h2>
                        <p>
                            To register an account and participate in the StreetForge digital motorsport platform, you must:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                            <li>Be at least 18 years of age (or have reached the age of legal majority in your jurisdiction).</li>
                            <li>Provide accurate, truthful, and complete registration data, including your legal name, date of birth, residential address, and valid email address.</li>
                            <li>Maintain the confidentiality of your account credentials. You are solely responsible for all activities and transactions performed under your login.</li>
                            <li>Not create multiple accounts to circumvent bans, exploit starter packs, or manipulate tournament leaderboards.</li>
                        </ul>
                    </section>

                    {/* Section 3 - Sanctions */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-red-400 uppercase tracking-wide flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                            <span>3.</span> International Sanctions & Prohibited Jurisdictions
                        </h2>
                        <p>
                            StreetForge Ltd is committed to strict compliance with international trade sanctions, Anti-Money Laundering (AML), and Counter-Terrorist Financing (CFT) regulations enforced by the UK Office of Financial Sanctions Implementation (OFSI), the European Union, the United Nations Security Council, and the US Department of the Treasury (OFAC).
                        </p>
                        <p>
                            Registration, gameplay, and financial transactions are strictly prohibited for individuals located in, resident in, or citizens of the following sanctioned jurisdictions:
                        </p>
                        <div className="bg-slate-950/80 p-4 rounded-xl border border-red-900/40 text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <span>&bull; Afghanistan</span>
                            <span>&bull; Belarus</span>
                            <span>&bull; Central African Republic</span>
                            <span>&bull; Cuba</span>
                            <span>&bull; DR Congo</span>
                            <span>&bull; Haiti</span>
                            <span>&bull; Iran</span>
                            <span>&bull; Iraq</span>
                            <span>&bull; Mali</span>
                            <span>&bull; Myanmar (Burma)</span>
                            <span>&bull; North Korea</span>
                            <span>&bull; Russia</span>
                            <span>&bull; Somalia</span>
                            <span>&bull; South Sudan</span>
                            <span>&bull; Sudan</span>
                            <span>&bull; Syria</span>
                            <span>&bull; Venezuela</span>
                            <span>&bull; Yemen</span>
                            <span>&bull; Zimbabwe</span>
                        </div>
                        <p className="text-xs text-red-300">
                            Any attempt to circumvent these jurisdictional blocks through VPNs, proxy networks, or forged documents will result in immediate termination of the account and forfeiture of any digital balances without refund.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">4.</span> Virtual In-Game Currency & Digital Assets
                        </h2>
                        <p>
                            The platform utilizes a proprietary digital in-game currency known as <strong>StreetForge Credits ("CR")</strong>.
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                            <li>Credits are intangible virtual items intended exclusively for internal gameplay mechanics, dyno tuning parts, vehicle unlocking, and cosmetic liveries.</li>
                            <li>Credits have no real-world monetary value, cannot be redeemed for fiat currency, cannot be transferred between accounts, and do not constitute personal property.</li>
                            <li>StreetForge reserves the right to rebalance, calibrate, or adjust in-game item prices and reward payouts to maintain fair competition.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">5.</span> Payment Processing, Billing & Invoicing
                        </h2>
                        <p>
                            All top-ups are processed via authorized, PCI-DSS Level 1 compliant payment gateways (including Visa, Mastercard, and secure electronic methods). StreetForge does not store complete debit/credit card numbers on its servers.
                        </p>
                        <p>
                            Upon successful payment settlement:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                            <li>Digital credits are deposited immediately into the user's garage balance.</li>
                            <li>An official electronic <strong>PDF Tax Invoice</strong> is automatically generated with a unique invoice sequence number and made accessible in the user dashboard and via email.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">6.</span> Fair Play, Anti-Cheat & Code of Conduct
                        </h2>
                        <p>
                            To preserve the integrity of our multiplayer-style leaderboards, the following conduct is strictly prohibited:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                            <li>Using automated macro bots, speedhacks, memory injection, or modified browser scripts.</li>
                            <li>Exploiting physics glitches or track boundary bypasses to artificially reduce lap times.</li>
                            <li>Engaging in fraud, chargeback abuse, or unauthorized card usage.</li>
                        </ul>
                        <p className="text-xs text-slate-400">
                            Violations will lead to leaderboard rank removal, telemetry reset, or permanent account banning.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">7.</span> Intellectual Property Rights
                        </h2>
                        <p>
                            All game code, 2D physics engines, visual assets, 3D/SVG vehicle designs, sound synthesizers, logos, trademarks, and user interfaces are the proprietary intellectual property of StreetForge Ltd or licensed to us. You are granted a limited, revocable, non-exclusive license for personal non-commercial gameplay.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">8.</span> Limitation of Liability & Disclaimers
                        </h2>
                        <p>
                            The service is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by applicable UK law, StreetForge Ltd disclaims all warranties, express or implied, including fitness for a particular purpose and uninterrupted operation. We shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime or network latency.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">9.</span> Governing Law & Jurisdiction
                        </h2>
                        <p>
                            These Terms and Conditions, and any disputes arising out of or related to them, shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>. You agree to submit to the exclusive jurisdiction of the courts of England and Wales.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section className="space-y-2 pt-2 text-xs text-slate-400">
                        <h3 className="font-orbitron font-bold text-white uppercase text-xs">
                            10. Contact & Legal Notices
                        </h3>
                        <p>
                            For formal legal inquiries, regulatory notices, or billing disputes:
                        </p>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                            <div className="font-bold text-slate-200">{company?.name || 'StreetForge Ltd'}</div>
                            <div>Company No: <code className="text-cyan-400">{company?.number || '14829103'}</code></div>
                            <div>{company?.address || '128 City Road, London, EC1V 2NX, United Kingdom'}</div>
                            <div>Email: <a href={`mailto:${company?.email || 'support@streetforge.co.uk'}`} className="text-cyan-400 hover:underline">{company?.email || 'support@streetforge.co.uk'}</a></div>
                        </div>
                    </section>

                </div>

            </div>
        </PublicLayout>
    );
}
