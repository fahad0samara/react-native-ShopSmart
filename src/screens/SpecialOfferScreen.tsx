import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text as RNText } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SpecialOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { offer } = route.params as { offer: any };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <RNText style={styles.headerTitle}>Special Offer</RNText>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.offerCard, { backgroundColor: offer.backgroundColor }]}>
        <RNText style={[styles.offerTitle, { color: offer.textColor }]}>
          {offer.title}
        </RNText>
        <RNText style={[styles.offerSubtitle, { color: offer.textColor }]}>
          {offer.subtitle}
        </RNText>
      </View>

      <View style={styles.content}>
        <RNText style={styles.sectionTitle}>Offer Details</RNText>
        <RNText style={styles.description}>
          Take advantage of this amazing offer! Terms and conditions apply.
        </RNText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  offerCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  offerSubtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default SpecialOfferScreen;
