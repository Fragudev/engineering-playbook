# Resilience

Patterns for surviving a dependency's bad day without having your own.

| Topic | File | Status |
|---|---|---|
| Circuit breaker | [`circuit-breaker.md`](circuit-breaker.md) | Done |
| Backpressure | [`backpressure.md`](backpressure.md) | Done |
| Timeout and retry budgets | [`timeout-and-retry-budgets.md`](timeout-and-retry-budgets.md) | Done |
| Bulkhead | [`bulkhead.md`](bulkhead.md) | Done |
| Rate limiting | [`rate-limiting.md`](rate-limiting.md) | Done |
| Graceful degradation | [`graceful-degradation.md`](graceful-degradation.md) | Done |

[`distributed-systems-playground`](https://github.com/Fragudev/distributed-systems-playground)
hosts a runnable failure-injection example (`examples/resilience`) combining bulkhead, circuit
breaker, and graceful degradation over a real simulated dependency, with tests proving each pattern
actually engages under load.
