# StreetForge - High-Performance Browser Motorsport Simulation

[![Tests](https://img.shields.io/badge/PHPUnit-13%2F13%20Passed-emerald)](https://streetforge.co.uk)
[![Laravel](https://img.shields.io/badge/Laravel-13-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-cyan)](https://react.dev)
[![Inertia](https://img.shields.io/badge/Inertia.js-SPA-purple)](https://inertiajs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-sky)](https://tailwindcss.com)

**StreetForge** (`streetforge.co.uk`) is a next-generation browser motorsport and dyno tuning simulation platform. Engineered with a deterministic 60 FPS HTML5 canvas physics engine, real-time telemetry calculations, modular 5-tier upgrade tuning, live multiplayer leaderboards, and automated PDF VAT tax invoices.

---

## 🚀 Key Features

- **60 FPS Canvas Physics Engine**: Real-time calculations of slip angles, aerodynamic downforce, tire grip, and nitrous boost injection with zero client downloads.
- **Dyno & Garage Tuning Bay**: 5 upgrade tiers across ECU Stage Remaps, Twin-Turbo Forced Induction, Track Coilovers & Slicks, and Nitrous Oxide Injectors.
- **Championship Circuits**:
  - *Neon City Grand Prix* (Technical urban street circuit)
  - *Canyon Drift Pass* (High-angle drift mountain course)
  - *Cyber Highway Sprint* (380+ km/h top-speed straightaway)
- **Global Seasonal Leaderboard (500+ Racers)**:
  - Live Season 4 Championship with interactive Hall of Fame podium stand.
  - Historical Season Archive (Season 1 Genesis, Season 2 Asphalt Rush, Season 3 Night Drift Dynasty) with over 500+ deterministic competitors per season.
- **Motorsport News & Paddock Wire**: Dedicated motorsport articles, dyno tuning guides, patch notes, and esports reports.
- **Top-Up Credits & Automated PDF Invoicing**:
  - Instant digital currency bundles with bonus rewards.
  - Pixel-perfect VAT tax PDF invoices generated automatically for every purchase.
- **UK Corporate & Sanctions Compliance**:
  - Built for `StreetForge Ltd` (UK Company Reg: `14829103`, London, United Kingdom).
  - Adheres to UK GDPR, Data Protection Act 2018, and HM Treasury / OFAC Sanctions regulations.
- **Mobile-First App Bar**: Dedicated native-style mobile bottom navigation bar with responsive layout across all screen resolutions.

---

## 🛠️ Technology Stack

- **Backend**: Laravel 13, PHP 8.4
- **Frontend**: React 18, Inertia.js SPA, Vite 8
- **Styling**: Tailwind CSS, Lucide Icons, Cyberpunk & Motorsport Design System
- **Database**: SQLite / MySQL / PostgreSQL with Eloquent ORM
- **Invoicing**: Automated Blade PDF rendering & email notification delivery

---

## 💻 Installation & Local Development

### 1. Prerequisites
- PHP >= 8.2 (PHP 8.4 recommended)
- Composer
- Node.js >= 18 & npm

### 2. Clone & Setup
```bash
git clone https://github.com/SHENiiDEV/streetforge.git
cd streetforge

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Run migrations and seed data (Cars, Upgrades, Bot Racers, Default User)
php artisan migrate --seed

# Build frontend assets
npm run build
```

### 3. Run Dev Server
```bash
# Terminal 1: Laravel Server
php artisan serve --port=8080

# Terminal 2: Vite Dev Server (for Hot Module Reloading)
npm run dev
```

Visit [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser.

---

## 🧪 Testing

Execute the complete feature and unit test suite:

```bash
php artisan test
```

---

## 📄 License

Proprietary Software &copy; 2026 **StreetForge Ltd**. Registered in England and Wales. All rights reserved.
