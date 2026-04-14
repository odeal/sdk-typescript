/**
 * PaymentResource - API resource sınıfı.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

import { BaseResource } from '../base-resource';
import { OdealConfig } from '../odeal-config';

/**
 * Payment API işlemleri.
 * 
 * @remarks
 * BaseResource sınıfından türetilmiştir.
 * HTTP isteklerini ve validasyonu otomatik olarak yönetir.
 */
export class PaymentResource extends BaseResource {
    /**
     * PaymentResource sınıfının yeni bir örneğini oluşturur.
     * 
     * @param config - SDK yapılandırma ayarları
     */
    constructor(config: OdealConfig) {
        super(config);
    }

    /**
     * Ödeme İptali
     *
     * @param request - request parametresi.
     * @param options - API header parametreleri (opsiyonel, config'den otomatik doldurulur)
     * @param options.secretKey - Size özel olarak verilmiş gizli anahtar.
     * @param options.merchantKey - Size özel olarak verilmiş iş yeri anahtarı.
     * @param baseUrl - API sunucusunun adresi. (Opsiyonel)
     * @returns any tipinde API yanıtı
     * @throws OdealApiException - API isteği başarısız olduğunda
     * @throws OdealValidationException - Validation hatası oluştuğunda
     */
    async cancelPayment(
        request: any,
        options?: {
            /** Size özel olarak verilmiş gizli anahtar. */
            secretKey?: string;
            /** Size özel olarak verilmiş iş yeri anahtarı. */
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<any> {
        const path = '/payment/cancel';

        // Query parametreleri
        const queryParams: Record<string, string> = {};

        // Header parametreleri
        const headerParams: Record<string, string> = {};
        // X-ODEAL-SECRET-KEY: Config'den otomatik doldurulur (SecretKey)
        {
            let val: string | undefined = options?.secretKey;
            if (val === undefined || val === null) {
                val = this.config.secretKey;
            }
            if (val !== undefined && val !== null) {
                headerParams['X-ODEAL-SECRET-KEY'] = String(val);
            }
        }
        // X-ODEAL-MERCHANT-KEY: Config'den otomatik doldurulur (MerchantKey)
        {
            let val: string | undefined = options?.merchantKey;
            if (val === undefined || val === null) {
                val = this.config.merchantKey;
            }
            if (val !== undefined && val !== null) {
                headerParams['X-ODEAL-MERCHANT-KEY'] = String(val);
            }
        }

        // API çağrısı
        return this.sendRequest<any>(
            'Put',
            path,
            request,
            Object.keys(queryParams).length > 0 ? queryParams : undefined,
            Object.keys(headerParams).length > 0 ? headerParams : undefined,
            baseUrl
        );
    }
}