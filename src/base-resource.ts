/**
 * Odeal SDK Base Resource Modülü
 *
 * @remarks
 * Bu modül, tüm API resource sınıflarının türediği temel sınıfı içerir.
 * HTTP isteklerini yönetir, validation yapar ve ortak işlevsellik sağlar.
 *
 * NOT: API header'ları (X-ODEAL-SECRET-KEY vb.) bu dosyada hardcoded DEĞİLDİR.
 * Tüm header'lar swagger.json'dan parse edilip Resource sınıflarında otomatik oluşturulur.
 */

import { OdealConfig, defaultConfig } from './odeal-config';
import { OdealApiException, OdealValidationException } from './exceptions';

/**
 * Validation kuralları tipi.
 */
export interface ValidationRule {
    required?: boolean;
    pattern?: RegExp;
    message?: string;
}

/**
 * Validation kuralları map tipi.
 */
export type ValidationRules = Record<string, ValidationRule>;

/**
 * Config map tipi (model alanı -> config property).
 */
export type ConfigMap = Record<string, string>;

/**
 * Tüm API resource sınıflarının türediği temel sınıf.
 *
 * @remarks
 * HTTP isteklerinin gönderilmesi, yanıtların işlenmesi, validation
 * ve hata yönetimi gibi temel işlevleri içerir.
 */
export abstract class BaseResource {
  protected readonly config: OdealConfig;
  private readonly AGENT = "OdealSdkTypeScriptClient/2.1.29";

  constructor(config: OdealConfig) {
    this.config = { ...defaultConfig, ...config };
  }

    /**
     * Model üzerindeki config map'e göre boş alanları config'den doldurur.
     * Nested object'leri de recursive olarak işler.
     *
     * @param obj - Doldurulacak model objesi
     * @param configMap - Alan-config property eşleştirmesi
     */
    protected fillConfigDefaults<T extends Record<string, unknown>>(
        obj: T,
        configMap?: ConfigMap
    ): void {
        if (!obj || !configMap) return;

        for (const [fieldName, configKey] of Object.entries(configMap)) {
            const currentValue = obj[fieldName];
            
            // Eğer alan boş veya undefined ise config'den doldur
            if (currentValue === undefined || currentValue === null || currentValue === '') {
                // TypeScript strict mode için double cast gerekli
                const configValue = (this.config as unknown as Record<string, unknown>)[configKey];
                if (configValue !== undefined && configValue !== null) {
                    (obj as Record<string, unknown>)[fieldName] = configValue;
                }
            }
        }
    }

    /**
     * Model üzerindeki validation kurallarını kontrol eder.
     * Nested object ve array'leri de recursive olarak validate eder.
     *
     * @param obj - Validate edilecek model objesi
     * @param rules - Validation kuralları
     * @param path - Nested path (hata mesajları için)
     * @returns Hata mesajları listesi (boş = geçerli)
     */
    protected validateModel(
        obj: Record<string, unknown>,
        rules?: ValidationRules,
        path: string = ''
    ): string[] {
        const errors: string[] = [];
        if (!obj || !rules) return errors;

        for (const [fieldName, rule] of Object.entries(rules)) {
            const value = obj[fieldName];
            const fullPath = path ? `${path}.${fieldName}` : fieldName;

            // Required kontrolü
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(rule.message || `${fullPath} alanı zorunludur.`);
                continue;
            }

            // Pattern kontrolü (sadece değer varsa)
            if (rule.pattern && value !== undefined && value !== null && value !== '') {
                if (!rule.pattern.test(String(value))) {
                    errors.push(rule.message || `${fullPath} formatı geçersiz.`);
                }
            }
        }

        // Nested object validation
        for (const [key, value] of Object.entries(obj)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const nestedRules = (value as Record<string, unknown>).__validationRules as ValidationRules | undefined;
                if (nestedRules) {
                    const nestedErrors = this.validateModel(
                        value as Record<string, unknown>,
                        nestedRules,
                        path ? `${path}.${key}` : key
                    );
                    errors.push(...nestedErrors);
                }
            }
            
