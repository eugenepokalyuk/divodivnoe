const RETRY_KEY = 'divo:chunk-recovery';
const RETRY_INTERVAL = 60_000;

/** Turbopack/Webpack errors caused by missing or unreachable JS chunks. */
export function isChunkLoadError(error: unknown): boolean {
  const message =
    typeof error === 'string'
      ? error
      : error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : '';
  return /Failed to load chunk|ChunkLoadError|Loading chunk .+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    message,
  );
}

/** Pages may cache HTML referring to chunks removed by a newer deployment.
 * Fetch fresh HTML once; keep the guard across reloads and across error handlers.
 * Without sessionStorage we leave recovery to the explicit refresh button. */
export function recoverChunkLoadError(error: unknown): boolean {
  if (typeof window === 'undefined' || !isChunkLoadError(error)) return false;
  if (navigator.onLine === false) return false;

  try {
    const now = Date.now();
    const previous = Number(window.sessionStorage.getItem(RETRY_KEY));
    if (previous && now - previous < RETRY_INTERVAL) return false;
    window.sessionStorage.setItem(RETRY_KEY, String(now));
    const url = new URL(window.location.href);
    // A fresh cache key bypasses Pages' ten-minute HTML cache. Preserve hash
    // and other query parameters (including order/cart links).
    url.searchParams.set('_chunk_retry', String(now));
    window.location.replace(url.href);
    return true;
  } catch {
    return false;
  }
}
