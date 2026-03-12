
/**
 * 
 */
import { ProductUnitCode, withProductUnitCodeMetadata } from './product-unit-code';
import { ProductPrice, withProductPriceMetadata } from './product-price';
import { Exemption, withExemptionMetadata } from './exemption';

export interface Product {
    /** Birim Kodları.
    /// - _3I: Kilogram-Adet (C# Uyumu için ön ekli) */
    unitCode: ProductUnitCode;
    /**  */
    name: string;
    /**  */
    referenceCode: string;
    /**  */
    price: ProductPrice;
    /**  */
    exemption?: Exemption;
}
export const ProductValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'unitCode': {
        required: true,
        message: 'UnitCode formatı geçersiz.',
    },
    'name': {
        required: true,
        pattern: /^.{1,255}$/,
        message: 'Ürün adı 1-255 karakter arasında olmalıdır.',
    },
    'referenceCode': {
        required: true,
        pattern: /^.{1,50}$/,
        message: 'Ürün kodu 1-50 karakter arasında olmalıdır.',
    },
    'price': {
        required: true,
        message: 'Price formatı geçersiz.',
    },
};

export function createProduct(partial: Partial<Product> = {}): Product & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        unitCode: partial.unitCode,
        name: partial.name,
        referenceCode: partial.referenceCode,
        price: partial.price,
        exemption: partial.exemption,
    } as any;
    obj.__validationRules = ProductValidationRules;
    
    return obj;
}

export function withProductMetadata<T extends Product>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = ProductValidationRules;
    if (result.unitCode) {
        result.unitCode = withProductUnitCodeMetadata(result.unitCode);
    }
    if (result.price) {
        result.price = withProductPriceMetadata(result.price);
    }
    if (result.exemption) {
        result.exemption = withExemptionMetadata(result.exemption);
    }
    
    return result;
}
