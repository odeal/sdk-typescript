/**
 * 
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * 
 * @remarks Bu enum string değerler içerir.
 */
export enum PaymentOptionType {
    /**
     * CASH - API değeri: CASH
     */
    CASH = 'CASH',
    /**
     * CREDITCARD - API değeri: CREDITCARD
     */
    CREDITCARD = 'CREDITCARD',
    /**
     * GIFT - API değeri: GIFT
     */
    GIFT = 'GIFT',
    /**
     * OPENACCOUNT - API değeri: OPEN_ACCOUNT
     */
    OPENACCOUNT = 'OPEN_ACCOUNT',
    /**
     * FOODCARD - API değeri: FOOD_CARD
     */
    FOODCARD = 'FOOD_CARD',
}

/**
 * PaymentOptionType enum değerlerinin API karşılıkları.
 */
export const PaymentOptionTypeValues = {
    CASH: 'CASH',
    CREDITCARD: 'CREDITCARD',
    GIFT: 'GIFT',
    OPENACCOUNT: 'OPEN_ACCOUNT',
    FOODCARD: 'FOOD_CARD',
} as const;

/**
 * Verilen değerin PaymentOptionType enum'una ait olup olmadığını kontrol eder.
 */
export function isPaymentOptionType(value: unknown): value is PaymentOptionType {
    return Object.values(PaymentOptionType).includes(value as PaymentOptionType);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withPaymentOptionTypeMetadata<T>(value: T): T {
    return value;
}
