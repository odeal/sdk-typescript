
import { AllowanceSubType } from '../enums/allowance-sub-type';

/**
 * Ürün satırına uygulanan iskonto. Tutarlar KDV dahildir. Önce LINE, sonra SUB iskontoları uygulanır; aynı tipte order sırası geçerlidir. İskontolu sepette sepet özetine totalAllowance ve paidAmount da gönderilir.
 */
export interface Allowance {
    /** Tutar bazlı iskontoda (isRateBased=false) zorunlu (2089): satırın tamamına (adet × birim fiyat) uygulanan KDV dahil iskonto tutarı; birim başına değildir. Satır tutarını aşamaz (2049). */
    price?: number;
    /** Oran bazlı iskontoda (isRateBased=true) zorunlu (2090): yüzde değeri, ör. 10 = %10. En çok 100. */
    rate?: number;
    /** Zorunlu (2088). Tutar bazlı iskonto için false, oran bazlı iskonto için true. */
    isRateBased: boolean;
    /** Zorunlu. LINE: satır (ürün) iskontosu. SUB: ara toplam iskontosunun satıra düşen payı; sepette SUB kullanılıyorsa her satırda bulunmalıdır (2080). */
    subType: AllowanceSubType;
    /** İsteğe bağlı. Aynı satırda birden fazla iskonto varsa aynı tip içindeki uygulanma sırası. */
    order?: number;
}
export const AllowanceValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'isRateBased': {
        required: true,
        message: 'IsRateBased formatı geçersiz.',
    },
    'subType': {
        required: true,
        message: 'SubType formatı geçersiz.',
    },
};

export function createAllowance(partial: Partial<Allowance> = {}): Allowance & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        price: partial.price,
        rate: partial.rate,
        isRateBased: partial.isRateBased,
        subType: partial.subType,
        order: partial.order,
    } as any;
    obj.__validationRules = AllowanceValidationRules;
    
    return obj;
}

export function withAllowanceMetadata<T extends Allowance>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = AllowanceValidationRules;
    
    return result;
}
