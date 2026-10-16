import { t, locale } from '../../localization';
import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, ChevronRight, Mail, Printer, FileText } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';
import { ALL_DOCS, findDoc } from './legalDocs';

/* ═══════════════════════════════════════════════════════════════
   Company helper
   ═══════════════════════════════════════════════════════════════ */

export function useCompany() {
    const { company } = usePage().props;
    return {
        name: company?.name || 'StreetForge Ltd',
        number: company?.number || '14829103',
        address: company?.address || '128 City Road, London, EC1V 2NX, United Kingdom',
        email: company?.email || 'support@streetforge.co.uk',
    };
}

/* ═══════════════════════════════════════════════════════════════
   Prose primitives — keep every policy page visually identical
   ═══════════════════════════════════════════════════════════════ */

export function P({ children, muted = false }) {
    return (
        <p className={`text-[15px] leading-[1.75] ${muted ? 'text-slate-500' : 'text-slate-300'}`}>
            {t(children)}
        </p>
    );
}

export function H3({ children }) {
    return (
        <h3 className="font-display font-bold uppercase tracking-wide text-lg text-white pt-2">
            {t(children)}
        </h3>
    );
}

export function List({ items, ordered = false }) {
    const Tag = ordered ? 'ol' : 'ul';
    return (
        <Tag className="space-y-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-slate-400">
                    <span className={`shrink-0 mt-[0.15rem] ${ordered ? 'numeric text-cyan-400 text-sm w-5' : ''}`}>
                        {ordered ? String(i + 1).padStart(2, '0') : <span className="block w-1.5 h-1.5 mt-[0.45rem] bg-cyan-400/70 rotate-45" />}
                    </span>
                    <span>{t(item)}</span>
                </li>
            ))}
        </Tag>
    );
}

const CALLOUT_TONES = {
    cyan: 'border-cyan-400/40 bg-cyan-400/[0.05] text-cyan-100',
    ember: 'border-orange-400/40 bg-orange-400/[0.05] text-orange-100',
    mint: 'border-emerald-400/40 bg-emerald-400/[0.05] text-emerald-100',
    red: 'border-red-400/40 bg-red-400/[0.05] text-red-100',
    neutral: 'border-white/15 bg-white/[0.025] text-slate-300',
};

export function Callout({ title, children, tone = 'cyan', icon: Icon }) {
    return (
        <div className={`border-l-2 px-5 py-4 space-y-1.5 ${CALLOUT_TONES[tone]}`}>
            {title && (
                <div className="flex items-center gap-2 label-tech opacity-90">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {t(title)}
                </div>
            )}
            <div className="text-[14px] leading-relaxed opacity-90">{t(children)}</div>
        </div>
    );
}

export function KV({ rows }) {
    return (
        <dl className="surface divide-y divide-white/[0.06]">
            {rows.map(([k, v]) => (
                <div key={k} className="grid sm:grid-cols-[13rem_1fr] gap-1 sm:gap-6 px-5 py-3.5">
                    <dt className="label-tech text-slate-500 pt-0.5">{t(k)}</dt>
                    <dd className="text-sm text-slate-300 leading-relaxed">{t(v)}</dd>
                </div>
            ))}
        </dl>
    );
}

