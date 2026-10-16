import { t } from '../../localization';
import React from 'react';
import { Heart, Timer, Wallet, PauseCircle } from 'lucide-react';
import LegalShell, { P, List, Cards, KV, Callout, A } from '../../Components/Legal/LegalShell';

export default function ResponsiblePlay() {
    const sections = [
        {
            id: 'age',
            title: '18+ only',
            content: (
                <>
                    <P>{t("StreetForge is designed for adults. You must be 18 or over (or the age of majority where you live, if higher) to register or make a purchase. Your date of birth is collected at registration, and we may ask for proof of age at any time — especially before allowing Top-Ups or after a report. ")}</P>
                    <P>{t("If we discover that an account belongs to someone under 18, we close it, delete associated personal data and refund any purchases to the original payment method. Parents and guardians who believe a child has used StreetForge can contact")}{t(' ')}
                        <A href="mailto:support@streetforge.co.uk">{t("support@streetforge.co.uk")}</A>.
                    </P>
                </>
            ),
        },
        {
            id: 'not-gambling',
            title: 'Skill, not chance',
            content: (
                <P>{t("StreetForge contains no paid random rewards, no loot boxes and no prizes with real-world value. Credits cannot be cashed out. Results depend on your driving and tuning. Even so, any game that involves spending money can sometimes be played more than intended, so we provide the tools below. ")}</P>
            ),
        },
        {
            id: 'tools',
            title: 'Tools to stay in control',
            content: (
                <Cards
                    cols={2}
                    items={[
                        { icon: Wallet, title: 'Spending limits', text: 'Set your own daily or monthly Top-Up limit. Decreases apply immediately; increases after 72 hours.' },
                        { icon: Timer, title: 'Session reminders', text: 'Get a reminder after a chosen amount of play time.', tone: 'text-orange-300' },
                        { icon: PauseCircle, title: 'Take a break', text: 'Lock your account for 24 hours, 7 days or 30 days. It cannot be undone early.', tone: 'text-emerald-400' },
                        { icon: Heart, title: 'Self-exclusion', text: 'Close your account for 6 months or permanently and block new purchases.', tone: 'text-red-300' },
                    ]}
                />
            ),
        },
        {
            id: 'signs',
            title: 'Signs to watch for',
            content: (
                <List
                    items={[
                        'Spending more on Top-Ups than you planned, or more than you can comfortably afford.',
                        'Playing to escape problems, or feeling irritable when you cannot play.',
                        'Missing sleep, work, study or time with family because of the game.',
                        'Hiding how much time or money you spend.',
                    ]}
                />
            ),
        },
        {
            id: 'help',
            title: 'Where to get help',
            content: (
                <>
                    <P>{t("If gaming or spending is affecting your wellbeing, free, confidential support is available:")}</P>
                    <KV
                        rows={[
                            ['NHS (UK)', <A href="https://www.nhs.uk/every-mind-matters/">{t("nhs.uk/every-mind-matters")}</A>],
                            ['Mind (UK)', <A href="https://www.mind.org.uk">{t("mind.org.uk")}</A>],
                            ['Samaritans (UK & IE)', '116 123 — free, 24/7'],
                            ['StreetForge support', <A href="mailto:support@streetforge.co.uk">{t("support@streetforge.co.uk")}</A>],
                        ]}
                    />
                    <Callout title={t("Need us to step in?")} tone="cyan" icon={Heart}>{t("Email support with the subject \"Responsible play\" and we will apply a limit or break to your account for you, no questions asked. ")}</Callout>
                </>
            ),
        },
    ];

    return (
        <LegalShell
            href="/responsible-play"
            eyebrow="Player wellbeing"
            title={t("Responsible Play")}
            accent="& 18+"
            lead="Our age requirement, the controls you can use to manage time and spending, and where to find support."
            version="1.0"
            sections={sections}
            related={['/fair-play', '/billing-terms', '/virtual-credits', '/complaints']}
        />
    );
}
