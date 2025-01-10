import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Text, Card, Button, useTheme, TextInput, Portal, Modal, IconButton, Chip, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Rating from '../components/Rating';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import { theme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';

const MyReviewsScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchReviews();
    } else {
      setLoading(false);
      setError('Please login to view your reviews');
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user?.id) {
        setError('Please login to view your reviews');
        setLoading(false);
        return;
      }

      const [pendingRes, completedRes] = await Promise.all([
        axios.get(`${API_URL}/reviews/pending/${user.id}`),
        axios.get(`${API_URL}/reviews/completed/${user.id}`)
      ]);

      setPendingReviews(pendingRes.data);
      setMyReviews(completedRes.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = (review) => {
    setSelectedReview({ ...review, isEdit: false });
    setEditRating(0);
    setEditComment('');
    setShowEditModal(true);
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEditReview = (review) => {
    setSelectedReview({ ...review, isEdit: true });
    setEditRating(review.rating);
    setEditComment(review.comment);
    setShowEditModal(true);
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveReview = async () => {
    try {
      const reviewData = {
        userId: user.id,
        productId: selectedReview.productId,
        orderId: selectedReview.orderId,
        rating: editRating,
        comment: editComment,
      };

      if (selectedReview.isEdit) {
        await axios.put(`${API_URL}/reviews/${selectedReview.id}`, reviewData);
      } else {
        await axios.post(`${API_URL}/reviews`, reviewData);
      }

      // Refresh reviews after submission
      await fetchReviews();
      setShowEditModal(false);
      
      // Provide haptic feedback for success
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving review:', error);
      // Provide haptic feedback for error
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleMedium" style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
        {!user && (
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('ProfileScreen', { screen: 'Login' })}
            style={styles.loginButton}
          >
            Login
          </Button>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Surface style={[styles.header, { backgroundColor: theme.colors.elevation.level2 }]}>
        <View style={styles.headerTop}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            My Reviews
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text variant="titleLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
                {pendingReviews.length}
              </Text>
            </View>
            <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Pending
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.outline }]} />
          <View style={styles.statItem}>
            <View style={[styles.statBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Text variant="titleLarge" style={[styles.statNumber, { color: theme.colors.secondary }]}>
                {myReviews.length}
              </Text>
            </View>
            <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Completed
            </Text>
          </View>
        </View>
      </Surface>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pendingReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Pending Reviews
                </Text>
              </View>
              <Chip 
                mode="outlined" 
                style={[styles.sectionChip, { backgroundColor: theme.colors.elevation.level1 }]}
                textStyle={{ color: theme.colors.onSurfaceVariant }}
              >
                {pendingReviews.length} items
              </Chip>
            </View>
            {pendingReviews.map((review) => (
              <Card 
                key={review.id} 
                style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]} 
                mode="outlined"
              >
                <Card.Content style={styles.cardInner}>
                  <View style={styles.cardContent}>
                    <Image 
                      source={{ uri: review.image }} 
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                      <Text variant="titleMedium" style={[styles.productName, { color: theme.colors.onSurface }]}>
                        {review.productName}
                      </Text>
                      <View style={styles.dateContainer}>
                        <MaterialCommunityIcons 
                          name="calendar" 
                          size={16} 
                          color={theme.colors.onSurfaceVariant}
                        />
                        <Text variant="bodySmall" style={[styles.orderDate, { color: theme.colors.onSurfaceVariant }]}>
                          Ordered on {review.orderDate}
                        </Text>
                      </View>
                      <Button
                        mode="contained"
                        onPress={() => handleWriteReview(review)}
                        style={styles.writeButton}
                        contentStyle={styles.writeButtonContent}
                        icon="pencil"
                      >
                        Write Review
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {myReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons 
                  name="star-outline" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  My Reviews
                </Text>
              </View>
              <Chip 
                mode="outlined" 
                style={[styles.sectionChip, { backgroundColor: theme.colors.elevation.level1 }]}
                textStyle={{ color: theme.colors.onSurfaceVariant }}
              >
                {myReviews.length} reviews
              </Chip>
            </View>
            {myReviews.map((review) => (
              <Card 
                key={review.id} 
                style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]} 
                mode="outlined"
              >
                <Card.Content style={styles.cardInner}>
                  <View style={styles.cardContent}>
                    <Image 
                      source={{ uri: review.image }} 
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                      <Text variant="titleMedium" style={[styles.productName, { color: theme.colors.onSurface }]}>
                        {review.productName}
                      </Text>
                      <View style={styles.ratingContainer}>
                        <Rating value={review.rating} size={20} />
                        <View style={styles.dateContainer}>
                          <MaterialCommunityIcons 
                            name="calendar" 
                            size={16} 
                            color={theme.colors.onSurfaceVariant}
                          />
                          <Text variant="bodySmall" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                            {review.date}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.reviewContent}>
                    <Text variant="bodyMedium" style={[styles.comment, { color: theme.colors.onSurface }]}>
                      {review.comment}
                    </Text>
                    <View style={styles.reviewStats}>
                      <Chip 
                        icon="thumb-up" 
                        style={[styles.chip, styles.statChip, { backgroundColor: theme.colors.elevation.level1 }]}
                        textStyle={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {review.likes} Likes
                      </Chip>
                      <Chip 
                        icon="check-circle" 
                        style={[styles.chip, styles.statChip, { backgroundColor: theme.colors.elevation.level1 }]}
                        textStyle={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {review.helpful} Helpful
                      </Chip>
                    </View>
                    <Button
                      mode="outlined"
                      onPress={() => handleEditReview(review)}
                      style={styles.editButton}
                      icon="pencil"
                    >
                      Edit Review
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          contentContainerStyle={[styles.modalWrapper, { backgroundColor: theme.colors.elevation.level3 }]}
        >
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text variant="titleLarge" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                  {selectedReview?.isEdit ? 'Edit Review' : 'Write Review'}
                </Text>
                <Button
                  mode="text"
                  onPress={() => setShowEditModal(false)}
                  style={styles.closeButton}
                  icon="close"
                >
                  Close
                </Button>
              </View>

              <View style={styles.productDetails}>
                <Image 
                  source={{ uri: selectedReview?.image }} 
                  style={styles.modalProductImage} 
                  resizeMode="cover"
                />
                <View style={styles.productDetailsText}>
                  <Text variant="titleMedium" style={[styles.modalProductName, { color: theme.colors.onSurface }]}>
                    {selectedReview?.productName}
                  </Text>
                  <Text variant="bodySmall" style={[styles.modalOrderDate, { color: theme.colors.onSurfaceVariant }]}>
                    Ordered on {selectedReview?.orderDate}
                  </Text>
                </View>
              </View>

              <View style={styles.ratingSection}>
                <Text variant="titleMedium" style={[styles.ratingTitle, { color: theme.colors.onSurface }]}>
                  Rate this product
                </Text>
                <Rating
                  value={editRating}
                  onValueChange={(value) => {
                    setEditRating(value);
                    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  size={32}
                />
                <Text variant="bodyMedium" style={[
                  styles.ratingFeedback,
                  { color: editRating > 3 ? theme.colors.primary : 
                         editRating > 0 ? theme.colors.error : 
                         theme.colors.onSurfaceVariant }
                ]}>
                  {editRating === 0 ? 'Tap the stars to rate' : 
                   editRating === 5 ? 'Excellent! Loved it!' :
                   editRating === 4 ? 'Very Good' :
                   editRating === 3 ? 'Good' :
                   editRating === 2 ? 'Fair' :
                   'Needs Improvement'}
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text variant="titleMedium" style={[styles.reviewTitle, { color: theme.colors.onSurface }]}>
                  Write your review
                </Text>
                <TextInput
                  mode="outlined"
                  value={editComment}
                  onChangeText={setEditComment}
                  multiline
                  numberOfLines={4}
                  style={styles.reviewInput}
                  placeholder="Share what you liked or didn't like about this product..."
                />
              </View>

              <View style={styles.modalFooter}>
                <Button
                  mode="outlined"
                  onPress={() => setShowEditModal(false)}
                  style={styles.footerButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveReview}
                  style={[styles.footerButton, styles.submitButton]}
                  disabled={!editRating || !editComment.trim()}
                >
                  Submit Review
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  statLabel: {
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '600',
    marginLeft: 12,
    fontSize: 20,
  },
  sectionChip: {
    backgroundColor: theme.colors.elevation.level1,
  },
  card: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  cardInner: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 20,
  },
  productName: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 18,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    color: theme.colors.onSurfaceVariant,
    marginLeft: 6,
  },
  writeButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  writeButtonContent: {
    paddingHorizontal: 12,
  },
  ratingContainer: {
    marginTop: 8,
  },
  date: {
    marginLeft: 6,
    color: theme.colors.onSurfaceVariant,
  },
  reviewContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  comment: {
    marginBottom: 20,
    lineHeight: 22,
    fontSize: 16,
  },
  reviewStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  chip: {
    marginRight: 12,
  },
  statChip: {
    backgroundColor: theme.colors.elevation.level1,
  },
  chipText: {
    fontSize: 13,
  },
  editButton: {
    alignSelf: 'flex-end',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalWrapper: {
    backgroundColor: theme.colors.elevation.level3,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  closeButton: {
    margin: 0,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.elevation.level1,
    borderRadius: 16,
  },
  modalProductImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  productDetailsText: {
    flex: 1,
    marginLeft: 16,
  },
  modalProductName: {
    fontWeight: '600',
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  modalOrderDate: {
    color: theme.colors.onSurfaceVariant,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.elevation.level1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  ratingTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  ratingFeedback: {
    marginTop: 12,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  reviewInput: {
    backgroundColor: theme.colors.elevation.level1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  footerButton: {
    minWidth: 120,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 16,
    color: theme.colors.error,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
  },
});

export default MyReviewsScreen;
