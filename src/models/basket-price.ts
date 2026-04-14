

/**
 * 
 */
export interface BasketPrice {
    /**  */
    grossPrice: number;
}
export const BasketPriceValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'grossPrice': {
        required: true,
        message: 'GrossPrice formatı geçersiz.',
    },
};

export function createBasketPrice(partial: Partial<BasketPrice> = {}): BasketPrice & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        grossPrice: partial.grossPrice,
    } as any;
    obj.__validationRules = BasketPriceValidationRules;
    
    return obj;
}

export function withBasketPriceMetadata<T extends BasketPrice>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = BasketPriceValidationRules;
    
    return result;
}