export function Table({ head, rows }) {
    return (
        <div className="surface overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[34rem]">
                <thead>
                    <tr className="border-b border-white/[0.08]">
                        {head.map((h) => (
                            <th key={h} className="label-tech text-slate-500 px-5 py-3 font-bold">{t(h)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                    {rows.map((r, i) => (
                        <tr key={i}>
                            {r.map((c, j) => (
                                <td key={j} className={`px-5 py-3.5 align-top leading-relaxed ${j === 0 ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                                    {t(c)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/** Numbered horizontal/vertical flow — used for payment & complaint journeys */
export function Steps({ steps }) {
    return (
        <ol className="grid gap-px bg-white/[0.06] border border-white/[0.07] sm:grid-cols-2">
            {steps.map((s, i) => (
                <li key={i} className="bg-carbon-900 p-5 space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                        <span className="numeric text-2xl font-bold text-cyan-400">{t(String(i + 1).padStart(2, '0'))}</span>
                        {s.tag && <span className="label-tech text-slate-600">{t(s.tag)}</span>}
                    </div>
                    <div className="font-display font-bold uppercase tracking-wide text-white">{t(s.title)}</div>
                    <p className="text-[13.5px] text-slate-400 leading-relaxed">{t(s.text)}</p>
                </li>
            ))}
        </ol>
    );
}

export function Cards({ items, cols = 3 }) {
    const grid = cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
    return (
        <div className={`grid gap-4 ${grid}`}>
            {items.map(({ icon: Icon, title, text, tone = 'text-cyan-400' }) => (
                <div key={title} className="surface notch-tr p-5 space-y-3">
                    {Icon && (
                        <div className={`w-9 h-9 border border-white/[0.08] flex items-center justify-center ${tone}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    <div className="font-display font-bold uppercase tracking-wide text-white">{t(title)}</div>
                    <p className="text-[13.5px] text-slate-400 leading-relaxed">{t(text)}</p>
                </div>
            ))}
        </div>
    );
}

export function A({ href, children }) {
    const external = href.startsWith('mailto:') || href.startsWith('http');
    const cls = 'text-cyan-300 underline decoration-cyan-400/30 underline-offset-4 hover:decoration-cyan-300 transition-colors';
    return external ? <a href={href} className={cls}>{t(children)}</a> : <Link href={href} className={cls}>{t(children)}</Link>;
}

export function Code({ children }) {
    return <code className="font-mono text-[0.85em] text-cyan-200 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5">{t(children)}</code>;
}

/* ═══════════════════════════════════════════════════════════════
   Table of contents with scroll-spy
   ═══════════════════════════════════════════════════════════════ */

function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;
        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [ids.join('|')]);
    return active;
}

/* ═══════════════════════════════════════════════════════════════
   Shell
   ═══════════════════════════════════════════════════════════════ */

export default function LegalShell({
    href,
    eyebrow,
    title,
    accent,
    lead,
    updated = '13 Oct 2026',
    version = '1.0',
    sections = [],
    intro,
    related = [],
    hideToc = false,
    children,
}) {
    const company = useCompany();
    const doc = findDoc(href);
    const localizedHeading = doc && doc.group !== 'Company & Support' && locale() !== 'en' ? t(doc.label) : null;
    const headingSplit = localizedHeading?.lastIndexOf(' ') ?? -1;
    const ids = sections.map((s) => s.id);
    const active = useActiveSection(ids);
    const words = sections.length * 180;
    const readMins = Math.max(2, Math.round(words / 220));

    const relatedDocs = (related.length ? related : ALL_DOCS.filter((d) => d.href !== href && d.group === doc?.group))
        .map((r) => (typeof r === 'string' ? findDoc(r) : r))
        .filter(Boolean)
        .slice(0, 4);

    return (
        <PublicLayout>
            {/* ── Hero ── */}
            <section className="relative overflow-hidden border-b border-white/[0.06] bg-carbon-weave">
                <div className="absolute inset-0 vignette pointer-events-none" />
                <div className="absolute -top-40 right-[-10%] w-[36rem] h-[36rem] rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 pb-14 lg:pt-16 lg:pb-20">
                    <nav className="flex items-center gap-2 label-tech text-slate-600 mb-10">
                        <Link href="/" className="hover:text-slate-300 transition-colors">{t("Home")}</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/legal" className="hover:text-slate-300 transition-colors">{t("Legal Centre")}</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-400">{t(doc?.label || title)}</span>
                    </nav>

                    <div className="grid lg:grid-cols-12 gap-10 items-end">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex items-center gap-3">
                                {doc?.code && <span className="label-tech text-slate-600 numeric">{t(doc.code)}</span>}
                                <span className="h-px w-8 bg-white/15" />
                                <span className="label-tech text-cyan-300/90">{t(eyebrow)}</span>
                            </div>
                            <h1 className="headline text-5xl sm:text-6xl lg:text-7xl text-white text-balance">
                                {localizedHeading ? <>{headingSplit >= 0 ? localizedHeading.slice(0, headingSplit + 1) : ''}<span className="text-cyan-400">{localizedHeading.slice(headingSplit + 1)}</span></> : <>{t(title)} {accent && <span className="text-cyan-400">{t(accent)}</span>}</>}
                            </h1>
                            {lead && <p className="text-slate-400 text-[15px] sm:text-base leading-relaxed max-w-2xl">{t(lead)}</p>}
                        </div>

                        <div className="lg:col-span-4">
                            <dl className="surface notch-tr grid grid-cols-3 divide-x divide-white/[0.06]">
                                {[
                                    ['Updated', updated],
                                    ['Version', `v${version}`],
                                    ['Read', `${readMins} min`],
                                ].map(([k, v]) => (
                                    <div key={k} className="px-4 py-4 space-y-1.5">
                                        <dt className="label-tech text-slate-600">{t(k)}</dt>
                                        <dd className="numeric text-sm text-slate-200 leading-tight">{t(v)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Body ── */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
                    {!hideToc && sections.length > 0 && (
                        <aside className="lg:col-span-3">
                            <div className="lg:sticky lg:top-24 space-y-6">
                                <div className="surface p-5">
                                    <div className="label-tech text-slate-500 mb-4">{t("On this page")}</div>
                                    <ol className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1">
                                        {sections.map((s, i) => (
                                            <li key={s.id}>
                                                <a
                                                    href={`#${s.id}`}
                                                    className={`group flex gap-3 py-1.5 pl-3 border-l text-[13px] leading-snug transition-colors ${
                                                        active === s.id
                                                            ? 'border-cyan-400 text-white'
                                                            : 'border-white/[0.07] text-slate-500 hover:text-slate-200 hover:border-white/25'
                                                    }`}
                                                >
                                                    <span className={`numeric shrink-0 ${active === s.id ? 'text-cyan-400' : 'text-slate-700'}`}>
                                                        {t(String(i + 1).padStart(2, '0'))}
                                                    </span>
                                                    {t(s.title)}
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="hidden lg:flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 label-tech text-slate-500 hover:text-white transition-colors"
                                    >
                                        <Printer className="w-3.5 h-3.5" />{t(" Print / save as PDF ")}</button>
                                    <a href={`mailto:${company.email}`} className="flex items-center gap-2 label-tech text-slate-500 hover:text-white transition-colors">
                                        <Mail className="w-3.5 h-3.5" />{t(" Ask about this policy ")}</a>
                                </div>
                            </div>
                        </aside>
                    )}

                    <article className={`${hideToc || !sections.length ? 'lg:col-span-12' : 'lg:col-span-9'} min-w-0`}>
                        {intro && <div className="space-y-5 mb-14 max-w-3xl">{t(intro)}</div>}

                        <div className="space-y-16">
                            {sections.map((s, i) => (
                                <section key={s.id} id={s.id} className="scroll-mt-24 max-w-3xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="label-tech text-cyan-400 numeric">§ {t(String(i + 1).padStart(2, '0'))}</span>
                                        <span className="h-px flex-1 bg-white/[0.07]" />
                                    </div>
                                    <h2 className="headline text-3xl sm:text-4xl text-white mb-6 text-balance">{t(s.title)}</h2>
                                    <div className="space-y-5">{t(s.content)}</div>
                                </section>
                            ))}
                        </div>

                        {t(children)}

                        {/* Notice block */}
                        <div className="mt-20 surface-raised notch-both p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center max-w-3xl">
                            <div className="space-y-2">
                                <div className="label-tech text-cyan-300/90">{t("Questions about this document?")}</div>
                                <p className="text-sm text-slate-400 leading-relaxed">{t("Write to ")}<A href={`mailto:${company.email}`}>{company.email}</A>{t(" or by post to ")}{company.name},{t(' ')}
                                    {company.address}{t(". Company No. ")}<span className="numeric text-slate-300">{company.number}</span>.
                                </p>
                            </div>
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-2 h-11 px-5 bg-cyan-400 text-carbon-950 label-tech hover:bg-cyan-300 transition-colors"
                            >{t("Contact support ")}<ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </article>
                </div>
            </div>

            {/* ── Related ── */}
            {relatedDocs.length > 0 && (
                <section className="border-t border-white/[0.06] bg-carbon-925/60">
                    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
                        <div className="flex items-end justify-between gap-6 mb-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-white/15" />
                                    <span className="label-tech text-cyan-300/90">{t("Related documents")}</span>
                                </div>
                                <h2 className="headline text-3xl text-white">{t("Keep reading")}</h2>
                            </div>
                            <Link href="/legal" className="group inline-flex items-center gap-2 label-tech text-cyan-300 hover:text-white transition-colors shrink-0">{t("All policies ")}<ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedDocs.map((d) => (
                                <Link key={d.href} href={d.href} className="group surface notch-tr p-5 flex flex-col gap-3 lift hover:border-white/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="label-tech text-slate-600 numeric">{t(d.code)}</span>
                                        <FileText className="w-3.5 h-3.5 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <div className="font-display font-bold uppercase tracking-wide text-white group-hover:text-cyan-300 transition-colors">
                                        {t(d.label)}
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{t(d.blurb)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}

