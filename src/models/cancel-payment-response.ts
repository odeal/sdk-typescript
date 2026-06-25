
import { CancelPaymentResult, withCancelPaymentResultMetadata } from './cancel-payment-result';

/**
 * Ödeme iptal yanıtı.
 */
export interface CancelPaymentResponse {
    /** Ödeme iptal sonucu. */
    result?: CancelPaymentResult;
}

export function createCancelPaymentResponse(partial: Partial<CancelPaymentResponse> = {}): CancelPaymentResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        result: partial.result,
    } as any;
    
    return obj;
}

export function withCancelPaymentResponseMetadata<T extends CancelPaymentResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    if (result.result) {
        result.result = withCancelPaymentResultMetadata(result.result);
    }
    
    return result;
}
