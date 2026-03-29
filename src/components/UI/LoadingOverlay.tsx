import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface Props {
  message?: string;
}

export default function LoadingOverlay({
  message = 'Cargando gasolineras...',
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
});
