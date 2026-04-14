
import { ValidationError, withValidationErrorMetadata } from './validation-error';

/**
 * Hata detaylari.
 */
export interface ApiError {
    /** HTTP status kodu. */
    code?: number;
    /** Kullaniciya gosterilebilecek hata mesaji. */
    message?: string;
    /** Opsiyonel teknik detay. */
    details?: string;
    /** Hatanin olustu zaman. */
    timestamp?: string;
    /** Hatanin olustugu endpoint. */
    path?: string;
    /** Validasyon hatalari (400 icin). */
    validationErrors?: ValidationError[];
}

export function createApiError(partial: Partial<ApiError> = {}): ApiError & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        code: partial.code,
        message: partial.message,
        details: partial.details,
        timestamp: partial.timestamp,
        path: partial.path,
        validationErrors: partial.validationErrors ?? [],
    } as any;
    
    return obj;
}

export function withApiErrorMetadata<T extends ApiError>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    if (result.validationErrors) {
        if (Array.isArray(result.validationErrors)) {
            result.validationErrors = result.validationErrors.map((item: any) => withValidationErrorMetadata(item));
        }
    }
    
    return result;
}
