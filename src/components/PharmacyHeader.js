"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function PharmacyHeader({
  pharmacy,
  isOffline = false,
  showOfflineToggle = false,
  onOfflineToggle = null
}) {
  const { language } = useApp();

  if (!pharmacy) return null;

  const name = language === "ar" ? pharmacy.name_ar : pharmacy.name_en;
  const eta = language === "ar" ? pharmacy.deliveryEta_ar : pharmacy.deliveryEta_en;

  const t = {
    km: language === "ar" ? "كم" : "km",
    fee: language === "ar" ? "رسوم التوصيل:" : "Delivery Fee:",
    sar: language === "ar" ? "ر.س" : "SAR",
    free: language === "ar" ? "مجاني" : "Free",
    closed: language === "ar" ? "المتجر مغلق 🛑" : "Store Closed 🛑",
    simulateClosed: language === "ar" ? "محاكاة الإغلاق ⚙️" : "Simulate Closed ⚙️",
    district: language === "ar" ? "الرياض، حي الملقا" : "Riyadh, Al-Malqa District"
  };

  // Brand-based styling storefront banners
  const brandBanners = {
    "ph-1": "linear-gradient(135deg, #065f46 0%, #0f766e 100%)", // Al-Dawaa Green
    "ph-2": "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", // Nahdi Blue
    "ph-3": "linear-gradient(135deg, #be185d 0%, #111827 100%)", // Whites Pink/Grey
    "ph-4": "linear-gradient(135deg, #0369a1 0%, #075985 100%)", // Al-Safaa Teal
    "ph-5": "linear-gradient(135deg, #4338ca 0%, #3730a3 100%)"  // Community indigos
  };
  
  const activeBanner = brandBanners[pharmacy.id] || "linear-gradient(135deg, #0f766e 0%, #115e59 100%)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Styles for animations */}
      <style>{`
        @keyframes pulsePin {
          0% { opacity: 0.95; }
          100% { opacity: 1; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
        }
      `}</style>

      {/* Storefront Visual Banner Header */}
      <div
        style={{
          position: "relative",
          height: "160px",
          background: activeBanner,
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          padding: "20px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        {/* Brand medical logo background decoration */}
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "64px",
          opacity: 0.15,
          userSelect: "none"
        }}>
          🏥
        </div>
        
        {/* Glassmorphism card detailing pharmacy */}
        <div style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "12px 18px",
          color: "white",
          width: "100%",
          zIndex: 10
        }}>
          <div style={{ fontSize: "36px" }}>{pharmacy.logo}</div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: "white" }}>{name}</h2>
            <span style={{ fontSize: "11px", opacity: 0.9 }}>📍 {t.district}</span>
          </div>
        </div>
      </div>

      {/* Main Info Card Details */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-2)" }}>
          <span style={{ fontWeight: "700", color: "var(--warning)", fontSize: "13px" }}>★ {pharmacy.rating.toFixed(1)} ({pharmacy.reviewsCount})</span>
          <span>📍 {pharmacy.distance} {t.km}</span>
          <span>⏱️ {eta}</span>
          <span>🚗 {t.fee} {pharmacy.deliveryFee === 0 ? t.free : `${pharmacy.deliveryFee} ${t.sar}`}</span>
        </div>

        {/* Offline Simulation Switch */}
        {showOfflineToggle && onOfflineToggle && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: "10px" }}>
            <label htmlFor="store-offline-toggle" style={{ fontSize: "11px", fontWeight: "700", color: isOffline ? "var(--danger)" : "var(--text-1)", cursor: "pointer" }}>
              {isOffline ? t.closed : t.simulateClosed}
            </label>
            <input
              id="store-offline-toggle"
              type="checkbox"
              checked={isOffline}
              onChange={() => onOfflineToggle(!isOffline)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
