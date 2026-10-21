import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Check, CreditCard, MapPin, Save, User } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import { t } from '../../localization';

const inputClass = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60';

function Field({ name, label, form, type = 'text', autoComplete, maxLength = 255, children }) {
    const error = form.errors[name];
    const props = {
        id: `profile-${name}`, name, required: true, value: form.data[name],
        onChange: event => form.setData(name, event.target.value),
        autoComplete, className: inputClass, disabled: form.processing,
        'aria-invalid': Boolean(error), 'aria-describedby': error ? `error-${name}` : undefined,
    };

    return (
        <div className="space-y-1.5">
            <label htmlFor={props.id} className="block text-sm font-medium text-slate-300">{t(label)}</label>
            {children ? <select {...props}>{children}</select> : <input {...props} type={type} maxLength={maxLength} />}
            {error && <p id={`error-${name}`} className="text-sm text-red-400">{t(error)}</p>}
        </div>
    );
}

export default function Edit({ profile, countries, updateUrl }) {
    const { auth } = usePage().props;
    const form = useForm({
        name: profile.name ?? '', surname: profile.surname ?? '',
        email: profile.email ?? '', phone: profile.phone ?? '',
        street: profile.street ?? '', city: profile.city ?? '',
        country: profile.country ?? '', post_code: profile.post_code ?? '',
        current_password: '',
    });
    const emailChanged = form.data.email !== profile.email;

    function submit(event) {
        event.preventDefault();
        form.patch(updateUrl, {
            preserveScroll: true,
            onSuccess: () => form.defaults({ ...form.data, current_password: '' }),
            onFinish: () => form.reset('current_password'),
        });
    }

    return (
        <AppLayout>
            <Head title={t('My profile')} />
            <div className="mx-auto max-w-5xl space-y-8">
                <header className="border-b border-white/10 pb-6">
                    <p className="label-tech mb-2 text-cyan-400">{t('Driver account')}</p>
                    <h1 className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">{t('My profile')}</h1>
                    <p className="mt-3 text-sm text-slate-400">{t('Manage your personal details and billing address.')}</p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <aside className="space-y-5 border-l-2 border-cyan-400 bg-slate-900/60 p-5">
                        <User className="h-7 w-7 text-cyan-400" aria-hidden="true" />
                        <div>
                            <p className="break-words font-display text-lg font-bold text-white">{auth.user.name} {auth.user.surname}</p>
                            <p className="mt-1 break-all text-xs text-slate-400">{auth.user.email}</p>
                        </div>
                        <Link href="/topup" className="flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-cyan-400 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-400">
                            <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />{t('Top-Up & Invoices')}
                        </Link>
                    </aside>

                    <form onSubmit={submit} className="space-y-6">
                        <fieldset disabled={form.processing} className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
                            <legend className="sr-only">{t('Personal details')}</legend>
                            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white"><User className="h-5 w-5 text-cyan-400" aria-hidden="true" />{t('Personal details')}</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field name="name" label="First name" form={form} autoComplete="given-name" />
                                <Field name="surname" label="Surname" form={form} autoComplete="family-name" />
                                <Field name="email" label="Email address" type="email" form={form} autoComplete="email" />
                                <Field name="phone" label="Phone number" type="tel" form={form} autoComplete="tel" maxLength={30} />
                            </div>
                            {emailChanged && (
                                <div className="space-y-3 border-t border-slate-800 pt-4">
                                    <p className="text-sm text-slate-400">{t('Enter your current password to change your email address.')}</p>
                                    <Field name="current_password" label="Current password" type="password" form={form} autoComplete="current-password" />
                                </div>
                            )}
                        </fieldset>

                        <fieldset disabled={form.processing} className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
                            <legend className="sr-only">{t('Billing address')}</legend>
                            <div>
                                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white"><MapPin className="h-5 w-5 text-cyan-400" aria-hidden="true" />{t('Billing address')}</h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t('Used for your next purchases and invoices. Existing orders keep their original billing details.')}</p>
                            </div>
                            <Field name="street" label="Street, house number, apartment" form={form} autoComplete="street-address" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field name="city" label="City" form={form} autoComplete="address-level2" />
                                <Field name="post_code" label="Postal code" form={form} autoComplete="postal-code" maxLength={20} />
                            </div>
                            <Field name="country" label="Country" form={form} autoComplete="country-name">
                                <option value="">{t('Select Country')}</option>
                                {countries.map(country => <option key={country} value={country}>{t(country)}</option>)}
                            </Field>
                        </fieldset>

                        <div className="flex flex-wrap items-center gap-4">
                            <button type="submit" disabled={form.processing} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 disabled:cursor-wait disabled:opacity-60">
                                <Save className="h-4 w-4" aria-hidden="true" />{t(form.processing ? 'Saving...' : 'Save changes')}
                            </button>
                            <span role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-emerald-400">
                                {form.recentlySuccessful && <><Check className="h-4 w-4" aria-hidden="true" />{t('Profile updated.')}</>}
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
