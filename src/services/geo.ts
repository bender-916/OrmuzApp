import {Coordinate, Station} from '../types/station';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate haversine distance between two coordinates in km
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Filter stations by proximity using bounding box pre-filter + haversine
 */
export function filterByProximity(
  stations: Station[],
  center: Coordinate,
  radiusKm: number,
  maxResults: number,
): Station[] {
  // Bounding box pre-filter
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos(toRad(center.latitude)));

  const minLat = center.latitude - latDelta;
  const maxLat = center.latitude + latDelta;
  const minLng = center.longitude - lngDelta;
  const maxLng = center.longitude + lngDelta;

  const nearby: Station[] = [];

  for (const station of stations) {
    // Quick bounding box check
    if (
      station.latitude < minLat ||
      station.latitude > maxLat ||
      station.longitude < minLng ||
      station.longitude > maxLng
    ) {
      continue;
    }

    // Precise haversine check
    const dist = haversine(
      center.latitude,
      center.longitude,
      station.latitude,
      station.longitude,
    );

    if (dist <= radiusKm) {
      nearby.push({...station, distance: dist});
    }
  }

  // Sort by distance and limit
  nearby.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  return nearby.slice(0, maxResults);
}
