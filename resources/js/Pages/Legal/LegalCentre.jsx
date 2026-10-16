import { t } from '../../localization';
import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, ChevronRight, Lock, ShieldCheck } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import { LEGAL_GROUPS } from '../../Components/Legal/legalDocs';

export default function LegalCentre() {
    return (
        <PublicLayout>
            <section className="relative overflow-hidden border-b border-white/[0.06] bg-carbon-weave">
                <div className="absolute inset-0 vignette pointer-events-none" />
                <div className="absolute -top-40 left-[-10%] w-[36rem] h-[36rem] rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
                    <nav className="flex items-center gap-2 label-tech text-slate-600 mb-10">
                        <Link href="/" className="hover:text-slate-300 transition-colors">{t("Home")}</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-400">{t("Legal Centre")}</span>
                    </nav>
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-white/15" />
                            <span className="label-tech text-cyan-300/90">{t("Policies · Agreements · Compliance")}</span>
                        </div>
                        <h1 className="headline text-5xl sm:text-6xl lg:text-7xl text-white">{t("Legal ")}<span className="text-cyan-400">{t("Centre")}</span>
                        </h1>
                        <p className="text-slate-400 text-[15px] sm:text-base leading-relaxed">{t("Every rule, policy and agreement that applies to StreetForge, in one place. Written to be read — each document starts with a plain-English summary and lists exactly who to contact. ")}</p>
                    </div>
                </div>
            </section>

            {/* Payment highlight */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 -mt-px">
                <Link
                    href="/payment-security"
                    className="group mt-12 surface-raised notch-both p-6 sm:p-8 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center hover:border-emerald-400/30 transition-colors"
                >
                    <div className="w-12 h-12 border border-emerald-400/30 bg-emerald-400/[0.06] flex items-center justify-center text-emerald-400">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="label-tech text-emerald-400/90 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />{t(" PCI DSS Level 1 · Hosted payment page")}</div>
                        <div className="headline text-2xl sm:text-3xl text-white">{t("Your card never touches our servers")}</div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{t("Top-ups redirect you to a secure payment page run by a PCI DSS Level 1 certified provider, with 3-D Secure. See exactly how it works. ")}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 label-tech text-cyan-300 group-hover:text-white transition-colors">{t("Read more ")}<ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-20 space-y-16">
                {LEGAL_GROUPS.map((g, gi) => (
                    <section key={g.key}>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="label-tech text-slate-600 numeric">{t(String(gi + 1).padStart(2, '0'))}</span>
                            <span className="h-px w-8 bg-white/15" />
                            <h2 className="label-tech text-cyan-300/90">{t(g.title)}</h2>
                            <span className="h-px flex-1 bg-white/[0.06]" />
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {g.docs.map((d) => (
                                <Link key={d.href} href={d.href} className="group surface notch-tr p-5 flex flex-col gap-3 lift hover:border-white/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="label-tech text-slate-600 numeric">{t(d.code)}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <div className="font-display font-bold uppercase tracking-wide text-lg text-white group-hover:text-cyan-300 transition-colors leading-tight">
                                        {t(d.label)}
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{t(d.blurb)}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </PublicLayout>
    );
}
