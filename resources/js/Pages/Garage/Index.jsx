import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import CarVisualizer from '../../Components/CarVisualizer';
import StatBar from '../../Components/StatBar';
import { usePage, router, Link } from '@inertiajs/react';
import { 
    Warehouse, 
    Wrench, 
    Palette, 
    Gauge, 
    Zap, 
    Cpu, 
    Check, 
    ShoppingBag, 
    PlusCircle, 
    Lock, 
    ChevronRight,
    CircleDot,
    Disc,
    Rocket,
    Sliders,
    Flame,
    Compass,
    Sparkles,
    Shield,
    Layers,
    TrendingUp
} from 'lucide-react';

const ICON_MAP = {
    Cpu: Cpu,
    Zap: Zap,
    Flame: Flame,
    Compass: Compass,
    Sliders: Sliders,
    Disc: Disc,
    CircleDot: CircleDot,
    Gauge: Gauge,
    Rocket: Rocket,
};

const CATEGORIES = [
    { key: 'all', label: 'All Parts', icon: Layers },
    { key: 'engine', label: 'Engine & ECU', icon: Flame },
    { key: 'drivetrain', label: 'Drivetrain', icon: Sliders },
    { key: 'suspension', label: 'Suspension', icon: Compass },
    { key: 'tires', label: 'Tires & Brakes', icon: Disc },
    { key: 'nitro', label: 'Nitrous System', icon: Rocket },
    { key: 'aero', label: 'Aero & Weight', icon: Zap },
];

