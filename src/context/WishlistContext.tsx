import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car } from '@/data/cars';

interface WishlistContextType {
  items: Car[];
  addToWishlist: (car: Car) => void;
  removeFromWishlist: (carId: string) => void;
  isInWishlist: (carId: string) => boolean;
  toggleWishlist: (car: Car) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Car[]>(() => {
    const saved = localStorage.getItem('luxury-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('luxury-wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (car: Car) => setItems(prev => prev.find(i => i.id === car.id) ? prev : [...prev, car]);
  const removeFromWishlist = (carId: string) => setItems(prev => prev.filter(i => i.id !== carId));
  const isInWishlist = (carId: string) => items.some(i => i.id === carId);
  const toggleWishlist = (car: Car) => isInWishlist(car.id) ? removeFromWishlist(car.id) : addToWishlist(car);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
