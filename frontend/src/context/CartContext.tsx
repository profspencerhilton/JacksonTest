import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  /**
   * addToCart:
   * - If the item already exists in the cart, increment its quantity.
   * - Otherwise, add the item with a quantity of 1.
   */
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId);
      if (existingItem) {
        return prevCart.map((c) =>
          c.bookId === item.bookId ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  /**
   * removeFromCart:
   * - If quantity > 1, decrement it by 1.
   * - If quantity = 1, remove the item entirely.
   */
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === bookId);
      if (!existingItem) {
        return prevCart; // If not found, do nothing
      }

      if (existingItem.quantity > 1) {
        return prevCart.map((c) =>
          c.bookId === bookId ? { ...c, quantity: c.quantity - 1 } : c
        );
      } else {
        return prevCart.filter((c) => c.bookId !== bookId);
      }
    });
  };

  /**
   * clearCart:
   * - Removes all items from the cart.
   */
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
