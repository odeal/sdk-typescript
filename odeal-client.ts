/**
 * Odeal SDK Client
 * 
 * @remarks
 * Bu dosya otomatik olarak üretilmiştir. Manuel değişiklik yapmayınız.
 */

import { OdealConfig, defaultConfig } from './odeal-config';
import { OdealApiException, OdealValidationException } from './exceptions';
import { SepetSimpleResource } from './resources/sepet-simple-resource';
import { SepetAvansResource } from './resources/sepet-avans-resource';
import { SepetCariResource } from './resources/sepet-cari-resource';
import { SepetFoodCardResource } from './resources/sepet-food-card-resource';
import { SepetListelemeResource } from './resources/sepet-listeleme-resource';
import { SepetSilmeResource } from './resources/sepet-silme-resource';
import { OdemeResource } from './resources/odeme-resource';
import { KonfigurasyonResource } from './resources/konfigurasyon-resource';
import { BirimlerResource } from './resources/birimler-resource';
import { RaporlamaResource } from './resources/raporlama-resource';
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
    private readonly _sepetSimple: SepetSimpleResource;
    private readonly _sepetAvans: SepetAvansResource;
    private readonly _sepetCari: SepetCariResource;
    private readonly _sepetFoodCard: SepetFoodCardResource;
    private readonly _sepetListeleme: SepetListelemeResource;
    private readonly _sepetSilme: SepetSilmeResource;
    private readonly _odeme: OdemeResource;
    private readonly _konfigurasyon: KonfigurasyonResource;
    private readonly _birimler: BirimlerResource;
    private readonly _raporlama: RaporlamaResource;

    constructor(config: Partial<OdealConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
        this._sepetSimple = new SepetSimpleResource(this.config);
        this._sepetAvans = new SepetAvansResource(this.config);
        this._sepetCari = new SepetCariResource(this.config);
        this._sepetFoodCard = new SepetFoodCardResource(this.config);
        this._sepetListeleme = new SepetListelemeResource(this.config);
        this._sepetSilme = new SepetSilmeResource(this.config);
        this._odeme = new OdemeResource(this.config);
        this._konfigurasyon = new KonfigurasyonResource(this.config);
        this._birimler = new BirimlerResource(this.config);
        this._raporlama = new RaporlamaResource(this.config);
    }

    /**
     * Mevcut yapılandırma ayarlarını alır.
     */
    getConfig(): Readonly<OdealConfig> {
        return this.config;
    }

    /**
     * SepetSimple resource'una erişim sağlar.
     */
    get sepetSimple(): SepetSimpleResource {
        return this._sepetSimple;
    }

    /**
     * SepetAvans resource'una erişim sağlar.
     */
    get sepetAvans(): SepetAvansResource {
        return this._sepetAvans;
    }

    /**
     * SepetCari resource'una erişim sağlar.
     */
    get sepetCari(): SepetCariResource {
        return this._sepetCari;
    }

    /**
     * SepetFoodCard resource'una erişim sağlar.
     */
    get sepetFoodCard(): SepetFoodCardResource {
        return this._sepetFoodCard;
    }

    /**
     * SepetListeleme resource'una erişim sağlar.
     */
    get sepetListeleme(): SepetListelemeResource {
        return this._sepetListeleme;
    }

    /**
     * SepetSilme resource'una erişim sağlar.
     */
    get sepetSilme(): SepetSilmeResource {
        return this._sepetSilme;
    }

    /**
     * Odeme resource'una erişim sağlar.
     */
    get odeme(): OdemeResource {
        return this._odeme;
    }

    /**
     * Konfigurasyon resource'una erişim sağlar.
     */
    get konfigurasyon(): KonfigurasyonResource {
        return this._konfigurasyon;
    }

    /**
     * Birimler resource'una erişim sağlar.
     */
    get birimler(): BirimlerResource {
        return this._birimler;
    }

    /**
     * Raporlama resource'una erişim sağlar.
     */
    get raporlama(): RaporlamaResource {
        return this._raporlama;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // SEPETSIMPLE
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
        return this._sepetSimple.createSimpleBasket(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // SEPETAVANS
    // ───────────────────────────────────────────────────────────────────────────

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
        return this._sepetAvans.createAdvanceBasket(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // SEPETCARI
    // ───────────────────────────────────────────────────────────────────────────

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
        return this._sepetCari.createCurrentAccountBasket(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // SEPETFOODCARD
    // ───────────────────────────────────────────────────────────────────────────

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
        return this._sepetFoodCard.createFoodCardBasket(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // SEPETLISTELEME
    // ───────────────────────────────────────────────────────────────────────────

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
        return this._sepetListeleme.listBaskets(options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // SEPETSILME
    // ───────────────────────────────────────────────────────────────────────────

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
        return this._sepetSilme.deleteBasket(referenceCode, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // ODEME
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
        return this._odeme.cancelPayment(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // KONFIGURASYON
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
        return this._konfigurasyon.saveConfiguration(request, options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // BIRIMLER
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
        return this._birimler.listUnits(options, baseUrl);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // RAPORLAMA
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
        return this._raporlama.getTransactionReport(beginDate, endDate, externalDeviceKey, basketReferenceCode, options, baseUrl);
    }
}