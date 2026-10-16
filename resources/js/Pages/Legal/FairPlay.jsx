import { t } from '../../localization';
import React from 'react';
import { Cpu, Bug, Users, ShieldAlert } from 'lucide-react';
import LegalShell, { P, List, Cards, Table, A } from '../../Components/Legal/LegalShell';

export default function FairPlay() {
    const sections = [
        {
            id: 'principles',
            title: 'Our principles',
            content: (
                <>
                    <P>{t("Every lap time on a StreetForge leaderboard should be the result of driving skill and tuning knowledge — nothing else. This policy explains what counts as cheating or abuse, how we detect it and what happens when someone breaks the rules. It forms part of our")}{t(' ')}
                        <A href="/terms">{t("Terms of Service")}</A>.
                    </P>
                    <Cards
                        items={[
                            { icon: Cpu, title: 'Verified telemetry', text: 'Race submissions are checked server-side for physically impossible speeds, sector times and input patterns.' },
                            { icon: Users, title: 'Respect', text: 'Racing is competitive, but harassment and hate have no place in the paddock.', tone: 'text-orange-300' },
                            { icon: Bug, title: 'Report, don\'t exploit', text: 'If you find a bug that gives an advantage, report it and you may be rewarded.', tone: 'text-emerald-400' },
                        ]}
                    />
                </>
            ),
        },
        {
            id: 'cheating',
            title: 'Prohibited: cheating',
            content: (
                <List
                    items={[
                        'Speed hacks, memory editing, modified game clients or browser extensions that change physics, timing or inputs.',
                        'Bots, macros, auto-steer or any automation that drives for you.',
                        'Intercepting, forging or replaying network requests, including race-result submissions.',
                        'Deliberately exploiting physics glitches, wall clipping, track-limit or checkpoint errors.',
                        'Boosting: colluding with other accounts, or using multiple accounts, to inflate rank or rewards.',
                    ]}
                />
            ),
        },
        {
            id: 'conduct',
            title: 'Prohibited: abusive conduct',
            content: (
                <List
                    items={[
                        'Harassment, threats, stalking, or encouraging others to target a player.',
                        'Hate speech or discrimination based on any protected characteristic.',
                        'Offensive, sexual or impersonating usernames, team names or liveries.',
                        'Impersonating StreetForge staff, or phishing for passwords, card details or one-time codes.',
                        'Spam, advertising, or promoting third-party sellers of accounts or Credits.',
                    ]}
                />
            ),
        },
        {
            id: 'platform',
            title: 'Prohibited: platform abuse',
            content: (
                <List
                    items={[
                        'Scraping, load-testing, fuzzing or attempting to access systems or accounts you are not authorised to use (see Security for authorised research).',
                        'Payment fraud, unauthorised card use or chargeback abuse.',
                        'Circumventing sanctions, age or regional restrictions, including via VPNs or false information.',
                        'Selling, buying or sharing accounts, Credits or Virtual Items.',
                    ]}
                />
            ),
        },
        {
            id: 'enforcement',
            title: 'Enforcement ladder',
            content: (
                <>
                    <P>{t("Sanctions depend on severity, intent and history. Serious cases can skip directly to a permanent ban.")}</P>
                    <Table
                        head={['Level', 'Measure', 'Typical cause']}
                        rows={[
                            ['1', 'Warning & result removal', 'First minor exploit or inappropriate name'],
                            ['2', 'Leaderboard reset for the season', 'Repeated exploits, boosting'],
                            ['3', 'Temporary suspension (7–30 days)', 'Harassment, confirmed minor cheating'],
                            ['4', 'Permanent ban, Credits forfeited', 'Cheat software, fraud, sanctions circumvention, severe abuse'],
                        ]}
                    />
                    <P>{t("Automated detection only flags accounts. A member of staff reviews the evidence before any suspension or ban, and you will be told which rule was broken. ")}</P>
                </>
            ),
        },
        {
            id: 'appeals',
            title: 'Appeals',
            content: (
                <P>{t("You can appeal any enforcement decision within 30 days by emailing ")}<A href="mailto:fairplay@streetforge.co.uk">{t("fairplay@streetforge.co.uk")}</A>{t(' ')}{t("with your username and why you think the decision is wrong. A different staff member reviews the appeal and replies within 10 business days. ")}</P>
            ),
        },
        {
            id: 'report',
            title: 'Reporting cheaters & bugs',
            content: (
                <P>{t("Report suspected cheating or abuse to ")}<A href="mailto:fairplay@streetforge.co.uk">{t("fairplay@streetforge.co.uk")}</A>{t(" with the username, track and approximate time. Report exploitable bugs privately to the same address — publicly sharing an exploit before it is fixed is itself a breach. Valid reports of advantage-giving bugs may receive a Credits reward. ")}</P>
            ),
        },
    ];

    return (
        <LegalShell
            href="/fair-play"
            eyebrow="Anti-cheat · Code of conduct"
            title={t("Fair Play &")}
            accent="Acceptable Use"
            lead="The rules that keep StreetForge leaderboards clean and the paddock respectful, how we enforce them, and how to appeal."
            version="1.0"
            sections={sections}
            related={['/terms', '/responsible-play', '/complaints', '/security']}
        />
    );
}
