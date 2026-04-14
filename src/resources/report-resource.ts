/**
 * ReportResource - API resource sınıfı.
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

import { BaseResource } from '../base-resource';
import { OdealConfig } from '../odeal-config';
import {
    TransactionReport,
} from '../models';

/**
 * Report API işlemleri.
 * 
 * @remarks
 * BaseResource sınıfından türetilmiştir.
 * HTTP isteklerini ve validasyonu otomatik olarak yönetir.
 */
export class ReportResource extends BaseResource {
    /**
     * ReportResource sınıfının yeni bir örneğini oluşturur.
     * 
     * @param config - SDK yapılandırma ayarları
     */
    constructor(config: OdealConfig) {
        super(config);
    }

    /**
     * İşlem Raporu
     *
     * @param beginDate - 
     * @param endDate - 
     * @param externalDeviceKey -  (Opsiyonel)
     * @param basketReferenceCode -  (Opsiyonel)
     * @param options - API header parametreleri (opsiyonel, config'den otomatik doldurulur)
     * @param options.secretKey - Size özel olarak verilmiş gizli anahtar.
     * @param options.merchantKey - Size özel olarak verilmiş iş yeri anahtarı.
     * @param baseUrl - API sunucusunun adresi. (Opsiyonel)
     * @returns TransactionReport[] tipinde API yanıtı
     * @throws OdealApiException - API isteği başarısız olduğunda
     * @throws OdealValidationException - Validation hatası oluştuğunda
     */
    async getTransactionReport(
        beginDate: string,
        endDate: string,
        externalDeviceKey?: string,
        basketReferenceCode?: string,
        options?: {
            /** Size özel olarak verilmiş gizli anahtar. */
            secretKey?: string;
            /** Size özel olarak verilmiş iş yeri anahtarı. */
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<TransactionReport[]> {
        const path = '/report/transactions';

        // Query parametreleri
        const queryParams: Record<string, string> = {};
        if (beginDate !== undefined && beginDate !== null) {
            queryParams['beginDate'] = String(beginDate);
        }
        if (endDate !== undefined && endDate !== null) {
            queryParams['endDate'] = String(endDate);
        }
        // externalDeviceKey: Config'den otomatik doldurulur (ExternalDeviceKey)
        {
            let val = externalDeviceKey;
            if (val === undefined || val === null) {
                val = this.config.externalDeviceKey;
            }
            if (val !== undefined && val !== null) {
                queryParams['externalDeviceKey'] = String(val);
            }
        }
        if (basketReferenceCode !== undefined && basketReferenceCode !== null) {
            queryParams['basketReferenceCode'] = String(basketReferenceCode);
        }

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
        return this.sendRequest<TransactionReport[]>(
            'Get',
            path,
            undefined,
            Object.keys(queryParams).length > 0 ? queryParams : undefined,
            Object.keys(headerParams).length > 0 ? headerParams : undefined,
            baseUrl
        );
    }
}