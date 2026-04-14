

/**
 * API hata yanit modeli.
 */
export interface ErrorResponse {
    /** Hata kodu. */
    error?: string;
    /** Hata aciklamasi. */
    message?: string;
    /** Detayli hata listesi. */
    details?: string[];
}

export function createErrorResponse(partial: Partial<ErrorResponse> = {}): ErrorResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        error: partial.error,
        message: partial.message,
        details: partial.details ?? [],
    } as any;
    
    return obj;
}

export function withErrorResponseMetadata<T extends ErrorResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
