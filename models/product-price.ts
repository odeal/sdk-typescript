
/**
 * 
 */

export interface ProductPrice {
    /**  */
    grossPrice: number;
    /**  */
    vatRatio?: number;
    /**  */
    sctRatio?: number;
}
export const ProductPriceValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'grossPrice': {
        required: true,
        message: 'GrossPrice formatı geçersiz.',
    },
};

export function createProductPrice(partial: Partial<ProductPrice> = {}): ProductPrice & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        grossPrice: partial.grossPrice,
        vatRatio: partial.vatRatio,
        sctRatio: partial.sctRatio,
    } as any;
    obj.__validationRules = ProductPriceValidationRules;
    
    return obj;
}

export function withProductPriceMetadata<T extends ProductPrice>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = ProductPriceValidationRules;
    
    return result;
}
