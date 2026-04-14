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
    private readonly failureThreshold: number;
    private readonly resetTimeoutMs: number;

    constructor(failureThreshold = 5, resetTimeoutMs = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }

    get currentState(): CircuitState {
        if (this.state === CircuitState.Open) {
            const elapsed = Date.now() - this.lastFailureTime;
            if (elapsed >= this.resetTimeoutMs) {
                this.state = CircuitState.HalfOpen;
            }
        }
        return this.state;
    }

    allowRequest(): boolean {
        const s = this.currentState;
        return s === CircuitState.Closed || s === CircuitState.HalfOpen;
    }

    recordSuccess(): void {
        this.failureCount = 0;
        this.state = CircuitState.Closed;
    }

    recordFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = CircuitState.Open;
        }
    }

    reset(): void {
        this.failureCount = 0;
        this.state = CircuitState.Closed;
        this.lastFailureTime = 0;
    }
}
