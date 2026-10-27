import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let vite;
let SitePreferences;
before(async () => {
    vite = await createServer({
        configFile: false, plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom',
    });
    SitePreferences = (await vite.ssrLoadModule('/resources/js/Components/SitePreferences.jsx')).default;
});
after(async () => {
    delete globalThis.document;
    await vite?.close();
});

for (const [locale, name, code] of [['en', 'English', 'EN'], ['nb', 'Norsk', 'NO'], ['sv', 'Svenska', 'SV']]) {
    test(`language menu shows ${name}, marks current selection and submits CSRF-protected preferences`, async () => {
        globalThis.document = {
            documentElement: { lang: locale },
            querySelector: () => ({ content: 'test-csrf-token' }), addEventListener: () => {},
        };
        const { body } = await createInertiaApp({
            page: {
                component: 'SitePreferences', url: '/', version: null,
                props: { preferences: {
                    locale, currency: 'EUR', currencies: { EUR: { rate: 92 } },
                    locales: { en: 'English', nb: 'Norsk', sv: 'Svenska' },
                } },
            },
            resolve: () => SitePreferences, setup: ({ App, props }) => createElement(App, props), render: renderToString,
        });
        assert.ok(body.includes(`: ${name}"`), 'current language is part of the button accessible name');
        assert.ok(body.includes(`>${code}</span>`));
        assert.ok(body.includes('aria-haspopup="menu" aria-expanded="false"'));
        assert.ok(body.includes('inert="" aria-hidden="true"'), 'closed menu cannot receive focus');
        assert.equal((body.match(/aria-checked="true"/g) ?? []).length, 1);
        for (const value of ['en', 'nb', 'sv']) {
            assert.ok(body.includes(`name="locale" value="${value}"`));
        }
        assert.equal((body.match(/action="\/preferences"/g) ?? []).length, 3);
        assert.equal((body.match(/name="_token" value="test-csrf-token"/g) ?? []).length, 3);
        assert.ok(!body.includes('<select'), 'EUR-only header uses a custom language menu');
    });
}
