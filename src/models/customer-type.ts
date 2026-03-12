/**
 * Müşteri Tipi. Default: INDIVIDUAL.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * Müşteri Tipi. Default: INDIVIDUAL.
 * @remarks Bu enum string değerler içerir.
 */
export enum CustomerType {
    /**
     * INDIVIDUAL - API değeri: INDIVIDUAL
     */
    INDIVIDUAL = 'INDIVIDUAL',
    /**
     * CORPORATE - API değeri: CORPORATE
     */
    CORPORATE = 'CORPORATE',
}

/**
 * CustomerType enum değerlerinin API karşılıkları.
 */
export const CustomerTypeValues = {
    INDIVIDUAL: 'INDIVIDUAL',
    CORPORATE: 'CORPORATE',
} as const;

/**
 * Verilen değerin CustomerType enum'una ait olup olmadığını kontrol eder.
 */
export function isCustomerType(value: unknown): value is CustomerType {
    return Object.values(CustomerType).includes(value as CustomerType);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withCustomerTypeMetadata<T>(value: T): T {
    return value;
}
