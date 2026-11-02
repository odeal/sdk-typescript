
import { Product, withProductMetadata } from './product';
import { Allowance, withAllowanceMetadata } from './allowance';

/**
 * 
 */
export interface Item {
    /**  */
    quantity: number;
    /**  */
    product: Product;
    /** İsteğe bağlı. Satıra uygulanan iskontolar (KDV dahil). Belgelenen kapsam: POST /basket; ödeme tipi CASH, CREDITCARD, GIFT veya OPEN_ACCOUNT. Avans ve cari hesap bilgi fişlerinde ürün olmadığı için iskonto uygulanmaz. */
    allowances?: Allowance[];
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
        allowances: partial.allowances ?? [],
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
    if (result.allowances) {
        if (Array.isArray(result.allowances)) {
            result.allowances = result.allowances.map((item: any) => withAllowanceMetadata(item));
        }
    }
    
    return result;
}
