import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text as RNText } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScannerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Handle the scanned data here
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    // You can navigate to a product details page or show a modal with the scanned info
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <RNText style={styles.text}>Requesting camera permission</RNText>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <RNText style={styles.text}>No access to camera</RNText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <RNText style={styles.headerTitle}>Scan Product</RNText>
        <View style={{ width: 24 }} />
      </View>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <RNText style={styles.instructionText}>
            Point your camera at a product's QR code or barcode
          </RNText>
        </View>
      </BarCodeScanner>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ScannerScreen;
