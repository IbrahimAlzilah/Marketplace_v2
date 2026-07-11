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
      <div className="layout-side-col desktop-only" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
          {t.filters}
        </h3>

        {/* 24 hours open toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>🕒 {t.open24}</span>
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

        {/* Fast delivery toggle (Screen 12 specifications) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>⚡ {t.fastDel}</span>
          <input
            type="checkbox"
            checked={filterFast}
            onChange={() => setFilterFast(!filterFast)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* 2. RIGHT / MAIN PHARMACIES LIST & MAP */}
      <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Toggle Mode and Map Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>{t.title}</h2>
          
          {/* Map/List Switcher Toggle (Screen 12 specifications) */}
          <div style={{ display: "flex", gap: "6px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "30px", padding: "4px" }}>
            <button
              onClick={() => setViewMode("list")}
              style={{
                background: viewMode === "list" ? "var(--primary)" : "transparent",
                color: viewMode === "list" ? "var(--text-on-primary)" : "var(--text-2)",
                border: "none",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t.listView}
            </button>
            <button
              onClick={() => setViewMode("map")}
              style={{
                background: viewMode === "map" ? "var(--primary)" : "transparent",
                color: viewMode === "map" ? "var(--text-on-primary)" : "var(--text-2)",
                border: "none",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t.mapView}
            </button>
          </div>
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

        {/* Mobile Filter Badges */}
        <div className="mobile-only" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
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
              cursor: "pointer",
              whiteSpace: "nowrap"
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
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            🚗 {t.freeDel}
          </button>
          <button
            onClick={() => setFilterFast(!filterFast)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: `1px solid ${filterFast ? "var(--primary)" : "var(--border)"}`,
              backgroundColor: filterFast ? "rgba(15, 108, 189, 0.1)" : "var(--surface)",
              color: filterFast ? "var(--primary)" : "var(--text-2)",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
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
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  height: "220px"
                }}
              >
                {/* Image Placeholder */}
                <div className="shimmer-bg" style={{ height: "100px", borderRadius: "12px", width: "100%" }} />
                {/* Title Line Placeholder */}
                <div className="shimmer-bg" style={{ height: "16px", borderRadius: "4px", width: "70%" }} />
                {/* Subtitle Placeholder */}
                <div className="shimmer-bg" style={{ height: "12px", borderRadius: "4px", width: "40%" }} />
                {/* Footer Buttons Placeholder */}
                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <div className="shimmer-bg" style={{ height: "24px", borderRadius: "6px", flex: 1 }} />
                  <div className="shimmer-bg" style={{ height: "24px", borderRadius: "6px", flex: 1 }} />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          /* STANDARD LIST VIEW */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: "600" }}>
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
                <span className="empty-title">{t.noMatching}</span>
              </div>
            )}
          </div>
        ) : (
          /* INTERACTIVE MAP VIEW (Screen 12 Map overlay details) */
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                height: "360px",
                backgroundColor: "#e0f2f1",
                backgroundImage: "radial-gradient(#b2dfdb 1.5px, transparent 1.5px)",
                backgroundSize: "30px 30px",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)"
              }}
            >
              {/* Riyadh Grid Streets mockup background overlay */}
              <div style={{ position: "absolute", width: "100%", height: "4px", backgroundColor: "#fff", top: "50%", left: 0 }} />
              <div style={{ position: "absolute", width: "4px", height: "100%", backgroundColor: "#fff", left: "50%", top: 0 }} />
              <div style={{ position: "absolute", width: "100%", height: "2px", backgroundColor: "#fff", top: "25%", left: 0, opacity: 0.7 }} />
              <div style={{ position: "absolute", width: "100%", height: "2px", backgroundColor: "#fff", top: "75%", left: 0, opacity: 0.7 }} />
              
              {/* Street Names Indicators */}
              <div style={{ position: "absolute", left: "10px", top: "45%", fontSize: "9px", color: "var(--text-2)", fontWeight: "700", transform: "rotate(-90deg)" }}>King Fahd Road</div>
              <div style={{ position: "absolute", right: "20px", top: "52%", fontSize: "9px", color: "var(--text-2)", fontWeight: "700" }}>Al-Malqa Road</div>

              {/* Render Map pins for matching branches */}
              {filtered.map((ph) => {
                const coordinates = mapCoordinates[ph.id] || { top: "50%", left: "50%" };
                const isSelected = activePin === ph.id;
                
                return (
                  <div
                    key={ph.id}
                    onClick={() => setActivePin(ph.id)}
                    style={{
                      position: "absolute",
                      top: coordinates.top,
                      left: coordinates.left,
                      cursor: "pointer",
                      zIndex: isSelected ? 100 : 50,
                      transform: "translate(-50%, -50%)",
                      transition: "all 0.2s"
                    }}
                  >
                    {/* Animated Pulsing Pin Locator Drop */}
                    <div
                      style={{
                        width: isSelected ? "32px" : "24px",
                        height: isSelected ? "32px" : "24px",
                        borderRadius: "50%",
                        backgroundColor: isSelected ? "var(--primary)" : "var(--surface)",
                        border: "2.5px solid var(--primary)",
                        color: isSelected ? "white" : "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isSelected ? "14px" : "11px",
                        fontWeight: "800",
                        animation: isSelected ? "pulsePin 1s infinite alternate" : "none",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      💊
                    </div>
                  </div>
                );
              })}

              {/* Visual Zoom buttons */}
              <div style={{ position: "absolute", bottom: "16px", [language === "ar" ? "left" : "right"]: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <button type="button" style={{ width: "30px", height: "30px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--surface)", fontSize: "14px", fontWeight: "700", cursor: "pointer" }} onClick={() => alert("Zooming In...")}>＋</button>
                <button type="button" style={{ width: "30px", height: "30px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--surface)", fontSize: "14px", fontWeight: "700", cursor: "pointer" }} onClick={() => alert("Zooming Out...")}>－</button>
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
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "var(--surface)",
                      border: "1.5px solid var(--primary)",
                      borderRadius: "16px",
                      padding: "16px",
                      alignItems: "center",
                      gap: "16px",
                      boxShadow: "var(--shadow-md)"
                    }}
                  >
                    <div style={{ fontSize: "36px", padding: "10px", backgroundColor: "var(--bg)", borderRadius: "12px" }}>
                      {selectedPh.logo}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "800", margin: 0 }}>{phName}</h4>
                      <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "var(--text-2)", marginTop: "4px" }}>
                        <span>★ {selectedPh.rating}</span>
                        <span>⏱️ {phEta}</span>
                        <span>🚗 {selectedPh.deliveryFee === 0 ? t.freeDel : `${selectedPh.deliveryFee} SAR`}</span>
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ width: "auto", padding: "8px 16px", fontSize: "12px" }}
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
