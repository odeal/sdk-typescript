

/**
 * Ödeme iptal sonucu.
 */
export interface CancelPaymentResult {
    /**  */
    basketReferenceCode?: string;
    /**  */
    message?: string;
}

export function createCancelPaymentResult(partial: Partial<CancelPaymentResult> = {}): CancelPaymentResult & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        basketReferenceCode: partial.basketReferenceCode,
        message: partial.message,
    } as any;
    
    return obj;
}

export function withCancelPaymentResultMetadata<T extends CancelPaymentResult>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
