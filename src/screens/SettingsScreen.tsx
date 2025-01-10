import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, List, Switch, RadioButton, Divider, useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { SPACING } from '../utils/constants';
import { useAppTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { isDark, themeMode, setThemeMode } = useAppTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Language</List.Subheader>
          <RadioButton.Group onValueChange={value => setLanguage(value)} value={language}>
            {languages.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
                labelStyle={{ color: theme.colors.onSurface }}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider style={{ backgroundColor: theme.colors.outline }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Currency</List.Subheader>
          <RadioButton.Group onValueChange={value => setCurrency(value)} value={currency}>
            {currencies.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
                labelStyle={{ color: theme.colors.onSurface }}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider style={{ backgroundColor: theme.colors.outline }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Theme</List.Subheader>
          <RadioButton.Group onValueChange={value => setThemeMode(value as 'light' | 'dark' | 'system')} value={themeMode}>
            <RadioButton.Item
              label="Light Theme"
              value="light"
              color={theme.colors.primary}
              labelStyle={{ color: theme.colors.onSurface }}
            />
            <RadioButton.Item
              label="Dark Theme"
              value="dark"
              color={theme.colors.primary}
              labelStyle={{ color: theme.colors.onSurface }}
            />
            <RadioButton.Item
              label="System Default"
              value="system"
              color={theme.colors.primary}
              labelStyle={{ color: theme.colors.onSurface }}
            />
          </RadioButton.Group>
        </List.Section>

        <Divider style={{ backgroundColor: theme.colors.outline }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>App Preferences</List.Subheader>
          <RadioButton.Group onValueChange={value => setSortBy(value)} value={sortBy}>
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Default Sort Order</Text>
            {sortOptions.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
                labelStyle={{ color: theme.colors.onSurface }}
              />
            ))}
          </RadioButton.Group>

          <View style={styles.spacer} />

          <RadioButton.Group onValueChange={value => setViewType(value)} value={viewType}>
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Default View</Text>
            {viewOptions.map((item) => (
              <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={theme.colors.primary}
                labelStyle={{ color: theme.colors.onSurface }}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider style={{ backgroundColor: theme.colors.outline }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Privacy</List.Subheader>
          <List.Item
            title="Location Tracking"
            titleStyle={{ color: theme.colors.onSurface }}
            description="Allow app to track your location for better recommendations"
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
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
            titleStyle={{ color: theme.colors.onSurface }}
            description="Help us improve by sharing usage data"
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
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
  },
  spacer: {
    height: SPACING.md,
  },
  label: {
    marginLeft: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    fontSize: 14,
  },
});

export default SettingsScreen;
