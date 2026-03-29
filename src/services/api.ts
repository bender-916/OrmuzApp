import {RawAPIResponse} from '../types/api';
import {API_URL} from '../utils/constants';

export async function fetchStations(): Promise<RawAPIResponse> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data: RawAPIResponse = await response.json();
  if (data.ResultadoConsulta !== 'OK') {
    throw new Error(`API returned: ${data.ResultadoConsulta}`);
  }
  return data;
}
