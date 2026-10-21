import React from 'react';
import { usePage } from '@inertiajs/react';
import { t } from '../localization';

export default function SitePreferences() {
    const { preferences } = usePage().props;
    const singleCurrency = Object.keys(preferences.currencies).length === 1;
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    return (
        <div className="border-b border-white/5 bg-carbon-950">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-end gap-5 h-10 text-xs text-slate-400">
                {(singleCurrency ? ['locale'] : ['locale', 'currency']).map(preference => (
                    <form key={preference} method="post" action="/preferences" className="flex items-center gap-2">
                        <input type="hidden" name="_token" value={token} />
                        <label htmlFor={`site-${preference}`}>{t(preference === 'locale' ? 'Language' : 'Currency')}</label>
                        <select id={`site-${preference}`} name={preference} value={preferences[preference]} onChange={event => event.currentTarget.form.requestSubmit()} className="bg-carbon-900 text-white rounded border border-white/15 px-2 py-1 focus:outline-cyan-400">
                            {Object.entries(preference === 'locale' ? preferences.locales : preferences.currencies).map(([code, label]) => (
                                <option key={code} value={code}>{preference === 'locale' ? label : code}</option>
                            ))}
                        </select>
                    </form>
                ))}
                {singleCurrency && <span>{t('Currency')} <span className="ml-2 text-white">{preferences.currency}</span></span>}
            </div>
        </div>
    );
}
