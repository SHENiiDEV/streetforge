import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import FlashMessage from '../Components/FlashMessage';
import MobileBottomNav from '../Components/MobileBottomNav';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 bg-cyber-grid selection:bg-cyan-500 selection:text-black">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <FlashMessage />
        </div>
    );
}
