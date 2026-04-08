import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Map, Camera, UserLocation, type CameraRef} from '@maplibre/maplibre-react-native';
import {Station, Coordinate} from '../../types/station';
import {MAP_STYLE_URL} from '../../utils/constants';
import StationMarker from './StationMarker';

interface Props {
  stations: Station[];
  userLocation: Coordinate;
  selectedFuelLabel: string;
  onStationPress: (station: Station) => void;
}

export default function MapView({
  stations,
  userLocation,
  selectedFuelLabel,
  onStationPress,
}: Props) {
  const cameraRef = useRef<CameraRef>(null);

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE_URL}
        logo={false}
        attribution={true}
        attributionPosition={{bottom: 8, left: 8}}>
        <Camera
          ref={cameraRef}
          center={[userLocation.longitude, userLocation.latitude]}
          zoom={13}
        />

        <UserLocation />

        {stations.map(station => (
          <StationMarker
            key={station.id}
            station={station}
            selectedFuelLabel={selectedFuelLabel}
            onPress={onStationPress}
          />
        ))}
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
