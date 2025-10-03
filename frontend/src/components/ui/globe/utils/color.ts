export function readCssRgbVarToHex(
  varName: string,
  fallback = '#10b981',
  rootEl?: HTMLElement
): string {
  if (typeof window === 'undefined') return fallback;

  const root = rootEl ?? document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue(varName).trim();

  if (!raw) return fallback;

  const nums = raw
    .split(/[,\s/]+/)
    .filter(Boolean)
    .map(Number);

  if (nums.length < 3 || nums.slice(0, 3).some(n => !Number.isFinite(n))) {
    return fallback;
  }

  const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp255(n).toString(16).padStart(2, '0');

  const [r, g, b] = nums;

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
