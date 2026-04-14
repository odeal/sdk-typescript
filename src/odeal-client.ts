/**
 * Odeal SDK Client
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

import { OdealConfig, defaultConfig } from './odeal-config';
import { OdealApiException, OdealValidationException } from './exceptions';
import { BasketResource } from './resources/basket-resource';
import { PaymentResource } from './resources/payment-resource';
import { ConfigurationResource } from './resources/configuration-resource';
import { UnitResource } from './resources/unit-resource';
import { ReportResource } from './resources/report-resource';
import {
    BasketRequest,
    BasketResponse,
    BasketRequestAdvance,
    BasketRequestCurrentAccount,
    BasketRequestFoodCard,
    BasketListResponse,
    ConfigurationRequest,
    Unit,
    TransactionReport,
} from './models';

/**
 * Odeal SDK ana client sınıfı.
 */
export class OdealClient {
    private readonly config: OdealConfig;
    private readonly _basket: BasketResource;
    private readonly _payment: PaymentResource;
    private readonly _configuration: ConfigurationResource;
    private readonly _unit: UnitResource;
    private readonly _report: ReportResource;

    constructor(config: Partial<OdealConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
        this._basket = new BasketResource(this.config);
        this._payment = new PaymentResource(this.config);
        this._configuration = new ConfigurationResource(this.config);
        this._unit = new UnitResource(this.config);
        this._report = new ReportResource(this.config);
    }

    /**
     * Mevcut yapılandırma ayarlarını alır.
     */
    getConfig(): Readonly<OdealConfig> {
        return this.config;
    }

    /**
     * Basket resource'una erişim sağlar.
     */
    get basket(): BasketResource {
        return this._basket;
    }

    /**
     * Payment resource'una erişim sağlar.
     */
    get payment(): PaymentResource {
        return this._payment;
    }

    /**
     * Configuration resource'una erişim sağlar.
     */
    get configuration(): ConfigurationResource {
        return this._configuration;
    }

    /**
     * Unit resource'una erişim sağlar.
     */
    get unit(): UnitResource {
        return this._unit;
    }

    /**
     * Report resource'una erişim sağlar.
     */
    get report(): ReportResource {
        return this._report;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // BASKET
    // ───────────────────────────────────────────────────────────────────────────

    /**
     * Standart ürün satışı. Müşteri Bireysel veya Kurumsal olabilir. 'items' alanı zorunludur.
     */
    async createSimpleBasket(
        request: BasketRequest,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketResponse> {
        return this._basket.createSimpleBasket(request, options, baseUrl);
    }

    /**
     * Avans tahsilatı. Müşteri Bireysel veya Kurumsal olabilir. 'items' gönderilmez. `basketType` ADVANCE olmalıdır.
     */
    async createAdvanceBasket(
        request: BasketRequestAdvance,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketResponse> {
        return this._basket.createAdvanceBasket(request, options, baseUrl);
    }

    /**
     * Cari hesap tahsilatı. Müşteri Kurumsal olmalıdır. `basketType` CURRENT_ACCOUNT olmalıdır.
     */
    async createCurrentAccountBasket(
        request: BasketRequestCurrentAccount,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketResponse> {
        return this._basket.createCurrentAccountBasket(request, options, baseUrl);
    }

    /**
     * Yemek kartı işlemleri. `receiptInfo` ve içindeki `foodCardBrandId` zorunludur.
     */
    async createFoodCardBasket(
        request: BasketRequestFoodCard,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketResponse> {
        return this._basket.createFoodCardBasket(request, options, baseUrl);
    }

    /**
     * Sepet Listele
     */
    async listBaskets(
        options?: {
            secretKey?: string;
            merchantKey?: string;
            externalDeviceKey?: string;
        },
        baseUrl?: string,
    ): Promise<BasketListResponse> {
        return this._basket.listBaskets(options, baseUrl);
    }

    /**
     * Sepet Sil
     */
    async deleteBasket(
        referenceCode: string,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<void> {
        return this._basket.deleteBasket(referenceCode, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PAYMENT
    // ───────────────────────────────────────────────────────────────────────────

    /**
     * Ödeme İptali
     */
    async cancelPayment(
        request: any,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<any> {
        return this._payment.cancelPayment(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // CONFIGURATION
    // ───────────────────────────────────────────────────────────────────────────

    /**
     * Konfigürasyon Kaydet
     */
    async saveConfiguration(
        request: ConfigurationRequest,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<void> {
        return this._configuration.saveConfiguration(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // UNIT
    // ───────────────────────────────────────────────────────────────────────────

    /**
     * Birimleri Listele
     */
    async listUnits(
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<Unit[]> {
        return this._unit.listUnits(options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // REPORT
    // ───────────────────────────────────────────────────────────────────────────

    /**
     * İşlem Raporu
     */
    async getTransactionReport(
        beginDate: string,
        endDate: string,
        externalDeviceKey?: string,
        basketReferenceCode?: string,
        options?: {
            secretKey?: string;
            merchantKey?: string;
        },
        baseUrl?: string,
    ): Promise<TransactionReport[]> {
        return this._report.getTransactionReport(beginDate, endDate, externalDeviceKey, basketReferenceCode, options, baseUrl);
    }
}