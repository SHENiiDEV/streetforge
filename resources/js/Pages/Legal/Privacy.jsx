import React from 'react';
import { Lock, Info } from 'lucide-react';
import LegalShell, { P, H3, List, Callout, KV, Table, A, useCompany } from '../../Components/Legal/LegalShell';

export default function Privacy() {
    const c = useCompany();

    const sections = [
        {
            id: 'controller',
            title: 'Who is responsible for your data',
            content: (
                <>
                    <P>
                        {c.name} (Company No. {c.number}, registered office {c.address}) is the controller of the personal data processed through
                        StreetForge. This means we decide why and how your data is used and are responsible for protecting it under the UK General Data
                        Protection Regulation ("UK GDPR"), the Data Protection Act 2018 and the Privacy and Electronic Communications Regulations 2003 (PECR).
                    </P>
                    <KV
                        rows={[
                            ['Data Protection Officer', <A href="mailto:dpo@streetforge.co.uk">dpo@streetforge.co.uk</A>],
                            ['Privacy requests', <A href="mailto:privacy@streetforge.co.uk">privacy@streetforge.co.uk</A>],
                            ['Postal address', `Data Protection Officer, ${c.name}, ${c.address}`],
                        ]}
                    />
                    <Callout title="Short version" tone="neutral" icon={Info}>
                        We collect what we need to run your account, the game and payments, keep it secure, and keep it no longer than necessary. We never sell your
                        data. We never see your full card number — payments are taken by a PCI DSS Level 1 provider on its own page.
                    </Callout>
                </>
            ),
        },
        {
            id: 'collect',
            title: 'What we collect',
            content: (
                <>
                    <Table
                        head={['Category', 'Examples', 'Source']}
                        rows={[
                            ['Identity', 'First name, surname, username, date of birth', 'You, at registration'],
                            ['Contact', 'Email address, phone number, postal address, country', 'You, at registration or in settings'],
                            ['Gameplay', 'Lap times, race results, MMR rating, XP, owned vehicles, upgrades, liveries', 'Generated as you play'],
                            ['Transaction', 'Order reference, package, amount, currency, status, card brand and last 4 digits, provider token', 'Us and our Payment Provider'],
                            ['Technical', 'IP address, browser and OS version, device type, approximate location, session timestamps', 'Your browser, automatically'],
                            ['Communications', 'Support emails, complaint records, survey responses', 'You'],
                            ['Verification', 'Age or identity checks where required for fraud or sanctions reasons', 'You or verification partners'],
                        ]}
                    />
                    <P>
                        We do <strong className="text-white">not</strong> collect or store your full card number, CVC, 3-D Secure codes or banking credentials.
                        These are entered only on the hosted payment page of our PCI DSS Level 1 Payment Provider, as explained on our{' '}
                        <A href="/payment-security">Payment Security</A> page. We do not knowingly collect any special category data (such as health or
                        religious beliefs) and ask you not to send it to us.
                    </P>
                </>
            ),
        },
        {
            id: 'use',
            title: 'How we use it & our legal bases',
            content: (
                <>
                    <P>Under Article 6 UK GDPR we must have a lawful basis for each use of your data:</P>
                    <Table
                        head={['Purpose', 'Lawful basis']}
                        rows={[
                            ['Creating and running your account, garage, wallet and race history', 'Contract'],
                            ['Processing Top-Ups and crediting your wallet after provider confirmation', 'Contract'],
                            ['Issuing receipts and keeping accounting records', 'Legal obligation'],
                            ['Sanctions screening, fraud prevention and anti-money-laundering checks', 'Legal obligation; legitimate interests'],
                            ['Anti-cheat checks on telemetry and lap-time submissions', 'Legitimate interests (fair competition)'],
                            ['Showing your username, car and times on public leaderboards', 'Contract; legitimate interests'],
                            ['Security monitoring, logs and abuse prevention', 'Legitimate interests'],
                            ['Improving performance and fixing bugs with aggregated analytics', 'Legitimate interests / consent for non-essential cookies'],
                            ['Product news and promotional emails', 'Consent — withdraw at any time'],
                            ['Handling complaints and legal claims', 'Legitimate interests; legal obligation'],
                        ]}
                    />
                    <P muted>
                        Where we rely on legitimate interests, we have balanced those interests against your rights. You can ask us for details of that
                        assessment.
                    </P>
                </>
            ),
        },
        {
            id: 'payments',
            title: 'Payment data & the Payment Provider',
            content: (
                <>
                    <P>
                        When you top up, you are redirected to a hosted payment page run by our Payment Provider, which is certified to PCI DSS Level 1. The
                        Payment Provider acts as an independent controller for the card data you enter and for its own fraud-screening and regulatory
                        obligations, and as our processor for the transaction information it sends back to us.
                    </P>
                    <P>
                        We pass the Payment Provider only what is needed to start the payment: the order reference, the amount, the currency and, where
                        required for fraud screening, your email and billing country. In return we receive the payment result, the card brand and last four
                        digits, the expiry date, an authorisation code and a token. Card issuers and card schemes (Visa, Mastercard) also process data
                        according to their own privacy notices.
                    </P>
                    <Callout title="Card data never reaches us" tone="mint" icon={Lock}>
                        Because card details are entered only on the provider's page, they are never transmitted through, stored on or visible to StreetForge
                        systems or staff.
                    </Callout>
                </>
            ),
        },
        {
            id: 'sharing',
            title: 'Who we share data with',
            content: (
                <>
                    <P>We never sell personal data. We share it only with:</P>
                    <List
                        items={[
                            <><strong className="text-white">Payment Provider and card networks</strong> — to take payments, prevent fraud and handle refunds and chargebacks.</>,
                            <><strong className="text-white">Hosting and infrastructure providers</strong> — servers, databases, backups and content delivery, under data processing agreements.</>,
                            <><strong className="text-white">Email delivery providers</strong> — to send account, security and receipt emails.</>,
                            <><strong className="text-white">Sanctions and identity screening services</strong> — where checks are required.</>,
                            <><strong className="text-white">Professional advisers</strong> — accountants, auditors and lawyers, under confidentiality.</>,
                            <><strong className="text-white">Authorities</strong> — HMRC, the police, OFSI, courts or regulators where the law requires us to.</>,
                            <><strong className="text-white">A buyer of our business</strong> — if StreetForge is sold or merged, under equivalent protections.</>,
                        ]}
                    />
                    <P>
                        Other players can see your username, avatar colour, country flag, active vehicle and race results on leaderboards. They cannot see your
                        real name, email, address or purchase history.
                    </P>
                </>
            ),
        },
        {
            id: 'transfers',
            title: 'International transfers',
            content: (
                <P>
                    Our primary systems are hosted in the United Kingdom and the European Economic Area. Where a supplier processes data outside the UK, we make
                    sure it is protected by an adequacy decision, the UK International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual
                    Clauses, together with any additional technical safeguards needed. You can ask for a copy of the relevant safeguards.
                </P>
            ),
        },
        {
            id: 'retention',
            title: 'How long we keep data',
            content: (
                <Table
                    head={['Data', 'Retention period']}
                    rows={[
                        ['Account, profile and gameplay data', 'While your account is open, then deleted or anonymised within 90 days of closure'],
                        ['Transaction and receipt records', '6 years from the end of the financial year (UK tax and company law)'],
                        ['Sanctions and fraud screening records', '5 years after the relationship ends (Money Laundering Regulations 2017)'],
                        ['Support and complaint correspondence', '3 years after the case is closed'],
                        ['Security and access logs', '90 days, unless needed for an active investigation'],
                        ['Marketing consent records', 'Until you withdraw consent, plus 2 years as proof'],
                        ['Anonymised leaderboard history', 'Indefinitely — it no longer identifies you'],
                    ]}
                />
            ),
        },
        {
            id: 'security',
            title: 'How we protect data',
            content: (
                <List
                    items={[
                        'All traffic is encrypted in transit with TLS 1.2+ and HSTS; databases and backups are encrypted at rest.',
                        'Passwords are stored only as salted bcrypt hashes and cannot be read by our staff.',
                        'Access to personal data is restricted to staff who need it, protected by multi-factor authentication and logged.',
                        'Payment card data is outsourced entirely to a PCI DSS Level 1 provider via redirect.',
                        'We run regular vulnerability scanning, dependency updates and a responsible disclosure programme (see Security).',
                        'If a personal data breach is likely to put you at high risk, we will tell you without undue delay and notify the ICO within 72 hours.',
                    ]}
                />
            ),
        },
        {
            id: 'rights',
            title: 'Your rights',
            content: (
                <>
                    <P>Under UK GDPR you have the right to:</P>
                    <KV
                        rows={[
                            ['Access', 'Get a copy of the personal data we hold about you.'],
                            ['Rectification', 'Have inaccurate or incomplete data corrected.'],
                            ['Erasure', 'Ask us to delete your data, where we no longer have a reason to keep it.'],
                            ['Restriction', 'Ask us to pause using your data while a concern is investigated.'],
                            ['Portability', 'Receive data you gave us in a structured, machine-readable format (JSON/CSV).'],
                            ['Objection', 'Object to processing based on legitimate interests, and to direct marketing at any time.'],
                            ['Withdraw consent', 'Where we rely on consent, withdraw it at any time without affecting past processing.'],
                            ['Automated decisions', 'Not be subject to a decision with legal effects based solely on automated processing; anti-cheat flags are always reviewed by a person before a permanent ban.'],
                        ]}
                    />
                    <P>
                        Email <A href="mailto:privacy@streetforge.co.uk">privacy@streetforge.co.uk</A> from your registered address. We may ask you to verify your
                        identity. We respond within one month, extendable by two further months for complex requests, and there is usually no fee.
                    </P>
                </>
            ),
        },
        {
            id: 'marketing',
            title: 'Marketing emails',
            content: (
                <P>
                    We only send promotional emails if you opt in. Every promotional email has an unsubscribe link, and you can change your choice in account
                    settings at any time. Service emails — such as security alerts, receipts and changes to our Terms — are not marketing and will still be sent.
                </P>
            ),
        },
        {
            id: 'children',
            title: 'Children',
            content: (
                <P>
                    StreetForge is only for adults aged 18 and over. We do not knowingly collect data from anyone under 18. If we learn that a minor has created
                    an account we will close it and delete the associated data, and refund any purchases to the original payment method.
                </P>
            ),
        },
        {
            id: 'cookies',
            title: 'Cookies',
            content: (
                <P>
                    We use strictly necessary cookies to keep you logged in and secure, and optional cookies only with your consent. See our{' '}
                    <A href="/cookie-policy">Cookie Policy</A>. The hosted payment page sets its own cookies under the Payment Provider's policies.
                </P>
            ),
        },
        {
            id: 'complaints',
            title: 'Complaints & changes',
            content: (
                <>
                    <P>
                        If you are unhappy with how we handle your data, please contact our DPO first. You also have the right to complain to the Information
                        Commissioner's Office (ICO), Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF, <A href="https://ico.org.uk">ico.org.uk</A>,
                        telephone 0303 123 1113.
                    </P>
                    <P>
                        We may update this policy from time to time. We will notify you of significant changes by email or in-game before they take effect.
                    </P>
                </>
            ),
        },
    ];

    return (
        <LegalShell
            href="/privacy"
            eyebrow="UK GDPR · Data Protection Act 2018"
            title="Privacy"
            accent="Policy"
            lead="How StreetForge collects, uses, shares and protects your personal data, how long we keep it, and the rights you have over it."
            version="3.0"
            sections={sections}
            related={['/cookie-policy', '/payment-security', '/security', '/terms']}
        />
    );
}
