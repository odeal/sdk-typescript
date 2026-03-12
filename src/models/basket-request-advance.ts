
/**
 * 
 */
import { BasketType, withBasketTypeMetadata } from './basket-type';
import { ReceiptInfo, withReceiptInfoMetadata } from './receipt-info';
import { Customer, withCustomerMetadata } from './customer';
import { BasketPrice, withBasketPriceMetadata } from './basket-price';
import { PaymentOption, withPaymentOptionMetadata } from './payment-option';

export interface BasketRequestAdvance {
    /**  */
    referenceCode: string;
    /**  */
    externalDeviceKey?: string;
    /** Zorunlu olarak 'ADVANCE'. */
    basketType?: BasketType;
    /** Opsiyonel. Genelde gönderilmez. */
    receiptInfo?: ReceiptInfo;
    /**  */
    customer: Customer;
    /**  */
    price: BasketPrice;
    /** Zorunlu. */
    paymentOptions?: PaymentOption[];
}
export const BasketRequestAdvanceConfigMap: Record<string, string> = {
    'externalDeviceKey': 'externalDeviceKey',
};
export const BasketRequestAdvanceValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'referenceCode': {
        required: true,
        pattern: /^.{1,50}$/,
        message: 'Referans kodu 1-50 karakter arasında olmalıdır.',
    },
    'externalDeviceKey': {
        pattern: /^.{1,}$/,
        message: 'Cihaz kodu boş olamaz.',
    },
    'customer': {
        required: true,
        message: 'Customer formatı geçersiz.',
    },
    'price': {
        required: true,
        message: 'Price formatı geçersiz.',
    },
};

export function createBasketRequestAdvance(partial: Partial<BasketRequestAdvance> = {}): BasketRequestAdvance & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        referenceCode: partial.referenceCode,
        externalDeviceKey: partial.externalDeviceKey,
        basketType: partial.basketType,
        receiptInfo: partial.receiptInfo,
        customer: partial.customer,
        price: partial.price,
        paymentOptions: partial.paymentOptions ?? [],
    } as any;
    obj.__configMap = BasketRequestAdvanceConfigMap;
    obj.__validationRules = BasketRequestAdvanceValidationRules;
    
    return obj;
}

export function withBasketRequestAdvanceMetadata<T extends BasketRequestAdvance>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__configMap = BasketRequestAdvanceConfigMap;
    result.__validationRules = BasketRequestAdvanceValidationRules;
    if (result.basketType) {
        result.basketType = withBasketTypeMetadata(result.basketType);
    }
    if (result.receiptInfo) {
        result.receiptInfo = withReceiptInfoMetadata(result.receiptInfo);
    }
    if (result.customer) {
        result.customer = withCustomerMetadata(result.customer);
    }
    if (result.price) {
        result.price = withBasketPriceMetadata(result.price);
    }
    if (result.paymentOptions) {
        if (Array.isArray(result.paymentOptions)) {
            result.paymentOptions = result.paymentOptions.map((item: any) => withPaymentOptionMetadata(item));
        }
    }
    
    return result;
}
