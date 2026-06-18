

/**
 * Ödeme iptal yanıtı.
 */
export interface CancelPaymentResponse {
    /**  */
    result?: any;
}

export function createCancelPaymentResponse(partial: Partial<CancelPaymentResponse> = {}): CancelPaymentResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        result: partial.result,
    } as any;
    
    return obj;
}

export function withCancelPaymentResponseMetadata<T extends CancelPaymentResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
