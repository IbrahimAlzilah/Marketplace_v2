"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { mockProducts, mockPharmacies } from "@/mock/data";
import ProductCard from "@/components/ProductCard";
import PharmacyCard from "@/components/PharmacyCard";
import { WalletLoyaltyUnifiedCard } from "@/components/DashboardCards";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { language, toggleLanguage, recentlyViewed } = useApp();
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  
  // Group 2 Screen 7 skeleton loading state
  const [loading, setLoading] = useState(true);

  // Group 2 Screen 7 Promo Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  const promoSlides = [
    {
      title_en: "Mother & Baby Week",
      title_ar: "عروض الأم والطفل",
      desc_en: "Save up to 20% on formulas and care items",
      desc_ar: "خصم يصل إلى ٢٠٪ على جميع الحليب والمستلزمات",
      code_en: "CODE: BABY20",
      code_ar: "رمز: BABY20",
      graphic: "🍼",
      bgColor: "linear-gradient(135deg, #0284c7, #0369a1)"
    },
    {
      title_en: "Free Delivery Milestone",
      title_ar: "شحن مجاني بالكامل",
      desc_en: "Get free delivery from any pharmacy on orders above 100 SAR!",
      desc_ar: "احصل على توصيل مجاني من أي صيدلية للطلبات أكثر من ١٠٠ ريال!",
      code_en: "No Code Needed",
      code_ar: "بدون رمز ترويجي",
      graphic: "⚡",
      bgColor: "linear-gradient(135deg, #10b981, #047857)"
    },
    {
      title_en: "Chronic Medicines Support",
      title_ar: "رعاية الأمراض المزمنة",
      desc_en: "Fast insulated cold-chain deliveries for essential prescriptions.",
      desc_ar: "توصيل سريع ومبرد للأدوية الحساسة والوصفات الطبية الهامة.",
      code_en: "CODE: YUSURCARE",
      code_ar: "رمز: YUSURCARE",
      graphic: "❄️",
      bgColor: "linear-gradient(135deg, #6366f1, #4f46e5)"
    }
  ];

  // Auto scroll logic for Promo Slider
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  // Network connection checks (Screen 1 Offline Dialog support)
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (typeof window !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Simulator loading and onboarding check
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplash", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
        setLoading(false);
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }, 2500); // 2.5s duration
      return () => clearTimeout(timer);
    } else {
      // Shimmer loading simulation for returning users
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1200);

      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
      return () => clearTimeout(timer);
    }
  }, []);

  const onboardingSlides = [
    {
      icon: "🏥",
      title_en: "Discover Nearby Pharmacies",
      title_ar: "اكتشف الصيدليات القريبة",
      desc_en: "Browse healthcare products and compare delivery speeds and shipping fees across close branch locations.",
      desc_ar: "تصفح المنتجات الصحية وقارن سرعة التوصيل ورسوم الشحن بين الصيدليات المختلفة."
    },
    {
      icon: "❄️",
      title_en: "Cold-Chain Integrity",
      title_ar: "ضمان سلسلة التبريد مبردة",
      desc_en: "Temperature-sensitive medications like insulin are packed in certified cooling boxes directly to your doorstep.",
      desc_ar: "يتم شحن الأدوية الحساسة للحرارة مثل الأنسولين في عبوات تبريد مخصصة لضمان سلامتها وفاعليتها."
    },
    {
      icon: "💎",
      title_en: "Earn Points & Top Up Wallet",
      title_ar: "نقاط المكافآت والمحفظة الرقمية",
      desc_en: "Top up your digital wallet for instant payments and earn loyalty points on every purchase to redeem as cash discounts.",
      desc_ar: "اشحن محفظتك الرقمية وادفع بلمسة واحدة، واجمع نقاط الولاء مع كل طلب واستبدلها بخصومات مالية فورية."
    }
  ];

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingSlides.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      handleOnboardingFinish();
    }
  };

  const handleOnboardingFinish = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const t = {
    categories: language === "ar" ? "الفئات" : "Categories",
    nearby: language === "ar" ? "الصيدليات القريبة" : "Nearby Pharmacies",
    offers: language === "ar" ? "العروض والتخفيضات" : "Offers & Deals",
    recommended: language === "ar" ? "منتجات موصى بها" : "Recommended for You",
    viewAll: language === "ar" ? "عرض الكل" : "View All",
    recentlyViewed: language === "ar" ? "تصفحتها مؤخراً" : "Recently Viewed",
    offlineWarning: language === "ar" ? "أنت تتصفح حالياً في وضع عدم الاتصال بالشبكة. يرجى إعادة الاتصال لإتمام عمليات الشراء." : "You are browsing offline mode. Sync to purchase.",
    loadingText: language === "ar" ? "جاري تحميل لوحة التحكم..." : "Loading Dashboard..."
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

  const offerProducts = mockProducts.filter((p) => p.originalPrice);
  const recommendedProducts = mockProducts.filter((p) => !p.originalPrice);

  const recentlyViewedProducts = (recentlyViewed || [])
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="home-container">
      
      {/* Dynamic Keyframe Shimmer Animations and Slide transitions */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); filter: drop-shadow(0 0 4px rgba(255,255,255,0.4)); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 16px rgba(255,255,255,0.8)); }
        }
        @keyframes crossBackgroundShift {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .onboarding-slide-content {
          animation: ${language === "ar" ? "slideInFromLeft 0.35s ease" : "slideInFromRight 0.35s ease"};
        }
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
        .bullet-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.2s;
        }
        .bullet-dot-active {
          background-color: white;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>

      {/* Screen 7 Offline banner replacement card */}
      {isOffline && (
        <div className="home-offline-banner">
          <span>📡</span>
          <span>{t.offlineWarning}</span>
        </div>
      )}

      {loading ? (
        /* Screen 7: Shimmer Skeletons representing Dashboard components */
        <div className="home-container">
          {/* Banner Shimmer */}
          <div className="shimmer-box shimmer-box h140"></div>

          {/* Balance/Points Card Shimmer */}
          <div className="shimmer-box shimmer-box h90"></div>

          {/* Categories Grid Shimmer */}
          <div>
            <div className="shimmer-row-header">
              <div className="shimmer-box shimmer-box h20-w100"></div>
              <div className="shimmer-box shimmer-box h16-w60"></div>
            </div>
            <div className="shimmer-grid-4-cols">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="shimmer-grid-4-cols-item">
                  <div className="shimmer-box shimmer-box h50-circle"></div>
                  <div className="shimmer-box shimmer-box h12-w40"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Stores Shimmer */}
          <div>
            <div className="shimmer-row-header">
              <div className="shimmer-box shimmer-box h20-w140"></div>
              <div className="shimmer-box shimmer-box h16-w60"></div>
            </div>
            <div className="shimmer-flex-2-cards">
              <div className="shimmer-box shimmer-box h120-flex1"></div>
              <div className="shimmer-box shimmer-box h120-flex1"></div>
            </div>
          </div>

          {/* Recommended Shimmer */}
          <div>
            <div className="shimmer-box shimmer-box h20-w160"></div>
            <div className="shimmer-grid-2-cols">
              <div className="shimmer-box shimmer-box h200"></div>
              <div className="shimmer-box shimmer-box h200"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Actual Dashboard Contents */
        <>
          {/* Campaign Offer Banner - Active Sliding Carousel (Screen 7 Specs) */}
          <div 
            className="offer-banner promo-hero-container"
            style={{ 
              background: promoSlides[currentSlide].bgColor
            }}
          >
            <div className="offer-content offer-content-animated" key={currentSlide}>
              <span className="offer-title">
                {language === "ar" ? promoSlides[currentSlide].title_ar : promoSlides[currentSlide].title_en}
              </span>
              <span className="offer-desc">
                {language === "ar" ? promoSlides[currentSlide].desc_ar : promoSlides[currentSlide].desc_en}
              </span>
              <span className="offer-promo-code">
                {language === "ar" ? promoSlides[currentSlide].code_ar : promoSlides[currentSlide].code_en}
              </span>
            </div>
            <div className="offer-graphic">{promoSlides[currentSlide].graphic}</div>

            {/* Slider progress bullets / indicator dots */}
            <div className="carousel-bullets-container">
              {promoSlides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`bullet-dot ${currentSlide === idx ? "bullet-dot-active" : ""}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>

          {/* Health & Benefits Dashboard (Wallet & Loyalty Highlights) */}
          <div className="benefits-dashboard">
            <WalletLoyaltyUnifiedCard
              onPointsHistoryClick={() => router.push("/profile?action=loyalty")}
              onTransactionDetailsClick={() => router.push("/profile?action=wallet")}
              onViewAllClick={() => router.push("/profile?action=wallet")}
            />
          </div>

          {/* Categories Grid */}
          <div>
            <div className="carousel-header">
              <h3 className="carousel-title">{t.categories}</h3>
              <Link href="/categories" className="carousel-link">
                {t.viewAll}
              </Link>
            </div>
            <div className="category-grid">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => router.push(`/search?cat=${cat.id}`)}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <span className="category-title">
                    {language === "ar" ? cat.title_ar : cat.title_en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Pharmacies Section */}
          <div>
            <div className="carousel-header">
              <h3 className="carousel-title">{t.nearby}</h3>
              <Link href="/pharmacies" className="carousel-link">
                {t.viewAll}
              </Link>
            </div>

            {/* Mobile view: Carousel */}
            <div className="mobile-only">
              <div className="product-grid horizontal-scroll">
                {mockPharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="pharmacy-card-scroll-item">
                    <PharmacyCard pharmacy={pharmacy} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop view: Grid */}
            <div className="desktop-only">
              <div className="responsive-grid-3">
                {mockPharmacies.slice(0, 4).map((pharmacy) => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                ))}
              </div>
            </div>
          </div>

          {/* Offers & Deals Product Carousel / Grid */}
          <div>
            <div className="carousel-header">
              <h3 className="carousel-title">{t.offers}</h3>
              <Link href="/search?filter=offers" className="carousel-link">
                {t.viewAll}
              </Link>
            </div>

            {/* Mobile view: Carousel */}
            <div className="mobile-only">
              <div className="product-grid horizontal-scroll">
                {offerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Desktop view: Grid */}
            <div className="desktop-only">
              <div className="product-grid">
                {offerProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Products Grid */}
          <div>
            <div className="carousel-header">
              <h3 className="carousel-title">{t.recommended}</h3>
            </div>
            <div className="product-grid">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Recently Viewed Carousel */}
          {recentlyViewedProducts.length > 0 && (
            <div className="home-section-header-wrapper">
              <div className="carousel-header">
                <h3 className="carousel-title">{t.recentlyViewed}</h3>
              </div>
              <div className="product-grid horizontal-scroll">
                {recentlyViewedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 1. Splash Screen Overlay with Versioning, Custom Animation & Pattern (Screen 1) */}
      {showSplash && (
        <div className="splash-overlay">
          <div className="splash-logo">🟢</div>
          <h1 className="splash-title">YUSUR</h1>
          <p className="splash-subtitle">
            {language === "ar" ? "منصتك الصحية الموثوقة" : "Your Trusted Healthcare Marketplace"}
          </p>
          <div className="spinner"></div>

          {/* Footer KSA version label */}
          <div className="splash-footer">
            Version 1.0.0 (KSA)
          </div>

          {/* Screen 1 States: Offline Retry Modal */}
          {isOffline && (
            <div className="offline-retry-overlay">
              <div className="offline-retry-sheet">
                <span className="offline-icon">⚠️</span>
                <strong className="offline-title">
                  {language === "ar" ? "لا يوجد اتصال بالشبكة" : "No Internet Connection"}
                </strong>
                <p className="offline-desc">
                  {language === "ar" 
                    ? "يرجى التحقق من اتصال البيانات أو الواي فاي وإعادة المحاولة للمتابعة." 
                    : "Please check your mobile data or Wi-Fi settings and try again."}
                </p>
                
                <div className="offline-actions-container">
                  <button className="btn-primary" type="button" onClick={() => {
                    if (navigator.onLine) {
                      setIsOffline(false);
                    } else {
                      alert(language === "ar" ? "لا يزال الاتصال مقطوعاً" : "Connection still offline");
                    }
                  }}>
                    🔄 {language === "ar" ? "إعادة المحاولة" : "Retry Connection"}
                  </button>
                  <button className="btn-secondary offline-dismiss-btn" type="button" onClick={() => setIsOffline(false)}>
                    🔍 {language === "ar" ? "استمر في وضع التجربة" : "Continue in Demo Mode"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Onboarding Carousel Overlay with Language switcher and Sliding transitions (Screen 2) */}
      {showOnboarding && !showSplash && (
        <div className="onboarding-overlay">
          <div className="onboarding-card">
            
            {/* Top-End Language Switcher Toggle */}
            <div className="onboarding-skip-row">
              <button
                type="button"
                className="btn-secondary onboarding-skip-btn"
                onClick={toggleLanguage}
              >
                🌐 {language === "en" ? "العربية" : "English"}
              </button>
            </div>

            {/* Sliding animation key context container */}
            <div key={onboardingStep} className="onboarding-slide-content onboarding-slide-wrapper">
              <div className="onboarding-icon">
                {onboardingSlides[onboardingStep].icon}
              </div>

              <h2 className="onboarding-title">
                {language === "ar"
                  ? onboardingSlides[onboardingStep].title_ar
                  : onboardingSlides[onboardingStep].title_en}
              </h2>

              <p className="onboarding-desc">
                {language === "ar"
                  ? onboardingSlides[onboardingStep].desc_ar
                  : onboardingSlides[onboardingStep].desc_en}
              </p>
            </div>

            <div className="onboarding-dots">
              {onboardingSlides.map((_, idx) => (
                <div
                  key={idx}
                  className={`onboarding-dot ${onboardingStep === idx ? "onboarding-dot-active" : ""}`}
                />
              ))}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn-secondary onboarding-back-btn"
                onClick={handleOnboardingFinish}
              >
                {language === "ar" ? "تخطي" : "Skip"}
              </button>

              <button
                type="button"
                className="btn-primary onboarding-next-btn"
                onClick={handleOnboardingNext}
              >
                {onboardingStep === onboardingSlides.length - 1
                  ? (language === "ar" ? "ابدأ التسوق" : "Get Started")
                  : (language === "ar" ? "التالي" : "Next")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