            // Array içindeki object'leri validate et
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (item && typeof item === 'object') {
                        const itemRules = (item as Record<string, unknown>).__validationRules as ValidationRules | undefined;
                        if (itemRules) {
                            const itemErrors = this.validateModel(
                                item as Record<string, unknown>,
                                itemRules,
                                `${path ? `${path}.` : ''}${key}[${index}]`
                            );
                            errors.push(...itemErrors);
                        }
                    }
                });
            }
        }

        return errors;
    }

    /**
     * Debug log yazar (debug mode aktifse).
     *
     * @param message - Log mesajı
     */
    protected debugLog(message: string): void {
        if (this.config.debugMode) {
            console.log(`[DEBUG] ${message}`);
        }
    }

    /**
     * Body'den internal property'leri temizler (__configMap, __validationRules vb.)
     *
     * @param obj - Temizlenecek obje
     * @returns Temizlenmiş obje
     */
    private cleanBody(obj: unknown): unknown {
        if (obj === null || obj === undefined) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.cleanBody(item));
        }

        if (typeof obj === 'object') {
            const cleaned: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
                // Internal property'leri atla
                if (key.startsWith('__')) {
                    continue;
                }
                cleaned[key] = this.cleanBody(value);
            }
            return cleaned;
        }

        return obj;
    }

    /**
     * Curl komutu oluşturur (debug için).
     */
    private buildCurlCommand(
        method: string,
        url: string,
        headers: Record<string, string>,
        body?: unknown
    ): string {
        const parts = [`curl -X ${method.toUpperCase()}`];
        parts.push(`'${url}'`);
        
        // Headers
        Object.entries(headers).forEach(([key, value]) => {
            parts.push(`-H '${key}: ${value}'`);
        });
        
        // Body
        if (body) {
            const bodyJson = JSON.stringify(body);
            // Windows uyumlu escape
            const escapedBody = bodyJson.replace(/'/g, "'\\''");
            parts.push(`-d '${escapedBody}'`);
        }
        
        return parts.join(' \
  ');
    }

    /**
     * HTTP isteği gönderir.
     *
     * @param method - HTTP metodu
     * @param path - API endpoint yolu
     * @param body - İstek gövdesi (opsiyonel)
     * @param queryParams - Query string parametreleri (opsiyonel)
     * @param headerParams - Swagger'dan gelen header parametreleri (X-ODEAL-SECRET-KEY vb.)
     * @param overrideBaseUrl - Alternatif base URL (opsiyonel)
     * @returns API yanıtı
     *
     * @remarks
     * headerParams parametresi Resource sınıflarından gelir ve swagger.json'daki
     * header parametrelerini içerir. BaseResource'da hardcoded header YOKTUR.
     */
    protected async sendRequest<T>(
        method: string,
        path: string,
        body?: unknown,
        queryParams?: Record<string, string>,
        headerParams?: Record<string, string>,
        overrideBaseUrl?: string
    ): Promise<T> {
        // Dinamik axios import (ESM/CJS uyumlu)
        const axios = await this.getAxios();

        // 1. Config defaults doldur (eğer body bir object ise)
        if (body && typeof body === 'object') {
            const bodyObj = body as Record<string, unknown>;
            const configMap = bodyObj.__configMap as ConfigMap | undefined;
            if (configMap) {
                this.fillConfigDefaults(bodyObj, configMap);
            }

            // Nested object'lerde de config defaults doldur
            this.fillNestedConfigDefaults(bodyObj);
        }

        // 2. Client-side Validation
        if (body && typeof body === 'object' && !this.config.skipClientValidation) {
            const bodyObj = body as Record<string, unknown>;
            const validationRules = bodyObj.__validationRules as ValidationRules | undefined;
            if (validationRules) {
                const errors = this.validateModel(bodyObj, validationRules);
                if (errors.length > 0) {
                    this.debugLog(`Validation Failed: ${errors.join(', ')}`);
                    throw new OdealValidationException(
                        `Validation hatası: ${errors.join('; ')}`,
                        errors
                    );
                }
            }
        }

        // 3. URL oluştur
        const baseUrl = (overrideBaseUrl || this.config.baseUrl).replace(/\/$/, '');
        let url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;

        // Query params ekle
        if (queryParams && Object.keys(queryParams).length > 0) {
            const cleanParams = Object.entries(queryParams)
                .filter(([_, v]) => v !== undefined && v !== null)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                .join('&');
            if (cleanParams) {
                url += (url.includes('?') ? '&' : '?') + cleanParams;
            }
        }

        // 4. Headers - Sadece Content-Type ve Accept burada tanımlanır
        // API spesifik header'lar (X-ODEAL-SECRET-KEY vb.) headerParams'tan gelir
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-ODEAL-AGENT': this.AGENT,
      'X-ODEAL-SECRET-KEY': this.config.secretKey || '',
      'X-ODEAL-MERCHANT-KEY': this.config.merchantKey || '',
    };

        // Swagger'dan gelen header parametreleri (Resource sınıfından)
        // X-ODEAL-SECRET-KEY, X-ODEAL-MERCHANT-KEY, X-ODEAL-AGENT vb.
        if (headerParams) {
            Object.entries(headerParams).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') {
                    headers[k] = v;
                }
            });
        }

        // Agent header'ını her zaman ez (Kullanıcı değiştiremesin)
        headers['X-ODEAL-AGENT'] = this.AGENT;

        // 5. Body hazırla - internal property'leri temizle
        const requestBody = body ? this.cleanBody(body) : undefined;

        // Debug: curl komutu
        if (this.config.debugMode) {
            console.log(`[DEBUG] ${this.buildCurlCommand(method, url, headers, requestBody)}`);
        }

        // 6. Axios request
        try {
            const response = await axios({
                method: method.toUpperCase(),
                url,
                headers,
                data: requestBody,
                validateStatus: () => true, // Tüm status kodlarını kabul et
            });

            const responseData = response.data;
            const responseText = typeof responseData === 'string' 
                ? responseData 
                : JSON.stringify(responseData);

            if (response.status >= 400) {
                this.debugLog(`HTTP Error ${response.status}: ${responseText}`);
                throw new OdealApiException(
                    `API isteği başarısız: ${response.statusText}`,
                    response.status,
                    responseText
                );
            }

            // Boş yanıt kontrolü
            if (response.status === 204 || !responseData) {
                this.debugLog(`Response [${response.status}]: (empty)`);
                return undefined as T;
            }

            this.debugLog(`Response [${response.status}]: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
            return responseData as T;

        } catch (error) {
            if (error instanceof OdealApiException || error instanceof OdealValidationException) {
                throw error;
            }
            
            // Axios error handling
            if (this.isAxiosError(error)) {
                const axiosError = error as { response?: { status: number; data: unknown }; message: string };
                if (axiosError.response) {
                    const responseText = typeof axiosError.response.data === 'string'
                        ? axiosError.response.data
                        : JSON.stringify(axiosError.response.data);
                    throw new OdealApiException(
                        `API isteği başarısız`,
                        axiosError.response.status,
                        responseText
                    );
                }
            }
            
            this.debugLog(`Network Error: ${error}`);
            throw new OdealApiException(
                `Network hatası: ${error instanceof Error ? error.message : String(error)}`,
                0
            );
        }
    }

    /**
     * Nested object'lerde config defaults doldurur.
     */
    private fillNestedConfigDefaults(obj: Record<string, unknown>): void {
        for (const value of Object.values(obj)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const nestedObj = value as Record<string, unknown>;
                const configMap = nestedObj.__configMap as ConfigMap | undefined;
                if (configMap) {
                    this.fillConfigDefaults(nestedObj, configMap);
                }
                this.fillNestedConfigDefaults(nestedObj);
            }
            
            // Array içindeki object'ler
            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item && typeof item === 'object') {
                        const itemObj = item as Record<string, unknown>;
                        const configMap = itemObj.__configMap as ConfigMap | undefined;
                        if (configMap) {
                            this.fillConfigDefaults(itemObj, configMap);
                        }
                        this.fillNestedConfigDefaults(itemObj);
                    }
                });
            }
        }
    }

    /**
     * Axios error kontrolü.
     */
    private isAxiosError(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'isAxiosError' in error &&
            (error as { isAxiosError: boolean }).isAxiosError === true
        );
    }

    /**
     * Axios instance'ı döner (ESM/CJS uyumlu dinamik import).
     */
    private async getAxios() {
        try {
            // ESM import
            const axiosModule = await import('axios');
            return axiosModule.default || axiosModule;
        } catch {
            // Fallback - require (CJS)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require('axios');
        }
    }
}
