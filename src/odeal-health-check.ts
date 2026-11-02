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
import { getEffectiveBaseUrl } from './odeal-config';

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
     * Kimlik doğrulaması istemeyen `GET /healthcheck` ucuyla bağlantıyı test eder; anahtar gönderilmez.
     */
    async ping(): Promise<HealthCheckResult> {
        const start = Date.now();
        let baseUrl = '';
        try {
            baseUrl = getEffectiveBaseUrl(this.config);
            const response = await fetch(`${baseUrl}/healthcheck`, {
                method: 'GET',
                // Yönlendirme izlenmez; 3xx sağlıksız sayılır.
                redirect: 'manual',
                signal: AbortSignal.timeout(10000),
            });
            const latencyMs = Date.now() - start;

            return {
                isHealthy: response.ok,
                statusCode: response.status,
                latencyMs,
                baseUrl,
            };
        } catch (error) {
            const latencyMs = Date.now() - start;
            return {
                isHealthy: false,
                statusCode: 0,
                latencyMs,
                baseUrl,
                errorMessage: error instanceof Error ? error.message : String(error),
            };
        }
    }
}
