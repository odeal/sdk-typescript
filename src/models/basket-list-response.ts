
import { BasketListResult, withBasketListResultMetadata } from './basket-list-result';

/**
 * 
 */
export interface BasketListResponse {
    /** Sepet listeleme sonucu. */
    result?: BasketListResult;
}

export function createBasketListResponse(partial: Partial<BasketListResponse> = {}): BasketListResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        result: partial.result,
    } as any;
    
    return obj;
}

export function withBasketListResponseMetadata<T extends BasketListResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    if (result.result) {
        result.result = withBasketListResultMetadata(result.result);
    }
    
    return result;
}
