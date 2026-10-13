import React from 'react';
import { Info } from 'lucide-react';
import LegalShell, { P, List, Callout, Table, A } from '../../Components/Legal/LegalShell';

export default function VirtualCredits() {
    const sections = [
        {
            id: 'nature',
            title: 'What Credits are',
            content: (
                <>
                    <P>
                        StreetForge Credits ("CR") are an in-game virtual currency. They let you unlock vehicles in the Showroom, install performance upgrades in
                        the Garage and apply liveries. Legally, Credits are a limited, revocable licence to use a feature of the game — they are not money,
                        e-money, a deposit, a voucher, a security or personal property.
                    </P>
                    <Callout title="No cash value" tone="cyan" icon={Info}>
                        Credits can never be exchanged for money, withdrawn, sold, gifted or transferred to another player, and nothing you obtain with Credits
                        has a real-world monetary value. StreetForge is a skill-based game, not a gambling service.
                    </Callout>
                </>
            ),
        },
        {
            id: 'earning',
            title: 'How you get Credits',
            content: (
                <Table
                    head={['Source', 'Description']}
                    rows={[
                        ['Starter balance', 'New accounts receive a welcome balance so you can start tuning immediately.'],
                        ['Race rewards', 'Paid out after each race according to finishing position and track difficulty.'],
                        ['Season & event rewards', 'Awarded for leaderboard placings and limited-time events.'],
                        ['Top-Up purchase', 'Bought for real money via our PCI DSS Level 1 Payment Provider — see Payment Security.'],
                        ['Compensation', 'Occasionally granted by us after outages or balance changes.'],
                    ]}
                />
            ),
        },
        {
            id: 'using',
            title: 'Spending Credits',
            content: (
                <List
                    items={[
                        'Prices in Credits are shown before you confirm a purchase in the Showroom or Garage.',
                        'Purchases with Credits are final once confirmed — please check vehicle class and compatibility first.',
                        'Owned vehicles, upgrades and liveries stay on your account and cannot be sold back for Credits unless the game offers that feature.',
                        'We may rebalance item performance or prices to keep racing fair; this does not entitle you to a refund, but we will compensate where a change substantially removes something you bought.',
                    ]}
                />
            ),
        },
        {
            id: 'expiry',
            title: 'Expiry & dormant accounts',
            content: (
                <P>
                    Purchased Credits do not expire while your account is active. Promotional or event Credits may carry an expiry date, which is always shown
                    when they are granted. If an account is closed as dormant after 24 months of inactivity (with 30 days' email warning), remaining Credits are
                    cancelled. If you contact us within 12 months of closure we will reinstate the account and its purchased Credits.
                </P>
            ),
        },
        {
            id: 'errors',
            title: 'Errors & corrections',
            content: (
                <P>
                    If Credits or items are added to your account by mistake — for example through a bug, a duplicated reward or a payment that is later
                    reversed — we may correct the balance. Deliberately exploiting such errors is a breach of the{' '}
                    <A href="/fair-play">Fair Play Policy</A>.
                </P>
            ),
        },
        {
            id: 'rmt',
            title: 'Real-money trading is prohibited',
            content: (
                <P>
                    Buying, selling or trading accounts, Credits or Virtual Items outside the Service — including on third-party marketplaces, social media or
                    forums — is prohibited. It exposes players to scams and is a common route for fraud. Accounts involved may be closed without refund.
                </P>
            ),
        },
        {
            id: 'closure',
            title: 'If the Service closes',
            content: (
                <P>
                    If we ever discontinue StreetForge, we will give at least 60 days' notice, stop selling Credits immediately and refund unused Credits bought
                    in the 90 days before the announcement to the original payment method, as set out in our <A href="/terms">Terms of Service</A>.
                </P>
            ),
        },
    ];

    return (
        <LegalShell
            href="/virtual-credits"
            eyebrow="In-game currency"
            title="Virtual Credits"
            accent="Policy"
            lead="How StreetForge Credits are earned, bought, spent and protected — and why they have no cash value."
            version="1.0"
            sections={sections}
            related={['/terms', '/billing-terms', '/refund-policy', '/fair-play']}
        />
    );
}
