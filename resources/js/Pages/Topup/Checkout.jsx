import React, { useEffect } from 'react';
import { t, locale, formatMoney } from '../../localization';
import AppLayout from '../../Layouts/AppLayout';
import { useForm, usePoll, Link } from '@inertiajs/react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ChevronLeft, ArrowUpRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function Checkout({ transaction, paymentAvailable, returned }) {
    const form = useForm({});
    const pending = transaction.status === 'pending';
    const paid = transaction.status === 'success';
    const { start, stop } = usePoll(4000, { only: ['transaction'] }, { autoStart: false });

    useEffect(() => {
        if (pending && (returned || transaction.payment_requested_at)) start();
        else stop();
        return stop;
    }, [pending, returned, transaction.payment_requested_at, start, stop]);

    function handlePay(event) {
        event.preventDefault();
        form.post(`/topup/checkout/${transaction.transaction_ref}/pay`);
    }

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/topup" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                    <ChevronLeft className="w-4 h-4" />{t('Return to Top-Up Packages')}
                </Link>
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
                    <div className="border-b border-slate-800 pb-6 flex items-center justify-between gap-4">
                        <div>
                            <div className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyan-400">{t('Secure Checkout Portal')}</div>
                            <h1 className="text-2xl font-orbitron font-extrabold text-white mt-1">{t(paid ? 'Payment confirmed' : 'Complete Top-Up Order')}</h1>
                        </div>
                        <Lock className="w-6 h-6 shrink-0 text-cyan-400" />
                    </div>

                    <dl className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 text-sm">
                        {[
                            ['Transaction Reference:', transaction.transaction_ref],
                            ['Credits to Receive:', `${Number(transaction.game_credits).toLocaleString(locale())} CR`],
                            ['Payment Method:', t('Credit / Debit Card')],
                            ['Total Due:', formatMoney(transaction.fiat_amount, transaction.currency)],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-4 flex-wrap">
                                <dt className="text-slate-400">{t(label)}</dt>
                                <dd className="text-white font-semibold break-all">{value}</dd>
                            </div>
                        ))}
                    </dl>

                    {paid ? (
                        <div className="space-y-4 text-emerald-300" role="status">
                            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="w-5 h-5" />{t('Your credits have been added to your wallet.')}</div>
                            {transaction.invoice_path && <a href={`/invoices/${transaction.invoice_number}/download`} className="inline-flex items-center gap-2 underline underline-offset-4">{t('Download invoice')}<ArrowUpRight className="w-4 h-4" /></a>}
                        </div>
                    ) : !pending ? (
                        <div className="space-y-3 text-slate-300" role="status">
                            <p>{t(transaction.status === 'refunded' ? 'This payment has been refunded.' : 'This payment was declined, cancelled or expired. No credits have been added.')}</p>
                            <Link href="/topup" className="text-cyan-400 underline underline-offset-4">{t('Return to Top-Up Packages')}</Link>
                        </div>
                    ) : (
                        <>
                            {(returned || transaction.payment_requested_at) && (
                                <div className="flex gap-3 text-sm text-cyan-200 bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-4" role="status">
                                    <RefreshCw className="w-5 h-5 shrink-0" />
                                    <p>{t('Waiting for payment confirmation. Credits will appear after the payment provider confirms your payment. You can safely leave this page.')}</p>
                                </div>
                            )}
                            <div className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                                <ShieldCheck className="w-6 h-6 shrink-0 text-cyan-400" />
                                <p>{t('Continue to the secure payment page to enter your card details. Your card information is handled by the payment provider and never reaches StreetForge.')}</p>
                            </div>
                            {!paymentAvailable ? (
                                <p className="text-sm text-amber-300 flex gap-2" role="alert"><AlertCircle className="w-5 h-5 shrink-0" />{t('Card payments are temporarily unavailable. Please try again later.')}</p>
                            ) : (
                                <form onSubmit={handlePay}>
                                    <button type="submit" disabled={form.processing} className="w-full py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-950 font-orbitron font-extrabold text-sm flex items-center justify-center gap-2 transition-colors">
                                        <CreditCard className="w-5 h-5" />
                                        {t(form.processing ? 'Opening secure payment...' : 'Continue to secure payment')}
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
