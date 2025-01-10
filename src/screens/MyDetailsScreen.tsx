import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/constants';

const MyDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    occupation: 'Software Engineer',
    company: 'Tech Corp',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Add API call to save user details
  };

  const renderField = (label: string, value: string, key: keyof typeof formData) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
        {isEditing ? (
          <TextInput
            value={value}
            onChangeText={(text) => setFormData({ ...formData, [key]: text })}
            style={[styles.input, { backgroundColor: theme.colors.elevation.level1 }]}
            textColor={theme.colors.onSurface}
            mode="outlined"
          />
        ) : (
          <View style={styles.valueContainer}>
            <Text style={[styles.fieldValue, { color: theme.colors.onSurface }]}>{value}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <View style={styles.container}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.elevation.level2, ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }) }]}>
          <View style={styles.headerTop}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
              My Details
            </Text>
            <IconButton
              icon={isEditing ? 'check' : 'pencil'}
              iconColor={theme.colors.primary}
              size={24}
              onPress={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            />
          </View>
        </Surface>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Surface style={[styles.section, { backgroundColor: theme.colors.elevation.level1, ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }) }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Personal Information</Text>
            {renderField('First Name', formData.firstName, 'firstName')}
            {renderField('Last Name', formData.lastName, 'lastName')}
            {renderField('Date of Birth', formData.dateOfBirth, 'dateOfBirth')}
            {renderField('Gender', formData.gender, 'gender')}
          </Surface>

          <Surface style={[styles.section, { backgroundColor: theme.colors.elevation.level1, ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }) }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Contact Information</Text>
            {renderField('Email', formData.email, 'email')}
            {renderField('Phone', formData.phone, 'phone')}
          </Surface>

          <Surface style={[styles.section, { backgroundColor: theme.colors.elevation.level1, ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }) }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Professional Information</Text>
            {renderField('Occupation', formData.occupation, 'occupation')}
            {renderField('Company', formData.company, 'company')}
          </Surface>

          {isEditing && (
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsEditing(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
  },
  valueContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default MyDetailsScreen;
