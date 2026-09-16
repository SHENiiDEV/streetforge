<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    private function getArticles(): array
    {
        return [
            [
                'id' => 1,
                'slug' => 'season-26-championship-kickoff',
                'title' => 'Season \'26 Championship Kickoff: New Circuits, Formula Prototypes & 500k CR Prize Pool',
                'excerpt' => 'StreetForge opens its largest championship season yet with three world-class circuits, eight specialized vehicle classes, and massive credit prize distributions.',
                'category' => 'Championship',
                'category_color' => 'cyan',
                'published_at' => '2026-09-14',
                'read_time' => '4 min read',
                'author' => [
                    'name' => 'Dominic Vance',
                    'role' => 'Motorsport Director',
                    'avatar' => '#06b6d4'
                ],
                'content' => [
                    'The StreetForge Championship Season 2026 is officially live across all regional divisions. Drivers from around the globe can now register and battle across Neon City Grand Prix, Cyber Highway Sprint, and the treacherous Canyon Drift Pass.',
                    'With the addition of the new Apex Formula Proto 01 and the high-angle Drift King S15, the racing dynamics have reached new extremes. Drivers who reach Division 1 by the season finale will share a guaranteed prize pool of 500,000 CR along with exclusive carbon chassis badges.',
                    'Key Season Updates:',
                    '• Tiered MMR Leaderboard with real-time telemetry matching.',
                    '• Dynamic draft turbulence and slipstreaming physics behind opponents.',
                    '• Weekly Dyno challenges awarding rare neon liveries and credit bounties.',
                ],
                'stats' => [
                    ['label' => 'Total Prize Pool', 'value' => '500,000 CR'],
                    ['label' => 'Starting Grid', 'value' => '6 Racers'],
                    ['label' => 'Championship Tracks', 'value' => '3 Circuits'],
                ]
            ],
            [
                'id' => 2,
                'slug' => 'dyno-tuning-guide-ecu-turbos-slicks',
                'title' => 'Mastering Dyno Tuning: How to Optimize ECU Mapping, Turbo Boost & Slicks for Maximum Lap Times',
                'excerpt' => 'An engineer\'s deep dive into our 22-part upgrade ecosystem. Learn how suspension rigidity, gear ratios, and cryogenic nitrous affect your cornering apex.',
                'category' => 'Engineering',
                'category_color' => 'orange',
                'published_at' => '2026-09-10',
                'read_time' => '6 min read',
                'author' => [
                    'name' => 'Marcus Thorne',
                    'role' => 'Lead Dyno Technician',
                    'avatar' => '#f97316'
                ],
                'content' => [
                    'In StreetForge, raw top speed alone won\'t win you races on technical tracks like Canyon Drift Pass. Balancing acceleration with chassis dampening is critical to maintaining momentum through hairpin switchbacks.',
                    'When upgrading your vehicle in the Garage, consider the synergy between Stage 3 Sequential Transmissions and Stage 2 Track Coilovers. A stiffer suspension allows you to apply full throttle earlier upon corner exit without losing rear-wheel traction.',
                    'Tuning Recommendations by Track:',
                    '• Neon City Grand Prix: Prioritize Stage 2 Twin Turbos and Semi-Slick Tires for rapid acceleration out of chicane braking zones.',
                    '• Cyber Highway Sprint: Maximize Top Speed with Stage 4 Forged Internals and Stage 3 Cryogenic Nitrous.',
                    '• Canyon Drift Pass: Focus on Handling and Suspension upgrades to increase steering responsiveness by up to +32 points.',
                ],
                'stats' => [
                    ['label' => 'Upgrade Stages', 'value' => 'Up to Stage 5'],
                    ['label' => 'Max Dyno Speed', 'value' => '380+ km/h'],
                    ['label' => 'Categories', 'value' => '6 Systems'],
                ]
            ],
            [
                'id' => 3,
                'slug' => 'jdm-legends-shinobi-drift-king',
                'title' => 'Underground Icons: The Engineering Behind the Shinobi Horizon GTR and Drift King S15',
                'excerpt' => 'Exploring the culture and performance characteristics of StreetForge\'s dedicated JDM and Drift Spec platforms.',
                'category' => 'Spotlight',
                'category_color' => 'emerald',
                'published_at' => '2026-09-06',
                'read_time' => '5 min read',
                'author' => [
                    'name' => 'Yuki Takahashi',
                    'role' => 'Vehicle Dynamics Designer',
                    'avatar' => '#10b981'
                ],
                'content' => [
                    'The JDM Tuner class represents the golden age of sports car tuning. The Shinobi Horizon GTR features an advanced all-wheel-drive torque split that sends up to 60% of engine power to the rear wheels during steady-state cornering.',
                    'Meanwhile, the Drift King S15 has been tuned with a specialized steering rack angle kit allowing extreme counter-steer angles of up to 65 degrees. When paired with the Sakura Drift Pink livery, it creates an unmistakable silhouette on night asphalt.',
                    'Both vehicles can be unlocked directly through the in-game Motorsport Dealership with earned race credits.',
                ],
                'stats' => [
                    ['label' => 'Shinobi GTR Base Speed', 'value' => '260 km/h'],
                    ['label' => 'Drift King Handling', 'value' => '92 pts'],
                    ['label' => 'Drive Layout', 'value' => 'AWD / RWD'],
                ]
            ],
            [
                'id' => 4,
                'slug' => 'patch-v2-4-engine-telemetry-overdrive',
                'title' => 'Patch 2.4 Release Notes: Advanced Canvas Physics, Cryogenic Nitrous & High-FPS Overdrive',
                'excerpt' => 'Detailed changelog for our latest update: upgraded 60 FPS HTML5 canvas engine, Web Audio frequency filtering, and tire mark rendering.',
                'category' => 'Patch Notes',
                'category_color' => 'purple',
                'published_at' => '2026-09-02',
                'read_time' => '3 min read',
                'author' => [
                    'name' => 'Elena Rostova',
                    'role' => 'Lead WebGL Engineer',
                    'avatar' => '#a855f7'
                ],
                'content' => [
                    'Patch 2.4 introduces major rendering enhancements and responsive physics calibrations across all desktop and mobile devices.',
                    'Key Improvements:',
                    '• 60 FPS Native Canvas: Smoother waypoint interpolation for AI competitors with zero stutter during high-speed overtakes.',
                    '• Web Audio Engine Sound Synthesis: Dynamic RPM pitch shifting based on throttle application and nitro boost engagement.',
                    '• Tire Skid Mark Persistence: Drifting now leaves visible rubber traces on asphalt corners with progressive alpha fading.',
                    '• Category Progress Tracker: Garage workshop now clearly indicates installed upgrade stages (e.g. Stage 2/4).',
                ],
                'stats' => [
                    ['label' => 'Frame Rate', 'value' => 'Locked 60 FPS'],
                    ['label' => 'Audio Latency', 'value' => '< 15 ms'],
                    ['label' => 'Client Download', 'value' => '0 MB (Web)'],
                ]
            ],
            [
                'id' => 5,
                'slug' => 'safe-payments-and-digital-invoicing',
                'title' => 'Security Deep Dive: Automated PDF Invoicing, PCI-DSS Standards & Sanctions Compliance',
                'excerpt' => 'How StreetForge maintains institutional-grade security for fiat top-ups, instant encrypted PDF tax invoices, and international sanctions compliance.',
                'category' => 'Security',
                'category_color' => 'emerald',
                'published_at' => '2026-08-28',
                'read_time' => '5 min read',
                'author' => [
                    'name' => 'Arthur Pendelton',
                    'role' => 'Head of Legal & Compliance',
                    'avatar' => '#3b82f6'
                ],
                'content' => [
                    'At StreetForge Ltd, financial transparency and regulatory compliance are built directly into our software architecture. Every top-up of virtual game credits generates an immutable transaction record accompanied by an automated, pixel-perfect PDF tax invoice.',
                    'Our platform strictly adheres to PCI-DSS Level 1 payment processing standards via encrypted tokenization. Credit card data is never stored on game servers, ensuring complete consumer protection under UK and European payment regulations.',
                    'Furthermore, our automated sanctions screening module verifies registration addresses against international regulatory lists (OFSI, EU, FATF) to ensure total compliance with international embargoes.',
                ],
                'stats' => [
                    ['label' => 'PCI DSS Status', 'value' => 'Compliant'],
                    ['label' => 'Invoice Delivery', 'value' => 'Instant PDF'],
                    ['label' => 'Encryption', 'value' => 'TLS 1.3 / AES-256'],
                ]
            ],
            [
                'id' => 6,
                'slug' => 'esports-qualifiers-neon-city-gp',
                'title' => 'Neon City Grand Prix Qualifiers: How to Climb the Global MMR Division Leaderboard',
                'excerpt' => 'A guide for competitive racers looking to break into the Top 15 World Leaderboard and earn weekly rewards.',
                'category' => 'Esports',
                'category_color' => 'cyan',
                'published_at' => '2026-08-20',
                'read_time' => '4 min read',
                'author' => [
                    'name' => 'Klaus Weber',
                    'role' => 'Community Champion',
                    'avatar' => '#ef4444'
                ],
                'content' => [
                    'The Global Division leaderboard ranks the fastest drivers across all three circuits based on cumulative MMR ratings and best lap times.',
                    'To maximize your ranking gains:',
                    '• Complete clean laps without wall collisions to trigger the +15% Clean Racer XP multiplier.',
                    '• Save nitro for the long straightaway after the Neon City bridge to achieve peak exit velocity.',
                    '• Watch out for rivals like ShadowDrifter and Elena_Cyber who aggressively defend the inside racing line on final laps.',
                ],
                'stats' => [
                    ['label' => 'Active Competitors', 'value' => '1,430+'],
                    ['label' => 'Leaderboard Divisions', 'value' => 'Pro / Master'],
                    ['label' => 'Record Lap', 'value' => '58.42s'],
                ]
            ],
        ];
    }

    public function index(Request $request): Response
    {
        $articles = $this->getArticles();
        $selectedCategory = $request->query('category', 'all');

        if ($selectedCategory !== 'all') {
            $articles = array_values(array_filter($articles, fn($a) => strtolower($a['category']) === strtolower($selectedCategory)));
        }

        return Inertia::render('News/Index', [
            'articles' => $articles,
            'selectedCategory' => $selectedCategory,
            'categories' => ['all', 'Championship', 'Engineering', 'Spotlight', 'Patch Notes', 'Security', 'Esports'],
        ]);
    }

    public function show(string $slug): Response
    {
        $articles = $this->getArticles();
        $article = collect($articles)->firstWhere('slug', $slug);

        if (!$article) {
            abort(404, 'Article not found');
        }

        $related = collect($articles)
            ->where('slug', '!=', $slug)
            ->take(3)
            ->values()
            ->all();

        return Inertia::render('News/Show', [
            'article' => $article,
            'related' => $related,
        ]);
    }
}
