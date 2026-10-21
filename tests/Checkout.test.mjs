import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let vite;
let Checkout;

before(async () => {
    vite = await createServer({
        configFile: false,
        plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
        appType: 'custom',
    });
    Checkout = (await vite.ssrLoadModule('/resources/js/Pages/Topup/Checkout.jsx')).default;
});

after(async () => {
    delete globalThis.document;
    await vite?.close();
});

async function renderCheckout(language, overrides = {}) {
    globalThis.document = {
        documentElement: { lang: language },
        querySelector: () => null,
        addEventListener: () => {},
    };
    const props = {
        auth: { user: { name: 'Alex', game_balance: '500.00' } },
        preferences: {
            locale: language, currency: 'EUR',
            locales: { en: 'English', nb: 'Norsk', sv: 'Svenska' },
            currencies: { EUR: 'EUR' },
        },
        transaction: {
            transaction_ref: 'TOP-UI-CHECK', fiat_amount: '23.00', currency: 'EUR',
            game_credits: '2750.00', status: 'pending', invoice_number: 'INV-UI',
        },
        paymentAvailable: true,
        returned: false,
        ...overrides,
    };
    const { body } = await createInertiaApp({
        page: { component: 'Topup/Checkout', props, url: '/topup/checkout/TOP-UI-CHECK', version: null },
        resolve: () => Checkout,
        setup: ({ App, props }) => createElement(App, props),
        render: renderToString,
    });
    return body;
}

for (const [language, paymentLabel] of [
    ['en', 'Continue to secure payment'],
    ['nb', 'Fortsett til sikker betaling'],
    ['sv', 'Fortsätt till säker betalning'],
]) {
    test(`checkout in ${language} shows hosted payment without collecting card details`, async () => {
        const html = await renderCheckout(language);

        assert.ok(html.includes(paymentLabel));
        assert.ok(html.includes('EUR'));
        assert.ok(!html.includes('type="text"'));
        assert.ok(!html.includes('id="site-currency"'));
        assert.ok(!html.includes('<option value="USD"'));
        assert.ok(!html.includes('<option value="GBP"'));
        assert.ok(!html.includes('4242'));
        assert.ok(!html.includes('Trigger Async Webhook'));
    });
}

test('checkout disables payment when credentials are unavailable', async () => {
    const html = await renderCheckout('en', { paymentAvailable: false });

    assert.ok(html.includes('Card payments are temporarily unavailable.'));
    assert.ok(!html.includes('Continue to secure payment'));
});

test('return page waits for confirmation rather than declaring payment successful', async () => {
    const html = await renderCheckout('en', { returned: true });

    assert.ok(html.includes('Waiting for payment confirmation.'));
    assert.ok(!html.includes('Your credits have been added to your wallet.'));
});

for (const [status, message] of [
    ['success', 'Your credits have been added to your wallet.'],
    ['failed', 'This payment was declined, cancelled or expired.'],
    ['refunded', 'This payment has been refunded.'],
]) {
    test(`checkout shows the ${status} outcome without another payment button`, async () => {
        const html = await renderCheckout('en', {
            transaction: {
                transaction_ref: 'TOP-UI-CHECK', fiat_amount: '23.00', currency: 'EUR',
                game_credits: '2750.00', status, invoice_number: 'INV-UI',
                invoice_path: status === 'success' ? 'invoices/receipt.pdf' : null,
            },
        });

        assert.ok(html.includes(message));
        assert.ok(!html.includes('Continue to secure payment'));
        assert.equal(html.includes('/invoices/INV-UI/download'), status === 'success');
    });
}
