/**
 * Odeal SDK Exception Modülü
 * 
 * @remarks
 * Bu modül, SDK tarafından fırlatılan tüm exception sınıflarını içerir.
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await client.createBasket(request);
 * } catch (error) {
 *   if (error instanceof OdealRateLimitException) {
 *     console.error(`Rate limit! ${error.retryAfterSeconds}s bekleyin.`);
 *   } else if (error instanceof OdealAuthenticationException) {
 *     console.error('Geçersiz API anahtarı!');
 *   } else if (error instanceof OdealApiException) {
 *     console.error('API Hatası:', error.statusCode, error.message);
 *   } else if (error instanceof OdealValidationException) {
 *     console.error('Validation Hatası:', error.errors);
 *   }
 * }
 * ```
 */

// ─── Base Exception ──────────────────────────────────────────

/**
 * Odeal SDK'dan fırlatılan tüm exception'ların temel sınıfı.
 */
export class OdealException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OdealException';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// ─── API Exceptions ──────────────────────────────────────────

/**
 * API çağrılarında oluşan hataları temsil eden exception sınıfı.
 */
export class OdealApiException extends OdealException {
    /** HTTP durum kodu. */
    readonly statusCode: number;
    /** API'den dönen ham yanıt içeriği. */
    readonly responseBody?: string;
    /** API'den dönen JSON parse edilmiş yanıt (varsa). */
    readonly responseData?: unknown;

    constructor(message: string, statusCode: number, responseBody?: string) {
        super(message);
        this.name = 'OdealApiException';
        this.statusCode = statusCode;
        this.responseBody = responseBody;
        if (responseBody) {
            try { this.responseData = JSON.parse(responseBody); } catch { /* JSON değilse ignore */ }
        }
    }

    toString(): string {
        return `OdealApiException: [${this.statusCode}] ${this.message}`;
    }

    toJSON(): Record<string, unknown> {
        return { name: this.name, message: this.message, statusCode: this.statusCode, responseBody: this.responseBody, responseData: this.responseData };
    }
}

/**
 * Kimlik doğrulama hatası (HTTP 401 Unauthorized).
 */
export class OdealAuthenticationException extends OdealApiException {
    constructor(message: string = 'Authentication failed. Please check your API keys.', responseBody?: string) {
        super(message, 401, responseBody);
        this.name = 'OdealAuthenticationException';
    }
}

/**
 * Yetkilendirme hatası (HTTP 403 Forbidden).
 */
export class OdealForbiddenException extends OdealApiException {
    constructor(message: string = 'Access denied. You do not have permission for this operation.', responseBody?: string) {
        super(message, 403, responseBody);
        this.name = 'OdealForbiddenException';
    }
}

/**
 * Kaynak bulunamadı hatası (HTTP 404 Not Found).
 */
export class OdealNotFoundException extends OdealApiException {
    constructor(message: string = 'The requested resource was not found.', responseBody?: string) {
        super(message, 404, responseBody);
        this.name = 'OdealNotFoundException';
    }
}

/**
 * İstek limiti aşıldı hatası (HTTP 429 Too Many Requests).
 */
export class OdealRateLimitException extends OdealApiException {
    /** Tekrar deneme süresi (saniye). */
    readonly retryAfterSeconds?: number;

    constructor(message: string = 'Rate limit exceeded. Please retry later.', responseBody?: string, retryAfterSeconds?: number) {
        super(message, 429, responseBody);
        this.name = 'OdealRateLimitException';
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

// ─── Validation Exception ────────────────────────────────────

/**
 * Client-side validation hatalarını temsil eden exception sınıfı.
 */
export class OdealValidationException extends OdealException {
    /** Validation hatalarının listesi. */
    readonly errors: string[];
    /** Alan bazlı hata detayları. */
    readonly fieldErrors: Record<string, string>;

    constructor(message: string, errors: string[] = [], fieldErrors: Record<string, string> = {}) {
        super(message);
        this.name = 'OdealValidationException';
        this.errors = errors;
        this.fieldErrors = fieldErrors;
    }

    toString(): string {
        return this.errors.length > 0
            ? `OdealValidationException: ${this.errors.join('; ')}`
            : `OdealValidationException: ${this.message}`;
    }

    toJSON(): Record<string, unknown> {
        return { name: this.name, message: this.message, errors: this.errors, fieldErrors: this.fieldErrors };
    }
}

// ─── Network Exceptions ──────────────────────────────────────

/**
 * Ağ bağlantı hatası (DNS, bağlantı reddedildi vb.).
 */
export class OdealNetworkException extends OdealException {
    constructor(message: string) {
        super(message);
        this.name = 'OdealNetworkException';
    }
}

/**
 * İstek zaman aşımı hatası.
 */
export class OdealTimeoutException extends OdealNetworkException {
    constructor(message: string = 'The request timed out.') {
        super(message);
        this.name = 'OdealTimeoutException';
    }
}