
import { ReceiptInfoFoodCardBrandId } from '../enums/receipt-info-food-card-brand-id';

/**
 * Fiş detayları. Tüm sepet tipleri için ortak yapıdır.
 */
export interface ReceiptInfo {
    /** Koşullu. Eğer ödeme tipi 'FOOD_CARD' ise ZORUNLUDUR.
    /// - 100001: Multinet
    /// - 100002: Setcard
    /// - 100003: Edenred
    /// - 100004: Tokenflex
    /// - 100005: Pluxee
    /// - 100006: Metropol
    /// - 100007: Paye */
    foodCardBrandId?: ReceiptInfoFoodCardBrandId;
    /** Koşullu. Sadece 'CURRENT_ACCOUNT' (Cari Hesap) işleminde kullanılır (Fatura/Ekstre No). */
    receiptNumber?: string;
    /** Koşullu. Sadece 'CURRENT_ACCOUNT' (Cari Hesap) işleminde kullanılır (YYYY-MM-DD). */
    receiptDate?: string;
    /** Opsiyonel. */
    SiparisNo?: string;
    /** Opsiyonel. */
    Garson?: string;
}
export const ReceiptInfoValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'receiptNumber': {
        pattern: /^.{1,50}$/,
        message: 'ReceiptNumber formatı geçersiz.',
    },
    'receiptDate': {
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        message: 'Fiş tarihi YYYY-MM-DD formatında olmalıdır.',
    },
    'SiparisNo': {
        pattern: /^.{0,50}$/,
        message: 'SiparisNo formatı geçersiz.',
    },
    'Garson': {
        pattern: /^.{0,50}$/,
        message: 'Garson formatı geçersiz.',
    },
};

export function createReceiptInfo(partial: Partial<ReceiptInfo> = {}): ReceiptInfo & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        foodCardBrandId: partial.foodCardBrandId,
        receiptNumber: partial.receiptNumber,
        receiptDate: partial.receiptDate,
        SiparisNo: partial.SiparisNo,
        Garson: partial.Garson,
    } as any;
    obj.__validationRules = ReceiptInfoValidationRules;
    
    return obj;
}

export function withReceiptInfoMetadata<T extends ReceiptInfo>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = ReceiptInfoValidationRules;
    
    return result;
}
