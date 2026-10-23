import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const SOCIAL_LINKS = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/streetforge-official' },
    { name: 'Instagram', href: 'https://www.instagram.com/streetforge.official/' },
];

export default function SocialLinks() {
    return (
        <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(({ name, href }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
                >
                    {name}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
            ))}
        </div>
    );
}
