import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types';
import { api } from '../services/api';

// Initial data removed in favor of API

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load Cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('nova_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
  }, [cart]);

  // Load Products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.get<Product[]>('/products.php');
      // Ensure we have an array (API might fail if DB is empty/erroring)
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const addProduct = async (product: Product) => {
    try {
      // Removing id so DB handles it or strictly following API needs
      const { id, ...payload } = product;
      await api.post('/products.php', payload);
      await loadProducts(); // Refresh list to get new ID
    } catch (err) {
      alert("Failed to add product: " + err);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await api.put('/products.php', product);
      // Optimistic update or refresh
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } catch (err) {
      alert("Failed to update product: " + err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await api.delete(`/products.php?id=${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      alert("Failed to delete product: " + err);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      products, cart, addToCart, removeFromCart, updateCartQuantity,
      clearCart, addProduct, updateProduct, deleteProduct, cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};