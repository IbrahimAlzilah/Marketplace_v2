"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AuthModal from "./AuthModal";

export default function Header() {
  const { language, toggleLanguage, currentAddress, addresses, setCurrentAddress, cart, isLoggedIn, login, logout } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [showLocations, setShowLocations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Notification center states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text_en: "Order #YS-812 has been dispatched with Driver Ahmed Al-Harbi (ETA: 15 mins).",
      text_ar: "تم شحن الطلب #YS-812 مع السائق أحمد الحربي (الوقت المتوقع: ١٥ دقيقة).",
      time_en: "10 mins ago",
      time_ar: "قبل ١٠ دقائق",
      read: false,
      icon: "🚗"
    },
    {
      id: 2,
      text_en: "Your e-prescription from MOH Sehaty has been successfully verified for order preparation.",
      text_ar: "تم التحقق من وصفتك الطبية الرقمية من وزارة الصحة (صحتي) بنجاح لبدء تجهيز الطلب.",
      time_en: "1 hour ago",
      time_ar: "قبل ساعة",
      read: false,
      icon: "✅"
    },
    {
      id: 3,
      text_en: "Congratulations! You earned 120 Loyalty points from your last order #YS-701.",
      text_ar: "تهانينا! لقد حصلت على ١٢٠ نقطة ولاء من طلبك الأخير #YS-701.",
      time_en: "Yesterday",
      time_ar: "أمس",
      read: true,
      icon: "👑"
    },
    {
      id: 4,
      text_en: "Temperature Control Check: Your insulin prescription will be delivered in certified cold-chain cooling bags.",
      text_ar: "فحص الحفاظ على البرودة: سيتم توصيل الأنسولين الخاص بك في حقيبة تبريد معتمدة لضمان سلامته.",
      time_en: "2 days ago",
      time_ar: "قبل يومين",
      read: true,
      icon: "❄️"
    }
  ]);

  const megaMenuData = {
    medications: {
      title_en: "Medicines",
      title_ar: "الأدوية والوصفات",
      items_en: ["Pain Relief", "Cold & Flu", "Chronic Diseases", "First Aid"],
      items_ar: ["مسكنات الألم", "البرد والأنفلونزا", "الأمراض المزمنة", "الإسعافات الأولية"]
    },
    vitamins: {
      title_en: "Vitamins",
      title_ar: "الفيتامينات والمكملات",
      items_en: ["Multivitamins", "Minerals", "Immunity Boosters", "Fish Oil"],
      items_ar: ["الفيتامينات المتعددة", "المعادن", "مقويات المناعة", "زيت السمك"]
    },
    baby: {
      title_en: "Baby Care",
      title_ar: "العناية بالأم والطفل",
      items_en: ["Baby Milk", "Diapers", "Baby Skincare", "Feeding Accessories"],
      items_ar: ["حليب الأطفال", "الحفاضات", "العناية ببشرة الطفل", "أدوات التغذية"]
    },
    beauty: {
      title_en: "Skin Care",
      title_ar: "العناية بالبشرة",
      items_en: ["Skincare", "Suncare", "Moisturizers", "Serums"],
      items_ar: ["العناية بالبشرة", "واقيات الشمس", "المرطبات", "السيروم"]
    },
    devices: {
      title_en: "Medical Devices",
      title_ar: "الأجهزة الطبية",
      items_en: ["Blood Pressure", "Thermometers", "Glucose Monitors", "Nebulizers"],
      items_ar: ["أجهزة الضغط", "موازين الحرارة", "أجهزة السكر", "أجهزة البخار"]
    },
    personal: {
      title_en: "Personal Care",
      title_ar: "العناية الشخصية",
      items_en: ["Body Wash", "Deodorants", "Oral Care", "Hair Care"],
      items_ar: ["غسول الجسم", "مزيلات العرق", "العناية بالفم", "العناية بالشعر"]
    },
    fitness: {
      title_en: "Fitness & Nutrition",
      title_ar: "الرشاقة والرياضة",
      items_en: ["Protein Powder", "Energy Bars", "Shakers", "Fat Burners"],
      items_ar: ["بودرة البروتين", "ألواح الطاقة", "شيكرات", "حوارق الدهون"]
    },
    herbal: {
      title_en: "Herbal Remedies",
      title_ar: "المنتجات العشبية",
      items_en: ["Herbal Tea", "Natural Oils", "Honey", "Organic Herbs"],
      items_ar: ["الشاي العشبي", "الزيوت الطبيعية", "العسل", "الأعشاب العضوية"]
    }
  };

  const t = {
    deliverTo: language === "ar" ? "التوصيل إلى:" : "Deliver to:",
    selectAddress: language === "ar" ? "اختر عنوان التوصيل" : "Select Delivery Address",
    notifications: language === "ar" ? "الإشعارات" : "Notifications",
    placeholder: language === "ar" ? "ابحث عن الأدوية، الصيدليات..." : "Search medicines, pharmacies...",
    logo: "YUSUR",
    home: language === "ar" ? "الرئيسية" : "Home",
    pharmacies: language === "ar" ? "الصيدليات" : "Pharmacies",
    orders: language === "ar" ? "طلباتي" : "Orders",
    cart: language === "ar" ? "السلة" : "Cart",
    profile: language === "ar" ? "حسابي" : "Account",
    medications: language === "ar" ? "الأدوية" : "Medicines",
    vitamins: language === "ar" ? "الفيتامينات" : "Vitamins",
    baby: language === "ar" ? "العناية بالطفل" : "Baby Care",
    beauty: language === "ar" ? "العناية بالبشرة" : "Skin Care",
    devices: language === "ar" ? "الأجهزة الطبية" : "Medical Devices",
    personal: language === "ar" ? "العناية الشخصية" : "Personal Care",
    fitness: language === "ar" ? "الرشاقة والرياضة" : "Fitness",
    herbal: language === "ar" ? "المنتجات العشبية" : "Herbal"
  };

  const totalCartItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const showMobileHeader = pathname === "/home" || pathname === "/pharmacies";

  return (
    <>
      {/* 1. DESKTOP HEADER NAVBAR */}
      <nav className="desktop-navbar">
        <div className="desktop-navbar-inner">
          {/* Logo brand */}
          <Link href="/home" className="nav-brand">
            <span>🟢</span>
            <strong>{t.logo}</strong>
          </Link>

          {/* Location selector */}
          <div className="header-location header-location-wrapper" onClick={() => setShowLocations(true)}>
            <span>📍</span>
            <div>
              <span className="header-location-subtitle">
                {t.deliverTo}
              </span>
              <span className="header-location-title">
                {currentAddress ? (
                  <>
                    {language === "ar" ? currentAddress.tag_ar : currentAddress.tag}:{" "}
                    {language === "ar" ? currentAddress.street_ar : currentAddress.street}
                  </>
                ) : (
                  language === "ar" ? "حدد موقع التوصيل" : "Select Location"
                )}
              </span>
            </div>
            <span className="header-location-arrow">▼</span>
          </div>

          {/* Persistent Search Bar */}
          <form className="nav-search-wrapper" onSubmit={handleSearchSubmit}>
            <span className="nav-search-icon">🔍</span>
            <input
              type="text"
              className="nav-search-bar"
              placeholder={t.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Actions & Links Menu */}
          <div className="nav-menu">
            {/* Language toggle */}
            <button className="lang-toggle" onClick={toggleLanguage}>
              {language === "en" ? "العربية" : "English"}
            </button>

            {/* Orders link */}
            <Link href="/orders" className={`nav-link-item ${pathname === "/orders" ? "nav-link-item-active" : ""}`}>
              <span>📦</span>
              <span>{t.orders}</span>
            </Link>

            {/* Notifications */}
            <div className="header-bell-wrapper">
              <button 
                className="btn-icon header-bell-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
                type="button"
              >
                <span>🔔</span>
                {notifications.some(n => !n.read) && <span className="badge-dot header-bell-badge"></span>}
              </button>
              {showNotifications && (
                <div 
                  className="dropdown-menu-panel header-notification-dropdown"
                >
                  <div className="header-notif-dropdown-header">
                    <strong className="header-notif-dropdown-title">
                      {language === "ar" ? "الإشعارات" : "Notifications"} ({notifications.filter(n => !n.read).length})
                    </strong>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                      className="header-notif-clear-btn"
                      type="button"
                    >
                      {language === "ar" ? "تحديد الكل كمقروء" : "Mark all as read"}
                    </button>
                  </div>
                  <div className="header-notif-list">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="header-notif-item"
                        style={{
                          backgroundColor: n.read ? "transparent" : "rgba(15, 108, 189, 0.04)",
                          border: n.read ? "1px solid transparent" : "1px solid rgba(15, 108, 189, 0.1)"
                        }}
                      >
                        <span className="header-notif-icon">{n.icon}</span>
                        <div className="header-notif-info">
                          <span className="header-notif-text" style={{ fontWeight: n.read ? "500" : "700" }}>
                            {language === "ar" ? n.text_ar : n.text_en}
                          </span>
                          <span className="header-notif-time">
                            {language === "ar" ? n.time_ar : n.time_en}
                          </span>
                        </div>
                        {!n.read && (
                          <span className="header-notif-unread-dot" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart link with count badge */}
            <Link href="/cart" className="nav-link-item header-cart-link">
              <span>🛒</span>
              <span>{t.cart}</span>
              {totalCartItems > 0 && (
                <span className="nav-cart-badge">{totalCartItems}</span>
              )}
            </Link>

            {/* Profile or Login Link */}
            {isLoggedIn ? (
              <Link href="/profile" className="nav-link-item header-profile-link">
                <span>👤</span>
                <span>{t.profile}</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="nav-link-item header-login-btn"
              >
                <span>👤</span>
                <span>{language === "ar" ? "تسجيل الدخول" : "Login"}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* DESKTOP CATEGORIES RIBBON */}
      <div className="categories-ribbon">
        <div className="categories-ribbon-inner categories-ribbon-inner-relative">
          <div
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
            className="categories-trigger-wrapper"
          >
            <button
              className="categories-link categories-trigger-btn"
            >
              ☰ {language === "ar" ? "كل الفئات" : "All Categories"} ▾
            </button>

            {showMegaMenu && (
              <div className="mega-menu-panel">
                {Object.keys(megaMenuData).map((key) => {
                  const cat = megaMenuData[key];
                  return (
                    <div key={key} className="mega-menu-col">
                      <h4 className="mega-menu-col-title">
                        {language === "ar" ? cat.title_ar : cat.title_en}
                      </h4>
                      <div className="mega-menu-items">
                        {(language === "ar" ? cat.items_ar : cat.items_en).map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={`/search?cat=${key}&sub=${encodeURIComponent(subItem)}`}
                            className="mega-menu-item-link"
                            onClick={() => setShowMegaMenu(false)}
                          >
                            {subItem}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/home" className={`categories-link ${pathname === "/home" ? "active" : ""}`}>
            🏠 {t.home}
          </Link>
          <Link href="/pharmacies" className={`categories-link ${pathname === "/pharmacies" ? "active" : ""}`}>
            🏥 {t.pharmacies}
          </Link>
          <Link href="/search?cat=medications" className="categories-link">
            💊 {t.medications}
          </Link>
          <Link href="/search?cat=vitamins" className="categories-link">
            🧴 {t.vitamins}
          </Link>
          <Link href="/search?cat=baby" className="categories-link">
            👶 {t.baby}
          </Link>
          <Link href="/search?cat=beauty" className="categories-link">
            ✨ {t.beauty}
          </Link>
          <Link href="/search?cat=devices" className="categories-link">
            🩺 {t.devices}
          </Link>
          {/* <Link href="/search?cat=personal" className="categories-link">
            🧼 {t.personal}
          </Link>
          <Link href="/search?cat=fitness" className="categories-link">
            💪 {t.fitness}
          </Link>
          <Link href="/search?cat=herbal" className="categories-link">
            🌿 {t.herbal}
          </Link> */}
          <button
            onClick={() => router.push("/profile?action=support")}
            className="categories-link pharmacist-consult-link"
          >
            {language === "ar" ? "استشارة صيدلي" : "Consult Pharmacist"}
          </button>
        </div>
      </div>

      {/* 2. MOBILE HEADER (Only shown on mobile screen & on Home/Pharmacies pages) */}
      {showMobileHeader && (
        <header className="mobile-only mobile-header-container">
          <div className="header-top">
            <div className="header-location" onClick={() => setShowLocations(true)}>
              <span>📍</span>
              <div>
                <span className="header-location-subtitle">
                  {t.deliverTo}
                </span>
                <span>
                  {currentAddress ? (
                    <>
                      {language === "ar" ? currentAddress.tag_ar : currentAddress.tag}:{" "}
                      {language === "ar" ? currentAddress.street_ar : currentAddress.street}
                    </>
                  ) : (
                    language === "ar" ? "حدد موقع التوصيل" : "Select Location"
                  )}
                </span>
              </div>
              <span>▼</span>
            </div>

            <div className="header-actions">
              <button className="lang-toggle" onClick={toggleLanguage}>
                {language === "en" ? "العربية" : "English"}
              </button>
              <div className="header-bell-wrapper">
                <button 
                  className="btn-icon header-bell-btn" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  type="button"
                >
                  <span>🔔</span>
                  {notifications.some(n => !n.read) && <span className="badge-dot header-bell-badge"></span>}
                </button>
                {showNotifications && (
                  <div 
                    className="dropdown-menu-panel mobile-header-notification-dropdown"
                  >
                    <div className="mobile-header-notif-dropdown-header">
                      <strong className="mobile-header-notif-dropdown-title">
                        {language === "ar" ? "الإشعارات" : "Notifications"} ({notifications.filter(n => !n.read).length})
                      </strong>
                      <button 
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        }}
                        className="header-notif-clear-btn"
                        type="button"
                      >
                        {language === "ar" ? "تحديد الكل" : "Mark all"}
                      </button>
                    </div>
                    <div className="mobile-header-notif-list">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className="mobile-header-notif-item"
                          style={{
                            backgroundColor: n.read ? "transparent" : "rgba(15, 108, 189, 0.04)",
                            border: n.read ? "1px solid transparent" : "1px solid rgba(15, 108, 189, 0.1)"
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>{n.icon}</span>
                          <div className="mobile-header-notif-info">
                            <span className="header-notif-text" style={{ fontWeight: n.read ? "500" : "700" }}>
                              {language === "ar" ? n.text_ar : n.text_en}
                            </span>
                            <span className="header-notif-time">
                              {language === "ar" ? n.time_ar : n.time_en}
                            </span>
                          </div>
                          {!n.read && (
                            <span className="mobile-header-notif-unread-dot" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="search-container">
            <div className="search-input-wrapper" onClick={() => router.push("/search")}>
              <span className="search-icon-inside">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder={t.placeholder}
                readOnly
              />
            </div>
          </div>
        </header>
      )}

      {/* Address selection modal */}
      {showLocations && (
        <div className="modal-overlay" onClick={() => setShowLocations(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-header">
              <h3 className="location-modal-title">{t.selectAddress}</h3>
              <button className="btn-icon" onClick={() => setShowLocations(false)}>✕</button>
            </div>
            <div className="location-modal-list">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setCurrentAddress(addr);
                    setShowLocations(false);
                  }}
                  className="location-modal-item"
                  style={{
                    border: `1.5px solid ${currentAddress && currentAddress.id === addr.id ? "var(--primary)" : "var(--border)"}`,
                    backgroundColor: currentAddress && currentAddress.id === addr.id ? "rgba(15, 108, 189, 0.05)" : "var(--surface)"
                  }}
                >
                  <strong className="location-modal-item-tag">
                    {language === "ar" ? addr.tag_ar : addr.tag}
                  </strong>
                  <span className="location-modal-item-address">
                    {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Login modal */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
