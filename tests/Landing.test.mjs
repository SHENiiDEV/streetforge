import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let vite;
let Landing;

before(async () => {
    vite = await createServer({
        configFile: false,
        plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false, watch: null },
        appType: 'custom',
    });
    Landing = (await vite.ssrLoadModule('/resources/js/Pages/Landing.jsx')).default;
});

after(async () => {
    delete globalThis.document;
    await vite?.close();
});

for (const [language, expectedDifficulty, expectedBenefit] of [
    ['en', 'Medium', 'No credit card'],
    ['nb', 'Middels', 'Ingen kredittkort'],
    ['sv', 'Medel', 'Inget kreditkort'],
]) {
    for (const withTracks of [false, true]) {
        test(`landing renders circuits and benefits in ${language} with ${withTracks ? 'provided' : 'fallback'} tracks`, async () => {
            globalThis.document = {
                documentElement: { lang: language },
                querySelector: () => null,
                addEventListener: () => {},
            };
            const props = {
                auth: { user: null },
                preferences: {
                    locale: language,
                    currency: 'USD',
                    locales: { en: 'English', nb: 'Norsk', sv: 'Svenska' },
                    currencies: { USD: 'USD' },
                },
                tracks: withTracks ? [{
                    id: 7, name: 'Regression Circuit', theme: 'cyber_city',
                    difficulty: 'Medium', laps: 2, length_meters: 2800,
                    reward_currency_1st: 550, description: 'Test circuit description.',
                }] : [],
            };

            const { body } = await createInertiaApp({
                page: { component: 'Landing', props, url: '/', version: null },
                resolve: () => Landing,
                setup: ({ App, props }) => createElement(App, props),
                render: renderToString,
            });

            assert.ok(body.includes(withTracks ? 'Regression Circuit' : 'Neon City Grand Prix'));
            assert.ok(body.includes(expectedDifficulty));
            assert.ok(body.includes(expectedBenefit));
        });
    }
}
