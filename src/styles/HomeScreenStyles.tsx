import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (width - (PADDING * 2) - CARD_GAP) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: PADDING,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    height: 46,
    backgroundColor: '#f5f5f5',
    borderRadius: 23,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    color: '#333',
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: '#f5f5f5',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterScroll: {
    marginLeft: -PADDING,
    marginRight: -PADDING,
  },
  filterContainer: {
    paddingHorizontal: PADDING,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextSelected: {
    color: '#fff',
  },
  content: {
    flexGrow: 1,
    padding: PADDING,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  seeAllText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  carouselContainer: {
    height: 180,
    marginBottom: 24,
  },
  slide: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerContent: {
    gap: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -CARD_GAP/2,
    marginBottom: 24,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: CARD_GAP/2,
    marginBottom: CARD_GAP,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
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
  productImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B761',
  },
  discountContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  categoriesContainer: {
    paddingHorizontal: PADDING,
    paddingBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 70,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
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
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  specialOffersContainer: {
    paddingHorizontal: PADDING,
    paddingVertical: 16,
  },
  specialOfferCard: {
    width: width - PADDING * 2,
    height: 120,
    borderRadius: 24,
    marginBottom: 12,
    padding: 20,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  specialOfferContent: {
    flex: 1,
    justifyContent: 'center',
  },
  specialOfferTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  specialOfferSubtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  dailyDealsContainer: {
    paddingHorizontal: PADDING,
    paddingBottom: 24,
  },
  dailyDealCard: {
    width: 220,
    height: 280,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dailyDealImage: {
    width: '100%',
    height: '100%',
  },
  dailyDealGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  dailyDealInfo: {
    gap: 8,
  },
  dailyDealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dailyDealPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dailyDealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dailyDealOriginalPrice: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  dailyDealTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  dailyDealTimeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  collectionsContainer: {
    paddingHorizontal: PADDING,
    paddingBottom: 24,
  },
  collectionCard: {
    width: 300,
    height: 200,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  collectionInfo: {
    gap: 6,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  collectionCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 16,
    margin: PADDING,
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
  quickActionItem: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  quickActionName: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  wishlistContainer: {
    paddingHorizontal: PADDING,
    paddingBottom: 16,
  },
  wishlistCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
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
  wishlistImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
  },
  wishlistInfo: {
    padding: 12,
  },
  wishlistName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  wishlistPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B761',
    marginBottom: 4,
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
});
