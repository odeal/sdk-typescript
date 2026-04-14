

/**
 * 
 */
export interface ConfigurationRequest {
    /**  */
    eCommerceUrl?: string;
    /** Sepet bilgisinin alınacağı URL (external-basket için). */
    basketUrl?: string;
    /** Ödeme başarılı bildirimi için URL. */
    paymentSucceededUrl?: string;
    /** Ödeme başarısız bildirimi için URL. */
    paymentFailedUrl?: string;
    /** İptal bildirimi için URL. */
    paymentCancelledUrl?: string;
    /**  */
    eInvoiceCreatedUrl?: string;
    /**  */
    eInvoiceIntegrator?: string;
    /** Webhook isteklerinde güvenlik için X-ODEAL-REQUEST-KEY olarak gönderilir. */
    odealRequestKey?: string;
}

export function createConfigurationRequest(partial: Partial<ConfigurationRequest> = {}): ConfigurationRequest & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        eCommerceUrl: partial.eCommerceUrl,
        basketUrl: partial.basketUrl,
        paymentSucceededUrl: partial.paymentSucceededUrl,
        paymentFailedUrl: partial.paymentFailedUrl,
        paymentCancelledUrl: partial.paymentCancelledUrl,
        eInvoiceCreatedUrl: partial.eInvoiceCreatedUrl,
        eInvoiceIntegrator: partial.eInvoiceIntegrator,
        odealRequestKey: partial.odealRequestKey,
    } as any;
    
    return obj;
}

export function withConfigurationRequestMetadata<T extends ConfigurationRequest>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
