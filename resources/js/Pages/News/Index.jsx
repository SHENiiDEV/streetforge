import { t } from '../../localization';
import React, { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import { 
    Newspaper, 
    Calendar, 
    Clock, 
    ArrowRight, 
    Tag, 
    ChevronRight, 
    Sparkles, 
    Flag, 
    Wrench, 
    ShieldCheck, 
    Flame, 
    Trophy,
    TrendingUp
} from 'lucide-react';

const CATEGORY_COLORS = {
    Championship: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
    Engineering: 'text-orange-400 bg-orange-950/80 border-orange-800',
    Spotlight: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
    'Patch Notes': 'text-purple-400 bg-purple-950/80 border-purple-800',
    Security: 'text-blue-400 bg-blue-950/80 border-blue-800',
    Esports: 'text-rose-400 bg-rose-950/80 border-rose-800',
};

export default function NewsIndex({ articles = [], selectedCategory = 'all', categories = [] }) {
    const handleCategorySelect = (cat) => {
        router.get('/news', { category: cat }, { preserveState: true });
    };

    const featuredArticle = articles[0];
    const regularArticles = articles.slice(1);

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
                
                {/* Header Banner */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                        <Newspaper className="w-3.5 h-3.5" />{t("StreetForge Paddock & Journal ")}</div>
                    <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white tracking-tight">{t("Motorsport News & ")}<span className="text-cyan-400">{t("Engineering")}</span>
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{t("Stay updated on championship standings, dyno tuning optimization, patch notes, security bulletins, and technical deep dives. ")}</p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                        return (
                            <button
                                key={cat}
                                onClick={() => handleCategorySelect(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold uppercase tracking-wider transition-all ${
                                    isSelected
                                        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                                        : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                                }`}
                            >
                                {t(cat === 'all' ? 'All Articles' : cat)}
                            </button>
                        );
                    })}
                </div>

                {/* Featured Highlight Article */}
                {featuredArticle && (
                    <div className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl transition-all group">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`text-[10px] font-orbitron font-bold uppercase px-2.5 py-1 rounded-md border ${CATEGORY_COLORS[featuredArticle.category] || 'text-cyan-400 bg-cyan-950 border-cyan-800'}`}>
                                        {t(featuredArticle.category)}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" /> {t(featuredArticle.published_at)}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> {t(featuredArticle.read_time)}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    <Link href={`/news/${featuredArticle.slug}`}>
                                        {t(featuredArticle.title)}
                                    </Link>
                                </h2>

                                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                                    {t(featuredArticle.excerpt)}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow"
                                            style={{ backgroundColor: featuredArticle.author.avatar }}
                                        >
                                            {t(featuredArticle.author.name[0])}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white">{t(featuredArticle.author.name)}</div>
                                            <div className="text-[10px] text-slate-400">{t(featuredArticle.author.role)}</div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/news/${featuredArticle.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-orbitron font-bold text-cyan-400 group-hover:translate-x-1 transition-transform"
                                    >{t("Read Full Article ")}<ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Stat Highlights Card */}
                            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                <div className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-slate-400">{t("Article Telemetry & Highlights ")}</div>
                                <div className="space-y-3">
                                    {t(featuredArticle.stats?.map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-900 text-xs">
                                            <span className="text-slate-400">{t(stat.label)}</span>
                                            <span className="font-orbitron font-bold text-cyan-400">{t(stat.value)}</span>
                                        </div>
                                    )))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Regular Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between transition-all group shadow-lg"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-orbitron font-bold uppercase px-2.5 py-0.5 rounded border ${CATEGORY_COLORS[article.category] || 'text-cyan-400 bg-cyan-950 border-cyan-800'}`}>
                                        {t(article.category)}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        {t(article.read_time)}
                                    </span>
                                </div>

                                <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                                    <Link href={`/news/${article.slug}`}>
                                        {t(article.title)}
                                    </Link>
                                </h3>

                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                    {t(article.excerpt)}
                                </p>
                            </div>

                            <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                                        style={{ backgroundColor: article.author.avatar }}
                                    >
                                        {t(article.author.name[0])}
                                    </div>
                                    <span className="text-[11px] text-slate-300 font-medium">{t(article.author.name)}</span>
                                </div>

                                <Link
                                    href={`/news/${article.slug}`}
                                    className="text-xs font-orbitron font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                >{t("Read ")}<ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </PublicLayout>
    );
}
