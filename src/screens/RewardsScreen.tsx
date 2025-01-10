import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, List, useTheme, Surface, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const RewardsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const rewards = [
    {
      id: '1',
      title: '$5 Off Your Next Order',
      points: 500,
      description: 'Get $5 off on your next purchase',
      icon: 'cash',
    },
    {
      id: '2',
      title: 'Free Delivery',
      points: 1000,
      description: 'Free delivery on your next order',
      icon: 'truck-delivery',
    },
    {
      id: '3',
      title: '10% Discount',
      points: 2000,
      description: '10% off on your next purchase',
      icon: 'percent',
    },
  ];

  const history = [
    {
      id: '1',
      title: 'Points Earned',
      points: '+50',
      date: '2023-12-15',
      description: 'Order #1234',
    },
    {
      id: '2',
      title: 'Reward Redeemed',
      points: '-500',
      date: '2023-12-10',
      description: '$5 Off Coupon',
    },
    {
      id: '3',
      title: 'Points Earned',
      points: '+75',
      date: '2023-12-05',
      description: 'Order #1233',
    },
  ];

  const handleRedeem = (reward: typeof rewards[0]) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Add redemption logic here
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          My Rewards
        </Text>
      </View>
      
      <ScrollView>
        <Surface style={[styles.pointsCard, { backgroundColor: theme.colors.elevation.level2 }]} elevation={2}>
          <View style={styles.pointsHeader}>
            <MaterialCommunityIcons name="star-circle" size={40} color={theme.colors.primary} />
            <View style={styles.pointsInfo}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>1,275 Points</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Silver Member</Text>
            </View>
          </View>
          <View style={styles.tierProgress}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>725 points to Gold</Text>
            <ProgressBar
              progress={0.63}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <View style={styles.tierLabels}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Silver</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Gold</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Available Rewards
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsScroll}>
            {rewards.map((reward) => (
              <Card key={reward.id} style={[styles.rewardCard, { backgroundColor: theme.colors.elevation.level1 }]}>
                <Card.Content>
                  <MaterialCommunityIcons
                    name={reward.icon}
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text variant="titleMedium" style={[styles.rewardTitle, { color: theme.colors.onSurface }]}>
                    {reward.title}
                  </Text>
                  <Text variant="bodySmall" style={[styles.pointsRequired, { color: theme.colors.onSurfaceVariant }]}>
                    {reward.points} Points
                  </Text>
                  <Text variant="bodySmall" style={[styles.rewardDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {reward.description}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained"
                    onPress={() => handleRedeem(reward)}
                    style={styles.redeemButton}
                  >
                    Redeem
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            How to Earn Points
          </Text>
          <Card style={[styles.earnCard, { backgroundColor: theme.colors.elevation.level1 }]}>
            <Card.Content>
              <List.Item
                title="Make a Purchase"
                description="Earn 1 point for every $1 spent"
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                left={props => <List.Icon {...props} icon="cart" color={theme.colors.primary} />}
              />
              <List.Item
                title="Write a Review"
                description="Earn 50 points per review"
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                left={props => <List.Icon {...props} icon="star" color={theme.colors.primary} />}
              />
              <List.Item
                title="Refer a Friend"
                description="Earn 200 points per referral"
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                left={props => <List.Icon {...props} icon="account-plus" color={theme.colors.primary} />}
              />
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Points History
          </Text>
          <Card style={[styles.historyCard, { backgroundColor: theme.colors.elevation.level1 }]}>
            <Card.Content>
              {history.map((item, index) => (
                <React.Fragment key={item.id}>
                  <List.Item
                    title={item.title}
                    description={`${item.description} • ${item.date}`}
                    titleStyle={{ color: theme.colors.onSurface }}
                    descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                    right={() => (
                      <Text
                        variant="bodyLarge"
                        style={[
                          styles.pointsText,
                          { color: item.points.startsWith('+') ? theme.colors.primary : theme.colors.error },
                        ]}
                      >
                        {item.points}
                      </Text>
                    )}
                  />
                  {index < history.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    margin: 0,
  },
  pointsCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsInfo: {
    marginLeft: 16,
  },
  tierProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  rewardsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  rewardCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
  },
  rewardTitle: {
    marginTop: 12,
    marginBottom: 4,
  },
  pointsRequired: {
    marginBottom: 8,
  },
  rewardDescription: {
    marginBottom: 16,
  },
  redeemButton: {
    marginTop: 8,
  },
  earnCard: {
    borderRadius: 12,
  },
  historyCard: {
    borderRadius: 12,
  },
  pointsText: {
    fontWeight: 'bold',
  },
});

export default RewardsScreen;
