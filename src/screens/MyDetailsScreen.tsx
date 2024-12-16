import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

const MyDetailsScreen = () => {
  const theme = useTheme();
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
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            value={value}
            onChangeText={(text) => setFormData({ ...formData, [key]: text })}
            style={styles.input}
            mode="outlined"
          />
        ) : (
          <View style={styles.valueContainer}>
            <Text style={styles.fieldValue}>{value}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Details</Text>
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderField('First Name', formData.firstName, 'firstName')}
            {renderField('Last Name', formData.lastName, 'lastName')}
            {renderField('Date of Birth', formData.dateOfBirth, 'dateOfBirth')}
            {renderField('Gender', formData.gender, 'gender')}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {renderField('Email', formData.email, 'email')}
            {renderField('Phone', formData.phone, 'phone')}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            {renderField('Occupation', formData.occupation, 'occupation')}
            {renderField('Company', formData.company, 'company')}
          </View>

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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  valueContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  input: {
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default MyDetailsScreen;
