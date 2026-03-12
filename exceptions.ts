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
 *   if (error instanceof OdealApiException) {
 *     console.error('API Hatası:', error.statusCode, error.message);
 *   } else if (error instanceof OdealValidationException) {
 *     console.error('Validation Hatası:', error.errors);
 *   }
 * }
 * ```
 */

/**
 * API çağrılarında oluşan hataları temsil eden exception sınıfı.
 * 
 * @remarks
 * Bu exception, API'den dönen HTTP hata kodları ve yanıt içerikleri
 * hakkında detaylı bilgi sağlar.
 */
export class OdealApiException extends Error {
    /**
     * HTTP durum kodu.
     * @remarks Yaygın değerler: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
     */
    readonly statusCode: number;

    /**
     * API'den dönen ham yanıt içeriği.
     */
    readonly responseBody?: string;

    /**
     * API'den dönen JSON parse edilmiş yanıt (varsa).
     */
    readonly responseData?: unknown;

    /**
     * OdealApiException sınıfının yeni bir örneğini oluşturur.
     * 
     * @param message - Hata mesajı
     * @param statusCode - HTTP durum kodu
     * @param responseBody - API yanıt içeriği (opsiyonel)
     */
    constructor(message: string, statusCode: number, responseBody?: string) {
        super(message);
        this.name = 'OdealApiException';
        this.statusCode = statusCode;
        this.responseBody = responseBody;

        // JSON parse etmeye çalış
        if (responseBody) {
            try {
                this.responseData = JSON.parse(responseBody);
            } catch {
                // JSON değilse ignore et
            }
        }

        // Error stack trace düzeltmesi
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OdealApiException);
        }
    }

    /**
     * Hatanın okunabilir string temsilini döner.
     */
    toString(): string {
        return `OdealApiException: [${this.statusCode}] ${this.message}`;
    }

    /**
     * Hatanın JSON temsilini döner.
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            responseBody: this.responseBody,
            responseData: this.responseData,
        };
    }
}

/**
 * Client-side validation hatalarını temsil eden exception sınıfı.
 * 
 * @remarks
 * Bu exception, API'ye istek gönderilmeden önce model üzerinde
 * yapılan validation başarısız olduğunda fırlatılır.
 */
export class OdealValidationException extends Error {
    /**
     * Validation hatalarının listesi.
     */
    readonly errors: string[];

    /**
     * Alan bazlı hata detayları.
     */
    readonly fieldErrors: Record<string, string>;

    /**
     * OdealValidationException sınıfının yeni bir örneğini oluşturur.
     * 
     * @param message - Hata mesajı
     * @param errors - Validation hatalarının listesi
     * @param fieldErrors - Alan bazlı hata detayları (opsiyonel)
     */
    constructor(
        message: string,
        errors: string[] = [],
        fieldErrors: Record<string, string> = {}
    ) {
        super(message);
        this.name = 'OdealValidationException';
        this.errors = errors;
        this.fieldErrors = fieldErrors;

        // Error stack trace düzeltmesi
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OdealValidationException);
        }
    }

    /**
     * Hatanın okunabilir string temsilini döner.
     */
    toString(): string {
        if (this.errors.length > 0) {
            return `OdealValidationException: ${this.errors.join('; ')}`;
        }
        return `OdealValidationException: ${this.message}`;
    }

    /**
     * Hatanın JSON temsilini döner.
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            errors: this.errors,
            fieldErrors: this.fieldErrors,
        };
    }
}