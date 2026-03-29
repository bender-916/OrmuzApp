import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import MapLibreGL, {type CameraRef} from '@maplibre/maplibre-react-native';
import {Station, Coordinate} from '../../types/station';
import {MAP_STYLE_URL} from '../../utils/constants';
import StationMarker from './StationMarker';

MapLibreGL.setAccessToken(null);

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
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={MAP_STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{bottom: 8, left: 8}}>
        <MapLibreGL.Camera
          ref={cameraRef}
          centerCoordinate={[userLocation.longitude, userLocation.latitude]}
          zoomLevel={13}
          animationDuration={1000}
        />

        <MapLibreGL.UserLocation visible={true} />

        {stations.map(station => (
          <StationMarker
            key={station.id}
            station={station}
            selectedFuelLabel={selectedFuelLabel}
            onPress={onStationPress}
          />
        ))}
      </MapLibreGL.MapView>
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
