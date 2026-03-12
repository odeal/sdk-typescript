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
import { OdealClient, OdealConfig } from '@odeal/sdk';

// Create config
const config: OdealConfig = {
  baseUrl: 'https://api.odeal.com/v1',
  secretKey: 'your-secret-key',
  merchantKey: 'your-merchant-key',
};

// Create client
const client = new OdealClient(config);
```

## License

MIT

## Version

2.1.31
