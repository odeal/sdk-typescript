

/**
 * 
 */
export interface BasketPrice {
    /** Sepetin iskontosuz, KDV dahil toplamı. */
    grossPrice: number;
    /** Satırlarda iskonto varsa gönderilmelidir: satır iskontolarının (items[].allowances[].price) KDV dahil toplamı. Kuruşu kuruşuna eşit olmalıdır (2081). */
    totalAllowance?: number;
    /** İskontolu sepette zorunlu (2091). Tahsil edilecek tutar: grossPrice − totalAllowance. Ödeal'in hesabıyla en çok 1 kuruş fark kabul edilir (2092); ödeme seçeneklerinin toplamı da bu tutara eşit olmalıdır. */
    paidAmount?: number;
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
        totalAllowance: partial.totalAllowance,
        paidAmount: partial.paidAmount,
    } as any;
    obj.__validationRules = BasketPriceValidationRules;
    
    return obj;
}

export function withBasketPriceMetadata<T extends BasketPrice>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = BasketPriceValidationRules;
    
    return result;
}
