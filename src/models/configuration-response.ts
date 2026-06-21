

/**
 * Konfigürasyon bilgisi.
 */
export interface ConfigurationResponse {
    /**  */
    ecommerceUrl?: string;
    /**  */
    basketUrl?: string;
    /**  */
    paymentSucceededUrl?: string;
    /**  */
    paymentCancelledUrl?: string;
    /**  */
    paymentFailedUrl?: string;
    /**  */
    einvoiceCreatedUrl?: string;
    /**  */
    einvoiceCancelledUrl?: string;
    /**  */
    callbackPayoutUrl?: string;
    /**  */
    basketCancelledUrl?: string;
    /**  */
    basketProcessFailedUrl?: string;
    /**  */
    einvoiceIntegrator?: string;
    /**  */
    basketType?: string;
    /**  */
    odealRequestKey?: string;
    /**  */
    customerGetUrl?: string;
    /**  */
    customerPostUrl?: string;
    /**  */
    customerPutUrl?: string;
    /**  */
    intentUrl?: string;
    /**  */
    appName?: string;
    /**  */
    closeAfterPayment?: boolean;
    /**  */
    authorizationType?: string;
    /**  */
    basicAuthUsername?: string;
    /**  */
    basicAuthPassword?: string;
    /**  */
    terminalId?: string;
}

export function createConfigurationResponse(partial: Partial<ConfigurationResponse> = {}): ConfigurationResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        ecommerceUrl: partial.ecommerceUrl,
        basketUrl: partial.basketUrl,
        paymentSucceededUrl: partial.paymentSucceededUrl,
        paymentCancelledUrl: partial.paymentCancelledUrl,
        paymentFailedUrl: partial.paymentFailedUrl,
        einvoiceCreatedUrl: partial.einvoiceCreatedUrl,
        einvoiceCancelledUrl: partial.einvoiceCancelledUrl,
        callbackPayoutUrl: partial.callbackPayoutUrl,
        basketCancelledUrl: partial.basketCancelledUrl,
        basketProcessFailedUrl: partial.basketProcessFailedUrl,
        einvoiceIntegrator: partial.einvoiceIntegrator,
        basketType: partial.basketType,
        odealRequestKey: partial.odealRequestKey,
        customerGetUrl: partial.customerGetUrl,
        customerPostUrl: partial.customerPostUrl,
        customerPutUrl: partial.customerPutUrl,
        intentUrl: partial.intentUrl,
        appName: partial.appName,
        closeAfterPayment: partial.closeAfterPayment,
        authorizationType: partial.authorizationType,
        basicAuthUsername: partial.basicAuthUsername,
        basicAuthPassword: partial.basicAuthPassword,
        terminalId: partial.terminalId,
    } as any;
    
    return obj;
}

export function withConfigurationResponseMetadata<T extends ConfigurationResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
