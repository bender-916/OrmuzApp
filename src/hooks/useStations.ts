import {useEffect, useState, useCallback, useMemo} from 'react';
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
  // Estados separados para evitar problemas de dependencias circulares
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const provinceId = useMemo(
    () => getProvinceId(location.latitude, location.longitude),
    [location.latitude, location.longitude],
  );

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
      setAllStations(stations);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      // If fetch fails, try cache regardless of TTL
      try {
        const cached = await getCachedStationsIgnoreTTL(provinceId);
        if (cached) {
          setAllStations(cached);
          setError('Sin conexión. Mostrando datos en caché.');
          setLastUpdate(new Date());
          setLoading(false);
          return;
        }
      } catch {}
      setError(err instanceof Error ? err.message : 'Error al cargar las gasolineras');
      setLoading(false);
    }
  }, [provinceId]);

  // Load stations when provinceId changes
  useEffect(() => {
    loadStations();
  }, [loadStations]);

  // Filter by proximity when allStations, location, radius or fuelType change
  useEffect(() => {
    if (allStations.length === 0) {
      setNearbyStations([]);
      return;
    }
    
    const withFuel = allStations.filter(s => 
      s.prices.some(p => p.fuelType === selectedFuelLabel),
    );
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
