/**
 * İskonto tipi: LINE satır (ürün) iskontosu, SUB ara toplam iskontosunun satıra düşen payı.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * İskonto tipi: LINE satır (ürün) iskontosu, SUB ara toplam iskontosunun satıra düşen payı.
 * @remarks Bu enum string değerler içerir.
 */
export enum AllowanceSubType {
    /**
     * LINE - API değeri: LINE
     */
    LINE = 'LINE',
    /**
     * SUB - API değeri: SUB
     */
    SUB = 'SUB',
}

/**
 * AllowanceSubType enum değerlerinin API karşılıkları.
 */
export const AllowanceSubTypeValues = {
    LINE: 'LINE',
    SUB: 'SUB',
} as const;

/**
 * Verilen değerin AllowanceSubType enum'una ait olup olmadığını kontrol eder.
 */
export function isAllowanceSubType(value: unknown): value is AllowanceSubType {
    return Object.values(AllowanceSubType).includes(value as AllowanceSubType);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withAllowanceSubTypeMetadata<T>(value: T): T {
    return value;
}
