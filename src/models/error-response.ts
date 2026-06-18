

/**
 * API iş kuralı hata yanıt modeli (BUSINESS hataları).
 */
export interface ErrorResponse {
    /** İş kuralı hata kodu (ör. 2029). */
    code?: number;
    /** Hata tipi (ör. BUSINESS, VALIDATION). */
    exceptionType?: string;
    /** Teknik hata açıklaması. */
    message?: string;
    /** Son kullanıcıya gösterilebilecek mesaj. */
    userMessage?: string;
}

export function createErrorResponse(partial: Partial<ErrorResponse> = {}): ErrorResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        code: partial.code,
        exceptionType: partial.exceptionType,
        message: partial.message,
        userMessage: partial.userMessage,
    } as any;
    
    return obj;
}

export function withErrorResponseMetadata<T extends ErrorResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
