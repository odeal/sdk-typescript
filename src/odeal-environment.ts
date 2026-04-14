/**
 * Odeal API ortam tanımları.
 * 
 * @example
 * ```typescript
 * import { OdealEnvironment } from '@odeal/sdk';
 * 
 * const config = new OdealConfigBuilder()
 *   .secretKey('sk_xxx')
 *   .environment(OdealEnvironment.Production)
 *   .build();
 * ```
 */
export enum OdealEnvironment {
    /** Test/geliştirme ortamı */
    Staging = 'staging',
    /** Canlı (production) ortamı */
    Production = 'production'
}

/** Ortam için API base URL'ini döner */
export function getEnvironmentBaseUrl(env: OdealEnvironment): string {
    switch (env) {
        case OdealEnvironment.Production:
            return 'https://api.odeal.com/v1';
        case OdealEnvironment.Staging:
        default:
            return 'https://stage.odealapp.com/api/v1';
    }
}
