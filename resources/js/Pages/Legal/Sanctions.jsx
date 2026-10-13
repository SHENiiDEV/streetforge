import React from 'react';
import { usePage } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';
import LegalShell, { P, List, Callout, KV, Cards, A, useCompany } from '../../Components/Legal/LegalShell';
import { Globe2, CreditCard, UserCheck } from 'lucide-react';

export default function Sanctions() {
    const { sanctions } = usePage().props;
    const c = useCompany();
    const countries = sanctions?.blacklisted_countries || [
        'Afghanistan', 'Belarus', 'Central African Republic', 'Cuba', 'Democratic Republic of the Congo', 'Haiti', 'Iran', 'Iraq',
        'Mali', 'Myanmar (Burma)', 'North Korea', 'Russia', 'Somalia', 'South Sudan', 'Sudan', 'Syria', 'Venezuela', 'Zimbabwe',
    ];

    const sections = [
        {
            id: 'purpose',
            title: 'Purpose & legal framework',
            content: (
                <>
                    <P>
                        {c.name} is committed to preventing its platform from being used to breach financial sanctions or to launder money. Although StreetForge
                        Credits have no cash value and cannot be withdrawn, we apply controls proportionate to the risks of an online service that accepts card
                        payments from many countries.
                    </P>
                    <P>
                        This policy is based on the Sanctions and Anti-Money Laundering Act 2018 (SAMLA), regulations made under it, guidance from the Office of
                        Financial Sanctions Implementation (OFSI), the Proceeds of Crime Act 2002, and the recommendations of the Financial Action Task Force
                        (FATF). We also take into account EU, UN and US (OFAC) measures where they affect our Payment Provider or card networks.
                    </P>
                </>
            ),
        },
        {
            id: 'jurisdictions',
            title: `Restricted jurisdictions (${countries.length})`,
            content: (
                <>
                    <P>
                        Registration, gameplay and payments are not available to persons resident or located in, or using payment cards issued in, the following
                        jurisdictions:
                    </P>
                    <div className="surface p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                        {countries.map((r) => (
                            <span key={r} className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="w-1 h-1 bg-red-400/80 shrink-0" /> {r}
                            </span>
                        ))}
                    </div>
                    <P muted>We review this list at least quarterly and whenever sanctions regimes change.</P>
                </>
            ),
        },
        {
            id: 'controls',
            title: 'Screening controls',
            content: (
                <>
                    <Cards
                        items={[
                            { icon: UserCheck, title: 'At registration', text: 'Country of residence is validated against the restricted list, and names can be screened against the UK consolidated list of designated persons.' },
                            { icon: Globe2, title: 'Connection checks', text: 'IP geolocation and detection of commercial VPNs, Tor exit nodes and anonymising proxies at registration and checkout.', tone: 'text-orange-300' },
                            { icon: CreditCard, title: 'At payment', text: 'Our PCI DSS Level 1 Payment Provider screens the card\'s issuing country (BIN) and blocks cards from restricted jurisdictions on the hosted payment page.', tone: 'text-emerald-400' },
                        ]}
                    />
                    <P>
                        Because payment is taken on the Payment Provider's hosted page, card-level screening happens in the Provider's environment. We receive only
                        the result and the card's issuing country, never the card number.
                    </P>
                </>
            ),
        },
        {
            id: 'aml',
            title: 'Anti-money-laundering measures',
            content: (
                <List
                    items={[
                        'Per-account daily and monthly top-up limits.',
                        'Credits cannot be transferred between accounts, withdrawn or exchanged for money, which removes the main laundering route.',
                        'Monitoring for unusual patterns such as many cards on one account, rapid repeated top-ups or many accounts from one device.',
                        'Enhanced checks — identity verification and source-of-funds questions — when risk indicators are present.',
                        'Staff training on recognising suspicious activity and on our internal reporting procedure.',
                        'Retention of screening records for five years after the end of the relationship.',
                    ]}
                />
            ),
        },
        {
            id: 'consequences',
            title: 'Circumvention & consequences',
            content: (
                <Callout title="Zero tolerance" tone="red" icon={ShieldAlert}>
                    Supplying false address details, using another person's identity or card, or masking your location to bypass these controls will result in
                    immediate account closure. Where the law requires, we will freeze any balances and report to OFSI, the National Crime Agency or other competent
                    authorities. We may be legally prohibited from telling you that a report has been made.
                </Callout>
            ),
        },
        {
            id: 'contact',
            title: 'Compliance contact',
            content: (
                <KV
                    rows={[
                        ['Department', `${c.name} — Compliance`],
                        ['Email', <A href="mailto:compliance@streetforge.co.uk">compliance@streetforge.co.uk</A>],
                        ['Post', c.address],
                    ]}
                />
            ),
        },
    ];

    return (
        <LegalShell
            href="/aml-sanctions"
            eyebrow="OFSI · SAMLA · FATF"
            title="Sanctions &"
            accent="AML Policy"
            lead="The controls StreetForge applies to keep the platform out of reach of sanctioned persons and jurisdictions, and to prevent money laundering."
            version="2.0"
            sections={sections}
            related={['/terms', '/payment-security', '/chargeback-policy', '/privacy']}
        />
    );
}
