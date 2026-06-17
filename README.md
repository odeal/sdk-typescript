# Odeal SDK for TypeScript

> Odeal Entegrasyon SDK (Otomatik Üretildi)

> **Version:** 2.7.0 | **License:** MIT | **Auto-Generated** by Odeal SDK Generator


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

const response = await client.basket.createSimpleBasket({ /* ... */ });
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
      maskFields: ['password', 'cvv', 'cardNumber'],
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
| `CreateSimpleBasket()` | Standart ürün satışı. Müşteri Bireysel veya Kurumsal olabilir. 'items' alanı zorunludur. |
| `CreateAdvanceBasket()` | Avans tahsilatı. Müşteri Bireysel veya Kurumsal olabilir. 'items' gönderilmez. `basketType` ADVANCE olmalıdır. |
| `CreateCurrentAccountBasket()` | Cari hesap tahsilatı. Müşteri Kurumsal olmalıdır. `basketType` CURRENT_ACCOUNT olmalıdır. |
| `CreateFoodCardBasket()` | Yemek kartı işlemleri. `receiptInfo` ve içindeki `foodCardBrandId` zorunludur. |
| `ListBaskets()` | Sepet Listele |
| `DeleteBasket()` | Sepet Sil |
### PaymentResource

| Method | Description |
|:-------|:------------|
| `CancelPayment()` | Ödeme İptali |
### ConfigurationResource

| Method | Description |
|:-------|:------------|
| `SaveConfiguration()` | Konfigürasyon Kaydet |
### UnitResource

| Method | Description |
|:-------|:------------|
| `ListUnits()` | Birimleri Listele |
### ReportResource

| Method | Description |
|:-------|:------------|
| `GetTransactionReport()` | İşlem Raporu |

## License

MIT