export default function Garage({ userVehicles = [], activeVehicleId, availableUpgrades = [], ownedSkinIds = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [selectedCarId, setSelectedCarId] = useState(activeVehicleId || userVehicles[0]?.id);
    const [activeTab, setActiveTab] = useState('tuning'); // 'tuning' | 'skins'
    const [selectedCategory, setSelectedCategory] = useState('all');

    const currentCar = userVehicles.find(v => v.id === selectedCarId) || userVehicles[0];

    const handleSetActive = (carId) => {
        router.post(`/garage/${carId}/set-active`);
    };

    const handleInstallUpgrade = (upgradeId) => {
        if (!currentCar) return;
        router.post(`/garage/${currentCar.id}/upgrade`, { upgrade_id: upgradeId });
    };

    const handleApplySkin = (skinId) => {
        if (!currentCar) return;
        router.post(`/garage/${currentCar.id}/skin`, { skin_id: skinId });
    };

    const installedUpgradeIds = currentCar?.upgrades?.map(u => u.id) || [];

    // Filter upgrades based on category
    const filteredUpgrades = selectedCategory === 'all'
        ? availableUpgrades
        : availableUpgrades.filter(u => u.type === selectedCategory);

    // Calculate progression stats
    const totalAvailable = availableUpgrades.length;
    const totalInstalled = installedUpgradeIds.length;
    const tuningProgressPercent = totalAvailable > 0 ? Math.round((totalInstalled / totalAvailable) * 100) : 0;

    return (
        <AppLayout>
            <div className="space-y-8">
                
                {/* Header & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-orbitron font-semibold uppercase text-cyan-400">
                            <Warehouse className="w-4 h-4" /> Driver HQ & Dyno Tuning Bay
                        </div>
                        <h1 className="text-3xl font-orbitron font-extrabold text-white mt-1">
                            Your Garage Fleet
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs font-bold font-orbitron transition-all"
                        >
                            <ShoppingBag className="w-4 h-4 text-cyan-400" />
                            Browse Car Shop
                        </Link>
                        <Link
                            href="/race/lobby"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-orbitron font-extrabold shadow-lg shadow-cyan-500/20 transition-all"
                        >
                            Enter Race Lobby <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Car Showcase & Customization Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: 3D Visualizer & Vehicle Switcher */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Main Spotlight Card */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
                            
                            {/* Header Info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-900">
                                            {currentCar?.vehicle?.class_type} Class
                                        </span>
                                        {currentCar?.is_active && (
                                            <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-900 flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Active Racer
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-white mt-2">
                                        {currentCar?.vehicle?.name}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Active Livery: <span className="text-cyan-400 font-semibold">{currentCar?.skin?.name || 'Default Stock'}</span>
                                    </p>
                                </div>

                                {!currentCar?.is_active && (
                                    <button
                                        onClick={() => handleSetActive(currentCar.id)}
                                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs shadow-md transition-all"
                                    >
                                        Set as Active Car
                                    </button>
                                )}
                            </div>

                            {/* Canvas Car Visualizer */}
                            <div className="my-6 py-6 bg-slate-950/70 rounded-2xl border border-slate-800/80 flex items-center justify-center">
                                <CarVisualizer
                                    vehicle={currentCar?.vehicle}
                                    skin={currentCar?.skin}
                                    size="xlarge"
                                    animated={true}
                                />
                            </div>

                            {/* Tuning Progression Summary */}
                            <div className="mb-4 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    <span>Tuning Progression: <strong className="text-white font-orbitron">{totalInstalled} / {totalAvailable} Upgrades</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500" 
                                            style={{ width: `${tuningProgressPercent}%` }}
                                        />
                                    </div>
                                    <span className="font-orbitron text-xs font-bold text-cyan-400">{tuningProgressPercent}%</span>
                                </div>
                            </div>

                            {/* Live Telemetry Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <StatBar label="Top Speed" value={currentCar?.current_speed || 210} max={380} unit="km/h" color="cyan" icon={Gauge} />
                                <StatBar label="Acceleration" value={currentCar?.current_acceleration || 70} max={100} unit="pts" color="orange" icon={Zap} />
                                <StatBar label="Handling" value={currentCar?.current_handling || 75} max={100} unit="pts" color="emerald" icon={Cpu} />
                                <StatBar label="Nitro Boost" value={currentCar?.current_nitro || 60} max={100} unit="pts" color="purple" icon={Rocket} />
                            </div>

                        </div>

                        {/* Fleet Vehicle Carousel */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-slate-400">
                                Select Car in Garage ({userVehicles.length})
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {userVehicles.map(car => (
                                    <button
                                        key={car.id}
                                        onClick={() => setSelectedCarId(car.id)}
                                        className={`p-3 rounded-2xl text-left border transition-all ${
                                            selectedCarId === car.id
                                                ? 'bg-cyan-950/50 border-cyan-500 shadow-lg shadow-cyan-950/50'
                                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="text-[10px] text-slate-400 font-mono">
                                            {car.vehicle.class_type} &bull; {car.current_speed} km/h
                                        </div>
                                        <div className="font-orbitron font-bold text-xs text-white truncate mt-0.5">
                                            {car.vehicle.name}
                                        </div>
                                        {car.is_active && (
                                            <div className="text-[9px] font-bold text-emerald-400 uppercase mt-1 flex items-center gap-1">
                                                <Check className="w-2.5 h-2.5" /> Active
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Performance Tuning Workshop & Custom Liveries */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Tab Switcher */}
                        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                            <button
                                onClick={() => setActiveTab('tuning')}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'tuning'
                                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Wrench className="w-3.5 h-3.5" />
                                Dyno Tuning ({totalInstalled}/{totalAvailable})
                            </button>
                            <button
                                onClick={() => setActiveTab('skins')}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center justify-center gap-2 ${
                                    activeTab === 'skins'
                                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Palette className="w-3.5 h-3.5" />
                                Custom Liveries
                            </button>
                        </div>

                        {/* Tuning Parts List */}
                        {activeTab === 'tuning' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                                    <span>Available Performance Parts</span>
                                    <span>Wallet: <strong className="text-cyan-400 font-orbitron">{Number(user?.game_balance).toLocaleString()} CR</strong></span>
                                </div>

                                {/* Category Filters */}
                                <div className="flex flex-wrap gap-1.5 pb-1">
                                    {CATEGORIES.map(cat => {
                                        const CatIcon = cat.icon;
                                        const isActive = selectedCategory === cat.key;
                                        return (
                                            <button
                                                key={cat.key}
                                                onClick={() => setSelectedCategory(cat.key)}
                                                className={`px-3 py-1.5 rounded-xl text-[11px] font-orbitron font-bold transition-all flex items-center gap-1.5 ${
                                                    isActive
                                                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                                                        : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                                                }`}
                                            >
                                                <CatIcon className="w-3 h-3" />
                                                {cat.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Upgrade Items List */}
                                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                                    {filteredUpgrades.map(upg => {
                                        const isInstalled = installedUpgradeIds.includes(upg.id);
                                        const Icon = ICON_MAP[upg.icon] || Zap;
                                        const canAfford = user?.game_balance >= upg.price;

                                        return (
                                            <div
                                                key={upg.id}
                                                className={`p-4 rounded-2xl border transition-all ${
                                                    isInstalled
                                                        ? 'bg-emerald-950/20 border-emerald-500/40'
                                                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                            isInstalled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-cyan-400'
                                                        }`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-900">
                                                                    {upg.type}
                                                                </span>
                                                                <div className="font-orbitron font-bold text-sm text-white">
                                                                    {upg.name}
                                                                </div>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                                {upg.description}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        {isInstalled ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-orbitron font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1.5 rounded-lg border border-emerald-800">
                                                                <Check className="w-3.5 h-3.5" /> Installed
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleInstallUpgrade(upg.id)}
                                                                disabled={!canAfford}
                                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all ${
                                                                    canAfford
                                                                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                                                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                                                }`}
                                                            >
                                                                {Number(upg.price).toLocaleString()} CR
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stat bonuses preview */}
                                                <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                                                    {upg.speed_bonus > 0 && <span className="text-cyan-400">+{upg.speed_bonus} km/h Speed</span>}
                                                    {upg.accel_bonus > 0 && <span className="text-orange-400">+{upg.accel_bonus} Accel</span>}
                                                    {upg.handling_bonus > 0 && <span className="text-emerald-400">+{upg.handling_bonus} Handling</span>}
                                                    {upg.nitro_bonus > 0 && <span className="text-purple-400">+{upg.nitro_bonus} Nitro</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Liveries Customizer List */}
                        {activeTab === 'skins' && (
                            <div className="space-y-3">
                                <div className="text-xs text-slate-400 px-1">
                                    Select or unlock custom visual liveries for {currentCar?.vehicle?.name}:
                                </div>

                                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                                    {currentCar?.vehicle?.skins?.map(skin => {
                                        const isEquipped = currentCar?.skin_id === skin.id;
                                        const isOwned = ownedSkinIds.includes(skin.id) || skin.price <= 0;
                                        const canAfford = user?.game_balance >= skin.price;

                                        return (
                                            <div
                                                key={skin.id}
                                                className={`p-4 rounded-2xl border transition-all ${
                                                    isEquipped
                                                        ? 'bg-cyan-950/40 border-cyan-500/50'
                                                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            className="w-9 h-9 rounded-xl border-2 border-white/20 shadow-md shrink-0"
                                                            style={{ backgroundColor: skin.color_hex }}
                                                        />
                                                        <div>
                                                            <div className="font-orbitron font-bold text-sm text-white">
                                                                {skin.name}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                                Type: {skin.skin_type}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        {isEquipped ? (
                                                            <span className="text-xs font-orbitron font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                                                                Equipped
                                                            </span>
                                                        ) : isOwned ? (
                                                            <button
                                                                onClick={() => handleApplySkin(skin.id)}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 transition-all"
                                                            >
                                                                Apply Livery
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleApplySkin(skin.id)}
                                                                disabled={!canAfford}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all ${
                                                                    canAfford
                                                                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                                                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                                }`}
                                                            >
                                                                Buy for {Number(skin.price).toLocaleString()} CR
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
