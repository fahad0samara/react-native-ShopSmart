import React, { createContext, useState, useContext } from 'react';

interface UserData {
  name?: string;
  email?: string;
  avatar?: string;
  memberSince?: string;
  tier?: string;
  points?: number;
  stats?: {
    ordersCompleted?: number;
    reviewsGiven?: number;
    wishlistItems?: number;
  };
  addresses?: Array<{
    type: string;
    address: string;
    isDefault: boolean;
  }>;
  paymentMethods?: Array<{
    type: string;
    last4: string;
    isDefault: boolean;
  }>;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'Jan 2024',
    tier: 'Gold',
    points: 2450,
    stats: {
      ordersCompleted: 12,
      reviewsGiven: 8,
      wishlistItems: 24,
    },
    addresses: [
      { type: 'home', address: '123 Main St', isDefault: true },
      { type: 'work', address: '456 Work Ave', isDefault: false },
    ],
    paymentMethods: [
      { type: 'visa', last4: '4242', isDefault: true },
      { type: 'mastercard', last4: '8888', isDefault: false },
    ],
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
