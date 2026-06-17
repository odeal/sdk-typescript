/**
 * Circuit Breaker — art arda hata alındığında istekleri otomatik durdurur.
 * CLOSED → OPEN → HALF_OPEN → CLOSED
 */

export enum CircuitState {
    Closed = 'closed',
    Open = 'open',
    HalfOpen = 'half_open',
}

export class OdealCircuitOpenException extends Error {
    constructor(message: string = 'Circuit breaker is open. Requests are temporarily blocked.') {
        super(message);
        this.name = 'OdealCircuitOpenException';
    }
}

export class OdealCircuitBreaker {
    private state: CircuitState = CircuitState.Closed;
    private failureCount = 0;
    private lastFailureTime = 0;
    private halfOpenProbeInFlight = false;
    private readonly failureThreshold: number;
    private readonly resetTimeoutMs: number;

    constructor(failureThreshold = 5, resetTimeoutMs = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }

    /** Mevcut durumu döner (yan etkisiz okuma). */
    get currentState(): CircuitState {
        if (this.state === CircuitState.Open && Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
            return CircuitState.HalfOpen;
        }
        return this.state;
    }

    /**
     * İsteğin geçip geçemeyeceğini kontrol eder. HALF_OPEN durumunda yalnızca TEK bir
     * probe (test) isteğine izin verilir; probe sonuçlanana kadar diğerleri reddedilir.
     */
    allowRequest(): boolean {
        // OPEN → HALF_OPEN: reset süresi dolduysa tek bir probe denemesine kapı aç.
        if (this.state === CircuitState.Open && Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
            this.state = CircuitState.HalfOpen;
            this.halfOpenProbeInFlight = false;
        }

        if (this.state === CircuitState.Closed) return true;
        if (this.state === CircuitState.HalfOpen) {
            if (this.halfOpenProbeInFlight) return false;
            this.halfOpenProbeInFlight = true; // probe izni bu isteğe verildi
            return true;
        }
        return false; // Open
    }

    recordSuccess(): void {
        this.failureCount = 0;
        this.state = CircuitState.Closed;
        this.halfOpenProbeInFlight = false;
    }

    recordFailure(): void {
        this.lastFailureTime = Date.now();

        if (this.state === CircuitState.HalfOpen) {
            // Probe başarısız → doğrudan tekrar OPEN.
            this.state = CircuitState.Open;
            this.halfOpenProbeInFlight = false;
            return;
        }

        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.state = CircuitState.Open;
        }
    }

    reset(): void {
        this.failureCount = 0;
        this.state = CircuitState.Closed;
        this.lastFailureTime = 0;
        this.halfOpenProbeInFlight = false;
    }
}
