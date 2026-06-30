"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUserProfile, mockWallet, mockLoyalty, mockOrders } from "@/mock/data";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState("en"); // 'en' or 'ar'
  const [cart, setCart] = useState([]); // Array of { ...product, quantity, rxFile }
  const [walletBalance, setWalletBalance] = useState(mockWallet.balance);
  const [walletTransactions, setWalletTransactions] = useState(mockWallet.transactions);
  const [loyaltyPoints, setLoyaltyPoints] = useState(mockLoyalty.pointsBalance);
  const [loyaltyHistory, setLoyaltyHistory] = useState(mockLoyalty.history);
  const [orders, setOrders] = useState(mockOrders);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addresses, setAddresses] = useState(mockUserProfile.addresses);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState(["pr-1", "pr-6"]); // Saved product IDs
  const [searchHistory, setSearchHistory] = useState(["Panadol", "Baby Milk"]);
  const [recentlyViewed, setRecentlyViewed] = useState(["pr-1", "pr-2"]); // Pre-populated default product IDs

  // Sync login status from localStorage on client-side mount (hydration-safe)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isLoggedIn") === "true";
      if (stored) {
        setIsLoggedIn(true);
        if (addresses.length > 0) {
          setCurrentAddress(addresses[0]);
        }
      }
    }
  }, []);

  // Update HTML document direction and lang on language toggle
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const login = (phone, password) => {
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
    if (addresses.length > 0) {
      setCurrentAddress(addresses[0]);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
    setCurrentAddress(null);
    setCart([]);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity, rxFile: null }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const attachPrescription = (productId, fileName) => {
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, rxFile: fileName } : item))
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const topUpWallet = (amount) => {
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) return;
    setWalletBalance((prev) => prev + numAmt);
    setWalletTransactions((prev) => [
      {
        id: `wt-${Date.now()}`,
        type: "topup",
        title_en: "Wallet Top Up via Mada",
        title_ar: "شحن المحفظة عبر مدى",
        date: new Date().toISOString().split("T")[0],
        amount: numAmt
      },
      ...prev
    ]);
  };

  const redeemLoyaltyPoints = (pointsToRedeem) => {
    const equivalentSar = pointsToRedeem / 50; // 50 points = 1 SAR
    if (pointsToRedeem > loyaltyPoints) return 0;
    
    setLoyaltyPoints((prev) => prev - pointsToRedeem);
    setLoyaltyHistory((prev) => [
      {
        id: `lh-${Date.now()}`,
        action_en: "Redeemed at Checkout",
        action_ar: "استبدال نقاط عند الدفع",
        date: new Date().toISOString().split("T")[0],
        points: -pointsToRedeem
      },
      ...prev
    ]);
    return equivalentSar;
  };

  const createOrder = (usedWalletAmount, redeemedPoints, paymentMethod, deliveryOption) => {
    // Group cart items by pharmacy
    const grouped = cart.reduce((acc, item) => {
      if (!acc[item.pharmacyId]) acc[item.pharmacyId] = [];
      acc[item.pharmacyId].push(item);
      return acc;
    }, {});

    const newOrdersList = [];
    const dateStr = new Date().toISOString().split("T")[0];

    // Create a separate order per pharmacy
    Object.keys(grouped).forEach((pharmacyId, index) => {
      const items = grouped[pharmacyId];
      const pharmacyName_en = items[0].pharmacyName_en;
      const pharmacyName_ar = items[0].pharmacyName_ar;
      
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let deliveryFee = 0;
      if (deliveryOption === "pickup") {
        deliveryFee = 0;
      } else if (subtotal >= 100) {
        deliveryFee = 0;
      } else {
        deliveryFee = deliveryOption === "cold" ? 25 : 10;
      }
      const vat = subtotal * 0.15;
      const total = subtotal + deliveryFee + vat;

      const orderId = `YS-${Math.floor(100 + Math.random() * 900)}`;

      const newOrder = {
        id: orderId,
        date: dateStr,
        status: items.some(i => i.isRx) ? "pending_rx" : "delivering",
        pharmacyName_en,
        pharmacyName_ar,
        items: items.map(i => ({
          id: i.id,
          name_en: i.name_en,
          name_ar: i.name_ar,
          price: i.price,
          quantity: i.quantity
        })),
        deliveryFee,
        vat,
        total,
        driverName: "Khalid Mansour",
        driverPhone: "+966551122334",
        eta_en: "20-30 mins",
        eta_ar: "٢٠-٣٠ دقيقة",
        timeline: [
          { step: "placed", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
          { step: "preparing", time: "--:--", done: !items.some(i => i.isRx) },
          { step: "delivering", time: "--:--", done: false },
          { step: "arrived", time: "--:--", done: false }
        ]
      };

      newOrdersList.push(newOrder);
    });

    // Deduct Wallet if used
    if (usedWalletAmount > 0) {
      setWalletBalance((prev) => prev - usedWalletAmount);
      setWalletTransactions((prev) => [
        {
          id: `wt-${Date.now()}`,
          type: "payment",
          title_en: "Used at Checkout",
          title_ar: "مشتريات من المحفظة",
          date: dateStr,
          amount: -usedWalletAmount
        },
        ...prev
      ]);
    }

    // Award Loyalty Points (e.g. 1 point for every 10 SAR spent)
    const totalSpent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const earnedPoints = Math.floor(totalSpent / 10);
    if (earnedPoints > 0) {
      setLoyaltyPoints((prev) => prev + earnedPoints);
      setLoyaltyHistory((prev) => [
        {
          id: `lh-${Date.now()}`,
          action_en: "Earned from Purchases",
          action_ar: "نقاط مكتسبة من المشتريات",
          date: dateStr,
          points: earnedPoints
        },
        ...prev
      ]);
    }

    // Add orders to state
    setOrders((prev) => [...newOrdersList, ...prev]);

    // Clear Cart
    setCart([]);

    return newOrdersList;
  };

  const addAddress = (newAddress) => {
    const addr = {
      id: `ad-${Date.now()}`,
      isDefault: addresses.length === 0,
      ...newAddress
    };
    setAddresses((prev) => [...prev, addr]);
  };

  const addSearchHistory = (term) => {
    if (!term || searchHistory.includes(term)) return;
    setSearchHistory((prev) => [term, ...prev.slice(0, 4)]);
  };

  const addToRecentlyViewed = (productId) => {
    if (!productId) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered.slice(0, 5)];
    });
  };

  const cancelOrder = (orderId, refundType) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: "canceled" } : ord
      )
    );
    if (refundType === "wallet") {
      setOrders((prev) => {
        const targetOrder = prev.find(o => o.id === orderId);
        if (targetOrder) {
          const refundAmount = targetOrder.total;
          setWalletBalance((wPrev) => wPrev + refundAmount);
          setWalletTransactions((tPrev) => [
            {
              id: `wt-${Date.now()}`,
              type: "refund",
              title_en: `Refund for Order #${orderId}`,
              title_ar: `استرجاع رصيد الطلب #${orderId}`,
              date: new Date().toISOString().split("T")[0],
              amount: refundAmount
            },
            ...tPrev
          ]);
        }
        return prev;
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        attachPrescription,
        walletBalance,
        walletTransactions,
        topUpWallet,
        loyaltyPoints,
        loyaltyHistory,
        redeemLoyaltyPoints,
        orders,
        currentAddress,
        setCurrentAddress,
        addresses,
        addAddress,
        wishlist,
        toggleWishlist,
        searchHistory,
        addSearchHistory,
        createOrder,
        isLoggedIn,
        login,
        logout,
        recentlyViewed,
        addToRecentlyViewed,
        cancelOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
