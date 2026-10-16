import { t, locale } from '../../localization';
import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import CarVisualizer from '../../Components/CarVisualizer';
import StatBar from '../../Components/StatBar';
import { usePage, router, Link } from '@inertiajs/react';
import { 
    ShoppingBag, 
    Gauge, 
    Zap, 
    Cpu, 
    Rocket, 
    Check, 
    PlusCircle, 
    CreditCard,
    Lock,
    Warehouse
} from 'lucide-react';

export default function Shop({ vehicles = [], ownedVehicleIds = [], ownedSkinIds = [], upgrades = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const handleBuyVehicle = (vehicleId) => {
        router.post(`/shop/vehicle/${vehicleId}/buy`);
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                            <ShoppingBag className="w-3.5 h-3.5" />{t(" High Performance Showroom ")}</div>
                        <h1 className="text-3xl sm:text-4xl font-orbitron font-extrabold text-white">{t("Motorsport Dealership ")}</h1>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{t("Unlock championship vehicles, hypercars, and muscle roadsters using your in-game currency credits. ")}</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
                        <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">{t("Available Balance")}</div>
                            <div className="font-orbitron font-extrabold text-xl text-cyan-400">
                                {t(Number(user?.game_balance).toLocaleString(locale()))} <span className="text-xs text-slate-400">{t("CR")}</span>
                            </div>
                        </div>
                        <Link
                            href="/topup"
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                            <CreditCard className="w-3.5 h-3.5" />{t("Top-Up ")}</Link>
                    </div>
                </div>

                {/* Supercars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {vehicles.map(car => {
                        const isOwned = ownedVehicleIds.includes(car.id);
                        const canAfford = user?.game_balance >= car.price;

                        return (
                            <div
                                key={car.id}
                                className={`bg-slate-900/80 border rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all flex flex-col justify-between ${
                                    isOwned
                                        ? 'border-slate-800 opacity-90'
                                        : 'border-slate-800 hover:border-cyan-500/50 shadow-xl'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-900">
                                            {t(car.class_type)}{t(" Class ")}</span>
                                        <span className="font-orbitron font-extrabold text-base text-white">
                                            {t(car.price > 0 ? `${Number(car.price).toLocaleString(locale())} CR` : 'FREE STARTER')}
                                        </span>
                                    </div>

                                    <h3 className="font-orbitron font-black text-2xl text-white">
                                        {t(car.name)}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                                        {t(car.description)}
                                    </p>

                                    {/* Car Preview */}
                                    <div className="my-4 py-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-center">
                                        <CarVisualizer vehicle={car} size="medium" animated={!isOwned} />
                                    </div>

                                    {/* Stats Bars */}
                                    <div className="space-y-2.5 my-4">
                                        <StatBar label="Base Speed" value={car.base_speed} max={320} unit="km/h" color="cyan" icon={Gauge} />
                                        <StatBar label="Acceleration" value={car.base_acceleration} max={100} unit="pts" color="orange" icon={Zap} />
                                        <StatBar label="Handling" value={car.base_handling} max={100} unit="pts" color="emerald" icon={Cpu} />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800 mt-4">
                                    {isOwned ? (
                                        <Link
                                            href="/garage"
                                            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Warehouse className="w-4 h-4 text-cyan-400" />{t("Owned • Open in Garage ")}</Link>
                                    ) : (
                                        <button
                                            onClick={() => handleBuyVehicle(car.id)}
                                            disabled={!canAfford}
                                            className={`w-full py-3 rounded-xl font-orbitron font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
                                                canAfford
                                                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {canAfford ? (
                                                <>{t("Purchase Vehicle • ")}{t(Number(car.price).toLocaleString(locale()))}{t(" CR")}</>
                                            ) : (
                                                <><Lock className="w-3.5 h-3.5" />{t(" Insufficient Balance")}</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </AppLayout>
    );
}
