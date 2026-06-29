"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { WalletLoyaltyUnifiedCard } from "@/components/DashboardCards";
import OrderCard from "@/components/OrderCard";
import { useSearchParams, useRouter } from "next/navigation";
import { mockProducts } from "@/mock/data";

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
    <div style={{ paddingBottom: "30px", position: "relative" }}>
      {/* Styles animation block for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Page Title (Mobile only, on desktop sidebar title serves this) */}
      <div className="mobile-only" style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
        {activePanel !== "menu" && (
          <button
            onClick={() => setActivePanel("menu")}
            style={{ background: "transparent", border: "none", fontSize: "14px", cursor: "pointer", fontWeight: "700" }}
          >
            ← {t.back}
          </button>
        )}
        <h1 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>
          {activePanel === "menu" ? t.profile : activePanel === "wishlist" ? t.wishlistLabel : activePanel === "addresses" ? t.savedAddresses : activePanel === "support" ? t.supportTitle : activePanel === "profile" ? t.profileTitle : activePanel === "payment" ? t.paymentLabel : activePanel === "privacy" ? t.privacyLabel : t.profile}
        </h1>
      </div>

      <div className="profile-container">

        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className={`profile-sidebar ${activePanel === "menu" ? "" : "desktop-only"}`}>
          {/* User profile briefing summary header */}
          <div style={{ padding: "20px", backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border)", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifycontent: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold" }}>
              👤
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>{profileName}</h4>
              <span style={{ fontSize: "10px", color: "var(--text-2)", display: "block", marginTop: "2px" }}>{profileEmail}</span>
            </div>
          </div>

          {/* Navigation link items */}
          <div style={{ display: "flex", flexDirection: "column" }}>
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
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span className="mobile-only" style={{ fontSize: "12px", color: "var(--text-2)" }}>{language === "ar" ? "←" : "→"}</span>
                </div>
              );
            })}
          </div>

          {/* Quick options panel bottom of sidebar */}
          <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="btn-secondary" onClick={toggleLanguage} style={{ paddingBlock: "8px", fontSize: "12px" }}>
              🌐 {t.langLabel}: {language === "en" ? "العربية" : "English"}
            </button>
            <button className="btn-secondary" onClick={() => alert("Logging out...")} style={{ color: "var(--danger)", borderColor: "var(--danger)", paddingBlock: "8px", fontSize: "12px" }}>
              🚪 {t.logout}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Panel Details */}
        <div className={`layout-main-col ${activePanel === "menu" ? "desktop-only" : ""}`}>

          {/* A. PROFILE / SETTINGS PANEL */}
          {activePanel === "profile" && (
            <>
              <div style={{ marginBottom: "16px" }}>
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
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px"}}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                  {t.profileTitle}
                </h2>

                <div className="form-group">
                  <label className="form-label">{language === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                  <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">{t.email}</label>
                    <input type="email" className="form-input" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.phone}</label>
                    <input type="text" className="form-input" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn-primary" style={{ width: "auto" }} onClick={() => {
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
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "10px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>
                    {t.savedAddresses}
                  </h2>
                  {!isAddingAddress && (
                    <button
                      className="btn-primary"
                      style={{ width: "auto", padding: "6px 12px", fontSize: "12px" }}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {addresses.map((addr) => (
                      <div key={addr.id} style={{ padding: "16px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <strong style={{ fontSize: "14px" }}>{language === "ar" ? addr.tag_ar : addr.tag}</strong>
                          {addr.isDefault && (
                            <span style={{ fontSize: "10px", backgroundColor: "rgba(15,108,189,0.1)", color: "var(--primary)", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                              Default
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--text-2)" }}>
                          {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Screen 23 Map Selector Form */
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>{t.mapPinTitle}</h3>
                    
                    <div style={{
                      height: "180px",
                      backgroundColor: "#e0f2f1",
                      backgroundImage: "radial-gradient(#b2dfdb 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                      borderRadius: "12px",
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      marginBottom: "10px"
                    }} onClick={() => {
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
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                          <div className="spinner" style={{ width: "24px", height: "24px", border: "3px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                          <span style={{ fontSize: "12px", color: "var(--text-1)", fontWeight: "600" }}>{t.gpsLookup}</span>
                        </div>
                      ) : gpsLocked ? (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "28px", display: "block" }}>📍</span>
                          <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: "700" }}>{t.gpsDone}</span>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <span style={{ fontSize: "24px", display: "block" }}>🗺️</span>
                          <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: "600" }}>
                            {language === "ar" ? "انقر على الخريطة لإسقاط الدبوس وتحديد موقعك تلقائياً" : "Click Map to Drop Pin and Fetch Coordinates Automatically"}
                          </span>
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: "8px", right: "8px", fontSize: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: "2px 6px", borderRadius: "4px" }}>
                        GPS Coordinates: 24.774265, 46.626482
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.streetNameLabel}</label>
                      <input type="text" className="form-input" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} placeholder="e.g. Al-Malqa, Riyadh" required />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label className="form-label">{t.buildingNumberLabel}</label>
                        <input type="text" className="form-input" value={addrBuilding} onChange={(e) => setAddrBuilding(e.target.value)} placeholder="e.g. 4812" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{language === "ar" ? "نوع السكن" : "Housing Type"}</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button type="button" className={`btn-secondary ${addrType === "Villa" ? "tab-btn-active" : ""}`} style={{ flex: 1, padding: "8px" }} onClick={() => setAddrType("Villa")}>
                            🏠 {t.villaLabel}
                          </button>
                          <button type="button" className={`btn-secondary ${addrType === "Apartment" ? "tab-btn-active" : ""}`} style={{ flex: 1, padding: "8px" }} onClick={() => setAddrType("Apartment")}>
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
                      <textarea className="form-input" style={{ minHeight: "60px", fontFamily: "inherit" }} value={addrNotes} onChange={(e) => setAddrNotes(e.target.value)} placeholder="e.g. Near pharmacy, red door" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{language === "ar" ? "تصنيف العنوان" : "Address Tag"}</label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {["Home", "Work", "Other"].map((tag) => (
                          <button key={tag} type="button" className={`btn-secondary ${addrTag === tag ? "tab-btn-active" : ""}`} style={{ flex: 1, padding: "8px" }} onClick={() => setAddrTag(tag)}>
                            {tag === "Home" ? `🏠 ${t.tagHome}` : tag === "Work" ? `💼 ${t.tagWork}` : `📍 ${t.tagOther}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddingAddress(false)}>
                        {t.cancelBtn}
                      </button>
                      <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={() => {
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
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0, marginBottom: "20px" }}>
                {t.wishlistLabel}
              </h2>

              {wishlistProducts.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  {wishlistProducts.map((product) => {
                    const prodName = language === "ar" ? product.name_ar : product.name_en;
                    return (
                      <div key={product.id} style={{ display: "flex", gap: "16px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", alignItems: "center" }}>
                        <div style={{ fontSize: "32px", padding: "12px", backgroundColor: "var(--surface)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px" }}>
                          {product.image}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>{prodName}</h4>
                          <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block", marginTop: "2px" }}>
                            {language === "ar" ? product.pharmacyName_ar : product.pharmacyName_en}
                          </span>
                          <strong style={{ fontSize: "14px", color: "var(--primary)", display: "block", marginTop: "4px" }}>
                            {product.price.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                          </strong>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px", width: "auto" }} onClick={() => {
                            addToCart(product, 1);
                            setToastMessage(t.addedToCartToast.replace("{name}", prodName));
                            setTimeout(() => setToastMessage(""), 3000);
                          }}>
                            🛒 {language === "ar" ? "أضف للسلة" : "Add to Cart"}
                          </button>
                          <button style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", color: "var(--danger)", fontSize: "14px" }} onClick={() => {
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
                <div className="empty-state" style={{ marginTop: "20px" }}>
                  <span className="empty-icon">❤️</span>
                  <strong className="empty-title">{t.wishlistEmpty}</strong>
                  <p className="empty-desc">{t.wishlistEmptyDesc}</p>
                </div>
              )}
            </div>
          )}

          {/* D. HELP & SUPPORT PANEL */}
          {activePanel === "support" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                  {t.supportTitle}
                </h2>

                {/* FAQ sections */}
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "800", marginBottom: "12px", color: "var(--primary)" }}>
                    {t.faqTitle}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                      <strong style={{ display: "block", fontSize: "13px", color: "var(--text-1)" }}>{t.faq1}</strong>
                      <p style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "4px", lineHeight: "1.4" }}>{t.faq1Ans}</p>
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "13px", color: "var(--text-1)" }}>{t.faq2}</strong>
                      <p style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "4px", lineHeight: "1.4" }}>{t.faq2Ans}</p>
                    </div>
                  </div>
                </div>

                {/* Helpline info */}
                <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginTop: "10px" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: "800", marginBottom: "8px" }}>📞 {t.contactUs}</h4>
                  <div style={{ fontSize: "12px", color: "var(--text-1)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span>🟢 {t.phoneSupport}</span>
                    <span>🟢 {t.pharmacistLine}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* E. EMBEDDED WALLET & LOYALTY PANEL */}
          {activePanel === "wallet" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <WalletLoyaltyUnifiedCard
                onPointsHistoryClick={() => setWalletLoyaltyTab("points")}
                onTransactionDetailsClick={() => setWalletLoyaltyTab("transactions")}
                onViewAllClick={() => setWalletLoyaltyTab("transactions")}
              />

              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Custom Tabs inside panel */}
                <div className="tab-container" style={{ marginBottom: "10px" }}>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ backgroundColor: "rgba(24, 182, 122, 0.05)", border: "1px dashed var(--secondary)", padding: "16px", borderRadius: "12px", color: "var(--secondary)", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <strong style={{ fontSize: "14px" }}>⚡ {language === "ar" ? "تنبيه المرتجعات السريعة" : "Instant Refund Guarantee"}</strong>
                      <span style={{ lineHeight: "1.5" }}>
                        {language === "ar" ? "أي إلغاء أو إرجاع للطلب يتم قيده فوراً في محفظتك الإلكترونية لاستخدامه في مشترياتك القادمة." : "Any canceled orders or items are instantly credited to your wallet to prevent long bank wait times."}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "700" }}>📜 {language === "ar" ? "سجل العمليات" : "Transaction History"}</h3>
                      {walletTransactions.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {walletTransactions.map((tx) => {
                            const title = language === "ar" ? tx.title_ar : tx.title_en;
                            const isPositive = tx.amount > 0;
                            return (
                              <div
                                key={tx.id}
                                style={{
                                  backgroundColor: "var(--bg)",
                                  border: "1px solid var(--border)",
                                  borderRadius: "12px",
                                  padding: "12px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                }}
                              >
                                <div>
                                  <span style={{ fontSize: "13px", fontWeight: "600", display: "block" }}>{title}</span>
                                  <span style={{ fontSize: "10px", color: "var(--text-2)" }}>{tx.date}</span>
                                </div>
                                <strong style={{ fontSize: "14px", color: isPositive ? "var(--success)" : "var(--text-1)" }}>
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
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "700" }}>💳 {t.topUpTitle}</h3>
                      
                      <div className="form-group">
                        <label className="form-label">{t.topUpAmountLabel}</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="number"
                            className="form-input"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="100.00"
                            style={{ flex: 1 }}
                          />
                          <strong style={{ fontSize: "14px", color: "var(--text-1)" }}>{language === "ar" ? "ر.س" : "SAR"}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {["50", "100", "200", "500"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className="btn-secondary"
                            style={{ paddingBlock: "6px", fontSize: "12px", flex: 1 }}
                            onClick={() => setTopUpAmount(preset)}
                          >
                            +{preset}
                          </button>
                        ))}
                      </div>

                      <div className="form-group">
                        <label className="form-label">{language === "ar" ? "طريقة الدفع للشحن" : "Top Up Payment Method"}</label>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <button
                            type="button"
                            className={`btn-secondary ${topUpSource === "mada" ? "tab-btn-active" : ""}`}
                            style={{ flex: 1, padding: "10px" }}
                            onClick={() => setTopUpSource("mada")}
                          >
                            💳 {t.madaPay}
                          </button>
                          <button
                            type="button"
                            className={`btn-secondary ${topUpSource === "stcpay" ? "tab-btn-active" : ""}`}
                            style={{ flex: 1, padding: "10px" }}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Progression bar */}
                    <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                        <span>🏆 {t.goldMemberBadge}</span>
                        <span style={{ color: "var(--primary)" }}>{language === "ar" ? "باقي ٢٥٠ نقطة للبلاتيني" : "250 pts to Platinum Tier"}</span>
                      </div>
                      <div className="loyalty-progress-container">
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", opacity: 0.9, marginBottom: "4px" }}>
                          <span>{loyaltyPoints} / 1500 {language === "ar" ? "نقطة" : "pts"}</span>
                        </div>
                        <div className="loyalty-progress-bar">
                          <div className="loyalty-progress-fill" style={{ width: `${Math.min((loyaltyPoints / 1500) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* How to Earn/Redeem rules */}
                    <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "13px", color: "var(--primary)", marginBottom: "4px" }}>
                          ⭐ {language === "ar" ? "قواعد كسب النقاط" : "How to Earn Points"}
                        </strong>
                        <p style={{ fontSize: "11px", color: "var(--text-2)", lineHeight: "1.5" }}>
                          {language === "ar" ? "اكسب ١ نقطة مقابل كل ١٠ ر.س تنفقها في شراء الأدوية والمستلزمات." : "Earn 1 point for every 10 SAR spent on checkout orders."}
                        </p>
                      </div>
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                        <strong style={{ display: "block", fontSize: "13px", color: "var(--secondary)", marginBottom: "4px" }}>
                          🎁 {language === "ar" ? "قواعد استبدال النقاط" : "How to Redeem Points"}
                        </strong>
                        <p style={{ fontSize: "11px", color: "var(--text-2)", lineHeight: "1.5" }}>
                          {language === "ar" ? "كل ٥٠ نقطة تساوي ١ ر.س خصم فوري. يمكنك استخدامها خلال الدفع." : "Every 50 points = 1 SAR instant discount applied at checkout."}
                        </p>
                      </div>
                    </div>

                    {/* Point History */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "700" }}>📜 {language === "ar" ? "سجل النقاط" : "Points History"}</h3>
                      {loyaltyHistory.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {loyaltyHistory.map((hist) => {
                            const label = language === "ar" ? hist.action_ar : hist.action_en;
                            const isPositive = hist.points > 0;
                            return (
                              <div
                                key={hist.id}
                                style={{
                                  backgroundColor: "var(--bg)",
                                  border: "1px solid var(--border)",
                                  borderRadius: "12px",
                                  padding: "12px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                }}
                              >
                                <div>
                                  <span style={{ fontSize: "13px", fontWeight: "600", display: "block" }}>{label}</span>
                                  <span style={{ fontSize: "10px", color: "var(--text-2)" }}>{hist.date}</span>
                                </div>
                                <strong style={{ fontSize: "14px", color: isPositive ? "var(--success)" : "var(--danger)" }}>
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
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "700" }}>🎁 {t.redeemTitle}</h3>
                      
                      <div style={{ padding: "12px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span>{t.pointsBalanceLabel.replace("{points}", loyaltyPoints)}</span>
                        <strong style={{ color: "var(--secondary)" }}>
                          {t.pointsEquivalent.replace("{amount}", (loyaltyPoints / 50).toFixed(2))}
                        </strong>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t.redeemAmountLabel}</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="number"
                            className="form-input"
                            value={pointsRedeemInput}
                            onChange={(e) => setPointsRedeemInput(e.target.value)}
                            placeholder="50"
                            style={{ flex: 1 }}
                          />
                          <span style={{ fontSize: "12px", color: "var(--text-2)" }}>{language === "ar" ? "نقطة" : "pts"}</span>
                        </div>
                      </div>

                      {pointsRedeemInput && (
                        <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: "700", display: "block" }}>
                          {language === "ar" 
                            ? `ستحصل على: ${(parseFloat(pointsRedeemInput) / 50 || 0).toFixed(2)} ر.س كاش باك` 
                            : `You will get: ${(parseFloat(pointsRedeemInput) / 50 || 0).toFixed(2)} SAR cashback`}
                        </span>
                      )}

                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ borderColor: "var(--secondary)", color: "var(--secondary)" }}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                  {t.ordersLabel}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0, marginBottom: "10px" }}>
                  {t.paymentLabel}
                </h2>

                {!isAddingCard ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {paymentCards.map((card) => (
                      <div key={card.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <span style={{ fontSize: "24px" }}>💳</span>
                          <div>
                            <strong style={{ fontSize: "14px", display: "block" }}>{card.brand} {card.number}</strong>
                            <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{card.holder} | Exp: {card.expiry}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {card.isDefault && (
                            <span style={{ fontSize: "10px", backgroundColor: "rgba(24,182,122,0.1)", color: "var(--success)", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                              {t.defaultCard}
                            </span>
                          )}
                          <button
                            type="button"
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: "14px" }}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="form-group">
                      <label className="form-label">{t.cardholderLabel}</label>
                      <input type="text" className="form-input" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Ibrahim Al-Fahad" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.cardNumberLabel}</label>
                      <input type="text" className="form-input" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4000 1234 5678 9010" required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label className="form-label">{t.expiryLabel}</label>
                        <input type="text" className="form-input" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t.cvvLabel}</label>
                        <input type="password" className="form-input" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="***" maxLength={3} required />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddingCard(false)}>
                        {t.cancelBtn}
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ flex: 1 }}
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
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>🔔 {language === "ar" ? "إشعارات الطلبات" : "Order Notifications"}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{language === "ar" ? "تلقي تحديثات تتبع الشحنات عبر البريد ورسائل SMS" : "Receive real-time tracking updates via SMS & Email"}</span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>🔒 {language === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication"}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{language === "ar" ? "حماية حسابك ورموز المحفظة الشخصية" : "Secure your wallet and account details with 2FA verification"}</span>
                  </div>
                  <input type="checkbox" style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                </div>
              </div>
            </div>
          )}

          {/* I. PRIVACY & REGULATIONS PANEL */}
          {activePanel === "privacy" && (
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                {t.privacyLabel}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
                  <strong style={{ fontSize: "14px", color: "var(--primary)", display: "block", marginBottom: "6px" }}>
                    {t.moirTitle}
                  </strong>
                  <p style={{ fontSize: "12.5px", color: "var(--text-2)", lineHeight: "1.6", margin: 0 }}>
                    {t.moirText}
                  </p>
                </div>

                <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
                  <strong style={{ fontSize: "14px", color: "var(--secondary)", display: "block", marginBottom: "6px" }}>
                    {t.coldChainTitle}
                  </strong>
                  <p style={{ fontSize: "12.5px", color: "var(--text-2)", lineHeight: "1.6", margin: 0 }}>
                    {t.coldChainText}
                  </p>
                </div>

                <div>
                  <strong style={{ fontSize: "14px", color: "var(--text-1)", display: "block", marginBottom: "6px" }}>
                    {t.walletSecurityTitle}
                  </strong>
                  <p style={{ fontSize: "12.5px", color: "var(--text-2)", lineHeight: "1.6", margin: 0 }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>
                {t.trackTitle} #{trackingOrder.id}
              </h3>
              <button className="btn-icon" onClick={() => setTrackingOrder(null)}>✕</button>
            </div>

            {/* Map pin */}
            <div
              style={{
                height: "120px",
                background: "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.15)), url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23b1e2c6%22/><path d=%22M20,0 L20,100 M80,0 L80,100 M0,30 L100,30 M0,70 L100,70%22 stroke=%22%23ffffff%22 stroke-width=%223%22/><circle cx=%2250%22 cy=%2250%22 r=%224%22 fill=%22%230F6CBD%22/><circle cx=%2270%22 cy=%2260%22 r=%226%22 fill=%22%2318B67A%22/></svg>')",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-1)",
                fontWeight: "700",
                fontSize: "12px",
                border: "1px solid var(--border)"
              }}
            >
              🛵 Courier Route Live Pin
            </div>

            {/* Courier briefing details */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "var(--bg)", borderRadius: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block" }}>{t.driver}</span>
                <strong style={{ fontSize: "13px" }}>{trackingOrder.driverName}</strong>
              </div>
              <a
                href={`tel:${trackingOrder.driverPhone}`}
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "white",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "700"
                }}
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
              className="btn-secondary"
              onClick={() => alert("Connecting to pharmacist support line...")}
              style={{ padding: "8px", fontSize: "12px" }}
            >
              🏥 {t.support} (Licensed Pharmacist Line)
            </button>
          </div>
        </div>
      )}

      {/* Floating success toast alert notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "var(--text-1)",
          color: "var(--surface)",
          padding: "12px 24px",
          borderRadius: "30px",
          boxShadow: "var(--shadow-lg)",
          zIndex: 1000,
          fontWeight: "600",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "fadeIn 0.2s ease"
        }}>
          ✨ {toastMessage}
        </div>
      )}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
