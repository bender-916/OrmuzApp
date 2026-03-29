// Spanish provinces with their API IDs and approximate center coordinates
// Used to fetch stations by province instead of the full ~12,000 station dataset

export interface Province {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const PROVINCES: Province[] = [
  {id: '01', name: 'Álava', lat: 42.8467, lng: -2.6727},
  {id: '02', name: 'Albacete', lat: 38.9942, lng: -1.8585},
  {id: '03', name: 'Alicante', lat: 38.3452, lng: -0.4815},
  {id: '04', name: 'Almería', lat: 36.8341, lng: -2.4637},
  {id: '05', name: 'Ávila', lat: 40.6567, lng: -4.6814},
  {id: '06', name: 'Badajoz', lat: 38.8794, lng: -6.9706},
  {id: '07', name: 'Baleares', lat: 39.5696, lng: 2.6502},
  {id: '08', name: 'Barcelona', lat: 41.3851, lng: 2.1734},
  {id: '09', name: 'Burgos', lat: 42.3440, lng: -3.6970},
  {id: '10', name: 'Cáceres', lat: 39.4753, lng: -6.3724},
  {id: '11', name: 'Cádiz', lat: 36.5298, lng: -6.2927},
  {id: '12', name: 'Castellón', lat: 39.9864, lng: -0.0513},
  {id: '13', name: 'Ciudad Real', lat: 38.9848, lng: -3.9274},
  {id: '14', name: 'Córdoba', lat: 37.8882, lng: -4.7794},
  {id: '15', name: 'A Coruña', lat: 43.3623, lng: -8.4115},
  {id: '16', name: 'Cuenca', lat: 40.0704, lng: -2.1374},
  {id: '17', name: 'Girona', lat: 41.9794, lng: 2.8214},
  {id: '18', name: 'Granada', lat: 37.1773, lng: -3.5986},
  {id: '19', name: 'Guadalajara', lat: 40.6329, lng: -3.1669},
  {id: '20', name: 'Gipuzkoa', lat: 43.1128, lng: -2.2242},
  {id: '21', name: 'Huelva', lat: 37.2614, lng: -6.9447},
  {id: '22', name: 'Huesca', lat: 42.1362, lng: -0.4089},
  {id: '23', name: 'Jaén', lat: 37.7796, lng: -3.7849},
  {id: '24', name: 'León', lat: 42.5987, lng: -5.5671},
  {id: '25', name: 'Lleida', lat: 41.6176, lng: 0.6200},
  {id: '26', name: 'La Rioja', lat: 42.2871, lng: -2.5396},
  {id: '27', name: 'Lugo', lat: 43.0097, lng: -7.5567},
  {id: '28', name: 'Madrid', lat: 40.4168, lng: -3.7038},
  {id: '29', name: 'Málaga', lat: 36.7213, lng: -4.4213},
  {id: '30', name: 'Murcia', lat: 37.9922, lng: -1.1307},
  {id: '31', name: 'Navarra', lat: 42.6954, lng: -1.6761},
  {id: '32', name: 'Ourense', lat: 42.3359, lng: -7.8639},
  {id: '33', name: 'Asturias', lat: 43.3614, lng: -5.8593},
  {id: '34', name: 'Palencia', lat: 42.0096, lng: -4.5288},
  {id: '35', name: 'Las Palmas', lat: 28.1235, lng: -15.4363},
  {id: '36', name: 'Pontevedra', lat: 42.4336, lng: -8.6481},
  {id: '37', name: 'Salamanca', lat: 40.9701, lng: -5.6635},
  {id: '38', name: 'Santa Cruz de Tenerife', lat: 28.4636, lng: -16.2518},
  {id: '39', name: 'Cantabria', lat: 43.1828, lng: -3.9878},
  {id: '40', name: 'Segovia', lat: 40.9429, lng: -4.1088},
  {id: '41', name: 'Sevilla', lat: 37.3891, lng: -5.9845},
  {id: '42', name: 'Soria', lat: 41.7640, lng: -2.4797},
  {id: '43', name: 'Tarragona', lat: 41.1189, lng: 1.2445},
  {id: '44', name: 'Teruel', lat: 40.3456, lng: -1.1065},
  {id: '45', name: 'Toledo', lat: 39.8628, lng: -4.0273},
  {id: '46', name: 'Valencia', lat: 39.4699, lng: -0.3763},
  {id: '47', name: 'Valladolid', lat: 41.6523, lng: -4.7245},
  {id: '48', name: 'Bizkaia', lat: 43.2630, lng: -2.9350},
  {id: '49', name: 'Zamora', lat: 41.5034, lng: -5.7446},
  {id: '50', name: 'Zaragoza', lat: 41.6488, lng: -0.8891},
  {id: '51', name: 'Ceuta', lat: 35.8894, lng: -5.3198},
  {id: '52', name: 'Melilla', lat: 35.2923, lng: -2.9381},
];

// Returns the nearest province ID for a given coordinate
export function getProvinceId(lat: number, lng: number): string {
  let nearestId = '28'; // Madrid as default
  let minDist = Infinity;

  for (const province of PROVINCES) {
    const dLat = province.lat - lat;
    const dLng = province.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDist) {
      minDist = dist;
      nearestId = province.id;
    }
  }

  return nearestId;
}
