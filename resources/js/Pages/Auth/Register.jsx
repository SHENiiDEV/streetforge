import React, { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useForm, Link, usePage } from '@inertiajs/react';
import { ShieldAlert, User, Mail, Lock, Phone, Calendar, MapPin, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

const ALL_COUNTRIES = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Cyprus', 'Canada', 'Australia', 
    'Netherlands', 'Spain', 'Italy', 'Japan', 'South Korea', 'Singapore', 'United Arab Emirates',
    'Switzerland', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Austria', 'Belgium', 'Ireland', 
    'New Zealand', 'Poland', 'Czech Republic', 'Portugal', 'Greece', 'Estonia', 'Latvia', 
    'Lithuania', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'India', 'South Africa',
    // Blacklisted entries for testing / validation notice
    'Sudan', 'Democratic Republic of the Congo', 'Iran', 'Mali', 'Myanmar (Burma)', 
    'North Korea', 'South Sudan', 'Syria', 'Yemen', 'Afghanistan', 'Belarus', 
    'Central African Republic', 'Cuba', 'Haiti', 'Iraq', 'Russia', 'Somalia', 
    'Venezuela', 'Zimbabwe'
];

export default function Register({ blacklistedCountries = [] }) {
    const { sanctions } = usePage().props;
    const blacklist = blacklistedCountries.length > 0 
        ? blacklistedCountries 
        : (sanctions?.blacklisted_countries || []);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        surname: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        dob: '',
        street: '',
        city: '',
        country: 'Germany',
        post_code: '',
        terms: false,
    });

    const [sanctionWarning, setSanctionWarning] = useState(false);

    // Filter country list to strictly exclude sanctioned countries on frontend
    const allowedCountries = ALL_COUNTRIES.filter(
        c => !blacklist.some(b => b.toLowerCase() === c.toLowerCase())
    ).sort();

    const handleCountryChange = (val) => {
        setData('country', val);
        const isRestricted = blacklist.some(b => b.toLowerCase() === val.toLowerCase());
        setSanctionWarning(isRestricted);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <PublicLayout>
            <div className="max-w-2xl mx-auto px-4 py-12">
                
                {/* Heading */}
                <div className="text-center space-y-3 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        ⚡ Official Driver Registration
                    </div>
                    <h1 className="text-3xl font-orbitron font-extrabold text-white">
                        Create Your <span className="text-cyan-400">Racer Profile</span>
                    </h1>
                    <p className="text-xs text-slate-400">
                        Join the championship, receive a complimentary sports vehicle and 1,000 Starter Credits.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Section 1: Account & Credentials */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-2">
                                1. Personal & Contact Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Alex"
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600"
                                        />
                                    </div>
                                    {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Surname *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.surname}
                                        onChange={e => setData('surname', e.target.value)}
                                        placeholder="Rider"
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600"
                                    />
                                    {errors.surname && <div className="text-xs text-red-400 mt-1">{errors.surname}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="racer@example.com"
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600"
                                        />
                                    </div>
                                    {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+49 151 23456789"
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600"
                                        />
                                    </div>
                                    {errors.phone && <div className="text-xs text-red-400 mt-1">{errors.phone}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth * (Must be 16+)</label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                    <input
                                        type="date"
                                        required
                                        value={data.dob}
                                        onChange={e => setData('dob', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600"
                                    />
                                </div>
                                {errors.dob && <div className="text-xs text-red-400 mt-1">{errors.dob}</div>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                        <input
                                            type="password"
                                            required
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white"
                                        />
                                    </div>
                                    {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password *</label>
                                    <input
                                        type="password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Repeat password"
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-sm text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Address (4 Required Blocks) & Country Sanctions Check */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-cyan-400">
                                    2. Physical Residential Address
                                </h3>
                                <span className="text-[10px] text-slate-500 font-mono">Invoice Billing & Tax Compliance</span>
                            </div>

                            {/* Block 1: Street Address */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Street, House Number, Apt *</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        required
                                        value={data.street}
                                        onChange={e => setData('street', e.target.value)}
                                        placeholder="Friedrichstraße 43, Apt 12"
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600"
                                    />
                                </div>
                                {errors.street && <div className="text-xs text-red-400 mt-1">{errors.street}</div>}
                            </div>

                            {/* Block 2, 3, 4: City, Country, Post Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        placeholder="Berlin"
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600"
                                    />
                                    {errors.city && <div className="text-xs text-red-400 mt-1">{errors.city}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Country *</label>
                                    <select
                                        required
                                        value={data.country}
                                        onChange={e => handleCountryChange(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-sm text-white"
                                    >
                                        <option value="">Select Country</option>
                                        {allowedCountries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                    {errors.country && <div className="text-xs text-red-400 mt-1">{errors.country}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.post_code}
                                        onChange={e => setData('post_code', e.target.value)}
                                        placeholder="10117"
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600"
                                    />
                                    {errors.post_code && <div className="text-xs text-red-400 mt-1">{errors.post_code}</div>}
                                </div>
                            </div>

                            {/* Sanction Alert Banner if user selects/types restricted country */}
                            {sanctionWarning && (
                                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-xs text-red-200">
                                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block font-semibold">Sanctions Compliance Notice:</strong>
                                        Registration from this country is restricted under international compliance regulations. You cannot proceed with this selection.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Legal Terms Checkbox */}
                        <div className="pt-2 border-t border-slate-800 space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    checked={data.terms}
                                    onChange={e => setData('terms', e.target.checked)}
                                    className="mt-1 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 w-4 h-4"
                                />
                                <span className="text-xs text-slate-300 leading-normal">
                                    I confirm that I am at least 16 years old and I agree to the{' '}
                                    <Link href="/terms" target="_blank" className="text-cyan-400 hover:underline font-semibold">
                                        Terms & Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" target="_blank" className="text-cyan-400 hover:underline font-semibold">
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>
                            {errors.terms && <div className="text-xs text-red-400">{errors.terms}</div>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || sanctionWarning}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? 'Registering Driver...' : 'Complete Registration & Claim Starter Car'}
                            <ChevronRight className="w-4 h-4" />
                        </button>

                    </form>

                    {/* Footer note */}
                    <div className="mt-6 text-center text-xs text-slate-400">
                        Already have a racing license?{' '}
                        <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
                            Sign in here
                        </Link>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
