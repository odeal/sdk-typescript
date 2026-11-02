/**
 * İskontolu sepet yardımcıları: ara toplam iskontosunu satırlara dağıtır ve sepet özetindeki `totalAllowance` ile
 * `paidAmount` alanlarını yazar.
 *
 * Kurallar entegrasyon dokümanındaki "İskontolu Sepet Aktar" sayfasından gelir: tutarlar KDV dahildir; ara toplam
 * iskontosu satırların KDV dahil tutarlarına oranla dağıtılır, her pay 2 haneye yuvarlanır ve kalan kuruş son satıra
 * verilir; sepette SUB iskonto varsa her satırda bulunmalıdır; iskonto sonrası sepet toplamı 1 TL'den az olamaz.
 * Hesap kuruş üzerinden tam sayıyla yapılır.
 * Yalnız tutar bazlı iskontolar (`isRateBased: false`) desteklenir; oran bazlı iskontonun tutarını Ödeal hesaplar.
 * Hata olursa hiçbir alan değişmez. Ödeme seçenekleri değiştirilmez: `paymentOptions` toplamı `paidAmount`
 * olmalıdır.
 *
 * @example
 * ```typescript
 * import { OdealAllowances } from '@odeal/sdk';
 *
 * const price = { grossPrice: 405.00 };
 * OdealAllowances.applySubtotalAllowance(price, items, 40.00);
 * // Satırlar: SUB 23,70 / 10,37 / 5,93. price.totalAllowance = 40, price.paidAmount = 365
 * ```
 */

import type { Allowance, BasketPrice, Item } from './models';
import { AllowanceSubType } from './enums/allowance-sub-type';
import { OdealValidationException } from './exceptions';

const PREFIX = 'İskonto: ';
// Backend'de order 32 bit tam sayıdır.
const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;

export class OdealAllowances {
    /**
     * Ara toplam iskontosunu (KDV dahil) satırlara dağıtır: her satıra bir SUB iskonto ekler, sonra sepet özetini
     * {@link OdealAllowances.applyAllowanceTotals} ile aynı kuralla yazar. Her çağrı her satıra yeni bir SUB iskonto
     * ekler. Her satır ayrı bir `Item` nesnesi olmalıdır. Satırın `allowances` dizisi, eklenen iskontoyla birlikte yeni
     * bir diziyle değiştirilir. Eklenen iskontonun sırası satırdaki en büyük `order` (yoksa 0) + 1'dir; mevcut `order`
     * değerleri 32 bit tam sayı olmalıdır.
     *
     * @param price - Sepet özeti; `grossPrice` sepetin iskontosuz, KDV dahil toplamıdır.
     * @param items - Sepet satırları.
     * @param amount - Ara toplam iskontosu (TL, KDV dahil, en çok 2 ondalık).
     * @throws {@link OdealValidationException} Girdi kurallara uymuyorsa. Hiçbir alan değişmez.
     */
    static applySubtotalAllowance(price: BasketPrice, items: Item[], amount: number): void {
        if (price === null || price === undefined) throw fail('price (sepet özeti) zorunludur.');
        if (!Array.isArray(items) || items.length === 0) throw fail('items boş olamaz.');
        if (typeof amount !== 'number' || !(amount > 0) || !Number.isFinite(amount)) {
            throw fail('tutar sıfırdan büyük olmalıdır.');
        }
        if (!hasAtMostTwoDecimals(amount)) throw fail('tutar en çok 2 ondalık basamak içermelidir.');
        const amountCents = cents(amount);

        const bases: number[] = new Array(items.length);
        const orders: number[] = new Array(items.length);
        const seen = new Map<Item, number>();
        let totalBase = 0;
        let existingTotal = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const n = i + 1;
            const gross = item?.product?.price?.grossPrice;
            const quantity = item?.quantity;
            if (typeof gross !== 'number' || !Number.isFinite(gross) || typeof quantity !== 'number' || !(quantity > 0)) {
                throw fail(`satır ${n} için ürün, birim fiyat ya da adet eksik.`);
            }
            // Aynı nesne iki satırda olursa eklenen iskonto iki satıra birden yazılır ve gövde özetle ayrışır.
            const first = seen.get(item);
            if (first !== undefined) {
                throw fail(`satır ${n}, satır ${first} ile aynı Item nesnesi; her satır ayrı bir nesne olmalıdır.`);
            }
            seen.set(item, n);
            const existing = sumAmountCents(item, n).sum;
            orders[i] = nextOrder(item, n);
            const lineBase = quantity * gross - existing / 100;
            if (!(lineBase > 0)) {
                throw fail(`satır ${n} için iskonto uygulanabilecek tutar kalmadı; SUB iskonto her satırda bulunmalıdır.`);
            }
            bases[i] = lineBase;
            totalBase += lineBase;
            existingTotal += existing;
        }
        if (amountCents / 100 > totalBase) throw fail('tutar, iskonto uygulanabilecek toplamı aşıyor.');

