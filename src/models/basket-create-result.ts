

/**
 * Oluşturulan sepetin sonucu.
 */
export interface BasketCreateResult {
    /** Oluşturulan sepetin kimliği. */
    id?: number;
}

export function createBasketCreateResult(partial: Partial<BasketCreateResult> = {}): BasketCreateResult & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        id: partial.id,
    } as any;
    
    return obj;
}

export function withBasketCreateResultMetadata<T extends BasketCreateResult>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
