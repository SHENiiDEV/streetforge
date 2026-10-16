import { t } from '../../localization';
import React from 'react';
import { LifeBuoy, CreditCard, Shield, Scale, Database, Flag } from 'lucide-react';
import LegalShell, { P, KV, A, useCompany } from '../../Components/Legal/LegalShell';

const DEPARTMENTS = [
    { icon: LifeBuoy, title: 'Player support', email: 'support@streetforge.co.uk', text: 'Account access, gameplay questions, garage and race issues.', sla: '< 24h', tone: 'text-cyan-400' },
    { icon: CreditCard, title: 'Billing', email: 'billing@streetforge.co.uk', text: 'Top-ups, missing Credits, receipts, refunds and duplicate charges.', sla: '< 2 business days', tone: 'text-emerald-400' },
    { icon: Flag, title: 'Fair play', email: 'fairplay@streetforge.co.uk', text: 'Report cheaters and exploits, appeal suspensions and bans.', sla: '< 3 business days', tone: 'text-orange-300' },
    { icon: Shield, title: 'Security', email: 'security@streetforge.co.uk', text: 'Compromised accounts, phishing and vulnerability reports.', sla: '< 3 business days', tone: 'text-red-300' },
    { icon: Database, title: 'Privacy / DPO', email: 'dpo@streetforge.co.uk', text: 'Data access, correction and deletion requests under UK GDPR.', sla: '< 1 month', tone: 'text-sky-300' },
    { icon: Scale, title: 'Legal & compliance', email: 'legal@streetforge.co.uk', text: 'Legal notices, IP claims, sanctions and regulatory enquiries.', sla: '< 5 business days', tone: 'text-slate-300' },
];

export default function Contact() {
    const c = useCompany();

    const sections = [
        {
            id: 'departments',
            title: 'Choose the right team',
            content: (
                <>
                    <P>{t("Writing to the right address gets you a faster answer. Please email from the address registered to your StreetForge account.")}</P>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {DEPARTMENTS.map(({ icon: Icon, title, email, text, sla, tone }) => (
                            <a key={email} href={`mailto:${email}`} className="group surface notch-tr p-5 flex flex-col gap-3 hover:border-white/20 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className={`w-9 h-9 border border-white/[0.08] flex items-center justify-center ${tone}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="label-tech text-slate-600">{t("Reply ")}{t(sla)}</span>
                                </div>
                                <div className="font-display font-bold uppercase tracking-wide text-white">{t(title)}</div>
                                <p className="text-[13.5px] text-slate-400 leading-relaxed flex-1">{t(text)}</p>
                                <span className="text-sm text-cyan-300 group-hover:text-white transition-colors break-all">{t(email)}</span>
                            </a>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 'payments',
            title: 'Payment questions',
            content: (
                <P>{t("StreetForge never asks for card details by email or chat — payments are made only on our PCI DSS Level 1 provider's hosted page. When contacting billing, include just your order reference (")}<span className="font-mono text-cyan-200">{t("TOP-…")}</span>{t(") and receipt number. Read")}{t(' ')}
                    <A href="/payment-security">{t("how we process payments")}</A>.
                </P>
            ),
        },
        {
            id: 'hours',
            title: 'Support hours',
            content: (
                <KV
                    rows={[
                        ['Monday – Friday', '09:00 – 20:00 UK time'],
                        ['Saturday – Sunday', '10:00 – 18:00 UK time (player support & billing only)'],
                        ['Bank holidays', 'Reduced cover; security reports are monitored 24/7'],
                    ]}
                />
            ),
        },
        {
            id: 'office',
            title: 'Registered office',
            content: (
                <KV
                    rows={[
                        ['Company', c.name],
                        ['Company number', <span className="numeric">{c.number}</span>],
                        ['Registered in', 'England & Wales'],
                        ['Address', c.address],
                        ['General email', <A href={`mailto:${c.email}`}>{c.email}</A>],
                    ]}
                />
            ),
        },
    ];

    return (
        <LegalShell
            href="/contact"
            eyebrow="Support & enquiries"
            title={t("Contact")}
            accent="StreetForge"
            lead="Reach the right team at StreetForge — support, billing, fair play, security, privacy or legal — and see when we're available."
            sections={sections}
            related={['/faq', '/complaints', '/payment-security', '/about']}
        />
    );
}
