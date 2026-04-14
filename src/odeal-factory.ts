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
import { OdealEnvironment, getEnvironmentBaseUrl } from './odeal-environment';

/**
 * OdealClient'ı varsayılan değerlerle oluşturur.
 * 
 * @param config - Kısmi yapılandırma (sadece gerekli alanları belirtin)
 * @returns Yapılandırılmış OdealClient instance'ı
 */
export function createOdealClient(config: Partial<OdealConfig> & Pick<OdealConfig, 'secretKey' | 'merchantKey'>) {
    // Dynamic import to avoid circular dependency
    const fullConfig: OdealConfig = {
        baseUrl: 'https://stage.odealapp.com/api/v1',
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
 * - ODEAL_ENVIRONMENT (opsiyonel — "staging" veya "production")
 * - ODEAL_SANDBOX (opsiyonel — "true"/"false")
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

    // Ortam belirleme (öncelik: ODEAL_BASE_URL > ODEAL_SANDBOX > ODEAL_ENVIRONMENT > default)
    let baseUrl: string = 'https://stage.odealapp.com/api/v1';
    const envStr = process.env.ODEAL_ENVIRONMENT;
    if (envStr === 'production' || envStr === 'prod') {
        baseUrl = getEnvironmentBaseUrl(OdealEnvironment.Production);
    }
    if (process.env.ODEAL_BASE_URL) {
        baseUrl = process.env.ODEAL_BASE_URL;
    }
    if (process.env.ODEAL_SANDBOX === 'true') {
        baseUrl = getEnvironmentBaseUrl(OdealEnvironment.Staging);
    }

    return createOdealClient({
        secretKey,
        merchantKey,
        baseUrl,
        debugMode: process.env.ODEAL_DEBUG === 'true',
        ...overrides,
    });
}
