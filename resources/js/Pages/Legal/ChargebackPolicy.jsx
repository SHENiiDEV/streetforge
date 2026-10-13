import React from 'react';
import { AlertTriangle } from 'lucide-react';
import LegalShell, { P, List, Callout, Steps, Table, A } from '../../Components/Legal/LegalShell';

export default function ChargebackPolicy() {
    const sections = [
        {
            id: 'what',
            title: 'What a chargeback is',
            content: (
                <>
                    <P>
                        A chargeback is a reversal of a card payment initiated by your card issuer, usually after you dispute a transaction with your bank. It is
                        an important consumer protection for genuine fraud and for goods or services that were never provided. Chargebacks are handled under the
                        rules of the card schemes (Visa and Mastercard) and are processed through our PCI DSS Level 1 Payment Provider.
                    </P>
                    <P>
                        Because each chargeback carries fees and affects our standing with the card networks, we ask that you contact us first. Most billing
                        problems — duplicate charges, missing Credits — are fixed within a day by our billing team.
                    </P>
                </>
            ),
        },
        {
            id: 'before',
            title: 'Before you contact your bank',
            content: (
                <List
                    ordered
                    items={[
                        <>Check your Top-Up history — the order may still be pending or already refunded.</>,
                        <>Check your statement for the descriptor <strong className="text-white">STREETFORGE*CREDITS</strong> or <strong className="text-white">STREETFORGE LTD</strong>.</>,
                        <>Ask anyone else with access to your card or devices whether they made the purchase.</>,
                        <>Email <A href="mailto:billing@streetforge.co.uk">billing@streetforge.co.uk</A> with the order reference — we reply within 2 business days.</>,
                    ]}
                />
            ),
        },
        {
            id: 'process',
            title: 'What happens when a chargeback is opened',
            content: (
                <Steps
                    steps={[
                        { tag: 'day 0', title: 'Notification', text: 'Our Payment Provider informs us that the payment has been disputed and the funds are debited from us.' },
                        { tag: 'day 0', title: 'Account hold', text: 'Purchasing is suspended and the Credits from the disputed payment are frozen. You can still log in.' },
                        { tag: 'day 1–7', title: 'Review', text: 'We review order logs, 3-D Secure results, IP/device data and gameplay to decide whether to accept or contest the dispute.' },
                        { tag: 'scheme timeline', title: 'Outcome', text: 'Your bank decides under card-scheme rules. This can take from 30 to 90 days.' },
                    ]}
                />
            ),
        },
        {
            id: 'outcomes',
            title: 'Outcomes',
            content: (
                <Table
                    head={['Result', 'What happens to your account']}
                    rows={[
                        ['Genuine fraud confirmed', 'Credits from the payment are removed; the account is secured and you can continue with a new payment method.'],
                        ['Dispute resolved in your favour (our error)', 'Credits are removed, the money stays with you and the account is restored in full.'],
                        ['Chargeback withdrawn by you', 'Hold lifted; the original purchase stands.'],
                        ['Dispute resolved in our favour', 'Hold lifted; Credits restored. Repeated unjustified disputes may lead to closure.'],
                        ['"Friendly fraud" — purchase made and used, then disputed', 'Credits recovered; account may be permanently closed under our Terms.'],
                    ]}
                />
            ),
        },
        {
            id: 'evidence',
            title: 'Evidence we may submit',
            content: (
                <>
                    <P>
                        To contest an unjustified dispute we may provide the card network with: order reference and timestamps, the 3-D Secure authentication
                        result, the IP address and device used, the account's registration details, login history around the purchase, and a record of how the
                        Credits were used. We never submit, and never hold, your full card number.
                    </P>
                    <Callout title="Unauthorised payments" tone="ember" icon={AlertTriangle}>
                        If someone used your card without permission, tell your bank and us at once. We will secure any affected account and cooperate fully
                        with the investigation.
                    </Callout>
                </>
            ),
        },
    ];

    return (
        <LegalShell
            href="/chargeback-policy"
            eyebrow="Card disputes"
            title="Chargeback"
            accent="Policy"
            lead="How card disputes on StreetForge purchases are handled, what happens to your account while a dispute is open, and why it is faster to talk to us first."
            version="1.0"
            sections={sections}
            related={['/refund-policy', '/billing-terms', '/payment-security', '/complaints']}
        />
    );
}
