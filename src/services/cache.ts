import AsyncStorage from '@react-native-async-storage/async-storage';
import {Station} from '../types/station';
import {CACHE_TTL_MS} from '../utils/constants';

const CACHE_KEY = 'stations_cache';
const TIMESTAMP_KEY = 'stations_cache_ts';

export async function getCachedStations(): Promise<Station[] | null> {
  try {
    const [dataStr, tsStr] = await Promise.all([
      AsyncStorage.getItem(CACHE_KEY),
      AsyncStorage.getItem(TIMESTAMP_KEY),
    ]);

    if (!dataStr || !tsStr) {
      return null;
    }

    const timestamp = parseInt(tsStr, 10);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      return null; // Cache expired
    }

    return JSON.parse(dataStr) as Station[];
  } catch {
    return null;
  }
}

export async function getCachedStationsIgnoreTTL(): Promise<Station[] | null> {
  try {
    const dataStr = await AsyncStorage.getItem(CACHE_KEY);
    if (!dataStr) {
      return null;
    }
    return JSON.parse(dataStr) as Station[];
  } catch {
    return null;
  }
}

export async function cacheStations(stations: Station[]): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(stations)),
      AsyncStorage.setItem(TIMESTAMP_KEY, Date.now().toString()),
    ]);
  } catch {
    // Silently fail - cache is not critical
  }
}
