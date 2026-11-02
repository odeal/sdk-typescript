/**
 * Terminalin entegrasyon profil tipini belirtir.
    /// - INTERNAL_BASKET
    /// - EXTERNAL_DEVICE_TO_DEVICE
    /// - EXTERNAL_BASKET_WITH_APP (APP2APP)
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

/**
 * Terminalin entegrasyon profil tipini belirtir.
    /// - INTERNAL_BASKET
    /// - EXTERNAL_DEVICE_TO_DEVICE
    /// - EXTERNAL_BASKET_WITH_APP (APP2APP)
 * @remarks Bu enum string değerler içerir.
 */
export enum ProfileType {
    /**
     * INTERNALBASKET - API değeri: INTERNAL_BASKET
     */
    INTERNALBASKET = 'INTERNAL_BASKET',
    /**
     * EXTERNALDEVICETODEVICE - API değeri: EXTERNAL_DEVICE_TO_DEVICE
     */
    EXTERNALDEVICETODEVICE = 'EXTERNAL_DEVICE_TO_DEVICE',
    /**
     * EXTERNALBASKETWITHAPP - API değeri: EXTERNAL_BASKET_WITH_APP
     */
    EXTERNALBASKETWITHAPP = 'EXTERNAL_BASKET_WITH_APP',
}

/**
 * ProfileType enum değerlerinin API karşılıkları.
 */
export const ProfileTypeValues = {
    INTERNALBASKET: 'INTERNAL_BASKET',
    EXTERNALDEVICETODEVICE: 'EXTERNAL_DEVICE_TO_DEVICE',
    EXTERNALBASKETWITHAPP: 'EXTERNAL_BASKET_WITH_APP',
} as const;

/**
 * Verilen değerin ProfileType enum'una ait olup olmadığını kontrol eder.
 */
export function isProfileType(value: unknown): value is ProfileType {
    return Object.values(ProfileType).includes(value as ProfileType);
}

/**
 * Enum değeri için metadata fonksiyonu (no-op).
 * Model'lerle tutarlılık için eklendi - enum'lar için metadata gerekmez.
 */
export function withProfileTypeMetadata<T>(value: T): T {
    return value;
}
