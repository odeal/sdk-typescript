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
 *   baseUrl: 'https://api.sandbox.odeal.com/integration/api/v1', // test ortamı
 *   secretKey: 'your-secret-key',
 *   merchantKey: 'your-merchant-key',
 * };
 * ```
 */

import type { OdealInterceptor } from './interceptor';
import { OdealEnvironment, getEnvironmentBaseUrl, parseEnvironment } from './odeal-environment';

/**
 * Structured Logger interface. Winston, Pino vb. kurumsal loglayıcılar ile uyumludur.
 * 
 * @example
 * ```typescript
 * // Winston entegrasyonu
 * import winston from 'winston';
 * const winstonLogger = winston.createLogger({ ... });
 * const config: OdealConfig = {
 *   secretKey: '...',
 *   logger: winstonLogger
 * };
 * 
 * // Özel implementasyon
 * const myLogger: OdealLogger = {
 *   debug: (msg, ...meta) => mySystem.log('debug', msg, ...meta),
 *   info:  (msg, ...meta) => mySystem.log('info', msg, ...meta),
 *   warn:  (msg, ...meta) => mySystem.log('warn', msg, ...meta),
 *   error: (msg, ...meta) => mySystem.log('error', msg, ...meta),
 * };
 * ```
 */
export interface OdealLogger {
  debug(message: string, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
}

/**
 * Varsayılan Console Logger implementasyonu.
 * logger belirtilmezse bu kullanılır.
 */
export class ConsoleOdealLogger implements OdealLogger {
  debug(message: string, ...meta: unknown[]): void {
    console.debug(`[ODEAL SDK DEBUG] ${message}`, ...meta);
  }
  info(message: string, ...meta: unknown[]): void {
    console.info(`[ODEAL SDK INFO] ${message}`, ...meta);
  }
  warn(message: string, ...meta: unknown[]): void {
    console.warn(`[ODEAL SDK WARN] ${message}`, ...meta);
  }
  error(message: string, ...meta: unknown[]): void {
    console.error(`[ODEAL SDK ERROR] ${message}`, ...meta);
  }
}

/**
 * SDK yapılandırma ayarları interface'i.
 */
export interface OdealConfig {
    /**
     * Açık API taban adresi. Verilmezse (ya da boşsa) `environment` ortamının adresi kullanılır; varsayılan
     * production: https://api.odeal.com/api/v1. `sandboxMode` açıkken yok sayılır (davranış sözleşmesi §12).
     */
    baseUrl?: string;

    /**
     * Ortam. `baseUrl` verilmemişse isteklerin gittiği adresi belirler. Ad olarak "staging", "sandbox", "prod" gibi
     * takma adlar da kabul edilir; bilinmeyen ad hata verir.
     * @default OdealEnvironment.Production
     */
    environment?: OdealEnvironment;

    /**
     * API gizli anahtarı. Tüm isteklerde kimlik doğrulama için kullanılır.
     */
    secretKey: string;

    /**
     * Üye iş yeri anahtarı.
     */
    merchantKey?: string;

    /**
     * OAuth2 / Bearer erişim token'ı. Ayarlandığında her isteğe Authorization: Bearer eklenir.
     */
    accessToken?: string;

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

  // --- ENTERPRISE YETENEKLERİ ---
  
  /**
   * İstek zaman aşımı süresi (milisaniye cinsinden).
   * @default 30000
   */
  timeout?: number;

  /**
   * Ağ veya 5xx sunucu hatalarında maksimum tekrar deneme sayısı.
   * @default 3
   */
  maxRetryCount?: number;

  /**
   * Loglama sırasında hassas verilerin gizlenmesini sağlar.
   * @default true
   */
  maskSensitiveData?: boolean;
  
  /** Circuit breaker'ı etkinleştirir (varsayılan: false). */
  circuitBreakerEnabled?: boolean;
  /** Circuit breaker hata eşiği (varsayılan: 5). */
  circuitBreakerThreshold?: number;
  /** Circuit breaker reset süresi ms (varsayılan: 60000). */
  circuitBreakerResetMs?: number;

  /**
   * POST/PUT/PATCH isteklerine `X-Odeal-Idempotency-Key` başlığı eklenir mi. Ödeal API'si bu başlığı henüz
   * kullanmıyor; sepetin benzersiz anahtarı `basketReferenceCode`'dur (sözleşme §3).
   * @default false
   */
  enableIdempotencyKey?: boolean;

  /**
   * Structured Logger instance'ı (Winston, Pino vb. kurumsal loglayıcılar için).
   * Belirtilmezse ConsoleOdealLogger kullanılır.
   * 
   * @example
   * ```typescript
   * // Winston ile
   * logger: winstonInstance
   * // Pino ile
   * logger: pinoInstance
   * ```
   */
  logger?: OdealLogger;

  /**
   * HTTP istek/yanıt pipeline'ına araya girmek için interceptor listesi.
   * @see OdealInterceptor
   */
  interceptors?: OdealInterceptor[];

  /**
   * Sandbox (test) modu. Açıkken istekler baseUrl ve environment'tan bağımsız olarak test ortamına gider
   * (davranış sözleşmesi §12). Çağrı başına verilen adres bundan da önceliklidir (§11).
   * Production'a geçmeden önce test yapmak için kullanışlıdır.
   * @default false
   */
  sandboxMode?: boolean;
}

/**
 * Varsayılan konfigürasyon değerleri.
 */
export const defaultConfig: OdealConfig = {
  secretKey: '',
  merchantKey: '',
  skipClientValidation: false,
  debugMode: false,
  timeout: 30000,
  maxRetryCount: 3,
  maskSensitiveData: true,
  sandboxMode: false,
  enableIdempotencyKey: false
};

/**
 * İsteklerin gönderildiği taban adres (davranış sözleşmesi §12): sandboxMode açıksa test ortamı; değilse açık
 * baseUrl; o da yoksa environment ortamının adresi (varsayılan production).
 * @throws Error environment tanınmayan bir değerse
 */
export function getEffectiveBaseUrl(config: Partial<OdealConfig>): string {
  if (config.sandboxMode) {
    return getEnvironmentBaseUrl(OdealEnvironment.Staging);
  }
  if (config.baseUrl) {
    return config.baseUrl;
  }
  return getEnvironmentBaseUrl(
    config.environment == null ? OdealEnvironment.Production : parseEnvironment(String(config.environment)));
}

/**
 * Konfigürasyonun geçerli olup olmadığını kontrol eder.
 * 
 * @param config - Kontrol edilecek konfigürasyon
 * @returns Geçerlilik durumu ve hata mesajları
 */
export function validateConfig(config: Partial<OdealConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
        getEffectiveBaseUrl(config);
    } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
    }

    if (!config.secretKey) {
        errors.push('secretKey zorunludur.');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Secret değerini maskeler: ilk 4 ve son 4 karakter görünür, arada '***'.
 * 8 karakterden kısa secret'lar tamamen maskelenir.
 */
export function maskSecret(secret?: string): string {
    if (!secret) return '(empty)';
    if (secret.length <= 8) return '***';
    return `${secret.substring(0, 4)}***${secret.substring(secret.length - 4)}`;
}

/**
 * Config nesnesini güvenli string'e dönüştürür (hassas veriler maskelenir).
 * API anahtarlarının yanlışlıkla log'lara sızmasını engeller.
 * 
 * @example
 * ```typescript
 * console.log(configToString(config));
 * // OdealConfig{baseUrl=https://api..., secretKey=sk_t***_key, merchantKey=mk_t***_key}
 * ```
 */
export function configToString(config: OdealConfig): string {
    return `OdealConfig{baseUrl=${config.baseUrl ?? ''}, environment=${config.environment ?? OdealEnvironment.Production}, ` +
        `sandboxMode=${config.sandboxMode ?? false}, secretKey=${maskSecret(config.secretKey)}, ` +
        `merchantKey=${maskSecret(config.merchantKey)}, debugMode=${config.debugMode ?? false}, ` +
        `timeout=${config.timeout ?? 30000}ms, maxRetry=${config.maxRetryCount ?? 3}}`;
}