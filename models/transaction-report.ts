
/**
 * 
 */

export interface TransactionReport {
    /**  */
    basketReferenceCode?: string;
    /**  */
    paymentId?: string;
    /**  */
    currentStatus?: string;
    /**  */
    amount?: string;
    /**  */
    invoiceNumber?: string;
    /**  */
    invoicePdfUrl?: string;
    /**  */
    basketStatus?: string;
    /**  */
    invoiceGibStatusCode?: number;
}

export function createTransactionReport(partial: Partial<TransactionReport> = {}): TransactionReport & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        basketReferenceCode: partial.basketReferenceCode,
        paymentId: partial.paymentId,
        currentStatus: partial.currentStatus,
        amount: partial.amount,
        invoiceNumber: partial.invoiceNumber,
        invoicePdfUrl: partial.invoicePdfUrl,
        basketStatus: partial.basketStatus,
        invoiceGibStatusCode: partial.invoiceGibStatusCode,
    } as any;
    
    return obj;
}

export function withTransactionReportMetadata<T extends TransactionReport>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
