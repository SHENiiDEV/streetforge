import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useForm, Link } from '@inertiajs/react';
import { Mail, Lock, LogIn, Zap, ChevronRight } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <PublicLayout>
            <div className="max-w-md mx-auto px-4 py-16">
                
                {/* Heading */}
                <div className="text-center space-y-3 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        Driver Authentication
                    </div>
                    <h1 className="text-3xl font-orbitron font-extrabold text-white">
                        Sign In to <span className="text-cyan-400">StreetForge</span>
                    </h1>
                    <p className="text-xs text-slate-400">
                        Access your garage, car collection, and circuit races.
                    </p>
                </div>


                {/* Form Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <form onSubmit={submit} className="space-y-4">
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="racer@streetforge.co.uk"
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600"
                                />
                            </div>
                            {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white"
                                />
                            </div>
                            {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
                                />
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-orbitron font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            <LogIn className="w-4 h-4" />
                            {processing ? 'Signing In...' : 'Sign In'}
                        </button>

                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        Don't have an account yet?{' '}
                        <Link href="/register" className="text-cyan-400 hover:underline font-semibold">
                            Register now
                        </Link>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
