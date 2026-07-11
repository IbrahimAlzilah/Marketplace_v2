"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { WalletLoyaltyUnifiedCard } from "@/components/DashboardCards";
import OrderCard from "@/components/OrderCard";
import { useSearchParams, useRouter } from "next/navigation";
import { mockProducts } from "@/mock/data";
import Link from "next/link";

function ProfileContent() {
  const {
    language,
    toggleLanguage,
    currentAddress,
    addresses,
    wishlist,
    orders,
    walletBalance,
    walletTransactions,
    loyaltyPoints,
    loyaltyHistory,
    topUpWallet,
    redeemLoyaltyPoints,
    addAddress,
    toggleWishlist,
    addToCart
  } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Panels: menu (mobile main menu), profile, addresses, wishlist, support, wallet & loyalty points, orders, payment, privacy
  const [activePanel, setActivePanel] = useState("profile");
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [walletLoyaltyTab, setWalletLoyaltyTab] = useState("transactions"); // transactions, points

  // Toast notification state
  const [toastMessage, setToastMessage] = useState("");

  // Profile editable states
  const [profileName, setProfileName] = useState("Ibrahim Al-Fahad");
  const [profileEmail, setProfileEmail] = useState("ibrahim@yusur.com");
  const [profilePhone, setProfilePhone] = useState("0501234567");

  // Address book states
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrTag, setAddrTag] = useState("Home");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrBuilding, setAddrBuilding] = useState("");
  const [addrType, setAddrType] = useState("Villa"); // Villa or Apartment
  const [addrNotes, setAddrNotes] = useState("");
  const [addrNationalCode, setAddrNationalCode] = useState("");
  const [isGPSSearching, setIsGPSSearching] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);

  // Wallet top up states
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpSource, setTopUpSource] = useState("mada");

  // Loyalty points redemption states
  const [pointsRedeemInput, setPointsRedeemInput] = useState("");

  // Payment methods states
  const [paymentCards, setPaymentCards] = useState([
    { id: "c-1", brand: "Mada", number: "**** **** **** 4321", expiry: "09/28", holder: "Ibrahim Al-Fahad", isDefault: true },
    { id: "c-2", brand: "Visa", number: "**** **** **** 9811", expiry: "12/29", holder: "Ibrahim Al-Fahad", isDefault: false }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Read URL search params for incoming links (like fab consultation)
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "support") {
      setActivePanel("support");
    } else if (action === "wallet") {
      setActivePanel("wallet");
      setWalletLoyaltyTab("transactions");
    } else if (action === "loyalty") {
      setActivePanel("wallet");
      setWalletLoyaltyTab("points");
    }
  }, [searchParams]);

  // Adjust default panel based on screen size (on desktop, default is 'profile' dashboard panel)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && activePanel === "profile") {
        setActivePanel("menu");
      } else if (window.innerWidth >= 1024 && activePanel === "menu") {
        setActivePanel("profile");
      }
    };
    handleResize(); // run initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activePanel]);

  const t = {
    profile: language === "ar" ? "ملفي الشخصي" : "My Account",
    phone: language === "ar" ? "رقم الجوال:" : "Phone:",
    email: language === "ar" ? "البريد الإلكتروني:" : "Email:",
    savedAddresses: language === "ar" ? "العناوين المحفوظة" : "Saved Addresses",
    wishlistLabel: language === "ar" ? "قائمة المفضلة" : "My Wishlist",
    walletLabel: language === "ar" ? "المحفظة ونقاط الولاء" : "Wallet & Loyalty Points",
    supportLabel: language === "ar" ? "الدعم الفني والمساعدة" : "Help & Support",
    langLabel: language === "ar" ? "تغيير اللغة" : "Change Language",
    logout: language === "ar" ? "تسجيل الخروج" : "Log Out",
    back: language === "ar" ? "رجوع" : "Back",
    supportTitle: language === "ar" ? "مركز المساعدة والدعم" : "Help Center & Support",
    faqTitle: language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions",
    faq1: language === "ar" ? "كيف يمكنني رفع الوصفة الطبية؟" : "How do I upload a prescription?",
    faq1Ans: language === "ar" ? "عند إضافة دواء خاضع للوصفة (Rx) إلى السلة، سيطلب منك النظام تلقائياً التقاط صورة للوصفة أو إدخال رقم الوصفة الموحد." : "When you add an Rx item, the app automatically prompts you to take a photo or input a Unified Rx ID.",
    faq2: language === "ar" ? "ما هي شروط الحفاظ على الأنسولين؟" : "What are the rules for insulin shipping?",
    faq2Ans: language === "ar" ? "نحن نضمن توصيل جميع الأدوية المبردة تحت درجة حرارة متحكم بها (٢-٨ درجات مئوية) باستخدام حاويات مبردة خاصة." : "We guarantee all cold-chain medications are shipped under temperature controlled conditions (2-8°C).",
    contactUs: language === "ar" ? "اتصل بنا" : "Contact Us",
    phoneSupport: language === "ar" ? "رقم الدعم الموحد: ٩٢٠٠١٢٣٤٥" : "Toll-Free Support: 920012345",
    pharmacistLine: language === "ar" ? "الخط الساخن للصيدلي: ٨٠٠١١٢٢٣٣" : "Pharmacist Helpline: 800112233",
    ordersLabel: language === "ar" ? "طلباتي" : "My Orders",
    profileTitle: language === "ar" ? "تعديل الملف الشخصي" : "Profile Settings",
    trackTitle: language === "ar" ? "تتبع الشحنة" : "Order Tracking",
    driver: language === "ar" ? "السائق:" : "Driver:",
    call: language === "ar" ? "اتصال" : "Call",
    support: language === "ar" ? "مساعدة طبية" : "Ask Pharmacist",
    timelinePlaced: language === "ar" ? "تم استلام الطلب" : "Order Placed",
    timelinePreparing: language === "ar" ? "جاري تحضير الأدوية" : "Preparing Medications",
    timelineDelivering: language === "ar" ? "مع السائق للتوصيل" : "Out for Delivery",
    timelineArrived: language === "ar" ? "تم التوصيل بنجاح" : "Delivered Successfully",
    
    // New Bilingual Translation Keys
    paymentLabel: language === "ar" ? "بطاقات الدفع المحفوظة" : "Saved Payment Methods",
    privacyLabel: language === "ar" ? "سياسة الخصوصية واللوائح" : "Privacy Policy & Regulations",
    addAddressBtn: language === "ar" ? "إضافة عنوان جديد" : "Add New Address",
    mapPinTitle: language === "ar" ? "حدد موقعك على الخريطة" : "Select Location on Map",
    gpsLookup: language === "ar" ? "جاري تحديد إحداثيات GPS..." : "Locating GPS coordinates...",
    gpsDone: language === "ar" ? "تم تحديد الموقع بدقة!" : "Location locked successfully!",
    streetNameLabel: language === "ar" ? "اسم الشارع والحي" : "Street Name & District",
    buildingNumberLabel: language === "ar" ? "رقم المبنى" : "Building Number",
    villaLabel: language === "ar" ? "فيلا / منزل" : "Villa / House",
    apartmentLabel: language === "ar" ? "شقة / مكتب" : "Apartment / Office",
    addNotesLabel: language === "ar" ? "ملاحظات إضافية للتوصيل" : "Additional Delivery Notes",
    nationalAddressLabel: language === "ar" ? "العنوان الوطني (رمز قصير)" : "National Address (Short Code)",
    saveAddressBtn: language === "ar" ? "حفظ العنوان" : "Save Address",
    cancelBtn: language === "ar" ? "إلغاء" : "Cancel",
    tagHome: language === "ar" ? "المنزل" : "Home",
    tagWork: language === "ar" ? "العمل" : "Work",
    tagOther: language === "ar" ? "أخرى" : "Other",
    topUpTitle: language === "ar" ? "شحن رصيد المحفظة" : "Top Up Wallet Balance",
    topUpAmountLabel: language === "ar" ? "أدخل مبلغ الشحن (ر.س)" : "Enter Top Up Amount (SAR)",
    madaPay: language === "ar" ? "مدى" : "Mada",
    stcPay: language === "ar" ? "STC Pay" : "STC Pay",
    topUpBtn: language === "ar" ? "اشحن الآن" : "Top Up Now",
    topUpSuccess: language === "ar" ? "تم شحن المحفظة بنجاح بمبلغ {amount} ر.س!" : "Wallet topped up successfully with {amount} SAR!",
    redeemTitle: language === "ar" ? "استبدال نقاط المكافآت" : "Redeem Loyalty Points",
    redeemAmountLabel: language === "ar" ? "عدد النقاط المراد استبدالها" : "Points to Redeem",
    pointsEquivalent: language === "ar" ? "القيمة المعادلة: {amount} ر.س" : "Equivalent value: {amount} SAR",
    redeemBtn: language === "ar" ? "استبدال النقاط الآن" : "Redeem Points Now",
    redeemSuccess: language === "ar" ? "تم تحويل {points} نقطة بنجاح إلى {cash} ر.س كاش باك في محفظتك!" : "Successfully converted {points} points to {cash} SAR cashback in your wallet!",
    goldMemberBadge: language === "ar" ? "عضوية ذهبية 🏆" : "Gold Member 🏆",
    pointsBalanceLabel: language === "ar" ? "رصيد نقاطك الحالي: {points} نقطة" : "Current Points Balance: {points} pts",
    cardholderLabel: language === "ar" ? "اسم حامل البطاقة" : "Cardholder Name",
    cardNumberLabel: language === "ar" ? "رقم البطاقة" : "Card Number",
    expiryLabel: language === "ar" ? "تاريخ الانتهاء" : "Expiry Date",
    cvvLabel: language === "ar" ? "رمز التحقق (CVV)" : "CVV",
    addCardBtn: language === "ar" ? "إضافة بطاقة جديدة" : "Add New Card",
    saveCardBtn: language === "ar" ? "حفظ البطاقة" : "Save Card",
    cardSuccess: language === "ar" ? "تم حفظ بطاقة الدفع بنجاح!" : "Payment card saved successfully!",
    defaultCard: language === "ar" ? "الافتراضية" : "Default",
    wishlistEmpty: language === "ar" ? "قائمة المفضلة فارغة" : "Your Wishlist is Empty",
    wishlistEmptyDesc: language === "ar" ? "تصفح الأدوية والمنتجات وأضفها للمفضلة للوصول إليها لاحقاً." : "Browse medicines and products, and add them to your wishlist to access them later.",
    addedToCartToast: language === "ar" ? "تم إضافة {name} إلى السلة!" : "Added {name} to Cart!",
    profileSavedToast: language === "ar" ? "تم حفظ إعدادات الملف الشخصي بنجاح!" : "Profile settings saved successfully!",
    privacyHeading: language === "ar" ? "اللوائح العامة وسياسات يسر الصحية" : "General Regulations & YUSUR Health Policies",
    moirTitle: language === "ar" ? "١. لوائح وزارة الصحة والهيئة العامة للغذاء والدواء (SFDA)" : "1. Ministry of Health & SFDA Compliance",
    moirText: language === "ar" ? "تخضع جميع الأدوية الطبية (Rx) للتحقق والتدقيق من قبل صيادلة مرخصين. لا يتم تسليم أي دواء خاضع للوصفة بدون التحقق من صحة الوصفة الطبية المرفوعة وتطابقها مع الهوية الوطنية للمريض." : "All Prescription-Only Medicines (POM/Rx) undergo clinical review by licensed pharmacists. No Rx order will be shipped without verification against a valid digital or paper prescription registered under the user's National Health ID.",
    coldChainTitle: language === "ar" ? "٢. ضمان سلامة الشحنات المبردة (سلسلة التبريد)" : "2. Cold-Chain Delivery Guarantee (2°C - 8°C)",
    coldChainText: language === "ar" ? "نلتزم بمعايير صارمة لنقل الأنسولين والأدوية الحساسة للحرارة في حاويات مبردة مخصصة ومراقبة حرارياً لضمان الفعالية التامة للمستحضرات عند وصولها." : "We enforce strict temperature-controlled storage and delivery (2°C - 8°C) for insulins and other temperature-sensitive biopharmaceuticals via specialized refrigeration courier packs.",
    walletSecurityTitle: language === "ar" ? "٣. شروط رصيد المحفظة وعمليات الاسترجاع" : "3. Wallet Balances & Instant Refund Terms",
    walletSecurityText: language === "ar" ? "رصيد المحفظة الناتج عن المرتجعات صالح للاستخدام الدائم وغير قابل للانتهاء. الأرصدة الترويجية قد تخضع لتواريخ انتهاء محددة حسب شروط الحملة." : "Wallet credits originating from cancelled orders or item refunds never expire. Promotional balances may have dynamic expiration dates depending on campaign terms."
  };

  const sidebarMenuItems = [
    { id: "profile", label: t.profileTitle, icon: "👤" },
    { id: "orders", label: t.ordersLabel, icon: "📦" },
    { id: "wallet", label: t.walletLabel, icon: "💳" },
    { id: "addresses", label: t.savedAddresses, icon: "📍" },
    { id: "wishlist", label: `${t.wishlistLabel} (${wishlist.length})`, icon: "❤️" },
    { id: "payment", label: t.paymentLabel, icon: "💳" },
    { id: "settings", label: language === "ar" ? "الإعدادات" : "Settings", icon: "⚙️" },
    { id: "support", label: t.supportLabel, icon: "❓" },
    { id: "privacy", label: t.privacyLabel, icon: "📜" }
  ];

  const handleMobileMenuClick = (item) => {
    if (item.id === "orders") {
      router.push("/orders");
    } else {
      setActivePanel(item.id);
    }
  };

  const handleOpenTracker = (order) => {
    setTrackingOrder(order);
  };

  const wishlistProducts = mockProducts.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <div className="profile-page-wrapper">

      {/* Page Title (Mobile only, on desktop sidebar title serves this) */}
      <div className="mobile-only profile-mobile-header">
        {activePanel !== "menu" && (
          <button
            onClick={() => setActivePanel("menu")}
            className="profile-back-btn"
          >
            ← {t.back}
          </button>
        )}
        <h1 className="profile-mobile-title">
          {activePanel === "menu" ? t.profile : activePanel === "wishlist" ? t.wishlistLabel : activePanel === "addresses" ? t.savedAddresses : activePanel === "support" ? t.supportTitle : activePanel === "profile" ? t.profileTitle : activePanel === "payment" ? t.paymentLabel : activePanel === "privacy" ? t.privacyLabel : t.profile}
        </h1>
      </div>

      <div className="profile-container">

        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className={`profile-sidebar ${activePanel === "menu" ? "" : "desktop-only"}`}>
          {/* User profile briefing summary header */}
          <div className="profile-sidebar-header">
            <div className="profile-sidebar-avatar">
              👤
            </div>
            <div>
              <h4 className="profile-sidebar-name">{profileName}</h4>
              <span className="profile-sidebar-email">{profileEmail}</span>
            </div>
          </div>

          {/* Navigation link items */}
          <div className="profile-sidebar-menu-list">
            {sidebarMenuItems.map((item) => {
              const isActive = activePanel === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      handleMobileMenuClick(item);
                    } else {
                      setActivePanel(item.id);
                    }
                  }}
                  className={`profile-sidebar-item ${isActive ? "profile-sidebar-item-active" : ""}`}
                >
                  <span className="profile-sidebar-item-icon">{item.icon}</span>
                  <span className="profile-sidebar-item-label">{item.label}</span>
                  <span className="mobile-only profile-sidebar-item-arrow">{language === "ar" ? "←" : "→"}</span>
                </div>
              );
            })}
          </div>

          {/* Quick options panel bottom of sidebar */}
          <div className="profile-sidebar-footer">
            <button className="btn-secondary profile-footer-btn" onClick={toggleLanguage}>
              🌐 {t.langLabel}: {language === "en" ? "العربية" : "English"}
            </button>
            <button className="btn-secondary profile-footer-logout-btn" onClick={() => alert("Logging out...")}>
              🚪 {t.logout}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Panel Details */}
        <div className={`layout-main-col ${activePanel === "menu" ? "desktop-only" : ""}`}>

          {/* A. PROFILE / SETTINGS PANEL */}
          {activePanel === "profile" && (
            <>
              <div className="profile-loyalty-wrap">
                <WalletLoyaltyUnifiedCard
                  onPointsHistoryClick={() => {
                    setActivePanel("wallet");
                    setWalletLoyaltyTab("points");
                  }}
                  onTransactionDetailsClick={() => {
                    setActivePanel("wallet");
                    setWalletLoyaltyTab("transactions");
                  }}
                  onViewAllClick={() => {
                    setActivePanel("wallet");
                    setWalletLoyaltyTab("transactions");
                  }}
                />
              </div>
              <div className="profile-panel-card">
                <h2 className="profile-panel-title">
                  {t.profileTitle}
                </h2>

                <div className="form-group">
                  <label className="form-label">{language === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                  <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                </div>

                <div className="profile-grid-1col">
                  <div className="form-group">
                    <label className="form-label">{t.email}</label>
                    <input type="email" className="form-input" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.phone}</label>
                    <input type="text" className="form-input" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button className="btn-primary profile-action-btn-w-auto" onClick={() => {
                    setToastMessage(t.profileSavedToast);
                    setTimeout(() => setToastMessage(""), 3000);
                  }}>
                    {language === "ar" ? "حفظ التغييرات" : "Save Settings"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* B. ADDRESSES PANEL */}
          {activePanel === "addresses" && (
            <div className="profile-panel-container-gap16">
              <div className="profile-panel-card-gap16">
                <div className="profile-panel-header-row">
                  <h2 className="profile-panel-title-no-border">
                    {t.savedAddresses}
                  </h2>
                  {!isAddingAddress && (
                    <button
                      className="btn-primary profile-btn-sm-w-auto"
                      onClick={() => {
                        setIsAddingAddress(true);
                        setGpsLocked(false);
                        setAddrStreet("");
                        setAddrBuilding("");
                        setAddrNationalCode("");
                        setAddrNotes("");
                      }}
                    >
                      ➕ {t.addAddressBtn}
                    </button>
                  )}
                </div>

                {!isAddingAddress ? (
                  <div className="profile-addresses-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="profile-address-card">
                        <div className="profile-address-title-row">
                          <strong className="profile-address-tag">{language === "ar" ? addr.tag_ar : addr.tag}</strong>
                          {addr.isDefault && (
                            <span className="profile-address-default-badge">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="profile-address-detail-text">
                          {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Screen 23 Map Selector Form */
                  <div className="profile-add-address-form">
                    <h3 className="profile-form-subtitle">{t.mapPinTitle}</h3>
                    
                    <div className="profile-map-selector" onClick={() => {
                      if (!gpsLocked && !isGPSSearching) {
                        setIsGPSSearching(true);
                        setTimeout(() => {
                          setIsGPSSearching(false);
                          setGpsLocked(true);
                          setAddrStreet("King Fahd Road, Al-Aqeeq, Riyadh (Dropped Pin)");
                          setAddrBuilding("3984");
                          setAddrNationalCode("RHQS8842");
                        }, 1200);
                      }
                    }}>
                      {isGPSSearching ? (
                        <div className="profile-gps-lookup-row">
                          <div className="profile-gps-spinner"></div>
                          <span className="profile-gps-lookup-text">{t.gpsLookup}</span>
                        </div>
                      ) : gpsLocked ? (
                        <div className="profile-center-text">
                          <span className="profile-gps-badge-icon">📍</span>
                          <span className="profile-gps-success-text">{t.gpsDone}</span>
                        </div>
                      ) : (
                        <div className="profile-gps-idle-wrap">
                          <span className="profile-gps-idle-icon">🗺️</span>
                          <span className="profile-gps-idle-text">
                            {language === "ar" ? "انقر على الخريطة لإسقاط الدبوس وتحديد موقعك تلقائياً" : "Click Map to Drop Pin and Fetch Coordinates Automatically"}
                          </span>
                        </div>
                      )}
                      <div className="profile-gps-coordinates-badge">
                        GPS Coordinates: 24.774265, 46.626482
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.streetNameLabel}</label>
                      <input type="text" className="form-input" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} placeholder="e.g. Al-Malqa, Riyadh" required />
                    </div>
                    
                    <div className="profile-grid-2cols-gap12">
                      <div className="form-group">
                        <label className="form-label">{t.buildingNumberLabel}</label>
                        <input type="text" className="form-input" value={addrBuilding} onChange={(e) => setAddrBuilding(e.target.value)} placeholder="e.g. 4812" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{language === "ar" ? "نوع السكن" : "Housing Type"}</label>
                        <div className="profile-btn-row-gap8">
                          <button type="button" className={`btn-secondary ${addrType === "Villa" ? "tab-btn-active" : ""} profile-form-tab-btn`} onClick={() => setAddrType("Villa")}>
                            🏠 {t.villaLabel}
                          </button>
                          <button type="button" className={`btn-secondary ${addrType === "Apartment" ? "tab-btn-active" : ""} profile-form-tab-btn`} onClick={() => setAddrType("Apartment")}>
                            🏢 {t.apartmentLabel}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.nationalAddressLabel}</label>
                      <input type="text" className="form-input" value={addrNationalCode} onChange={(e) => setAddrNationalCode(e.target.value)} placeholder="e.g. HRDA8274" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.addNotesLabel}</label>
                      <textarea className="form-input profile-textarea-input" value={addrNotes} onChange={(e) => setAddrNotes(e.target.value)} placeholder="e.g. Near pharmacy, red door" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{language === "ar" ? "تصنيف العنوان" : "Address Tag"}</label>
                      <div className="profile-btn-row-gap8">
                        {["Home", "Work", "Other"].map((tag) => (
                          <button key={tag} type="button" className={`btn-secondary ${addrTag === tag ? "tab-btn-active" : ""} profile-form-tab-btn`} onClick={() => setAddrTag(tag)}>
                            {tag === "Home" ? `🏠 ${t.tagHome}` : tag === "Work" ? `💼 ${t.tagWork}` : `📍 ${t.tagOther}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="profile-address-form-actions">
                      <button type="button" className="btn-secondary flex-1" onClick={() => setIsAddingAddress(false)}>
                        {t.cancelBtn}
                      </button>
                      <button type="button" className="btn-primary flex-1" onClick={() => {
                        if (!addrStreet || !addrBuilding) {
                           alert(language === "ar" ? "يرجى تعبئة الحقول المطلوبة" : "Please fill in the required fields");
                           return;
                        }
                        addAddress({
                          tag: addrTag,
                          tag_ar: addrTag === "Home" ? "المنزل" : addrTag === "Work" ? "العمل" : "أخرى",
                          street: `${addrStreet}, Building ${addrBuilding}`,
                          street_ar: `${language === "ar" ? addrStreet : addrStreet}، مبنى ${addrBuilding}`,
                          city: "Riyadh",
                          city_ar: "الرياض"
                        });
                        setIsAddingAddress(false);
                        setToastMessage(language === "ar" ? "تم إضافة العنوان بنجاح!" : "Address saved successfully!");
                        setTimeout(() => setToastMessage(""), 3000);
                      }}>
                        {t.saveAddressBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* C. WISHLIST PANEL */}
          {activePanel === "wishlist" && (
            <div className="profile-panel-card">
              <h2 className="profile-panel-title-margin20">
                {t.wishlistLabel}
              </h2>

              {wishlistProducts.length > 0 ? (
                <div className="profile-grid-1col">
                  {wishlistProducts.map((product) => {
                    const prodName = language === "ar" ? product.name_ar : product.name_en;
                    return (
                      <div key={product.id} className="profile-wishlist-card">
                        <div className="profile-wishlist-img-box">
                          {product.image}
                        </div>
                        <div className="flex-grow">
                          <h4 className="profile-wishlist-item-title">{prodName}</h4>
                          <span className="profile-wishlist-item-pharmacy">
                            {language === "ar" ? product.pharmacyName_ar : product.pharmacyName_en}
                          </span>
                          <strong className="profile-wishlist-item-price">
                            {product.price.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                          </strong>
                        </div>
                        <div className="profile-wishlist-actions">
                          <button className="btn-primary profile-btn-sm-w-auto" onClick={() => {
                            addToCart(product, 1);
                            setToastMessage(t.addedToCartToast.replace("{name}", prodName));
                            setTimeout(() => setToastMessage(""), 3000);
                          }}>
                            🛒 {language === "ar" ? "أضف للسلة" : "Add to Cart"}
                          </button>
                          <button className="profile-wishlist-remove-btn" onClick={() => {
                            toggleWishlist(product.id);
                          }}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state profile-wishlist-empty-wrap">
                  <span className="empty-icon">❤️</span>
                  <strong className="empty-title">{t.wishlistEmpty}</strong>
                  <p className="empty-desc">{t.wishlistEmptyDesc}</p>
                </div>
              )}
            </div>
          )}

          {/* D. HELP & SUPPORT PANEL */}
          {activePanel === "support" && (
            <div className="profile-panel-container-gap16">
              <div className="profile-panel-card-gap16">
                <h2 className="profile-panel-title">
                  {t.supportTitle}
                </h2>

                {/* FAQ sections */}
                <div>
                  <h3 className="profile-support-section-title">
                    {t.faqTitle}
                  </h3>
                  <div className="profile-support-faq-list">
                    <div className="profile-faq-item-card">
                      <strong className="profile-faq-question">{t.faq1}</strong>
                      <p className="profile-faq-answer">{t.faq1Ans}</p>
                    </div>
                    <div className="profile-faq-item-card">
                      <strong className="profile-faq-question">{t.faq2}</strong>
                      <p className="profile-faq-answer">{t.faq2Ans}</p>
                    </div>
                  </div>
                </div>

                {/* Helpline info */}
                <div className="profile-support-contact-card">
                  <h4 className="profile-support-contact-title">📞 {t.contactUs}</h4>
                  <div className="profile-support-contact-details">
                    <span>🟢 {t.phoneSupport}</span>
                    <span>🟢 {t.pharmacistLine}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* E. EMBEDDED WALLET & LOYALTY PANEL */}
          {activePanel === "wallet" && (
            <div className="profile-panel-container-gap20">
              <WalletLoyaltyUnifiedCard
                onPointsHistoryClick={() => setWalletLoyaltyTab("points")}
                onTransactionDetailsClick={() => setWalletLoyaltyTab("transactions")}
                onViewAllClick={() => setWalletLoyaltyTab("transactions")}
              />

              <div className="profile-panel-card">
                {/* Custom Tabs inside panel */}
                <div className="tab-container profile-wallet-tabs">
                  <button
                    type="button"
                    className={`tab-btn ${walletLoyaltyTab === "transactions" ? "tab-btn-active" : ""}`}
                    onClick={() => setWalletLoyaltyTab("transactions")}
                  >
                    💳 {language === "ar" ? "تفاصيل المحفظة والعمليات" : "Wallet Balance & Ledger"}
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${walletLoyaltyTab === "points" ? "tab-btn-active" : ""}`}
                    onClick={() => setWalletLoyaltyTab("points")}
                  >
                    👑 {language === "ar" ? "سجل نقاط الولاء والمكافآت" : "Loyalty Points & Rewards"}
                  </button>
                </div>

                {/* Sub-Panel 1: Wallet Balance Details and Transaction History */}
                {walletLoyaltyTab === "transactions" && (
                  <div className="profile-panel-container-gap20">
                    <div className="profile-refund-banner">
                      <strong className="profile-refund-title">⚡ {language === "ar" ? "تنبيه المرتجعات السريعة" : "Instant Refund Guarantee"}</strong>
                      <span style={{ lineHeight: "1.5" }}>
                        {language === "ar" ? "أي إلغاء أو إرجاع للطلب يتم قيده فوراً في محفظتك الإلكترونية لاستخدامه في مشترياتك القادمة." : "Any canceled orders or items are instantly credited to your wallet to prevent long bank wait times."}
                      </span>
                    </div>

                    <div className="profile-add-address-form">
                      <h3 className="profile-wallet-section-title">📜 {language === "ar" ? "سجل العمليات" : "Transaction History"}</h3>
                      {walletTransactions.length > 0 ? (
                        <div className="profile-sidebar-footer">
                          {walletTransactions.map((tx) => {
                            const title = language === "ar" ? tx.title_ar : tx.title_en;
                            const isPositive = tx.amount > 0;
                            return (
                              <div
                                key={tx.id}
                                className="profile-tx-card"
                              >
                                <div>
                                  <span className="profile-tx-title">{title}</span>
                                  <span className="profile-tx-date">{tx.date}</span>
                                </div>
                                <strong className="profile-tx-amount" style={{ color: isPositive ? "var(--success)" : "var(--text-1)" }}>
                                  {isPositive ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                                </strong>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <span className="empty-icon">📜</span>
                          <span className="empty-title">{language === "ar" ? "لا توجد عمليات" : "No transaction history"}</span>
                        </div>
                      )}
                    </div>

                    {/* Top Up Wallet Section (Screen 24 Specification) */}
                    <div className="profile-wallet-topup-section">
                      <h3 className="profile-wallet-section-title">💳 {t.topUpTitle}</h3>
                      
                      <div className="form-group">
                        <label className="form-label">{t.topUpAmountLabel}</label>
                        <div className="search-price-inputs-row">
                          <input
                            type="number"
                            className="form-input"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="100.00"
                            style={{ flex: 1 }}
                          />
                          <strong className="profile-currency-label">{language === "ar" ? "ر.س" : "SAR"}</strong>
                        </div>
                      </div>

                      <div className="profile-btn-row-gap8">
                        {["50", "100", "200", "500"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className="btn-secondary profile-preset-btn"
                            onClick={() => setTopUpAmount(preset)}
                          >
                            +{preset}
                          </button>
                        ))}
                      </div>

                      <div className="form-group">
                        <label className="form-label">{language === "ar" ? "طريقة الدفع للشحن" : "Top Up Payment Method"}</label>
                        <div className="profile-grid-2cols-gap12">
                          <button
                            type="button"
                            className={`btn-secondary ${topUpSource === "mada" ? "tab-btn-active" : ""} profile-payment-source-btn`}
                            onClick={() => setTopUpSource("mada")}
                          >
                            💳 {t.madaPay}
                          </button>
                          <button
                            type="button"
                            className={`btn-secondary ${topUpSource === "stcpay" ? "tab-btn-active" : ""} profile-payment-source-btn`}
                            onClick={() => setTopUpSource("stcpay")}
                          >
                            📱 {t.stcPay}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          const amt = parseFloat(topUpAmount);
                          if (isNaN(amt) || amt <= 0) {
                            alert(language === "ar" ? "يرجى إدخال مبلغ صالح للشحن" : "Please enter a valid amount to top up");
                            return;
                          }
                          topUpWallet(amt);
                          setTopUpAmount("");
                          setToastMessage(t.topUpSuccess.replace("{amount}", amt.toFixed(2)));
                          setTimeout(() => setToastMessage(""), 3000);
                        }}
                      >
                        ⚡ {t.topUpBtn}
                      </button>
                    </div>

                  </div>
                )}

                {/* Sub-Panel 2: Loyalty Progression and Point Ledger */}
                {walletLoyaltyTab === "points" && (
                  <div className="profile-panel-container-gap20">
                    {/* Progression bar */}
                    <div className="profile-address-card">
                      <div className="profile-loyalty-tier-row">
                        <span>🏆 {t.goldMemberBadge}</span>
                        <span style={{ color: "var(--primary)" }}>{language === "ar" ? "باقي ٢٥٠ نقطة للبلاتيني" : "250 pts to Platinum Tier"}</span>
                      </div>
                      <div className="loyalty-progress-container">
                        <div className="profile-loyalty-progress-desc">
                          <span>{loyaltyPoints} / 1500 {language === "ar" ? "نقطة" : "pts"}</span>
                        </div>
                        <div className="loyalty-progress-bar">
                          <div className="loyalty-progress-fill" style={{ width: `${Math.min((loyaltyPoints / 1500) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* How to Earn/Redeem rules */}
                    <div className="profile-loyalty-rules-card">
                      <div>
                        <strong className="profile-rule-title-primary">
                          ⭐ {language === "ar" ? "قواعد كسب النقاط" : "How to Earn Points"}
                        </strong>
                        <p className="profile-rule-desc">
                          {language === "ar" ? "اكسب ١ نقطة مقابل كل ١٠ ر.س تنفقها في شراء الأدوية والمستلزمات." : "Earn 1 point for every 10 SAR spent on checkout orders."}
                        </p>
                      </div>
                      <div className="profile-rule-divider-top">
                        <strong className="profile-rule-title-secondary">
                          🎁 {language === "ar" ? "قواعد استبدال النقاط" : "How to Redeem Points"}
                        </strong>
                        <p className="profile-rule-desc">
                          {language === "ar" ? "كل ٥٠ نقطة تساوي ١ ر.س خصم فوري. يمكنك استخدامها خلال الدفع." : "Every 50 points = 1 SAR instant discount applied at checkout."}
                        </p>
                      </div>
                    </div>

                    {/* Point History */}
                    <div className="profile-add-address-form">
                      <h3 className="profile-wallet-section-title">📜 {language === "ar" ? "سجل النقاط" : "Points History"}</h3>
                      {loyaltyHistory.length > 0 ? (
                        <div className="profile-sidebar-footer">
                          {loyaltyHistory.map((hist) => {
                            const label = language === "ar" ? hist.action_ar : hist.action_en;
                            const isPositive = hist.points > 0;
                            return (
                              <div
                                key={hist.id}
                                className="profile-tx-card"
                              >
                                <div>
                                  <span className="profile-tx-title">{label}</span>
                                  <span className="profile-tx-date">{hist.date}</span>
                                </div>
                                <strong className="profile-tx-amount" style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}>
                                  {isPositive ? `+${hist.points}` : hist.points} {language === "ar" ? "نقطة" : "pts"}
                                </strong>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <span className="empty-icon">📜</span>
                          <span className="empty-title">{language === "ar" ? "لا يوجد سجل للنقاط" : "No points history found"}</span>
                        </div>
                      )}
                    </div>

                    {/* Loyalty Points Redemption Widget (Screen 24 Specification) */}
                    <div className="profile-wallet-topup-section">
                      <h3 className="profile-wallet-section-title">🎁 {t.redeemTitle}</h3>
                      
                      <div className="profile-redemption-balance-box">
                        <span>{t.pointsBalanceLabel.replace("{points}", loyaltyPoints)}</span>
                        <strong style={{ color: "var(--secondary)" }}>
                          {t.pointsEquivalent.replace("{amount}", (loyaltyPoints / 50).toFixed(2))}
                        </strong>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t.redeemAmountLabel}</label>
                        <div className="search-price-inputs-row">
                          <input
                            type="number"
                            className="form-input"
                            value={pointsRedeemInput}
                            onChange={(e) => setPointsRedeemInput(e.target.value)}
                            placeholder="50"
                            style={{ flex: 1 }}
                          />
                          <span className="profile-address-detail-text">{language === "ar" ? "نقطة" : "pts"}</span>
                        </div>
                      </div>

                      {pointsRedeemInput && (
                        <span className="profile-redemption-notice">
                          {language === "ar" 
                            ? `ستحصل على: ${(parseFloat(pointsRedeemInput) / 50 || 0).toFixed(2)} ر.س كاش باك` 
                            : `You will get: ${(parseFloat(pointsRedeemInput) / 50 || 0).toFixed(2)} SAR cashback`}
                        </span>
                      )}

                      <button
                        type="button"
                        className="btn-secondary profile-redeem-submit-btn"
                        onClick={() => {
                          const pts = parseInt(pointsRedeemInput);
                          if (isNaN(pts) || pts <= 0) {
                            alert(language === "ar" ? "يرجى إدخال عدد نقاط صالح" : "Please enter a valid points amount");
                            return;
                          }
                          if (pts > loyaltyPoints) {
                            alert(language === "ar" ? "نقاطك غير كافية للاستبدال" : "Insufficient points balance");
                            return;
                          }
                          const cashback = redeemLoyaltyPoints(pts);
                          setPointsRedeemInput("");
                          setToastMessage(t.redeemSuccess.replace("{points}", pts).replace("{cash}", cashback.toFixed(2)));
                          setTimeout(() => setToastMessage(""), 3000);
                        }}
                      >
                        👑 {t.redeemBtn}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

          {/* F. EMBEDDED ORDERS PANEL (Desktop-Only Tab) */}
          {activePanel === "orders" && (
            <div className="profile-panel-container-gap16">
              <div className="profile-panel-card-gap16">
                <h2 className="profile-panel-title">
                  {t.ordersLabel}
                </h2>

                <div className="profile-panel-container-gap16">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <OrderCard key={order.id} order={order} onTrackClick={handleOpenTracker} />
                    ))
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📦</span>
                      <strong className="empty-title">{language === "ar" ? "لا توجد طلبات" : "No orders found"}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* G. SAVED PAYMENT METHODS PANEL */}
          {activePanel === "payment" && (
            <div className="profile-panel-container-gap16">
              <div className="profile-panel-card-gap16">
                <h2 className="profile-panel-title-margin20">
                  {t.paymentLabel}
                </h2>

                {!isAddingCard ? (
                  <div className="profile-addresses-list">
                    {paymentCards.map((card) => (
                      <div key={card.id} className="profile-payment-card-item">
                        <div className="profile-sidebar-header">
                          <span className="profile-payment-icon">💳</span>
                          <div>
                            <strong className="profile-payment-card-number">{card.brand} {card.number}</strong>
                            <span className="profile-payment-card-meta">{card.holder} | Exp: {card.expiry}</span>
                          </div>
                        </div>
                        <div className="profile-wishlist-actions">
                          {card.isDefault && (
                            <span className="profile-payment-default-badge">
                              {t.defaultCard}
                            </span>
                          )}
                          <button
                            type="button"
                            className="profile-payment-remove-btn"
                            onClick={() => setPaymentCards((prev) => prev.filter((c) => c.id !== card.id))}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ marginTop: "8px" }}
                      onClick={() => {
                        setIsAddingCard(true);
                        setCardHolder("");
                        setCardNumber("");
                        setCardExpiry("");
                        setCardCvv("");
                      }}
                    >
                      ➕ {t.addCardBtn}
                    </button>
                  </div>
                ) : (
                  <div className="profile-add-address-form">
                    <div className="form-group">
                      <label className="form-label">{t.cardholderLabel}</label>
                      <input type="text" className="form-input" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Ibrahim Al-Fahad" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.cardNumberLabel}</label>
                      <input type="text" className="form-input" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4000 1234 5678 9010" required />
                    </div>
                    <div className="profile-grid-2cols-gap12">
                      <div className="form-group">
                        <label className="form-label">{t.expiryLabel}</label>
                        <input type="text" className="form-input" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t.cvvLabel}</label>
                        <input type="password" className="form-input" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="***" maxLength={3} required />
                      </div>
                    </div>

                    <div className="profile-card-form-actions">
                      <button type="button" className="btn-secondary flex-1" onClick={() => setIsAddingCard(false)}>
                        {t.cancelBtn}
                      </button>
                      <button
                        type="button"
                        className="btn-primary flex-1"
                        onClick={() => {
                          if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
                            alert(language === "ar" ? "يرجى ملء جميع الخانات" : "Please fill in all card details");
                            return;
                          }
                          const brandName = cardNumber.startsWith("4") ? "Visa" : "Mada";
                          const lastFour = cardNumber.replace(/\s/g, "").slice(-4);
                          setPaymentCards((prev) => [
                            ...prev,
                            { id: `c-${Date.now()}`, brand: brandName, number: `**** **** **** ${lastFour}`, expiry: cardExpiry, holder: cardHolder, isDefault: false }
                          ]);
                          setIsAddingCard(false);
                          setToastMessage(t.cardSuccess);
                          setTimeout(() => setToastMessage(""), 3000);
                        }}
                      >
                        💾 {t.saveCardBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* H. SETTINGS PANEL */}
          {activePanel === "settings" && (
            <div className="profile-panel-card">
              <h2 className="profile-panel-title">
                {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
              </h2>

              <div className="profile-settings-list">
                <div className="search-filter-row-between">
                  <div>
                    <strong className="profile-payment-card-number">🔔 {language === "ar" ? "إشعارات الطلبات" : "Order Notifications"}</strong>
                    <span className="profile-payment-card-meta">{language === "ar" ? "تلقي تحديثات تتبع الشحنات عبر البريد ورسائل SMS" : "Receive real-time tracking updates via SMS & Email"}</span>
                  </div>
                  <input type="checkbox" defaultChecked className="profile-switcher-checkbox" />
                </div>

                <div className="profile-settings-item-row-divider">
                  <div>
                    <strong className="profile-payment-card-number">🔒 {language === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication"}</strong>
                    <span className="profile-payment-card-meta">{language === "ar" ? "حماية حسابك ورموز المحفظة الشخصية" : "Secure your wallet and account details with 2FA verification"}</span>
                  </div>
                  <input type="checkbox" className="profile-switcher-checkbox" />
                </div>
              </div>
            </div>
          )}

          {/* I. PRIVACY & REGULATIONS PANEL */}
          {activePanel === "privacy" && (
            <div className="profile-panel-card">
              <h2 className="profile-panel-title">
                {t.privacyLabel}
              </h2>

              <div className="search-filters-container">
                <div className="profile-privacy-rule-divider">
                  <strong className="profile-rule-title-primary">
                    {t.moirTitle}
                  </strong>
                  <p className="profile-privacy-rule-text">
                    {t.moirText}
                  </p>
                </div>

                <div className="profile-privacy-rule-divider">
                  <strong className="profile-rule-title-secondary">
                    {t.coldChainTitle}
                  </strong>
                  <p className="profile-privacy-rule-text">
                    {t.coldChainText}
                  </p>
                </div>

                <div>
                  <strong className="profile-rule-title-standard">
                    {t.walletSecurityTitle}
                  </strong>
                  <p className="profile-privacy-rule-text">
                    {t.walletSecurityText}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Live Tracking overlay modal (Shared dashboard overlay) */}
      {trackingOrder && (
        <div className="modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="search-filter-row-between">
              <h3 className="profile-modal-title">
                {t.trackTitle} #{trackingOrder.id}
              </h3>
              <button className="btn-icon" onClick={() => setTrackingOrder(null)}>✕</button>
            </div>

            {/* Map pin */}
            <div className="profile-tracker-map-preview">
              Live Courier Route Map
            </div>

            {/* Courier briefing details */}
            <div className="profile-tx-card">
              <div>
                <span className="profile-sidebar-email">{t.driver}</span>
                <strong className="profile-driver-name">{trackingOrder.driverName}</strong>
              </div>
              <a
                href={`tel:${trackingOrder.driverPhone}`}
                className="profile-driver-call-btn"
              >
                📞 {t.call}
              </a>
            </div>

            {/* Timeline */}
            <div className="tracker-timeline">
              <div className={`tracker-step ${trackingOrder.timeline[0].done ? "tracker-step-done" : ""} ${trackingOrder.status === "pending_rx" ? "tracker-step-active" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelinePlaced}</span>
                <span className="tracker-time">{trackingOrder.timeline[0].time}</span>
              </div>
              <div className={`tracker-step ${trackingOrder.timeline[1].done ? "tracker-step-done" : ""} ${trackingOrder.status === "delivering" ? "tracker-step-active" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelinePreparing}</span>
                <span className="tracker-time">{trackingOrder.timeline[1].time}</span>
              </div>
              <div className={`tracker-step ${trackingOrder.timeline[2].done ? "tracker-step-done" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelineDelivering}</span>
                <span className="tracker-time">{trackingOrder.timeline[2].time}</span>
              </div>
              <div className={`tracker-step ${trackingOrder.timeline[3].done ? "tracker-step-done" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelineArrived}</span>
                <span className="tracker-time">{trackingOrder.timeline[3].time}</span>
              </div>
            </div>

            <button
              className="btn-secondary profile-preset-btn"
              onClick={() => alert("Connecting to pharmacist support line...")}
            >
              🏥 {t.support} (Licensed Pharmacist Line)
            </button>
          </div>
        </div>
      )}

      {/* Floating success toast alert notification */}
      {toastMessage && (
        <div className="profile-toast-notification">
          ✨ {toastMessage}
        </div>
      )}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="search-suspense-loading">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
