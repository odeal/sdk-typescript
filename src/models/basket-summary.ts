

/**
 * Sepet listesindeki bir sepetin özeti.
 */
export interface BasketSummary {
    /**  */
    id?: number;
    /**  */
    referenceCode?: string;
    /**  */
    basketAlias?: string;
    /**  */
    basketType?: string;
    /**  */
    status?: string;
    /**  */
    netPrice?: number;
    /**  */
    grossPrice?: number;
    /**  */
    vatPrice?: number;
    /**  */
    sctPrice?: number;
    /**  */
    accPrice?: number;
    /**  */
    customerId?: number;
    /**  */
    deviceId?: number;
    /**  */
    createdDate?: string;
}

export function createBasketSummary(partial: Partial<BasketSummary> = {}): BasketSummary & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        id: partial.id,
        referenceCode: partial.referenceCode,
        basketAlias: partial.basketAlias,
        basketType: partial.basketType,
        status: partial.status,
        netPrice: partial.netPrice,
        grossPrice: partial.grossPrice,
        vatPrice: partial.vatPrice,
        sctPrice: partial.sctPrice,
        accPrice: partial.accPrice,
        customerId: partial.customerId,
        deviceId: partial.deviceId,
        createdDate: partial.createdDate,
    } as any;
    
    return obj;
}

export function withBasketSummaryMetadata<T extends BasketSummary>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
