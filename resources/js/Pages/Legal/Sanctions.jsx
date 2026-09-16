import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    ShieldAlert, 
    ShieldCheck, 
    Globe2, 
    Ban, 
    FileText, 
    AlertTriangle,
    Lock
} from 'lucide-react';

export default function Sanctions() {
    const { company, sanctions } = usePage().props;
    const countries = sanctions?.blacklisted_countries || [
        'Afghanistan', 'Belarus', 'Central African Republic', 'Cuba',
        'Democratic Republic of the Congo', 'Haiti', 'Iran', 'Iraq',
        'Mali', 'Myanmar (Burma)', 'North Korea', 'Russia',
        'Somalia', 'South Sudan', 'Sudan', 'Syria', 'Venezuela', 'Zimbabwe'
    ];

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-semibold uppercase tracking-wider">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Regulatory Compliance Bulletin
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white tracking-tight">
                        Anti-Money Laundering & <span className="text-red-400">Sanctions Policy</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                        Strict compliance with UK OFSI, European Union, United Nations, and international FATF trade restrictions.
                    </p>
                </div>

                {/* Content Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed backdrop-blur-xl shadow-2xl">
                    
                    {/* Section 1 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">1.</span> Policy Purpose & Regulatory Scope
                        </h2>
                        <p>
                            <strong>{company?.name || 'StreetForge Ltd'}</strong> maintains a zero-tolerance policy towards the evasion of international trade sanctions, money laundering (AML), and terrorism financing (CFT). 
                        </p>
                        <p>
                            As a registered entity in the United Kingdom, StreetForge complies strictly with the Sanctions and Anti-Money Laundering Act 2018 (SAMLA), statutory guidelines published by the Office of Financial Sanctions Implementation (OFSI), and Financial Action Task Force (FATF) High-Risk Jurisdictions.
                        </p>
                    </section>

                    {/* Section 2 - Blacklist */}
                    <section className="space-y-4 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-red-400 uppercase tracking-wide flex items-center gap-2">
                            <Ban className="w-4 h-4" />
                            <span>2.</span> Comprehensive List of Sanctioned Jurisdictions ({countries.length})
                        </h2>
                        <p>
                            Registration, account creation, gameplay, and payment processing are strictly embargoed for users residing in, holding citizenship in, or utilizing payment instruments issued in the following countries:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {countries.map((country, idx) => (
                                <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-red-900/50 flex items-center gap-2 text-xs font-mono text-slate-200">
                                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                    <span>{country}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">3.</span> Automated Compliance Screening Mechanisms
                        </h2>
                        <p>
                            To prevent unauthorized access from sanctioned zones, our platform employs layered automated screening:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
                            <li><strong>Registration Validation:</strong> Form input validation automatically rejects country selections that match our sanctions database.</li>
                            <li><strong>IP Geo-Location & Proxy Filtering:</strong> Automated detection of commercial VPNs, Tor exit nodes, and proxy servers attempting to obscure connection origin.</li>
                            <li><strong>Payment Gateway Bin Checking:</strong> Bank Identification Numbers (BINs) of debit and credit cards are screened to ensure cards issued in sanctioned jurisdictions cannot settle top-up orders.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">4.</span> Penalties for Circumvention
                        </h2>
                        <p>
                            Any attempt by a user to supply fraudulent address data, forged identification, or proxy IP masking to bypass sanctions will result in:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-red-300">
                            <li>Immediate and irrevocable account termination.</li>
                            <li>Immediate freeze and forfeiture of all virtual game balances and in-game assets.</li>
                            <li>Reporting to relevant regulatory and financial enforcement authorities where mandated by law.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-2 pt-2 text-xs text-slate-400">
                        <h3 className="font-orbitron font-bold text-white uppercase text-xs">
                            5. Compliance Office Contact
                        </h3>
                        <p>
                            For compliance auditing inquiries or regulatory requests:
                        </p>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                            <div className="font-bold text-slate-200">StreetForge Ltd Compliance Department</div>
                            <div>Email: <a href="mailto:compliance@streetforge.co.uk" className="text-cyan-400 hover:underline">compliance@streetforge.co.uk</a></div>
                            <div>{company?.address || '128 City Road, London, EC1V 2NX, United Kingdom'}</div>
                        </div>
                    </section>

                </div>

            </div>
        </PublicLayout>
    );
}
