# Odeal SDK for TypeScript

> Odeal Entegrasyon SDK (Otomatik Üretildi)

> **Version:** 2.17.3 | **License:** MIT | **Auto-Generated** by Odeal SDK Generator


## Requirements

- Node.js 18 or newer. The SDK uses the native `fetch` runtime API.

## Installation

```bash
npm install @odeal/sdk
# or
yarn add @odeal/sdk
# or
pnpm add @odeal/sdk
```

## Quick Start

```typescript
import { OdealClient } from '@odeal/sdk';

const client = new OdealClient({
  secretKey: 'your-secret-key',
  merchantKey: 'your-merchant-key',
});

// SDK iki kullanım biçimini de destekler — ikisi de eşdeğerdir, aynı metoda gider:
const response  = await client.createSimpleBasket({ /* ... */ });        // 1) Flat (doğrudan)
const response2 = await client.basket.createSimpleBasket({ /* ... */ }); // 2) Grouped (resource üzerinden)
```

## Configuration

### Builder Pattern

```typescript
import { OdealConfigBuilder } from '@odeal/sdk';

const config = new OdealConfigBuilder()
  .secretKey('sk_xxx')
  .merchantKey('mk_xxx')
  .baseUrl('https://api.odeal.com/v1')
  .debugMode(true)
  .timeout(60000)
  .maxRetryCount(5)
  .build();

const client = new OdealClient(config);
```

### Factory Helpers

```typescript
import { createOdealClient, createOdealClientFromEnv } from '@odeal/sdk';

// Explicit config
const client = createOdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
});

// Environment variables: ODEAL_SECRET_KEY, ODEAL_MERCHANT_KEY
const envClient = createOdealClientFromEnv();
```

## Interceptors

```typescript
import { OdealInterceptor, RequestContext, ResponseContext } from '@odeal/sdk';

const loggingInterceptor: OdealInterceptor = {
  onBeforeRequest: async (ctx: RequestContext) => {
    console.log(`→ ${ctx.method} ${ctx.url}`);
  },
  onAfterResponse: async (ctx: ResponseContext) => {
    console.log(`← ${ctx.statusCode} (${ctx.durationMs}ms)`);
  },
};

const client = new OdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
  interceptors: [loggingInterceptor],
});
```

## Error Handling

```typescript
import {
  OdealApiException,
  OdealAuthenticationException,
  OdealRateLimitException,
  OdealNotFoundException,
} from '@odeal/sdk';

try {
  await client.basket.createSimpleBasket(request);
} catch (error) {
  if (error instanceof OdealRateLimitException) {
    console.log(`Rate limit! Retry after ${error.retryAfterSeconds}s`);
  } else if (error instanceof OdealAuthenticationException) {
    console.log('Invalid API keys!');
  } else if (error instanceof OdealNotFoundException) {
    console.log('Resource not found');
  } else if (error instanceof OdealApiException) {
    console.log(`API Error: ${error.statusCode} - ${error.message}`);
  }
}
```

## Circuit Breaker

```typescript
const client = new OdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
  circuitBreakerEnabled: true,
  circuitBreakerThreshold: 5,    // 5 consecutive failures → circuit opens
  circuitBreakerResetMs: 60000,  // 60s cooldown before half-open test
});

import { OdealCircuitOpenException } from '@odeal/sdk';

try {
  await client.basket.createSimpleBasket(request);
} catch (error) {
  if (error instanceof OdealCircuitOpenException) {
    console.log('Circuit open — requests temporarily blocked.');
  }
}
```

## Request Logger

Built-in `OdealRequestLogger` middleware for production HTTP traffic logging:

```typescript
import { OdealRequestLogger, createOdealClient } from '@odeal/sdk';

const client = createOdealClient({
  secretKey: 'sk_xxx',
  interceptors: [
    new OdealRequestLogger({
      level: 'info',
      maskFields: ['password', 'cvv', 'cardNumber', 'tckn', 'iban', 'email', 'phone', 'address'],
      logBody: true,
      logResponseBody: false,
      minDurationMs: 0,
    })
  ]
});

// Output:
// [ODEAL INFO] → POST https://api.odeal.com/basket/simple
//   Body: {"merchantKey":"mk_xxx","password":"***"}
// [ODEAL INFO] ← 200 POST https://api.odeal.com/basket/simple (142ms)
```

Custom logger function:

```typescript
new OdealRequestLogger({
  logger: (message, level) => myCustomLogger.log(level, message)
})
```

## Timeout & Retry

```typescript
const client = new OdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
  timeout: 60000,       // Default: 30000ms
  maxRetryCount: 5,     // Default: 3
});

// Automatic retry on 5xx and 429 with exponential backoff
// Retry-After header is respected
```

