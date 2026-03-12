/**
 * Birim Kodları.
    /// - _3I: Kilogram-Adet (C# Uyumu için ön ekli)
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * Birim Kodları.
    /// - _3I: Kilogram-Adet (C# Uyumu için ön ekli)
 * @remarks Bu enum string değerler içerir.
 */
export enum ProductUnitCode {
    /**
     * C62 - API değeri: C62
     */
    C62 = 'C62',
    /**
     * CTM - API değeri: CTM
     */
    CTM = 'CTM',
    /**
     * GRM - API değeri: GRM
     */
    GRM = 'GRM',
    /**
     * GT - API değeri: GT
     */
    GT = 'GT',
    /**
     * MND - API değeri: MND
     */
    MND = 'MND',
    /**
     * KGM - API değeri: KGM
     */
    KGM = 'KGM',
    /**
     * LTR - API değeri: LTR
     */
    LTR = 'LTR',
    /**
     * MTK - API değeri: MTK
     */
    MTK = 'MTK',
    /**
     * KWH - API değeri: KWH
     */
    KWH = 'KWH',
    /**
     * MTQ - API değeri: MTQ
     */
    MTQ = 'MTQ',
    /**
     * MTR - API değeri: MTR
     */
    MTR = 'MTR',
    /**
     * CMT - API değeri: CMT
     */
    CMT = 'CMT',
    /**
     * B32 - API değeri: B32
     */
    B32 = 'B32',
    /**
     * CCT - API değeri: CCT
     */
    CCT = 'CCT',
    /**
     * PR - API değeri: PR
     */
    PR = 'PR',
    /**
     * D30 - API değeri: D30
     */
    D30 = 'D30',
    /**
     * GFI - API değeri: GFI
     */
    GFI = 'GFI',
    /**
     * KPO - API değeri: KPO
     */
    KPO = 'KPO',
    /**
     * _3I - API değeri: 3I
     */
    _3I = '3I',
    /**
     * KFO - API değeri: KFO
     */
    KFO = 'KFO',
    /**
     * KHY - API değeri: KHY
     */
    KHY = 'KHY',
    /**
     * KMA - API değeri: KMA
     */
    KMA = 'KMA',
    /**
     * KNI - API değeri: KNI
     */
    KNI = 'KNI',
    /**
     * KPH - API değeri: KPH
     */
    KPH = 'KPH',
    /**
     * KSH - API değeri: KSH
     */
    KSH = 'KSH',
    /**
     * KUR - API değeri: KUR
     */
    KUR = 'KUR',
    /**
     * D32 - API değeri: D32
     */
    D32 = 'D32',
    /**
     * GWH - API değeri: GWH
     */
    GWH = 'GWH',
    /**
     * MWH - API değeri: MWH
     */
    MWH = 'MWH',
    /**
     * KWT - API değeri: KWT
     */
    KWT = 'KWT',
    /**
     * LPA - API değeri: LPA
     */
    LPA = 'LPA',
    /**
     * DMK - API değeri: DMK
     */
    DMK = 'DMK',
    /**
     * NCL - API değeri: NCL
     */
    NCL = 'NCL',
    /**
     * SM3 - API değeri: SM3
     */
    SM3 = 'SM3',
    /**
     * R9 - API değeri: R9
     */
    R9 = 'R9',
    /**
     * SET - API değeri: SET
     */
    SET = 'SET',
    /**
     * T3 - API değeri: T3
     */
    T3 = 'T3',
    /**
     * AD - API değeri: AD
     */
    AD = 'AD',
    /**
     * PA - API değeri: PA
     */
    PA = 'PA',
    /**
     * PK - API değeri: PK
     */
    PK = 'PK',
}

/**
 * ProductUnitCode enum değerlerinin API karşılıkları.
 */
export const ProductUnitCodeValues = {
    C62: 'C62',
    CTM: 'CTM',
    GRM: 'GRM',
    GT: 'GT',
    MND: 'MND',
    KGM: 'KGM',
    LTR: 'LTR',
    MTK: 'MTK',
    KWH: 'KWH',
    MTQ: 'MTQ',
    MTR: 'MTR',
    CMT: 'CMT',
    B32: 'B32',
    CCT: 'CCT',
    PR: 'PR',
    D30: 'D30',
    GFI: 'GFI',
    KPO: 'KPO',
    _3I: '3I',
    KFO: 'KFO',
    KHY: 'KHY',
    KMA: 'KMA',
    KNI: 'KNI',
    KPH: 'KPH',
    KSH: 'KSH',
    KUR: 'KUR',
    D32: 'D32',
    GWH: 'GWH',
    MWH: 'MWH',
    KWT: 'KWT',
    LPA: 'LPA',
    DMK: 'DMK',
    NCL: 'NCL',
    SM3: 'SM3',
    R9: 'R9',
    SET: 'SET',
    T3: 'T3',
    AD: 'AD',
    PA: 'PA',
    PK: 'PK',
} as const;

/**
 * Verilen değerin ProductUnitCode enum'una ait olup olmadığını kontrol eder.
 */
export function isProductUnitCode(value: unknown): value is ProductUnitCode {
    return Object.values(ProductUnitCode).includes(value as ProductUnitCode);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withProductUnitCodeMetadata<T>(value: T): T {
    return value;
}
