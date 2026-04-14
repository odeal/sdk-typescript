

/**
 * Tek bir alan icin validasyon hatasi.
 */
export interface ValidationError {
    /** Hatali alanin adi. */
    field?: string;
    /** Validasyon hata mesaji. */
    message?: string;
    /** Reddedilen deger. */
    rejectedValue?: string;
}

export function createValidationError(partial: Partial<ValidationError> = {}): ValidationError & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        field: partial.field,
        message: partial.message,
        rejectedValue: partial.rejectedValue,
    } as any;
    
    return obj;
}

export function withValidationErrorMetadata<T extends ValidationError>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
