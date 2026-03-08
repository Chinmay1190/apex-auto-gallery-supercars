import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car } from '@/data/cars';

interface CartItem {
  car: Car;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (car: Car) => void;
  removeFromCart: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxury-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('luxury-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (car: Car) => {
    setItems(prev => {
      const existing = prev.find(i => i.car.id === car.id);
      if (existing) return prev.map(i => i.car.id === car.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { car, quantity: 1 }];
    });
  };

  const removeFromCart = (carId: string) => setItems(prev => prev.filter(i => i.car.id !== carId));
  const updateQuantity = (carId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(carId);
    setItems(prev => prev.map(i => i.car.id === carId ? { ...i, quantity } : i));
  };
  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.car.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
