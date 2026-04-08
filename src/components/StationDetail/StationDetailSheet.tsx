import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Station} from '../../types/station';
import {formatDistance} from '../../utils/formatPrice';
import PriceRow from './PriceRow';

interface Props {
  station: Station | null;
  selectedFuelLabel: string;
  onClose: () => void;
}

export default function StationDetailSheet({
  station,
  selectedFuelLabel,
  onClose,
}: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['35%', '60%'], []);

  // Use index prop: -1 = closed, 0 = first snap point (open)
  const currentIndex = station ? 0 : -1;

  const handleNavigate = useCallback(() => {
    if (!station) return;
    const url = `geo:${station.latitude},${station.longitude}?q=${station.latitude},${station.longitude}(${encodeURIComponent(station.name)})`;
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web URL
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
      );
    });
  }, [station]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={currentIndex}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {station ? (
          <>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.name}>{station.name}</Text>
                <Text style={styles.address}>
                  {station.address}, {station.city}
                </Text>
                {station.distance !== undefined && (
                  <Text style={styles.distance}>
                    {formatDistance(station.distance)}
                  </Text>
                )}
              </View>
            </View>

            <Text style={styles.schedule}>{station.schedule}</Text>

            <View style={styles.pricesContainer}>
              <Text style={styles.sectionTitle}>Precios</Text>
              {station.prices.map(fuel => (
                <PriceRow
                  key={fuel.fuelType}
                  fuel={fuel}
                  isSelected={fuel.fuelType === selectedFuelLabel}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.navButton} onPress={handleNavigate}>
              <Text style={styles.navButtonText}>Cómo llegar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer} />
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  indicator: {
    backgroundColor: '#CCC',
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  distance: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '600',
    marginTop: 4,
  },
  schedule: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  pricesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  navButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    height: 1,
  },
});
