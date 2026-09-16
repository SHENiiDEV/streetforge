import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import FlashMessage from '../Components/FlashMessage';
import MobileBottomNav from '../Components/MobileBottomNav';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-carbon-950 text-slate-200 selection:bg-cyan-400 selection:text-black">
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <FlashMessage />
        </div>
    );
}
