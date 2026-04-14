/**
 * Odeal Webhook İmza Doğrulama Modülü
 * 
 * @example
 * ```typescript
 * import { OdealWebhookVerifier } from '@odeal/sdk';
 * 
 * // Express.js
 * app.post('/webhook', (req, res) => {
 *   const signature = req.headers['x-odeal-signature'] as string;
 *   const isValid = OdealWebhookVerifier.verifySignature(
 *     JSON.stringify(req.body),
 *     signature,
 *     'your-webhook-secret'
 *   );
 *   if (!isValid) return res.status(401).send('Invalid signature');
 *   // Webhook'u işle...
 * });
 * ```
 */

import { createHmac, timingSafeEqual } from 'crypto';

export class OdealWebhookVerifier {
    /** Varsayılan imza header adı. */
    static readonly SIGNATURE_HEADER = 'x-odeal-signature';
    /** Varsayılan timestamp header adı. */
    static readonly TIMESTAMP_HEADER = 'x-odeal-timestamp';
    /** Varsayılan tolerans (5 dakika, milisaniye). */
    static readonly DEFAULT_TOLERANCE_MS = 5 * 60 * 1000;

    /**
     * Webhook imzasını doğrular.
     */
    static verifySignature(payload: string, signature: string, webhookSecret: string): boolean {
        if (!payload || !signature || !webhookSecret) return false;

        const expected = OdealWebhookVerifier.computeSignature(payload, webhookSecret);
        try {
            return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
        } catch {
            return false; // Farklı uzunluklar
        }
    }

    /**
     * Birden fazla secret ile doğrulama (secret rotation desteği).
     * Herhangi bir secret eşleşirse true döner.
     */
    static verifySignatureMulti(payload: string, signature: string, webhookSecrets: string[]): boolean {
        if (!payload || !signature || !webhookSecrets?.length) return false;
        return webhookSecrets.some(secret => 
            secret && OdealWebhookVerifier.verifySignature(payload, signature, secret)
        );
    }

    /**
     * Webhook imzasını timestamp kontrolü ile doğrular (replay attack koruması).
     */
    static verifySignatureWithTimestamp(
        payload: string,
        signature: string,
        timestamp: string,
        webhookSecret: string,
        toleranceMs: number = OdealWebhookVerifier.DEFAULT_TOLERANCE_MS
    ): boolean {
        const epochSeconds = parseInt(timestamp, 10);
        if (isNaN(epochSeconds)) return false;

        const diff = Math.abs(Date.now() - epochSeconds * 1000);
        if (diff > toleranceMs) return false;

        const signedPayload = `${timestamp}.${payload}`;
        return OdealWebhookVerifier.verifySignature(signedPayload, signature, webhookSecret);
    }

    /**
     * Birden fazla secret + timestamp doğrulama (rotation + replay koruması).
     */
    static verifySignatureWithTimestampMulti(
        payload: string,
        signature: string,
        timestamp: string,
        webhookSecrets: string[],
        toleranceMs: number = OdealWebhookVerifier.DEFAULT_TOLERANCE_MS
    ): boolean {
        const epochSeconds = parseInt(timestamp, 10);
        if (isNaN(epochSeconds)) return false;

        const diff = Math.abs(Date.now() - epochSeconds * 1000);
        if (diff > toleranceMs) return false;

        const signedPayload = `${timestamp}.${payload}`;
        return OdealWebhookVerifier.verifySignatureMulti(signedPayload, signature, webhookSecrets);
    }

    /**
     * HMAC-SHA256 imza hesaplar.
     */
    static computeSignature(payload: string, secret: string): string {
        return createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
    }
}
