import { t } from '../../localization';
import React from 'react';
import LegalShell, { P, List, Steps, Table, KV, A, useCompany } from '../../Components/Legal/LegalShell';

export default function Complaints() {
    const c = useCompany();
    const sections = [
        {
            id: 'commitment',
            title: 'Our commitment',
            content: (
                <P>{t("We want every driver to feel treated fairly. If something has gone wrong — with a payment, a ban, your data or the game itself — tell us. This procedure explains how to complain, how quickly we respond and what you can do if you are still unhappy. Complaining never affects how your account is treated. ")}</P>
            ),
        },
        {
            id: 'how',
            title: 'How to complain',
            content: (
                <>
                    <KV
                        rows={[
                            ['Email', <A href="mailto:complaints@streetforge.co.uk">{t("complaints@streetforge.co.uk")}</A>],
                            ['Post', t('Complaints Team, :name, :address', { name: c.name, address: c.address })],
                            ['Include', 'Username, registered email, what happened, when, any order reference, and what outcome you want'],
                        ]}
                    />
                    <P muted>{t("You can ask someone to complain on your behalf; we will need your written authority before discussing your account with them.")}</P>
                </>
            ),
        },
        {
            id: 'stages',
            title: 'What happens next',
            content: (
                <Steps
                    steps={[
                        { tag: '2 business days', title: 'Acknowledgement', text: 'We confirm receipt and give you a case number and the name of the person handling it.' },
                        { tag: 'within 14 days', title: 'Investigation', text: 'We review logs, transactions and correspondence, and may ask you for more information.' },
                        { tag: 'within 14 days', title: 'Final response', text: 'We explain our findings, what we will do to put things right and how to escalate if you disagree.' },
                        { tag: 'within 10 days', title: 'Senior review', text: 'If you are not satisfied, a manager not involved in the original decision reviews the case.' },
                    ]}
                />
            ),
        },
        {
            id: 'types',
            title: 'Specialist routes',
            content: (
                <Table
                    head={['Topic', 'Start here']}
                    rows={[
                        ['Payments, refunds, missing Credits', <A href="mailto:billing@streetforge.co.uk">{t("billing@streetforge.co.uk")}</A>],
                        ['Bans and enforcement', <><A href="mailto:fairplay@streetforge.co.uk">{t("fairplay@streetforge.co.uk")}</A>{t(" (appeal)")}</>],
                        ['Personal data', <A href="mailto:dpo@streetforge.co.uk">{t("dpo@streetforge.co.uk")}</A>],
                        ['Security issue', <A href="mailto:security@streetforge.co.uk">{t("security@streetforge.co.uk")}</A>],
                        ['Anything else', <A href="mailto:complaints@streetforge.co.uk">{t("complaints@streetforge.co.uk")}</A>],
                    ]}
                />
            ),
        },
        {
            id: 'escalation',
            title: 'If you are still unhappy',
            content: (
                <List
                    items={[
                        <>{t("For data protection complaints, you can contact the Information Commissioner's Office at ")}<A href="https://ico.org.uk">{t("ico.org.uk")}</A>.</>,
                        <>{t("For consumer issues, Citizens Advice (")}<A href="https://www.citizensadvice.org.uk">{t("citizensadvice.org.uk")}</A>{t(") can advise you on your rights.")}</>,
                        'For a disputed card payment, you may also contact your card issuer — see our Chargeback Policy first.',
                        'You may refer the matter to an alternative dispute resolution provider or to the courts of England and Wales.',
                    ]}
                />
            ),
        },
    ];

    return (
        <LegalShell
            href="/complaints"
            eyebrow="Customer care"
            title={t("Complaints")}
            accent="Procedure"
            lead="How to raise a complaint with StreetForge, how fast we respond, and where to go if you are not satisfied with our answer."
            version="1.0"
            sections={sections}
            related={['/contact', '/refund-policy', '/chargeback-policy', '/fair-play']}
        />
    );
}
