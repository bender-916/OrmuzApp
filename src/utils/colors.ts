/**
 * Converts a price to a color on a green→yellow→red gradient.
 * t=0 (cheapest) → green, t=0.5 → yellow, t=1 (most expensive) → red
 */
export function priceToColor(
  price: number,
  minPrice: number,
  maxPrice: number,
): string {
  if (maxPrice === minPrice) {
    return '#4CAF50'; // all same price = green
  }
  const t = Math.max(0, Math.min(1, (price - minPrice) / (maxPrice - minPrice)));
  const hue = 120 * (1 - t); // 120=green, 60=yellow, 0=red
  return hslToHex(hue, 80, 45);
}

/**
 * Convert HSL to hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Returns the text color (black or white) for best contrast
 */
export function contrastTextColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
