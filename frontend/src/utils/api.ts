type FetchJsonOptions = {
  signal?: AbortSignal;
};

const apiBaseUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export async function fetchJson<T>(path: string, options: FetchJsonOptions = {}): Promise<T> {
  const url = new URL(path, apiBaseUrl);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    const text = await res.text().catch(() => '');
    const snippet = text.slice(0, 120).replace(/\s+/g, ' ');
    throw new Error(`Expected JSON from ${url.pathname}, got "${contentType || 'unknown'}"${snippet ? ` - ${snippet}` : ''}`);
  }

  return (await res.json()) as T;
}
