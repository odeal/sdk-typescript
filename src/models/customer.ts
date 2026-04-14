
import { CustomerType } from '../enums/customer-type';

/**
 * 
 */
export interface Customer {
    /** Opsiyonel. Müşterinin kendi referans kodu. */
    referenceCode?: string;
    /** Müşteri Tipi. Default: INDIVIDUAL. */
    type?: CustomerType;
    /**  */
    name?: string;
    /**  */
    surname?: string;
    /**  */
    identityNumber?: string;
    /**  */
    title?: string;
    /**  */
    taxNumber?: string;
    /**  */
    taxOffice?: string;
    /**  */
    city: string;
    /**  */
    town: string;
    /**  */
    gsmNumber?: string;
    /**  */
    email?: string;
    /**  */
    address?: string;
}
export const CustomerValidationRules: Record<string, { required?: boolean; pattern?: RegExp; message?: string }> = {
    'referenceCode': {
        pattern: /^.{0,50}$/,
        message: 'ReferenceCode formatı geçersiz.',
    },
    'name': {
        pattern: /^.{0,100}$/,
        message: 'Name formatı geçersiz.',
    },
    'surname': {
        pattern: /^.{0,100}$/,
        message: 'Surname formatı geçersiz.',
    },
    'identityNumber': {
        pattern: /^[1-9]\d{10}$/,
        message: 'TCKN 11 haneli olmalı.',
    },
    'title': {
        pattern: /^.{0,255}$/,
        message: 'Title formatı geçersiz.',
    },
    'taxNumber': {
        pattern: /^\d{10}$/,
        message: 'VKN 10 haneli olmalı.',
    },
    'taxOffice': {
        pattern: /^.{0,100}$/,
        message: 'TaxOffice formatı geçersiz.',
    },
    'city': {
        required: true,
        pattern: /^.{1,50}$/,
        message: 'City formatı geçersiz.',
    },
    'town': {
        required: true,
        pattern: /^.{1,50}$/,
        message: 'Town formatı geçersiz.',
    },
    'gsmNumber': {
        pattern: /^[1-9][0-9]{9}$/,
        message: 'GSM No başında 0 olmadan 10 hane olmalıdır.',
    },
    'email': {
        pattern: /^.{0,100}$/,
        message: 'Email formatı geçersiz.',
    },
    'address': {
        pattern: /^.{0,500}$/,
        message: 'Address formatı geçersiz.',
    },
};

export function createCustomer(partial: Partial<Customer> = {}): Customer & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const obj = {
        referenceCode: partial.referenceCode,
        type: partial.type,
        name: partial.name,
        surname: partial.surname,
        identityNumber: partial.identityNumber,
        title: partial.title,
        taxNumber: partial.taxNumber,
        taxOffice: partial.taxOffice,
        city: partial.city,
        town: partial.town,
        gsmNumber: partial.gsmNumber,
        email: partial.email,
        address: partial.address,
    } as any;
    obj.__validationRules = CustomerValidationRules;
    
    return obj;
}

export function withCustomerMetadata<T extends Customer>(obj: T): T & { __configMap?: Record<string, string>; __validationRules?: Record<string, unknown> } {
    const result = obj as any;
    result.__validationRules = CustomerValidationRules;
    
    return result;
}
