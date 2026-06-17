import { OdealInterceptor, RequestContext, ResponseContext } from './interceptor';

const DEFAULT_MASK_FIELDS = [
  'password', 'cvv', 'cvc', 'cardNumber', 'card_number', 'pan',
  'expiryDate', 'expiry_date', 'securityCode', 'security_code',
  'secretKey', 'secret_key', 'token', 'accessToken', 'access_token',
  'refreshToken', 'refresh_token', 'authorization',
  'tckn', 'tcKimlikNo', 'tcKimlik', 'identityNumber', 'nationalId',
  'iban', 'phone', 'phoneNumber', 'telephone', 'gsm',
  'email', 'eMail', 'mail', 'address', 'adres',
];

/**
 * Request Logger yapılandırma seçenekleri.
 */
export interface OdealRequestLoggerOptions {
  /** Log seviyesi: 'info' | 'debug' | 'warn' | 'error'. Varsayılan: 'info' */
  level?: 'info' | 'debug' | 'warn' | 'error';
  /** Loglanacak minimum süre (ms). Bu süreden kısa yanıtlar loglanmaz. Varsayılan: 0 */
  minDurationMs?: number;
  /** Maskelenmesi gereken JSON alan adları. */
  maskFields?: string[];
  /** Request body loglanacak mı? Varsayılan: true */
  logBody?: boolean;
  /** Response body loglanacak mı? Varsayılan: false */
  logResponseBody?: boolean;
  /** Özel log fonksiyonu. Varsayılan: console.log */
  logger?: (message: string, level: string) => void;
}

/**
 * Hazır Odeal Request Logger middleware'i.
 * 
 * Interceptor pipeline üzerine inşa edilmiştir. Tüm HTTP isteklerini ve
 * yanıtlarını yapılandırılabilir şekilde loglar.
 * 
 * @example
 * ```typescript
 * import { OdealRequestLogger, createOdealClient } from '@odeal/sdk';
 * 
 * const client = createOdealClient({
 *   secretKey: 'sk_xxx',
 *   interceptors: [
 *     new OdealRequestLogger({ level: 'info', maskFields: ['cvv', 'password'] })
 *   ]
 * });
 * ```
 */
export class OdealRequestLogger implements OdealInterceptor {
  private readonly options: Required<OdealRequestLoggerOptions>;

  constructor(options: OdealRequestLoggerOptions = {}) {
    this.options = {
      level: options.level ?? 'info',
      minDurationMs: options.minDurationMs ?? 0,
      maskFields: options.maskFields ?? DEFAULT_MASK_FIELDS,
      logBody: options.logBody ?? true,
      logResponseBody: options.logResponseBody ?? false,
      logger: options.logger ?? ((msg, _lvl) => console.log(msg)),
    };
  }

  onBeforeRequest(context: RequestContext): void {
    const parts: string[] = [`→ ${context.method} ${context.url}`];
    if (this.options.logBody && context.body) {
      parts.push(`  Body: ${this.maskSensitive(String(context.body))}`);
    }
    this.log(parts.join('\n'), 'info');
  }

  onAfterResponse(context: ResponseContext): void {
    if (context.durationMs < this.options.minDurationMs) return;

    const status = context.statusCode;
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    const parts: string[] = [
      `← ${status} ${context.request?.method ?? ''} ${context.request?.url ?? ''} (${context.durationMs.toFixed(0)}ms)`
    ];
    if (this.options.logResponseBody && context.body) {
      parts.push(`  Body: ${this.maskSensitive(String(context.body).substring(0, 500))}`);
    }
    this.log(parts.join('\n'), level);
  }

  private log(message: string, level: string): void {
    this.options.logger(`[ODEAL ${level.toUpperCase()}] ${message}`, level);
  }

  private maskSensitive(text: string): string {
    let result = text;
    for (const field of this.options.maskFields) {
      const regex = new RegExp(`("${escapeRegex(field)}"\\s*:\\s*")[^"]+(")`, 'gi');
      result = result.replace(regex, '$1***$2');
    }
    return result;
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
