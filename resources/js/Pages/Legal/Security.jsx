import React from 'react';
import { Lock, KeyRound, ServerCog, ShieldCheck } from 'lucide-react';
import LegalShell, { P, List, Cards, KV, A } from '../../Components/Legal/LegalShell';

export default function Security() {
    const sections = [
        {
            id: 'approach',
            title: 'How we protect StreetForge',
            content: (
                <>
                    <P>
                        Security is built into how StreetForge is designed, not added afterwards. The most sensitive data in any online purchase — card
                        details — never reaches our systems at all, because payments are made on a hosted page run by a PCI DSS Level 1 provider after a
                        redirect. That lets us focus our controls on your account, gameplay and personal data.
                    </P>
                    <Cards
                        cols={2}
                        items={[
                            { icon: Lock, title: 'Encryption', text: 'TLS 1.2+ with HSTS on every page; data encrypted at rest in databases and backups.' },
                            { icon: ShieldCheck, title: 'Outsourced card data', text: 'Redirect to a PCI DSS Level 1 hosted payment page — no card fields on StreetForge.', tone: 'text-emerald-400' },
                            { icon: KeyRound, title: 'Account security', text: 'bcrypt password hashing, login rate-limiting, CSRF protection and session rotation on login.', tone: 'text-orange-300' },
                            { icon: ServerCog, title: 'Operations', text: 'Least-privilege access with MFA, audited admin actions, patched dependencies and daily backups.' },
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'you',
            title: 'Keeping your account safe',
            content: (
                <List
                    items={[
                        'Use a long, unique password and a password manager.',
                        'Check the address bar: StreetForge pages are on streetforge.co.uk; card details are only ever entered on the payment provider\'s page you are redirected to.',
                        'We will never ask for your password, card number, CVC or one-time codes — by email, chat or in-game.',
                        'Log out on shared devices and do not install browser extensions that claim to "boost" the game.',
                    ]}
                />
            ),
        },
        {
            id: 'disclosure',
            title: 'Responsible disclosure',
            content: (
                <>
                    <P>
                        If you believe you have found a security vulnerability in StreetForge, please report it to us privately. We welcome good-faith research
                        and will not pursue legal action against researchers who follow these rules:
                    </P>
                    <List
                        items={[
                            'Only test against your own account; never access, modify or delete other players\' data.',
                            'Do not run denial-of-service, spam, social-engineering or physical attacks.',
                            'Do not test the payment provider\'s hosted pages — they are out of scope and governed by the provider\'s own programme.',
                            'Give us reasonable time (90 days) to fix the issue before any public disclosure.',
                        ]}
                    />
                    <KV
                        rows={[
                            ['Report to', <A href="mailto:security@streetforge.co.uk">security@streetforge.co.uk</A>],
                            ['Include', 'Affected URL or feature, steps to reproduce, impact, and your contact details'],
                            ['Our response', 'Acknowledgement within 3 business days; status updates at least every 14 days'],
                            ['In scope', 'streetforge.co.uk and its subdomains, the game client and our APIs'],
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'incidents',
            title: 'Incident response',
            content: (
                <P>
                    We maintain an incident response plan covering detection, containment, investigation and recovery. If a personal data breach is likely to
                    result in a high risk to you, we will notify you without undue delay and report to the ICO within 72 hours, as set out in our{' '}
                    <A href="/privacy">Privacy Policy</A>.
                </P>
            ),
        },
    ];

    return (
        <LegalShell
            href="/security"
            eyebrow="Platform security"
            title="Security &"
            accent="Disclosure"
            lead="How we protect the StreetForge platform and your account, what you can do to stay safe, and how to report a vulnerability."
            version="1.0"
            sections={sections}
            related={['/payment-security', '/privacy', '/fair-play', '/contact']}
        />
    );
}
