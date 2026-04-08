import {useEffect, useState, useCallback, useMemo} from 'react';
import {fetchStationsByProvince} from '../services/api';
import {parseAllStations} from '../services/parser';
import {filterByProximity} from '../services/geo';
import {getCachedStations, getCachedStationsIgnoreTTL, cacheStations} from '../services/cache';
import {getProvinceId} from '../utils/provinces';
import {Coordinate, Station} from '../types/station';
import {MAX_STATIONS} from '../utils/constants';

interface StationsState {
  allStations: Station[];
  nearbyStations: Station[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export function useStations(
  location: Coordinate,
  radiusKm: number,
  selectedFuelLabel: string,
) {
  const [state, setState] = useState<StationsState>({
    allStations: [],
    nearbyStations: [],
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const provinceId = useMemo(
    () => getProvinceId(location.latitude, location.longitude),
    [location.latitude, location.longitude],
  );

  const loadStations = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));

    try {
      // Try cache first
      let stations = await getCachedStations(provinceId);

      if (!stations) {
        // Fetch only this province (~500-700 stations instead of 12,000)
        const response = await fetchStationsByProvince(provinceId);
        stations = parseAllStations(response.ListaEESSPrecio);
        await cacheStations(provinceId, stations);
      }

      setState(prev => ({
        ...prev,
        allStations: stations!,
        loading: false,
        lastUpdate: new Date(),
      }));
    } catch (err) {
      // If fetch fails, try cache regardless of TTL
      try {
        const cached = await getCachedStationsIgnoreTTL(provinceId);
        if (cached) {
          setState(prev => ({
            ...prev,
            allStations: cached,
            loading: false,
            error: 'Sin conexión. Mostrando datos en caché.',
            lastUpdate: new Date(),
          }));
          return;
        }
      } catch {}

      setState(prev => ({
        ...prev,
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : 'Error al cargar las gasolineras',
      }));
    }
  }, [provinceId]);

  // Filter by proximity when location/radius/allStations change
  useEffect(() => {
    if (state.allStations.length === 0) {
      return;
    }

    const withFuel = state.allStations.filter(s =>
      s.prices.some(p => p.fuelType === selectedFuelLabel),
    );

    const nearby = filterByProximity(
      withFuel,
      location,
      radiusKm,
      MAX_STATIONS,
    );

    setState(prev => ({...prev, nearbyStations: nearby}));
  }, [state.allStations, location, radiusKm, selectedFuelLabel]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  return {
    ...state,
    refresh: loadStations,
  };
}
