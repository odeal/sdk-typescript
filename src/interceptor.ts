/**
 * İstek bağlamı — interceptor'a gönderilen istek bilgileri.
 */
export interface RequestContext {
  /** HTTP metodu (GET, POST, PUT, DELETE vb.) */
  method: string;
  /** Tam URL (base URL + path + query string) */
  url: string;
  /** HTTP header'ları */
  headers: Record<string, string>;
  /** Serialized istek gövdesi */
  body?: unknown;
  /** Ek metadata (kullanıcı tanımlı) */
  metadata: Record<string, unknown>;
}

/**
 * Yanıt bağlamı — interceptor'a gönderilen yanıt bilgileri.
 */
export interface ResponseContext {
  /** HTTP status kodu */
  statusCode: number;
  /** HTTP header'ları */
  headers: Record<string, string>;
  /** Yanıt gövdesi */
  body?: unknown;
  /** İsteğin toplam süresi (milisaniye) */
  durationMs: number;
  /** Orijinal istek bağlamı */
  request: RequestContext;
  /** Ek metadata (kullanıcı tanımlı) */
  metadata: Record<string, unknown>;
}

/**
 * HTTP istek/yanıt pipeline'ına araya girmek için kullanılan interceptor interface'i.
 * 
 * @example
 * ```typescript
 * const loggingInterceptor: OdealInterceptor = {
 *   onBeforeRequest: async (ctx) => {
 *     console.log(`[REQUEST] ${ctx.method} ${ctx.url}`);
 *   },
 *   onAfterResponse: async (ctx) => {
 *     console.log(`[RESPONSE] ${ctx.statusCode} (${ctx.durationMs}ms)`);
 *   }
 * };
 * 
 * const config: OdealConfig = {
 *   secretKey: 'sk_xxx',
 *   interceptors: [loggingInterceptor]
 * };
 * ```
 */
export interface OdealInterceptor {
  /** HTTP isteği gönderilmeden önce çağrılır. */
  onBeforeRequest?(context: RequestContext): Promise<void> | void;
  /** HTTP yanıtı alındıktan sonra çağrılır. */
  onAfterResponse?(context: ResponseContext): Promise<void> | void;
}
