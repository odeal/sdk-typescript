
import { ReceiptInfo, withReceiptInfoMetadata } from './receipt-info';
import { Customer, withCustomerMetadata } from './customer';
import { BasketPrice, withBasketPriceMetadata } from './basket-price';
import { Item, withItemMetadata } from './item';
import { PaymentOption, withPaymentOptionMetadata } from './payment-option';
import { BasketType } from '../enums/basket-type';

/**
 * 
 */
export interface BasketRequest {
    /**  */
    referenceCode: string;
    /**  */
    externalDeviceKey?: string;
    /** Default: SIMPLE */
    basketType?: BasketType;
    /** Opsiyonel. */
    receiptInfo?: ReceiptInfo;
    /**  */
    customer: Customer;
    /**  */
    price: BasketPrice;
    /** Zorunlu. */
    items?: Item[];
    /** Zorunlu. Ödeme yöntemleri. */
    paymentOptions?: PaymentOption[];
}
export const BasketRequestConfigMap: Record<string, string> = {
    'externalDeviceKey': 'externalDeviceKey',
};
export const BasketRequestValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
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

export function createBasketRequest(partial: Partial<BasketRequest> = {}): BasketRequest & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        referenceCode: partial.referenceCode,
        externalDeviceKey: partial.externalDeviceKey,
        basketType: partial.basketType,
        receiptInfo: partial.receiptInfo,
        customer: partial.customer,
        price: partial.price,
        items: partial.items ?? [],
        paymentOptions: partial.paymentOptions ?? [],
    } as any;
    obj.__configMap = BasketRequestConfigMap;
    obj.__validationRules = BasketRequestValidationRules;
    
    return obj;
}

export function withBasketRequestMetadata<T extends BasketRequest>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__configMap = BasketRequestConfigMap;
    result.__validationRules = BasketRequestValidationRules;
    if (result.receiptInfo) {
        result.receiptInfo = withReceiptInfoMetadata(result.receiptInfo);
    }
    if (result.customer) {
        result.customer = withCustomerMetadata(result.customer);
    }
    if (result.price) {
        result.price = withBasketPriceMetadata(result.price);
    }
    if (result.items) {
        if (Array.isArray(result.items)) {
            result.items = result.items.map((item: any) => withItemMetadata(item));
        }
    }
    if (result.paymentOptions) {
        if (Array.isArray(result.paymentOptions)) {
            result.paymentOptions = result.paymentOptions.map((item: any) => withPaymentOptionMetadata(item));
        }
    }
    
    return result;
}
