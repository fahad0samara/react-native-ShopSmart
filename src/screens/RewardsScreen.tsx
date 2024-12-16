import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, ProgressBar, List, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const RewardsScreen = () => {
  const theme = useTheme();

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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Surface style={styles.pointsCard} elevation={2}>
          <View style={styles.pointsHeader}>
            <MaterialCommunityIcons name="star-circle" size={40} color={theme.colors.primary} />
            <View style={styles.pointsInfo}>
              <Text variant="titleLarge">1,275 Points</Text>
              <Text variant="bodyMedium">Silver Member</Text>
            </View>
          </View>
          <View style={styles.tierProgress}>
            <Text variant="bodySmall">725 points to Gold</Text>
            <ProgressBar
              progress={0.63}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <View style={styles.tierLabels}>
              <Text variant="bodySmall">Silver</Text>
              <Text variant="bodySmall">Gold</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Available Rewards
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {rewards.map((reward) => (
              <Card key={reward.id} style={styles.rewardCard}>
                <Card.Content>
                  <MaterialCommunityIcons
                    name={reward.icon as any}
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text variant="titleMedium" style={styles.rewardTitle}>
                    {reward.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.pointsRequired}>
                    {reward.points} Points
                  </Text>
                  <Text variant="bodySmall" style={styles.rewardDescription}>
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
          <Text variant="titleMedium" style={styles.sectionTitle}>
            How to Earn Points
          </Text>
          <Card style={styles.earnCard}>
            <Card.Content>
              <List.Item
                title="Make a Purchase"
                description="Earn 1 point for every $1 spent"
                left={props => <List.Icon {...props} icon="cart" />}
              />
              <List.Item
                title="Write a Review"
                description="Earn 50 points per review"
                left={props => <List.Icon {...props} icon="star" />}
              />
              <List.Item
                title="Refer a Friend"
                description="Earn 200 points per referral"
                left={props => <List.Icon {...props} icon="account-plus" />}
              />
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Points History
          </Text>
          <Card style={styles.historyCard}>
            <Card.Content>
              {history.map((item) => (
                <React.Fragment key={item.id}>
                  <List.Item
                    title={item.title}
                    description={`${item.description} • ${item.date}`}
                    right={() => (
                      <Text
                        style={[
                          styles.pointsText,
                          { color: item.points.startsWith('+') ? 'green' : 'red' },
                        ]}
                      >
                        {item.points}
                      </Text>
                    )}
                  />
                  {item.id !== history[history.length - 1].id && <Divider />}
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
    backgroundColor: '#fff',
  },
  pointsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsInfo: {
    marginLeft: 12,
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
    marginBottom: 24,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  rewardCard: {
    width: 200,
    marginHorizontal: 8,
    marginLeft: 16,
  },
  rewardTitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  pointsRequired: {
    marginBottom: 4,
    opacity: 0.7,
  },
  rewardDescription: {
    opacity: 0.7,
  },
  redeemButton: {
    marginTop: 8,
  },
  earnCard: {
    marginHorizontal: 16,
  },
  historyCard: {
    marginHorizontal: 16,
  },
  pointsText: {
    fontWeight: 'bold',
  },
});

export default RewardsScreen;
