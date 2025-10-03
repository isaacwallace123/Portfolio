export function extractMessage(
  data: unknown,
  fallback = 'Unexpected error'
): string {
  if (typeof data === 'string') return data;

  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    if (typeof o.detail === 'string') return o.detail;
    if (typeof o.title === 'string') return o.title;
    if (typeof o.message === 'string') return o.message;
    if (typeof o.error === 'string') return o.error;
  }

  return fallback;
}
