import React from 'react';
import { Info, Clock } from 'lucide-react';
import LegalShell, { P, List, Callout, Table, Steps, A, Code } from '../../Components/Legal/LegalShell';

export default function Refunds() {
    const sections = [
        {
            id: 'scope',
            title: 'What this policy covers',
            content: (
                <>
                    <P>
                        This policy applies to every purchase of StreetForge Credits ("CR") made through the Top-Up section. Credits are digital content
                        supplied immediately after your payment is confirmed by our PCI DSS Level 1 Payment Provider. Spending Credits in the Showroom or Garage
                        is not a separate purchase for money and is covered by the <A href="/virtual-credits">Virtual Credits Policy</A>.
                    </P>
                    <Callout title="Your statutory rights" tone="neutral" icon={Info}>
                        Nothing in this policy affects your rights under the Consumer Rights Act 2015. If digital content is faulty, not as described or not
                        supplied, you are always entitled to a remedy.
                    </Callout>
                </>
            ),
        },
        {
            id: 'withdrawal',
            title: 'The 14-day cancellation right',
            content: (
                <>
                    <P>
                        For distance contracts, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 normally give you
                        14 days to change your mind. For digital content, that right ends once delivery begins, provided you have expressly asked for immediate
                        delivery and acknowledged that you will lose the right to cancel.
                    </P>
                    <P>
                        Before you are redirected to the payment page, our checkout asks you to confirm exactly that. Because Credits are added to your wallet
                        within seconds of payment confirmation, the 14-day cancellation right no longer applies once your Credits appear.
                    </P>
                    <P>
                        If you change your mind <strong className="text-white">before</strong> completing payment on the hosted page — for example you close the
                        page or press "cancel" — no payment is taken and the order simply expires.
                    </P>
                </>
            ),
        },
        {
            id: 'eligible',
            title: 'When we will refund',
            content: (
                <>
                    <Table
                        head={['Situation', 'Outcome', 'What we need']}
                        rows={[
                            ['Charged twice for one order (duplicate payment)', 'Full refund of the duplicate charge', 'Both order references or bank statement lines'],
                            ['Payment taken but Credits not delivered within 2 hours', 'Credits delivered, or full refund if we cannot deliver', 'Order reference'],
                            ['Wrong amount charged compared with the price shown', 'Refund of the difference', 'Order reference, screenshot if available'],
                            ['Credits or Virtual Items are faulty / do not work as described', 'Repair or replacement; refund if neither is possible', 'Description of the fault'],
                            ['Unauthorised use of your card on our site', 'Refund after investigation; account secured', 'Report to us and your bank'],
                            ['Account holder is under 18', 'Refund of purchases to the original card; account closed', 'Proof of age on request'],
                            ['We close the Service or your account without fault on your side', 'Refund of unused purchased Credits (see Terms)', '—'],
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'not-eligible',
            title: 'When refunds are not available',
            content: (
                <List
                    items={[
                        'You simply changed your mind after the Credits were delivered.',
                        'You spent the Credits on vehicles, upgrades or liveries and later regretted the choice.',
                        'Credits were earned through racing or rewards rather than bought.',
                        'Your account was suspended or terminated for cheating, fraud, sanctions circumvention or other breach of our Terms.',
                        'The request relates to a purchase made more than 14 days earlier, unless it concerns a fault or an unauthorised payment.',
                    ]}
                />
            ),
        },
        {
            id: 'how',
            title: 'How to request a refund',
            content: (
                <>
                    <Steps
                        steps={[
                            { title: 'Email billing', text: 'Write to billing@streetforge.co.uk from the email address registered to your account.' },
                            { title: 'Include references', text: <>Add your order reference (<Code>TOP-…</Code>) and receipt number (<Code>INV-…</Code>) from the Top-Up history.</> },
                            { title: 'Explain the issue', text: 'Tell us what happened and, for faults, what you expected. Screenshots help.' },
                            { title: 'We review', text: 'We acknowledge within 2 business days and give a decision within 5 business days.' },
                        ]}
                    />
                    <Callout title="Please don't send card details" tone="ember" icon={Clock}>
                        We never need your full card number or CVC to process a refund — refunds are matched to the original payment through our Payment Provider.
                    </Callout>
                </>
            ),
        },
        {
            id: 'payout',
            title: 'How refunds are paid',
            content: (
                <>
                    <P>
                        Approved refunds are always returned to the <strong className="text-white">original payment method</strong> through the same Payment
                        Provider that took the payment. We cannot refund to a different card, bank account, wallet or person. Refunds are issued in the currency of
                        the original charge (USD); any exchange-rate difference applied by your card issuer is outside our control.
                    </P>
                    <P>
                        We submit refunds within 2 business days of approval. Your bank normally shows the refund within 5–10 business days. When a refund is made,
                        the related Credits are removed from your wallet; if they have already been spent, the wallet may show a negative balance until it is
                        topped up or earned back.
                    </P>
                </>
            ),
        },
        {
            id: 'disputes',
            title: 'Chargebacks & escalation',
            content: (
                <P>
                    Please contact us before raising a dispute with your bank — it is quicker and keeps your account active. Opening a chargeback suspends
                    purchasing on the account until it is resolved; see the <A href="/chargeback-policy">Chargeback Policy</A>. If you are not satisfied with our
                    refund decision, you can use our <A href="/complaints">Complaints Procedure</A>.
                </P>
            ),
        },
    ];

    return (
        <LegalShell
            href="/refund-policy"
            eyebrow="Billing policy · Consumer rights"
            title="Refund &"
            accent="Cancellation"
            lead="When a Credit top-up can be refunded, how the statutory cancellation right applies to instant digital content, and how refunds reach your card."
            version="3.0"
            sections={sections}
            related={['/payment-security', '/billing-terms', '/chargeback-policy', '/complaints']}
        />
    );
}
