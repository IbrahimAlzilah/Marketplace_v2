"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { mockPharmacies } from "@/mock/data";
import PharmacyCard from "@/components/PharmacyCard";

export default function PharmaciesPage() {
  const { language } = useApp();
  const [filter24h, setFilter24h] = useState(false);
  const [filterFree, setFilterFree] = useState(false);
  const [query, setQuery] = useState("");

  const t = {
    title: language === "ar" ? "الصيدليات القريبة" : "Nearby Pharmacies",
    map: language === "ar" ? "موقع الخريطة (افتراضي)" : "Map Coordinates (Interactive View)",
    open24: language === "ar" ? "مفتوح ٢٤ ساعة" : "Open 24 Hours",
    freeDel: language === "ar" ? "توصيل مجاني" : "Free Delivery",
    all: language === "ar" ? "كل الفروع" : "All Branches",
    placeholder: language === "ar" ? "ابحث باسم الصيدلية..." : "Search pharmacy name...",
    filters: language === "ar" ? "تصفية الصيدليات" : "Filter Pharmacies",
    resultsCount: language === "ar" ? "صيدلية تم العثور عليها" : "pharmacies found"
  };

  const filtered = mockPharmacies.filter((ph) => {
    const name = language === "ar" ? ph.name_ar : ph.name_en;
    const queryMatch = name.toLowerCase().includes(query.toLowerCase());
    const openMatch = filter24h ? ph.is24Hours : true;
    const freeMatch = filterFree ? ph.hasFreeDelivery : true;
    return queryMatch && openMatch && freeMatch;
  });

  return (
    <div className="two-col-layout">
      {/* 1. LEFT FILTER SIDEBAR (Desktop Only) */}
      <div className="layout-side-col desktop-only" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
          🏥 {t.filters}
        </h3>

        {/* 24 hours open toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>🕒 {language === "ar" ? "عمل مستمر ٢٤ ساعة" : "Open 24/7"}</span>
          <input
            type="checkbox"
            checked={filter24h}
            onChange={() => setFilter24h(!filter24h)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        </div>

        {/* Free shipping toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>🚗 {t.freeDel}</span>
          <input
            type="checkbox"
            checked={filterFree}
            onChange={() => setFilterFree(!filterFree)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* 2. RIGHT / MAIN PHARMACIES LIST */}
      <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Map Coordinates Pinboard */}
        <div
          style={{
            height: "180px",
            background: "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.15)), url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23a0d2eb%22/><path d=%22M10,0 L10,100 M30,0 L30,100 M60,0 L60,100 M90,0 L90,100 M0,20 L100,20 M0,50 L100,50 M0,80 L100,80%22 stroke=%22%23ffffff%22 stroke-width=%222%22/></svg>')",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-1)",
            fontWeight: "700",
            fontSize: "14px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          🗺️ {t.map}
        </div>

        {/* Search input field */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            className="form-input"
            placeholder={t.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ borderRadius: "24px", paddingInlineStart: "20px" }}
          />
        </div>

        {/* Mobile Filter Badges (Visible only on mobile/tablet, hidden on desktop) */}
        <div className="mobile-only" style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setFilter24h(!filter24h)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: `1px solid ${filter24h ? "var(--primary)" : "var(--border)"}`,
              backgroundColor: filter24h ? "rgba(15, 108, 189, 0.1)" : "var(--surface)",
              color: filter24h ? "var(--primary)" : "var(--text-2)",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🕒 {language === "ar" ? "٢٤ ساعة" : "24h Open"}
          </button>
          <button
            onClick={() => setFilterFree(!filterFree)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: `1px solid ${filterFree ? "var(--primary)" : "var(--border)"}`,
              backgroundColor: filterFree ? "rgba(15, 108, 189, 0.1)" : "var(--surface)",
              color: filterFree ? "var(--primary)" : "var(--text-2)",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🚗 {t.freeDel}
          </button>
        </div>

        {/* Pharmacy Grid Section */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700" }}>{t.title}</h3>
            <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: "500" }}>
              {filtered.length} {t.resultsCount}
            </span>
          </div>

          <div className="responsive-grid-3">
            {filtered.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ marginTop: "20px" }}>
              <span className="empty-icon">🏥</span>
              <span className="empty-title">
                {language === "ar" ? "لا توجد صيدليات مطابقة" : "No matching pharmacies"}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
