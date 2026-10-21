import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let vite;
let Profile;
before(async () => {
    vite = await createServer({
        configFile: false, plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom',
    });
    Profile = (await vite.ssrLoadModule('/resources/js/Pages/Profile/Edit.jsx')).default;
});
after(async () => {
    delete globalThis.document;
    await vite?.close();
});

async function renderProfile(language, overrides = {}) {
    globalThis.document = {
        documentElement: { lang: language }, querySelector: () => null, addEventListener: () => {},
    };
    const profile = {
        name: 'Alex', surname: 'Rider', email: 'alex@example.com', phone: '+4712345678',
        street: 'Storgata 12', city: 'Oslo', country: 'Norway', post_code: '0155', ...overrides,
    };
    return (await createInertiaApp({
        page: {
            component: 'Profile/Edit', url: '/profile', version: null,
            props: {
                profile, countries: ['Norway', 'Sweden'], updateUrl: '/profile',
                auth: { user: { ...profile, game_balance: 100 } },
                preferences: {
                    locale: language, currency: 'EUR',
                    locales: { en: 'English', nb: 'Norsk', sv: 'Svenska' }, currencies: { EUR: { rate: 92 } },
                },
            },
        },
        resolve: () => Profile, setup: ({ App, props }) => createElement(App, props), render: renderToString,
    })).body;
}

for (const [language, title, billing, save] of [
    ['en', 'My profile', 'Billing address', 'Save changes'],
    ['nb', 'Min profil', 'Fakturaadresse', 'Lagre endringer'],
    ['sv', 'Min profil', 'Faktureringsadress', 'Spara ändringar'],
]) {
    test(`profile renders contact and billing fields in ${language}`, async () => {
        const html = await renderProfile(language);
        for (const text of [title, billing, save, 'value="Alex"', 'value="Storgata 12"', 'value="Norway" selected=""']) {
            assert.ok(html.includes(text), text);
        }
        assert.ok(html.includes('href="/profile"'), 'mobile navigation links to profile');
        assert.ok(!html.includes('name="current_password"'), 'password is only requested when email changes');
        assert.ok(!html.includes('name="game_balance"'));
    });
}

test('profile escapes stored personal and billing details', async () => {
    const html = await renderProfile('en', {
        name: '<script>alert(1)</script>', surname: '<img src=x onerror=alert(2)>',
        phone: '"><script>phone</script>', street: '<script>street</script>',
        city: '<script>city</script>', post_code: '<script>postcode</script>',
    });
    for (const value of ['alert(1)', 'street', 'city', 'postcode']) {
        assert.ok(html.includes(`&lt;script&gt;${value}`));
        assert.ok(!html.includes(`<script>${value}`));
    }
    assert.ok(!html.includes('<img src=x'));
    assert.ok(!html.includes('<script>phone'));
});
