"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CategoriesPage() {
  const { language } = useApp();
  const router = useRouter();

  const [activeCat, setActiveCat] = useState("medications");
  const [loading, setLoading] = useState(true);

  // Simulated Screen 8 Skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    title: language === "ar" ? "الفئات الطبية" : "Medical Categories",
    searchPlaceholder: language === "ar" ? "ابحث عن الأدوية..." : "Search medicines...",
    allProducts: language === "ar" ? "عرض جميع المنتجات" : "View All Products",
    back: language === "ar" ? "رجوع" : "Back",
    loadingText: language === "ar" ? "جاري تحميل الدليل..." : "Loading catalog..."
  };

  const categories = [
    { id: "medications", title_en: "Medicines", title_ar: "الأدوية", icon: "💊" },
    { id: "vitamins", title_en: "Vitamins", title_ar: "الفيتامينات", icon: "🧴" },
    { id: "baby", title_en: "Baby Care", title_ar: "العناية بالطفل", icon: "👶" },
    { id: "beauty", title_en: "Skin Care", title_ar: "العناية بالبشرة", icon: "✨" },
    { id: "devices", title_en: "Medical Devices", title_ar: "الأجهزة الطبية", icon: "🩺" },
    { id: "personal", title_en: "Personal Care", title_ar: "العناية الشخصية", icon: "🧼" },
    { id: "fitness", title_en: "Fitness", title_ar: "الرشاقة والرياضة", icon: "💪" },
    { id: "herbal", title_en: "Herbal", title_ar: "المنتجات العشبية", icon: "🌿" }
  ];

  const categorySubcategories = {
    medications: [
      { en: "Pain Relief", ar: "مسكنات الألم", icon: "🩹" },
      { en: "Cold & Flu", ar: "البرد والأنفلونزا", icon: "🤧" },
      { en: "Chronic Diseases", ar: "الأمراض المزمنة", icon: "❤️" },
      { en: "First Aid", ar: "الإسعافات الأولية", icon: "🎒" }
    ],
    vitamins: [
      { en: "Multivitamins", ar: "الفيتامينات المتعددة", icon: "💊" },
      { en: "Minerals", ar: "المعادن", icon: "🦴" },
      { en: "Immunity Boosters", ar: "مقويات المناعة", icon: "🛡️" },
      { en: "Fish Oil", ar: "زيت السمك", icon: "🐟" }
    ],
    baby: [
      { en: "Baby Milk", ar: "حليب الأطفال", icon: "🍼" },
      { en: "Diapers", ar: "الحفاضات", icon: "👶" },
      { en: "Baby Skincare", ar: "العناية ببشرة الطفل", icon: "🧴" },
      { en: "Feeding Accessories", ar: "أدوات التغذية", icon: "🥄" }
    ],
    beauty: [
      { en: "Skincare", ar: "العناية بالبشرة", icon: "🧴" },
      { en: "Suncare", ar: "واقيات الشمس", icon: "☀️" },
      { en: "Moisturizers", ar: "المرطبات", icon: "💧" },
      { en: "Serums", ar: "السيروم", icon: "🧪" }
    ],
    devices: [
      { en: "Blood Pressure", ar: "أجهزة الضغط", icon: "🩺" },
      { en: "Thermometers", ar: "موازين الحرارة", icon: "🌡️" },
      { en: "Glucose Monitors", ar: "أجهزة السكر", icon: "🩸" },
      { en: "Nebulizers", ar: "أجهزة البخار", icon: "🌬️" }
    ],
    personal: [
      { en: "Body Wash", ar: "غسول الجسم", icon: "🧼" },
      { en: "Deodorants", ar: "مزيلات العرق", icon: "💨" },
      { en: "Oral Care", ar: "العناية بالفم", icon: "🪥" },
      { en: "Hair Care", ar: "العناية بالشعر", icon: "💇" }
    ],
    fitness: [
      { en: "Protein Powder", ar: "بودرة البروتين", icon: "💪" },
      { en: "Energy Bars", ar: "ألواح الطاقة", icon: "🍫" },
      { en: "Shakers", ar: "شيكرات", icon: "🥤" },
      { en: "Fat Burners", ar: "حوارق الدهون", icon: "🔥" }
    ],
    herbal: [
      { en: "Herbal Tea", ar: "الشاي العشبي", icon: "🍵" },
      { en: "Natural Oils", ar: "الزيوت الطبيعية", icon: "🫙" },
      { en: "Honey", ar: "العسل", icon: "🍯" },
      { en: "Organic Herbs", ar: "الأعشاب العضوية", icon: "🌿" }
    ]
  };

  const handleSubCategoryClick = (catId, subEn) => {
    router.push(`/search?cat=${catId}&sub=${encodeURIComponent(subEn)}`);
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-box {
          background: linear-gradient(90deg, var(--bg) 25%, var(--border) 50%, var(--bg) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite linear;
          border-radius: 12px;
        }
        .catalog-container {
          display: flex;
          height: calc(100vh - 120px);
          margin-top: 10px;
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          background-color: var(--surface);
          box-shadow: var(--shadow-sm);
        }
        .catalog-sidebar {
          width: 30%;
          max-width: 220px;
          background-color: var(--bg);
          border-inline-end: 1px solid var(--border);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .catalog-sidebar-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 8px;
          border: none;
          border-bottom: 1px solid var(--border);
          background: transparent;
          color: var(--text-2);
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          gap: 6px;
        }
        @media (min-width: 768px) {
          .catalog-sidebar-btn {
            flex-direction: row;
            justify-content: flex-start;
            padding: 16px 20px;
            text-align: start;
            gap: 12px;
          }
        }
        .catalog-sidebar-btn-active {
          background-color: var(--surface);
          color: var(--primary);
          font-weight: 800;
          border-inline-start: 4px solid var(--primary);
        }
        .catalog-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        .subcat-card {
          background-color: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .subcat-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
      `}</style>

      {/* Sticky Screen 8 Header */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          backgroundColor: "var(--surface)", 
          border: "1px solid var(--border)", 
          borderRadius: "16px", 
          padding: "12px 18px",
          boxShadow: "var(--shadow-sm)",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button 
            onClick={() => router.push("/home")}
            style={{ border: "none", background: "transparent", fontSize: "16px", cursor: "pointer", color: "var(--text-2)" }}
          >
            ◀ {t.back}
          </button>
          <h2 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>
            {t.title}
          </h2>
        </div>
        <Link href="/search" style={{ textDecoration: "none" }}>
          <button 
            style={{ 
              border: "none", 
              background: "var(--bg)", 
              color: "var(--text-2)", 
              padding: "8px 14px", 
              borderRadius: "12px", 
              fontSize: "12px", 
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            🔍 {language === "ar" ? "ابحث" : "Search"}
          </button>
        </Link>
      </div>

      {loading ? (
        /* Screen 8 Shimmer skeleton loaders */
        <div className="catalog-container">
          <div className="catalog-sidebar">
            {[...Array(6)].map((_, idx) => (
              <div 
                key={idx} 
                className="shimmer-box" 
                style={{ height: "70px", margin: "10px", borderRadius: "10px" }}
              ></div>
            ))}
          </div>
          <div className="catalog-content" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "16px", alignContent: "start" }}>
            {[...Array(6)].map((_, idx) => (
              <div 
                key={idx} 
                className="shimmer-box" 
                style={{ height: "110px", borderRadius: "16px" }}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        /* Categories catalog layout (Screen 8 Specification) */
        <div className="catalog-container">
          {/* Main Category sidebar picker */}
          <div className="catalog-sidebar">
            {categories.map((cat) => {
              const label = language === "ar" ? cat.title_ar : cat.title_en;
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`catalog-sidebar-btn ${isActive ? "catalog-sidebar-btn-active" : ""}`}
                >
                  <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                  <span style={{ fontSize: "12px" }}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Subcategories catalog listing area */}
          <div className="catalog-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-1)" }}>
                {language === "ar" 
                  ? categories.find(c => c.id === activeCat)?.title_ar 
                  : categories.find(c => c.id === activeCat)?.title_en}
              </h3>
              <button 
                onClick={() => router.push(`/search?cat=${activeCat}`)}
                style={{ border: "none", background: "transparent", color: "var(--primary)", fontSize: "11px", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
              >
                {t.allProducts} &gt;
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "16px" }}>
              {categorySubcategories[activeCat]?.map((subItem, index) => {
                const label = language === "ar" ? subItem.ar : subItem.en;
                return (
                  <div
                    key={index}
                    className="subcat-card"
                    onClick={() => handleSubCategoryClick(activeCat, subItem.en)}
                  >
                    <span style={{ fontSize: "32px" }}>{subItem.icon}</span>
                    <strong style={{ fontSize: "12px", color: "var(--text-1)" }}>{label}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
