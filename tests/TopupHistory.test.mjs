import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let vite;
let Topup;
let convertUsdCents;

before(async () => {
    vite = await createServer({
        configFile: false,
        plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
        appType: 'custom',
    });
    Topup = (await vite.ssrLoadModule('/resources/js/Pages/Topup/Index.jsx')).default;
    convertUsdCents = (await vite.ssrLoadModule('/resources/js/localization.js')).convertUsdCents;
});

after(async () => {
    delete globalThis.document;
    await vite?.close();
});

for (const [status, invoicePath, canDownload, gateway = 'credit_card'] of [
    ['pending', null, false],
    ['pending', 'invoices/stale.pdf', false],
    ['failed', null, false],
    ['refunded', 'invoices/refunded.pdf', false],
    ['success', null, true],
    ['success', 'invoices/paid.pdf', true],
    ['success', 'invoices/google.pdf', true, 'google_pay'],
]) {
    test(`history ${gateway} ${status} with ${invoicePath ? 'a PDF' : 'no PDF'} ${canDownload ? 'shows' : 'hides'} invoice download`, async () => {
        globalThis.document = {
            documentElement: { lang: 'en' },
            querySelector: () => null,
            addEventListener: () => {},
        };
        const props = {
            auth: { user: { name: 'Alex', game_balance: '500.00' } },
            company: { name: 'StreetForge', number: '123' },
            preferences: {
                locale: 'en', currency: 'EUR',
                locales: { en: 'English', nb: 'Norsk', sv: 'Svenska' },
                currencies: { EUR: { rate: 92 } },
            },
            packages: [{ id: 'racer_pack', fiat_amount: '27.60', game_credits: 2750, base_credits: 2500 }],
            customTopup: { min_credits: 951, minimum_amount: '10.50', price_percent: 120 },
            transactions: [{
                id: 1, invoice_number: 'INV-HISTORY', invoice_path: invoicePath,
                status, currency: 'EUR', fiat_amount: '23.00', game_credits: 2750,
                created_at: '2026-10-21T08:00:00Z', gateway,
            }],
        };

        const { body } = await createInertiaApp({
            page: { component: 'Topup/Index', props, url: '/topup', version: null },
            resolve: () => Topup,
            setup: ({ App, props }) => createElement(App, props),
            render: renderToString,
        });

        assert.equal(body.includes('href="/invoices/INV-HISTORY/download"'), canDownload);
        assert.ok(body.includes('INV-HISTORY'));
        assert.ok(body.includes('value="951"'));
        assert.match(body, /Minimum purchase: EUR\s10\.50/);
        const inputs = body.match(/<input[^>]*>/g) ?? [];
        assert.ok(inputs.some(input => input.includes('name="gateway"') && input.includes('value="credit_card"') && input.includes('checked=""')));
        assert.ok(inputs.some(input => input.includes('name="gateway"') && input.includes('value="google_pay"') && !input.includes('checked=""')));
        if (gateway === 'google_pay') assert.match(body, /<td[^>]*>\s*Google Pay\s*<\/td>/);
    });
}

for (const [credits, expected] of [[950, 10.49], [951, 10.50], [952, 10.51], [1000, 11.04], [1234, 13.62], [10000, 110.40], [10001, 110.41], [1000000, 11040]]) {
    test(`custom price preview for ${credits} CR matches the server amount`, () => {
        assert.equal(convertUsdCents(credits, 92, 120), expected);
    });
}
