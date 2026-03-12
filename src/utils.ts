/**
 * Odeal SDK Utility Modülü
 * 
 * @remarks
 * Bu modül, SDK genelinde kullanılan yardımcı fonksiyonları içerir.
 */

/**
 * camelCase string'i snake_case'e çevirir.
 * 
 * @param str - Dönüştürülecek string
 * @returns snake_case formatında string
 * 
 * @example
 * ```typescript
 * toSnakeCase('merchantKey') // 'merchant_key'
 * ```
 */
export function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

/**
 * snake_case string'i camelCase'e çevirir.
 * 
 * @param str - Dönüştürülecek string
 * @returns camelCase formatında string
 * 
 * @example
 * ```typescript
 * toCamelCase('merchant_key') // 'merchantKey'
 * ```
 */
export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Nesneyi JSON-serializable formata çevirir (null ve undefined değerleri temizler).
 * 
 * @param obj - Dönüştürülecek nesne
 * @returns Temizlenmiş nesne
 */
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const result: Partial<T> = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                result[key as keyof T] = cleanObject(value as Record<string, unknown>) as T[keyof T];
            } else {
                result[key as keyof T] = value as T[keyof T];
            }
        }
    }
    
    return result;
}

/**
 * Derin kopyalama yapar.
 * 
 * @param obj - Kopyalanacak nesne
 * @returns Derin kopya
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)) as unknown as T;
    }
    
    const cloned = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * İki nesneyi birleştirir (deep merge).
 * 
 * @param target - Hedef nesne
 * @param source - Kaynak nesne
 * @returns Birleştirilmiş nesne
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];
            
            if (
                sourceValue !== undefined &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)
            ) {
                result[key] = deepMerge(
                    targetValue as Record<string, unknown>,
                    sourceValue as Record<string, unknown>
                ) as T[Extract<keyof T, string>];
            } else if (sourceValue !== undefined) {
                result[key] = sourceValue as T[Extract<keyof T, string>];
            }
        }
    }
    
    return result;
}

/**
 * Belirtilen süre kadar bekler.
 * 
 * @param ms - Milisaniye cinsinden bekleme süresi
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry mekanizması ile fonksiyon çalıştırır.
 * 
 * @param fn - Çalıştırılacak async fonksiyon
 * @param retries - Maksimum deneme sayısı
 * @param delay - Denemeler arası bekleme süresi (ms)
 * @returns Fonksiyon sonucu
 */
export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (i < retries - 1) {
                await sleep(delay);
            }
        }
    }
    
    throw lastError;
}

/**
 * Tarihi ISO 8601 formatına çevirir.
 * 
 * @param date - Date objesi veya string
 * @returns ISO 8601 formatında string
 */
export function toISODate(date: Date | string): string {
    if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
}

/**
 * Tarihi ISO 8601 datetime formatına çevirir.
 * 
 * @param date - Date objesi veya string
 * @returns ISO 8601 datetime formatında string
 */
export function toISODateTime(date: Date | string): string {
    if (typeof date === 'string') {
        return new Date(date).toISOString();
    }
    return date.toISOString();
}