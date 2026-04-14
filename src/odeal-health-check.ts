/**
 * API bağlantı durumunu kontrol eder.
 * 
 * @example
 * ```typescript
 * const healthCheck = new OdealHealthCheck(config);
 * const result = await healthCheck.ping();
 * console.log(`API: ${result.isHealthy ? '✓' : '✗'} (${result.latencyMs}ms)`);
 * ```
 */

import type { OdealConfig } from './odeal-config';

export interface HealthCheckResult {
    /** API erişilebilir mi? */
    isHealthy: boolean;
    /** HTTP durum kodu (0 = bağlantı hatası) */
    statusCode: number;
    /** İstek süresi (ms) */
    latencyMs: number;
    /** Test edilen base URL */
    baseUrl: string;
    /** Hata mesajı (varsa) */
    errorMessage?: string;
}

export class OdealHealthCheck {
    private readonly config: OdealConfig;

    constructor(config: OdealConfig) {
        this.config = config;
    }

    /**
     * API'ye basit bir GET isteği göndererek bağlantıyı test eder.
     */
    async ping(): Promise<HealthCheckResult> {
        const start = Date.now();
        try {
            const response = await fetch(`${this.config.baseUrl}/health`, {
                method: 'GET',
                headers: {
                    'X-ODEAL-SECRET-KEY': this.config.secretKey,
                },
                signal: AbortSignal.timeout(10000),
            });
            const latencyMs = Date.now() - start;

            return {
                isHealthy: response.ok,
                statusCode: response.status,
                latencyMs,
                baseUrl: this.config.baseUrl,
            };
        } catch (error) {
            const latencyMs = Date.now() - start;
            return {
                isHealthy: false,
                statusCode: 0,
                latencyMs,
                baseUrl: this.config.baseUrl,
                errorMessage: error instanceof Error ? error.message : String(error),
            };
        }
    }
}
