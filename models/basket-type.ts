/**
 * Global Basket Type Enum.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * Global Basket Type Enum.
 * @remarks Bu enum string değerler içerir.
 */
export enum BasketType {
    /**
     * SIMPLE - API değeri: SIMPLE
     */
    SIMPLE = 'SIMPLE',
    /**
     * ADVANCE - API değeri: ADVANCE
     */
    ADVANCE = 'ADVANCE',
    /**
     * CURRENTACCOUNT - API değeri: CURRENT_ACCOUNT
     */
    CURRENTACCOUNT = 'CURRENT_ACCOUNT',
}

/**
 * BasketType enum değerlerinin API karşılıkları.
 */
export const BasketTypeValues = {
    SIMPLE: 'SIMPLE',
    ADVANCE: 'ADVANCE',
    CURRENTACCOUNT: 'CURRENT_ACCOUNT',
} as const;

/**
 * Verilen değerin BasketType enum'una ait olup olmadığını kontrol eder.
 */
export function isBasketType(value: unknown): value is BasketType {
    return Object.values(BasketType).includes(value as BasketType);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withBasketTypeMetadata<T>(value: T): T {
    return value;
}
