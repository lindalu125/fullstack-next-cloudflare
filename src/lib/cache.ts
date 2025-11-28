/**
 * Simple in-memory cache for development and edge functions
 * Note: In a real serverless environment (like Cloudflare Workers), global state 
 * might not persist across requests reliably unless using Durable Objects or KV.
 * However, for Next.js API routes or during a single hot lambda execution, 
 * this can provide some short-term caching.
 * 
 * For production, consider using Cloudflare KV or a dedicated Redis instance.
 */

interface CacheItem<T> {
    data: T;
    expiry: number;
}

const cache = new Map<string, CacheItem<any>>();

/**
 * Get item from cache
 */
export function getCached<T>(key: string): T | null {
    const item = cache.get(key);
    
    if (!item) return null;

    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }

    return item.data;
}

/**
 * Set item in cache
 * @param ttl Time to live in milliseconds (default: 60 seconds)
 */
export function setCache(key: string, data: any, ttl = 60000) {
    // Limit cache size to prevent memory leaks
    if (cache.size > 1000) {
        const firstKey = cache.keys().next().value;
        if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, {
        data,
        expiry: Date.now() + ttl
    });
}

/**
 * Clear cache (useful for testing or when data updates)
 */
export function clearCache(keyPattern?: string) {
    if (!keyPattern) {
        cache.clear();
        return;
    }

    for (const key of cache.keys()) {
        if (key.includes(keyPattern)) {
            cache.delete(key);
        }
    }
}
