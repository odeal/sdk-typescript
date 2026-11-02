# Odeal SDK for TypeScript

> Odeal Entegrasyon SDK (Otomatik Üretildi)

> **Version:** 0.2.0 | **License:** MIT | **Auto-Generated** by Odeal SDK Generator


## Requirements

- Node.js 18 or newer. The SDK uses the native `fetch` runtime API.

## Installation

`@odeal/sdk` is not on npm yet. Install it from GitHub
([github.com/odeal/sdk-typescript](https://github.com/odeal/sdk-typescript)). npm builds `dist` with the package's
`prepare` script:

```bash
npm install github:odeal/sdk-typescript
```

## Versioning

The five Ödeal SDKs (C#, TypeScript, Python, PHP, Java) share one version number and follow
[Semantic Versioning](https://semver.org/). While the version is 0.x, a minor release (0.2 → 0.3) may contain breaking
changes and a patch release (0.2.x) does not. Each release is a Git tag; a published tag never changes. Release notes:
[Releases](https://github.com/odeal/sdk-typescript/releases).

To use exactly this version (0.2.0), install its tag:

```bash
npm install github:odeal/sdk-typescript#0.2.0
```

npm records the installed commit in `package-lock.json`. To upgrade, install the new tag the same way.

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
import { OdealConfigBuilder, OdealEnvironment } from '@odeal/sdk';

const config = new OdealConfigBuilder()
  .secretKey('sk_xxx')
  .merchantKey('mk_xxx')
  .environment(OdealEnvironment.Staging) // test; default is production
  .debugMode(true)
  .timeout(60000)
  .maxRetryCount(5)
  .build();

const client = new OdealClient(config);
```

### Environments

| `OdealEnvironment` | Base URL |
|---|---|
| `Production` (default) | `https://api.odeal.com/api/v1` |
| `Staging` (test / sandbox) | `https://api.sandbox.odeal.com/integration/api/v1` |

Request address, first match wins:

1. A per-call base URL, for that request only.
2. `sandboxMode: true`: always the test environment.
3. An explicit `baseUrl`.
4. `environment`.
5. Production.

`createOdealClientFromEnv()` also reads `ODEAL_ENVIRONMENT` (`production`, `prod`, `staging`, `stage`, `sandbox`),
`ODEAL_SANDBOX` (`true`, `false`, `1`, `0`) and `ODEAL_BASE_URL`. An unknown value throws instead of
falling back to production.

### Factory Helpers

```typescript
import { createOdealClient, createOdealClientFromEnv } from '@odeal/sdk';

// Explicit config
const client = createOdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
});

// Environment variables: ODEAL_SECRET_KEY, ODEAL_MERCHANT_KEY (+ ODEAL_ENVIRONMENT, ODEAL_SANDBOX, ODEAL_BASE_URL)
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
import { OdealEnvironment, OdealRequestLogger, createOdealClient } from '@odeal/sdk';

const client = createOdealClient({
  secretKey: 'sk_xxx',
  environment: OdealEnvironment.Staging, // test; default is production
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
// [ODEAL INFO] → POST https://api.sandbox.odeal.com/integration/api/v1/basket
//   Body: {"merchantKey":"mk_xxx","password":"***"}
// [ODEAL INFO] ← 200 POST https://api.sandbox.odeal.com/integration/api/v1/basket (142ms)
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

// GET requests only: automatic retry on 5xx, 429 and network errors with exponential backoff.
// POST, PUT, PATCH and DELETE are never retried (the server may already have processed them).
// Retry-After header is respected
```

## Redirects

The SDK never follows redirects (`fetch` is called with `redirect: 'manual'`). A 3xx response throws `OdealRedirectException` with the original status code and is not retried. In browsers `fetch` hides the redirect status; the error then has `statusCode` 0. If you see it, check `baseUrl`.

## Account Settings (Configuration and Profile)

**Configuration.** `saveConfiguration` replaces the whole merchant configuration on the Ödeal side: every field you do not
send is cleared. The request model has the documented fields only, so settings outside them (for example
`basketCancelledUrl`, or a callback authentication set up by the Ödeal integration team) are cleared as well.
Before saving, read the current values with `getConfiguration` and send all documented fields again. If your account
uses settings outside the documented fields, ask the Ödeal integration team before saving.

**Profile.** `updateProfile` changes your integration profile type, which decides which basket flow the API accepts.
Sending baskets with this SDK needs `EXTERNAL_DEVICE_TO_DEVICE`. Change the type only on purpose; for
production, use production keys. `getProfileDetails` returns your own `apiKey` and `secretKey`: do not log or store
the response. `profileType` is returned as a string, because the API can return types that are not in the
documentation.

## Discounted Baskets

Basket lines can carry discounts (`allowances`) on `POST /basket`. Amounts include VAT, and a line discount applies to
the whole line (quantity × unit price), not to one unit. A discounted basket also needs `price.totalAllowance` (the sum
of the line discounts, exact to the kuruş) and `price.paidAmount` (`grossPrice − totalAllowance`). The payment options
must add up to `paidAmount`.

`OdealAllowances` does this arithmetic for amount-based discounts:

```typescript
import { OdealAllowances, PaymentOptionType } from '@odeal/sdk';
import type { BasketPrice, Item } from '@odeal/sdk';

const items: Item[] = [ /* Gözleme 2 × 120.00, Ayran 3 × 35.00, Kola 1 × 60.00 */ ];
const price: BasketPrice = { grossPrice: 405.00 };

// 40.00 off the subtotal, split by line amount, 2 decimals, remainder on the last line.
// Each line gets a SUB discount (23.70, 10.37, 5.93); totalAllowance = 40, paidAmount = 365.
OdealAllowances.applySubtotalAllowance(price, items, 40.00);

await client.createSimpleBasket({
  referenceCode: 'ISK-0001',
  customer,
  price,
  items,
  paymentOptions: [{ type: PaymentOptionType.CASH, amount: price.paidAmount! }],
});
```

- For line discounts you add yourself (`subType: AllowanceSubType.LINE`), call
  `OdealAllowances.applyAllowanceTotals(price, items)` to fill `totalAllowance` and `paidAmount`.
- If one line has a `SUB` discount, every line needs one (API error 2080). `applySubtotalAllowance` adds one to each
  line.
- Rate-based discounts (`isRateBased: true`) are sent as they are, but the helpers do not total them: Ödeal calculates
  their amount.
- After discounts the basket total must be at least 1 TL (API error 2304). The helpers check this and
  their other rules before they change anything, and throw `OdealValidationException` when a rule fails.
  `applySubtotalAllowance` needs a separate `Item` object for each line.
- Ödeal accepts a difference of 1 kuruş between `paidAmount` and its own calculation. The receipt shows the discount
  with VAT and the e-invoice without VAT, so the two numbers can differ.

## Webhook Verification

Ödeal posts payment and basket notifications as JSON to the URLs in your configuration. If you set an
`odealRequestKey`, every notification carries it in the `X-ODEAL-REQUEST-KEY` header; Basic Auth can be set up with
the Ödeal integration team instead. Verification is optional: use the helper that matches your setup. Both helpers
compare in constant time and return `false` for a missing header or an empty expected value.

```typescript
import express from 'express';
import { OdealWebhookVerifier } from '@odeal/sdk';

const app = express();

app.post('/webhooks/odeal/payment-succeeded', express.json(), (req, res) => {
  const requestKey = req.header(OdealWebhookVerifier.REQUEST_KEY_HEADER);
  if (!OdealWebhookVerifier.verifyRequestKey(requestKey, 'your-odeal-request-key')) {
    return res.status(401).end();
  }

  res.sendStatus(200);
});

// Basic Auth instead of the key:
const valid = OdealWebhookVerifier.verifyBasicAuth(req.header('authorization'), 'user', 'password');
```

Respond with a 2xx status quickly and do heavy work afterwards. Redelivery of failed notifications is not
guaranteed, and the same notification can arrive more than once: deduplicate by `PaymentRefCode` (payment
notifications) or `BasketRefCode` (invoice and basket notifications).

## Features

- ✅ Full TypeScript support with type definitions (CJS + ESM + DTS)
- ✅ Builder pattern for type-safe configuration
- ✅ Factory helpers & environment variable support
- ✅ Interceptor pipeline (request/response hooks)
- ✅ Rich error hierarchy (Auth, Forbidden, NotFound, RateLimit, Redirect, Validation)
- ✅ Automatic retry for GET requests (exponential backoff & Retry-After header)
- ✅ Redirects are never followed (`OdealRedirectException`)
- ✅ Configurable timeout
- ✅ Optional idempotency key header for POST/PUT/PATCH (`enableIdempotencyKey`, off by default; the Ödeal API does not use it yet,
  a basket is identified by its unique `basketReferenceCode`)
- ✅ Client-side input validation
- ✅ Sensitive data masking in debug logs
- ✅ Response unwrapping (`{"result": [...]}` → auto-extract)
- ✅ Circuit breaker pattern
- ✅ Request Logger middleware
- ✅ Async/await throughout
- ✅ Webhook verification helpers (`X-ODEAL-REQUEST-KEY`, Basic Auth)
- ✅ Discounted basket helpers (`OdealAllowances`)
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
### ProfileResource

| Method | Description |
|:-------|:------------|
| `getProfileDetails()` | Kayıtlı terminal entegrasyon profil bilgilerinizi (profil tipi, IP listesi, terminal ID vb.) getirir. |
| `updateProfile()` | Terminal entegrasyon profil tipini günceller. Profil tipi, hangi sepet akışının kabul edileceğini belirler. |

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
