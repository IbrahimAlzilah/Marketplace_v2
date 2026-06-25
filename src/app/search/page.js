"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { mockProducts, mockPharmacies } from "@/mock/data";
import ProductCard from "@/components/ProductCard";
import PharmacyCard from "@/components/PharmacyCard";
import { useSearchParams, useRouter } from "next/navigation";

function SearchContent() {
  const { language, searchHistory, addSearchHistory } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCat = searchParams.get("cat") || "";
  const initialFilter = searchParams.get("filter") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("products"); // products, pharmacies
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [onlyOffers, setOnlyOffers] = useState(initialFilter === "offers");

  // Synchronize component state when URL search query changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    const cat = searchParams.get("cat") || "";
    if (cat) setSelectedCategory(cat);
    const filter = searchParams.get("filter") || "";
    if (filter === "offers") setOnlyOffers(true);
  }, [searchParams]);

  const t = {
    placeholder: language === "ar" ? "ابحث عن الأدوية، الصيدليات..." : "Search medicines, pharmacies...",
    products: language === "ar" ? "المنتجات" : "Products",
    pharmacies: language === "ar" ? "الصيدليات" : "Pharmacies",
    recent: language === "ar" ? "عمليات البحث الأخيرة" : "Recent Searches",
    trending: language === "ar" ? "الأكثر بحثاً" : "Trending Searches",
    noResults: language === "ar" ? "لم يتم العثور على نتائج" : "No results found",
    offers: language === "ar" ? "عروض فقط" : "Offers Only",
    allCats: language === "ar" ? "كل الفئات" : "All Categories",
    medications: language === "ar" ? "الأدوية" : "Medicines",
    vitamins: language === "ar" ? "الفيتامينات" : "Vitamins",
    baby: language === "ar" ? "العناية بالطفل" : "Baby Care",
    beauty: language === "ar" ? "العناية بالبشرة" : "Skin Care",
    devices: language === "ar" ? "الأجهزة الطبية" : "Medical Devices",
    personal: language === "ar" ? "العناية الشخصية" : "Personal Care",
    fitness: language === "ar" ? "الرشاقة والرياضة" : "Fitness",
    herbal: language === "ar" ? "المنتجات العشبية" : "Herbal",
    back: language === "ar" ? "رجوع" : "Back",
    filters: language === "ar" ? "تصفية النتائج" : "Filter Results",
    resultsFor: language === "ar" ? "نتائج البحث عن" : "Search results for",
    browseCatalog: language === "ar" ? "تصفح الدليل الطبي" : "Browse Health Catalog",
    categories: language === "ar" ? "الفئات" : "Categories"
  };

  const trendingSearches = [
    { en: "Panadol Soluble", ar: "بنادول فوار" },
    { en: "Vitamin D3", ar: "فيتامين د٣" },
    { en: "Baby Milk", ar: "حليب أطفال" },
    { en: "Insulin SoloStar", ar: "أنسولين لانتوس" }
  ];

  // Run filters
  const filteredProducts = mockProducts.filter((product) => {
    const name = (language === "ar" ? product.name_ar : product.name_en).toLowerCase();
    const desc = (language === "ar" ? product.description_ar : product.description_en).toLowerCase();
    const queryMatch = name.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());
    
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    const offerMatch = onlyOffers ? !!product.originalPrice : true;

    return queryMatch && categoryMatch && offerMatch;
  });

  const filteredPharmacies = mockPharmacies.filter((pharmacy) => {
    const name = (language === "ar" ? pharmacy.name_ar : pharmacy.name_en).toLowerCase();
    return name.includes(query.toLowerCase());
  });

  const handleSearchSubmit = (term) => {
    setQuery(term);
    addSearchHistory(term);
    router.push(`/search?q=${encodeURIComponent(term)}${selectedCategory ? `&cat=${selectedCategory}` : ""}${onlyOffers ? `&filter=offers` : ""}`);
  };

  return (
    <div className="two-col-layout">
      {/* 1. LEFT FILTER SIDEBAR (Desktop only) */}
      <div className="layout-side-col desktop-only" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
          ⚙️ {t.filters}
        </h3>
        
        {/* Offers toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>{t.offers}</span>
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={() => setOnlyOffers(!onlyOffers)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        </div>

        {/* Category list vertical selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-2)", textTransform: "uppercase", marginBottom: "4px" }}>{t.categories}</span>
          {[
            { id: "", name: t.allCats },
            { id: "medications", name: `💊 ${t.medications}` },
            { id: "vitamins", name: `🧴 ${t.vitamins}` },
            { id: "baby", name: `👶 ${t.baby}` },
            { id: "beauty", name: `✨ ${t.beauty}` },
            { id: "devices", name: `🩺 ${t.devices}` },
            { id: "personal", name: `🧼 ${t.personal}` },
            { id: "fitness", name: `💪 ${t.fitness}` },
            { id: "herbal", name: `🌿 ${t.herbal}` }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                textAlign: "start",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: selectedCategory === cat.id ? "rgba(15, 108, 189, 0.05)" : "transparent",
                color: selectedCategory === cat.id ? "var(--primary)" : "var(--text-1)",
                fontWeight: selectedCategory === cat.id ? "700" : "500",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. RIGHT / MAIN SEARCH CONTENT */}
      <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Mobile Page Header & Search Bar (or Desktop Refinement Search) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ background: "transparent", border: "none", fontSize: "14px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}
            >
              ← {t.back}
            </button>
            <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>
              {query ? `${t.resultsFor} "${query}"` : t.browseCatalog}
            </h2>
          </div>
          
          <div className="search-input-wrapper mobile-only" style={{ width: "100%" }}>
            <span className="search-icon-inside">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={t.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(query)}
            />
          </div>
        </div>

        {/* Mobile Filter Badges (Visible on mobile/tablet, hidden on desktop sidebar) */}
        <div className="mobile-only" style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setOnlyOffers(!onlyOffers)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: `1px solid ${onlyOffers ? "var(--success)" : "var(--border)"}`,
              backgroundColor: onlyOffers ? "rgba(16, 185, 129, 0.1)" : "var(--surface)",
              color: onlyOffers ? "var(--success)" : "var(--text-2)",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            🉐 {t.offers}
          </button>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              fontSize: "11px",
              color: "var(--text-1)",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="">📁 {t.allCats}</option>
            <option value="medications">{t.medications}</option>
            <option value="vitamins">{t.vitamins}</option>
            <option value="baby">{t.baby}</option>
            <option value="beauty">{t.beauty}</option>
            <option value="devices">{t.devices}</option>
            <option value="personal">{t.personal}</option>
            <option value="fitness">{t.fitness}</option>
            <option value="herbal">{t.herbal}</option>
          </select>
        </div>

        {/* Tabs for switching search items (Products vs Pharmacies) */}
        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === "products" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {t.products} ({filteredProducts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "pharmacies" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("pharmacies")}
          >
            {t.pharmacies} ({filteredPharmacies.length})
          </button>
        </div>

        {/* Search Results Display */}
        <div>
          {activeTab === "products" ? (
            filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <span className="empty-title">{t.noResults}</span>
              </div>
            )
          ) : (
            filteredPharmacies.length > 0 ? (
              <div className="responsive-grid-3">
                {filteredPharmacies.map((pharmacy) => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🏥</span>
                <span className="empty-title">{t.noResults}</span>
              </div>
            )
          )}
        </div>

        {/* Recent & Trending Searches (Only visible when query is empty) */}
        {!query && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
            {searchHistory.length > 0 && (
              <div>
                <h4 style={{ fontSize: "13px", color: "var(--text-2)", marginBottom: "8px" }}>{t.recent}</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {searchHistory.map((term, index) => (
                    <span
                      key={index}
                      onClick={() => handleSearchSubmit(term)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      ⏱️ {term}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: "13px", color: "var(--text-2)", marginBottom: "8px" }}>{t.trending}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {trendingSearches.map((term, index) => {
                  const label = language === "ar" ? term.ar : term.en;
                  return (
                    <span
                      key={index}
                      onClick={() => handleSearchSubmit(label)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "500"
                      }}
                    >
                      🔥 {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
