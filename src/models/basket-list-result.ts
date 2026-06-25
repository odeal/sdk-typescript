
import { BasketSummary, withBasketSummaryMetadata } from './basket-summary';

/**
 * Sepet listeleme sonucu.
 */
export interface BasketListResult {
    /**  */
    baskets?: BasketSummary[];
    /**  */
    totalPages?: number;
    /**  */
    totalElements?: number;
}

export function createBasketListResult(partial: Partial<BasketListResult> = {}): BasketListResult & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        baskets: partial.baskets ?? [],
        totalPages: partial.totalPages,
        totalElements: partial.totalElements,
    } as any;
    
    return obj;
}

export function withBasketListResultMetadata<T extends BasketListResult>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    if (result.baskets) {
        if (Array.isArray(result.baskets)) {
            result.baskets = result.baskets.map((item: any) => withBasketSummaryMetadata(item));
        }
    }
    
    return result;
}
