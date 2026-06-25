"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { WalletLoyaltyUnifiedCard } from "@/components/DashboardCards";
import OrderCard from "@/components/OrderCard";
import { useSearchParams, useRouter } from "next/navigation";

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
    loyaltyHistory
  } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Panels: menu (mobile main menu), profile, addresses, wishlist, support, wallet & loyalty points, orders
  const [activePanel, setActivePanel] = useState("profile");
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [walletLoyaltyTab, setWalletLoyaltyTab] = useState("transactions"); // transactions, points

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
    timelineArrived: language === "ar" ? "تم التوصيل بنجاح" : "Delivered Successfully"
  };

  const sidebarMenuItems = [
    { id: "profile", label: t.profileTitle, icon: "👤" },
    { id: "orders", label: t.ordersLabel, icon: "📦" },
    { id: "wallet", label: t.walletLabel, icon: "💳" },
    { id: "addresses", label: t.savedAddresses, icon: "📍" },
    { id: "wishlist", label: `${t.wishlistLabel} (${wishlist.length})`, icon: "❤️" },
    { id: "settings", label: language === "ar" ? "الإعدادات" : "Settings", icon: "⚙️" },
    { id: "support", label: t.supportLabel, icon: "❓" }
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

  return (
    <div style={{ paddingBottom: "30px" }}>
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
          {activePanel === "menu" ? t.profile : activePanel === "wishlist" ? t.wishlistLabel : activePanel === "addresses" ? t.savedAddresses : activePanel === "support" ? t.supportTitle : activePanel === "profile" ? t.profileTitle : t.profile}
        </h1>
      </div>

      <div className="profile-container">

        {/* LEFT COLUMN: Sidebar Navigation */}
        {/* On desktop: always visible. On mobile: visible when activePanel is 'menu' */}
        <div className={`profile-sidebar ${activePanel === "menu" ? "" : "desktop-only"}`}>
          {/* User profile briefing summary header */}
          <div style={{ padding: "20px", backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border)", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifycontent: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold" }}>
              👤
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>Ibrahim Al-Fahad</h4>
              <span style={{ fontSize: "10px", color: "var(--text-2)", display: "block", marginTop: "2px" }}>ibrahim@yusur.com</span>
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
        {/* On desktop: always visible. On mobile: hidden when activePanel is 'menu' */}
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
                  <input type="text" className="form-input" defaultValue="Ibrahim Al-Fahad" readOnly />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">{t.email}</label>
                    <input type="email" className="form-input" defaultValue="ibrahim@yusur.com" readOnly />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.phone}</label>
                    <input type="text" className="form-input" defaultValue="0501234567" readOnly />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn-primary" style={{ width: "auto" }} onClick={() => alert("Profile updates saved!")}>
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
                <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                  {t.savedAddresses}
                </h2>

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
              </div>
            </div>
          )}

          {/* C. WISHLIST PANEL */}
          {activePanel === "wishlist" && (
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                {t.wishlistLabel}
              </h2>

              <div className="empty-state" style={{ marginTop: "20px" }}>
                <span className="empty-icon">❤️</span>
                <strong className="empty-title">Wishlist Empty</strong>
                <p className="empty-desc">Any items you add to your wishlist will appear here.</p>
              </div>
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
                  </div>
                )}

                {/* Sub-Panel 2: Loyalty Progression and Point Ledger */}
                {walletLoyaltyTab === "points" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Progression bar */}
                    <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                        <span>🏆 {language === "ar" ? "عضوية ذهبية" : "Gold Member"}</span>
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
                  </div>
                )}
              </div>
            </div>
          )}

          {/* G. EMBEDDED ORDERS PANEL (Desktop-Only Tab) */}
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
