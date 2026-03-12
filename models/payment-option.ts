
/**
 * 
 */
import { PaymentOptionType, withPaymentOptionTypeMetadata } from './payment-option-type';

export interface PaymentOption {
    /**  */
    amount: number;
    /**  */
    type: PaymentOptionType;
}
export const PaymentOptionValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'amount': {
        required: true,
        message: 'Amount formatı geçersiz.',
    },
    'type': {
        required: true,
        message: 'Type formatı geçersiz.',
    },
};

export function createPaymentOption(partial: Partial<PaymentOption> = {}): PaymentOption & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        amount: partial.amount,
        type: partial.type,
    } as any;
    obj.__validationRules = PaymentOptionValidationRules;
    
    return obj;
}

export function withPaymentOptionMetadata<T extends PaymentOption>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = PaymentOptionValidationRules;
    if (result.type) {
        result.type = withPaymentOptionTypeMetadata(result.type);
    }
    
    return result;
}
