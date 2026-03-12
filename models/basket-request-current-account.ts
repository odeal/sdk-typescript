
/**
 * 
 */
import { BasketType, withBasketTypeMetadata } from './basket-type';
import { ReceiptInfo, withReceiptInfoMetadata } from './receipt-info';
import { Customer, withCustomerMetadata } from './customer';
import { BasketPrice, withBasketPriceMetadata } from './basket-price';
import { PaymentOption, withPaymentOptionMetadata } from './payment-option';

export interface BasketRequestCurrentAccount {
    /**  */
    referenceCode: string;
    /**  */
    externalDeviceKey?: string;
    /** Zorunlu olarak 'CURRENT_ACCOUNT'. */
    basketType?: BasketType;
    /** Zorunlu. 'receiptNumber' ve 'receiptDate' doldurulması önerilir. */
    receiptInfo: ReceiptInfo;
    /** Müşteri Kurumsal olmalıdır. */
    customer: Customer;
    /**  */
    price: BasketPrice;
    /** Zorunlu. */
    paymentOptions?: PaymentOption[];
}
export const BasketRequestCurrentAccountConfigMap: Record<string, string> = {
    'externalDeviceKey': 'externalDeviceKey',
};
export const BasketRequestCurrentAccountValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'referenceCode': {
        required: true,
        pattern: /^.{1,50}$/,
        message: 'Referans kodu 1-50 karakter arasında olmalıdır.',
    },
    'externalDeviceKey': {
        pattern: /^.{1,}$/,
        message: 'Cihaz kodu boş olamaz.',
    },
    'receiptInfo': {
        required: true,
        message: 'ReceiptInfo formatı geçersiz.',
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

export function createBasketRequestCurrentAccount(partial: Partial<BasketRequestCurrentAccount> = {}): BasketRequestCurrentAccount & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        referenceCode: partial.referenceCode,
        externalDeviceKey: partial.externalDeviceKey,
        basketType: partial.basketType,
        receiptInfo: partial.receiptInfo,
        customer: partial.customer,
        price: partial.price,
        paymentOptions: partial.paymentOptions ?? [],
    } as any;
    obj.__configMap = BasketRequestCurrentAccountConfigMap;
    obj.__validationRules = BasketRequestCurrentAccountValidationRules;
    
    return obj;
}

export function withBasketRequestCurrentAccountMetadata<T extends BasketRequestCurrentAccount>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__configMap = BasketRequestCurrentAccountConfigMap;
    result.__validationRules = BasketRequestCurrentAccountValidationRules;
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
