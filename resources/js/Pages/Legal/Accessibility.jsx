import React from 'react';
import LegalShell, { P, List, KV, A } from '../../Components/Legal/LegalShell';

export default function Accessibility() {
    const sections = [
        {
            id: 'commitment',
            title: 'Our commitment',
            content: (
                <P>
                    We want StreetForge to be usable by as many people as possible. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level
                    AA for all website pages, account areas and policy documents, and to make the game itself as accessible as a real-time racing experience
                    allows.
                </P>
            ),
        },
        {
            id: 'features',
            title: 'What you can do',
            content: (
                <List
                    items={[
                        'Zoom pages up to 200% without content being cut off.',
                        'Navigate the website, garage and shop with a keyboard.',
                        'Use screen readers on policy pages, account settings and the Top-Up flow; all pages use semantic headings and landmarks.',
                        'Rely on text labels as well as colour for statuses such as order state and difficulty.',
                        'Use your operating system\'s reduced-motion setting to reduce background animation.',
                    ]}
                />
            ),
        },
        {
            id: 'limitations',
            title: 'Known limitations',
            content: (
                <>
                    <List
                        items={[
                            'The race itself is a real-time canvas game and is not usable with a screen reader.',
                            'Some decorative gauges and charts in the garage have limited text alternatives.',
                            'Some colour combinations on dark backgrounds are below 4.5:1 contrast for small labels; we are fixing these.',
                        ]}
                    />
                    <P muted>
                        The hosted payment page is provided by our Payment Provider, which maintains its own accessibility standards.
                    </P>
                </>
            ),
        },
        {
            id: 'feedback',
            title: 'Feedback & help',
            content: (
                <KV
                    rows={[
                        ['Email', <A href="mailto:accessibility@streetforge.co.uk">accessibility@streetforge.co.uk</A>],
                        ['Response time', 'Within 5 business days'],
                        ['Alternative formats', 'Any policy document on request as plain text or large print'],
                    ]}
                />
            ),
        },
    ];

    return (
        <LegalShell
            href="/accessibility"
            eyebrow="WCAG 2.2 AA"
            title="Accessibility"
            accent="Statement"
            lead="How accessible StreetForge is, what we know still needs work, and how to tell us about a barrier."
            sections={sections}
            related={['/contact', '/complaints', '/privacy', '/security']}
        />
    );
}
