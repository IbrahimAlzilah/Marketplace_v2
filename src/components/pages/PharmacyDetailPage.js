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
    <div className="pharmacy-detail-container">
      <PharmacyHeader
        pharmacy={pharmacy}
        isOffline={isStoreOffline}
        showOfflineToggle={true}
        onOfflineToggle={setIsStoreOffline}
      />

      {/* Store Closed Warning Alert Banner (Screen 13 Offline alerts) */}
      {isStoreOffline && (
        <div className="pharmacy-closed-alert">
          <span>🛑</span>
          <span>
            {language === "ar" 
              ? "تنبيه: الصيدلية مغلقة حالياً. تم تعطيل إضافة المنتجات للسلة مؤقتاً." 
              : "Alert: This pharmacy is currently closed/offline. Adding items to cart is temporarily disabled."}
          </span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="pharmacy-tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pharmacy-tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div className="pharmacy-detail-container">
          {/* Product Categories row */}
          <div className="horizontal-scroll pharmacy-cat-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`pharmacy-cat-btn ${selectedCat === cat.id ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div>
            <h3 className="pharmacy-section-title">{t.catalog} ({filteredProducts.length})</h3>
            {filteredProducts.length > 0 ? (
              <div className="product-grid product-grid-margin">
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
            <div className="product-grid product-grid-margin">
              {offersList.map((product) => (
                <ProductCard key={product.id} product={product} disabled={isStoreOffline} />
              ))}
            </div>
          ) : (
            <div className="pharmacy-empty-offers">
              <span className="pharmacy-bouncing-bell">🔔</span>
              <h3 className="pharmacy-tab-empty-title">{t.noOffers}</h3>
              <p className="pharmacy-tab-empty-desc">{t.noOffersDesc}</p>
              {notified ? (
                <span className="pharmacy-subscribed-badge">
                  ✓ {t.subscribed}
                </span>
              ) : (
                <button 
                  onClick={() => setNotified(true)}
                  className="pharmacy-notify-btn"
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
        <div className="pharmacy-detail-container">
          {/* Reviews Breakdown Header */}
          <div className="pharmacy-reviews-header">
            <div className="pharmacy-rating-summary-col">
              <span className="pharmacy-rating-score">{pharmacy.rating.toFixed(1)}</span>
              <span className="pharmacy-rating-stars">★★★★★</span>
              <span className="pharmacy-rating-count-label">{pharmacy.reviewsCount} {t.reviews}</span>
            </div>
            <div className="pharmacy-breakdown-col">
              <h4 className="pharmacy-breakdown-title">{t.ratingSummary}</h4>
              {[
                { stars: 5, pct: 82 },
                { stars: 4, pct: 12 },
                { stars: 3, pct: 4 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 1 }
              ].map((item) => (
                <div key={item.stars} className="pharmacy-breakdown-row">
                  <span className="pharmacy-breakdown-digit">{item.stars}</span>
                  <span className="star-yellow">★</span>
                  <div className="pharmacy-progress-track">
                    <div className="pharmacy-progress-fill" style={{ width: `${item.pct}%` }}></div>
                  </div>
                  <span className="pharmacy-progress-percent" style={{ textAlign: language === "ar" ? "left" : "right" }}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Review Feed */}
          <div className="pharmacy-reviews-list">
            {mockReviewsList.map((rev) => (
              <div key={rev.id} className="pharmacy-review-card">
                <div className="pharmacy-review-header-row">
                  <div className="pharmacy-review-author-group">
                    <div className="pharmacy-review-avatar">
                      {rev.author[0]}
                    </div>
                    <div>
                      <h5 className="pharmacy-review-author-name">{rev.author}</h5>
                      <span className="pharmacy-review-verified">✓ {t.verifiedPurchase}</span>
                    </div>
                  </div>
                  <div className="pharmacy-review-meta-col">
                    <span className="pharmacy-review-stars-text">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                    <span className="pharmacy-review-date">{rev.date}</span>
                  </div>
                </div>
                <p className="pharmacy-review-comment">
                  {language === "ar" ? rev.comment_ar : rev.comment_en}
                </p>
                <div className="pharmacy-review-helpful-row">
                  <button 
                    disabled={isStoreOffline}
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`pharmacy-review-helpful-btn ${helpfulVotes[rev.id] ? "active" : ""} ${isStoreOffline ? "disabled" : ""}`}
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
        <div className="pharmacy-branches-grid">
          {branches.map((branch) => (
            <div key={branch.id} className="pharmacy-branch-card">
              <div className="pharmacy-branch-header">
                <h4 className="pharmacy-branch-name">
                  {language === "ar" ? branch.name_ar : branch.name_en}
                </h4>
                <span className={`pharmacy-branch-hours ${branch.is24Hours ? "open-24" : ""}`}>
                  {language === "ar" ? branch.hours_ar : branch.hours_en}
                </span>
              </div>
              <div className="pharmacy-branch-details">
                <span className="pharmacy-branch-address">📍 {language === "ar" ? branch.address_ar : branch.address_en}</span>
                <span className="pharmacy-branch-phone">📞 {branch.phone}</span>
              </div>
              <div className="pharmacy-branch-actions">
                <button 
                  onClick={() => alert(language === "ar" ? "تم نسخ إحداثيات الفرع!" : "Branch coordinates copied!")}
                  className="pharmacy-branch-map-btn"
                >
                  🗺️ {t.viewOnMap}
                </button>
                <a 
                  href={`tel:${branch.phone}`}
                  className="pharmacy-branch-call-btn"
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
