import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { usePage, useForm, Link } from '@inertiajs/react';
import { 
    CreditCard, 
    Zap, 
    ShieldCheck, 
    FileText, 
    Download, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function Topup({ packages = [], transactions = [] }) {
    const { auth, company } = usePage().props;
    const user = auth?.user;

    const [selectedPackage, setSelectedPackage] = useState(packages[1]?.id || packages[0]?.id);
    const [selectedGateway, setSelectedGateway] = useState('credit_card');

    const { data, setData, post, processing } = useForm({
        package_id: selectedPackage,
        gateway: selectedGateway,
    });

    const handleSelectPackage = (pkgId) => {
        setSelectedPackage(pkgId);
        setData('package_id', pkgId);
    };

    const handleSelectGateway = (gw) => {
        setSelectedGateway(gw);
        setData('gateway', gw);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/topup/order');
    };

    return (
        <AppLayout>
            <div className="space-y-10">
                
                {/* Header Banner */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5" /> Instant Account Top-Up
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white">
                        Digital Game <span className="text-cyan-400">Credits Store</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Purchase in-game credits to unlock supercars and install performance tuning stages. Instant delivery with pixel-perfect tax PDF invoice.
                    </p>
                </div>

                {/* Package Selector Cards */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {packages.map(pkg => {
                            const isSelected = selectedPackage === pkg.id;

                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => handleSelectPackage(pkg.id)}
                                    className={`relative cursor-pointer rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-105 z-10'
                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                                    }`}
                                >
                                    {/* Bonus Badge */}
                                    {pkg.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-orbitron font-extrabold uppercase tracking-wider shadow-md">
                                            {pkg.badge}
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="text-xs font-semibold text-slate-400">
                                            {pkg.name}
                                        </div>

                                        <div className="flex items-baseline gap-1">
                                            <span className="font-orbitron font-black text-3xl text-white">
                                                ${Number(pkg.fiat_amount).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">USD</span>
                                        </div>

                                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
                                            <span className="text-xs text-slate-400">Credits</span>
                                            <span className="font-orbitron font-bold text-sm text-cyan-400">
                                                +{Number(pkg.game_credits).toLocaleString()} CR
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-4 border-t border-slate-800/80">
                                        <div className={`w-full py-2.5 rounded-xl font-orbitron font-bold text-xs text-center transition-all ${
                                            isSelected
                                                ? 'bg-cyan-400 text-slate-950'
                                                : 'bg-slate-800 text-slate-300'
                                        }`}>
                                            {isSelected ? 'Selected Package' : 'Select'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Payment Gateways & Checkout Button */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="font-orbitron font-bold text-base text-white">
                                    Select Payment Method
                                </h3>
                                <p className="text-xs text-slate-400">Secure end-to-end payment processing</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                                <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'credit_card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, Amex', icon: CreditCard },
                                { id: 'bank_transfer', label: 'Instant Bank Wire', desc: 'SEPA, ACH, Wire Transfer', icon: Zap },
                                { id: 'crypto_pay', label: 'Crypto Currency', desc: 'BTC, ETH, USDT Instant', icon: Sparkles },
                            ].map(gw => {
                                const isSelected = selectedGateway === gw.id;
                                const Icon = gw.icon;

                                return (
                                    <div
                                        key={gw.id}
                                        onClick={() => handleSelectGateway(gw.id)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                            isSelected
                                                ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-750'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                                            <span className="font-semibold text-xs text-white">{gw.label}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400">{gw.desc}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Payment Logos & Compliance Strip */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-850">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/payments/visa.png"
                                    alt="Visa"
                                    className="h-5 w-auto object-contain brightness-110"
                                />
                                <img
                                    src="/images/payments/mastercard.png"
                                    alt="Mastercard"
                                    className="h-6 w-auto object-contain brightness-110"
                                />
                                <img
                                    src="/images/payments/pci-dss.png"
                                    alt="PCI DSS Compliant"
                                    className="h-5 w-auto object-contain brightness-110"
                                />
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                3D Secure 2.0 Protected
                            </div>
                        </div>

                        {/* Order Action */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-4 h-4" />
                                Proceed to Checkout Portal
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </form>

                {/* Transaction & PDF Invoice History Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                Payment & Invoice History
                            </h3>
                            <p className="text-xs text-slate-400">
                                Official receipts issued by {company?.name} (Reg: {company?.number})
                            </p>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            No transactions yet. Complete your first top-up above to receive your PDF tax invoice.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950/80 text-slate-400 uppercase font-orbitron text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="p-3.5">Invoice #</th>
                                        <th className="p-3.5">Date</th>
                                        <th className="p-3.5">Credits</th>
                                        <th className="p-3.5">Amount Paid</th>
                                        <th className="p-3.5">Gateway</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">PDF Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-sans">
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-slate-850/50 transition-colors">
                                            <td className="p-3.5 font-mono font-bold text-white">
                                                {tx.invoice_number || `INV-${tx.id}`}
                                            </td>
                                            <td className="p-3.5 text-slate-400">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3.5 font-orbitron font-bold text-cyan-400">
                                                +{Number(tx.game_credits).toLocaleString()} CR
                                            </td>
                                            <td className="p-3.5 font-semibold text-white">
                                                ${Number(tx.fiat_amount).toFixed(2)} {tx.currency}
                                            </td>
                                            <td className="p-3.5 uppercase text-slate-400 font-mono">
                                                {tx.gateway}
                                            </td>
                                            <td className="p-3.5">
                                                {tx.status === 'success' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                                                        <CheckCircle2 className="w-3 h-3" /> PAID
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">
                                                        <Clock className="w-3 h-3" /> PENDING
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3.5 text-right">
                                                <a
                                                    href={`/invoices/${tx.invoice_number || tx.id}/download`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 font-medium text-xs transition-all"
                                                    title="Download Official PDF Tax Invoice"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
