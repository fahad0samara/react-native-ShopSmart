import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share, Linking, Dimensions, Platform, StatusBar, Image } from 'react-native';
import { Text, Card, Button, Portal, Modal, ProgressBar, IconButton, Divider, Badge, useTheme, Searchbar, Menu, FAB, Rating, TextInput, Avatar, Chip } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { BlurView } from 'expo-blur';
import { theme } from '../utils/theme';

const generatePDFInvoice = async (order) => {
  try {
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { 
              font-family: 'Helvetica'; 
              padding: 20px;
              background-color: #f8f9fa;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 15px;
              display: block;
            }
            .order-info { 
              margin-bottom: 20px;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px;
              background-color: #fff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .items-table th { 
              background-color: #f8f9fa;
              color: #495057;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 12px;
              padding: 12px;
              text-align: left;
              border-bottom: 2px solid #dee2e6;
            }
            .items-table td { 
              padding: 12px;
              border-bottom: 1px solid #dee2e6;
              color: #495057;
            }
            .items-table tr:last-child td {
              border-bottom: none;
            }
            .total { 
              margin-top: 20px;
              text-align: right;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .total h3 {
              color: #2196F3;
              font-size: 24px;
              margin: 0;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
              text-transform: uppercase;
              color: white;
            }
            .status-processing { background-color: #2196F3; }
            .status-delivered { background-color: #4CAF50; }
            .status-cancelled { background-color: #F44336; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6c757d;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://your-logo-url.com/logo.png" alt="Logo" class="logo" />
            <h1 style="color: #2196F3; margin: 0;">Invoice</h1>
            <p style="color: #6c757d; margin: 5px 0;">Order #${order.id.slice(-8)}</p>
            <p style="color: #6c757d; margin: 5px 0;">${moment(order.date).format('MMMM D, YYYY')}</p>
          </div>
          
          <div class="order-info">
            <p style="margin: 5px 0;">
              <strong>Status: </strong>
              <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
            </p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            ${order.deliveryInstructions ? `
              <p style="margin: 5px 0;"><strong>Delivery Instructions:</strong> ${order.deliveryInstructions}</p>
            ` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <h3>Total: $${order.total.toFixed(2)}</h3>
          </div>

          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>For any questions, please contact our support team.</p>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Invoice for Order #${order.id.slice(-8)}`,
      UTI: 'com.adobe.pdf'
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert(
      'Error',
      'Failed to generate invoice. Please try again later.'
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};

const OrdersScreen = () => {
  const { orders, deleteOrder, reorderItems, user } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [rating, setRating] = useState(0);
  const [orderNote, setOrderNote] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [fabOpen, setFabOpen] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();
  const rowTranslateAnimatedValue = useRef({}).current;

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleMedium" style={styles.errorText}>
          Please login to view your orders
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('ProfileScreen', { screen: 'Login' })}
          style={styles.loginButton}
        >
          Login
        </Button>
      </View>
    );
  }

  // Group orders by date
  const groupedOrders = orders.reduce((groups, order) => {
    const date = moment(order.date).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});

  // Analytics data
  const getAnalyticsData = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const statusCount = orders.reduce((count, order) => {
      count[order.status] = (count[order.status] || 0) + 1;
      return count;
    }, {});
    
    const monthlySpending = orders.reduce((monthly, order) => {
      const month = moment(order.date).format('MMM');
      monthly[month] = (monthly[month] || 0) + order.total;
      return monthly;
    }, {});

    return {
      totalOrders,
      totalSpent,
      statusCount,
      monthlySpending
    };
  };

  const renderOrderTimeline = (order) => {
    const timelineEvents = [
      { status: 'Order Placed', date: order.date },
      { status: 'Processing', date: order.processingDate },
      { status: 'In Transit', date: order.inTransitDate },
      { status: 'Delivered', date: order.deliveredDate },
    ];

    return (
      <View style={styles.timeline}>
        {timelineEvents.map((event, index) => (
          <View key={index} style={styles.timelineEvent}>
            <View style={[styles.timelineDot, { backgroundColor: event.date ? theme.colors.primary : '#ccc' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>{event.status}</Text>
              {event.date && <Text style={styles.timelineDate}>{moment(event.date).format('LLL')}</Text>}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderAnalytics = () => {
    const analytics = getAnalyticsData();
    const maxSpending = Math.max(...Object.values(analytics.monthlySpending));

    return (
      <Modal
        visible={showAnalytics}
        onDismiss={() => setShowAnalytics(false)}
        contentContainerStyle={styles.analyticsModal}
      >
        <ScrollView>
          <View style={styles.modalHeader}>
            <Text style={styles.analyticsTitle}>Order Analytics</Text>
            <IconButton icon="close" onPress={() => setShowAnalytics(false)} />
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Total Orders</Text>
            <Text style={styles.analyticsValue}>{analytics.totalOrders}</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Total Spent</Text>
            <Text style={styles.analyticsValue}>${analytics.totalSpent.toFixed(2)}</Text>
          </View>

          <Text style={styles.chartTitle}>Monthly Spending</Text>
          <View style={styles.barChart}>
            {Object.entries(analytics.monthlySpending).map(([month, amount]) => (
              <View key={month} style={styles.barContainer}>
                <Text style={styles.barLabel}>{month}</Text>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (amount / maxSpending) * 150,
                        backgroundColor: theme.colors.primary 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barValue}>${amount.toFixed(0)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsLabel}>Order Status</Text>
            {Object.entries(analytics.statusCount).map(([status, count]) => (
              <View key={status} style={styles.statusRow}>
                <View style={styles.statusLabelContainer}>
                  <Badge 
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}
                  >
                    {status}
                  </Badge>
                  <Text style={styles.statusCount}>{count} orders</Text>
                </View>
                <View style={styles.statusBarContainer}>
                  <View 
                    style={[
                      styles.statusBar,
                      { 
                        width: `${(count / analytics.totalOrders) * 100}%`,
                        backgroundColor: getStatusColor(status)
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Modal>
    );
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'total':
          return b.total - a.total;
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'processing':
        return 'orange';
      case 'shipped':
        return 'blue';
      default:
        return 'grey';
    }
  };

  const getProgressValue = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 0.25;
      case 'processing':
        return 0.5;
      case 'shipped':
        return 0.75;
      case 'delivered':
        return 1;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const handleDeleteOrder = (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            deleteOrder(orderId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleReorder = (orderId) => {
    if (reorderItems(orderId)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Items added to cart!");
      navigation.navigate('Cart');
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedOrder(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async (order) => {
    try {
      const result = await Share.share({
        message: 
          `Order #${order.id.slice(-8)}\n` +
          `Status: ${order.status}\n` +
          `Total: $${order.total.toFixed(2)}\n` +
          `Items:\n${order.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}`,
        title: 'Order Details'
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while sharing');
    }
  };

  const handleTrackDelivery = (order) => {
    setShowMap(true);
  };

  const handleContactSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleSubmitRating = (order) => {
    Alert.alert('Thank You!', 'Your feedback has been submitted.');
    setRating(0);
    hideModal();
  };

  const renderHiddenItem = useCallback(({ item }) => (
    <View style={styles.rowBack}>
      <IconButton
        icon="delete"
        iconColor={theme.colors.error}
        size={24}
        onPress={() => deleteOrder(item.id)}
        style={[styles.backRightBtn, styles.backRightBtnRight]}
      />
      <IconButton
        icon="star"
        iconColor={theme.colors.primary}
        size={24}
        onPress={() => navigation.navigate('Reviews', { order: item })}
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
      />
    </View>
  ), []);

  const renderItem = useCallback(({ item }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.orderHeader}>
          <View>
            <Text variant="titleMedium" style={styles.orderId}>
              Order #{item.id.slice(-8)}
            </Text>
            <Text variant="bodySmall" style={styles.orderDate}>
              {moment(item.date).format('MMM D, YYYY')}
            </Text>
          </View>
          <View style={styles.orderActions}>
            {item.hasReview ? (
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons 
                  name="star" 
                  size={16} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            ) : (
              <Button
                mode="outlined"
                icon="star-outline"
                onPress={() => navigation.navigate('Reviews', { order: item })}
                style={styles.reviewButton}
                labelStyle={styles.reviewButtonLabel}
              >
                Review
              </Button>
            )}
            <IconButton
              icon="dots-vertical"
              onPress={() => {
                setSelectedOrder(item);
                setVisible(true);
              }}
            />
          </View>
        </View>
        <ProgressBar 
          progress={getProgressValue(item.status)} 
          color={getStatusColor(item.status)}
          style={styles.progressBar} 
        />
        <View style={styles.itemsList}>
          {item.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Avatar.Image 
                size={40} 
                source={{ uri: item.image }} 
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />
        
        <View style={styles.orderSummary}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            onPress={() => handleReorder(item.id)}
            style={styles.actionButton}
            icon="refresh"
          >
            Reorder
          </Button>
          <Button 
            mode="outlined"
            onPress={() => generatePDFInvoice(item)}
            style={styles.actionButton}
            icon="file-download"
          >
            Invoice
          </Button>
          <Button 
            mode="outlined"
            onPress={() => handleShare(item)}
            style={styles.actionButton}
            icon="share-variant"
          >
            Share
          </Button>
        </View>
      </Card.Content>
    </Card>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search orders..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor={theme.colors.primary}
              inputStyle={styles.searchInput}
            />
            <Menu
              visible={filterMenuVisible}
              onDismiss={() => setFilterMenuVisible(false)}
              anchor={
                <IconButton
                  icon="filter-variant"
                  size={24}
                  onPress={() => setFilterMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                title="All Orders"
                onPress={() => {
                  setFilterStatus('all');
                  setFilterMenuVisible(false);
                }}
                leadingIcon="filter-variant-remove"
              />
              <Menu.Item
                title="Processing"
                onPress={() => {
                  setFilterStatus('processing');
                  setFilterMenuVisible(false);
                }}
                leadingIcon="progress-clock"
              />
              <Menu.Item
                title="Out for Delivery"
                onPress={() => {
                  setFilterStatus('out_for_delivery');
                  setFilterMenuVisible(false);
                }}
                leadingIcon="truck-delivery"
              />
              <Menu.Item
                title="Delivered"
                onPress={() => {
                  setFilterStatus('delivered');
                  setFilterMenuVisible(false);
                }}
                leadingIcon="check-circle"
              />
              <Divider />
              <Menu.Item
                title="Sort by Date"
                onPress={() => {
                  setSortBy('date');
                  setFilterMenuVisible(false);
                }}
                leadingIcon="calendar"
              />
              <Menu.Item
                title="Sort by Price"
                onPress={() => {
                  setSortBy('price');
                  setFilterMenuVisible(false);
                }}
                leadingIcon="cash"
              />
            </Menu>
            <View style={styles.filterChips}>
              {filterStatus !== 'all' && (
                <Chip 
                  mode="outlined" 
                  onClose={() => setFilterStatus('all')}
                  style={styles.filterChip}
                >
                  {filterStatus.replace('_', ' ')}
                </Chip>
              )}
              <Chip 
                mode="outlined" 
                icon={sortBy === 'date' ? 'calendar' : 'cash'}
                style={styles.filterChip}
              >
                Sort: {sortBy === 'date' ? 'Date' : 'Price'}
              </Chip>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="cart-outline" 
                size={80} 
                color={theme.colors.primary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubtext}>
                Start shopping to see your orders here
              </Text>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Home')}
                style={styles.shopButton}
                labelStyle={styles.shopButtonLabel}
              >
                Start Shopping
              </Button>
            </View>
          ) : (
            <SwipeListView
              data={filteredOrders}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-100}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              disableRightSwipe
              keyExtractor={(item) => item.id}
            />
          )}
        </ScrollView>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedOrder && (
              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text variant="headlineSmall" style={styles.modalTitle}>
                      Order Details
                    </Text>
                    <Text variant="bodyMedium" style={styles.modalSubtitle}>
                      #{selectedOrder.id.slice(-8)}
                    </Text>
                  </View>
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={hideModal}
                    style={styles.closeButton}
                  />
                </View>

                <View style={styles.statusSection}>
                  <Badge
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(selectedOrder.status) }
                    ]}
                  >
                    {selectedOrder.status}
                  </Badge>
                  <ProgressBar
                    progress={getProgressValue(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                    style={styles.modalProgressBar}
                  />
                </View>

                <Card style={styles.modalCard}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Order Timeline
                    </Text>
                    <View style={styles.timeline}>
                      {[
                        { status: 'Order Placed', icon: 'cart-check', time: selectedOrder.date },
                        { status: 'Processing', icon: 'package-variant', time: selectedOrder.processingDate },
                        { status: 'Out for Delivery', icon: 'truck-delivery', time: selectedOrder.outForDeliveryDate },
                        { status: 'Delivered', icon: 'check-circle', time: selectedOrder.deliveryDate }
                      ].map((step, index) => (
                        <View key={index} style={styles.timelineStep}>
                          <View style={[
                            styles.timelineIcon,
                            { backgroundColor: getTimelineColor(selectedOrder.status, step.status) }
                          ]}>
                            <MaterialCommunityIcons
                              name={step.icon}
                              size={24}
                              color="white"
                            />
                          </View>
                          <View style={styles.timelineContent}>
                            <Text variant="bodyLarge" style={styles.timelineStatus}>
                              {step.status}
                            </Text>
                            {step.time && (
                              <Text variant="bodySmall" style={styles.timelineTime}>
                                {moment(step.time).format('MMM D, h:mm A')}
                              </Text>
                            )}
                          </View>
                          {index < 3 && <View style={styles.timelineLine} />}
                        </View>
                      ))}
                    </View>
                  </Card.Content>
                </Card>

                <Card style={styles.modalCard}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Order Analytics
                    </Text>
                    <View style={styles.analyticsRow}>
                      <View style={styles.analyticItem}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={24}
                          color={theme.colors.primary}
                        />
                        <Text variant="titleLarge" style={styles.analyticValue}>
                          {getDeliveryTime(selectedOrder)}
                        </Text>
                        <Text variant="bodySmall">Delivery Time</Text>
                      </View>
                      <View style={styles.analyticItem}>
                        <MaterialCommunityIcons
                          name="package-variant"
                          size={24}
                          color={theme.colors.primary}
                        />
                        <Text variant="titleLarge" style={styles.analyticValue}>
                          {selectedOrder.items.length}
                        </Text>
                        <Text variant="bodySmall">Items</Text>
                      </View>
                      <View style={styles.analyticItem}>
                        <MaterialCommunityIcons
                          name="cash"
                          size={24}
                          color={theme.colors.primary}
                        />
                        <Text variant="titleLarge" style={styles.analyticValue}>
                          ${selectedOrder.total.toFixed(2)}
                        </Text>
                        <Text variant="bodySmall">Total</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>

                <Card style={styles.modalCard}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Delivery Location
                    </Text>
                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: selectedOrder.latitude || 24.7136,
                          longitude: selectedOrder.longitude || 46.6753,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: selectedOrder.latitude || 24.7136,
                            longitude: selectedOrder.longitude || 46.6753,
                          }}
                          title="Delivery Location"
                          description={selectedOrder.deliveryAddress}
                        >
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={36}
                            color={theme.colors.primary}
                          />
                        </Marker>
                      </MapView>
                    </View>
                    <View style={styles.deliveryInfo}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text variant="bodyMedium" style={styles.deliveryText}>
                        {selectedOrder.deliveryAddress}
                      </Text>
                    </View>
                    {selectedOrder.deliveryInstructions && (
                      <View style={styles.deliveryInfo}>
                        <MaterialCommunityIcons
                          name="information"
                          size={20}
                          color={theme.colors.primary}
                        />
                        <Text variant="bodyMedium" style={styles.deliveryText}>
                          {selectedOrder.deliveryInstructions}
                        </Text>
                      </View>
                    )}
                    <Button
                      mode="outlined"
                      icon="directions"
                      onPress={() => {
                        const url = Platform.select({
                          ios: `maps:${selectedOrder.latitude},${selectedOrder.longitude}`,
                          android: `google.navigation:q=${selectedOrder.latitude},${selectedOrder.longitude}`
                        });
                        Linking.openURL(url);
                      }}
                      style={styles.directionsButton}
                    >
                      Get Directions
                    </Button>
                  </Card.Content>
                </Card>

                <Card style={styles.modalCard}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Order Summary
                    </Text>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={styles.modalItemRow}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.modalItemImage}
                        />
                        <View style={styles.modalItemInfo}>
                          <Text variant="bodyLarge" style={styles.modalItemName}>
                            {item.name}
                          </Text>
                          <Text variant="bodyMedium" style={styles.modalItemQuantity}>
                            Quantity: {item.quantity}
                          </Text>
                          <Text variant="bodyMedium" style={styles.modalItemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))}
                    <Divider style={styles.modalDivider} />
                    <View style={styles.modalTotalRow}>
                      <Text variant="titleMedium">Total Amount</Text>
                      <Text variant="titleLarge" style={styles.modalTotal}>
                        ${selectedOrder.total.toFixed(2)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>

                <View style={styles.modalActions}>
                  <Button
                    mode="contained"
                    icon="refresh"
                    onPress={() => {
                      handleReorder(selectedOrder.id);
                      hideModal();
                    }}
                    style={styles.modalButton}
                  >
                    Reorder
                  </Button>
                  <Button
                    mode="contained-tonal"
                    icon="file-download"
                    onPress={() => {
                      generatePDFInvoice(selectedOrder);
                      hideModal();
                    }}
                    style={styles.modalButton}
                  >
                    Download Invoice
                  </Button>
                </View>
              </ScrollView>
            )}
          </Modal>

          <Modal
            visible={showMap}
            onDismiss={() => setShowMap(false)}
            contentContainerStyle={styles.mapModal}
          >
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                  }}
                  title="Delivery Location"
                  description="Your order is here"
                />
              </MapView>
              <Button
                mode="contained"
                onPress={() => setShowMap(false)}
                style={styles.closeMapButton}
              >
                Close Map
              </Button>
            </View>
          </Modal>

          {/* Analytics Modal */}
          {renderAnalytics()}

          {/* Timeline Modal */}
          <Modal
            visible={showTimeline}
            onDismiss={() => setShowTimeline(false)}
            contentContainerStyle={styles.timelineModal}
          >
            {selectedOrder && (
              <ScrollView>
                <Text style={styles.modalTitle}>Order Timeline</Text>
                {renderOrderTimeline(selectedOrder)}
                <Button
                  mode="contained"
                  onPress={() => setShowTimeline(false)}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </ScrollView>
            )}
          </Modal>
        </Portal>

        <FAB.Group
          open={fabOpen}
          visible={true}
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'chart-bar',
              label: 'Analytics',
              onPress: () => {
                setShowAnalytics(true);
                setFabOpen(false);
              },
            },
            {
              icon: 'file-download',
              label: 'Download All Invoices',
              onPress: () => {
                orders.forEach(order => generatePDFInvoice(order));
                setFabOpen(false);
              },
            },
            {
              icon: 'refresh',
              label: 'Refresh',
              onPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // Add refresh logic here
                setFabOpen(false);
              },
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          style={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
};

const getTimelineColor = (currentStatus, stepStatus) => {
  const statusOrder = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(stepStatus);
  
  if (stepIndex <= currentIndex) {
    return theme.colors.primary;
  }
  return theme.colors.surfaceVariant;
};

const getDeliveryTime = (order) => {
  if (order.deliveryDate && order.date) {
    const duration = moment.duration(moment(order.deliveryDate).diff(moment(order.date)));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    return `${hours}h ${minutes}m`;
  }
  return 'Pending';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
    marginBottom: 12,
    color: '#1a1a1a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  searchInput: {
    fontSize: 16,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  filterChip: {
    marginRight: 8,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginVertical: 12,
  },
  itemsList: {
    marginTop: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  divider: {
    marginVertical: 12,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  shopButton: {
    paddingHorizontal: 32,
  },
  shopButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  reviewButton: {
    marginRight: 8,
    borderRadius: 16,
    borderColor: theme.colors.primary,
  },
  reviewButtonLabel: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 50,
  },
  backRightBtnRight: {
    backgroundColor: theme.colors.errorContainer,
    right: 0,
  },
  backRightBtnLeft: {
    backgroundColor: theme.colors.primaryContainer,
    right: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
    elevation: 5,
  },
  modalScroll: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  modalSubtitle: {
    color: theme.colors.secondary,
  },
  closeButton: {
    margin: -8,
  },
  statusSection: {
    marginBottom: 20,
  },
  modalProgressBar: {
    marginTop: 10,
    height: 8,
    borderRadius: 4,
  },
  modalCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
    marginLeft: 8,
    flex: 1,
  },
  modalItemRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  modalItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  modalItemQuantity: {
    color: theme.colors.secondary,
    marginBottom: 2,
  },
  modalItemPrice: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalDivider: {
    marginVertical: 16,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTotal: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  directionsButton: {
    marginTop: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  loginButton: {
    width: 120,
  },
  timeline: {
    marginTop: 16,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineTime: {
    color: theme.colors.secondary,
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 2,
    height: 24,
    backgroundColor: theme.colors.surfaceVariant,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  analyticItem: {
    alignItems: 'center',
    flex: 1,
  },
  analyticValue: {
    marginVertical: 4,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default OrdersScreen;
