

/**
 * 
 */
export interface ProfileDetailsResponse {
    /** Profil kaydının benzersiz ID'si */
    id?: number;
    /** İş yeri organizasyon ID'si */
    organisationId?: number;
    /** Gizli anahtar */
    secretKey?: string;
    /** İş yeri anahtarı */
    apiKey?: string;
    /** İzinli IP adresi/listesi */
    ipList?: string;
    /** Terminalin entegrasyon profil tipini belirtir.
    /// - INTERNAL_BASKET
    /// - EXTERNAL_DEVICE_TO_DEVICE
    /// - EXTERNAL_BASKET_WITH_APP (APP2APP)
    /// Metin olarak okunur: dokümanda olmayan bir tip de dönebilir. */
    profileType?: string;
    /** Terminal ID (atanmamışsa null) */
    terminalId?: number;
}

export function createProfileDetailsResponse(partial: Partial<ProfileDetailsResponse> = {}): ProfileDetailsResponse & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        id: partial.id,
        organisationId: partial.organisationId,
        secretKey: partial.secretKey,
        apiKey: partial.apiKey,
        ipList: partial.ipList,
        profileType: partial.profileType,
        terminalId: partial.terminalId,
    } as any;
    
    return obj;
}

export function withProfileDetailsResponseMetadata<T extends ProfileDetailsResponse>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
