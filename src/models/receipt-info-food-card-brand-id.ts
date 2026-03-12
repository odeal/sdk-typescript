/**
 * Koşullu. Eğer ödeme tipi 'FOOD_CARD' ise ZORUNLUDUR.
    /// - 100001: Multinet
    /// - 100002: Setcard
    /// - 100003: Edenred
    /// - 100004: Tokenflex
    /// - 100005: Pluxee
    /// - 100006: Metropol
    /// - 100007: Paye
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * Koşullu. Eğer ödeme tipi 'FOOD_CARD' ise ZORUNLUDUR.
    /// - 100001: Multinet
    /// - 100002: Setcard
    /// - 100003: Edenred
    /// - 100004: Tokenflex
    /// - 100005: Pluxee
    /// - 100006: Metropol
    /// - 100007: Paye
 * @remarks Bu enum numeric değerler içerir.
 */
export enum ReceiptInfoFoodCardBrandId {
    /**
     * MULTINET - API değeri: 100001
     */
    MULTINET = 100001,
    /**
     * SETCARD - API değeri: 100002
     */
    SETCARD = 100002,
    /**
     * EDENRED - API değeri: 100003
     */
    EDENRED = 100003,
    /**
     * TOKENFLEX - API değeri: 100004
     */
    TOKENFLEX = 100004,
    /**
     * PLUXEE - API değeri: 100005
     */
    PLUXEE = 100005,
    /**
     * METROPOL - API değeri: 100006
     */
    METROPOL = 100006,
    /**
     * PAYE - API değeri: 100007
     */
    PAYE = 100007,
}

/**
 * ReceiptInfoFoodCardBrandId enum değerlerinin API karşılıkları.
 */
export const ReceiptInfoFoodCardBrandIdValues = {
    MULTINET: 100001,
    SETCARD: 100002,
    EDENRED: 100003,
    TOKENFLEX: 100004,
    PLUXEE: 100005,
    METROPOL: 100006,
    PAYE: 100007,
} as const;

/**
 * Verilen değerin ReceiptInfoFoodCardBrandId enum'una ait olup olmadığını kontrol eder.
 */
export function isReceiptInfoFoodCardBrandId(value: unknown): value is ReceiptInfoFoodCardBrandId {
    return Object.values(ReceiptInfoFoodCardBrandId).includes(value as ReceiptInfoFoodCardBrandId);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withReceiptInfoFoodCardBrandIdMetadata<T>(value: T): T {
    return value;
}
