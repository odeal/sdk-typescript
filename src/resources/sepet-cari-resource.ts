/**
 * SepetCariResource - API resource sınıfı.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

import { BaseResource } from '../base-resource';
import { OdealConfig } from '../odeal-config';
import {
    BasketRequestCurrentAccount,
    BasketResponse,
    withBasketRequestCurrentAccountMetadata,
} from '../models';

/**
 * SepetCari API işlemleri.
 * 
 * @remarks
 * BaseResource sınıfından türetilmiştir.
 * HTTP isteklerini ve validasyonu otomatik olarak yönetir.
 */
export class SepetCariResource extends BaseResource {
    /**
     * SepetCariResource sınıfının yeni bir örneğini oluşturur.
     * 
     * @param config - SDK yapılandırma ayarları
     */
    constructor(config: OdealConfig) {
        super(config);
    }

    /**
     * Cari hesap tahsilatı. Müşteri Kurumsal olmalıdır. `basketType` CURRENT_ACCOUNT olmalıdır.
     *
     * @param request - request parametresi.
     * @param options - API header parametreleri (opsiyonel, config'den otomatik doldurulur)
     * @param options.secretKey - Size özel olarak verilmiş gizli anahtar.
     * @param options.merchantKey - Size özel olarak verilmiş iş yeri anahtarı.
     * @param baseUrl - API sunucusunun adresi. (Opsiyonel)
     * @returns BasketResponse tipinde API yanıtı
     * @throws OdealApiException - API isteği başarısız olduğunda
     * @throws OdealValidationException - Validation hatası oluştuğunda
     */
    async createCurrentAccountBasket(
        request: BasketRequestCurrentAccount,
        options?: {
            /** Size özel olarak verilmiş gizli anahtar. */
            secretKey?: string;
            /** Size özel olarak verilmiş iş yeri anahtarı. */
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketResponse> {
        const path = '/basket/current-account';

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
        // Body'ye config ve validation metadata ekle
        const bodyWithMetadata = withBasketRequestCurrentAccountMetadata(request);

        // API çağrısı
        return this.sendRequest<BasketResponse>(
            'Post',
            path,
            bodyWithMetadata,
            Object.keys(queryParams).length > 0 ? queryParams : undefined,
            Object.keys(headerParams).length > 0 ? headerParams : undefined,
            baseUrl
        );
    }
}