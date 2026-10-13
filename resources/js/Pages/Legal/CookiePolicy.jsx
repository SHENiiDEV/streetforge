import React from 'react';
import LegalShell, { P, List, Table, A, Code } from '../../Components/Legal/LegalShell';

export default function CookiePolicy() {
    const sections = [
        {
            id: 'what',
            title: 'What cookies are',
            content: (
                <>
                    <P>
                        Cookies are small text files placed on your device when you visit a website. Similar technologies include local storage, session storage
                        and pixels. Together we call them "cookies" in this policy. They let a site remember that you are logged in, keep forms secure and
                        remember your preferences between visits.
                    </P>
                    <P>
                        Under the Privacy and Electronic Communications Regulations 2003 (PECR) we may set cookies that are strictly necessary for the service you
                        request without consent. All other cookies require your consent, which you can give or refuse in the cookie banner and change at any time.
                    </P>
                </>
            ),
        },
        {
            id: 'necessary',
            title: 'Strictly necessary cookies',
            content: (
                <>
                    <P>These are always active. The game cannot log you in, protect forms or remember your session without them.</P>
                    <Table
                        head={['Name', 'Purpose', 'Duration']}
                        rows={[
                            [<Code>streetforge-session</Code>, 'Keeps you logged in and links requests to your session', '2 hours (rolling)'],
                            [<Code>XSRF-TOKEN</Code>, 'Protects forms and actions against cross-site request forgery', '2 hours'],
                            [<Code>remember_web_*</Code>, 'Keeps you signed in if you tick "remember me"', 'Up to 400 days'],
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'functional',
            title: 'Functional preferences',
            content: (
                <P>
                    StreetForge currently does not use separate preference cookies. Your active vehicle, liveries and garage set-up are stored server-side
                    against your account, so they follow you to any device you log in from. If we introduce optional preference storage in future (for
                    example audio or graphics settings kept in your browser), we will list it here before it goes live.
                </P>
            ),
        },
        {
            id: 'analytics',
            title: 'Analytics cookies (optional)',
            content: (
                <P>
                    StreetForge does not currently set analytics, advertising or cross-site tracking cookies. If we decide to measure usage in future — for
                    example which pages are used or how the game performs on different devices — we will only do so with privacy-friendly, aggregated tools,
                    only after you give consent in a cookie banner, and we will update this policy first. Analytics would never be used for advertising.
                </P>
            ),
        },
        {
            id: 'payment',
            title: 'Cookies on the payment page',
            content: (
                <P>
                    When you are redirected to pay, the hosted payment page belongs to our PCI DSS Level 1 Payment Provider, not StreetForge. That provider and
                    your card issuer (during 3-D Secure) may set their own cookies for security and fraud prevention. Those cookies are governed by their own
                    policies. See <A href="/payment-security">Payment Security</A> for how the redirect works.
                </P>
            ),
        },
        {
            id: 'control',
            title: 'Managing your choices',
            content: (
                <>
                    <List
                        items={[
                            'If we ask for consent to optional cookies, you can withdraw it at any time and the cookies will no longer be set.',
                            'Most browsers let you block or delete cookies in their settings — search your browser\'s help for "cookies".',
                            'Blocking strictly necessary cookies will stop you logging in to the Garage, Shop and Race Lobby.',
                            'Logging out ends your session; deleting cookies also signs you out of "remember me" on that device.',
                        ]}
                    />
                    <P muted>
                        Questions? Email <A href="mailto:privacy@streetforge.co.uk">privacy@streetforge.co.uk</A>. For how we use personal data more generally,
                        read the <A href="/privacy">Privacy Policy</A>.
                    </P>
                </>
            ),
        },
    ];

    return (
        <LegalShell
            href="/cookie-policy"
            eyebrow="PECR · Tracking disclosure"
            title="Cookie"
            accent="Policy"
            lead="Which cookies and similar technologies StreetForge uses, why, for how long, and how you can control them."
            version="2.0"
            sections={sections}
            related={['/privacy', '/payment-security', '/security', '/terms']}
        />
    );
}
