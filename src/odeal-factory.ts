/**
 * Odeal SDK Factory Helper
 * 
 * @remarks
 * OdealClient'ı kolayca oluşturmak için factory fonksiyonu.
 * Partial config ile varsayılan değerleri otomatik doldurur.
 * 
 * @example
 * ```typescript
 * import { createOdealClient } from '@odeal/sdk';
 * 
 * const client = createOdealClient({
 *   secretKey: 'sk_xxx',
 *   merchantKey: 'mk_xxx',
 * });
 * 
 * const response = await client.basket.create({ ... });
 * ```
 */

import type { OdealConfig } from './odeal-config';
import { parseEnvironment } from './odeal-environment';

/**
 * OdealClient'ı varsayılan değerlerle oluşturur.
 * 
 * @param config - Kısmi yapılandırma (sadece gerekli alanları belirtin)
 * @returns Yapılandırılmış OdealClient instance'ı
 */
export function createOdealClient(config: Partial<OdealConfig> & Pick<OdealConfig, 'secretKey' | 'merchantKey'>) {
    // Dynamic import to avoid circular dependency
    const fullConfig: OdealConfig = {
        timeout: 30000,
        maxRetryCount: 3,
        debugMode: false,
        skipClientValidation: false,
        maskSensitiveData: true,
        ...config,
    };

    // Lazy import OdealClient to avoid circular dependency issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OdealClient } = require('./odeal-client');
    return new OdealClient(fullConfig);
}

/**
 * OdealClient'ı environment variable'lardan otomatik yapılandırır.
 * 
 * @remarks
 * Aşağıdaki env değişkenlerini okur:
 * - ODEAL_SECRET_KEY
 * - ODEAL_MERCHANT_KEY
 * - ODEAL_BASE_URL (opsiyonel)
 * - ODEAL_ENVIRONMENT (opsiyonel — production, prod, staging, stage, sandbox; başka değer hata)
 * - ODEAL_SANDBOX (opsiyonel — true/false/1/0; başka değer hata)
 * - ODEAL_DEBUG (opsiyonel, "true"/"false")
 * 
 * @param overrides - Env üzerini yazmak için opsiyonel config
 * @returns Yapılandırılmış OdealClient instance'ı
 */
export function createOdealClientFromEnv(overrides: Partial<OdealConfig> = {}) {
    const secretKey = process.env.ODEAL_SECRET_KEY;
    const merchantKey = process.env.ODEAL_MERCHANT_KEY;

    if (!secretKey || !merchantKey) {
        throw new Error(
            'ODEAL_SECRET_KEY and ODEAL_MERCHANT_KEY environment variables must be set. ' +
            'Set them or use createOdealClient() with explicit configuration.'
        );
    }

    // Ortam ve adres. Öncelik getEffectiveBaseUrl'de (sözleşme §12): ODEAL_SANDBOX açık > ODEAL_BASE_URL >
    // ODEAL_ENVIRONMENT > production. Bilinmeyen değer hata verir; sessizce production'a düşülmez.
    const fromEnv: Partial<OdealConfig> = { sandboxMode: parseFlag('ODEAL_SANDBOX', process.env.ODEAL_SANDBOX) };
    const envStr = process.env.ODEAL_ENVIRONMENT;
    if (envStr && envStr.trim()) {
        try {
            fromEnv.environment = parseEnvironment(envStr);
        } catch (e) {
            throw new Error(`ODEAL_ENVIRONMENT geçersiz: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    const baseUrl = process.env.ODEAL_BASE_URL;
    if (baseUrl && baseUrl.trim()) {
        fromEnv.baseUrl = baseUrl.trim();
    }

    return createOdealClient({
        secretKey,
        merchantKey,
        ...fromEnv,
        debugMode: process.env.ODEAL_DEBUG === 'true',
        ...overrides,
    });
}

/** "true"/"1" açık; "false"/"0"/boş kapalı; başka değer hata (sessizce production'a düşülmez). */
function parseFlag(name: string, value: string | undefined): boolean {
    switch ((value ?? '').trim().toLowerCase()) {
        case '':
        case 'false':
        case '0':
            return false;
        case 'true':
        case '1':
            return true;
        default:
            throw new Error(`${name} geçersiz: '${value}'. Geçerli değerler: true, false, 1, 0.`);
    }
}
