import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { usePage, useForm } from '@inertiajs/react';
import { CreditCard, Zap, FileText, Download, Clock, CheckCircle2, ChevronRight, SlidersHorizontal, Wallet } from 'lucide-react';

export default function Topup({ packages = [], transactions = [], customTopup }) {
    const { auth, company } = usePage().props;
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        package_id: packages[0]?.id || 'custom',
        custom_credits: 1000,
        gateway: 'credit_card',
    });
    const isCustom = data.package_id === 'custom';
    const selectedPackage = packages.find(pkg => pkg.id === data.package_id);
    const customCredits = Number(data.custom_credits);
    const validCustomCredits = /^\d+$/.test(String(data.custom_credits))
        && Number.isInteger(customCredits)
        && customCredits >= customTopup.min_credits;
    const credits = isCustom ? (validCustomCredits ? customCredits : 0) : Number(selectedPackage?.game_credits || 0);
    const amount = isCustom ? credits / customTopup.credits_per_usd : Number(selectedPackage?.fiat_amount || 0);
    const selectPackage = (id) => {
        setData('package_id', id);
        clearErrors();
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isCustom && !validCustomCredits) return;
        post('/topup/order');
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-10">
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-3">
                        <p className="label-tech text-cyan-400 flex items-center gap-2"><Zap className="w-4 h-4" /> StreetForge credits</p>
                        <h1 className="font-display font-extrabold uppercase text-5xl sm:text-6xl text-white leading-none">Fuel your next upgrade.</h1>
                        <p className="text-sm text-slate-400 max-w-lg">Choose a bonus bundle or buy exactly the credits you need.</p>
                    </div>
                    <div className="border-l-2 border-cyan-400 pl-4 shrink-0">
                        <p className="label-tech text-slate-400 flex items-center gap-2"><Wallet className="w-3.5 h-3.5" /> Your balance</p>
                        <p className="numeric font-bold text-3xl text-white">{Number(auth?.user?.game_balance || 0).toLocaleString()} <span className="text-sm text-slate-400">CR</span></p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <h2 className="font-display font-bold uppercase text-3xl text-white">Top Values</h2>
                        <p className="text-xs text-slate-400">Bonus credits included in every bundle</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {packages.map(pkg => {
                            const selected = data.package_id === pkg.id;
                            const baseCredits = Number(pkg.fiat_amount) * customTopup.credits_per_usd;
                            return (
                                <button
                                    key={pkg.id}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => selectPackage(pkg.id)}
                                    className={`relative overflow-hidden text-left rounded-2xl border p-6 flex flex-col gap-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${selected ? 'bg-cyan-950/30 border-cyan-400' : 'bg-carbon-900 border-white/10 hover:border-white/30'}`}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="label-tech text-slate-400">{pkg.popular ? 'Popular pick' : 'Best value'}</span>
                                        <span className="text-xs font-bold text-orange-300 bg-orange-400/10 rounded-md px-2 py-1">+{pkg.bonus_percent}% bonus</span>
                                    </div>
                                    <div>
                                        <p className="numeric text-5xl font-bold text-white leading-none">{Number(pkg.game_credits).toLocaleString()} <span className="text-lg text-cyan-400">CR</span></p>
                                        <p className="text-xs text-slate-400 mt-3">{baseCredits.toLocaleString()} + <span className="text-orange-300">{(Number(pkg.game_credits) - baseCredits).toLocaleString()} bonus CR</span></p>
                                        <p className="text-sm text-slate-300 mt-4">{pkg.name}</p>
                                    </div>
                                    <div className="border-t border-white/10 pt-5 mt-auto flex items-center justify-between gap-3">
                                        <p className="numeric text-3xl font-bold text-white">${Number(pkg.fiat_amount).toFixed(2)} <span className="text-xs font-sans font-normal text-slate-400">USD</span></p>
                                        <span className={`inline-flex items-center gap-2 text-xs font-semibold ${selected ? 'text-cyan-400' : 'text-slate-400'}`}>
                                            {selected ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border border-slate-600" />}
                                            {selected ? 'Selected' : 'Select'}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                        <div className={`rounded-2xl border p-6 flex flex-col gap-5 ${isCustom ? 'bg-cyan-950/30 border-cyan-400' : 'bg-carbon-900 border-white/10'}`}>
                            <button type="button" aria-pressed={isCustom} onClick={() => selectPackage('custom')} className="flex items-center justify-between gap-3 text-left rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
                                <span className="label-tech text-cyan-400 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Custom amount</span>
                                {isCustom ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <span className="w-4 h-4 rounded-full border border-slate-600" />}
                            </button>
                            <div className="space-y-3">
                                <label htmlFor="custom-credits" className="block text-sm text-white font-semibold">How many credits?</label>
                                <div className="relative">
                                    <input
                                        id="custom-credits"
                                        type="number"
                                        inputMode="numeric"
                                        min={isCustom ? customTopup.min_credits : undefined}
                                        step={isCustom ? '1' : 'any'}
                                        required={isCustom}
                                        disabled={processing}
                                        value={data.custom_credits}
                                        onFocus={() => { if (!isCustom) selectPackage('custom'); }}
                                        onChange={event => { setData({ ...data, package_id: 'custom', custom_credits: event.target.value }); clearErrors(); }}
                                        aria-describedby="custom-help custom-error"
                                        aria-invalid={isCustom && (!!errors.custom_credits || !validCustomCredits)}
                                        className="w-full rounded-xl bg-carbon-950 border border-white/15 pl-4 pr-12 py-3 numeric text-3xl font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">CR</span>
                                </div>
                                <p id="custom-help" className="text-xs text-slate-400 leading-relaxed">From {customTopup.min_credits.toLocaleString()} CR · No upper limit<br />$1 = {customTopup.credits_per_usd} CR · No bonus credits.</p>
                                <p id="custom-error" className="text-xs text-red-400" role="status">{isCustom && (errors.custom_credits || (!validCustomCredits ? `Enter a whole number of at least ${customTopup.min_credits} credits.` : ''))}</p>
                            </div>
                            <div className="border-t border-white/10 pt-5 mt-auto flex items-center justify-between gap-3">
                                <p className="numeric text-3xl font-bold text-white">${(validCustomCredits ? customCredits / customTopup.credits_per_usd : 0).toFixed(2)} <span className="text-xs font-sans font-normal text-slate-400">USD</span></p>
                                <span className="text-xs text-slate-400">Your choice</span>
                            </div>
                        </div>
                    </div>
                    {errors.package_id && <p role="alert" className="text-sm text-red-400">{errors.package_id}</p>}
                    {errors.gateway && <p role="alert" className="text-sm text-red-400">{errors.gateway}</p>}

                    <div className="rounded-2xl border border-white/10 bg-carbon-900 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-white font-semibold text-sm"><CreditCard className="w-5 h-5 text-cyan-400" /> Credit / debit card</div>
                            <div className="flex items-center gap-3">
                                <img src="/images/payments/visa.png" alt="Visa" className="h-5 w-auto object-contain" />
                                <img src="/images/payments/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                                <span className="text-xs text-slate-400">PDF receipt after payment</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                            <div aria-live="polite" className="sm:text-right">
                                <p className="text-sm text-white font-semibold">{credits.toLocaleString()} CR</p>
                                <p className="text-xs text-slate-400 mt-1">Total: ${amount.toFixed(2)} USD</p>
                            </div>
                            <button type="submit" disabled={processing || (isCustom && !validCustomCredits)} className="rounded-xl bg-cyan-400 hover:bg-cyan-300 px-6 py-4 text-carbon-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed">
                                {processing ? 'Opening checkout…' : `Continue · $${amount.toFixed(2)}`}<ChevronRight className="w-4 h-4" />
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
