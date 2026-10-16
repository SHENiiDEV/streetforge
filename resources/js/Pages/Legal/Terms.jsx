import { t } from '../../localization';
import React from 'react';
import { ShieldAlert, Lock, Info } from 'lucide-react';
import LegalShell, { P, H3, List, Callout, KV, A, Code, useCompany } from '../../Components/Legal/LegalShell';

const RESTRICTED = [
    'Afghanistan', 'Belarus', 'Central African Republic', 'Cuba', 'DR Congo', 'Haiti', 'Iran', 'Iraq', 'Mali', 'Myanmar (Burma)',
    'North Korea', 'Russia', 'Somalia', 'South Sudan', 'Sudan', 'Syria', 'Venezuela', 'Yemen', 'Zimbabwe',
];

export default function Terms() {
    const c = useCompany();

    const sections = [
        {
            id: 'parties',
            title: 'Who we are & acceptance',
            content: (
                <>
                    <P>{t("These Terms of Service (\"Terms\") form a legally binding agreement between you (\"you\", \"Driver\", \"Player\") and ")}<strong className="text-white">{c.name}</strong>{t(", a private limited company incorporated in England and Wales under company number ")}<span className="numeric text-white">{c.number}</span>{t(", whose registered office is at ")}{c.address}{t(" (\"StreetForge\", \"we\", \"us\", \"our\"). ")}</P>
                    <P>{t("They govern your access to and use of the website ")}<Code>{t("streetforge.co.uk")}</Code>{t(", its subdomains, the StreetForge browser game, the garage, showroom, leaderboards, news section and any related services (together, the \"Service\"). By creating an account, ticking the acceptance box at registration or otherwise using the Service, you confirm that you have read and agree to these Terms together with the documents they refer to, in particular our ")}<A href="/privacy">{t("Privacy Policy")}</A>, <A href="/virtual-credits">{t("Virtual Credits Policy")}</A>,{t(' ')}
                        <A href="/payment-security">{t("Payment Security")}</A>{t(" page, ")}<A href="/refund-policy">{t("Refund Policy")}</A>{t(" and")}{t(' ')}
                        <A href="/fair-play">{t("Fair Play & Acceptable Use Policy")}</A>.
                    </P>
                    <Callout title={t("Plain-English summary")} tone="neutral" icon={Info}>{t("StreetForge is a skill-based racing game for adults. You can buy virtual credits to unlock cars, parts and liveries. Credits are not money, cannot be cashed out and there are no real-world prizes. Payments are taken by a PCI DSS Level 1 provider on its own secure page, not by us. Play fair, keep your account safe, and talk to us if something goes wrong. ")}</Callout>
                </>
            ),
        },
        {
            id: 'definitions',
            title: 'Definitions',
            content: (
                <KV
                    rows={[
                        ['Account', 'The personal profile you register to access the Service, including your garage, wallet and race history.'],
                        ['Credits / CR', 'StreetForge Credits — a limited, non-transferable licence to use in-game virtual currency, described in the Virtual Credits Policy.'],
                        ['Virtual Items', 'Vehicles, upgrades, performance parts, skins, liveries and other digital content obtainable in the Service.'],
                        ['Top-Up', 'A purchase of Credits for real money, completed on the hosted payment page of our payment service provider.'],
                        ['Payment Provider', 'The independent, PCI DSS Level 1 certified payment service provider that operates the hosted payment page.'],
                        ['Content', 'Any text, graphics, code, audio, telemetry and other material made available through the Service.'],
                    ]}
                />
            ),
        },
        {
            id: 'eligibility',
            title: 'Eligibility & age requirement',
            content: (
                <>
                    <P>{t("To create an account and use the Service you must:")}</P>
                    <List
                        items={[
                            'be at least 18 years old, or the age of legal majority in your country of residence if higher;',
                            'have full legal capacity to enter into a binding contract;',
                            'not be resident in, located in or a national acting on behalf of a restricted jurisdiction listed in section 5;',
                            'not appear on any sanctions or watch list maintained by the UK, EU, UN or US authorities;',
                            'not have previously had an account terminated by us for breach of these Terms, unless we have agreed otherwise in writing.',
                        ]}
                    />
                    <P>{t("We may ask you to verify your age or identity at any time, including before allowing a Top-Up or after unusual account activity. If you do not provide satisfactory verification within a reasonable time we may restrict or close your account. See our")}{t(' ')}
                        <A href="/responsible-play">{t("Responsible Play & 18+ Policy")}</A>.
                    </P>
                </>
            ),
        },
        {
            id: 'account',
            title: 'Your account & security',
            content: (
                <>
                    <P>{t("You may hold only one account. The information you give at registration — name, date of birth, country and email address — must be accurate and kept up to date. Your account is personal to you: you may not sell, rent, share, gift or transfer it, or let anyone else log in to it. ")}</P>
                    <List
                        items={[
                            'Choose a strong, unique password and do not reuse it on other sites.',
                            'Keep your login details confidential; you are responsible for activity under your account unless it results from our own failure.',
                            'Tell us immediately at security@streetforge.co.uk if you believe your account has been accessed without permission.',
                            'We will never ask for your password, full card number, CVC or one-time banking codes.',
                        ]}
                    />
                    <P>{t("Accounts with no login for 24 consecutive months may be classed as dormant. We will email you at least 30 days before closing a dormant account. Any unused Credits on a dormant account are treated as set out in the Virtual Credits Policy. ")}</P>
                </>
            ),
        },
        {
            id: 'sanctions',
            title: 'Sanctions & restricted jurisdictions',
            content: (
                <>
                    <P>
                        {c.name}{t(" complies with financial sanctions administered by the UK Office of Financial Sanctions Implementation (OFSI), and takes into account measures adopted by the European Union, the United Nations Security Council and the US Office of Foreign Assets Control (OFAC). The Service is not available to persons resident or located in the following jurisdictions: ")}</P>
                    <div className="surface p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                        {RESTRICTED.map((r) => (
                            <span key={r} className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="w-1 h-1 bg-red-400/80" /> {t(r)}
                            </span>
                        ))}
                    </div>
                    <Callout title={t("Circumvention")} tone="red" icon={ShieldAlert}>{t("Using a VPN, proxy, false address or another person's identity to access the Service from a restricted jurisdiction is a serious breach. We will close the account and, where the law requires, freeze balances and report to the relevant authority. More detail is in our")}{t(' ')}
                        <A href="/aml-sanctions">{t("Sanctions & AML Policy")}</A>.
                    </Callout>
                </>
            ),
        },
        {
            id: 'service',
            title: 'The Service & licence to play',
            content: (
                <>
                    <P>{t("Subject to these Terms, we grant you a personal, limited, revocable, non-exclusive, non-transferable and non-sublicensable licence to access and use the Service through a supported web browser for your own private, non-commercial entertainment. ")}</P>
                    <P>{t("The Service is skill-based. Race results depend on driving lines, timing, vehicle setup and tuning choices. There is no element of chance that determines the value of anything you receive, there are no paid random loot boxes, and nothing you win in the game has a real-world monetary value. StreetForge is not a gambling service. ")}</P>
                    <P>{t("We continuously develop the Service. We may add, change or remove tracks, vehicles, physics parameters, rewards and features, rebalance prices and performance, or run limited-time events. Where a change materially and negatively affects Virtual Items you have bought with Credits, we will give you reasonable notice and, where appropriate, compensation in Credits. ")}</P>
                </>
            ),
        },
        {
            id: 'credits',
            title: 'Credits & Virtual Items',
            content: (
                <>
                    <P>{t("Credits and Virtual Items are licensed, not sold. When you obtain them you receive a limited right to use them within the Service while your account is active. They are not property, not e-money, not a deposit, not a financial instrument and not a stored-value product. ")}</P>
                    <List
                        items={[
                            'Credits cannot be exchanged for cash, withdrawn, transferred to another account, or traded on any external market.',
                            'Credits earned by racing and Credits obtained by Top-Up are spent in the order shown in your wallet.',
                            'Purchased Credits do not expire while your account is active and in good standing.',
                            'We do not recognise or support any transfer, sale or "real money trading" of accounts, Credits or Virtual Items, and such activity may lead to termination.',
                        ]}
                    />
                    <P>{t("Full details are in the ")}<A href="/virtual-credits">{t("Virtual Credits Policy")}</A>.</P>
                </>
            ),
        },
        {
            id: 'payments',
            title: 'Purchases & payment processing',
            content: (
                <>
                    <P>{t("Prices for Top-Up packages are displayed in the Top-Up section in your selected currency (USD, EUR or GBP), using our fixed exchange rates and include any applicable taxes. The price that applies is the one shown when you confirm your order. We may change package prices for future orders at any time. ")}</P>
                    <H3>{t("How a payment is taken")}</H3>
                    <P>{t("StreetForge does not collect card details. When you confirm a package, we create an order with a unique reference and then ")}<strong className="text-white">{t(" redirect your browser to a hosted payment page operated by our Payment Provider, which is certified to PCI DSS Level 1")}</strong>{t(" — the highest level of the card industry's data security standard. You enter your card details only on that page. Where your bank requires it, you will complete Strong Customer Authentication (3-D Secure) with your bank. ")}</P>
                    <P>{t("The Payment Provider sends us a signed server-to-server confirmation. Your contract for the Credits is formed, and the Credits are added to your wallet, only when that confirmation is received and verified. Returning to our site from the payment page is not by itself confirmation of payment. The full process is explained on our ")}<A href="/payment-security">{t("Payment Security")}</A>{t(" page. ")}</P>
                    <Callout title={t("Card data")} tone="mint" icon={Lock}>{t("We only ever receive and store the card brand, the last four digits, the expiry date, an authorisation code and a payment token — never the full card number or CVC. ")}</Callout>
                    <H3>{t("Your obligations when paying")}</H3>
                    <List
                        items={[
                            'You must be the cardholder or be expressly authorised by the cardholder to use the payment method.',
                            'The billing country must match your account country and must not be a restricted jurisdiction.',
                            'You must not use stolen, compromised or anonymous prepaid cards, or any payment method in breach of its issuer\'s terms.',
                            'Additional fees charged by your bank, such as foreign-exchange fees, are your responsibility.',
                        ]}
                    />
                    <P>{t("We may refuse or cancel any order, or set spending limits, where we reasonably suspect fraud, money laundering, sanctions risk, a pricing error or a breach of these Terms. If a payment has been taken for a cancelled order, it will be refunded to the original payment method. Billing specifics such as receipts, order statuses and statement descriptors are set out in our ")}<A href="/billing-terms">{t("Billing Terms")}</A>.
                    </P>
                </>
            ),
        },
        {
            id: 'cancellation',
            title: 'Cancellation rights & refunds',
            content: (
                <>
                    <P>{t("Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 you normally have 14 days to cancel a distance contract. For digital content supplied immediately, that right ends once supply begins with your express consent. At checkout you are asked to request immediate delivery of Credits and to acknowledge that you lose the right to cancel once they are credited. ")}</P>
                    <P>{t("This does not affect your statutory rights under the Consumer Rights Act 2015. If Credits or Virtual Items are faulty, not as described or not delivered, you are entitled to a repair, replacement or, where that is not possible, a refund. Our")}{t(' ')}
                        <A href="/refund-policy">{t("Refund & Cancellation Policy")}</A>{t(" explains when refunds are available and how to ask for one. ")}</P>
                </>
            ),
        },
        {
            id: 'chargebacks',
            title: 'Chargebacks',
            content: (
                <P>{t("If you believe a payment was taken in error, please contact ")}<A href="mailto:billing@streetforge.co.uk">{t("billing@streetforge.co.uk")}</A>{t(" before raising a dispute with your bank — we can usually resolve it faster. When a chargeback is opened we will suspend purchasing and may restrict the account until it is resolved. If a chargeback is found to be unjustified we may recover Credits bought with the disputed payment. See our")}{t(' ')}
                    <A href="/chargeback-policy">{t("Chargeback Policy")}</A>.
                </P>
            ),
        },
        {
            id: 'conduct',
            title: 'Fair play & conduct',
            content: (
                <>
                    <P>{t("You agree not to, and not to help anyone else to:")}</P>
                    <List
                        items={[
                            'use cheats, bots, macros, speed hacks, memory editors, modified clients or scripts that automate or alter gameplay;',
                            'exploit bugs, physics glitches or track boundary errors to gain an advantage — report them instead;',
                            'tamper with telemetry, lap-time submissions, network traffic or our APIs;',
                            'harass, threaten, impersonate or discriminate against other players or our staff;',
                            'use offensive, hateful or infringing usernames, liveries or other user content;',
                            'reverse-engineer, scrape, decompile or overload the Service, or attempt to access accounts or systems that are not yours;',
                            'use the Service for any commercial purpose, advertising, or money-laundering activity.',
                        ]}
                    />
                    <P>{t("Enforcement measures range from warnings to leaderboard removal, temporary suspension and permanent termination, as set out in the")}{t(' ')}
                        <A href="/fair-play">{t("Fair Play & Acceptable Use Policy")}</A>.
                    </P>
                </>
            ),
        },
        {
            id: 'user-content',
            title: 'User content',
            content: (
                <P>{t("If you create usernames, liveries, team names or other content in the Service, you keep any rights you have in it, but you grant us a worldwide, royalty-free, non-exclusive licence to host, display, reproduce and adapt it for the purpose of operating and promoting the Service. You confirm you have the right to grant that licence and that your content does not infringe anyone else's rights or break the law. We may remove any user content at our discretion. ")}</P>
            ),
        },
        {
            id: 'ip',
            title: 'Intellectual property',
            content: (
                <P>{t("The Service and all Content — including the physics engine, source code, vehicle designs, track layouts, audio, visual assets, the StreetForge name and logo — are owned by or licensed to ")}{c.name}{t(" and are protected by copyright, trade mark and other laws. Except for the licence in section 6, no rights are granted to you. Vehicle designs in the Service are fictional and are not affiliated with any real-world manufacturer. See our ")}<A href="/intellectual-property">{t("Intellectual Property")}</A>{t(" page, including how to report infringement. ")}</P>
            ),
        },
        {
            id: 'availability',
            title: 'Availability & maintenance',
            content: (
                <P>{t("We aim to keep the Service available at all times but cannot guarantee uninterrupted access. We may suspend it for scheduled maintenance — usually announced in the Paddock Wire news section — for emergency security work, or because of events beyond our reasonable control such as hosting outages, network failures, or acts of government. We are not responsible for problems caused by your device, browser, internet connection or third-party software. ")}</P>
            ),
        },
        {
            id: 'termination',
            title: 'Suspension & termination',
            content: (
                <>
                    <P>{t("You may close your account at any time from your account settings or by emailing support. We may suspend or terminate your account, with notice where reasonably possible, if you materially breach these Terms, if we are required to do so by law or a regulator, if your account is linked to fraud, sanctions risk or chargeback abuse, or if we discontinue the Service. ")}</P>
                    <P>{t("If we discontinue the Service entirely for reasons other than your breach, we will give at least 60 days' notice and refund the unused balance of any Credits purchased in the 90 days before the notice. Otherwise, on termination your licence to Credits and Virtual Items ends and they are not refundable, except where the law says otherwise. ")}</P>
                </>
            ),
        },
        {
            id: 'liability',
            title: 'Liability',
            content: (
                <>
                    <P>{t("Nothing in these Terms limits or excludes our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot be limited or excluded under English law, including your statutory rights as a consumer. ")}</P>
                    <P>{t("Subject to that, we are not liable for losses that were not reasonably foreseeable, for business losses (the Service is for private use only), or for losses caused by events outside our reasonable control. Our total liability to you in connection with the Service in any twelve-month period is limited to the greater of £100 and the amount you paid us for Credits in that period. ")}</P>
                    <P>{t("If defective digital content we supply damages a device or other digital content belonging to you, and this is caused by our failure to use reasonable care and skill, we will either repair the damage or pay you compensation. ")}</P>
                </>
            ),
        },
        {
            id: 'changes',
            title: 'Changes to these Terms',
            content: (
                <P>{t("We may update these Terms to reflect changes in the law, our Service, or how we operate. For material changes we will notify you by email or in-game at least 30 days in advance. If you do not agree to the changes you may close your account before they take effect and, where the changes are to your disadvantage, request a refund of any unused purchased Credits bought within the previous 90 days. Continuing to use the Service after the effective date means you accept the updated Terms. ")}</P>
            ),
        },
        {
            id: 'complaints',
            title: 'Complaints & disputes',
            content: (
                <P>{t("If you are unhappy, please follow our ")}<A href="/complaints">{t("Complaints Procedure")}</A>{t(". We acknowledge complaints within 2 business days and aim to resolve them within 14 days. You may also have the right to refer a dispute to an alternative dispute resolution provider, or to contact your local consumer protection body. ")}</P>
            ),
        },
        {
            id: 'law',
            title: 'Governing law & general',
            content: (
                <>
                    <P>{t("These Terms are governed by the laws of England and Wales. The courts of England and Wales have non-exclusive jurisdiction; if you live in Scotland or Northern Ireland you may also bring proceedings there, and if you live in the EU you keep the protection of the mandatory consumer laws of your country of residence. ")}</P>
                    <P>{t("If any provision of these Terms is found invalid, the remaining provisions stay in force. If we do not enforce a right immediately, we can still do so later. We may transfer our rights and obligations under these Terms to another organisation, and will tell you if this happens; it will not reduce your rights. No third party has any right to enforce these Terms. ")}</P>
                </>
            ),
        },
        {
            id: 'contact',
            title: 'Contact & legal notices',
            content: (
                <KV
                    rows={[
                        ['Legal entity', c.name],
                        ['Company number', <span className="numeric">{c.number}</span>],
                        ['Registered office', c.address],
                        ['General support', <A href={`mailto:${c.email}`}>{c.email}</A>],
                        ['Billing', <A href="mailto:billing@streetforge.co.uk">{t("billing@streetforge.co.uk")}</A>],
                        ['Legal notices', <A href="mailto:legal@streetforge.co.uk">{t("legal@streetforge.co.uk")}</A>],
                    ]}
                />
            ),
        },
    ];

    return (
        <LegalShell
            href="/terms"
            eyebrow="Legal agreement"
            title={t("Terms of")}
            accent="Service"
            lead="The rules that apply when you create a StreetForge account, race, buy virtual credits or use any part of the platform. Please read them carefully — they affect your legal rights."
            version="4.0"
            sections={sections}
            related={['/privacy', '/payment-security', '/virtual-credits', '/fair-play']}
        />
    );
}
