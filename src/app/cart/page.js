"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import CartItem from "@/components/CartItem";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { language, cart, attachPrescription, walletBalance, loyaltyPoints, currentAddress, addresses, setCurrentAddress, isLoggedIn, login } = useApp();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [uploadingItem, setUploadingItem] = useState(null);

  const [showLocationGating, setShowLocationGating] = useState(false);
  const [showLoginGating, setShowLoginGating] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginPhone.trim()) {
      login(loginPhone, loginPass);
      setShowLoginGating(false);
      router.push("/checkout");
    }
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
    delivery: language === "ar" ? "رسوم التوصيل" : "Delivery Fees",
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
    locationDesc: language === "ar" ? "يرجى تحديد عنوان التوصيل أولاً لحساب رسوم الشحن بدقة." : "Please select your delivery address to calculate shipping fees."
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

  // Delivery calculation (10 SAR per pharmacy, unless they have hit a free shipping threshold or if cold chain requires more)
  const deliveryFees = Object.keys(groupedCart).reduce((sum, pharmacyId) => {
    const items = groupedCart[pharmacyId].items;
    const isCold = items.some(item => item.isColdChain);
    return sum + (isCold ? 25 : 10);
  }, 0);

  const appliedDiscount = itemsSubtotal * couponDiscount;
  const vat = (itemsSubtotal - appliedDiscount) * 0.15;
  const totalAmount = itemsSubtotal - appliedDiscount + deliveryFees + vat;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "BABY20" || couponCode.toUpperCase() === "YUSUR10") {
      setCouponDiscount(0.10); // 10% discount
      setCouponApplied(true);
    }
  };

  const hasMissingPrescriptions = cart.some((item) => item.isRx && !item.rxFile);

  const triggerRxUpload = (item) => {
    setUploadingItem(item);
  };

  const handleConfirmRxFile = (e) => {
    e.preventDefault();
    const mockFile = `prescription_${uploadingItem.id}.pdf`;
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

            return (
              <div key={pharmacyId} className="order-group-box">
                <div className="order-group-header">
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

                <div style={{ display: "flex", justifycontent: "space-between", justifyContent: "space-between", fontSize: "13px", borderTop: "1px solid var(--border)", paddingTop: "10px", fontWeight: "700" }}>
                  <span>{language === "ar" ? "المجموع الفرعي للصيدلية:" : "Pharmacy Subtotal:"}</span>
                  <span>{sub.toFixed(2)} {t.sar}</span>
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

        {/* RIGHT COLUMN: Sticky summary panel (Billing checkout totals) */}
        <div className="layout-side-col" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
              📋 {t.orderSummary}
            </h3>

            {/* Billing breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span>{t.subtotal}</span>
                <span style={{ fontWeight: "600" }}>{itemsSubtotal.toFixed(2)} {t.sar}</span>
              </div>

              {couponDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--success)", fontWeight: "700" }}>
                  <span>{language === "ar" ? "خصم الكوبون:" : "Coupon Discount:"}</span>
                  <span>-{(appliedDiscount).toFixed(2)} {t.sar}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span>{t.delivery}</span>
                <span style={{ fontWeight: "600" }}>{deliveryFees.toFixed(2)} {t.sar}</span>
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

            {/* Coupon tool */}
            <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
              <input
                type="text"
                className="form-input"
                placeholder={t.coupon}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px" }}
              />
              <button type="submit" className="btn-secondary" style={{ width: "auto", padding: "8px 16px", fontSize: "12px" }} disabled={couponApplied}>
                {t.apply}
              </button>
            </form>

            {couponApplied && (
              <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                ✓ {t.applied}
              </div>
            )}

            {/* Wallet & Loyalty Preview Highlights */}
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

      {/* Prescription upload scan modal */}
      {uploadingItem && (
        <div className="modal-overlay" onClick={() => setUploadingItem(null)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleConfirmRxFile}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>{t.uploadTitle}</h3>
              <button className="btn-icon" type="button" onClick={() => setUploadingItem(null)}>✕</button>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--text-2)", marginBottom: "10px" }}>
              {language === "ar" ? `يرجى إرفاق الوصفة الطبية لـ ${uploadingItem.name_ar}` : `Please attach a doctor scan file to verify ${uploadingItem.name_en}`}
            </p>

            <input
              type="file"
              className="form-input"
              required
              style={{ padding: "20px", borderStyle: "dashed" }}
            />

            <button type="submit" className="btn-primary">
              {t.submit}
            </button>
          </form>
        </div>
      )}

      {/* Location gating modal */}
      {showLocationGating && (
        <div className="modal-overlay" onClick={() => setShowLocationGating(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>📍 {t.selectAddress}</h3>
              <button className="btn-icon" onClick={() => setShowLocationGating(false)}>✕</button>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--text-2)", marginBottom: "12px" }}>
              {t.locationDesc}
            </p>

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
      {showLoginGating && (
        <div className="modal-overlay" onClick={() => setShowLoginGating(false)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleLoginSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>🔑 {t.loginRequired}</h3>
              <button className="btn-icon" type="button" onClick={() => setShowLoginGating(false)}>✕</button>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--text-2)" }}>
              {t.loginDesc}
            </p>

            <div className="form-group">
              <label className="form-label">{language === "ar" ? "رقم الجوال" : "Mobile Phone"}</label>
              <input
                type="text"
                placeholder="05xxxxxxxx"
                className="form-input"
                required
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === "ar" ? "كلمة المرور" : "Password"}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">
              {language === "ar" ? "تسجيل الدخول والمتابعة للدفع" : "Log In & Proceed"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
