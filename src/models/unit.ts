

/**
 * 
 */
export interface Unit {
    /**  */
    id?: number;
    /**  */
    code?: string;
    /**  */
    name?: string;
    /**  */
    decimal?: boolean;
}

export function createUnit(partial: Partial<Unit> = {}): Unit & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        id: partial.id,
        code: partial.code,
        name: partial.name,
        decimal: partial.decimal,
    } as any;
    
    return obj;
}

export function withUnitMetadata<T extends Unit>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    
    return result;
}
