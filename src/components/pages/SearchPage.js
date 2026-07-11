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
      <div className="search-filters-container">
        {/* Mobile-only Sort option inside Drawer */}
        {isMobileView && (
          <div className="search-filter-col">
            <span className="search-filter-title">
              {language === "ar" ? "ترتيب حسب" : "SORT BY"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="search-filter-select"
            >
              <option value="popular">🔥 {language === "ar" ? "الأكثر شعبية" : "Popularity"}</option>
              <option value="priceAsc">⬇️ {language === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="priceDesc">⬆️ {language === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="rating">⭐ {language === "ar" ? "الأعلى تقييماً" : "Customer Rating"}</option>
            </select>
          </div>
        )}

        {/* Offers only switcher */}
        <div className="search-filter-row-between">
          <span className="search-filter-row-text">
            🉐 {language === "ar" ? "العروض والتخفيضات فقط" : "Offers & Discounts"}
          </span>
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => handleOffersToggle(e.target.checked)}
            className="search-checkbox"
          />
        </div>

        {/* Price bounds inputs */}
        <div className="search-filter-col">
          <span className="search-filter-title">
            {language === "ar" ? "نطاق السعر (ر.س)" : "PRICE RANGE (SAR)"}
          </span>
          <div className="search-price-inputs-row">
            <input
              type="number"
              placeholder={language === "ar" ? "الأدنى" : "Min"}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="search-price-input"
            />
            <span className="search-sort-label">—</span>
            <input
              type="number"
              placeholder={language === "ar" ? "الأقصى" : "Max"}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="search-price-input"
            />
          </div>
        </div>

        {/* Prescription/Rx Requirement status */}
        <div className="search-filter-col-gap8">
          <span className="search-filter-title">
            {language === "ar" ? "نوع الدواء والوصفة" : "REGULATORY REQUIREMENTS"}
          </span>
          <div className="search-rx-tabs-row">
            {[
              { id: "all", label_en: "All Types", label_ar: "الكل" },
              { id: "rx", label_en: "Rx Required", label_ar: "وصفة فقط" },
              { id: "otc", label_en: "OTC Standard", label_ar: "دواء عام" }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRxFilter(opt.id)}
                className={`search-rx-tab-btn ${rxFilter === opt.id ? "active" : ""}`}
              >
                {language === "ar" ? opt.label_ar : opt.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Brand selection checklist */}
        <div className="search-filter-col-gap8">
          <span className="search-filter-title">
            {language === "ar" ? "العلامات التجارية" : "BRANDS"}
          </span>
          <div className="search-filter-checklist">
            {["Panadol", "Solgar", "Ventolin", "Similac", "Lantus", "CeraVe", "Omron", "Eucerin", "GNC", "Bioderma"].map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label key={brand} className="search-checklist-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                      else setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                    }}
                    className="search-checkbox-sm"
                  />
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Pharmacies selection checklist */}
        <div className="search-filter-col-gap8">
          <span className="search-filter-title">
            {language === "ar" ? "الصيدليات" : "PHARMACIES"}
          </span>
          <div className="search-filter-checklist">
            {mockPharmacies.map((ph) => {
              const label = language === "ar" ? ph.name_ar : ph.name_en;
              const isChecked = selectedPharmacies.includes(ph.id);
              return (
                <label key={ph.id} className="search-checklist-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedPharmacies([...selectedPharmacies, ph.id]);
                      else setSelectedPharmacies(selectedPharmacies.filter((p) => p !== ph.id));
                    }}
                    className="search-checkbox-sm"
                  />
                  <span className="search-checklist-item-logo-row">
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
          className="search-reset-btn"
        >
          🗑️ {language === "ar" ? "إعادة ضبط جميع الفلاتر" : "Reset All Filters"}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="search-breadcrumbs">
        <Link href="/home" className="search-breadcrumb-link">
          {t.home}
        </Link>
        <span>&gt;</span>

        {selectedCategory ? (
          <>
            <Link href="/search" className="search-breadcrumb-link">
              {t.searchBreadcrumb}
            </Link>
            <span>&gt;</span>
            {selectedSub ? (
              <>
                <Link
                  href={`/search?cat=${selectedCategory}`}
                  className="search-breadcrumb-link"
                >
                  {categoryLabels[selectedCategory]}
                </Link>
                <span>&gt;</span>
                <span className="search-breadcrumb-current">
                  {getSubcategoryLabel(selectedCategory, selectedSub)}
                </span>
              </>
            ) : (
              <span className="search-breadcrumb-current">
                {categoryLabels[selectedCategory]}
              </span>
            )}
          </>
        ) : (
          <span className="search-breadcrumb-current">{t.searchBreadcrumb}</span>
        )}
      </nav>

      <div className="two-col-layout">
        
        {/* 1. LEFT FILTER SIDEBAR (Desktop only) */}
        <div className="layout-side-col desktop-only">
          <h3 className="search-sidebar-title">
            {t.filters}
          </h3>

          {/* Render the full filter form */}
          {renderFilterSection(false)}
        </div>

        {/* 2. RIGHT / MAIN SEARCH CONTENT */}
        <div className="layout-main-col">

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
          <div className="search-controls-bar">
            
            {/* Left side info */}
            <div className="search-info-col">
              <span className="search-info-title">
                {selectedSub 
                  ? getSubcategoryLabel(selectedCategory, selectedSub)
                  : selectedCategory 
                    ? categoryLabels[selectedCategory] 
                    : (query ? `${t.resultsFor} "${query}"` : (language === "ar" ? "جميع المنتجات" : "All Products"))}
              </span>
              <span className="search-info-count">
                {activeTab === "products" 
                  ? `${sortedProducts.length} ${language === "ar" ? "منتج" : "items"}` 
                  : `${filteredPharmacies.length} ${language === "ar" ? "صيدلية" : "pharmacies"}`}
              </span>
            </div>

            {/* Right side controls */}
            <div className="search-controls-row">
              
              {/* Desktop-only Sort dropdown */}
              <div className="desktop-only search-sort-dropdown-container">
                <span className="search-sort-label">{language === "ar" ? "ترتيب:" : "Sort:"}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="search-sort-select"
                >
                  <option value="popular">🔥 {language === "ar" ? "الأكثر شعبية" : "Popular"}</option>
                  <option value="priceAsc">⬇️ {language === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
                  <option value="priceDesc">⬆️ {language === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
                  <option value="rating">⭐ {language === "ar" ? "التقييم" : "Best Rating"}</option>
                </select>
              </div>

              {/* Grid vs List View mode switcher (Products tab only) */}
              {activeTab === "products" && (
                <div className="search-view-switcher-row">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`search-view-btn ${viewMode === "grid" ? "active" : ""}`}
                    title={language === "ar" ? "عرض شبكة" : "Grid View"}
                  >
                    田
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`search-view-btn ${viewMode === "list" ? "active" : ""}`}
                    title={language === "ar" ? "عرض قائمة" : "List View"}
                  >
                    ☰
                  </button>
                </div>
              )}

              {/* Mobile Filter Button */}
              <button
                className="mobile-only search-mobile-filter-btn"
                onClick={() => setShowMobileFilterDrawer(true)}
              >
                🔍 {t.filters}
                {activeFilterTags.length > 0 && (
                  <span className="search-mobile-filter-count">
                    {activeFilterTags.length}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className="search-active-tags-row">
              <span className="search-active-tags-label">
                {language === "ar" ? "الفلاتر النشطة:" : "Active Filters:"}
              </span>
              {activeFilterTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="search-active-tag-badge"
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={() => removeFilterTag(tag)}
                    className="search-active-tag-close-btn"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <button
                onClick={resetAllFilters}
                className="search-clear-all-link-btn"
              >
                {language === "ar" ? "مسح الكل" : "Clear All"}
              </button>
            </div>
          )}

          {/* Dynamic Subcategories Ribbon */}
          {selectedCategory && categorySubcategories[selectedCategory] && (
            <div className="horizontal-scroll search-subcategories-scroll">
              <button
                onClick={() => handleSubCategoryChange("")}
                className={`search-subcategory-chip-btn ${!selectedSub ? "active" : ""}`}
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
                    className={`search-subcategory-chip-btn ${isSelected ? "active" : ""}`}
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
                  <div className="search-list-container">
                    {sortedProducts.map((product) => {
                      const name = language === "ar" ? product.name_ar : product.name_en;
                      const pharmName = language === "ar" ? product.pharmacyName_ar : product.pharmacyName_en;
                      const description = language === "ar" ? product.description_ar : product.description_en;
                      const isWishlisted = wishlist.includes(product.id);
                      
                      return (
                        <div 
                          key={product.id}
                          className="search-list-product-card"
                        >
                          {/* Image box and Badges */}
                          <div className="search-list-img-box">
                            <span>{product.image}</span>
                            
                            <div className="search-list-badges-col">
                              {product.isRx && <span className="search-badge-danger">{t.rx}</span>}
                              {product.isColdChain && <span className="search-badge-info">{t.cold}</span>}
                            </div>

                            {product.originalPrice && (
                              <span className="search-list-discount-badge">
                                %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                              </span>
                            )}
                          </div>

                          {/* Info center content */}
                          <div className="search-list-info-col" style={{ textAlign: language === "ar" ? "right" : "left" }}>
                            <div className="search-list-vendor-meta">
                              <span>🏥 {pharmName}</span>
                              <span>•</span>
                              <span className="search-list-rating-value">⭐ {product.rating}</span>
                              <span style={{ opacity: 0.8 }}>({product.reviewsCount})</span>
                            </div>
                            
                            <Link href={`/product/${product.id}`} className="search-list-product-title-link">
                              <h4 className="search-list-product-title">
                                {name}
                              </h4>
                            </Link>

                            <p className="search-list-product-desc">
                              {description}
                            </p>
                          </div>

                          {/* Actions / Pricing column */}
                          <div 
                            className="search-list-actions-col"
                            style={{ alignItems: language === "ar" ? "flex-start" : "flex-end" }}
                          >
                            <div style={{ textAlign: language === "ar" ? "left" : "right" }}>
                              <div className="search-list-price-main">
                                {product.price.toFixed(2)} <span className="search-list-currency">{t.sar}</span>
                              </div>
                              {product.originalPrice && (
                                <div className="search-list-price-original">
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
                                  className="btn-primary search-list-add-btn"
                                  onClick={() => addToCart(product, 1)}
                                >
                                  {t.add}
                                </button>
                              );
                            })()}
                          </div>

                          {/* Float Wishlist button */}
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className="search-list-wishlist-btn"
                            style={{
                              right: language === "ar" ? "auto" : "10px",
                              left: language === "ar" ? "10px" : "auto",
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
                <div className="search-empty-state">
                  <span className="search-empty-icon">🔍</span>
                  <h3 className="search-empty-title">
                    {t.noResults}
                  </h3>
                  <p className="search-empty-desc">
                    {language === "ar" 
                      ? "لم نجد أي دواء أو منتج صحي يطابق هذه الخيارات. حاول تعديل نطاق الأسعار أو الفلاتر النشطة." 
                      : "We couldn't find any health products matching your filtered options. Try adjusting the ranges or clear selectors."}
                  </p>
                  <button 
                    onClick={resetAllFilters}
                    className="btn-primary search-empty-reset-btn"
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
            <div className="search-history-container" style={{ textAlign: language === "ar" ? "right" : "left" }}>
              {searchHistory.length > 0 && (
                <div>
                  <h4 className="search-history-section-title">{t.recent}</h4>
                  <div className="search-history-tags-row">
                    {searchHistory.map((term, index) => (
                      <span
                        key={index}
                        onClick={() => handleSearchSubmit(term)}
                        className="search-history-tag"
                      >
                        ⏱️ {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="search-history-section-title">{t.trending}</h4>
                <div className="search-history-tags-row">
                  {trendingSearches.map((term, index) => {
                    const label = language === "ar" ? term.ar : term.en;
                    return (
                      <span
                        key={index}
                        onClick={() => handleSearchSubmit(label)}
                        className="search-history-tag-trending"
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
          className="search-mobile-drawer-overlay"
          onClick={() => setShowMobileFilterDrawer(false)}
        >
          <div 
            className="search-mobile-drawer-sheet"
            style={{ textAlign: language === "ar" ? "right" : "left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-mobile-drawer-header">
              <h3 className="search-mobile-drawer-title">
                {language === "ar" ? "خيارات التصفية والترتيب" : "Filter & Sort Options"}
              </h3>
              <button 
                onClick={() => setShowMobileFilterDrawer(false)}
                className="search-mobile-drawer-close-btn"
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1 }}>
              {renderFilterSection(true)}
            </div>

            <button
              onClick={() => setShowMobileFilterDrawer(false)}
              className="btn-primary search-mobile-drawer-apply-btn"
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
    <Suspense fallback={<div className="search-suspense-loading">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
