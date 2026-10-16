import { t } from '../../localization';
import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    ArrowLeft, 
    Share2, 
    Bookmark, 
    ChevronRight, 
    Sparkles, 
    ShieldCheck, 
    CheckCircle2, 
    TrendingUp,
    FileText
} from 'lucide-react';

const CATEGORY_COLORS = {
    Championship: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
    Engineering: 'text-orange-400 bg-orange-950/80 border-orange-800',
    Spotlight: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
    'Patch Notes': 'text-purple-400 bg-purple-950/80 border-purple-800',
    Security: 'text-blue-400 bg-blue-950/80 border-blue-800',
    Esports: 'text-rose-400 bg-rose-950/80 border-rose-800',
};

export default function NewsShow({ article, related = [] }) {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
                
                {/* Back Link */}
                <div>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-xs font-orbitron font-bold text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />{t(" Back to News & Articles ")}</Link>
                </div>

                {/* Article Header */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-[10px] font-orbitron font-bold uppercase px-3 py-1 rounded-md border ${CATEGORY_COLORS[article.category] || 'text-cyan-400 bg-cyan-950 border-cyan-800'}`}>
                            {t(article.category)}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                            <Calendar className="w-3.5 h-3.5" /> {t(article.published_at)}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5" /> {t(article.read_time)}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-extrabold text-white tracking-tight leading-tight">
                        {t(article.title)}
                    </h1>

                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                        {t(article.excerpt)}
                    </p>

                    {/* Author Bar */}
                    <div className="flex items-center justify-between py-4 border-y border-slate-800">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md"
                                style={{ backgroundColor: article.author.avatar }}
                            >
                                {t(article.author.name[0])}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{t(article.author.name)}</div>
                                <div className="text-xs text-slate-400">{t(article.author.role)}</div>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 font-mono">{t("Official StreetForge Publication ")}</div>
                    </div>
                </div>

                {/* Article Key Stats Highlights */}
                {article.stats && article.stats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                        {article.stats.map((st, idx) => (
                            <div key={idx} className="space-y-1 text-center sm:text-left">
                                <div className="text-[10px] font-orbitron uppercase text-slate-400">{t(st.label)}</div>
                                <div className="text-xl font-orbitron font-bold text-cyan-400">{t(st.value)}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Article Main Body Content */}
                <div lang="en" className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
                    {t(article.content?.map((paragraph, index) => (
                        <p key={index} className="text-slate-300">
                            {paragraph}
                        </p>
                    )))}
                </div>

                {/* Related Articles Section */}
                {related.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                        <h3 className="font-orbitron font-bold text-xl text-white">{t("Related Articles & Paddock Notes ")}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {related.map(rel => (
                                <Link
                                    key={rel.id}
                                    href={`/news/${rel.slug}`}
                                    className="p-5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-2xl space-y-2 transition-all block group"
                                >
                                    <div className="text-[10px] font-orbitron font-bold uppercase text-cyan-400">
                                        {t(rel.category)}
                                    </div>
                                    <div className="font-orbitron font-bold text-xs text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {t(rel.title)}
                                    </div>
                                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">{t("Read ")}<ChevronRight className="w-3 h-3" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </PublicLayout>
    );
}
