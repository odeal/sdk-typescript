/**
 * Odeal SDK Konfigürasyon Modülü
 * 
 * @remarks
 * Bu modül, SDK'nın çalışması için gerekli yapılandırma ayarlarını içerir.
 * 
 * @example
 * ```typescript
 * import { OdealConfig } from '@odeal/sdk';
 * 
 * const config: OdealConfig = {
 *   baseUrl: 'https://api.odeal.com/v1',
 *   secretKey: 'your-secret-key',
 *   merchantKey: 'your-merchant-key',
 * };
 * ```
 */

/**
 * SDK yapılandırma ayarları interface'i.
 */
export interface OdealConfig {
    /**
     * API base URL'i.
     * @default 'https://stage.odealapp.com/api/v1'
     */
    baseUrl: string;

    /**
     * API gizli anahtarı. Tüm isteklerde kimlik doğrulama için kullanılır.
     */
    secretKey: string;

    /**
     * Üye iş yeri anahtarı.
     */
    merchantKey?: string;

  /**
   * Harici cihaz anahtarı. POS cihazı tanımlama için kullanılır.
   */
  externalDeviceKey?: string;

  /**
   * İstemci tarafı validasyonunu atla.
   */
  skipClientValidation?: boolean;

    /**
     * Hata ayıklama modu. Aktifken detaylı log çıktısı üretilir.
     * @default false
     */
    debugMode?: boolean;
}

/**
 * Varsayılan konfigürasyon değerleri.
 */
export const defaultConfig: OdealConfig = {
  baseUrl: 'https://stage.odealapp.com/api/v1',
  secretKey: '',
  merchantKey: '',
  skipClientValidation: false,
  debugMode: false,
};

/**
 * Konfigürasyonun geçerli olup olmadığını kontrol eder.
 * 
 * @param config - Kontrol edilecek konfigürasyon
 * @returns Geçerlilik durumu ve hata mesajları
 */
export function validateConfig(config: Partial<OdealConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.baseUrl) {
        errors.push('baseUrl zorunludur.');
    }

    if (!config.secretKey) {
        errors.push('secretKey zorunludur.');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}