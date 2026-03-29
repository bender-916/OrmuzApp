import {useEffect, useState, useCallback} from 'react';
import {fetchStations} from '../services/api';
import {parseAllStations} from '../services/parser';
import {filterByProximity} from '../services/geo';
import {getCachedStations, getCachedStationsIgnoreTTL, cacheStations} from '../services/cache';
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

  const loadStations = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));

    try {
      // Try cache first
      let stations = await getCachedStations();

      if (!stations) {
        // Fetch from API
        const response = await fetchStations();
        stations = parseAllStations(response.ListaEESSPrecio);
        await cacheStations(stations);
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
        const cached = await getCachedStationsIgnoreTTL();
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
  }, []);

  // Filter by proximity when location/radius/allStations change
  useEffect(() => {
    if (state.allStations.length === 0) {
      return;
    }

    // Filter only stations that have the selected fuel type
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
