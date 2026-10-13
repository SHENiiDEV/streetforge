import React from 'react';
import LegalShell, { P, List, KV, A, useCompany } from '../../Components/Legal/LegalShell';

export default function IntellectualProperty() {
    const c = useCompany();
    const sections = [
        {
            id: 'ownership',
            title: 'Ownership',
            content: (
                <P>
                    StreetForge — including its source code, physics and rendering engine, track designs, vehicle models, liveries, sound design, user interface,
                    text, graphics, the StreetForge name and logo — is owned by {c.name} or used under licence. These works are protected by the Copyright, Designs
                    and Patents Act 1988, trade mark law and international treaties.
                </P>
            ),
        },
        {
            id: 'vehicles',
            title: 'Vehicles & brands',
            content: (
                <P>
                    All vehicles, teams and sponsors in StreetForge are fictional designs. Any resemblance to real cars, manufacturers or brands is
                    coincidental, and StreetForge is not affiliated with, sponsored or endorsed by any vehicle manufacturer. Card network logos shown on the site
                    belong to their owners and are displayed only to indicate accepted payment methods.
                </P>
            ),
        },
        {
            id: 'licence',
            title: 'What you may do',
            content: (
                <>
                    <List
                        items={[
                            'Play the game for your own private entertainment.',
                            'Share screenshots and videos of your own gameplay, including on monetised streaming channels, provided you credit StreetForge and do not imply endorsement.',
                            'Link to any public page of the website.',
                        ]}
                    />
                    <P>You may not copy, modify, decompile, redistribute or create derivative products from the game or its assets.</P>
                </>
            ),
        },
        {
            id: 'takedown',
            title: 'Reporting infringement',
            content: (
                <>
                    <P>
                        If you believe content on StreetForge — including a username or livery created by a player — infringes your copyright or trade mark,
                        send a notice including:
                    </P>
                    <List
                        ordered
                        items={[
                            'your name and contact details;',
                            'identification of the work or mark you own;',
                            'the location of the infringing content (URL, username or screenshot);',
                            'a statement that you believe in good faith the use is not authorised;',
                            'a statement that the information is accurate and that you are the owner or authorised to act for the owner.',
                        ]}
                    />
                    <KV rows={[['Send to', <A href="mailto:legal@streetforge.co.uk">legal@streetforge.co.uk</A>], ['Post', `Legal Department, ${c.name}, ${c.address}`]]} />
                </>
            ),
        },
    ];

    return (
        <LegalShell
            href="/intellectual-property"
            eyebrow="Copyright · Trade marks"
            title="Intellectual"
            accent="Property"
            lead="Who owns StreetForge and its content, what you are allowed to do with it, and how to report infringement."
            sections={sections}
            related={['/terms', '/fair-play', '/contact', '/privacy']}
        />
    );
}
