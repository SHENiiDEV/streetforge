import { t } from '../localization';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    const message = flash?.success || flash?.error || flash?.info || flash?.warning;
    const type = flash?.success ? 'success' : flash?.error ? 'error' : flash?.warning ? 'warning' : 'info';

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message || !visible) return null;

    const styles = {
        success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-900/30',
        error: 'bg-red-950/90 border-red-500/50 text-red-200 shadow-red-900/30',
        warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200 shadow-amber-900/30',
        info: 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200 shadow-cyan-900/30',
    };

    const icons = {
        success: CheckCircle2,
        error: AlertTriangle,
        warning: AlertTriangle,
        info: Info,
    };

    const Icon = icons[type];

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in shadow-2xl">
            <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${styles[type]}`}>
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm font-medium leading-relaxed">
                    {t(message)}
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="p-1 rounded-md hover:bg-black/20 text-current opacity-70 hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
