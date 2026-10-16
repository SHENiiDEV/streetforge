import { t } from '../../localization';
import React, { useState, useMemo } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { usePage, router, Link } from '@inertiajs/react';
import { 
    Trophy, 
    Medal, 
    Crown, 
    Flag, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    Sparkles, 
    Flame, 
    Zap, 
    Calendar, 
    Users, 
    Award, 
    Clock, 
    Filter,
    Shield,
    ChevronDown,
    ArrowUpRight
} from 'lucide-react';

export default function LeaderboardIndex({ 
    seasons = [], 
    currentSeason = {}, 
    selectedSeasonId = 'season-4', 
    podium = [], 
    racers = [], 
    totalParticipants = 500,
    currentUserRank = null,
    filters = {}
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedTier, setSelectedTier] = useState(filters.tier || 'all');
    const [selectedTrack, setSelectedTrack] = useState(filters.track || 'all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

    const isLiveSeason = currentSeason?.status === 'active';

    const handleSeasonChange = (seasonId) => {
        router.get('/leaderboard', { season: seasonId }, { preserveState: false, preserveScroll: false });
    };

    // Filter racers client-side for ultra-fast instant search & filtering
    const filteredRacers = useMemo(() => {
        return racers.filter(r => {
            const matchesSearch = searchTerm === '' 
                || r.name.toLowerCase().includes(searchTerm.toLowerCase())
                || r.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
                || r.country.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesTier = selectedTier === 'all' 
                || r.tier.toLowerCase() === selectedTier.toLowerCase();

            const matchesTrack = selectedTrack === 'all' 
                || r.track.toLowerCase() === selectedTrack.toLowerCase();

            return matchesSearch && matchesTier && matchesTrack;
        });
    }, [racers, searchTerm, selectedTier, selectedTrack]);

    const totalPages = Math.ceil(filteredRacers.length / pageSize) || 1;
    const paginatedRacers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRacers.slice(start, start + pageSize);
    }, [filteredRacers, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const tableElement = document.getElementById('leaderboard-table-container');
            if (tableElement) {
                tableElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const getTierColor = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'master': return 'text-purple-400 bg-purple-950/60 border-purple-800 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
            case 'diamond': return 'text-cyan-400 bg-cyan-950/60 border-cyan-800 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
            case 'platinum': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
            case 'gold': return 'text-amber-400 bg-amber-950/60 border-amber-800';
            case 'silver': return 'text-slate-300 bg-slate-800 border-slate-700';
            default: return 'text-slate-400 bg-slate-900 border-slate-800';
        }
    };

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                
                {/* Header Title & Season Switcher Banner */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-orbitron font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/10">
                        <Trophy className="w-4 h-4" />{t(" Global Championship Hall of Fame ")}</div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-black text-white tracking-wide">{t("Seasonal ")}<span className="text-cyan-400">{t("Leaderboard")}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">{t("Official telemetry lap times, Master Division MMR ratings, and historical championship winners across 500+ verified drivers. ")}</p>
                </div>

                {/* Seasons Navigation Pill Bar */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-3 sm:p-4 backdrop-blur-xl shadow-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                        {seasons.map((s) => {
                            const isSelected = selectedSeasonId === s.id;
                            const isActiveSeason = s.status === 'active';

                            return (
                                <button
                                    key={s.id}
                                    onClick={() => handleSeasonChange(s.id)}
                                    className={`relative p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-gradient-to-b from-cyan-950/90 to-slate-950 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02] z-10'
                                            : 'bg-slate-950/60 border-slate-850 hover:border-slate-750 hover:bg-slate-900/60'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className={`text-[10px] font-orbitron font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                            isActiveSeason 
                                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
                                                : 'bg-slate-800/80 text-slate-400 border-slate-700'
                                        }`}>
                                            {t(s.status_label)}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">{t(s.year)}</span>
                                    </div>

                                    <div>
                                        <div className="font-orbitron font-extrabold text-xs sm:text-sm text-white leading-tight">
                                            {t(s.name.split(':')[0])}
                                        </div>
                                        <div className="text-[11px] text-cyan-400 font-medium truncate mt-0.5">
                                            {t(s.name.split(':')[1] || s.name)}
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                        <span>{t("Prize: ")}<strong className="text-white">{t(s.prize_pool)}</strong></span>
                                        <span>{t(s.total_racers)}{t(" Racers")}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Season Highlight Banner */}
                <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white">
                                    {t(currentSeason?.name)}
                                </h2>
                                {isLiveSeason ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-orbitron font-bold animate-pulse">
                                        <Flame className="w-3.5 h-3.5" />{t(" LIVE CHAMPIONSHIP ")}</span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-orbitron font-bold">
                                        <Award className="w-3.5 h-3.5 text-amber-400" />{t(" OFFICIAL RESULTS ")}</span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {t(currentSeason?.description)}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {t(currentSeason?.dates)}</span>
                                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-400" /> {t(totalParticipants)}{t(" Registered Racers")}</span>
                                <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-400" />{t(" Prize Pool: ")}{t(currentSeason?.prize_pool)}</span>
                            </div>
                        </div>

                        {/* CTA button or Winner Badge */}
                        <div className="shrink-0">
                            {isLiveSeason ? (
                                <Link
                                    href="/race/lobby"
                                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
                                >
                                    <Flag className="w-4 h-4" />{t(" Enter Race Circuit ")}<ArrowUpRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-right space-y-1">
                                    <div className="text-[10px] font-orbitron uppercase tracking-wider text-amber-400 flex items-center justify-end gap-1 font-bold">
                                        <Crown className="w-3.5 h-3.5" />{t(" Season Champion ")}</div>
                                    <div className="font-orbitron font-bold text-base text-white">
                                        {t(currentSeason?.winner?.name || podium[0]?.name)}
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono">{t("Lap: ")}<strong className="text-cyan-400">{t(currentSeason?.winner?.best_lap || podium[0]?.best_lap)}</strong>{t(" • Prize: ")}<strong className="text-amber-300">{t(currentSeason?.winner?.prize || '150,000 CR')}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top 3 Hall of Fame Podium Stand */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-400" />
                            <h3 className="font-orbitron font-bold text-lg text-white">{t("Championship Podium & Hall of Fame ")}</h3>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{t("Top 3 Drivers ")}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        
                        {/* 2nd Place Silver */}
                        {podium[1] && (
                            <div className="order-2 md:order-1 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-700/80 rounded-3xl p-6 relative flex flex-col justify-between shadow-xl group hover:border-slate-550 transition-all">
                                <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-[11px] font-orbitron font-extrabold flex items-center gap-1 shadow-md">
                                    <Medal className="w-3.5 h-3.5 text-slate-300" />{t(" #2 RUNNER-UP ")}</div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3.5">
                                        <div 
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-orbitron font-bold text-lg shadow-md border-2 border-slate-500"
                                            style={{ backgroundColor: podium[1].avatar_color }}
                                        >
                                            {t(podium[1].name[0].toUpperCase())}
                                        </div>
                                        <div>
                                            <div className="font-orbitron font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                                                {t(podium[1].name)}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                                                <span>{t(podium[1].country)}</span>{t(" • ")}<span>{t("LVL ")}{t(podium[1].level)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-slate-400">
                                            <span>{t("Vehicle:")}</span>
                                            <span className="font-semibold text-slate-200">{t(podium[1].vehicle)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-400">
                                            <span>{t("Best Lap:")}</span>
                                            <span className="font-orbitron font-bold text-cyan-400">{t(podium[1].best_lap)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-400">
                                            <span>{t("Rating MMR:")}</span>
                                            <span className="font-orbitron font-bold text-purple-400">{t(podium[1].mmr)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">{t("Prize Bounty:")}</span>
                                    <span className="font-orbitron font-bold text-slate-200">{t(podium[1].prize)}</span>
                                </div>
                            </div>
                        )}

                        {/* 1st Place Gold Champion (Center Highlight) */}
                        {podium[0] && (
                            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900/95 to-slate-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between shadow-2xl shadow-amber-500/10 scale-105 z-20 group hover:border-amber-400 transition-all">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-orbitron font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/30">
                                    <Crown className="w-4 h-4 fill-slate-950" />{t(" #1 CHAMPION ")}</div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-4">
                                        <div 
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-orbitron font-black text-xl shadow-lg border-2 border-amber-400"
                                            style={{ backgroundColor: podium[0].avatar_color }}
                                        >
                                            {t(podium[0].name[0].toUpperCase())}
                                        </div>
                                        <div>
                                            <div className="font-orbitron font-black text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors">
                                                {t(podium[0].name)}
                                            </div>
                                            <div className="text-xs text-amber-400/90 font-mono flex items-center gap-1.5 font-semibold">
                                                <span>{t(podium[0].country)}</span>{t(" • ")}<span>{t("Master Division")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-950/90 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span>{t("Championship Car:")}</span>
                                            <span className="font-bold text-white">{t(podium[0].vehicle)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span>{t("Record Lap Time:")}</span>
                                            <span className="font-orbitron font-black text-amber-400 text-sm">{t(podium[0].best_lap)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span>{t("Master MMR:")}</span>
                                            <span className="font-orbitron font-black text-purple-300 text-sm">{t(podium[0].mmr)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs">
                                    <span className="text-amber-400/80 font-bold">{t("Championship Purse:")}</span>
                                    <span className="font-orbitron font-extrabold text-amber-300 text-sm">{t(podium[0].prize)}</span>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place Bronze */}
                        {podium[2] && (
                            <div className="order-3 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-orange-900/60 rounded-3xl p-6 relative flex flex-col justify-between shadow-xl group hover:border-orange-700 transition-all">
                                <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-orange-950 text-orange-300 border border-orange-800 text-[11px] font-orbitron font-extrabold flex items-center gap-1 shadow-md">
                                    <Medal className="w-3.5 h-3.5 text-orange-400" />{t(" #3 3RD PLACE ")}</div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3.5">
                                        <div 
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-orbitron font-bold text-lg shadow-md border-2 border-orange-700"
                                            style={{ backgroundColor: podium[2].avatar_color }}
                                        >
                                            {t(podium[2].name[0].toUpperCase())}
                                        </div>
                                        <div>
                                            <div className="font-orbitron font-bold text-base text-white group-hover:text-orange-300 transition-colors">
                                                {t(podium[2].name)}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                                                <span>{t(podium[2].country)}</span>{t(" • ")}<span>{t("LVL ")}{t(podium[2].level)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-slate-400">
                                            <span>{t("Vehicle:")}</span>
                                            <span className="font-semibold text-slate-200">{t(podium[2].vehicle)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-400">
                                            <span>{t("Best Lap:")}</span>
                                            <span className="font-orbitron font-bold text-cyan-400">{t(podium[2].best_lap)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-400">
                                            <span>{t("Rating MMR:")}</span>
                                            <span className="font-orbitron font-bold text-purple-400">{t(podium[2].mmr)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">{t("Prize Bounty:")}</span>
                                    <span className="font-orbitron font-bold text-orange-300">{t(podium[2].prize)}</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Logged in User Rank Banner (if present in this season) */}
                {currentUserRank && (
                    <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border-2 border-cyan-400/80 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-orbitron font-black text-xl">
                                #{t(currentUserRank.rank)}
                            </div>
                            <div>
                                <div className="text-xs font-orbitron uppercase text-cyan-400 font-bold">{t("Your Championship Standing ")}</div>
                                <div className="font-orbitron font-bold text-lg text-white">
                                    {t(currentUserRank.name)}{t(" • ")}<span className="text-slate-300 font-normal text-sm">{t(currentUserRank.vehicle)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs font-mono">
                            <div>
                                <div className="text-slate-400">{t("Best Lap")}</div>
                                <div className="font-orbitron font-bold text-cyan-400 text-sm">{t(currentUserRank.best_lap)}</div>
                            </div>
                            <div>
                                <div className="text-slate-400">{t("Rating MMR")}</div>
                                <div className="font-orbitron font-bold text-purple-400 text-sm">{t(currentUserRank.mmr)}</div>
                            </div>
                            <div>
                                <div className="text-slate-400">{t("Division Tier")}</div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-orbitron font-bold border ${getTierColor(currentUserRank.tier)}`}>
                                    {t(currentUserRank.tier)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter and Search Bar */}
                <div id="leaderboard-table-container" className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder={t("Search driver, car, or country...")}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        {/* Tier & Track Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                {['all', 'Master', 'Diamond', 'Platinum', 'Gold'].map(tier => (
                                    <button
                                        key={tier}
                                        onClick={() => {
                                            setSelectedTier(tier);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-3 py-1 rounded-lg text-[11px] font-orbitron font-bold transition-all ${
                                            selectedTier.toLowerCase() === tier.toLowerCase()
                                                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {t(tier === 'all' ? 'All Tiers' : tier)}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Leaderboard Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950 text-slate-400 uppercase font-orbitron text-[10px] tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="p-4 w-16 text-center">{t("Rank")}</th>
                                    <th className="p-4">{t("Driver Profile")}</th>
                                    <th className="p-4">{t("Vehicle Model")}</th>
                                    <th className="p-4">{t("Circuit")}</th>
                                    <th className="p-4 text-right">{t("Best Lap")}</th>
                                    <th className="p-4 text-right">{t("MMR Rating")}</th>
                                    <th className="p-4 text-center">{t("Division")}</th>
                                    <th className="p-4 text-right">{t("Prize")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-850 font-sans">
                                {paginatedRacers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-12 text-center text-slate-500">{t("No drivers found matching your search criteria. ")}</td>
                                    </tr>
                                ) : (
                                    paginatedRacers.map((racer) => {
                                        const isPodium = racer.rank <= 3;
                                        const isCurrentUser = racer.is_current_user;

                                        return (
                                            <tr 
                                                key={`${racer.rank}-${racer.name}`}
                                                className={`transition-colors ${
                                                    isCurrentUser
                                                        ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400 font-semibold'
                                                        : racer.rank === 1
                                                        ? 'bg-amber-950/20 hover:bg-amber-950/30'
                                                        : 'hover:bg-slate-850/60'
                                                }`}
                                            >
                                                {/* Rank Badge */}
                                                <td className="p-4 text-center font-orbitron font-bold">
                                                    {racer.rank === 1 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black shadow-md">
                                                            1
                                                        </span>
                                                    ) : racer.rank === 2 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-300 text-slate-950 font-black shadow-md">
                                                            2
                                                        </span>
                                                    ) : racer.rank === 3 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-600 text-white font-black shadow-md">
                                                            3
                                                        </span>
                                                    ) : racer.rank <= 10 ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700">
                                                            {t(racer.rank)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500 font-mono">
                                                            #{t(racer.rank)}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Driver Info */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-orbitron font-bold text-xs shrink-0"
                                                            style={{ backgroundColor: racer.avatar_color }}
                                                        >
                                                            {t(racer.name[0].toUpperCase())}
                                                        </div>
                                                        <div>
                                                            <div className="font-orbitron font-bold text-slate-100 flex items-center gap-1.5">
                                                                <span>{racer.name}</span>
                                                                {isCurrentUser && (
                                                                    <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 text-[9px] font-black uppercase">{t("YOU ")}</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                                                <span>{t(racer.country)}</span>{t(" • ")}<span>{t("LVL ")}{t(racer.level)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Vehicle */}
                                                <td className="p-4 font-semibold text-slate-200">
                                                    {t(racer.vehicle)}
                                                </td>

                                                {/* Track */}
                                                <td className="p-4 text-slate-400 text-[11px]">
                                                    {t(racer.track)}
                                                </td>

                                                {/* Best Lap */}
                                                <td className="p-4 text-right font-orbitron font-bold text-cyan-400">
                                                    {t(racer.best_lap)}
                                                </td>

                                                {/* MMR Rating */}
                                                <td className="p-4 text-right font-orbitron font-bold text-purple-400">
                                                    {t(racer.mmr)}
                                                </td>

                                                {/* Tier */}
                                                <td className="p-4 text-center">
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold border ${getTierColor(racer.tier)}`}>
                                                        {t(racer.tier)}
                                                    </span>
                                                </td>

                                                {/* Prize */}
                                                <td className="p-4 text-right font-mono text-slate-300">
                                                    {t(racer.prize)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-400">
                        <div>{t("Showing ")}<strong className="text-white">{t((currentPage - 1) * pageSize + 1)}</strong>{t(" to ")}<strong className="text-white">{t(Math.min(currentPage * pageSize, filteredRacers.length))}</strong>{t(" of ")}<strong className="text-white">{t(filteredRacers.length)}</strong>{t(" qualified drivers ")}</div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-1 font-orbitron text-xs">
                                <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">
                                    {t(currentPage)}
                                </span>
                                <span className="text-slate-500">/</span>
                                <span className="text-slate-400 font-mono">
                                    {t(totalPages)}
                                </span>
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </PublicLayout>
    );
}
