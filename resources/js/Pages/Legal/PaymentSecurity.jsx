import { t } from '../../localization';
import React from 'react';
import { Lock, ShieldCheck, KeyRound, Fingerprint, ServerOff, ArrowRightLeft, Eye, Webhook, CreditCard, AlertTriangle } from 'lucide-react';
import LegalShell, { P, H3, List, Callout, KV, Table, Steps, Cards, A, Code, useCompany } from '../../Components/Legal/LegalShell';

/* Visual of the redirect flow: StreetForge → hosted payment page → back */
function RedirectDiagram() {
    const nodes = [
        { k: 'A', title: 'streetforge.co.uk', sub: 'Order created · no card fields', tone: 'border-white/15 text-slate-200' },
        { k: 'B', title: 'Hosted Payment Page', sub: 'PCI DSS Level 1 provider · 3-D Secure', tone: 'border-emerald-400/50 text-emerald-200 bg-emerald-400/[0.05]' },
        { k: 'C', title: 'Card issuer / bank', sub: 'Authentication & authorisation', tone: 'border-white/15 text-slate-200' },
    ];
    return (
        <div className="surface p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
                <span className="label-tech text-slate-500">{t("Checkout data path")}</span>
                <span className="label-tech text-emerald-400 flex items-center gap-1.5"><Lock className="w-3 h-3" />{t(" TLS 1.2+ end-to-end")}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch">
                {nodes.map((n, i) => (
                    <React.Fragment key={n.k}>
                        <div className={`border p-4 space-y-1.5 ${n.tone}`}>
                            <div className="label-tech opacity-60">{t("Zone ")}{t(n.k)}</div>
                            <div className="font-display font-bold uppercase tracking-wide">{t(n.title)}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{t(n.sub)}</div>
                        </div>
                        {i < nodes.length - 1 && (
                            <div className="flex sm:flex-col items-center justify-center gap-1 text-cyan-400/70">
                                <ArrowRightLeft className="w-4 h-4 rotate-90 sm:rotate-0" />
                                <span className="label-tech text-slate-600">{t(i === 0 ? '302 redirect' : 'ACS / 3DS')}</span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-white/[0.07] p-3 text-slate-400">
                    <span className="label-tech text-slate-500 block mb-1">{t("What StreetForge receives")}</span>{t("Order reference, amount, status, card brand, last four digits, expiry month/year, authorisation code, provider token. ")}</div>
                <div className="border border-red-400/20 p-3 text-slate-400">
                    <span className="label-tech text-red-300/80 block mb-1">{t("What StreetForge never receives")}</span>{t("Full card number (PAN), CVV/CVC, 3-D Secure passcodes, one-time SMS codes, online-banking credentials. ")}</div>
            </div>
        </div>
    );
}

export default function PaymentSecurity() {
    const c = useCompany();

    const sections = [
        {
            id: 'overview',
            title: 'Overview: we never handle your card',
            content: (
                <>
                    <P>{t("StreetForge is a browser racing game. We sell digital StreetForge Credits (\"CR\"), and we have deliberately designed our checkout so that ")}<strong className="text-white">{t(" your card details never touch our servers, our database, our logs or our support tools")}</strong>{t(". When you decide to top up, our website does not show you a card form. Instead, it creates an order and then ")}<strong className="text-white">{t("redirects your browser to a hosted payment page")}</strong>{t(" operated by our payment service provider, an independently audited ")}<strong className="text-white">{t(" PCI DSS Level 1")}</strong>{t(" certified company. ")}</P>
                    <P>{t("PCI DSS (the Payment Card Industry Data Security Standard) is the security standard created by Visa, Mastercard, American Express, Discover and JCB. Level 1 is the highest validation tier: it applies to providers processing more than six million card transactions a year and requires an annual on-site audit by a Qualified Security Assessor (QSA), quarterly network scans by an Approved Scanning Vendor (ASV) and continuous penetration testing. ")}</P>
                    <RedirectDiagram />
                    <Callout title={t("In one sentence")} tone="mint" icon={ShieldCheck}>{t("You choose a package on StreetForge → you are sent to a secure payment page run by a PCI DSS Level 1 provider → you pay there, with 3-D Secure where your bank requires it → you are sent back to StreetForge, and credits arrive once the provider confirms the payment to us server-to-server. ")}</Callout>
                </>
            ),
        },
        {
            id: 'flow',
            title: 'Step-by-step: what happens when you pay',
            content: (
                <>
                    <P>{t("Every top-up follows exactly the same sequence. There are no shortcuts and no alternative card forms anywhere on the site.")}</P>
                    <Steps
                        steps={[
                            { tag: 'streetforge', title: 'Choose a package', text: 'In the Top-Up section you pick a credit package. The price, number of credits and any bonus are shown before you continue.' },
                            { tag: 'streetforge', title: 'Order is created', text: 'Our server creates a pending order with a unique reference (e.g. TOP-XXXXXXXXXX), the amount, currency and your account ID. No payment data is collected.' },
                            { tag: 'redirect', title: 'Secure redirect', text: 'Your browser is redirected over HTTPS to the hosted payment page. The address bar changes to the provider\'s domain and shows a valid TLS certificate.' },
                            { tag: 'provider', title: 'Enter card details', text: 'You type your card number, expiry and CVC directly into the provider\'s page. These fields are served, stored and encrypted only by the provider.' },
                            { tag: 'issuer', title: '3-D Secure check', text: 'If your bank requires Strong Customer Authentication, you approve the payment in your banking app or with a one-time code. StreetForge cannot see this step.' },
                            { tag: 'provider', title: 'Authorisation', text: 'The provider sends the authorisation request through the card network to your bank and receives an approve or decline response.' },
                            { tag: 'webhook', title: 'Signed confirmation', text: 'The provider notifies our server through a signed webhook. We verify the signature, amount, currency and order reference before doing anything.' },
                            { tag: 'streetforge', title: 'Credits & receipt', text: 'Only after verification are credits added to your wallet. You are returned to StreetForge and a receipt is issued to your account and email.' },
                        ]}
                    />
                    <P muted>{t("If you close the payment page, lose connection, or your bank declines the payment, the order simply stays pending and then expires. You are never charged for an order that was not authorised, and no credits are added for an unconfirmed payment. ")}</P>
                </>
            ),
        },
        {
            id: 'why-redirect',
            title: 'Why we use a redirect rather than an on-site form',
            content: (
                <>
                    <P>{t("Many websites embed a card form inside their own pages. That is technically possible, but it means the merchant's website, scripts and third-party plug-ins all sit in the same page as your card number. A redirect to a hosted payment page removes that risk entirely: ")}</P>
                    <Cards
                        items={[
                            { icon: ServerOff, title: 'Out of scope by design', text: 'Because card data is never entered on, transmitted through or stored by StreetForge systems, a breach of our website could not expose card numbers.' },
                            { icon: ShieldCheck, title: 'Audited environment', text: 'The page you pay on is covered by the provider\'s PCI DSS Level 1 Report on Compliance and Attestation of Compliance, renewed every year.', tone: 'text-emerald-400' },
                            { icon: Eye, title: 'Visible to you', text: 'You can verify the provider\'s domain and certificate in the address bar before entering anything — something you cannot do with an embedded form.', tone: 'text-orange-300' },
                        ]}
                    />
                    <P>{t("Under PCI DSS v4.0 this integration model allows us to complete the shortest self-assessment questionnaire (SAQ A), which is reserved for merchants that have fully outsourced all cardholder-data functions to validated providers. We still complete it annually, review our provider's compliance documentation and monitor the scripts on the pages that initiate the redirect. ")}</P>
                </>
            ),
        },
        {
            id: 'sca',
            title: '3-D Secure & Strong Customer Authentication',
            content: (
                <>
                    <P>{t("Payments from the UK and the European Economic Area are subject to Strong Customer Authentication (SCA) under the UK Payment Services Regulations 2017 and the EU's PSD2. In practice this means your bank may ask you to confirm the payment using two of: something you know (a PIN or password), something you have (your phone or a card reader) or something you are (fingerprint or face ID). ")}</P>
                    <P>{t("The hosted payment page supports ")}<strong className="text-white">{t("EMV 3-D Secure 2")}</strong>{t(" (Visa Secure, Mastercard Identity Check). In many cases your bank can approve the payment silently using risk data, without any challenge. When a challenge is required, it appears in a window controlled by your bank. StreetForge staff will never ask you for a 3-D Secure code, an SMS code or your banking password — by email, chat, phone or in-game. ")}</P>
                    <Callout title={t("Phishing warning")} tone="red" icon={AlertTriangle}>{t("If anyone claiming to be from StreetForge asks for your card number, CVC or a one-time code, it is a scam. Report it to")}{t(' ')}
                        <A href="mailto:security@streetforge.co.uk">{t("security@streetforge.co.uk")}</A>{t(" and contact your bank. ")}</Callout>
                </>
            ),
        },
        {
            id: 'data',
            title: 'What payment data we store',
            content: (
                <>
                    <P>{t("To show your purchase history, issue receipts, process refunds and meet our accounting obligations, we keep a limited transaction record. This record cannot be used to make a new payment. ")}</P>
                    <Table
                        head={['Data field', 'Stored by StreetForge?', 'Purpose / retention']}
                        rows={[
                            ['Order reference & timestamp', 'Yes', 'Purchase history, support, accounting — 6 years (HMRC record keeping)'],
                            ['Amount, currency, package', 'Yes', 'Receipts and tax reporting — 6 years'],
                            ['Card brand & last 4 digits', 'Yes', 'Helping you recognise the card used — life of the account'],
                            ['Provider token / payment ID', 'Yes', 'Matching refunds and disputes to the original payment'],
                            ['Full card number (PAN)', 'Never', 'Held only by the PCI DSS Level 1 provider'],
                            ['CVV / CVC', 'Never', 'Not stored by anyone after authorisation, per PCI DSS'],
                            ['3-D Secure codes, banking logins', 'Never', 'Handled only between you and your bank'],
                        ]}
                    />
                    <P muted>{t("More detail on how we handle personal data generally is in our ")}<A href="/privacy">{t("Privacy Policy")}</A>.
                    </P>
                </>
            ),
        },
        {
            id: 'webhooks',
            title: 'How we confirm a payment (webhooks)',
            content: (
                <>
                    <P>{t("Returning to our site after payment is not, on its own, proof that a payment succeeded — a browser redirect can be interrupted or faked. That is why credits are only issued after a ")}<strong className="text-white">{t("server-to-server notification")}</strong>{t(" (a \"webhook\") from the payment provider. Each notification is: ")}</P>
                    <List
                        items={[
                            <>{t("Signed with a shared secret using HMAC-SHA256; requests with a missing or invalid signature are rejected and logged.")}</>,
                            <>{t("Checked against the original order: reference, amount, currency and account must all match exactly.")}</>,
                            <>{t("Idempotent — a duplicate notification for an order that is already completed is acknowledged but never credits the wallet twice.")}</>,
                            <>{t("Time-stamped and replay-protected, so an old notification cannot be resent to trigger a new credit.")}</>,
                        ]}
                    />
                    <P>{t("Webhook delivery is usually instant. In rare cases of provider delays it can take a few minutes. If you were charged and credits have not appeared within two hours, contact ")}<A href="mailto:billing@streetforge.co.uk">{t("billing@streetforge.co.uk")}</A>{t(" with your order reference. ")}</P>
                </>
            ),
        },
        {
            id: 'methods',
            title: 'Accepted payment methods',
            content: (
                <>
                    <P>{t("Availability depends on your country and on what the payment provider supports for your card. The methods shown on the hosted payment page at the moment of purchase are the ones available to you. ")}</P>
                    <KV
                        rows={[
                            ['Debit & credit cards', 'Visa, Visa Debit, Mastercard, Debit Mastercard, Maestro (where supported)'],
                            ['Currency', 'Packages are priced in your selected currency (USD, EUR or GBP) using fixed exchange rates. If your card is in another currency, your card issuer converts the amount and may charge a foreign-exchange fee'],
                            ['Statement descriptor', <><Code>{t("STREETFORGE*CREDITS")}</Code>{t(" or ")}<Code>{t("STREETFORGE LTD")}</Code></>],
                            ['Not accepted', 'Prepaid anonymous cards, cards issued in restricted jurisdictions, third-party cards you are not authorised to use'],
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'fraud',
            title: 'Fraud prevention',
            content: (
                <>
                    <P>{t("The payment provider runs real-time fraud screening on every transaction, using device data, velocity checks and network-wide signals. On our side we apply additional, non-card controls: ")}</P>
                    <List
                        items={[
                            'Daily and monthly top-up limits per account, which you can lower further in your account settings.',
                            'Checks that the billing country is consistent with your account and IP location, in line with our Sanctions & AML Policy.',
                            'Automatic holds on accounts with unusual purchase patterns until the account holder is verified.',
                            'Immediate suspension of top-ups on accounts that are the subject of a chargeback, pending investigation.',
                        ]}
                    />
                    <P>{t("A payment may occasionally be declined by the provider or your bank even when nothing is wrong. We are not told the reason for a bank decline; please contact your card issuer first, then our billing team if the problem continues. ")}</P>
                </>
            ),
        },
        {
            id: 'transport',
            title: 'Encryption & platform security',
            content: (
                <>
                    <Cards
                        cols={2}
                        items={[
                            { icon: Lock, title: 'TLS everywhere', text: 'All pages are served over HTTPS with TLS 1.2 or 1.3 and HSTS. Plain-HTTP requests are permanently redirected.' },
                            { icon: KeyRound, title: 'Secrets management', text: 'Provider API keys and webhook secrets live in encrypted environment storage, are rotated regularly and are never in source code.' },
                            { icon: Fingerprint, title: 'Account protection', text: 'Passwords are hashed with bcrypt. Login attempts are rate-limited and suspicious sign-ins trigger email alerts.' },
                            { icon: Webhook, title: 'Least privilege', text: 'Only a small number of named staff can access transaction records, and every access is logged for audit.' },
                        ]}
                    />
                    <P muted>{t("Found a security issue? See our ")}<A href="/security">{t("Security & Responsible Disclosure")}</A>{t(" page. ")}</P>
                </>
            ),
        },
        {
            id: 'refunds',
            title: 'Refunds, disputes & receipts',
            content: (
                <>
                    <P>{t("Approved refunds are returned to the same card through the payment provider — we never refund to a different card, bank account or wallet. Refunds normally appear on your statement within 5–10 business days depending on your bank. The rules for when a refund is available are set out in our ")}<A href="/refund-policy">{t("Refund & Cancellation Policy")}</A>{t("; how card disputes work is explained in our")}{t(' ')}
                        <A href="/chargeback-policy">{t("Chargeback Policy")}</A>.
                    </P>
                    <P>{t("A receipt with the order reference, date, amount and the seller's details (")}{c.name}{t(", Company No. ")}{c.number}{t(") is available in your account for every completed payment. Billing questions: ")}<A href="mailto:billing@streetforge.co.uk">{t("billing@streetforge.co.uk")}</A>.
                    </P>
                </>
            ),
        },
    ];

    return (
        <LegalShell
            href="/payment-security"
            eyebrow="Payments & Card Security"
            title={t("How we process")}
            accent="payments"
            lead="Card payments on StreetForge are taken on a hosted payment page run by a PCI DSS Level 1 certified provider. You are redirected there to pay, and your card details never reach our servers."
            version="2.0"
            sections={sections}
            related={['/billing-terms', '/refund-policy', '/chargeback-policy', '/security']}
        />
    );
}
