"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function PharmacyCard({ pharmacy }) {
  const { language } = useApp();

  const name = language === "ar" ? pharmacy.name_ar : pharmacy.name_en;
  const eta = language === "ar" ? pharmacy.deliveryEta_ar : pharmacy.deliveryEta_en;

  const t = {
    km: language === "ar" ? "كم" : "km",
    fee: language === "ar" ? "توصيل:" : "Del:",
    sar: language === "ar" ? "ر.س" : "SAR",
    free: language === "ar" ? "توصيل مجاني" : "Free Delivery",
    open24: language === "ar" ? "مفتوح ٢٤ ساعة" : "Open 24 Hours"
  };

  return (
    <Link href={`/pharmacies/${pharmacy.id}`} className="pharmacy-card">
      <div className="pharmacy-logo">{pharmacy.logo}</div>
      <div className="pharmacy-info">
        <div className="pharmacy-name-row">
          <h4 className="pharmacy-name">{name}</h4>
          <span className="pharmacy-rating">★ {pharmacy.rating.toFixed(1)}</span>
        </div>
        <div className="pharmacy-details">
          <span>📍 {pharmacy.distance} {t.km}</span>
          <span>⏱️ {eta}</span>
          <span>
            🚗 {t.fee} {pharmacy.deliveryFee === 0 ? t.free : `${pharmacy.deliveryFee} ${t.sar}`}
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {pharmacy.is24Hours && <span className="pharmacy-badge">{t.open24}</span>}
          {pharmacy.hasFreeDelivery && (
            <span className="pharmacy-badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--success)" }}>
              {t.free}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
