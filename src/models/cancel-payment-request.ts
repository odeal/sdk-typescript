

/**
 * Ödeme iptal isteği.
 */
export interface CancelPaymentRequest {
    /** İptal edilecek sepetin referans kodu */
    basketReferenceCode: string;
}
export const CancelPaymentRequestValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'basketReferenceCode': {
        required: true,
        pattern: /^.{1,50}$/,
        message: 'Referans kodu 1-50 karakter arasında olmalıdır.',
    },
};

export function createCancelPaymentRequest(partial: Partial<CancelPaymentRequest> = {}): CancelPaymentRequest & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        basketReferenceCode: partial.basketReferenceCode,
    } as any;
    obj.__validationRules = CancelPaymentRequestValidationRules;
    
    return obj;
}

export function withCancelPaymentRequestMetadata<T extends CancelPaymentRequest>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = CancelPaymentRequestValidationRules;
    
    return result;
}
