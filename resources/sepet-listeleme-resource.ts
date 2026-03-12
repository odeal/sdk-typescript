/**
 * SepetListelemeResource - API resource sınıfı.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

import { BaseResource } from '../base-resource';
import { OdealConfig } from '../odeal-config';
import {
    BasketListResponse,
} from '../models';

/**
 * SepetListeleme API işlemleri.
 * 
 * @remarks
 * BaseResource sınıfından türetilmiştir.
 * HTTP isteklerini ve validasyonu otomatik olarak yönetir.
 */
export class SepetListelemeResource extends BaseResource {
    /**
     * SepetListelemeResource sınıfının yeni bir örneğini oluşturur.
     * 
     * @param config - SDK yapılandırma ayarları
     */
    constructor(config: OdealConfig) {
        super(config);
    }

    /**
     * Sepet Listele
     *
     * @param options - API header parametreleri (opsiyonel, config'den otomatik doldurulur)
     * @param options.secretKey - Size özel olarak verilmiş gizli anahtar.
     * @param options.merchantKey - Size özel olarak verilmiş iş yeri anahtarı.
     * @param options.externalDeviceKey - 
     * @param baseUrl - API sunucusunun adresi. (Opsiyonel)
     * @returns BasketListResponse tipinde API yanıtı
     * @throws OdealApiException - API isteği başarısız olduğunda
     * @throws OdealValidationException - Validation hatası oluştuğunda
     */
    async listBaskets(
        options?: {
            /** Size özel olarak verilmiş gizli anahtar. */
            secretKey?: string;
            /** Size özel olarak verilmiş iş yeri anahtarı. */
            merchantKey?: string;
            /**  */
            externalDeviceKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketListResponse> {
        const path = '/basket/list';

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
        // externalDeviceKey: Config'den otomatik doldurulur (ExternalDeviceKey)
        {
            let val: string | undefined = options?.externalDeviceKey;
            if (val === undefined || val === null) {
                val = this.config.externalDeviceKey;
            }
            if (val !== undefined && val !== null) {
                headerParams['externalDeviceKey'] = String(val);
            }
        }

        // API çağrısı
        return this.sendRequest<BasketListResponse>(
            'Get',
            path,
            undefined,
            Object.keys(queryParams).length > 0 ? queryParams : undefined,
            Object.keys(headerParams).length > 0 ? headerParams : undefined,
            baseUrl
        );
    }
}