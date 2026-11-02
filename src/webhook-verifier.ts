/**
 * Ödeal geri bildirim (webhook) isteklerini doğrulama yardımcıları.
 *
 * Ödeal, yapılandırmanızda tanımlıysa isteğe `X-ODEAL-REQUEST-KEY` başlığını (`odealRequestKey` değeri) koyar;
 * Ödeal entegrasyon ekibiyle Basic Auth da tanımlanabilir (entegrasyon dokümanı, "Geri Bildirim"). Doğrulama
 * isteğe bağlıdır: yapılandırmanıza uyan yöntemi kullanın. Karşılaştırmalar sabit zamanlıdır.
 *
 * @example
 * ```typescript
 * import { OdealWebhookVerifier } from '@odeal/sdk';
 *
 * // Express.js (Node başlık adlarını küçük harfe çevirir)
 * app.post('/webhooks/odeal/payment-succeeded', (req, res) => {
 *   const key = req.headers[OdealWebhookVerifier.REQUEST_KEY_HEADER];
 *   if (!OdealWebhookVerifier.verifyRequestKey(key, 'your-odeal-request-key')) {
 *     return res.status(401).end();
 *   }
 *   res.status(200).end(); // 2xx ile hızlı yanıt verin, ağır işi sonra yapın
 * });
 * ```
 */

import { createHash, timingSafeEqual } from 'crypto';

/** Başlık değeri: Node `req.headers` tek değer, dizi ya da `undefined` verebilir. */
export type OdealHeaderValue = string | string[] | null | undefined;

export class OdealWebhookVerifier {
    /** Ödeal'in istek anahtarını taşıyan başlık (Node'daki küçük harfli adı). */
    static readonly REQUEST_KEY_HEADER = 'x-odeal-request-key';

    /** Basic Auth bilgisini taşıyan başlık (Node'daki küçük harfli adı). */
    static readonly AUTHORIZATION_HEADER = 'authorization';

    /**
     * `X-ODEAL-REQUEST-KEY` başlığının değeri yapılandırmadaki `odealRequestKey` ile aynı mı.
     * Başlık ya da beklenen anahtar boşsa, başlık birden çok kez geldiyse `false` döner.
     */
    static verifyRequestKey(receivedKey: OdealHeaderValue, expectedKey: string | null | undefined): boolean {
        const received = single(receivedKey);
        if (!received || !expectedKey) return false;
        return fixedTimeEquals(Buffer.from(received, 'utf8'), Buffer.from(expectedKey, 'utf8'));
    }

    /**
     * `Authorization: Basic ...` başlığı verilen kullanıcı adı ve parolayla eşleşiyor mu.
     * Başlık yoksa, Basic değilse, base64 geçersizse ya da beklenen bilgiler boşsa `false` döner.
     */
    static verifyBasicAuth(
        authorizationHeader: OdealHeaderValue,
        username: string | null | undefined,
        password: string | null | undefined,
    ): boolean {
        const header = single(authorizationHeader);
        if (!header || !username || !password) return false;
        const value = header.trim();
        const space = value.indexOf(' ');
        if (space <= 0 || value.slice(0, space).toLowerCase() !== 'basic') return false;
        const encoded = value.slice(space + 1).trim();
        if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return false;
        return fixedTimeEquals(Buffer.from(encoded, 'base64'), Buffer.from(`${username}:${password}`, 'utf8'));
    }
}

function single(value: OdealHeaderValue): string | undefined {
    if (Array.isArray(value)) return value.length === 1 ? value[0] : undefined;
    return value ?? undefined;
}

/** Uzunluk farkı da sızmasın diye iki değerin SHA-256 özeti sabit zamanlı karşılaştırılır. */
function fixedTimeEquals(a: Buffer, b: Buffer): boolean {
    return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}
