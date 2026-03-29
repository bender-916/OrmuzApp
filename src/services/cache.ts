import AsyncStorage from '@react-native-async-storage/async-storage';
import {Station} from '../types/station';
import {CACHE_TTL_MS} from '../utils/constants';

function cacheKey(provinceId: string) {
  return `stations_cache_${provinceId}`;
}
function timestampKey(provinceId: string) {
  return `stations_cache_ts_${provinceId}`;
}

export async function getCachedStations(
  provinceId: string,
): Promise<Station[] | null> {
  try {
    const [dataStr, tsStr] = await Promise.all([
      AsyncStorage.getItem(cacheKey(provinceId)),
      AsyncStorage.getItem(timestampKey(provinceId)),
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

export async function getCachedStationsIgnoreTTL(
  provinceId: string,
): Promise<Station[] | null> {
  try {
    const dataStr = await AsyncStorage.getItem(cacheKey(provinceId));
    if (!dataStr) {
      return null;
    }
    return JSON.parse(dataStr) as Station[];
  } catch {
    return null;
  }
}

export async function cacheStations(
  provinceId: string,
  stations: Station[],
): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(cacheKey(provinceId), JSON.stringify(stations)),
      AsyncStorage.setItem(timestampKey(provinceId), Date.now().toString()),
    ]);
  } catch {
    // Silently fail - cache is not critical
  }
}
