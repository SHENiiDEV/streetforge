<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'StreetForge') }} - High Performance Browser Motorsport</title>

        <!-- Favicon & Touch Icons -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="alternate icon" href="/favicon.ico">
        <meta name="theme-color" content="#07080b">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="StreetForge">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        <!-- Google Fonts: Orbitron (Racing headers) & Inter (UI) & Rajdhani (Stats) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@500;600;700;800;900&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-carbon-950 text-slate-200 min-h-screen selection:bg-cyan-400 selection:text-black">
        @inertia
    </body>
</html>
