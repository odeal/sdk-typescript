
import { BasketCreateResult, withBasketCreateResultMetadata } from './basket-create-result';

/**
 * 
 */
export interface BasketResponse {
    /** Oluşturulan sepetin sonucu. */
    result?: BasketCreateResult;
}

export function createBasketResponse(partial: Partial<BasketResponse> = {}): BasketResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        result: partial.result,
    } as any;
    
    return obj;
}

export function withBasketResponseMetadata<T extends BasketResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    if (result.result) {
        result.result = withBasketCreateResultMetadata(result.result);
    }
    
    return result;
}
