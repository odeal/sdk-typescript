/**
 * Odeal SDK Sanitizer
 * Hassas verileri maskeleyen yardımcı fonksiyonlar.
 */

const SENSITIVE_FIELDS = [
    'password', 'cvv', 'cvc', 'cardNumber', 'card_number', 'pan',
    'expiryDate', 'expiry_date', 'securityCode', 'security_code',
    'secretKey', 'secret_key', 'token', 'accessToken', 'access_token',
    'refreshToken', 'refresh_token', 'authorization',
    'tckn', 'tcKimlikNo', 'tcKimlik', 'identityNumber', 'nationalId',
    'iban', 'phone', 'phoneNumber', 'telephone', 'gsm',
    'email', 'eMail', 'mail', 'address', 'adres',
];

const SENSITIVE_HEADER_KEYWORDS = ['secret', 'key', 'authorization', 'token', 'cookie', 'session'];

const SENSITIVE_FIELD_SET = new Set(SENSITIVE_FIELDS.map(f => f.toLowerCase()));

/**
 * JSON string içindeki hassas alanları maskeler.
 *
 * JSON ağacı parse edilerek iç içe nesneler, diziler ve string olmayan değerler
 * (sayı, boolean) dahil tüm hassas alanlar maskelenir. Geçerli JSON değilse regex
 * tabanlı güvenli yedeğe (fallback) düşülür.
 */
export function sanitizeJson(json?: string | null): string | undefined | null {
    if (!json) return json;
    try {
        return JSON.stringify(maskValue(JSON.parse(json)));
    } catch {
        return sanitizeJsonRegex(json);
    }
}

/**
 * JSON değerini recursive olarak gezerek hassas alanları maskeler.
 */
function maskValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(maskValue);
    }
    if (value !== null && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            out[k] = SENSITIVE_FIELD_SET.has(k.toLowerCase()) ? '***' : maskValue(v);
        }
        return out;
    }
    return value;
}

/**
 * Parse edilemeyen içerik için regex tabanlı yedek maskeleme.
 */
function sanitizeJsonRegex(json: string): string {
    let result = json;
    for (const field of SENSITIVE_FIELDS) {
        const pattern = new RegExp(`("${escapeRegex(field)}"\\s*:\\s*")[^"]*"`, 'gi');
        result = result.replace(pattern, '$1***"');
    }
    return result;
}

/**
 * Header record'undaki hassas değerleri maskeler.
 */
export function sanitizeHeaders(headers?: Record<string, string>): Record<string, string> {
    if (!headers) return {};
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
        const lower = key.toLowerCase();
        const isSensitive = SENSITIVE_HEADER_KEYWORDS.some(kw => lower.includes(kw));
        sanitized[key] = isSensitive ? '***' : value;
    }
    return sanitized;
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
