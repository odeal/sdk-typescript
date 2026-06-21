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

import { OdealConfig, OdealLogger, ConsoleOdealLogger, defaultConfig } from './odeal-config';
import { MultipartBody } from './multipart-body';
import {
    OdealApiException, OdealValidationException,
    OdealAuthenticationException, OdealForbiddenException,
    OdealNotFoundException, OdealRateLimitException,
} from './exceptions';
import { sanitizeJson } from './sanitizer';

import { OdealCircuitBreaker, OdealCircuitOpenException } from './circuit-breaker';


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
  
    protected readonly log: OdealLogger;
    
  private readonly AGENT = "OdealSdkTypeScriptClient/2.17.0";
  
    private readonly circuitBreaker?: OdealCircuitBreaker;
    

  constructor(config: OdealConfig) {
    this.config = { ...defaultConfig, ...config };
    
        this.log = this.config.logger ?? new ConsoleOdealLogger();
        
    
    
        if (this.config.circuitBreakerEnabled) {
          this.circuitBreaker = new OdealCircuitBreaker(
            this.config.circuitBreakerThreshold ?? 5,
            this.config.circuitBreakerResetMs ?? 60000
          );
        }
        
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
    protected debugLog(message: string, level: 'debug' | 'info' | 'warn' | 'error' = 'debug'): void {
        
                if (this.config.debugMode || level === 'error' || level === 'warn') {
                    switch (level) {
                        case 'error': this.log.error(message); break;
                        case 'warn':  this.log.warn(message);  break;
                        case 'info':  this.log.info(message);  break;
                        default:      this.log.debug(message);  break;
                    }
                }
                
    }

    /**
     * Body'den internal property'leri temizler (__configMap, __validationRules vb.)
     *
     * @param obj - Temizlenecek obje
     * @returns Temizlenmiş obje
     */
    /**
     * {"result":[...]} sarmalı yanıtı listeye açar; zaten liste/diğer ise olduğu gibi döner.
     * Liste dönen Resource metotları bunu kullanır (C# BaseResource ile aynı davranış).
     */
    protected unwrapList<T>(data: unknown): T {
        if (data !== null && typeof data === 'object' && !Array.isArray(data)
            && 'result' in (data as Record<string, unknown>)) {
            return (data as { result: T }).result;
        }
        return data as T;
    }

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
            let safeValue = value;
            
                        if (this.config.maskSensitiveData && (key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') || key.toLowerCase().includes('authorization'))) {
                            safeValue = '***';
                        }
                        
            parts.push(`-H '${key}: ${safeValue}'`);
        });
        
        // Body
        if (body) {
            let bodyJson = JSON.stringify(body);
            
                        if (this.config.maskSensitiveData) {
                            bodyJson = sanitizeJson(bodyJson) ?? bodyJson;
                        }
                        
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
                    this.debugLog(`Validation Failed: ${errors.join(', ')}`, 'warn');
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

        // 4. Headers — Sadece Content-Type, Accept ve Agent burada tanımlanır.
        // Auth header'lar (X-ODEAL-SECRET-KEY, X-ODEAL-MERCHANT-KEY) swagger-declared
        // params olarak Resource sınıfından headerParams ile gelir.
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-ODEAL-AGENT': this.AGENT,
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

        // OAuth2 / Bearer: accessToken ayarlıysa Authorization header ekle (boşsa eklenmez)
        if (this.config.accessToken) {
            headers['Authorization'] = `Bearer ${this.config.accessToken}`;
        }

        
                // Idempotency Key: POST/PUT/PATCH isteklerinde çift işlem koruması
                if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
                    const headerName = 'X-Odeal-Idempotency-Key';
                    if (!headers[headerName]) {
                        headers[headerName] = typeof crypto !== 'undefined' && crypto.randomUUID
                            ? crypto.randomUUID()
                            : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
                    }
                }
                

        // 5. Body hazırla - internal property'leri temizle
        // multipart/form-data: FormData üret, Content-Type'ı kaldır (fetch boundary'yi kendi ekler).
        let requestBody: any;
        if (body instanceof MultipartBody) {
            requestBody = body.toFormData();
            delete headers['Content-Type'];
        } else {
            requestBody = body ? this.cleanBody(body) : undefined;
        }

        // Debug: curl komutu
        if (this.config.debugMode) {
            this.debugLog(this.buildCurlCommand(method, url, headers, requestBody), 'info');
        }

        // 6. Native fetch with Retry Logic
        let currentTry = 0;
        const maxRetries = this.config.maxRetryCount ?? 0;

        
                // Circuit Breaker Guard
                if (this.circuitBreaker && !this.circuitBreaker.allowRequest()) {
                    throw new OdealCircuitOpenException();
                }
                

        while (true) {
            try {
                
                                // Interceptor: onBeforeRequest
                                if (this.config.interceptors?.length) {
                                    const reqCtx = {
                                        method: method.toUpperCase(),
                                        url,
                                        headers: { ...headers },
                                        body: requestBody,
                                        metadata: {}
                                    };
                                    for (const interceptor of this.config.interceptors) {
                                        await interceptor.onBeforeRequest?.(reqCtx);
                                    }
                                }
                                

                const startTime = Date.now();

                // Timeout with AbortController
                const controller = new AbortController();
                const timeoutMs = this.config.timeout ?? 30000;
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

                const fetchOptions: RequestInit = {
                    method: method.toUpperCase(),
                    headers,
                    signal: controller.signal,
                };
                if (requestBody !== undefined && requestBody !== null) {
                    fetchOptions.body = requestBody instanceof FormData
                        ? requestBody
                        : (typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody));
                }

                const fetchResponse = await fetch(url, fetchOptions);
                clearTimeout(timeoutId);

                // Parse response body
                const responseText = await fetchResponse.text();
                let responseData: unknown;
                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = responseText;
                }

                // Normalize response
                const response = {
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    data: responseData,
                    headers: Object.fromEntries(fetchResponse.headers.entries()) as Record<string, string>,
                };

                const durationMs = Date.now() - startTime;

                
                                // Interceptor: onAfterResponse
                                if (this.config.interceptors?.length) {
                                    const respCtx = {
                                        statusCode: response.status,
                                        headers: response.headers,
                                        body: response.data,
                                        durationMs,
                                        request: { method: method.toUpperCase(), url, headers: { ...headers }, metadata: {} },
                                        metadata: {}
                                    };
                                    for (const interceptor of this.config.interceptors) {
                                        await interceptor.onAfterResponse?.(respCtx);
                                    }
                                }
                                

                if (response.status >= 500 || response.status === 429) {
                    
                                        this.circuitBreaker?.recordFailure();
                                        
                    if (currentTry < maxRetries) {
                        currentTry++;
                        const delayStr = response.headers['retry-after'];
                        const delay = delayStr ? parseInt(delayStr, 10) * 1000 : Math.pow(2, currentTry) * 500;
                        this.debugLog(`Request failed with ${response.status}. Retrying in ${delay}ms. Attempt ${currentTry} of ${maxRetries}.`, 'warn');
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }

                
                                // Devre-kıran: yalnızca 5xx/429 OLMAYAN yanıtlar başarı sayılır. 5xx/429 retry
                                // tükenmişse yukarıda recordFailure yapıldı; burada recordSuccess çağırıp sayacı
                                // sıfırlamamalıyız (aksi halde devre HTTP hatalarında asla açılmaz).
                                if (response.status < 500 && response.status !== 429) {
                                    this.circuitBreaker?.recordSuccess();
                                }
                                

                const respText = typeof responseData === 'string'
                    ? responseData 
                    : JSON.stringify(responseData);

                if (response.status >= 400) {
                    this.debugLog(`HTTP Error ${response.status}: ${respText}`, 'error');
                    // Zengin hata hiyerarşisi: status → spesifik exception tipi
                    switch (response.status) {
                        case 401: throw new OdealAuthenticationException(undefined, respText);
                        case 403: throw new OdealForbiddenException(undefined, respText);
                        case 404: throw new OdealNotFoundException(undefined, respText);
                        case 429: throw new OdealRateLimitException(undefined, respText);
                        default: throw new OdealApiException(`API Error: ${response.status}`, response.status, respText);
                    }
                }

                // Boş yanıt kontrolü
                if (response.status === 204 || !responseData) {
                    this.debugLog(`Response [${response.status}]: (empty)`);
                    return undefined as T;
                }

                this.debugLog(`Response [${response.status}]: ${respText.substring(0, 500)}${respText.length > 500 ? '...' : ''}`);
                return responseData as T;

            } catch (error) {
                if (error instanceof OdealApiException || error instanceof OdealValidationException) {
                    throw error;
                }

                
                                this.circuitBreaker?.recordFailure();
                                

                // Network/Timeout error → retry
                if (currentTry < maxRetries) {
                    currentTry++;
                    const delay = Math.pow(2, currentTry) * 500;
                    this.debugLog(`Network/Timeout error. Retrying in ${delay}ms. Attempt ${currentTry} of ${maxRetries}.`, 'warn');
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                this.debugLog(`Network Error: ${error}`, 'error');
                throw new OdealApiException(
                    `Network hatası: ${error instanceof Error ? error.message : String(error)}`,
                    0
                );
            }
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

}
