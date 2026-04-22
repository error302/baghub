"use client";

import { useEffect, useCallback } from "react";
import { useCartStore, CartItem } from "@/stores/cartStore";

export function useCart() {
  const {
    items,
    isOpen,
    total,
    itemCount,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setItems,
  } = useCartStore();

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("maison-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
  }, [setItems]);

  useEffect(() => {
    localStorage.setItem("maison-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback(
    (product: {
      id: string;
      name: string;
      price: number;
      image: string;
      size?: string;
      color?: string;
      quantity?: number;
    }) => {
      addItem({
        ...product,
        quantity: product.quantity || 1,
        size: product.size || "M",
        color: product.color || "Default",
      });
    },
    [addItem]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  const changeQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const toggleCart = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.id === productId);
      return item?.quantity || 0;
    },
    [items]
  );

  return {
    // State
    items,
    isOpen,
    total,
    itemCount,
    isEmpty: items.length === 0,
    
    // Actions
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isInCart,
    getItemQuantity,
    setItems,
  };
}

export function useCartItem(productId: string) {
  const { items, updateQuantity, removeItem } = useCartStore();
  
  const item = items.find((i) => i.id === productId);
  
  const increment = useCallback(() => {
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  }, [item, productId, updateQuantity]);

  const decrement = useCallback(() => {
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  }, [item, productId, updateQuantity]);

  const remove = useCallback(() => {
    removeItem(productId);
  }, [productId, removeItem]);

  return {
    item,
    quantity: item?.quantity || 0,
    increment,
    decrement,
    remove,
  };
}
