
/**
 * 
 */

export interface Exemption {
    /**  */
    code?: string;
    /**  */
    description?: string;
}
export const ExemptionValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'code': {
        pattern: /^.{1,}$/,
        message: 'Code formatı geçersiz.',
    },
};

export function createExemption(partial: Partial<Exemption> = {}): Exemption & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        code: partial.code,
        description: partial.description,
    } as any;
    obj.__validationRules = ExemptionValidationRules;
    
    return obj;
}

export function withExemptionMetadata<T extends Exemption>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = ExemptionValidationRules;
    
    return result;
}
