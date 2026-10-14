import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: '0.00' });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await cartService.addItem(productId, quantity);
      if (res.data?.cart) {
        setCart(res.data.cart);
        showToast('Added to pet basket!');
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add item to cart';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartService.updateQuantity(itemId, quantity);
      if (res.data) {
        setCart(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update quantity';
      showToast(msg, 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await cartService.removeItem(itemId);
      if (res.data?.cart) {
        setCart(res.data.cart);
        showToast('Item removed from cart');
      }
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], total_items: 0, total_price: '0.00' });
      showToast('Cart cleared');
    } catch (err) {
      showToast('Failed to clear cart', 'error');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showToast,
      }}
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
