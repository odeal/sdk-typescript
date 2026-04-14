
import { Product, withProductMetadata } from './product';

/**
 * 
 */
export interface Item {
    /**  */
    quantity: number;
    /**  */
    product: Product;
}
export const ItemValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'quantity': {
        required: true,
        message: 'Quantity formatı geçersiz.',
    },
    'product': {
        required: true,
        message: 'Product formatı geçersiz.',
    },
};

export function createItem(partial: Partial<Item> = {}): Item & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        quantity: partial.quantity,
        product: partial.product,
    } as any;
    obj.__validationRules = ItemValidationRules;
    
    return obj;
}

export function withItemMetadata<T extends Item>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = ItemValidationRules;
    if (result.product) {
        result.product = withProductMetadata(result.product);
    }
    
    return result;
}
