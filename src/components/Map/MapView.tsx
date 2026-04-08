import React, {useMemo, useRef, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Map,
  Camera,
  UserLocation,
  ShapeSource,
  CircleLayer,
  SymbolLayer,
  type CameraRef,
  type FeatureCollection,
} from '@maplibre/maplibre-react-native';
import {Station, Coordinate} from '../../types/station';
import {MAP_STYLE_URL} from '../../utils/constants';
import {formatMarkerPrice} from '../../utils/formatPrice';

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

  // Build GeoJSON feature collection from stations
  const featureCollection = useMemo<FeatureCollection>(() => {
    return {
      type: 'FeatureCollection',
      features: stations.map(station => {
        const fuel = station.prices.find(
          p => p.fuelType === selectedFuelLabel,
        );
        const price = fuel?.price ?? 0;
        return {
          type: 'Feature',
          id: station.id,
          properties: {
            id: station.id,
            price: formatMarkerPrice(price),
            color: station.color ?? '#888888',
          },
          geometry: {
            type: 'Point',
            coordinates: [station.longitude, station.latitude],
          },
        };
      }),
    };
  }, [stations, selectedFuelLabel]);

  const handleShapePress = useCallback(
    (event: any) => {
      const features = event?.features;
      if (features && features.length > 0) {
        const stationId = features[0].properties?.id;
        if (stationId) {
          const station = stations.find(s => s.id === stationId);
          if (station) {
            onStationPress(station);
          }
        }
      }
    },
    [stations, onStationPress],
  );

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

        {/* Station markers using ShapeSource (reliable touch on Android) */}
        <ShapeSource
          id="stations-source"
          shape={featureCollection}
          onPress={handleShapePress}>
          {/* Colored circle background */}
          <CircleLayer
            id="stations-circle"
            style={{
              circleRadius: 18,
              circleColor: ['get', 'color'],
              circleStrokeWidth: 1.5,
              circleStrokeColor: '#FFFFFF',
            }}
          />
          {/* Price text label */}
          <SymbolLayer
            id="stations-label"
            style={{
              textField: ['get', 'price'],
              textSize: 10,
              textColor: '#FFFFFF',
              textFont: ['Open Sans Bold'],
              textAllowOverlap: true,
              textIgnorePlacement: true,
            }}
          />
        </ShapeSource>
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
