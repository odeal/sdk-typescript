
import { ProfileType } from '../enums/profile-type';

/**
 * 
 */
export interface ProfileUpdateRequest {
    /** Terminalin entegrasyon profil tipini belirtir.
    /// - INTERNAL_BASKET
    /// - EXTERNAL_DEVICE_TO_DEVICE
    /// - EXTERNAL_BASKET_WITH_APP (APP2APP) */
    profileType: ProfileType;
}
export const ProfileUpdateRequestValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'profileType': {
        required: true,
        message: 'ProfileType formatı geçersiz.',
    },
};

export function createProfileUpdateRequest(partial: Partial<ProfileUpdateRequest> = {}): ProfileUpdateRequest & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        profileType: partial.profileType,
    } as any;
    obj.__validationRules = ProfileUpdateRequestValidationRules;
    
    return obj;
}

export function withProfileUpdateRequestMetadata<T extends ProfileUpdateRequest>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = ProfileUpdateRequestValidationRules;
    
    return result;
}
