/*
 * Single registry of every static / legal document on StreetForge.
 * Used by the footer, the Legal Centre hub and the "related documents"
 * rail at the bottom of each policy page.
 */

export const LEGAL_GROUPS = [
    {
        key: 'agreements',
        title: 'Core Agreements',
        docs: [
            { code: 'SF-LGL-01', label: 'Terms of Service', href: '/terms', blurb: 'The contract between you and StreetForge Ltd — accounts, credits, payments, conduct and liability.' },
            { code: 'SF-LGL-02', label: 'Privacy Policy', href: '/privacy', blurb: 'What personal data we collect, why, how long we keep it and your UK GDPR rights.' },
            { code: 'SF-LGL-03', label: 'Cookie Policy', href: '/cookie-policy', blurb: 'Strictly necessary, analytics and preference cookies, and how to control them.' },
            { code: 'SF-LGL-04', label: 'Virtual Credits Policy', href: '/virtual-credits', blurb: 'How StreetForge Credits (CR) are issued, used, expired and why they hold no cash value.' },
            { code: 'SF-LGL-05', label: 'Intellectual Property', href: '/intellectual-property', blurb: 'Ownership of the game, licence granted to players and our notice-and-takedown process.' },
        ],
    },
    {
        key: 'payments',
        title: 'Payments & Billing',
        docs: [
            { code: 'SF-PAY-01', label: 'Payment Security', href: '/payment-security', blurb: 'Redirect to a PCI DSS Level 1 hosted payment page, 3-D Secure and tokenisation explained.' },
            { code: 'SF-PAY-02', label: 'Billing Terms', href: '/billing-terms', blurb: 'Pricing, currency, receipts, failed payments, spending limits and statement descriptors.' },
            { code: 'SF-PAY-03', label: 'Refund & Cancellation', href: '/refund-policy', blurb: 'When a top-up can be refunded, statutory cancellation rights and timelines.' },
            { code: 'SF-PAY-04', label: 'Chargeback Policy', href: '/chargeback-policy', blurb: 'How card disputes are handled and what happens to an account during one.' },
            { code: 'SF-PAY-05', label: 'Sanctions & AML Policy', href: '/aml-sanctions', blurb: 'Screening, restricted jurisdictions and our anti-money-laundering controls.' },
        ],
    },
    {
        key: 'safety',
        title: 'Player Safety',
        docs: [
            { code: 'SF-SAF-01', label: 'Fair Play & Acceptable Use', href: '/fair-play', blurb: 'Anti-cheat rules, prohibited conduct and the enforcement ladder.' },
            { code: 'SF-SAF-02', label: 'Responsible Play & 18+', href: '/responsible-play', blurb: 'Age requirement, spending controls, self-exclusion and wellbeing tools.' },
            { code: 'SF-SAF-03', label: 'Complaints Procedure', href: '/complaints', blurb: 'How to raise a complaint, response times and escalation routes.' },
            { code: 'SF-SAF-04', label: 'Security & Disclosure', href: '/security', blurb: 'How we protect the platform and how to report a vulnerability.' },
            { code: 'SF-SAF-05', label: 'Accessibility Statement', href: '/accessibility', blurb: 'Our WCAG 2.2 AA commitment, known limitations and feedback.' },
        ],
    },
    {
        key: 'company',
        title: 'Company & Support',
        docs: [
            { code: 'SF-CO-01', label: 'About the Studio', href: '/about', blurb: 'Who builds StreetForge and how the company is run.' },
            { code: 'SF-CO-02', label: 'How It Works', href: '/how-it-works', blurb: 'From registration to the podium in a few steps.' },
            { code: 'SF-CO-03', label: 'FAQ', href: '/faq', blurb: 'Quick answers about racing, garage, credits and accounts.' },
            { code: 'SF-CO-04', label: 'Contact & Support', href: '/contact', blurb: 'Departments, response times and the registered office.' },
            { code: 'SF-CO-05', label: 'Legal Centre', href: '/legal', blurb: 'Every policy and agreement in one place.' },
        ],
    },
];

export const ALL_DOCS = LEGAL_GROUPS.flatMap((g) => g.docs.map((d) => ({ ...d, group: g.title })));

export function findDoc(href) {
    return ALL_DOCS.find((d) => d.href === href);
}
