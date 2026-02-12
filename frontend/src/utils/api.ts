type FetchJsonOptions = {
  signal?: AbortSignal;
};

const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

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

  return (await res.json()) as T;
}
