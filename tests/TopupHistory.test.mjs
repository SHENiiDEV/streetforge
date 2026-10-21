import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let vite;
let Topup;

before(async () => {
    vite = await createServer({
        configFile: false,
        plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
        appType: 'custom',
    });
    Topup = (await vite.ssrLoadModule('/resources/js/Pages/Topup/Index.jsx')).default;
});

after(async () => {
    delete globalThis.document;
    await vite?.close();
});

for (const [status, invoicePath, canDownload] of [
    ['pending', null, false],
    ['pending', 'invoices/stale.pdf', false],
    ['failed', null, false],
    ['refunded', 'invoices/refunded.pdf', false],
    ['success', null, false],
    ['success', 'invoices/paid.pdf', true],
]) {
    test(`history ${status} with ${invoicePath ? 'a PDF' : 'no PDF'} ${canDownload ? 'shows' : 'hides'} invoice download`, async () => {
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
            packages: [{ id: 'racer_pack', fiat_amount: '23.00', game_credits: 2750, base_credits: 2500 }],
            customTopup: { min_credits: 100 },
            transactions: [{
                id: 1, invoice_number: 'INV-HISTORY', invoice_path: invoicePath,
                status, currency: 'EUR', fiat_amount: '23.00', game_credits: 2750,
                created_at: '2026-10-21T08:00:00Z', gateway: 'credit_card',
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
    });
}
