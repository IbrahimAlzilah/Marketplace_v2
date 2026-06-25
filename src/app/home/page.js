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
  const { language, recentlyViewed } = useApp();
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplash", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }, 1900);
      return () => clearTimeout(timer);
    } else {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
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
    promoTitle: language === "ar" ? "عروض الأم والطفل" : "Mother & Baby Week",
    promoDesc: language === "ar" ? "خصم يصل إلى ٢٠٪ على جميع الحليب والمستلزمات" : "Save up to 20% on formulas and care items",
    promoCode: language === "ar" ? "رمز: BABY20" : "CODE: BABY20",
    recentlyViewed: language === "ar" ? "تصفحتها مؤخراً" : "Recently Viewed"
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

  // Filter products for carousels
  const offerProducts = mockProducts.filter((p) => p.originalPrice);
  const recommendedProducts = mockProducts.filter((p) => !p.originalPrice);

  // Recently viewed products
  const recentlyViewedProducts = (recentlyViewed || [])
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Campaign Offer Banner (Hero) */}
      <div className="offer-banner">
        <div className="offer-content">
          <span className="offer-title">{t.promoTitle}</span>
          <span className="offer-desc">{t.promoDesc}</span>
          <span className="offer-promo-code">{t.promoCode}</span>
        </div>
        <div className="offer-graphic">🍼</div>
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
          <Link href="/search" className="carousel-link">
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
          <div className="product-grid horizontal-scroll" style={{ paddingBottom: "4px" }}>
            {mockPharmacies.map((pharmacy) => (
              <div key={pharmacy.id} style={{ width: "280px", flexShrink: 0 }}>
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
        <div style={{ marginBottom: "20px" }}>
          <div className="carousel-header">
            <h3 className="carousel-title">{t.recentlyViewed}</h3>
          </div>
          <div className="product-grid horizontal-scroll" style={{ paddingBottom: "4px" }}>
            {recentlyViewedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 1. Splash Screen Overlay */}
      {showSplash && (
        <div className="splash-overlay">
          <div className="splash-logo">🟢</div>
          <h1 className="splash-title">YUSUR</h1>
          <p className="splash-subtitle">
            {language === "ar" ? "منصتك الصحية الموثوقة" : "Your Trusted Healthcare Marketplace"}
          </p>
          <div className="spinner"></div>
        </div>
      )}

      {/* 2. Onboarding Carousel Overlay */}
      {showOnboarding && !showSplash && (
        <div className="onboarding-overlay">
          <div className="onboarding-card">
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
                className="btn-secondary"
                onClick={handleOnboardingFinish}
                style={{ flex: 1, paddingBlock: "10px" }}
              >
                {language === "ar" ? "تخطي" : "Skip"}
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleOnboardingNext}
                style={{ flex: 2, paddingBlock: "10px" }}
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
