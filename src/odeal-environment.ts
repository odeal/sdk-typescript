/**
 * Odeal API ortam tanımları.
 *
 * Taban adres önceliği (davranış sözleşmesi §12): çağrı başına adres, sandboxMode, açık baseUrl, environment,
 * varsayılan (production).
 *
 * @example
 * ```typescript
 * import { OdealConfigBuilder, OdealEnvironment } from '@odeal/sdk';
 *
 * const config = new OdealConfigBuilder()
 *   .secretKey('sk_xxx')
 *   .merchantKey('mk_xxx')
 *   .environment(OdealEnvironment.Staging)
 *   .build();
 * ```
 */
export enum OdealEnvironment {
    /** Test ortamı (sandbox): https://api.sandbox.odeal.com/integration/api/v1 */
    Staging = 'staging',
    /** Canlı (production) ortamı: https://api.odeal.com/api/v1 */
    Production = 'production'
}

/**
 * Ortamın API taban adresini döner.
 * @throws Error Tanımsız bir ortam değeri verilirse (sessizce production'a düşülmez).
 */
export function getEnvironmentBaseUrl(env: OdealEnvironment): string {
    switch (env) {
        case OdealEnvironment.Production:
            return 'https://api.odeal.com/api/v1';
        case OdealEnvironment.Staging:
            return 'https://api.sandbox.odeal.com/integration/api/v1';
        default:
            throw new Error(`Bilinmeyen Odeal ortamı: '${String(env)}'. Geçerli değerler: production, staging.`);
    }
}

/**
 * Ortam adını çözer: "production" ve "prod" → Production; "staging", "stage" ve "sandbox" → Staging.
 * Büyük/küçük harf ve baştaki/sondaki boşluk önemsizdir.
 * @throws Error Ad boşsa ya da tanınmıyorsa (sessizce production'a düşülmez).
 */
export function parseEnvironment(value: string): OdealEnvironment {
    switch (String(value ?? '').trim().toLowerCase()) {
        case 'production':
        case 'prod':
            return OdealEnvironment.Production;
        case 'staging':
        case 'stage':
        case 'sandbox':
            return OdealEnvironment.Staging;
        default:
            throw new Error(
                `Bilinmeyen Odeal ortamı: '${value}'. Geçerli değerler: production, prod, staging, stage, sandbox.`);
    }
}
