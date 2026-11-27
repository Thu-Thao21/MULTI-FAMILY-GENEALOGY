/**
 * Lightweight in-memory SWR cache to prevent resetting & re-fetching
 * data from scratch when switching between dashboard tabs.
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 2 * 60 * 1000; // 2 minutes fresh window

export function getCached<T>(key: string): { data: T; isStale: boolean } | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  const age = Date.now() - entry.timestamp;
  return {
    data: entry.data,
    isStale: age > entry.ttl,
  };
}

export function setCached<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  store.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of Array.from(store.keys())) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
