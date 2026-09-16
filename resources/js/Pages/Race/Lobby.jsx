import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import CarVisualizer from '../../Components/CarVisualizer';
import { usePage, router, Link } from '@inertiajs/react';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { 
    Flag, 
    Trophy, 
    Gauge, 
    Zap, 
    Play, 
    RotateCcw, 
    CheckCircle2, 
    Flame, 
    ChevronRight, 
    Shield, 
    Volume2, 
    VolumeX,
    Users,
    Clock,
    Warehouse,
    Medal,
    Award,
    Sparkles,
    CircleDot,
    Compass,
    Radio
} from 'lucide-react';

export default function Lobby({ tracks = [], activeCar, recentResults = [], leaderboard = [], opponentsPool = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [selectedTrack, setSelectedTrack] = useState(tracks[0] || null);
    const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'matchmaking' | 'racing' | 'finished'
    const [lobbyTab, setLobbyTab] = useState('tracks'); // 'tracks' | 'leaderboard'
    const [matchmakingCountdown, setMatchmakingCountdown] = useState(3);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [raceRewards, setRaceRewards] = useState(null);
    const [finalPosition, setFinalPosition] = useState(1);
    const [finalTime, setFinalTime] = useState(0);
    const [selectedOpponents, setSelectedOpponents] = useState([]);

    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const engineOscRef = useRef(null);

    // Audio Synthesizer
    const initAudio = () => {
        if (!soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioContext();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        } catch (e) {
            console.warn('Web Audio not supported', e);
        }
    };

    const playEngineSound = (speedNormalized) => {
        if (!soundEnabled || !audioCtxRef.current) return;
        try {
            if (!engineOscRef.current) {
                const osc = audioCtxRef.current.createOscillator();
                const gain = audioCtxRef.current.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(60, audioCtxRef.current.currentTime);
                gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
                osc.connect(gain);
                gain.connect(audioCtxRef.current.destination);
                osc.start();
                engineOscRef.current = { osc, gain };
            }
            const targetFreq = 50 + speedNormalized * 190;
            engineOscRef.current.osc.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.05);
        } catch (e) {}
    };

    const stopAudio = () => {
        if (engineOscRef.current) {
            try {
                engineOscRef.current.osc.stop();
                engineOscRef.current.osc.disconnect();
            } catch (e) {}
            engineOscRef.current = null;
        }
    };

    // Matchmaking Start
    const handleStartMatchmaking = () => {
        if (!activeCar) {
            alert('Please select an active vehicle in your Garage first!');
            return;
        }

        // Pick 5 random AI competitors from the pool
        const shuffled = [...opponentsPool].sort(() => 0.5 - Math.random());
        const gridRacers = shuffled.slice(0, 5);
        setSelectedOpponents(gridRacers);

        initAudio();
        setGameState('matchmaking');
        setMatchmakingCountdown(3);

        const timer = setInterval(() => {
            setMatchmakingCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameState('racing');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Main 2D Racing Canvas Game Loop
    useEffect(() => {
        if (gameState !== 'racing' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Waypoints defining the race track circuit
        const waypoints = [
            { x: 160, y: 480 },
            { x: 160, y: 220 },
            { x: 260, y: 120 },
            { x: 500, y: 100 },
            { x: 740, y: 150 },
            { x: 840, y: 280 },
            { x: 780, y: 440 },
            { x: 580, y: 500 },
            { x: 420, y: 400 },
            { x: 300, y: 480 },
        ];

        // Player physics derived directly from upgraded vehicle stats!
        const playerColor = activeCar?.skin?.color_hex || activeCar?.vehicle?.primary_color || '#06b6d4';
        const baseSpeed = activeCar?.current_speed || 210;
        const maxCarSpeed = (baseSpeed / 42); // Scaled pixel speed (e.g. 210 -> 5.0, 320 -> 7.6)
        const accelRate = (activeCar?.current_acceleration || 70) / 380;
        const turnSpeed = (activeCar?.current_handling || 75) / 1700;
        const nitroBoostCapacity = activeCar?.current_nitro || 60;
        const nitroMultiplier = 1.48;

        let player = {
            id: 0,
            name: `${user?.name || 'You'} (P1)`,
            color: playerColor,
            x: 160,
            y: 460,
            angle: -Math.PI / 2,
            speed: 0,
            nitro: nitroBoostCapacity,
            isPlayer: true,
            lap: 1,
            targetWaypoint: 1,
            distanceTraveled: 0,
            bestLap: null,
            lapStartTime: performance.now(),
        };

        // 5 AI Grid Competitors with distinct starting positions and speeds
        const gridPositions = [
            { x: 135, y: 490 },
            { x: 185, y: 505 },
            { x: 140, y: 530 },
            { x: 180, y: 545 },
            { x: 155, y: 570 },
        ];

        let aiRivals = selectedOpponents.map((bot, i) => {
            const pos = gridPositions[i] || { x: 150, y: 500 + i * 25 };
            const speedMod = 0.90 + (bot.skill * 0.08); // AI speed proportional to skill
            return {
                id: i + 1,
                name: bot.name,
                country: bot.country,
                car: bot.car,
                color: bot.color,
                x: pos.x,
                y: pos.y,
                angle: -Math.PI / 2,
                speed: 0,
                maxSpeed: maxCarSpeed * speedMod,
                accel: accelRate * 0.95,
                turnRate: turnSpeed * 0.92,
                wpIdx: 0,
                lap: 1,
                distanceTraveled: -20 - (i * 15),
                isPlayer: false,
            };
        });

        // Controls
        const keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            nitro: false,
        };

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
            if (e.key === ' ' || e.key === 'Shift') keys.nitro = true;
        };

        const handleKeyUp = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
            if (e.key === ' ' || e.key === 'Shift') keys.nitro = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const totalLaps = selectedTrack?.laps || 2;
        const raceStartTime = performance.now();
        let raceEnded = false;
        let particles = [];
        let tireTracks = [];

        // Finish Race Function
        const finishRace = (pos, totalSec, bestLapSec) => {
            stopAudio();
            setFinalPosition(pos);
            setFinalTime(totalSec.toFixed(2));

            if (pos === 1) {
                try {
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                } catch (e) {}
            }

            // Submit result to backend API
            axios.post(`/race/${selectedTrack.id}/submit`, {
                position: pos,
                race_time_seconds: parseFloat(totalSec.toFixed(2)),
                best_lap_seconds: bestLapSec ? parseFloat(bestLapSec.toFixed(2)) : null,
                user_vehicle_id: activeCar.id,
            }).then(response => {
                setRaceRewards(response.data.rewards);
                setGameState('finished');
            }).catch(err => {
                console.error('Race submission error', err);
                setGameState('finished');
            });
        };

        // Main Animation Frame
        const loop = () => {
            if (raceEnded) return;

            const now = performance.now();
            const elapsedSec = (now - raceStartTime) / 1000;

            // 1. PLAYER PHYSICS
            const isUsingNitro = keys.nitro && player.nitro > 0;
            const currentMaxSpeed = isUsingNitro ? maxCarSpeed * nitroMultiplier : maxCarSpeed;

            if (isUsingNitro) {
                player.nitro = Math.max(0, player.nitro - 0.45);
                particles.push({
                    x: player.x - Math.cos(player.angle) * 16,
                    y: player.y - Math.sin(player.angle) * 16,
                    vx: (Math.random() - 0.5) * 2 - Math.cos(player.angle) * 3,
                    vy: (Math.random() - 0.5) * 2 - Math.sin(player.angle) * 3,
                    color: '#38bdf8',
                    size: Math.random() * 4 + 2,
                    alpha: 1,
                });
            } else {
                player.nitro = Math.min(nitroBoostCapacity, player.nitro + 0.1);
            }

            if (keys.up) {
                player.speed = Math.min(currentMaxSpeed, player.speed + accelRate);
            } else if (keys.down) {
                player.speed = Math.max(-2, player.speed - accelRate * 1.6);
            } else {
                player.speed *= 0.985;
            }

            if (Math.abs(player.speed) > 0.2) {
                const steerFactor = player.speed > 0 ? 1 : -1;
                if (keys.left) player.angle -= turnSpeed * steerFactor;
                if (keys.right) player.angle += turnSpeed * steerFactor;

                // Drift tire smoke & track marks
                if ((keys.left || keys.right) && player.speed > maxCarSpeed * 0.65) {
                    particles.push({
                        x: player.x,
                        y: player.y,
                        vx: (Math.random() - 0.5),
                        vy: (Math.random() - 0.5),
                        color: '#64748b',
                        size: Math.random() * 3 + 2,
                        alpha: 0.6,
                    });
                    if (tireTracks.length > 200) tireTracks.shift();
                    tireTracks.push({ x: player.x, y: player.y, alpha: 0.25 });
                }
            }

            player.x += Math.cos(player.angle) * player.speed;
            player.y += Math.sin(player.angle) * player.speed;
            player.distanceTraveled += Math.max(0, player.speed);

            playEngineSound(Math.abs(player.speed) / maxCarSpeed);

            // Waypoint checkpoint validation
            const currentTarget = waypoints[player.targetWaypoint];
            const distToTarget = Math.hypot(currentTarget.x - player.x, currentTarget.y - player.y);
            if (distToTarget < 90) {
                player.targetWaypoint = (player.targetWaypoint + 1) % waypoints.length;
                if (player.targetWaypoint === 0) {
                    const lapTime = (now - player.lapStartTime) / 1000;
                    if (!player.bestLap || lapTime < player.bestLap) {
                        player.bestLap = lapTime;
                    }
                    player.lapStartTime = now;
                    player.lap += 1;

                    if (player.lap > totalLaps && !raceEnded) {
                        raceEnded = true;
                        // Calculate final position
                        const sortedGrid = [player, ...aiRivals].sort((a, b) => b.distanceTraveled - a.distanceTraveled);
                        const userPos = sortedGrid.findIndex(r => r.isPlayer) + 1;
                        finishRace(userPos, elapsedSec, player.bestLap);
                    }
                }
            }

            // 2. AI RIVALS UPDATE
            aiRivals.forEach((ai, idx) => {
                const targetWp = waypoints[ai.wpIdx];
                const dx = targetWp.x - ai.x;
                const dy = targetWp.y - ai.y;
                const targetAngle = Math.atan2(dy, dx);

                let angleDiff = targetAngle - ai.angle;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

                ai.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), ai.turnRate);
                ai.speed = Math.min(ai.maxSpeed, ai.speed + ai.accel);

                ai.x += Math.cos(ai.angle) * ai.speed;
                ai.y += Math.sin(ai.angle) * ai.speed;
                ai.distanceTraveled += ai.speed;

                if (Math.hypot(dx, dy) < 75) {
                    ai.wpIdx = (ai.wpIdx + 1) % waypoints.length;
                    if (ai.wpIdx === 0) {
                        ai.lap += 1;
                    }
                }
            });

            // 3. RENDER CANVAS
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background asphalt & grid
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle neon track grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Outer Track Border Kerbs
            ctx.strokeStyle = '#0891b2';
            ctx.lineWidth = 92;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            waypoints.forEach((wp, i) => {
                if (i === 0) ctx.moveTo(wp.x, wp.y);
                else ctx.lineTo(wp.x, wp.y);
            });
            ctx.closePath();
            ctx.stroke();

            // Main Track Asphalt
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 78;
            ctx.beginPath();
            waypoints.forEach((wp, i) => {
                if (i === 0) ctx.moveTo(wp.x, wp.y);
                else ctx.lineTo(wp.x, wp.y);
            });
            ctx.closePath();
            ctx.stroke();

            // Racing Line Dash
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            ctx.setLineDash([12, 12]);
            ctx.beginPath();
            waypoints.forEach((wp, i) => {
                if (i === 0) ctx.moveTo(wp.x, wp.y);
                else ctx.lineTo(wp.x, wp.y);
            });
            ctx.closePath();
            ctx.stroke();
            ctx.setLineDash([]);

            // Start / Finish Line
            ctx.save();
            ctx.translate(160, 480);
            ctx.fillStyle = '#ffffff';
            for (let i = -38; i < 38; i += 10) {
                ctx.fillRect(i, -3, 8, 6);
            }
            ctx.restore();

            // Render Tire Skid Marks
            tireTracks.forEach(mark => {
                ctx.fillStyle = `rgba(0, 0, 0, ${mark.alpha})`;
                ctx.beginPath();
                ctx.arc(mark.x, mark.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // Render Exhaust / Smoke Particles
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.03;
                if (p.alpha <= 0) {
                    particles.splice(idx, 1);
                } else {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
            });

            // Render AI Opponents
            aiRivals.forEach(ai => {
                ctx.save();
                ctx.translate(ai.x, ai.y);
                ctx.rotate(ai.angle);

                // Car Chassis
                ctx.fillStyle = ai.color;
                ctx.shadowColor = ai.color;
                ctx.shadowBlur = 8;
                ctx.fillRect(-14, -8, 28, 16);

                // Windshield
                ctx.fillStyle = '#0f172a';
                ctx.shadowBlur = 0;
                ctx.fillRect(-2, -6, 8, 12);

                // Wheels
                ctx.fillStyle = '#000000';
                ctx.fillRect(-12, -10, 7, 3);
                ctx.fillRect(5, -10, 7, 3);
                ctx.fillRect(-12, 7, 7, 3);
                ctx.fillRect(5, 7, 7, 3);

                ctx.restore();

                // Name label above AI car
                ctx.font = 'bold 9px Orbitron, sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.textAlign = 'center';
                ctx.fillText(ai.name, ai.x, ai.y - 14);
            });

            // Render Player Car
            ctx.save();
            ctx.translate(player.x, player.y);
            ctx.rotate(player.angle);

            // Underglow
            ctx.fillStyle = playerColor;
            ctx.shadowColor = playerColor;
            ctx.shadowBlur = isUsingNitro ? 24 : 14;
            ctx.fillRect(-16, -10, 32, 20);

            // Cockpit
            ctx.fillStyle = '#0f172a';
            ctx.shadowBlur = 0;
            ctx.fillRect(-4, -7, 10, 14);

            // Front Headlights
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fillRect(14, -7, 3, 4);
            ctx.fillRect(14, 3, 3, 4);

            // Rear Taillights
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 6;
            ctx.fillRect(-16, -7, 2, 4);
            ctx.fillRect(-16, 3, 2, 4);

            ctx.restore();

            // Player Label
            ctx.font = 'bold 10px Orbitron, sans-serif';
            ctx.fillStyle = '#22d3ee';
            ctx.textAlign = 'center';
            ctx.fillText('YOU', player.x, player.y - 16);

            // 4. HUD OVERLAY
            const allRacers = [player, ...aiRivals].sort((a, b) => b.distanceTraveled - a.distanceTraveled);
            const currentPosition = allRacers.findIndex(r => r.isPlayer) + 1;

            // Top HUD Bar
            ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(20, 20, 340, 75, 14);
            ctx.fill();
            ctx.stroke();

            // Position Counter
            ctx.font = 'bold 26px Orbitron, sans-serif';
            ctx.fillStyle = currentPosition === 1 ? '#eab308' : currentPosition === 2 ? '#94a3b8' : currentPosition === 3 ? '#b45309' : '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(`${currentPosition} / ${allRacers.length}`, 35, 56);

            ctx.font = 'bold 9px Orbitron, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('POSITION', 35, 74);

            // Lap Counter
            ctx.font = 'bold 20px Orbitron, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`LAP ${Math.min(player.lap, totalLaps)}/${totalLaps}`, 160, 54);

            ctx.font = 'bold 13px Rajdhani, monospace';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText(`TIME: ${elapsedSec.toFixed(1)}s`, 160, 74);

            // Speedometer & Nitro Bar (Right HUD)
            ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.beginPath();
            ctx.roundRect(canvas.width - 240, 20, 220, 75, 14);
            ctx.fill();
            ctx.stroke();

            const speedKmh = Math.round((Math.abs(player.speed) / maxCarSpeed) * baseSpeed);
            ctx.font = 'bold 24px Orbitron, sans-serif';
            ctx.fillStyle = '#22d3ee';
            ctx.fillText(`${speedKmh}`, canvas.width - 225, 54);
            ctx.font = 'bold 11px Orbitron, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('KM/H', canvas.width - 165, 54);

            // Nitro Fill Bar
            ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
            ctx.fillRect(canvas.width - 225, 64, 190, 8);
            ctx.fillStyle = isUsingNitro ? '#f59e0b' : '#06b6d4';
            ctx.fillRect(canvas.width - 225, 64, (player.nitro / nitroBoostCapacity) * 190, 8);

            // Live Grid Leaderboard on Bottom Left
            ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(20, canvas.height - 150, 210, 130, 12);
            ctx.fill();
            ctx.stroke();

            ctx.font = 'bold 9px Orbitron, sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('LIVE RACE STANDINGS', 32, canvas.height - 132);

            allRacers.forEach((r, idx) => {
                ctx.font = r.isPlayer ? 'bold 10px Orbitron, sans-serif' : '10px Rajdhani, sans-serif';
                ctx.fillStyle = r.isPlayer ? '#22d3ee' : '#94a3b8';
                ctx.fillText(`${idx + 1}. ${r.name}`, 32, canvas.height - 112 + idx * 18);
            });

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            stopAudio();
        };
    }, [gameState, selectedTrack, activeCar, selectedOpponents]);

    return (
        <AppLayout>
            <div className="space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-orbitron font-semibold uppercase text-cyan-400">
                            <Flag className="w-4 h-4" /> Global Racing Championship
                        </div>
                        <h1 className="text-3xl font-orbitron font-extrabold text-white mt-1">
                            Race Lobby & Leaderboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Audio Toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Toggle Engine Audio"
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                        </button>

                        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-right">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Active Car</div>
                            <div className="font-orbitron font-bold text-xs text-cyan-400 truncate max-w-[140px]">
                                {activeCar?.vehicle?.name || 'None Selected'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation in Lobby */}
                {gameState === 'lobby' && (
                    <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 max-w-md">
                        <button
                            onClick={() => setLobbyTab('tracks')}
                            className={`flex-1 py-2 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center justify-center gap-2 ${
                                lobbyTab === 'tracks'
                                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Flag className="w-3.5 h-3.5" />
                            Circuits & Racing
                        </button>
                        <button
                            onClick={() => setLobbyTab('leaderboard')}
                            className={`flex-1 py-2 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center justify-center gap-2 ${
                                lobbyTab === 'leaderboard'
                                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            World Leaderboard ({leaderboard.length})
                        </button>
                    </div>
                )}

                {/* GAMEPLAY STATES */}

                {/* 1. LOBBY VIEW */}
                {gameState === 'lobby' && (
                    <>
                        {lobbyTab === 'tracks' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* Left: Tracks Selection */}
                                <div className="lg:col-span-8 space-y-6">
                                    <h3 className="font-orbitron font-bold text-base text-white">
                                        Select Championship Track
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {tracks.map(track => {
                                            const isSelected = selectedTrack?.id === track.id;
                                            return (
                                                <div
                                                    key={track.id}
                                                    onClick={() => setSelectedTrack(track)}
                                                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                                                        isSelected
                                                            ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-102'
                                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={`text-[10px] font-orbitron font-bold uppercase px-2 py-0.5 rounded border ${
                                                                track.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' :
                                                                track.difficulty === 'Medium' ? 'bg-cyan-950 text-cyan-400 border-cyan-900' :
                                                                'bg-red-950 text-red-400 border-red-900'
                                                            }`}>
                                                                {track.difficulty}
                                                            </span>
                                                            <span className="text-xs text-slate-400 font-mono font-bold">
                                                                {track.laps} Laps
                                                            </span>
                                                        </div>

                                                        <h4 className="font-orbitron font-bold text-base text-white mt-2">
                                                            {track.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                            {track.description}
                                                        </p>
                                                    </div>

                                                    <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1 text-xs">
                                                        <div className="flex justify-between text-slate-400">
                                                            <span>1st Prize:</span>
                                                            <span className="font-orbitron font-bold text-cyan-400">+{track.reward_currency_1st} CR</span>
                                                        </div>
                                                        <div className="flex justify-between text-slate-400">
                                                            <span>XP Reward:</span>
                                                            <span className="font-orbitron font-bold text-purple-400">+{track.reward_xp_1st} XP</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Controls Card */}
                                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                                        <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-300">
                                            Driver Controls & Nitro Overdrive
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-cyan-400 font-bold">
                                                W / &uarr; Accelerate
                                            </div>
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-cyan-400 font-bold">
                                                S / &darr; Brake / Reverse
                                            </div>
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-cyan-400 font-bold">
                                                A &bull; D / &larr; &bull; &rarr; Steer
                                            </div>
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-orange-400 font-bold">
                                                SPACE Nitro Boost
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Active Car Telemetry & Launch Matchmaking */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
                                        <div>
                                            <span className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-cyan-400">
                                                Driver Telemetry
                                            </span>
                                            <h3 className="font-orbitron font-bold text-xl text-white mt-1">
                                                {user?.name} {user?.surname}
                                            </h3>
                                            <div className="text-xs text-slate-400 font-mono">
                                                Level {user?.level} &bull; {user?.xp} XP Points
                                            </div>
                                        </div>

                                        {activeCar ? (
                                            <div className="py-2 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center">
                                                <CarVisualizer vehicle={activeCar.vehicle} skin={activeCar.skin} size="medium" animated={false} />
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-slate-950 rounded-2xl text-center space-y-2">
                                                <div className="text-xs text-slate-400">No active car selected.</div>
                                                <Link href="/garage" className="text-xs text-cyan-400 underline font-bold">Go to Garage</Link>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleStartMatchmaking}
                                            disabled={!activeCar}
                                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-orbitron font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Launch 6-Car Grid Race
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            /* Championship Leaderboard Table */
                            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 text-xs font-orbitron font-semibold uppercase text-cyan-400">
                                            <Trophy className="w-4 h-4" /> Global Division Rankings
                                        </div>
                                        <h2 className="text-2xl font-orbitron font-bold text-white mt-1">
                                            Championship Season '26 Leaderboard
                                        </h2>
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono">
                                        Active Drivers: <strong className="text-cyan-400 font-orbitron">1,430+ Racers</strong>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-[10px] font-orbitron font-bold uppercase text-slate-400 tracking-wider">
                                                <th className="py-3 px-4">Rank</th>
                                                <th className="py-3 px-4">Driver</th>
                                                <th className="py-3 px-4">Country</th>
                                                <th className="py-3 px-4">Level</th>
                                                <th className="py-3 px-4">Vehicle</th>
                                                <th className="py-3 px-4">Circuit</th>
                                                <th className="py-3 px-4">Best Lap</th>
                                                <th className="py-3 px-4 text-right">MMR Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-850 text-xs">
                                            {leaderboard.map(entry => {
                                                const isTop3 = entry.rank <= 3;
                                                const rankBadge = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;

                                                return (
                                                    <tr
                                                        key={entry.rank}
                                                        className={`hover:bg-slate-850/60 transition-colors ${
                                                            entry.is_current_user ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''
                                                        }`}
                                                    >
                                                        <td className="py-3.5 px-4 font-orbitron font-bold">
                                                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                                                                entry.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                                                entry.rank === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                                                                entry.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                                                                'text-slate-400'
                                                            }`}>
                                                                {rankBadge}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <div 
                                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow"
                                                                    style={{ backgroundColor: entry.avatar_color }}
                                                                >
                                                                    {entry.user_name[0]}
                                                                </div>
                                                                <span className="font-orbitron font-bold text-slate-200">
                                                                    {entry.user_name}
                                                                    {entry.is_current_user && (
                                                                        <span className="ml-1.5 text-[9px] font-bold uppercase text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-900">
                                                                            You
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300">
                                                            {entry.country}
                                                        </td>
                                                        <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                                                            LVL {entry.level}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                                                            {entry.vehicle_name}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-400">
                                                            {entry.track_name}
                                                        </td>
                                                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                                                            {entry.best_lap}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right font-orbitron font-bold text-purple-400">
                                                            {entry.rating_mmr} PTS
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* 2. MATCHMAKING COUNTDOWN STATE */}
                {gameState === 'matchmaking' && (
                    <div className="max-w-md mx-auto py-20 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center animate-pulse">
                            <span className="font-orbitron font-black text-4xl text-cyan-400">
                                {matchmakingCountdown}
                            </span>
                        </div>
                        <h2 className="font-orbitron font-black text-2xl text-white">
                            Assembling 6-Car Starting Grid...
                        </h2>
                        <p className="text-xs text-slate-400">
                            Syncing telemetry with live competitors on {selectedTrack?.name}.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                            {selectedOpponents.map((bot, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-orbitron text-slate-300">
                                    {bot.name} ({bot.country})
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. INTERACTIVE 60FPS RACING GAME CANVAS */}
                {gameState === 'racing' && (
                    <div className="space-y-4">
                        <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-950">
                            <canvas
                                ref={canvasRef}
                                width={1000}
                                height={600}
                                className="w-full h-auto block"
                            />
                        </div>
                    </div>
                )}

                {/* 4. RACE FINISHED PODIUM & REWARDS */}
                {gameState === 'finished' && (
                    <div className="max-w-xl mx-auto py-8 text-center space-y-8">
                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
                            
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl">
                                <Trophy className="w-10 h-10" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-orbitron font-black text-white">
                                    {finalPosition === 1 ? '🥇 VICTORY - 1ST PLACE!' :
                                     finalPosition === 2 ? '🥈 2ND PLACE PODIUM!' :
                                     finalPosition === 3 ? '🥉 3RD PLACE PODIUM!' :
                                     `🏁 POSITION ${finalPosition} / 6`}
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Total Race Time: <strong className="text-white font-mono">{finalTime} seconds</strong>
                                </p>
                            </div>

                            {/* Rewards Box */}
                            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Credits Earned</div>
                                    <div className="font-orbitron font-extrabold text-2xl text-cyan-400">
                                        +{raceRewards?.currency || 0} CR
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] uppercase font-bold text-slate-400">XP Gained</div>
                                    <div className="font-orbitron font-extrabold text-2xl text-purple-400">
                                        +{raceRewards?.xp || 0} XP
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={() => setGameState('lobby')}
                                    className="flex-1 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-orbitron font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Race Again
                                </button>
                                <Link
                                    href="/garage"
                                    className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-orbitron font-bold text-xs transition-all flex items-center justify-center gap-2"
                                >
                                    <Warehouse className="w-4 h-4" />
                                    Tune Car in Garage
                                </Link>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