        const shares: number[] = new Array(items.length);
        let assigned = 0;
        for (let i = 0; i < items.length - 1; i++) {
            shares[i] = Math.floor(amountCents * bases[i] / totalBase + 0.5);
            assigned += shares[i];
        }
        shares[items.length - 1] = amountCents - assigned;
        for (let i = 0; i < items.length; i++) {
            const n = i + 1;
            if (shares[i] < 1) {
                throw fail(`satır ${n} payı 0,01 TL'den küçük kalıyor; SUB iskonto her satırda pozitif olmalıdır.`);
            }
            if (shares[i] > bases[i] * 100 + 1e-6) throw fail(`satır ${n} payı satır tutarını aşıyor.`);
        }

        // Toplamlar yazmadan önce hesaplanır; hata olursa hiçbir alan değişmez.
        const totals = computeTotals(price, existingTotal + amountCents);

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const added: Allowance = {
                price: shares[i] / 100,
                isRateBased: false,
                subType: AllowanceSubType.SUB,
                order: orders[i],
            };
            // Dizi kopyalanır: satırlar aynı diziyi paylaşsa da her satır yalnız kendi payını alır.
            item.allowances = [...(Array.isArray(item.allowances) ? item.allowances : []), added];
        }
        price.totalAllowance = totals.total;
        price.paidAmount = totals.paid;
    }

    /**
     * Sepet özetindeki `totalAllowance` (satır iskontolarının toplamı) ve `paidAmount` (`grossPrice − totalAllowance`)
     * alanlarını satırlardaki tutar bazlı iskontolardan yazar. Hiçbir satırda iskonto yoksa hiçbir alana dokunmaz.
     *
     * @param price - Sepet özeti.
     * @param items - Sepet satırları.
     * @throws {@link OdealValidationException} Girdi kurallara uymuyorsa. Hiçbir alan değişmez.
     */
    static applyAllowanceTotals(price: BasketPrice, items: Item[]): void {
        if (price === null || price === undefined) throw fail('price (sepet özeti) zorunludur.');
        if (items === null || items === undefined) return;
        let sum = 0;
        let count = 0;
        for (let i = 0; i < items.length; i++) {
            const r = sumAmountCents(items[i], i + 1);
            sum += r.sum;
            count += r.count;
        }
        if (count === 0) return;
        const totals = computeTotals(price, sum);
        price.totalAllowance = totals.total;
        price.paidAmount = totals.paid;
    }
}

function computeTotals(price: BasketPrice, allowanceCents: number): { total: number; paid: number } {
    const grossPrice = price.grossPrice;
    if (typeof grossPrice !== 'number' || !Number.isFinite(grossPrice)) throw fail('grossPrice zorunludur.');
    const gross = cents(grossPrice);
    if (allowanceCents > gross) throw fail('iskonto toplamı sepet tutarını aşıyor.');
    if (gross - allowanceCents < 100) throw fail("iskonto sonrası sepet toplamı 1 TL'den az olamaz (Ödeal hata kodu 2304).");
    return { total: allowanceCents / 100, paid: (gross - allowanceCents) / 100 };
}

// Eklenecek iskontonun sırası: satırdaki en büyük order (yoksa 0) + 1. Mevcut order 32 bit tam sayı olmalıdır.
function nextOrder(item: Item, n: number): number {
    let max = 0;
    const list = item.allowances;
    if (Array.isArray(list)) {
        for (const a of list) {
            if (a === null || a === undefined) continue;
            const o: unknown = a.order;
            if (o === null || o === undefined) continue;
            if (typeof o !== 'number' || !Number.isInteger(o) || o < INT32_MIN || o > INT32_MAX) {
                throw fail(`satır ${n} iskontosunda order 32 bit tam sayı olmalıdır.`);
            }
            if (o > max) max = o;
        }
    }
    if (max === INT32_MAX) throw fail(`satır ${n} için yeni iskontonun order değeri 2147483647 sınırını aşıyor.`);
    return max + 1;
}

// Satırdaki tutar bazlı iskontoların kuruş toplamı. Oran bazlı iskonto ya da geçersiz tutar hata verir.
function sumAmountCents(item: Item | null | undefined, n: number): { sum: number; count: number } {
    let sum = 0;
    let count = 0;
    const list = item?.allowances;
    if (!Array.isArray(list)) return { sum, count };
    for (const a of list) {
        if (a === null || a === undefined) continue;
        if (a.isRateBased === true) {
            throw fail(`satır ${n} oran bazlı iskonto içeriyor; tutarını Ödeal hesapladığı için yardımcı desteklemez.`);
        }
        if (a.isRateBased !== false) throw fail(`satır ${n} iskontosunda isRateBased zorunludur.`);
        const p = a.price;
        if (typeof p !== 'number' || !(p > 0) || !Number.isFinite(p)) {
            throw fail(`satır ${n} iskontosunda price sıfırdan büyük olmalıdır.`);
        }
        if (!hasAtMostTwoDecimals(p)) throw fail(`satır ${n} iskonto tutarı en çok 2 ondalık basamak içermelidir.`);
        sum += cents(p);
        count++;
    }
    return { sum, count };
}

function cents(x: number): number {
    return Math.floor(x * 100 + 0.5);
}

function hasAtMostTwoDecimals(x: number): boolean {
    return Math.abs(x * 100 - Math.floor(x * 100 + 0.5)) <= 1e-6;
}

function fail(message: string): OdealValidationException {
    return new OdealValidationException(PREFIX + message, [PREFIX + message]);
}
