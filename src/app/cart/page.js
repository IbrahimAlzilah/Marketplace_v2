"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import CartItem from "@/components/CartItem";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

export default function CartPage() {
  const { language, cart, attachPrescription, walletBalance, loyaltyPoints, currentAddress, addresses, setCurrentAddress, isLoggedIn, login } = useApp();
  const router = useRouter();

  const [uploadingItem, setUploadingItem] = useState(null);

  const [showLocationGating, setShowLocationGating] = useState(false);
  const [showLoginGating, setShowLoginGating] = useState(false);

  // New features states
  const [showDeliverySplitPopover, setShowDeliverySplitPopover] = useState(false);
  const [rxTab, setRxTab] = useState("image"); // image, digital
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isFetchingDigitalRx, setIsFetchingDigitalRx] = useState(false);
  const [digitalRxList, setDigitalRxList] = useState([]);
  const [selectedDigitalRxId, setSelectedDigitalRxId] = useState(null);

  const handleCheckoutClick = () => {
    if (!currentAddress) {
      setShowLocationGating(true);
      return;
    }
    if (!isLoggedIn) {
      setShowLoginGating(true);
      return;
    }
    router.push("/checkout");
  };

  const t = {
    cart: language === "ar" ? "سلة المشتريات" : "Shopping Cart",
    coupon: language === "ar" ? "رمز الكوبون" : "Coupon Code",
    apply: language === "ar" ? "تطبيق" : "Apply",
    applied: language === "ar" ? "تم تطبيق الكوبون بنجاح!" : "Coupon applied successfully!",
    checkout: language === "ar" ? "متابعة عملية الدفع" : "Proceed to Checkout",
    empty: language === "ar" ? "السلة فارغة" : "Your Cart is Empty",
    emptyDesc: language === "ar" ? "تصفح الأدوية والمنتجات الصحية لإضافتها هنا." : "Browse medicines and wellness products to add them here.",
    subtotal: language === "ar" ? "إجمالي المنتجات" : "Items Subtotal",
    delivery: language === "ar" ? "رسوم الشحن والتوصيل" : "Delivery Fees",
    vat: language === "ar" ? "ضريبة القيمة المضافة (١٥٪)" : "VAT (15%)",
    total: language === "ar" ? "الإجمالي الكلي" : "Total Amount",
    sar: language === "ar" ? "ر.س" : "SAR",
    eta: language === "ar" ? "التوصيل المتوقع:" : "Delivery ETA:",
    rxPending: language === "ar" ? "وصفة طبية معلقة!" : "Prescription Upload Required!",
    rxPendingDesc: language === "ar" ? "يرجى إرفاق الوصفة الطبية للأدوية المعلمة باللون الأحمر للمتابعة." : "Please attach the doctor's prescription for the red-flagged medicines.",
    uploadTitle: language === "ar" ? "إرفاق الوصفة الطبية" : "Upload Prescription Scan",
    submit: language === "ar" ? "تأكيد الملف" : "Confirm File",
    orderSummary: language === "ar" ? "ملخص الطلب" : "Order Summary",
    selectAddress: language === "ar" ? "حدد موقع التوصيل" : "Select Delivery Location",
    loginRequired: language === "ar" ? "تسجيل الدخول مطلوب" : "Login Required",
    loginDesc: language === "ar" ? "يرجى تسجيل الدخول أو إنشاء حساب للمتابعة إلى إتمام الشراء." : "Please login or register to proceed to checkout.",
    free: language === "ar" ? "مجاني" : "Free"
  };

  // Group items by pharmacy
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.pharmacyId]) {
      acc[item.pharmacyId] = {
        name_en: item.pharmacyName_en,
        name_ar: item.pharmacyName_ar,
        items: []
      };
    }
    acc[item.pharmacyId].items.push(item);
    return acc;
  }, {});

  const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery calculation (10 SAR standard, 25 SAR cold chain, per pharmacy, unless subtotal >= 100 SAR)
  const getDeliveryFeeForGroup = (items) => {
    const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0);
    if (subtotal >= 100) return 0;
    const isCold = items.some(item => item.isColdChain);
    return isCold ? 25 : 10;
  };

  const deliveryFeesDetails = Object.keys(groupedCart).map((pharmacyId) => {
    const group = groupedCart[pharmacyId];
    const fee = getDeliveryFeeForGroup(group.items);
    return {
      pharmacyId,
      name_en: group.name_en,
      name_ar: group.name_ar,
      fee
    };
  });

  const deliveryFees = deliveryFeesDetails.reduce((sum, item) => sum + item.fee, 0);

  const vat = itemsSubtotal * 0.15;
  const totalAmount = itemsSubtotal + deliveryFees + vat;

  const hasMissingPrescriptions = cart.some((item) => item.isRx && !item.rxFile);

  const triggerRxUpload = (item) => {
    setUploadingItem(item);
    setSelectedFileName("");
    setRxTab("image");
  };

  const handleConfirmRxFile = (e) => {
    e.preventDefault();
    const mockFile = selectedFileName || `prescription_${uploadingItem.id}.pdf`;
    attachPrescription(uploadingItem.id, mockFile);
    setUploadingItem(null);
  };

  if (cart.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: "40px" }}>
        <span className="empty-icon">🛒</span>
        <h2 className="empty-title">{t.empty}</h2>
        <p className="empty-desc">{t.emptyDesc}</p>
        <button className="btn-primary" onClick={() => router.push("/home")} style={{ width: "auto" }}>
          {language === "ar" ? "ابدأ التسوق" : "Start Shopping"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "30px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>{t.cart}</h1>

      <div className="two-col-layout">
        {/* LEFT COLUMN: Vendors groups & Products list */}
        <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* List of pharmacies groups */}
          {Object.keys(groupedCart).map((pharmacyId) => {
            const group = groupedCart[pharmacyId];
            const pharmacyName = language === "ar" ? group.name_ar : group.name_en;
            const sub = group.items.reduce((s, item) => s + item.price * item.quantity, 0);

            // Free delivery progress calculations
            const freeDeliveryThreshold = 100;
            const remainingForFree = freeDeliveryThreshold - sub;
            const progressPercent = Math.min((sub / freeDeliveryThreshold) * 100, 100);

            return (
              <div key={pharmacyId} className="order-group-box" style={{ border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", backgroundColor: "var(--surface)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="order-group-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--primary)" }}>🏥 {pharmacyName}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-2)" }}>
                    {t.eta} {group.items.some(i => i.isColdChain) ? "1 Hour" : "25 mins"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {group.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUploadPrescription={triggerRxUpload}
                    />
                  ))}
                </div>

                {/* Free delivery progression meter (Screen 16 requirements) */}
                <div style={{ marginTop: "6px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "12px" }}>
                  {remainingForFree > 0 ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", color: "var(--text-2)" }}>
                        <span>🚚 {language === "ar" ? `أضف ${remainingForFree.toFixed(2)} ر.س للتوصيل المجاني` : `Add ${remainingForFree.toFixed(2)} SAR more for FREE delivery`}</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div style={{ width: "100%", height: "6px", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "var(--primary)", transition: "width 0.3s ease" }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontSize: "11.5px", fontWeight: "700" }}>
                      <span>🎉</span>
                      <span>{language === "ar" ? "تهانينا! لقد حصلت على توصيل مجاني من هذه الصيدلية" : "Congratulations! You've unlocked FREE delivery from this branch"}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", borderTop: "1px solid var(--border)", paddingTop: "10px", fontWeight: "700", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <span style={{ color: "var(--text-2)", fontWeight: "600" }}>{language === "ar" ? "المجموع الفرعي للصيدلية: " : "Pharmacy Subtotal: "}</span>
                    <span style={{ color: "var(--text-1)", fontWeight: "800" }}>{sub.toFixed(2)} {t.sar}</span>
                  </div>
                  <Link
                    href={`/pharmacies/${pharmacyId}`}
                    style={{
                      fontSize: "12px",
                      color: "var(--primary)",
                      fontWeight: "700",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = 'underline';
                      e.target.style.color = 'var(--primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = 'none';
                      e.target.style.color = 'var(--primary)';
                    }}
                  >
                    + {language === "ar" ? `تسوق المزيد من ${pharmacyName}` : `Shop More from ${pharmacyName}`}
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Alert Warning if prescription is needed */}
          {hasMissingPrescriptions && (
            <div className="rx-notice-box" style={{ padding: "16px" }}>
              <strong style={{ fontSize: "14px" }}>⚠️ {t.rxPending}</strong>
              <span style={{ marginTop: "4px" }}>{t.rxPendingDesc}</span>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sticky summary panel */}
        <div className="layout-side-col" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
              {t.orderSummary}
            </h3>

            {/* Billing breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span>{t.subtotal}</span>
                <span style={{ fontWeight: "600" }}>{itemsSubtotal.toFixed(2)} {t.sar}</span>
              </div>



              {/* Delivery Fees Clickable Split Popover */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowDeliverySplitPopover(!showDeliverySplitPopover)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "var(--primary)",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                >
                  {t.delivery} (Split 🔁)
                </button>
                <span style={{ fontWeight: "600" }}>{deliveryFees.toFixed(2)} {t.sar}</span>

                {showDeliverySplitPopover && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "24px",
                      right: language === "ar" ? "auto" : "0",
                      left: language === "ar" ? "0" : "auto",
                      backgroundColor: "var(--surface)",
                      border: "1.5px solid var(--primary)",
                      borderRadius: "12px",
                      padding: "12px",
                      zIndex: 100,
                      width: "240px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                      <strong style={{ fontSize: "11px", color: "var(--text-1)" }}>
                        {language === "ar" ? "تفاصيل الشحن المجزأ" : "Split Shipping Details"}
                      </strong>
                      <button
                        type="button"
                        onClick={() => setShowDeliverySplitPopover(false)}
                        style={{ border: "none", background: "none", cursor: "pointer", fontSize: "12px", color: "var(--text-2)" }}
                      >
                        ✕
                      </button>
                    </div>
                    {deliveryFeesDetails.map((det) => (
                      <div key={det.pharmacyId} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                        <span>🏥 {language === "ar" ? det.name_ar : det.name_en}</span>
                        <strong>{det.fee === 0 ? t.free : `${det.fee} SAR`}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span>{t.vat}</span>
                <span style={{ fontWeight: "600" }}>{vat.toFixed(2)} {t.sar}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px", color: "var(--text-1)" }}>
                <span>{t.total}</span>
                <span style={{ color: "var(--primary)" }}>{totalAmount.toFixed(2)} {t.sar}</span>
              </div>
            </div>


            {/* Wallet & Loyalty Benefits Preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
                {language === "ar" ? "المزايا المتاحة" : "Available Benefits"}
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span>💳 {language === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</span>
                <strong style={{ color: "var(--primary)" }}>{walletBalance.toFixed(2)} {t.sar}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span>👑 {language === "ar" ? "نقاط الولاء" : "Loyalty Points"}</span>
                <strong style={{ color: "#b8860b" }}>{loyaltyPoints} pts ({ (loyaltyPoints / 50).toFixed(2) } {t.sar})</strong>
              </div>
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={handleCheckoutClick}
              className="btn-primary"
              disabled={hasMissingPrescriptions}
              style={{ width: "100%", marginTop: "8px" }}
            >
              {t.checkout}
            </button>
          </div>

        </div>
      </div>

      {/* Prescription upload scan modal (Screen 17 method selector tabs & Sehaty link retrieval) */}
      {uploadingItem && (
        <div className="modal-overlay" onClick={() => { setUploadingItem(null); setDigitalRxList([]); setSelectedFileName(""); }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>📋 {t.uploadTitle}</h3>
              <button className="btn-icon" onClick={() => { setUploadingItem(null); setDigitalRxList([]); setSelectedFileName(""); }}>✕</button>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--text-2)", marginBottom: "14px" }}>
              {language === "ar" ? `يرجى إرفاق الوصفة الطبية لـ ${uploadingItem.name_ar}` : `Please attach a doctor prescription file to verify ${uploadingItem.name_en}`}
            </p>

            {/* Tab Header Selector (Screen 17 tabs) */}
            <div style={{ display: "flex", borderBottom: "2px solid var(--border)", marginBottom: "16px", gap: "16px" }}>
              <button
                type="button"
                onClick={() => setRxTab("image")}
                style={{
                  paddingBlock: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${rxTab === "image" ? "var(--primary)" : "transparent"}`,
                  color: rxTab === "image" ? "var(--primary)" : "var(--text-2)",
                  cursor: "pointer",
                  marginBottom: "-2px"
                }}
              >
                📷 {language === "ar" ? "تحميل صورة الوصفة" : "Upload File/Photo"}
              </button>
              <button
                type="button"
                onClick={() => setRxTab("digital")}
                style={{
                  paddingBlock: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${rxTab === "digital" ? "var(--primary)" : "transparent"}`,
                  color: rxTab === "digital" ? "var(--primary)" : "var(--text-2)",
                  cursor: "pointer",
                  marginBottom: "-2px"
                }}
              >
                🏥 {language === "ar" ? "ربط وصفة إلكترونية (وصفتي/صحتي)" : "Link Digital Rx (Sehaty/Wasfaty)"}
              </button>
            </div>

            {rxTab === "image" ? (
              <form onSubmit={handleConfirmRxFile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label
                  style={{
                    border: "2px dashed var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "28px" }}>📷</span>
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>{language === "ar" ? "التقاط صورة أو رفع ملف" : "Take Photo or Upload PDF/Image"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => {
                      const name = e.target.files[0]?.name || "uploaded_rx.pdf";
                      setSelectedFileName(name);
                    }}
                    style={{ display: "none" }}
                  />
                </label>

                {selectedFileName && (
                  <div style={{ fontSize: "12px", backgroundColor: "rgba(24,182,122,0.1)", color: "var(--secondary)", padding: "8px 12px", borderRadius: "8px", fontWeight: "600" }}>
                    ✓ {t.rxAttached}: {selectedFileName}
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={!selectedFileName}>
                  {t.submit}
                </button>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={language === "ar" ? "أدخل رقم الهوية الوطنية / الإقامة" : "Enter National ID / Iqama"}
                    style={{ flex: 1, padding: "8px 12px", fontSize: "13px" }}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setIsFetchingDigitalRx(true);
                      setDigitalRxList([]);
                      setTimeout(() => {
                        setIsFetchingDigitalRx(false);
                        setDigitalRxList([
                          { id: "rx-1", doctor: "Dr. Sarah Al-Otaibi", hospital: "King Khalid Hospital", code: "MOH-8829-X", date: "2026-06-15" },
                          { id: "rx-2", doctor: "Dr. Fahad Al-Mutairi", hospital: "Riyadh Medical City", code: "WASFATY-7739-B", date: "2026-05-10" }
                        ]);
                      }, 800);
                    }}
                    style={{ width: "auto", fontSize: "12px", paddingInline: "16px" }}
                  >
                    {language === "ar" ? "جلب" : "Fetch"}
                  </button>
                </div>

                {isFetchingDigitalRx && (
                  <div style={{ textAlign: "center", paddingBlock: "10px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--primary)", animation: "pulsePin 1s infinite linear", margin: "0 auto" }} />
                    <span style={{ fontSize: "11px", color: "var(--text-2)", marginTop: "4px", display: "block" }}>
                      {language === "ar" ? "جاري الاستعلام من وزارة الصحة..." : "Querying MOH database..."}
                    </span>
                  </div>
                )}

                {digitalRxList.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto" }}>
                    {digitalRxList.map((rx) => (
                      <div
                        key={rx.id}
                        onClick={() => setSelectedDigitalRxId(rx.id)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: `1.5px solid ${selectedDigitalRxId === rx.id ? "var(--primary)" : "var(--border)"}`,
                          backgroundColor: selectedDigitalRxId === rx.id ? "rgba(15, 108, 189, 0.04)" : "var(--surface)",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "12px", display: "block", color: "var(--text-1)" }}>{rx.doctor}</strong>
                          <span style={{ fontSize: "10px", color: "var(--text-2)" }}>{rx.hospital} • {rx.date}</span>
                        </div>
                        <code style={{ fontSize: "10px", backgroundColor: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{rx.code}</code>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="btn-primary"
                  disabled={!selectedDigitalRxId}
                  onClick={() => {
                    const chosen = digitalRxList.find((r) => r.id === selectedDigitalRxId);
                    if (chosen) {
                      attachPrescription(uploadingItem.id, `${chosen.code} (${chosen.doctor})`);
                      setUploadingItem(null);
                      setDigitalRxList([]);
                      setSelectedDigitalRxId(null);
                    }
                  }}
                >
                  ✓ {language === "ar" ? "ربط الوصفة الطبية" : "Link Selected Prescription"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location gating modal */}
      {showLocationGating && (
        <div className="modal-overlay" onClick={() => setShowLocationGating(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>{t.selectAddress}</h3>
              <button className="btn-icon" onClick={() => setShowLocationGating(false)}>✕</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto" }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setCurrentAddress(addr);
                    setShowLocationGating(false);
                    if (!isLoggedIn) {
                      setShowLoginGating(true);
                    }
                  }}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1.5px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    cursor: "pointer"
                  }}
                >
                  <strong style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>
                    {language === "ar" ? addr.tag_ar : addr.tag}
                  </strong>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>
                    {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Login gating modal */}
      <AuthModal
        isOpen={showLoginGating}
        onClose={() => setShowLoginGating(false)}
        onSuccess={() => router.push("/checkout")}
      />
    </div>
  );
}
