"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { mockProducts, mockPharmacies } from "@/mock/data";
import ProductCard from "@/components/ProductCard";
import PharmacyCard from "@/components/PharmacyCard";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function SearchContent() {
  const { 
    language, 
    searchHistory, 
    addSearchHistory,
    cart,
    addToCart,
    updateCartQuantity,
    wishlist,
    toggleWishlist
  } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get("cat") || "";
  const initialSub = searchParams.get("sub") || "";
  const initialFilter = searchParams.get("filter") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("products"); // products, pharmacies
  
  // Advanced filters and sorting states
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedSub, setSelectedSub] = useState(initialSub);
  const [onlyOffers, setOnlyOffers] = useState(initialFilter === "offers");
  const [sortBy, setSortBy] = useState("popular"); // popular, priceAsc, priceDesc, rating
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState([]);
  const [rxFilter, setRxFilter] = useState("all"); // all, rx, otc
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);

  // Synchronize component state when URL search query changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    const cat = searchParams.get("cat") || "";
    setSelectedCategory(cat);
    const sub = searchParams.get("sub") || "";
    setSelectedSub(sub);
    const filter = searchParams.get("filter") || "";
    setOnlyOffers(filter === "offers");
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
    categories: language === "ar" ? "الفئات" : "Categories",
    home: language === "ar" ? "الرئيسية" : "Home",
    searchBreadcrumb: language === "ar" ? "البحث" : "Search",
    rx: language === "ar" ? "وصفة" : "Rx",
    cold: language === "ar" ? "تبريد" : "Cold",
    sar: language === "ar" ? "ر.س" : "SAR",
    add: language === "ar" ? "إضافة" : "Add"
  };

  const categorySubcategories = {
    medications: [
      { en: "Pain Relief", ar: "مسكنات الألم" },
      { en: "Cold & Flu", ar: "البرد والأنفلونزا" },
      { en: "Chronic Diseases", ar: "الأمراض المزمنة" },
      { en: "First Aid", ar: "الإسعافات الأولية" }
    ],
    vitamins: [
      { en: "Multivitamins", ar: "الفيتامينات المتعددة" },
      { en: "Minerals", ar: "المعادن" },
      { en: "Immunity Boosters", ar: "مقويات المناعة" },
      { en: "Fish Oil", ar: "زيت السمك" }
    ],
    baby: [
      { en: "Baby Milk", ar: "حليب الأطفال" },
      { en: "Diapers", ar: "الحفاضات" },
      { en: "Baby Skincare", ar: "العناية ببشرة الطفل" },
      { en: "Feeding Accessories", ar: "أدوات التغذية" }
    ],
    beauty: [
      { en: "Skincare", ar: "العناية بالبشرة" },
      { en: "Suncare", ar: "واقيات الشمس" },
      { en: "Moisturizers", ar: "المرطبات" },
      { en: "Serums", ar: "السيروم" }
    ],
    devices: [
      { en: "Blood Pressure", ar: "أجهزة الضغط" },
      { en: "Thermometers", ar: "موازين الحرارة" },
      { en: "Glucose Monitors", ar: "أجهزة السكر" },
      { en: "Nebulizers", ar: "أجهزة البخار" }
    ],
    personal: [
      { en: "Body Wash", ar: "غسول الجسم" },
      { en: "Deodorants", ar: "مزيلات العرق" },
      { en: "Oral Care", ar: "العناية بالفم" },
      { en: "Hair Care", ar: "العناية بالشعر" }
    ],
    fitness: [
      { en: "Protein Powder", ar: "بودرة البروتين" },
      { en: "Energy Bars", ar: "ألواح الطاقة" },
      { en: "Shakers", ar: "شيكرات" },
      { en: "Fat Burners", ar: "حوارق الدهون" }
    ],
    herbal: [
      { en: "Herbal Tea", ar: "الشاي العشبي" },
      { en: "Natural Oils", ar: "الزيوت الطبيعية" },
      { en: "Honey", ar: "العسل" },
      { en: "Organic Herbs", ar: "الأعشاب العضوية" }
    ]
  };

  const categoryLabels = {
    medications: t.medications,
    vitamins: t.vitamins,
    baby: t.baby,
    beauty: t.beauty,
    devices: t.devices,
    personal: t.personal,
    fitness: t.fitness,
    herbal: t.herbal
  };

  const getSubcategoryLabel = (cat, subEn) => {
    if (!cat || !subEn) return "";
    const list = categorySubcategories[cat];
    if (!list) return subEn;
    const match = list.find((item) => item.en === subEn);
    return match ? (language === "ar" ? match.ar : match.en) : subEn;
  };

  const trendingSearches = [
    { en: "Panadol Soluble", ar: "بنادول فوار" },
    { en: "Vitamin D3", ar: "فيتامين د٣" },
    { en: "Baby Milk", ar: "حليب أطفال" },
    { en: "Insulin SoloStar", ar: "أنسولين لانتوس" }
  ];

  // Helper sync functions
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedSub(""); // Clear subcategory when parent category changes

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (catId) params.set("cat", catId);
    if (onlyOffers) params.set("filter", "offers");
    router.push(`/search?${params.toString()}`);
  };

  const handleSubCategoryChange = (subId) => {
    setSelectedSub(subId);

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory) params.set("cat", selectedCategory);
    if (subId) params.set("sub", subId);
    if (onlyOffers) params.set("filter", "offers");
    router.push(`/search?${params.toString()}`);
  };

  const handleOffersToggle = (checked) => {
    setOnlyOffers(checked);

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory) params.set("cat", selectedCategory);
    if (selectedSub) params.set("sub", selectedSub);
    if (checked) params.set("filter", "offers");
    router.push(`/search?${params.toString()}`);
  };

  // Run filters
  const filteredProducts = mockProducts.filter((product) => {
    const name = (language === "ar" ? product.name_ar : product.name_en).toLowerCase();
    const desc = (language === "ar" ? product.description_ar : product.description_en).toLowerCase();
    const queryMatch = name.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());

    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    const subcategoryMatch = selectedSub ? product.subcategory === selectedSub : true;
    const offerMatch = onlyOffers ? !!product.originalPrice : true;

    // Price range filters
    const minVal = minPrice ? parseFloat(minPrice) : 0;
    const maxVal = maxPrice ? parseFloat(maxPrice) : Infinity;
    const priceMatch = product.price >= minVal && product.price <= maxVal;

    // Brands filters
    const brandMatch = selectedBrands.length > 0
      ? selectedBrands.some(brand => product.name_en.toLowerCase().includes(brand.toLowerCase()))
      : true;

    // Pharmacies filters
    const pharmacyMatch = selectedPharmacies.length > 0
      ? selectedPharmacies.includes(product.pharmacyId)
      : true;

    // Rx required status filter
    let rxMatch = true;
    if (rxFilter === "rx") rxMatch = product.isRx;
    else if (rxFilter === "otc") rxMatch = !product.isRx;

    return queryMatch && categoryMatch && subcategoryMatch && offerMatch && priceMatch && brandMatch && pharmacyMatch && rxMatch;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceAsc") {
      return a.price - b.price;
    } else if (sortBy === "priceDesc") {
      return b.price - a.price;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      // popular (by reviews count as popularity proxy)
      return b.reviewsCount - a.reviewsCount;
    }
  });

  const filteredPharmacies = mockPharmacies.filter((pharmacy) => {
    const name = (language === "ar" ? pharmacy.name_ar : pharmacy.name_en).toLowerCase();
    return name.includes(query.toLowerCase());
  });

  const handleSearchSubmit = (term) => {
    setQuery(term);
    addSearchHistory(term);

    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (selectedCategory) params.set("cat", selectedCategory);
    if (selectedSub) params.set("sub", selectedSub);
    if (onlyOffers) params.set("filter", "offers");
    router.push(`/search?${params.toString()}`);
  };

  // Compile active filter tags helper
  const activeFilterTags = [];
  if (minPrice) {
    activeFilterTags.push({ type: "minPrice", label: language === "ar" ? `الحد الأدنى: ${minPrice} ر.س` : `Min: ${minPrice} SAR` });
  }
  if (maxPrice) {
    activeFilterTags.push({ type: "maxPrice", label: language === "ar" ? `الحد الأقصى: ${maxPrice} ر.س` : `Max: ${maxPrice} SAR` });
  }
  selectedBrands.forEach((b) => {
    activeFilterTags.push({ type: "brand", value: b, label: b });
  });
  selectedPharmacies.forEach((phId) => {
    const ph = mockPharmacies.find((p) => p.id === phId);
    const label = ph ? (language === "ar" ? ph.name_ar : ph.name_en) : phId;
    activeFilterTags.push({ type: "pharmacy", value: phId, label: label });
  });
  if (rxFilter !== "all") {
    activeFilterTags.push({
      type: "rx",
      label: rxFilter === "rx" 
        ? (language === "ar" ? "الوصفة مطلوبة (Rx)" : "Rx Required")
        : (language === "ar" ? "بدون وصفة (OTC)" : "OTC Standard")
    });
  }

  const removeFilterTag = (tag) => {
    if (tag.type === "minPrice") setMinPrice("");
    else if (tag.type === "maxPrice") setMaxPrice("");
    else if (tag.type === "rx") setRxFilter("all");
    else if (tag.type === "brand") setSelectedBrands(selectedBrands.filter((b) => b !== tag.value));
    else if (tag.type === "pharmacy") setSelectedPharmacies(selectedPharmacies.filter((p) => p !== tag.value));
  };

  const resetAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrands([]);
    setSelectedPharmacies([]);
    setRxFilter("all");
    setOnlyOffers(false);
    setSelectedCategory("");
    setSelectedSub("");
    setSortBy("popular");
  };

  // Shared Filters Layout Renderer
  const renderFilterSection = (isMobileView = false) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Mobile-only Sort option inside Drawer */}
        {isMobileView && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-2)", textTransform: "uppercase" }}>
              {language === "ar" ? "ترتيب حسب" : "SORT BY"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text-1)",
                outline: "none",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <option value="popular">🔥 {language === "ar" ? "الأكثر شعبية" : "Popularity"}</option>
              <option value="priceAsc">⬇️ {language === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="priceDesc">⬆️ {language === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="rating">⭐ {language === "ar" ? "الأعلى تقييماً" : "Customer Rating"}</option>
            </select>
          </div>
        )}

        {/* Offers only switcher */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-1)" }}>
            🉐 {language === "ar" ? "العروض والتخفيضات فقط" : "Offers & Discounts"}
          </span>
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => handleOffersToggle(e.target.checked)}
            style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--primary)" }}
          />
        </div>

        {/* Price bounds inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-2)", textTransform: "uppercase" }}>
            {language === "ar" ? "نطاق السعر (ر.س)" : "PRICE RANGE (SAR)"}
          </span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="number"
              placeholder={language === "ar" ? "الأدنى" : "Min"}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text-1)",
                fontSize: "12px",
                outline: "none"
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--text-2)" }}>—</span>
            <input
              type="number"
              placeholder={language === "ar" ? "الأقصى" : "Max"}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text-1)",
                fontSize: "12px",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Prescription/Rx Requirement status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-2)", textTransform: "uppercase" }}>
            {language === "ar" ? "نوع الدواء والوصفة" : "REGULATORY REQUIREMENTS"}
          </span>
          <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            {[
              { id: "all", label_en: "All Types", label_ar: "الكل" },
              { id: "rx", label_en: "Rx Required", label_ar: "وصفة فقط" },
              { id: "otc", label_en: "OTC Standard", label_ar: "دواء عام" }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRxFilter(opt.id)}
                style={{
                  flex: 1,
                  border: "none",
                  backgroundColor: rxFilter === opt.id ? "var(--surface)" : "transparent",
                  color: rxFilter === opt.id ? "var(--primary)" : "var(--text-2)",
                  fontWeight: rxFilter === opt.id ? "700" : "500",
                  fontSize: "10px",
                  padding: "6px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: rxFilter === opt.id ? "var(--shadow-sm)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {language === "ar" ? opt.label_ar : opt.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Brand selection checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-2)", textTransform: "uppercase" }}>
            {language === "ar" ? "العلامات التجارية" : "BRANDS"}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
            {["Panadol", "Solgar", "Ventolin", "Similac", "Lantus", "CeraVe", "Omron", "Eucerin", "GNC", "Bioderma"].map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label key={brand} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer", color: "var(--text-1)" }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                      else setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                    }}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--primary)" }}
                  />
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Pharmacies selection checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-2)", textTransform: "uppercase" }}>
            {language === "ar" ? "الصيدليات" : "PHARMACIES"}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
            {mockPharmacies.map((ph) => {
              const label = language === "ar" ? ph.name_ar : ph.name_en;
              const isChecked = selectedPharmacies.includes(ph.id);
              return (
                <label key={ph.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer", color: "var(--text-1)" }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedPharmacies([...selectedPharmacies, ph.id]);
                      else setSelectedPharmacies(selectedPharmacies.filter((p) => p !== ph.id));
                    }}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--primary)" }}
                  />
                  <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <span>{ph.logo}</span>
                    <span>{label}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Clear Filters helper button inside sidebar */}
        <button
          type="button"
          onClick={resetAllFilters}
          style={{
            border: "1px dashed var(--border)",
            background: "transparent",
            color: "#ef4444",
            padding: "8px 12px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            width: "100%",
            marginTop: "8px",
            transition: "all 0.15s"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(239, 68, 68, 0.05)"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
        >
          🗑️ {language === "ar" ? "إعادة ضبط جميع الفلاتر" : "Reset All Filters"}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav
        style={{
          fontSize: "12px",
          color: "var(--text-2)",
          marginBottom: "4px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap"
        }}
      >
        <Link href="/home" style={{ color: "var(--text-2)", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-2)'}>
          {t.home}
        </Link>
        <span>&gt;</span>

        {selectedCategory ? (
          <>
            <Link href="/search" style={{ color: "var(--text-2)", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-2)'}>
              {t.searchBreadcrumb}
            </Link>
            <span>&gt;</span>
            {selectedSub ? (
              <>
                <Link
                  href={`/search?cat=${selectedCategory}`}
                  style={{ color: "var(--text-2)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-2)'}
                >
                  {categoryLabels[selectedCategory]}
                </Link>
                <span>&gt;</span>
                <span style={{ color: "var(--text-1)", fontWeight: "600" }}>
                  {getSubcategoryLabel(selectedCategory, selectedSub)}
                </span>
              </>
            ) : (
              <span style={{ color: "var(--text-1)", fontWeight: "600" }}>
                {categoryLabels[selectedCategory]}
              </span>
            )}
          </>
        ) : (
          <span style={{ color: "var(--text-1)", fontWeight: "600" }}>{t.searchBreadcrumb}</span>
        )}
      </nav>

      <div className="two-col-layout">
        
        {/* 1. LEFT FILTER SIDEBAR (Desktop only) */}
        <div className="layout-side-col desktop-only" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
            {t.filters}
          </h3>

          {/* Render the full filter form */}
          {renderFilterSection(false)}
        </div>

        {/* 2. RIGHT / MAIN SEARCH CONTENT */}
        <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Mobile Search Input Wrapper */}
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

          {/* Controls Bar: Sort, view switcher & mobile filter button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "10px 14px", gap: "10px" }}>
            
            {/* Left side info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--text-1)" }}>
                {selectedSub 
                  ? getSubcategoryLabel(selectedCategory, selectedSub)
                  : selectedCategory 
                    ? categoryLabels[selectedCategory] 
                    : (query ? `${t.resultsFor} "${query}"` : (language === "ar" ? "جميع المنتجات" : "All Products"))}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-2)" }}>
                {activeTab === "products" 
                  ? `${sortedProducts.length} ${language === "ar" ? "منتج" : "items"}` 
                  : `${filteredPharmacies.length} ${language === "ar" ? "صيدلية" : "pharmacies"}`}
              </span>
            </div>

            {/* Right side controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              
              {/* Desktop-only Sort dropdown */}
              <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-2)" }}>{language === "ar" ? "ترتيب:" : "Sort:"}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg)",
                    color: "var(--text-1)",
                    fontSize: "12px",
                    fontWeight: "600",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="popular">🔥 {language === "ar" ? "الأكثر شعبية" : "Popular"}</option>
                  <option value="priceAsc">⬇️ {language === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
                  <option value="priceDesc">⬆️ {language === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
                  <option value="rating">⭐ {language === "ar" ? "التقييم" : "Best Rating"}</option>
                </select>
              </div>

              {/* Grid vs List View mode switcher (Products tab only) */}
              {activeTab === "products" && (
                <div style={{ display: "flex", gap: "4px", border: "1px solid var(--border)", padding: "3px", borderRadius: "8px", backgroundColor: "var(--bg)" }}>
                  <button 
                    onClick={() => setViewMode("grid")}
                    style={{
                      border: "none",
                      background: viewMode === "grid" ? "var(--surface)" : "transparent",
                      color: viewMode === "grid" ? "var(--primary)" : "var(--text-2)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "700"
                    }}
                    title={language === "ar" ? "عرض شبكة" : "Grid View"}
                  >
                    田
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    style={{
                      border: "none",
                      background: viewMode === "list" ? "var(--surface)" : "transparent",
                      color: viewMode === "list" ? "var(--primary)" : "var(--text-2)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "700"
                    }}
                    title={language === "ar" ? "عرض قائمة" : "List View"}
                  >
                    ☰
                  </button>
                </div>
              )}

              {/* Mobile Filter Button */}
              <button
                className="mobile-only"
                onClick={() => setShowMobileFilterDrawer(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-1)",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                🔍 {t.filters}
                {activeFilterTags.length > 0 && (
                  <span style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px"
                  }}>
                    {activeFilterTags.length}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginTop: "-10px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-2)", fontWeight: "600" }}>
                {language === "ar" ? "الفلاتر النشطة:" : "Active Filters:"}
              </span>
              {activeFilterTags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(15, 108, 189, 0.05)",
                    border: "1px solid rgba(15, 108, 189, 0.12)",
                    color: "var(--primary)",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600"
                  }}
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={() => removeFilterTag(tag)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--primary)",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      fontWeight: "800"
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
              <button
                onClick={resetAllFilters}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#ef4444",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                {language === "ar" ? "مسح الكل" : "Clear All"}
              </button>
            </div>
          )}

          {/* Dynamic Subcategories Ribbon */}
          {selectedCategory && categorySubcategories[selectedCategory] && (
            <div
              className="horizontal-scroll"
              style={{
                display: "flex",
                gap: "8px",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "12px",
                marginTop: "-8px"
              }}
            >
              <button
                onClick={() => handleSubCategoryChange("")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "16px",
                  border: `1.5px solid ${!selectedSub ? "var(--primary)" : "var(--border)"}`,
                  backgroundColor: !selectedSub ? "var(--primary)" : "var(--surface)",
                  color: !selectedSub ? "var(--text-on-primary)" : "var(--text-2)",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s"
                }}
              >
                {language === "ar" ? "الكل" : "All"}
              </button>
              {categorySubcategories[selectedCategory].map((subItem, idx) => {
                const label = language === "ar" ? subItem.ar : subItem.en;
                const isSelected = selectedSub === subItem.en;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSubCategoryChange(subItem.en)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "16px",
                      border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: isSelected ? "var(--primary)" : "var(--surface)",
                      color: isSelected ? "var(--text-on-primary)" : "var(--text-2)",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "all 0.15s"
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tabs for switching search items (Products vs Pharmacies) */}
          <div className="tab-container">
            <button
              className={`tab-btn ${activeTab === "products" ? "tab-btn-active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              {t.products} ({sortedProducts.length})
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
              sortedProducts.length > 0 ? (
                viewMode === "grid" ? (
                  /* Standard Grid Card View */
                  <div className="product-grid">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  /* Custom Premium List Item View (Screen 9 Specification) */
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {sortedProducts.map((product) => {
                      const name = language === "ar" ? product.name_ar : product.name_en;
                      const pharmName = language === "ar" ? product.pharmacyName_ar : product.pharmacyName_en;
                      const description = language === "ar" ? product.description_ar : product.description_en;
                      const isWishlisted = wishlist.includes(product.id);
                      
                      return (
                        <div 
                          key={product.id}
                          className="list-product-card"
                          style={{
                            display: "flex",
                            gap: "18px",
                            backgroundColor: "var(--surface)",
                            border: "1.5px solid var(--border)",
                            borderRadius: "20px",
                            padding: "18px",
                            position: "relative",
                            transition: "all 0.2s",
                            boxShadow: "var(--shadow-sm)",
                            flexDirection: "row"
                          }}
                        >
                          {/* Image box and Badges */}
                          <div style={{ position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg)", borderRadius: "14px", fontSize: "42px", flexShrink: 0 }}>
                            <span>{product.image}</span>
                            
                            <div style={{ position: "absolute", top: "6px", left: "6px", display: "flex", flexDirection: "column", gap: "2px" }}>
                              {product.isRx && <span style={{ backgroundColor: "#ef4444", color: "white", padding: "1px 5px", borderRadius: "4px", fontSize: "8px", fontWeight: "800" }}>{t.rx}</span>}
                              {product.isColdChain && <span style={{ backgroundColor: "#0284c7", color: "white", padding: "1px 5px", borderRadius: "4px", fontSize: "8px", fontWeight: "800" }}>{t.cold}</span>}
                            </div>

                            {product.originalPrice && (
                              <span style={{ position: "absolute", bottom: "6px", right: "6px", backgroundColor: "#10b981", color: "white", padding: "1px 5px", borderRadius: "4px", fontSize: "8px", fontWeight: "800" }}>
                                %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                              </span>
                            )}
                          </div>

                          {/* Info center content */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, textAlign: language === "ar" ? "right" : "left" }}>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", fontSize: "11px", color: "var(--text-2)" }}>
                              <span>🏥 {pharmName}</span>
                              <span>•</span>
                              <span style={{ color: "#f59e0b", fontWeight: "700" }}>⭐ {product.rating}</span>
                              <span style={{ opacity: 0.8 }}>({product.reviewsCount})</span>
                            </div>
                            
                            <Link href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-1)", margin: "4px 0" }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-1)'}>
                                {name}
                              </h4>
                            </Link>

                            <p style={{ fontSize: "12px", color: "var(--text-2)", margin: "2px 0 0 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>
                              {description}
                            </p>
                          </div>

                          {/* Actions / Pricing column */}
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: language === "ar" ? "flex-start" : "flex-end",
                            width: "120px",
                            borderInlineStart: "1px solid var(--border)",
                            paddingInlineStart: "16px",
                            flexShrink: 0
                          }}>
                            <div style={{ textAlign: language === "ar" ? "left" : "right" }}>
                              <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-1)" }}>
                                {product.price.toFixed(2)} <span style={{ fontSize: "10px" }}>{t.sar}</span>
                              </div>
                              {product.originalPrice && (
                                <div style={{ fontSize: "11px", color: "var(--text-2)", textDecoration: "line-through" }}>
                                  {product.originalPrice.toFixed(2)} {t.sar}
                                </div>
                              )}
                            </div>

                            {/* Cart CTA or numeric quantity selectors */}
                            {(() => {
                              const cartItem = cart.find((item) => item.id === product.id);
                              return cartItem ? (
                                <div className="qty-counter" style={{ width: "100%", height: "32px" }}>
                                  <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}>-</button>
                                  <span className="qty-val" style={{ fontSize: "12px" }}>{cartItem.quantity}</span>
                                  <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}>+</button>
                                </div>
                              ) : (
                                <button 
                                  className="btn-primary"
                                  onClick={() => addToCart(product, 1)}
                                  style={{
                                    width: "100%",
                                    paddingBlock: "6px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px"
                                  }}
                                >
                                  {t.add}
                                </button>
                              );
                            })()}
                          </div>

                          {/* Float Wishlist button */}
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: language === "ar" ? "auto" : "10px",
                              left: language === "ar" ? "10px" : "auto",
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              zIndex: 10
                            }}
                          >
                            {isWishlisted ? "❤️" : "🤍"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Empty match state with Reset filters button (Screen 9 Empty state) */
                <div 
                  className="empty-state"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "50px 20px",
                    backgroundColor: "var(--surface)",
                    border: "1.5px dashed var(--border)",
                    borderRadius: "24px",
                    textAlign: "center",
                    gap: "14px"
                  }}
                >
                  <span style={{ fontSize: "60px" }}>🔍</span>
                  <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>
                    {t.noResults}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-2)", margin: 0, maxWidth: "340px", lineHeight: "1.5" }}>
                    {language === "ar" 
                      ? "لم نجد أي دواء أو منتج صحي يطابق هذه الخيارات. حاول تعديل نطاق الأسعار أو الفلاتر النشطة." 
                      : "We couldn't find any health products matching your filtered options. Try adjusting the ranges or clear selectors."}
                  </p>
                  <button 
                    onClick={resetAllFilters}
                    className="btn-primary"
                    style={{
                      padding: "8px 18px",
                      fontSize: "12px",
                      borderRadius: "12px"
                    }}
                  >
                    🔄 {language === "ar" ? "إعادة تعيين الفلاتر" : "Reset Active Filters"}
                  </button>
                </div>
              )
            ) : (
              /* Pharmacies search results */
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
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px", textAlign: language === "ar" ? "right" : "left" }}>
              {searchHistory.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "13px", color: "var(--text-2)", marginBottom: "8px" }}>{t.recent}</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: language === "ar" ? "flex-start" : "flex-start" }}>
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

      {/* 3. MOBILE FILTER SLIDE-UP DRAWER MODAL (Screen 9 Mobile Specs) */}
      {showMobileFilterDrawer && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 5000,
            display: "flex",
            alignItems: "flex-end"
          }}
          onClick={() => setShowMobileFilterDrawer(false)}
        >
          <div 
            style={{
              width: "100%",
              maxHeight: "85vh",
              backgroundColor: "var(--surface)",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0 -8px 24px rgba(0,0,0,0.15)",
              textAlign: language === "ar" ? "right" : "left"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>
                {language === "ar" ? "خيارات التصفية والترتيب" : "Filter & Sort Options"}
              </h3>
              <button 
                onClick={() => setShowMobileFilterDrawer(false)}
                style={{
                  border: "none",
                  backgroundColor: "var(--bg)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "var(--text-2)"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1 }}>
              {renderFilterSection(true)}
            </div>

            <button
              onClick={() => setShowMobileFilterDrawer(false)}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "13px",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {language === "ar" ? "تطبيق الفلاتر" : "Apply Filters"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
