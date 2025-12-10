export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}