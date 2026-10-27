import React, { useEffect, useId, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { t } from '../localization';

const LANGUAGE_CODES = { en: 'EN', nb: 'NO', sv: 'SV' };

function LanguagePicker({ preferences, token }) {
    const [open, setOpen] = useState(false);
    const root = useRef(null);
    const trigger = useRef(null);
    const options = useRef([]);
    const menuId = useId();
    const languages = Object.entries(preferences.locales);
    const selectedIndex = languages.findIndex(([code]) => code === preferences.locale);

    useEffect(() => {
        if (!open) return;
        function outside(event) {
            if (!root.current?.contains(event.target)) setOpen(false);
        }
        document.addEventListener('pointerdown', outside);
        return () => document.removeEventListener('pointerdown', outside);
    }, [open]);

    useEffect(() => {
        if (open) options.current[selectedIndex]?.focus();
    }, [open, selectedIndex]);

    function close() {
        setOpen(false);
        trigger.current?.focus();
    }

    function handleKeys(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
        } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const index = options.current.indexOf(document.activeElement);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? languages.length - 1
                : (index + (event.key === 'ArrowDown' ? 1 : -1) + languages.length) % languages.length;
            options.current[next]?.focus();
        }
    }

    return (
        <div ref={root} className="relative" onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}>
            <button
                ref={trigger}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={`${t('Language')}: ${preferences.locales[preferences.locale]}`}
                onClick={() => setOpen(value => !value)}
                onKeyDown={event => {
                    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
                        event.preventDefault();
                        setOpen(true);
                    } else if (event.key === 'Escape') close();
                }}
                className={`group inline-flex min-h-11 items-center gap-2.5 border-x px-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none ${open ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200' : 'border-white/5 text-slate-300 hover:border-cyan-400/20 hover:bg-white/5 hover:text-white'}`}
            >
                <Globe2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="font-mono text-xs font-semibold tracking-wider">{LANGUAGE_CODES[preferences.locale] ?? preferences.locale.toUpperCase()}</span>
                <span className="hidden text-xs sm:inline">{preferences.locales[preferences.locale]}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180 text-cyan-400' : ''}`} aria-hidden="true" />
            </button>

            <div
                className={`absolute right-0 top-full z-[60] w-60 origin-top-right pt-2 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-1 scale-95 opacity-0'}`}
                inert={!open}
                aria-hidden={!open}
            >
                <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-carbon-900 shadow-[0_18px_50px_rgba(0,0,0,0.65)]">
                    <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                        <Globe2 className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                        <span className="label-tech text-slate-400">{t('Language')}</span>
                    </div>
                    <div id={menuId} role="menu" aria-label={t('Language')} onKeyDown={handleKeys} className="space-y-1 p-1.5">
                        {languages.map(([code, label], index) => {
                            const selected = code === preferences.locale;
                            return (
                                <form key={code} method="post" action="/preferences" role="none">
                                    <input type="hidden" name="_token" value={token} />
                                    <input type="hidden" name="locale" value={code} />
                                    <button
                                        ref={node => { options.current[index] = node; }}
                                        type="submit"
                                        role="menuitemradio"
                                        aria-checked={selected}
                                        tabIndex={open ? 0 : -1}
                                        onClick={event => {
                                            if (selected) {
                                                event.preventDefault();
                                                close();
                                            }
                                        }}
                                        className={`group flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none ${selected ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-300 hover:bg-white/5 hover:text-white focus:bg-white/5'}`}
                                    >
                                        <span className={`flex h-7 w-9 shrink-0 items-center justify-center rounded border font-mono text-[10px] font-semibold tracking-wider ${selected ? 'border-cyan-400/30 text-cyan-300' : 'border-white/10 text-slate-500 group-hover:text-slate-300'}`}>{LANGUAGE_CODES[code] ?? code.toUpperCase()}</span>
                                        <span className="flex-1 text-sm font-medium">{label}</span>
                                        {selected && <Check className="h-4 w-4 text-cyan-400" aria-hidden="true" />}
                                    </button>
                                </form>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SitePreferences() {
    const { preferences } = usePage().props;
    const singleCurrency = Object.keys(preferences.currencies).length === 1;
    const token = typeof document === 'undefined' ? undefined : document.querySelector('meta[name="csrf-token"]')?.content;

    return (
        <div className="border-b border-white/5 bg-carbon-950">
            <div className="mx-auto flex min-h-11 max-w-7xl items-center justify-end gap-4 px-5 text-xs text-slate-400 sm:px-6 lg:px-8">
                <LanguagePicker preferences={preferences} token={token} />
                {singleCurrency ? (
                    <span className="flex items-center gap-2"><span className="hidden sm:inline">{t('Currency')}</span><span className="font-mono text-xs text-slate-300">{preferences.currency}</span></span>
                ) : (
                    <form method="post" action="/preferences" className="flex items-center gap-2">
                        <input type="hidden" name="_token" value={token} />
                        <label htmlFor="site-currency">{t('Currency')}</label>
                        <select id="site-currency" name="currency" value={preferences.currency} onChange={event => event.currentTarget.form.requestSubmit()} className="rounded border border-white/15 bg-carbon-900 px-2 py-1 text-white focus:outline-cyan-400">
                            {Object.keys(preferences.currencies).map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                    </form>
                )}
            </div>
        </div>
    );
}
