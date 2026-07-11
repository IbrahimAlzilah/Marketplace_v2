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

  const brandIds = ["ph-1", "ph-2", "ph-3", "ph-4", "ph-5"];
  const bannerClass = brandIds.includes(pharmacy.id) ? `pharmacy-banner-${pharmacy.id}` : "pharmacy-banner-default";

  return (
    <div className="pharmacy-header-container">
      {/* Styles for animations */}
      <style>{`
        @keyframes pulsePin {
          0% { opacity: 0.95; }
          100% { opacity: 1; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
        }
      `}</style>

      {/* Storefront Visual Banner Header */}
      <div className={`pharmacy-banner-container ${bannerClass}`}>
        {/* Brand medical logo background decoration */}
        <div className="pharmacy-banner-decoration">
          🏥
        </div>
        
        {/* Glassmorphism card detailing pharmacy */}
        <div className="pharmacy-glass-card">
          <div className="pharmacy-glass-logo">{pharmacy.logo}</div>
          <div>
            <h2 className="pharmacy-glass-name">{name}</h2>
            <span className="pharmacy-glass-district">📍 {t.district}</span>
          </div>
        </div>
      </div>

      {/* Main Info Card Details */}
      <div className="pharmacy-info-card">
        <div className="pharmacy-info-details">
          <span className="pharmacy-info-rating">★ {pharmacy.rating.toFixed(1)} ({pharmacy.reviewsCount})</span>
          <span>📍 {pharmacy.distance} {t.km}</span>
          <span>⏱️ {eta}</span>
          <span>🚗 {t.fee} {pharmacy.deliveryFee === 0 ? t.free : `${pharmacy.deliveryFee} ${t.sar}`}</span>
        </div>

        {/* Offline Simulation Switch */}
        {showOfflineToggle && onOfflineToggle && (
          <div className="pharmacy-sim-toggle">
            <label
              htmlFor="store-offline-toggle"
              className="pharmacy-sim-label"
              style={{ color: isOffline ? "var(--danger)" : "var(--text-1)" }}
            >
              {isOffline ? t.closed : t.simulateClosed}
            </label>
            <input
              id="store-offline-toggle"
              type="checkbox"
              checked={isOffline}
              onChange={() => onOfflineToggle(!isOffline)}
              className="pharmacy-sim-checkbox"
            />
          </div>
        )}
      </div>
    </div>
  );
}
