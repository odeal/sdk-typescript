/**
 * SDK varsayılan değerleri ve HTTP durum kodu sabitleri.
 */
export const OdealDefaults = {
  // --- Timeout & Retry ---
  TIMEOUT_MS: 30000,
  MAX_RETRY_COUNT: 3,
  BACKOFF_BASE_MS: 500,

  // --- Circuit Breaker ---
  CIRCUIT_BREAKER_THRESHOLD: 5,
  CIRCUIT_BREAKER_RESET_MS: 60000,

  // --- HTTP Status Codes ---
  HTTP_UNAUTHORIZED: 401,
  HTTP_FORBIDDEN: 403,
  HTTP_NOT_FOUND: 404,
  HTTP_TOO_MANY_REQUESTS: 429,

  isServerError: (statusCode: number): boolean => statusCode >= 500,
  isRetryable: (statusCode: number): boolean =>
    statusCode >= 500 || statusCode === 429,
} as const;
