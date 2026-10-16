import nb from '../lang/nb.json';
import sv from '../lang/sv.json';

const catalogs = { nb, sv };
export function locale() {
    return typeof document === 'undefined' ? 'en' : document.documentElement.lang;
}

export function t(value, parameters = {}, language = locale()) {
    if (Array.isArray(value)) return value.map(item => t(item, parameters, language));
    if (typeof value !== 'string') return value;
    const key = value.replace(/\s+/g, ' ').trim();
    const translated = catalogs[language]?.[key];
    let result = translated ? value.replace(value.trim(), translated) : value;
    for (const [name, replacement] of Object.entries(parameters)) {
        result = result.replaceAll(`:${name}`, String(replacement));
    }
    return result;
}

export function formatMoney(amount, currency = 'USD', language = locale()) {
    return new Intl.NumberFormat(language === 'en' ? 'en-GB' : language, {
        style: 'currency', currency, currencyDisplay: 'code',
    }).format(Number(amount));
}

export function convertUsdCents(cents, rate) {
    return Math.floor((Number(cents) * rate + 50) / 100) / 100;
}
