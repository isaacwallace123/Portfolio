export function cssVarRgbToHex(
  varName: string,
  fallback = '#10b981',
  rootEl?: HTMLElement
): string {
  if (typeof window === 'undefined') return fallback;

  const root = rootEl ?? document.documentElement;

  let raw = getComputedStyle(root).getPropertyValue(varName);

  if (!raw) return fallback;

  raw = raw
    .replace(/rgb(a)?\(/gi, '')
    .replace(/\)/g, '')
    .trim();

  const parts = raw
    .split(/[,\s/]+/)
    .filter(Boolean)
    .map(Number);

  if (parts.length < 3 || parts.slice(0, 3).some(n => !Number.isFinite(n))) {
    return fallback;
  }

  const [r, g, b] = parts;

  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
