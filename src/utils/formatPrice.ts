/**
 * Format a price in euros for display
 */
export function formatPrice(price: number): string {
  return price.toFixed(3) + ' €';
}

/**
 * Format a short price for markers (e.g., "1.359")
 */
export function formatMarkerPrice(price: number): string {
  return price.toFixed(3);
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
