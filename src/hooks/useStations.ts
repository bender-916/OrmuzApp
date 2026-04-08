import {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {fetchStationsByProvince} from '../services/api';
import {parseAllStations} from '../services/parser';
import {filterByProximity} from '../services/geo';
import {getCachedStations, getCachedStationsIgnoreTTL, cacheStations} from '../services/cache';
import {getProvinceId} from '../utils/provinces';
import {Coordinate, Station} from '../types/station';
import {MAX_STATIONS} from '../utils/constants';

export function useStations(
  location: Coordinate,
  radiusKm: number,
  selectedFuelLabel: string,
) {
  // Separate state to avoid dependency issues with object comparison
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const provinceId = useMemo(
    () => getProvinceId(location.latitude, location.longitude),
    [location.latitude, location.longitude],
  );

  // Keep track of current province to avoid stale closures
  const currentProvinceRef = useRef(provinceId);
  currentProvinceRef.current = provinceId;

  // Load stations for the current province
  const loadStations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try cache first
      let stations = await getCachedStations(provinceId);

      if (!stations) {
        // Fetch only this province (~500-700 stations instead of 12,000)
        const response = await fetchStationsByProvince(provinceId);
        stations = parseAllStations(response.ListaEESSPrecio);
        await cacheStations(provinceId, stations);
      }

      // Only update if province hasn't changed while we were fetching
      if (currentProvinceRef.current === provinceId) {
        setAllStations(stations!);
        setLastUpdate(new Date());
        setLoading(false);
      }
    } catch (err) {
      // If fetch fails, try cache regardless of TTL
      try {
        const cached = await getCachedStationsIgnoreTTL(provinceId);
        if (cached) {
          setAllStations(cached);
          setLastUpdate(new Date());
          setLoading(false);
          setError('Sin conexión. Mostrando datos en caché.');
          return;
        }
      } catch {}

      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar las gasolineras',
      );
      setLoading(false);
    }
  }, [provinceId]);

  // Load stations when province changes
  useEffect(() => {
    loadStations();
  }, [loadStations]);

  // Filter by proximity when inputs change — separate from loading
  useEffect(() => {
    // Don't filter if no stations loaded yet
    if (allStations.length === 0) {
      return;
    }

    // Filter stations that have the selected fuel type
    const withFuel = allStations.filter(s =>
      s.prices.some(p => p.fuelType === selectedFuelLabel),
    );

    // Filter by proximity to user location
    const nearby = filterByProximity(
      withFuel,
      location,
      radiusKm,
      MAX_STATIONS,
    );

    setNearbyStations(nearby);
  }, [allStations, location, radiusKm, selectedFuelLabel]);

  return {
    allStations,
    nearbyStations,
    loading,
    error,
    lastUpdate,
    refresh: loadStations,
  };
}
