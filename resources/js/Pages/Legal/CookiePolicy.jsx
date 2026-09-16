import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, Link } from '@inertiajs/react';
import { 
    Cookie, 
    ShieldCheck, 
    Sliders, 
    Lock, 
    CheckCircle2, 
    FileText 
} from 'lucide-react';

export default function CookiePolicy() {
    const { company } = usePage().props;

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        <Cookie className="w-3.5 h-3.5" />
                        Privacy & Tracking Disclosure
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white tracking-tight">
                        Cookie <span className="text-cyan-400">Policy</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
                        Last Updated: September 16, 2026 &bull; Explaining how StreetForge uses essential and functional cookies for secure gameplay.
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed backdrop-blur-xl shadow-2xl">
                    
                    {/* Section 1 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">1.</span> What Are Cookies?
                        </h2>
                        <p>
                            Cookies are small text files placed on your computer or mobile device when you visit <code>streetforge.co.uk</code>. They enable the browser to remember your authentication state, security tokens, and user preferences across multiple page visits.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">2.</span> Cookies We Utilize
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-orbitron font-bold text-white text-xs">Strictly Essential & Security Cookies</span>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">Always Active</span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Required for secure login authentication, CSRF cross-site request forgery prevention, and user session management. The game cannot operate without these cookies.
                                </p>
                            </div>

                            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-orbitron font-bold text-white text-xs">Functional & Audio Preferences</span>
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">Functional</span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Remembers your chosen active vehicle, sound synthesizer mute preferences, and dyno category filter choices.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-3 pb-6 border-b border-slate-800">
                        <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="text-cyan-400">3.</span> Managing Cookie Preferences
                        </h2>
                        <p>
                            You can configure your browser to reject or alert you about cookies. Please note that disabling essential session cookies will prevent login to the Garage and Race Lobby.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-2 pt-2 text-xs text-slate-400">
                        <h3 className="font-orbitron font-bold text-white uppercase text-xs">
                            4. Inquiries
                        </h3>
                        <p>
                            For questions regarding our cookie practices, contact <a href="mailto:privacy@streetforge.co.uk" className="text-cyan-400 underline">privacy@streetforge.co.uk</a>.
                        </p>
                    </section>

                </div>

            </div>
        </PublicLayout>
    );
}
