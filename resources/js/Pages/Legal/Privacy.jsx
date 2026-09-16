import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Lock, 
    Eye, 
    Database, 
    Server, 
    UserCheck, 
    FileText,
    Key,
    Mail
} from 'lucide-react';

export default function Privacy() {
    const { company } = usePage().props;

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        UK GDPR & Data Protection Act 2018
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white tracking-tight">
                        Privacy <span className="text-cyan-400">Policy</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                        Last Updated: September 16, 2026 &bull; Explaining transparently how your personal data is collected, processed, and safeguarded.
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed backdrop-blur-xl shadow-2xl">
                    
                    {/* Section 1 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">1.</span> Data Controller & Overview
                        </h2>
                        <p>
                            <strong>{company?.name || 'StreetForge Ltd'}</strong>, incorporated in the United Kingdom (Company Number: <code>{company?.number || '14829103'}</code>, Registered Office: {company?.address || '128 City Road, London, EC1V 2NX, United Kingdom'}), operates as the Data Controller responsible for your personal information under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                        </p>
                        <p>
                            For inquiries regarding our data practices or to contact our Data Protection Officer, please email <a href="mailto:dpo@streetforge.co.uk" className="text-cyan-400 underline">dpo@streetforge.co.uk</a>.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">2.</span> Categories of Personal Data Collected
                        </h2>
                        <p>We collect and process the following categories of data when you register and interact with our platform:</p>
                        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
                            <li><strong>Identity & Profile Data:</strong> First name, surname, date of birth, country of residence, city, street address, and postal code.</li>
                            <li><strong>Contact Data:</strong> Verified email address and contact telephone number.</li>
                            <li><strong>Telemetry & Gameplay Data:</strong> In-game XP, level progression, active vehicle configuration, installed tuning parts, race lap times, and multiplayer MMR ratings.</li>
                            <li><strong>Transaction & Invoicing Data:</strong> Fiat currency amount, credits purchased, payment timestamps, transaction references, and VAT invoice metadata.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type and version, operating system, and session timestamps.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">3.</span> Legal Bases for Processing
                        </h2>
                        <p>Under Article 6 of the UK GDPR, we process your personal data under the following lawful bases:</p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                            <li><strong>Performance of a Contract:</strong> To provision your driver profile, process credit top-ups, deliver PDF invoices, and maintain your active garage fleet.</li>
                            <li><strong>Legal & Regulatory Obligation:</strong> To enforce international sanctions screening (OFSI/FATF), comply with tax and accounting rules, and prevent financial fraud.</li>
                            <li><strong>Legitimate Interests:</strong> To optimize 60 FPS canvas physics, safeguard system security, prevent botting/cheating, and maintain balanced leaderboard rankings.</li>
                            <li><strong>Consent:</strong> Where explicitly requested for promotional updates and marketing communications.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-400" />
                            <span className="text-cyan-400">4.</span> PCI-DSS Payment Security & Third-Party Processors
                        </h2>
                        <p>
                            All payment transactions are handled exclusively through certified <strong>PCI-DSS Level 1</strong> compliant payment service providers (including Visa, Mastercard, and authorized acquiring networks).
                        </p>
                        <p className="text-xs text-slate-400">
                            Payment credentials (full card numbers, CVVs) are processed via secure end-to-end tokenization and are never stored or accessible on StreetForge infrastructure. Our servers only receive tokenized transaction confirmations, masked card details (e.g. Last 4 digits), and billing receipts.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">5.</span> Data Retention Schedules
                        </h2>
                        <p>
                            We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                            <li><strong>Account & Gameplay Data:</strong> Retained for the duration of your active account lifecycle.</li>
                            <li><strong>Tax & Invoice Records:</strong> Retained for 6 years in accordance with UK statutory accounting and tax regulations.</li>
                            <li><strong>Security & Access Logs:</strong> Automatically purged after 90 days.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">6.</span> Your Data Protection Rights under UK GDPR
                        </h2>
                        <p>You are entitled to exercise the following rights regarding your personal data:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                                <strong>Right to Access:</strong> Request a copy of all personal data held about you.
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                                <strong>Right to Rectification:</strong> Request correction of inaccurate registration data.
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                                <strong>Right to Erasure ("To Be Forgotten"):</strong> Request deletion of your account and profile data.
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                                <strong>Right to Data Portability:</strong> Receive your telemetry and invoice records in a structured JSON format.
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">
                            To exercise any of these rights, submit a written request to <a href="mailto:privacy@streetforge.co.uk" className="text-cyan-400 underline">privacy@streetforge.co.uk</a>. We respond to all verified requests within 30 calendar days.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="space-y-2 pt-2 text-xs text-slate-400">
                        <h3 className="font-orbitron font-bold text-white uppercase text-xs">
                            7. Supervisory Authority
                        </h3>
                        <p>
                            If you believe our data processing fails to comply with data protection laws, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">ico.org.uk</a>.
                        </p>
                    </section>

                </div>

            </div>
        </PublicLayout>
    );
}
