export const API_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

export const DEFAULT_RADIUS_KM = 15;
export const MAX_RADIUS_KM = 50;
export const MIN_RADIUS_KM = 5;
export const MAX_STATIONS = 100;
export const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const FUEL_TYPES = [
  {key: 'Precio Gasoleo A', label: 'Gasóleo A'},
  {key: 'Precio Gasolina 95 E5', label: 'Gasolina 95'},
  {key: 'Precio Gasolina 98 E5', label: 'Gasolina 98'},
  {key: 'Precio Gasoleo Premium', label: 'Gasóleo Premium'},
  {key: 'Precio Gasoleo B', label: 'Gasóleo B'},
  {key: 'Precio Gases licuados del petróleo', label: 'GLP'},
] as const;

export const DEFAULT_FUEL_TYPE = FUEL_TYPES[0];

// Default location: Madrid center
export const DEFAULT_LOCATION = {
  latitude: 40.4168,
  longitude: -3.7038,
};

export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
