/**
 * OdealConfig fluent builder.
 * 
 * @example
 * ```typescript
 * const config = new OdealConfigBuilder()
 *   .secretKey('sk_xxx')
 *   .merchantKey('mk_xxx')
 *   .environment(OdealEnvironment.Staging)
 *   .debugMode(true)
 *   .timeout(60000)
 *   .maxRetryCount(5)
 *   .addInterceptor(loggingInterceptor)
 *   .build();
 * ```
 */

import type { OdealConfig } from './odeal-config';
import type { OdealInterceptor } from './interceptor';
import type { OdealEnvironment } from './odeal-environment';

export class OdealConfigBuilder {
    private config: Partial<OdealConfig> = {
        timeout: 30000,
        maxRetryCount: 3,
        debugMode: false,
        skipClientValidation: false,
        maskSensitiveData: true,
        interceptors: [],
    };

    secretKey(secretKey: string): this { this.config.secretKey = secretKey; return this; }
    merchantKey(merchantKey: string): this { this.config.merchantKey = merchantKey; return this; }
    baseUrl(baseUrl: string): this { this.config.baseUrl = baseUrl; return this; }
    /** Ortam (Staging veya Production). Açık baseUrl verilmişse adres o olur; çağrı sırası önemsizdir (§12). */
    environment(env: OdealEnvironment): this { this.config.environment = env; return this; }
    /** Sandbox (test) modu. Açıkken istekler her zaman test ortamına gider (§12). */
    sandboxMode(sandbox: boolean = true): this { this.config.sandboxMode = sandbox; return this; }
    externalDeviceKey(key: string): this { this.config.externalDeviceKey = key; return this; }
    skipClientValidation(skip: boolean = true): this { this.config.skipClientValidation = skip; return this; }
    debugMode(debug: boolean = true): this { this.config.debugMode = debug; return this; }
    timeout(timeoutMs: number): this { this.config.timeout = timeoutMs; return this; }
    maxRetryCount(count: number): this { this.config.maxRetryCount = count; return this; }
    maskSensitiveData(mask: boolean = true): this { this.config.maskSensitiveData = mask; return this; }
    /** POST/PUT/PATCH isteklerine idempotency başlığı ekler (varsayılan kapalı; sözleşme §3). */
    enableIdempotencyKey(enable: boolean = true): this { this.config.enableIdempotencyKey = enable; return this; }
    
    addInterceptor(interceptor: OdealInterceptor): this {
        if (!this.config.interceptors) this.config.interceptors = [];
        this.config.interceptors.push(interceptor);
        return this;
    }

    /**
     * OdealConfig'i oluşturur ve zorunlu alanları doğrular.
     * @throws Error Zorunlu alanlar eksikse
     */
    build(): OdealConfig {
        if (!this.config.secretKey) {
            throw new Error('secretKey is required. Call .secretKey() before .build().');
        }
        if (!this.config.merchantKey) {
            throw new Error('merchantKey is required. Call .merchantKey() before .build().');
        }
        return this.config as OdealConfig;
    }
}
