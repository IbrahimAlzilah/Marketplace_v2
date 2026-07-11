"use client";

import React, { use, useState } from "react";
import { useApp } from "@/context/AppContext";
import { mockPharmacies, mockProducts } from "@/mock/data";
import ProductCard from "@/components/ProductCard";
import PharmacyHeader from "@/components/PharmacyHeader";
import { useRouter } from "next/navigation";

export default function PharmacyDetailPage({ params }) {
  const resolvedParams = use(params);
  const pharmacyId = resolvedParams.id;

  const { language } = useApp();
  const router = useRouter();

  const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
  const products = mockProducts.filter((p) => p.pharmacyId === pharmacyId);

  const [selectedCat, setSelectedCat] = useState("all");
  const [activeTab, setActiveTab] = useState("products");
  const [notified, setNotified] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  // Offline simulation state (Screen 13 specifications)
  // Whites (ph-3) defaults to closed/offline on initial view to demonstrate the state
  const [isStoreOffline, setIsStoreOffline] = useState(pharmacyId === "ph-3");

  if (!pharmacy) {
    return <div className="empty-state">Pharmacy Not Found</div>;
  }

  const name = language === "ar" ? pharmacy.name_ar : pharmacy.name_en;
  const eta = language === "ar" ? pharmacy.deliveryEta_ar : pharmacy.deliveryEta_en;

  const t = {
    back: language === "ar" ? "الصيدليات" : "Pharmacies",
    reviews: language === "ar" ? "تقييمات العملاء" : "Customer Reviews",
    catalog: language === "ar" ? "دليل المنتجات" : "Product Catalog",
    all: language === "ar" ? "الكل" : "All",
    medications: language === "ar" ? "الأدوية" : "Medicines",
    vitamins: language === "ar" ? "الفيتامينات" : "Vitamins",
    baby: language === "ar" ? "العناية بالطفل" : "Baby Care",
    beauty: language === "ar" ? "العناية بالبشرة" : "Skin Care",
    devices: language === "ar" ? "الأجهزة الطبية" : "Medical Devices",
    personal: language === "ar" ? "العناية الشخصية" : "Personal Care",
    fitness: language === "ar" ? "الرشاقة والرياضة" : "Fitness",
    herbal: language === "ar" ? "المنتجات العشبية" : "Herbal",
    sar: language === "ar" ? "ر.س" : "SAR",
    fee: language === "ar" ? "رسوم التوصيل:" : "Delivery Fee:",
    tabProducts: language === "ar" ? "المنتجات" : "Products",
    tabOffers: language === "ar" ? "العروض" : "Offers",
    tabReviews: language === "ar" ? "التقييمات" : "Reviews",
    tabBranches: language === "ar" ? "الفروع" : "Branches",
    noOffers: language === "ar" ? "لا توجد عروض نشطة حالياً" : "No active offers at the moment",
    noOffersDesc: language === "ar" ? "اشترك لتلقي تنبيهات عند توفر عروض جديدة لهذا المتجر." : "Subscribe to receive alerts when new deals are available for this store.",
    notifyMe: language === "ar" ? "تفعيل التنبيهات" : "Notify Me",
    subscribed: language === "ar" ? "تم تفعيل التنبيهات بنجاح!" : "Alerts enabled successfully!",
    viewOnMap: language === "ar" ? "عرض على الخريطة" : "View on Map",
    callBranch: language === "ar" ? "اتصال" : "Call",
    verifiedPurchase: language === "ar" ? "شراء مؤكد" : "Verified Purchase",
    helpful: language === "ar" ? "مفيد" : "Helpful",
    ratingSummary: language === "ar" ? "ملخص التقييم" : "Rating Summary",
    outOf5: language === "ar" ? "من ٥" : "out of 5",
    free: language === "ar" ? "مجاني" : "Free"
  };

  const categories = [
    { id: "all", label: t.all },
    { id: "medications", label: t.medications },
    { id: "vitamins", label: t.vitamins },
    { id: "baby", label: t.baby },
    { id: "beauty", label: t.beauty },
    { id: "devices", label: t.devices },
    { id: "personal", label: t.personal },
    { id: "fitness", label: t.fitness },
    { id: "herbal", label: t.herbal }
  ];

  const filteredProducts = selectedCat === "all"
    ? products
    : products.filter((p) => p.category === selectedCat);

  const offersList = mockProducts.filter((p) => p.pharmacyId === pharmacyId && p.originalPrice);

  const branches = [
    {
      id: "br-1",
      name_en: `${pharmacy.name_en} - Main Branch (Al-Yasmin)`,
      name_ar: `${pharmacy.name_ar} - الفرع الرئيسي (الياسمين)`,
      address_en: "Anas Ibn Malik Road, Al-Yasmin District",
      address_ar: "طريق أنس بن مالك، حي الياسمين",
      phone: "+966 11 234 5671",
      hours_en: "Open 24 Hours",
      hours_ar: "مفتوح ٢٤ ساعة",
      is24Hours: true
    },
    {
      id: "br-2",
      name_en: `${pharmacy.name_en} - Al-Olaya Branch`,
      name_ar: `${pharmacy.name_ar} - فرع العليا`,
      address_en: "King Fahd Road, Al-Olaya District",
      address_ar: "طريق الملك فهد، حي العليا",
      phone: "+966 11 234 5672",
      hours_en: "08:00 AM - 12:00 AM",
      hours_ar: "٠٨:٠٠ ص - ١٢:٠٠ م",
      is24Hours: false
    },
    {
      id: "br-3",
      name_en: `${pharmacy.name_en} - Al-Rawdah Branch`,
      name_ar: `${pharmacy.name_ar} - فرع الروضة`,
      address_en: "Khurais Road, Al-Rawdah District",
      address_ar: "طريق خريص، حي الروضة",
      phone: "+966 11 234 5673",
      hours_en: "08:00 AM - 02:00 AM",
      hours_ar: "٠٨:٠٠ ص - ٠٢:٠٠ ص",
      is24Hours: false
    }
  ];

  const mockReviewsList = [
    {
      id: 1,
      author: language === "ar" ? "عبد الرحمن السديري" : "Abdulrahman S.",
      rating: 5,
      date: "2026-06-22",
      comment_en: "Excellent service! The pharmacist called to double-check my prescription before delivery. Highly professional.",
      comment_ar: "خدمة ممتازة! اتصل الصيدلي للتحقق من الوصفة الطبية قبل التوصيل. احترافية عالية.",
      helpfulCount: 14
    },
    {
      id: 2,
      author: language === "ar" ? "سارة محمد" : "Sarah M.",
      rating: 4,
      date: "2026-06-18",
      comment_en: "Fast delivery within 20 mins. The packaging was cold-chain protected. Would recommend.",
      comment_ar: "توصيل سريع خلال ٢٠ دقيقة. كانت الشحنة مبردة بشكل جيد. أنصح بالتعامل معهم.",
      helpfulCount: 8
    },
    {
      id: 3,
      author: language === "ar" ? "ماجد العتيبي" : "Majed A.",
      rating: 5,
      date: "2026-06-15",
      comment_en: "Always fully stocked with chronic medicines. Great community pharmacy.",
      comment_ar: "دائماً متوفر لديهم أدوية الأمراض المزمنة. صيدلية مجتمعية رائعة.",
      helpfulCount: 5
    }
  ];

  const handleHelpfulClick = (id) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const tabs = [
    { id: "products", label: t.tabProducts },
    { id: "offers", label: t.tabOffers },
    { id: "reviews", label: `${t.tabReviews} (${pharmacy.reviewsCount})` },
    { id: "branches", label: t.tabBranches }
  ];

  // Brand-based styling storefront banners (Screen 13 covered imagery)
  const brandBanners = {
    "ph-1": "linear-gradient(135deg, #065f46 0%, #0f766e 100%)", // Al-Dawaa Green
    "ph-2": "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", // Nahdi Blue
    "ph-3": "linear-gradient(135deg, #be185d 0%, #111827 100%)", // Whites Pink/Grey
    "ph-4": "linear-gradient(135deg, #0369a1 0%, #075985 100%)", // Al-Safaa Teal
    "ph-5": "linear-gradient(135deg, #4338ca 0%, #3730a3 100%)"  // Community indigos
  };
  const activeBanner = brandBanners[pharmacyId] || "linear-gradient(135deg, #0f766e 0%, #115e59 100%)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <PharmacyHeader
        pharmacy={pharmacy}
        isOffline={isStoreOffline}
        showOfflineToggle={true}
        onOfflineToggle={setIsStoreOffline}
      />

      {/* Store Closed Warning Alert Banner (Screen 13 Offline alerts) */}
      {isStoreOffline && (
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1.5px solid var(--danger)",
            borderRadius: "12px",
            padding: "14px 18px",
            color: "var(--danger)",
            fontSize: "13px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "pulsePin 1s infinite alternate"
          }}
        >
          <span>🛑</span>
          <span>
            {language === "ar" 
              ? "تنبيه: الصيدلية مغلقة حالياً. تم تعطيل إضافة المنتجات للسلة مؤقتاً." 
              : "Alert: This pharmacy is currently closed/offline. Adding items to cart is temporarily disabled."}
          </span>
        </div>
      )}

      {/* Tab Navigation */}
      <div 
        style={{ 
          display: "flex", 
          gap: "20px", 
          borderBottom: "2px solid var(--border)", 
          marginBottom: "8px",
          paddingBottom: "0px",
          overflowX: "auto",
          scrollbarWidth: "none" // Firefox
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              paddingBlock: "12px",
              paddingInline: "4px",
              fontSize: "14px",
              fontWeight: "700",
              color: activeTab === tab.id ? "var(--primary)" : "var(--text-2)",
              border: "none",
              borderBottom: `3px solid ${activeTab === tab.id ? "var(--primary)" : "transparent"}`,
              backgroundColor: "transparent",
              cursor: "pointer",
              transition: "all 0.15s ease-in-out",
              marginBottom: "-2px",
              whiteSpace: "nowrap"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Product Categories row */}
          <div className="horizontal-scroll" style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: `1.5px solid ${selectedCat === cat.id ? "var(--primary)" : "var(--border)"}`,
                  backgroundColor: selectedCat === cat.id ? "var(--primary)" : "var(--surface)",
                  color: selectedCat === cat.id ? "var(--text-on-primary)" : "var(--text-2)",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px" }}>{t.catalog} ({filteredProducts.length})</h3>
            {filteredProducts.length > 0 ? (
              <div className="product-grid" style={{ marginBottom: "20px" }}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} disabled={isStoreOffline} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">💊</span>
                <span className="empty-title">{t.catalog} Empty</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OFFERS TAB */}
      {activeTab === "offers" && (
        <div>
          {offersList.length > 0 ? (
            <div className="product-grid" style={{ marginBottom: "20px" }}>
              {offersList.map((product) => (
                <ProductCard key={product.id} product={product} disabled={isStoreOffline} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 24px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", marginBlock: "10px" }}>
              <span style={{ fontSize: "48px", animation: "bounce 2s infinite" }}>🔔</span>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-1)" }}>{t.noOffers}</h3>
              <p style={{ fontSize: "12px", color: "var(--text-2)", maxWidth: "320px", lineHeight: "1.5" }}>{t.noOffersDesc}</p>
              {notified ? (
                <span style={{ fontSize: "12px", color: "var(--secondary)", fontWeight: "700", padding: "8px 16px", backgroundColor: "rgba(24, 182, 122, 0.05)", borderRadius: "20px" }}>
                  ✓ {t.subscribed}
                </span>
              ) : (
                <button 
                  onClick={() => setNotified(true)}
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "var(--primary)",
                    color: "var(--text-on-primary)",
                    border: "none",
                    borderRadius: "20px",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
                >
                  {t.notifyMe}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Reviews Breakdown Header */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "120px", borderInlineEnd: "1px solid var(--border)", paddingInlineEnd: "24px" }}>
              <span style={{ fontSize: "48px", fontWeight: "800", color: "var(--text-1)", lineHeight: 1 }}>{pharmacy.rating.toFixed(1)}</span>
              <span style={{ fontSize: "16px", color: "var(--warning)", marginTop: "8px" }}>★★★★★</span>
              <span style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "4px" }}>{pharmacy.reviewsCount} {t.reviews}</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>{t.ratingSummary}</h4>
              {[
                { stars: 5, pct: 82 },
                { stars: 4, pct: 12 },
                { stars: 3, pct: 4 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 1 }
              ].map((item) => (
                <div key={item.stars} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                  <span style={{ width: "16px", fontWeight: "600" }}>{item.stars}</span>
                  <span style={{ color: "var(--warning)" }}>★</span>
                  <div style={{ flex: 1, height: "6px", backgroundColor: "var(--bg)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${item.pct}%`, height: "100%", backgroundColor: "var(--warning)", borderRadius: "3px" }}></div>
                  </div>
                  <span style={{ width: "28px", color: "var(--text-2)", textAlign: language === "ar" ? "left" : "right" }}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Review Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {mockReviewsList.map((rev) => (
              <div key={rev.id} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "var(--primary)" }}>
                      {rev.author[0]}
                    </div>
                    <div>
                      <h5 style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: "var(--text-1)" }}>{rev.author}</h5>
                      <span style={{ fontSize: "10px", color: "var(--secondary)", fontWeight: "700" }}>✓ {t.verifiedPurchase}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ color: "var(--warning)", fontSize: "12px" }}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-2)" }}>{rev.date}</span>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-1)", lineHeight: "1.5", marginBlock: "4px" }}>
                  {language === "ar" ? rev.comment_ar : rev.comment_en}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                  <button 
                    disabled={isStoreOffline}
                    onClick={() => handleHelpfulClick(rev.id)}
                    style={{ 
                      background: "transparent", 
                      border: "none", 
                      fontSize: "11px", 
                      color: helpfulVotes[rev.id] ? "var(--primary)" : "var(--text-2)", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "4px",
                      fontWeight: helpfulVotes[rev.id] ? "700" : "500",
                      padding: "4px",
                      opacity: isStoreOffline ? 0.5 : 1
                    }}
                  >
                    👍 {t.helpful} ({rev.helpfulCount + (helpfulVotes[rev.id] ? 1 : 0)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BRANCHES TAB */}
      {activeTab === "branches" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          {branches.map((branch) => (
            <div key={branch.id} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0, color: "var(--text-1)" }}>
                  {language === "ar" ? branch.name_ar : branch.name_en}
                </h4>
                <span style={{ 
                  fontSize: "10px", 
                  padding: "2px 8px", 
                  borderRadius: "12px", 
                  fontWeight: "700",
                  backgroundColor: branch.is24Hours ? "rgba(24, 182, 122, 0.1)" : "rgba(15, 108, 189, 0.1)",
                  color: branch.is24Hours ? "var(--secondary)" : "var(--primary)",
                  whiteSpace: "nowrap"
                }}>
                  {language === "ar" ? branch.hours_ar : branch.hours_en}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--text-2)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>📍 {language === "ar" ? branch.address_ar : branch.address_en}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>📞 {branch.phone}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <button 
                  onClick={() => alert(language === "ar" ? "تم نسخ إحداثيات الفرع!" : "Branch coordinates copied!")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg)",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--border)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg)'}
                >
                  🗺️ {t.viewOnMap}
                </button>
                <a 
                  href={`tel:${branch.phone}`}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--primary)",
                    backgroundColor: "var(--primary)",
                    color: "var(--text-on-primary)",
                    fontSize: "11px",
                    fontWeight: "700",
                    textDecoration: "none",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
                >
                  📞 {t.callBranch}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
