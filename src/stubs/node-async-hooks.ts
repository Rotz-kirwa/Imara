// Browser-safe no-op stub for node:async_hooks
// Used when Vite builds the client bundle for Vercel (no Node.js runtime)
export class AsyncLocalStorage<T = unknown> {
  getStore(): T | undefined { return undefined; }
  run<R>(_store: T, fn: () => R): R { return fn(); }
  enterWith(_store: T): void {}
  disable(): void {}
}
export class AsyncResource {
  runInAsyncScope<R>(fn: () => R): R { return fn(); }
}
