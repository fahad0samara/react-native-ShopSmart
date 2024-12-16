export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  productName: string;
  image: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  helpful: number;
}

export interface PendingReview {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  productName: string;
  image: string;
  orderDate: string;
}
