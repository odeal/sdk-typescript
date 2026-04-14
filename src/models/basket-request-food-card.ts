
import { ReceiptInfo, withReceiptInfoMetadata } from './receipt-info';
import { Customer, withCustomerMetadata } from './customer';
import { BasketPrice, withBasketPriceMetadata } from './basket-price';
import { Item, withItemMetadata } from './item';
import { BasketType } from '../enums/basket-type';

/**
 * 
 */
export interface BasketRequestFoodCard {
    /**  */
    referenceCode: string;
    /**  */
    externalDeviceKey?: string;
    /** Default: SIMPLE */
    basketType?: BasketType;
    /** Zorunlu. FoodCardBrandId içermelidir. */
    receiptInfo: ReceiptInfo;
    /**  */
    customer: Customer;
    /**  */
    price: BasketPrice;
    /** Zorunlu. */
    items?: Item[];
    /**  */
    paymentOptions?: any[];
}
export const BasketRequestFoodCardConfigMap: Record<string, string> = {
    'externalDeviceKey': 'externalDeviceKey',
};
export const BasketRequestFoodCardValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
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

export function createBasketRequestFoodCard(partial: Partial<BasketRequestFoodCard> = {}): BasketRequestFoodCard & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
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
    obj.__configMap = BasketRequestFoodCardConfigMap;
    obj.__validationRules = BasketRequestFoodCardValidationRules;
    
    return obj;
}

export function withBasketRequestFoodCardMetadata<T extends BasketRequestFoodCard>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__configMap = BasketRequestFoodCardConfigMap;
    result.__validationRules = BasketRequestFoodCardValidationRules;
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
    
    return result;
}
