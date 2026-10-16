import React from 'react';
import { Lock } from 'lucide-react';
import LegalShell, { P, List, Callout, KV, Table, A, Code, useCompany } from '../../Components/Legal/LegalShell';

export default function BillingTerms() {
    const c = useCompany();

    const sections = [
        {
            id: 'seller',
            title: 'Who sells to you',
            content: (
                <>
                    <P>
                        All Credit packages are sold by {c.name}, Company No. {c.number}, {c.address}. Our Payment Provider, a PCI DSS Level 1 certified payment
                        service provider, collects the payment on our behalf on its hosted payment page and settles the funds to us. The Payment Provider is not
                        the seller and does not supply the Credits.
                    </P>
                    <KV
                        rows={[
                            ['Merchant of record', c.name],
                            ['Statement descriptor', <><Code>STREETFORGE*CREDITS</Code> or <Code>STREETFORGE LTD</Code></>],
                            ['Billing contact', <A href="mailto:billing@streetforge.co.uk">billing@streetforge.co.uk</A>],
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'pricing',
            title: 'Packages, prices & currency',
            content: (
                <>
                    <P>
                        Credit packages, their price, the number of Credits and any bonus percentage are displayed in the Top-Up section before you confirm an
                        order. Prices are in your selected currency (USD, EUR or GBP) at fixed exchange rates and include any taxes we are required to charge. If your card is denominated in another currency,
                        your card issuer will convert the amount using its own rate and may add a foreign-transaction fee.
                    </P>
                    <List
                        items={[
                            'The price shown when you confirm an order is the price you pay, even if we later change it.',
                            'Bonus Credits in promotional packages are part of the package and are refunded or reversed together with it.',
                            'If we discover a clear pricing error before your payment is confirmed, we will cancel the order and tell you.',
                            'We do not add any surcharge for paying by card.',
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'process',
            title: 'Order & payment process',
            content: (
                <>
                    <P>
                        Clicking to buy a package creates a pending order with a unique reference beginning <Code>TOP-</Code>. You are then redirected to the
                        hosted payment page of our Payment Provider to enter your card details and, where required, complete 3-D Secure with your bank.
                    </P>
                    <P>
                        The contract for the Credits is formed when the Payment Provider confirms a successful payment to our servers via a signed notification.
                        Pending orders that are not paid within 30 minutes expire automatically and no money is taken.
                    </P>
                    <Callout title="Card data stays with the provider" tone="mint" icon={Lock}>
                        StreetForge never receives your full card number or security code. Read the full explanation on our{' '}
                        <A href="/payment-security">Payment Security</A> page.
                    </Callout>
                </>
            ),
        },
        {
            id: 'status',
            title: 'Order statuses',
            content: (
                <Table
                    head={['Status', 'Meaning', 'Credits']}
                    rows={[
                        ['Pending', 'Order created; you have not completed payment on the hosted page yet', 'Not added'],
                        ['Completed', 'Payment confirmed by the Payment Provider and verified by us', 'Added to wallet'],
                        ['Failed', 'Payment declined by your bank or by fraud screening', 'Not added'],
                        ['Expired', 'Pending order not paid within 30 minutes', 'Not added'],
                        ['Refunded', 'Payment returned to your card', 'Removed from wallet'],
                        ['Disputed', 'A chargeback has been opened with your bank', 'Frozen'],
                    ]}
                />
            ),
        },
        {
            id: 'receipts',
            title: 'Receipts & records',
            content: (
                <P>
                    For every completed order we issue a receipt showing the receipt number (<Code>INV-YYYY-…</Code>), order reference, date and time, package,
                    amount and currency, and the seller's details. Receipts are available in your Top-Up history and are emailed to your registered address. If
                    you need a receipt re-issued with corrected billing details, contact the billing team within 30 days of purchase.
                </P>
            ),
        },
        {
            id: 'failed',
            title: 'Declined & failed payments',
            content: (
                <>
                    <P>A payment may be declined for reasons such as:</P>
                    <List
                        items={[
                            'insufficient funds or a card limit reached;',
                            '3-D Secure authentication failed, timed out or was cancelled;',
                            'the card was issued in a restricted jurisdiction or the billing country does not match your account;',
                            'the Payment Provider\'s fraud screening flagged the transaction;',
                            'your account has reached its daily or monthly top-up limit.',
                        ]}
                    />
                    <P>
                        For security reasons neither we nor the Payment Provider are told the exact reason for a bank decline. If you are sure the card should
                        work, contact your card issuer first. A temporary authorisation hold from a failed attempt is released by your bank, usually within a few
                        days.
                    </P>
                </>
            ),
        },
        {
            id: 'limits',
            title: 'Spending limits',
            content: (
                <P>
                    To protect players and prevent fraud, each account has default daily and monthly top-up limits. You can lower your limits at any time with
                    immediate effect; increases take effect after a 72-hour cooling-off period. See <A href="/responsible-play">Responsible Play</A> for other
                    spending controls.
                </P>
            ),
        },
        {
            id: 'errors',
            title: 'Billing errors & disputes',
            content: (
                <P>
                    If you think you have been charged incorrectly, contact <A href="mailto:billing@streetforge.co.uk">billing@streetforge.co.uk</A> with the
                    order reference. Refund rules are in the <A href="/refund-policy">Refund & Cancellation Policy</A>; disputes raised with your bank are
                    handled under the <A href="/chargeback-policy">Chargeback Policy</A>.
                </P>
            ),
        },
    ];

    return (
        <LegalShell
            href="/billing-terms"
            eyebrow="Purchases · Receipts · Limits"
            title="Billing"
            accent="Terms"
            lead="Everything about paying for StreetForge Credits: who the seller is, how prices work, what each order status means, receipts and what to do when a payment fails."
            version="1.0"
            sections={sections}
            related={['/payment-security', '/refund-policy', '/chargeback-policy', '/virtual-credits']}
        />
    );
}
