/**
 * Odeal SDK Sanitizer
 * Hassas verileri maskeleyen yardımcı fonksiyonlar.
 */

const SENSITIVE_FIELDS = [
    'password', 'cvv', 'cvc', 'cardNumber', 'card_number', 'pan',
    'expiryDate', 'expiry_date', 'securityCode', 'security_code',
    'secretKey', 'secret_key', 'token', 'accessToken', 'access_token',
    'refreshToken', 'refresh_token', 'authorization',
];

const SENSITIVE_HEADER_KEYWORDS = ['secret', 'key', 'authorization', 'token'];

/**
 * JSON string içindeki hassas alanları maskeler.
 */
export function sanitizeJson(json?: string | null): string | undefined | null {
    if (!json) return json;
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
