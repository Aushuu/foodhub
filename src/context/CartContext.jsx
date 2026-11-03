import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('foodhub_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('foodhub_cart', JSON.stringify(items));
  }, [items]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => (item.food._id || item.food.id) === (food._id || food.id));
      if (existing) {
        return prev.map((item) =>
          (item.food._id || item.food.id) === (food._id || food.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
    showToast(`Added ${quantity}x ${food.name} to cart!`);
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        (item.food._id || item.food.id) === foodId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (foodId) => {
    setItems((prev) => {
      const target = prev.find((item) => (item.food._id || item.food.id) === foodId);
      if (target) {
        showToast(`Removed ${target.food.name} from cart`);
      }
      return prev.filter((item) => (item.food._id || item.food.id) !== foodId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const deliveryFee = items.length === 0 ? 0 : subtotal > 40 ? 0 : 3.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const totalAmount = Number((subtotal + deliveryFee + tax).toFixed(2));
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
        totalItems,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