## Webhook Verification

Gelen Odeal webhook'larının gerçekten Odeal'den geldiğini HMAC-SHA256 imzasıyla doğrulayın.
İmza `x-odeal-signature` header'ında, **ham gövde** üzerinden hesaplanarak gelir.

```typescript
import express from 'express';
import { OdealWebhookVerifier } from '@odeal/sdk';

const app = express();

// Ham gövde gerekir — imza ham bytes üzerinden hesaplanır
app.post('/webhooks/odeal', express.raw({ type: 'application/json' }), (req, res) => {
  const payload = req.body.toString('utf8');
  const signature = req.header(OdealWebhookVerifier.SIGNATURE_HEADER) ?? '';

  if (!OdealWebhookVerifier.verifySignature(payload, signature, 'your-webhook-secret')) {
    return res.status(401).send('Invalid webhook signature');
  }

  // İmza geçerli — webhook olayını işle
  res.sendStatus(200);
});
```

Replay koruması için timestamp doğrulamalı sürüm (önerilir):

```typescript
const valid = OdealWebhookVerifier.verifySignatureWithTimestamp(
  payload, signature, timestamp, 'your-webhook-secret'); // varsayılan 5 dk tolerans
```

## Features

- ✅ Full TypeScript support with type definitions (CJS + ESM + DTS)
- ✅ Builder pattern for type-safe configuration
- ✅ Factory helpers & environment variable support
- ✅ Interceptor pipeline (request/response hooks)
- ✅ Rich error hierarchy (Auth, Forbidden, NotFound, RateLimit, Validation)
- ✅ Automatic retry with exponential backoff & Retry-After header
- ✅ Configurable timeout
- ✅ Idempotency key injection for POST/PUT/PATCH
- ✅ Client-side input validation
- ✅ Sensitive data masking in debug logs
- ✅ Response unwrapping (`{"result": [...]}` → auto-extract)
- ✅ Circuit breaker pattern
- ✅ Request Logger middleware
- ✅ Async/await throughout
- ✅ Webhook signature verification
- ✅ Health check utility

## API Reference
### BasketResource

| Method | Description |
|:-------|:------------|
| `createSimpleBasket()` | Standart ürün satışı. Müşteri Bireysel veya Kurumsal olabilir. 'items' alanı zorunludur. |
| `createAdvanceBasket()` | Avans tahsilatı. Müşteri Bireysel veya Kurumsal olabilir. 'items' gönderilmez. `basketType` ADVANCE olmalıdır. |
| `createCurrentAccountBasket()` | Cari hesap tahsilatı. Müşteri Kurumsal olmalıdır. `basketType` CURRENT_ACCOUNT olmalıdır. |
| `createFoodCardBasket()` | Yemek kartı işlemleri. `receiptInfo` ve içindeki `foodCardBrandId` zorunludur. |
| `listBaskets()` | Sepet Listele |
| `deleteBasket()` | Sepet Sil |
| `deleteAllBaskets()` | Tüm Sepetleri Sil |
### PaymentResource

| Method | Description |
|:-------|:------------|
| `cancelPayment()` | Ödeme İptali |
### ConfigurationResource

| Method | Description |
|:-------|:------------|
| `saveConfiguration()` | Konfigürasyon Kaydet |
| `getConfiguration()` | Konfigürasyon Getir |
### UnitResource

| Method | Description |
|:-------|:------------|
| `listUnits()` | Birimleri Listele |
### ReportResource

| Method | Description |
|:-------|:------------|
| `getTransactionReport()` | İşlem Raporu |

## 🔐 Güvenlik & Doğrulama

Bu paket **Sigstore (cosign)** ile imzalanır ve doğrulanabilir kanıtlarla (attestation) yayınlanır:

- **İmza** — keyless cosign imzası; kimlik, yayınlayan CI workflow'una OIDC ile bağlanır
- **SBOM** — CycloneDX yazılım malzeme listesi (imzalı attestation)
- **Zafiyet taraması** — grype taraması (imzalı attestation)
- **Provenance** — SLSA build-provenance attestation'ı

### Doğrulama

```bash
# Paket imzası
cosign verify-blob \
  --bundle sign.bundle.json \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp "<yayın-workflow-url>" \
  <paket-dosyası>

# SBOM attestation
cosign verify-blob-attestation \
  --bundle sbom.bundle.json --type cyclonedx \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp "<yayın-workflow-url>" \
  <paket-dosyası>
```

Güvenlik açığı bildirimi ve tam talimatlar için: [`SECURITY.md`](./SECURITY.md)


## License

MIT
