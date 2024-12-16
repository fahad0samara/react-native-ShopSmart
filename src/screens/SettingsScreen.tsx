import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, RadioButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const SettingsScreen = () => {
  const theme = useTheme();
  const [language, setLanguage] = useState('english');
  const [currency, setCurrency] = useState('usd');
  const [sortBy, setSortBy] = useState('name');
  const [viewType, setViewType] = useState('grid');
  const [locationTracking, setLocationTracking] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const languages = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'Arabic', value: 'arabic' },
  ];

  const currencies = [
    { label: 'USD ($)', value: 'usd' },
    { label: 'EUR (€)', value: 'eur' },
    { label: 'GBP (£)', value: 'gbp' },
    { label: 'JPY (¥)', value: 'jpy' },
  ];

  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating', value: 'rating' },
  ];

  const viewOptions = [
    { label: 'Grid View', value: 'grid' },
    { label: 'List View', value: 'list' },
  ];

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (value: boolean) => {
      setter(value);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader>Language</List.Subheader>
          <RadioButton.Group onValueChange={value => setLanguage(value)} value={language}>
            {languages.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Currency</List.Subheader>
          <RadioButton.Group onValueChange={value => setCurrency(value)} value={currency}>
            {currencies.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>App Preferences</List.Subheader>
          <RadioButton.Group onValueChange={value => setSortBy(value)} value={sortBy}>
            <Text style={styles.label}>Default Sort Order</Text>
            {sortOptions.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
              />
            ))}
          </RadioButton.Group>

          <View style={styles.spacer} />

          <RadioButton.Group onValueChange={value => setViewType(value)} value={viewType}>
            <Text style={styles.label}>Default View</Text>
            {viewOptions.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Privacy</List.Subheader>
          <List.Item
            title="Location Tracking"
            description="Allow app to track your location for better recommendations"
            right={() => (
              <Switch
                value={locationTracking}
                onValueChange={handleToggle(setLocationTracking)}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Analytics"
            description="Help us improve by sharing usage data"
            right={() => (
              <Switch
                value={analytics}
                onValueChange={handleToggle(setAnalytics)}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  spacer: {
    height: 16,
  },
});

export default SettingsScreen;
