import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { usePage, router, Link } from '@inertiajs/react';
import { 
    CreditCard, 
    ShieldCheck, 
    FileText, 
    CheckCircle2, 
    Zap, 
    Lock, 
    ChevronLeft,
    Building2,
    RefreshCw
} from 'lucide-react';

export default function Checkout({ transaction, company }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [isProcessing, setIsProcessing] = useState(false);
    const [webhookSimulated, setWebhookSimulated] = useState(false);

    const handlePay = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        router.post(`/topup/checkout/${transaction.transaction_ref}/pay`);
    };

    const handleSimulateWebhook = async () => {
        try {
            const res = await window.axios.post('/topup/webhook', {
                transaction_ref: transaction.transaction_ref,
                event: 'payment_intent.succeeded',
                amount: transaction.fiat_amount,
            });
            setWebhookSimulated(true);
            setTimeout(() => {
                router.visit('/topup');
            }, 1500);
        } catch (err) {
            console.error('Webhook simulation error:', err);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-8">
                
                {/* Back link */}
                <Link
                    href="/topup"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> Return to Top-Up Packages
                </Link>

                {/* Checkout Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
                    
                    {/* Header */}
                    <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyan-400">
                                Secure Checkout Portal
                            </div>
                            <h1 className="text-2xl font-orbitron font-extrabold text-white mt-1">
                                Complete Top-Up Order
                            </h1>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                            <Lock className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Order Breakdown */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs">
                        <div className="flex items-center justify-between text-slate-400">
                            <span>Transaction Reference:</span>
                            <span className="font-mono text-slate-200">{transaction.transaction_ref}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                            <span>Invoice Number:</span>
                            <span className="font-mono text-cyan-400 font-semibold">{transaction.invoice_number}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                            <span>Credits to Receive:</span>
                            <span className="font-orbitron font-bold text-cyan-400 text-sm">+{Number(transaction.game_credits).toLocaleString()} CR</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                            <span>Payment Method:</span>
                            <span className="capitalize font-semibold text-white">{transaction.gateway?.replace('_', ' ')}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
                            <span>Total Due:</span>
                            <span className="font-orbitron text-base text-cyan-400">
                                ${Number(transaction.fiat_amount).toFixed(2)} {transaction.currency}
                            </span>
                        </div>
                    </div>

                    {/* Mock Card Input Details */}
                    <form onSubmit={handlePay} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-slate-300">
                                Card Information (Simulated Sandbox)
                            </h3>
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/payments/visa.png"
                                    alt="Visa"
                                    className="h-4 w-auto object-contain brightness-110"
                                />
                                <img
                                    src="/images/payments/mastercard.png"
                                    alt="Mastercard"
                                    className="h-5 w-auto object-contain brightness-110"
                                />
                                <img
                                    src="/images/payments/pci-dss.png"
                                    alt="PCI DSS"
                                    className="h-4 w-auto object-contain brightness-110"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Cardholder Name</label>
                            <input
                                type="text"
                                defaultValue={user?.full_name || 'Alex Rider'}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Card Number</label>
                            <div className="relative">
                                <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    defaultValue="4242 •••• •••• 4242"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    defaultValue="12/28"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">CVC / CVV</label>
                                <input
                                    type="text"
                                    defaultValue="888"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isProcessing ? (
                                <>Processing Transaction & Generating PDF Invoice...</>
                            ) : (
                                <>Authorize & Pay ${Number(transaction.fiat_amount).toFixed(2)} USD</>
                            )}
                        </button>
                    </form>

                    {/* Webhook Testing Helper Box */}
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Gateway Webhook Simulation
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">POST /topup/webhook</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Simulate an asynchronous server-to-server webhook delivery from Stripe/Adyen to verify automated balance crediting and email invoice dispatch.
                        </p>
                        <button
                            type="button"
                            onClick={handleSimulateWebhook}
                            disabled={webhookSimulated}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-semibold transition-all"
                        >
                            {webhookSimulated ? '✓ Webhook Dispatched!' : 'Trigger Async Webhook'}
                        </button>
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
