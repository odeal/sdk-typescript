# Odeal SDK for TypeScript

Odeal Entegrasyon SDK (Otomatik Üretildi)

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

// Sepet oluşturma
const response = await client.basket.createSimpleBasket({ /* ... */ });
```

## Builder Pattern

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

## Factory Helper

```typescript
import { createOdealClient, createOdealClientFromEnv } from '@odeal/sdk';

// Explicit config
const client = createOdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
});

// Env variables: ODEAL_SECRET_KEY, ODEAL_MERCHANT_KEY
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

## Features

- ✅ Full TypeScript support with type definitions
- ✅ Builder pattern for type-safe configuration
- ✅ Factory helpers & environment variable support
- ✅ Interceptor pipeline (request/response hooks)
- ✅ Rich error hierarchy (Auth, Forbidden, NotFound, RateLimit, Validation)
- ✅ Automatic retry with exponential backoff & Retry-After header
- ✅ Configurable timeout
- ✅ Idempotency key injection for POST/PUT/PATCH
- ✅ Client-side validation
- ✅ Sensitive data masking in debug logs
- ✅ Response unwrapping (`{"result": [...]}` → auto-extract)
- ✅ Circuit breaker pattern
- ✅ Async/await throughout

## Circuit Breaker

```typescript
const client = new OdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
  circuitBreakerEnabled: true,
  circuitBreakerThreshold: 5,    // 5 ardışık hata → devre açılır
  circuitBreakerResetMs: 60000,  // 60s sonra test isteği
});

import { OdealCircuitOpenException } from '@odeal/sdk';

try {
  await client.basket.createSimpleBasket(request);
} catch (error) {
  if (error instanceof OdealCircuitOpenException) {
    console.log('Circuit breaker açık — istekler geçici olarak durduruldu.');
  }
}
```

## Timeout & Retry

```typescript
const client = new OdealClient({
  secretKey: 'sk_xxx',
  merchantKey: 'mk_xxx',
  timeout: 60000,       // Varsayılan: 30000ms
  maxRetryCount: 5,     // Varsayılan: 3
});
```

## License

MIT

## Version

2.2.11
