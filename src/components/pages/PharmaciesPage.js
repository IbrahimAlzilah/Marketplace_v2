"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { mockPharmacies } from "@/mock/data";
import PharmacyCard from "@/components/PharmacyCard";
import { useRouter } from "next/navigation";

export default function PharmaciesPage() {
  const { language } = useApp();
  const router = useRouter();

  // Filters state
  const [filter24h, setFilter24h] = useState(false);
  const [filterFree, setFilterFree] = useState(false);
  const [filterFast, setFilterFast] = useState(false);
  const [query, setQuery] = useState("");

  // Layout View Mode (Screen 12 Toggle)
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [activePin, setActivePin] = useState(null); // id of pharmacy selected on map

  // Loading skeleton shimmers (Screen 12 State)
  const [isLoading, setIsLoading] = useState(true);

  // Trigger loading shimmers on mount and filter updates
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [filter24h, filterFree, filterFast, query, viewMode]);

  const t = {
    title: language === "ar" ? "الصيدليات القريبة" : "Nearby Pharmacies",
    map: language === "ar" ? "تصفح عبر الخريطة التفاعلية" : "Interactive Map Coordinates Picker",
    open24: language === "ar" ? "عمل ٢٤ ساعة" : "Open 24 Hours",
    freeDel: language === "ar" ? "توصيل مجاني" : "Free Delivery",
    fastDel: language === "ar" ? "توصيل سريع" : "Fast Delivery",
    placeholder: language === "ar" ? "ابحث باسم الصيدلية..." : "Search pharmacy name...",
    filters: language === "ar" ? "تصفية الصيدليات" : "Filter Pharmacies",
    resultsCount: language === "ar" ? "صيدلية تم العثور عليها" : "pharmacies found",
    listView: language === "ar" ? "عرض القائمة 📋" : "List View 📋",
    mapView: language === "ar" ? "عرض الخريطة 🗺️" : "Map View 🗺️",
    viewBranch: language === "ar" ? "تصفح الفرع" : "View Branch",
    noMatching: language === "ar" ? "لا توجد صيدليات مطابقة للتصفية" : "No pharmacies match current criteria"
  };

  // Coordinates mapping for mockup map visual representation
  const mapCoordinates = {
    "ph-1": { top: "35%", left: "42%" }, // Al-Dawaa
    "ph-2": { top: "55%", left: "28%" }, // Nahdi
    "ph-3": { top: "45%", left: "68%" }, // Whites
    "ph-4": { top: "65%", left: "60%" }, // Al-Safaa
    "ph-5": { top: "25%", left: "55%" }  // Community Care
  };

  // Filter logic including "Fast Delivery" (distance <= 2.0 km or ETA contains mins <= 25)
  const filtered = mockPharmacies.filter((ph) => {
    const name = language === "ar" ? ph.name_ar : ph.name_en;
    const queryMatch = name.toLowerCase().includes(query.toLowerCase());
    const openMatch = filter24h ? ph.is24Hours : true;
    const freeMatch = filterFree ? ph.hasFreeDelivery : true;
    
    // Fast Delivery calculation
    let isFastDelivery = ph.distance <= 2.0;
    if (ph.deliveryEta_en.includes("15-25") || ph.deliveryEta_en.includes("20-30") || ph.deliveryEta_en.includes("15 mins")) {
      isFastDelivery = true;
    }
    if (ph.id === "ph-3" || ph.id === "ph-4") {
      isFastDelivery = false; // Mock slower branches
    }
    const fastMatch = filterFast ? isFastDelivery : true;

    return queryMatch && openMatch && freeMatch && fastMatch;
  });

  return (
    <div className="two-col-layout">
      {/* Visual animations block */}
      <style>{`
        @keyframes pulsePin {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 12px rgba(15, 108, 189, 0.6); }
        }
        @keyframes shimmerPulse {
          0% { background-color: #f1f3f5; }
          50% { background-color: #e2e6ea; }
          100% { background-color: #f1f3f5; }
        }
        .shimmer-bg {
          animation: shimmerPulse 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* 1. LEFT FILTER SIDEBAR (Desktop Only) */}
      <div className="layout-side-col desktop-only pharmacies-filter-sidebar">
        <h3 className="pharmacies-filter-title">
          {t.filters}
        </h3>

        {/* 24 hours open toggle */}
        <div className="pharmacies-filter-row">
          <span className="pharmacies-filter-label">🕒 {t.open24}</span>
          <input
            type="checkbox"
            checked={filter24h}
            onChange={() => setFilter24h(!filter24h)}
            className="pharmacies-filter-checkbox"
          />
        </div>

        {/* Free shipping toggle */}
        <div className="pharmacies-filter-row">
          <span className="pharmacies-filter-label">🚗 {t.freeDel}</span>
          <input
            type="checkbox"
            checked={filterFree}
            onChange={() => setFilterFree(!filterFree)}
            className="pharmacies-filter-checkbox"
          />
        </div>

        {/* Fast delivery toggle (Screen 12 specifications) */}
        <div className="pharmacies-filter-row">
          <span className="pharmacies-filter-label">⚡ {t.fastDel}</span>
          <input
            type="checkbox"
            checked={filterFast}
            onChange={() => setFilterFast(!filterFast)}
            className="pharmacies-filter-checkbox"
          />
        </div>
      </div>

      {/* 2. RIGHT / MAIN PHARMACIES LIST & MAP */}
      <div className="layout-main-col pharmacies-main-col">
        
        {/* Toggle Mode and Map Header Row */}
        <div className="pharmacies-header-row">
          <h2 className="pharmacies-header-title">{t.title}</h2>
          
          {/* Map/List Switcher Toggle (Screen 12 specifications) */}
          <div className="pharmacies-switcher-container">
            <button
              onClick={() => setViewMode("list")}
              className={`pharmacies-switcher-btn ${viewMode === "list" ? "active" : ""}`}
            >
              {t.listView}
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`pharmacies-switcher-btn ${viewMode === "map" ? "active" : ""}`}
            >
              {t.mapView}
            </button>
          </div>
        </div>

        {/* Search input field */}
        <div className="pharmacies-search-row">
          <input
            type="text"
            className="form-input pharmacies-search-input"
            placeholder={t.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Mobile Filter Badges */}
        <div className="mobile-only pharmacies-mobile-filters">
          <button
            onClick={() => setFilter24h(!filter24h)}
            className={`pharmacies-mobile-filter-badge ${filter24h ? "active" : ""}`}
          >
            🕒 {language === "ar" ? "٢٤ ساعة" : "24h Open"}
          </button>
          <button
            onClick={() => setFilterFree(!filterFree)}
            className={`pharmacies-mobile-filter-badge ${filterFree ? "active" : ""}`}
          >
            🚗 {t.freeDel}
          </button>
          <button
            onClick={() => setFilterFast(!filterFast)}
            className={`pharmacies-mobile-filter-badge ${filterFast ? "active" : ""}`}
          >
            ⚡ {t.fastDel}
          </button>
        </div>

        {/* LOADING SHIMMER CARD SKELETON DISPLAY (Screen 12 loading state) */}
        {isLoading ? (
          <div className="responsive-grid-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="pharmacies-shimmer-card"
              >
                {/* Image Placeholder */}
                <div className="shimmer-bg shimmer-bg h100" />
                {/* Title Line Placeholder */}
                <div className="shimmer-bg shimmer-bg h16-w70" />
                {/* Subtitle Placeholder */}
                <div className="shimmer-bg shimmer-bg h12-w40-percent" />
                {/* Footer Buttons Placeholder */}
                <div className="pharmacies-shimmer-card-footer">
                  <div className="shimmer-bg shimmer-bg h24-flex1" />
                  <div className="shimmer-bg shimmer-bg h24-flex1" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          /* STANDARD LIST VIEW */
          <div>
            <div className="pharmacies-results-header">
              <span className="pharmacies-results-count">
                {filtered.length} {t.resultsCount}
              </span>
            </div>

            <div className="responsive-grid-3">
              {filtered.map((pharmacy) => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="empty-state empty-state-margin">
                <span className="empty-icon">🏥</span>
                <span className="empty-title">{t.noMatching}</span>
              </div>
            )}
          </div>
        ) : (
          /* INTERACTIVE MAP VIEW (Screen 12 Map overlay details) */
          <div className="pharmacies-map-view-wrapper">
            <div className="pharmacies-map-canvas">
              {/* Riyadh Grid Streets mockup background overlay */}
              <div className="map-street-h-mid" />
              <div className="map-street-v-mid" />
              <div className="map-street-h-25" />
              <div className="map-street-h-75" />
              
              {/* Street Names Indicators */}
              <div className="map-street-label-kf">King Fahd Road</div>
              <div className="map-street-label-mq">Al-Malqa Road</div>

              {/* Render Map pins for matching branches */}
              {filtered.map((ph) => {
                const coordinates = mapCoordinates[ph.id] || { top: "50%", left: "50%" };
                const isSelected = activePin === ph.id;
                
                return (
                  <div
                    key={ph.id}
                    onClick={() => setActivePin(ph.id)}
                    className="map-pin-container"
                    style={{
                      top: coordinates.top,
                      left: coordinates.left,
                      zIndex: isSelected ? 100 : 50
                    }}
                  >
                    {/* Animated Pulsing Pin Locator Drop */}
                    <div className={`map-pin-icon ${isSelected ? "selected" : ""}`}>
                      💊
                    </div>
                  </div>
                );
              })}

              {/* Visual Zoom buttons */}
              <div className="map-zoom-controls">
                <button type="button" className="map-zoom-btn" onClick={() => alert("Zooming In...")}>＋</button>
                <button type="button" className="map-zoom-btn" onClick={() => alert("Zooming Out...")}>－</button>
              </div>
            </div>

            {/* Selected Pin Details Overlay Card */}
            {activePin && (
              (() => {
                const selectedPh = mockPharmacies.find((p) => p.id === activePin);
                if (!selectedPh) return null;
                const phName = language === "ar" ? selectedPh.name_ar : selectedPh.name_en;
                const phEta = language === "ar" ? selectedPh.deliveryEta_ar : selectedPh.deliveryEta_en;
                
                return (
                  <div className="map-detail-card">
                    <div className="map-detail-logo">
                      {selectedPh.logo}
                    </div>
                    <div className="map-detail-info">
                      <h4 className="map-detail-name">{phName}</h4>
                      <div className="map-detail-badges">
                        <span>★ {selectedPh.rating}</span>
                        <span>⏱️ {phEta}</span>
                        <span>🚗 {selectedPh.deliveryFee === 0 ? t.freeDel : `${selectedPh.deliveryFee} SAR`}</span>
                      </div>
                    </div>
                    <button
                      className="btn-primary map-detail-btn"
                      onClick={() => router.push(`/pharmacies/${selectedPh.id}`)}
                    >
                      🚀 {t.viewBranch}
                    </button>
                  </div>
                );
              })()
            )}
          </div>
        )}

      </div>
    </div>
  );
}
