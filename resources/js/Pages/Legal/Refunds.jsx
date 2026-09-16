import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    CreditCard, 
    RefreshCcw, 
    ShieldCheck, 
    AlertCircle, 
    CheckCircle2, 
    Mail, 
    FileText,
    HelpCircle
} from 'lucide-react';

export default function Refunds() {
    const { company } = usePage().props;

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Billing Policy & Consumer Rights
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white tracking-tight">
                        Refund & <span className="text-cyan-400">Cancellation Policy</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                        Last Updated: September 16, 2026 &bull; Clear guidelines regarding digital currency orders, instant fulfillment, and transaction dispute resolution.
                    </p>
                </div>

                {/* Content Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed backdrop-blur-xl shadow-2xl">
                    
                    {/* Section 1 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">1.</span> Nature of Digital In-Game Currency
                        </h2>
                        <p>
                            All purchases on <code>streetforge.co.uk</code> consist of intangible, digital virtual in-game credits (<strong>StreetForge Credits / "CR"</strong>). 
                        </p>
                        <p>
                            Upon successful completion of a top-up payment, digital credits are delivered and made available in your account balance instantly (within seconds). Consequently, under the UK Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 and applicable EU Consumer Rights Directives, you acknowledge and agree that:
                        </p>
                        <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200">
                            <strong>Statutory Right of Withdrawal Notice:</strong> By initiating a purchase of digital credits and requesting immediate delivery to your in-game garage, you explicitly consent to the immediate supply of digital content and acknowledge that you lose your 14-day statutory right of cancellation once the digital credits are credited.
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">2.</span> Eligible Circumstances for Refunds
                        </h2>
                        <p>
                            While virtual credits that have been credited or partially consumed in dyno tuning are non-refundable, StreetForge Ltd will review and approve refunds under the following exceptional conditions:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
                            <li><strong>Duplicate or Accidental Billing:</strong> If a technical glitch or network timeout caused multiple charges for a single order.</li>
                            <li><strong>Non-Delivery of Credits:</strong> If funds were successfully deducted from your payment method, but credits failed to appear in your balance within 2 hours due to a verified server issue.</li>
                            <li><strong>Proven Fraudulent / Unauthorized Activity:</strong> If your card was used without your authorization, subject to submission of formal documentation and immediate account suspension to prevent further illicit activity.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">3.</span> Refund Request Procedure
                        </h2>
                        <p>
                            To submit a refund claim, contact our billing department within <strong>14 calendar days</strong> of the transaction timestamp:
                        </p>
                        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-400">
                            <li>Send an email to <a href="mailto:billing@streetforge.co.uk" className="text-cyan-400 underline">billing@streetforge.co.uk</a> from your registered account email.</li>
                            <li>Include your <strong>Invoice Number</strong> (e.g. <code>INV-2026-XXXX</code>) and Transaction Reference.</li>
                            <li>Provide a clear explanation of the technical issue or reason for the claim.</li>
                        </ol>
                        <p className="text-xs text-slate-400">
                            Our compliance team reviews all refund inquiries within <strong>2 business days</strong>. Approved refunds are credited back to the original payment method within 5 to 10 banking days.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">4.</span> Chargeback Policy & Account Status
                        </h2>
                        <p>
                            We strongly encourage drivers to contact our support team directly before initiating a payment dispute or chargeback with their issuing bank. Unjustified chargebacks or disputes filed without contacting support may result in automatic temporary suspension of your driver account until the transaction is resolved.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-2 pt-2 text-xs text-slate-400">
                        <h3 className="font-orbitron font-bold text-white uppercase text-xs">
                            5. Billing Support Contacts
                        </h3>
                        <p>
                            For prompt billing assistance:
                        </p>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                            <div className="font-bold text-slate-200">{company?.name || 'StreetForge Ltd'} &bull; Billing Department</div>
                            <div>Email: <a href="mailto:billing@streetforge.co.uk" className="text-cyan-400 hover:underline">billing@streetforge.co.uk</a> / <a href={`mailto:${company?.email || 'support@streetforge.co.uk'}`} className="text-cyan-400 hover:underline">{company?.email || 'support@streetforge.co.uk'}</a></div>
                            <div>{company?.address || '128 City Road, London, EC1V 2NX, United Kingdom'}</div>
                        </div>
                    </section>

                </div>

            </div>
        </PublicLayout>
    );
}
