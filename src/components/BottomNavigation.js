"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { language, cart } = useApp();

  const navItems = [
    { id: "home", label_en: "Home", label_ar: "الرئيسية", icon: "🏠", path: "/home" },
    { id: "pharmacies", label_en: "Pharmacies", label_ar: "الصيدليات", icon: "🏥", path: "/pharmacies" },
    { id: "cart", label_en: "Cart", label_ar: "السلة", icon: "🛒", path: "/cart", badgeCount: true },
    { id: "orders", label_en: "Orders", label_ar: "الطلبات", icon: "📦", path: "/orders" },
    { id: "profile", label_en: "Profile", label_ar: "حسابي", icon: "👤", path: "/profile" }
  ];

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        const label = language === "ar" ? item.label_ar : item.label_en;
        
        return (
          <Link
            key={item.id}
            href={item.path}
            className={`nav-item ${isActive ? "nav-item-active" : ""}`}
          >
            <div className="nav-icon-wrapper">
              <span className="nav-icon">{item.icon}</span>
              {item.badgeCount && totalCartItems > 0 && (
                <span className="bottom-nav-badge">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
