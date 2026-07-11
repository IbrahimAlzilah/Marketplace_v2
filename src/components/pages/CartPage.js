"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import CartItem from "@/components/CartItem";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";
import { mockPharmacies } from "@/mock/data";

const getProductCountText = (count, lang) => {
  if (lang === "ar") {
    if (count === 1) return "منتج واحد";
    if (count === 2) return "منتجان";
    if (count >= 3 && count <= 10) return `${count} منتجات`;
    return `${count} منتج`;
  }
  return `${count} ${count === 1 ? "Product" : "Products"}`;
};

const Checkbox = ({ checked, onChange }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`custom-checkbox ${checked ? "checked" : "unchecked"}`}
    >
      {checked && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6L4.5 8.5L10 3"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default function CartPage() {
  const { language, cart, attachPrescription, walletBalance, loyaltyPoints, currentAddress, addresses, setCurrentAddress, isLoggedIn, login, selectedPharmacyIds, setSelectedPharmacyIds, activeCheckout } = useApp();
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
    if (selectedPharmacyIds.length === 0) return;
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

  const selectedCart = cart.filter(item => selectedPharmacyIds.includes(item.pharmacyId));
  const itemsSubtotal = selectedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery calculation (10 SAR standard, 25 SAR cold chain, per pharmacy, unless subtotal >= 100 SAR)
  const getDeliveryFeeForGroup = (items) => {
    const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0);
    if (subtotal >= 100) return 0;
    const isCold = items.some(item => item.isColdChain);
    return isCold ? 25 : 10;
  };

  const deliveryFeesDetails = Object.keys(groupedCart)
    .filter(pharmacyId => selectedPharmacyIds.includes(pharmacyId))
    .map((pharmacyId) => {
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

  const hasMissingPrescriptions = selectedCart.some((item) => item.isRx && !item.rxFile);

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
      <div className="empty-state">
        <span className="empty-icon">🛒</span>
        <h2 className="empty-title">{t.empty}</h2>
        <p className="empty-desc">{t.emptyDesc}</p>
        <button className="btn-primary cart-empty-btn" onClick={() => router.push("/home")}>
          {language === "ar" ? "ابدأ التسوق" : "Start Shopping"}
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">{t.cart}</h1>

      {activeCheckout && ["processing_approval", "approval_status", "payment", "processing_payment"].includes(activeCheckout.step) && (
        <div className="checkout-banner-wrapper">
          <div className="checkout-banner-content">
            <span>⚠️</span>
            <span>
              {language === "ar" 
                ? "لديك عملية دفع معلقة بانتظار موافقة الصيدلية." 
                : "You have a pending checkout awaiting pharmacy approval."}
            </span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="btn-primary checkout-banner-btn"
          >
            {language === "ar" ? "عرض التفاصيل" : "View Details"}
          </button>
        </div>
      )}

      <div className="two-col-layout">
        {/* LEFT COLUMN: Vendors groups & Products list */}
        <div className="layout-main-col main-flex-col">
          
          {/* List of pharmacies groups */}
          {Object.keys(groupedCart).map((pharmacyId) => {
            const group = groupedCart[pharmacyId];
            const pharmacyName = language === "ar" ? group.name_ar : group.name_en;
            const sub = group.items.reduce((s, item) => s + item.price * item.quantity, 0);

            // Free delivery progress calculations
            const freeDeliveryThreshold = 100;
            const remainingForFree = freeDeliveryThreshold - sub;
            const progressPercent = Math.min((sub / freeDeliveryThreshold) * 100, 100);

            const isChecked = selectedPharmacyIds.includes(pharmacyId);
            const pharmacyLogo = mockPharmacies.find(p => p.id === pharmacyId)?.logo || "🏥";

            return (
              <div key={pharmacyId} className="pharmacy-group-box">
                
                {/* Header matching the reference style */}
                <div 
                  className="pharmacy-group-header" 
                  onClick={() => {
                    if (isChecked) {
                      setSelectedPharmacyIds(prev => prev.filter(id => id !== pharmacyId));
                    } else {
                      setSelectedPharmacyIds(prev => [...prev, pharmacyId]);
                    }
                  }}
                >
                  <div className="pharmacy-group-left">
                    <Checkbox 
                      checked={isChecked} 
                      onChange={() => {
                        if (isChecked) {
                          setSelectedPharmacyIds(prev => prev.filter(id => id !== pharmacyId));
                        } else {
                          setSelectedPharmacyIds(prev => [...prev, pharmacyId]);
                        }
                      }}
                    />
                    
                    {/* Circular Logo Wrapper */}
                    <div className="pharmacy-group-logo">
                      <span className="pharmacy-group-logo-text">{pharmacyLogo}</span>
                    </div>
                    
                    {/* Pharmacy Info */}
                    <div className="pharmacy-group-info">
                      <span className="pharmacy-group-name">
                        {pharmacyName}
                      </span>
                      <span className="pharmacy-group-count">
                        {getProductCountText(group.items.length, language)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pharmacy-group-items">
                  {group.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUploadPrescription={triggerRxUpload}
                    />
                  ))}
                </div>

                {/* Free delivery progression meter (Screen 16 requirements) */}
                <div className="delivery-progress-container">
                  {remainingForFree > 0 ? (
                    <div>
                      <div className="delivery-progress-header">
                        <span>🚚 {language === "ar" ? `أضف ${remainingForFree.toFixed(2)} ر.س للتوصيل المجاني` : `Add ${remainingForFree.toFixed(2)} SAR more for FREE delivery`}</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="delivery-progress-track">
                        <div className="delivery-progress-fill" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="delivery-unlocked">
                      <span>🎉</span>
                      <span>{language === "ar" ? "تهانينا! لقد حصلت على توصيل مجاني من هذه الصيدلية" : "Congratulations! You've unlocked FREE delivery from this branch"}</span>
                    </div>
                  )}
                </div>

                <div className="pharmacy-group-footer">
                  <div>
                    <span className="pharmacy-delivery-fee-label">{language === "ar" ? "رسوم التوصيل: " : "Delivery Fee: "}</span>
                    <span className="pharmacy-delivery-fee-value">
                      {getDeliveryFeeForGroup(group.items) === 0 
                        ? t.free 
                        : `${getDeliveryFeeForGroup(group.items).toFixed(2)} ${t.sar}`}
                    </span>
                  </div>
                  <Link
                    href={`/pharmacies/${pharmacyId}`}
                    className="pharmacy-shop-more-link"
                  >
                    + {language === "ar" ? `تسوق المزيد من ${pharmacyName}` : `Shop More from ${pharmacyName}`}
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Alert Warning if prescription is needed */}
          {hasMissingPrescriptions && (
            <div className="rx-notice-box cart-rx-notice">
              <strong className="cart-rx-notice-title">⚠️ {t.rxPending}</strong>
              <span className="cart-rx-notice-desc">{t.rxPendingDesc}</span>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sticky summary panel */}
        <div className="layout-side-col cart-side-column">
          
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">
              {t.orderSummary}
            </h3>

            {/* Billing breakdown */}
            <div className="cart-summary-billing">
              <div className="cart-summary-row">
                <span>{t.subtotal}</span>
                <span className="cart-summary-row-bold">{itemsSubtotal.toFixed(2)} {t.sar}</span>
              </div>

              {/* Delivery Fees Clickable Split Popover */}
              <div className="cart-summary-row">
                <button
                  type="button"
                  onClick={() => setShowDeliverySplitPopover(!showDeliverySplitPopover)}
                  className="delivery-split-trigger"
                >
                  {t.delivery} (Split 🔁)
                </button>
                <span className="cart-summary-row-bold">{deliveryFees.toFixed(2)} {t.sar}</span>

                {showDeliverySplitPopover && (
                  <div
                    className="delivery-split-popover"
                    style={{
                      right: language === "ar" ? "auto" : "0",
                      left: language === "ar" ? "0" : "auto"
                    }}
                  >
                    <div className="delivery-split-popover-header">
                      <strong className="delivery-split-popover-title">
                        {language === "ar" ? "تفاصيل الشحن المجزأ" : "Split Shipping Details"}
                      </strong>
                      <button
                        type="button"
                        onClick={() => setShowDeliverySplitPopover(false)}
                        className="delivery-split-popover-close"
                      >
                        ✕
                      </button>
                    </div>
                    {deliveryFeesDetails.map((det) => (
                      <div key={det.pharmacyId} className="delivery-split-popover-row">
                        <span>🏥 {language === "ar" ? det.name_ar : det.name_en}</span>
                        <strong>{det.fee === 0 ? t.free : `${det.fee} SAR`}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cart-summary-row">
                <span>{t.vat}</span>
                <span className="cart-summary-row-bold">{vat.toFixed(2)} {t.sar}</span>
              </div>

              <div className="cart-summary-total-row">
                <span>{t.total}</span>
                <span className="cart-summary-total-value">{totalAmount.toFixed(2)} {t.sar}</span>
              </div>
            </div>

            {/* Wallet & Loyalty Benefits Preview */}
            <div className="cart-benefits-container">
              <span className="cart-benefits-header">
                {language === "ar" ? "المزايا المتاحة" : "Available Benefits"}
              </span>
              <div className="cart-benefits-row">
                <span>💳 {language === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</span>
                <strong className="cart-benefits-value-primary">{walletBalance.toFixed(2)} {t.sar}</strong>
              </div>
              <div className="cart-benefits-row">
                <span>👑 {language === "ar" ? "نقاط الولاء" : "Loyalty Points"}</span>
                <strong className="cart-benefits-value-loyalty">{loyaltyPoints} pts ({ (loyaltyPoints / 50).toFixed(2) } {t.sar})</strong>
              </div>
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={handleCheckoutClick}
              className="btn-primary cart-checkout-btn"
              disabled={hasMissingPrescriptions || selectedPharmacyIds.length === 0}
            >
              {selectedPharmacyIds.length === 0 ? (language === "ar" ? "يرجى اختيار صيدلية للدفع" : "Select a pharmacy to checkout") : t.checkout}
            </button>
          </div>

        </div>
      </div>

      {/* Prescription upload scan modal (Screen 17 method selector tabs & Sehaty link retrieval) */}
      {uploadingItem && (
        <div className="modal-overlay" onClick={() => { setUploadingItem(null); setDigitalRxList([]); setSelectedFileName(""); }}>
          <div className="modal-sheet rx-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="rx-modal-header">
              <h3 className="rx-modal-title">📋 {t.uploadTitle}</h3>
              <button className="btn-icon" onClick={() => { setUploadingItem(null); setDigitalRxList([]); setSelectedFileName(""); }}>✕</button>
            </div>
            
            <p className="rx-modal-desc">
              {language === "ar" ? `يرجى إرفاق الوصفة الطبية لـ ${uploadingItem.name_ar}` : `Please attach a doctor prescription file to verify ${uploadingItem.name_en}`}
            </p>

            {/* Tab Header Selector (Screen 17 tabs) */}
            <div className="rx-modal-tabs">
              <button
                type="button"
                onClick={() => setRxTab("image")}
                className={`rx-modal-tab-btn ${rxTab === "image" ? "active" : "inactive"}`}
              >
                📷 {language === "ar" ? "تحميل صورة الوصفة" : "Upload File/Photo"}
              </button>
              <button
                type="button"
                onClick={() => setRxTab("digital")}
                className={`rx-modal-tab-btn ${rxTab === "digital" ? "active" : "inactive"}`}
              >
                🏥 {language === "ar" ? "ربط وصفة إلكترونية (وصفتي/صحتي)" : "Link Digital Rx (Sehaty/Wasfaty)"}
              </button>
            </div>

            {rxTab === "image" ? (
              <form onSubmit={handleConfirmRxFile} className="rx-upload-form">
                <label className="rx-upload-dropzone">
                  <span className="rx-upload-dropzone-icon">📷</span>
                  <span className="rx-upload-dropzone-text">{language === "ar" ? "التقاط صورة أو رفع ملف" : "Take Photo or Upload PDF/Image"}</span>
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
                  <div className="rx-upload-attached-info">
                    ✓ {t.rxAttached}: {selectedFileName}
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={!selectedFileName}>
                  {t.submit}
                </button>
              </form>
            ) : (
              <div className="rx-digital-connect-container">
                <div className="rx-digital-input-row">
                  <input
                    type="text"
                    className="form-input rx-digital-input"
                    placeholder={language === "ar" ? "أدخل رقم الهوية الوطنية / الإقامة" : "Enter National ID / Iqama"}
                  />
                  <button
                    type="button"
                    className="btn-primary rx-digital-fetch-btn"
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
                  >
                    {language === "ar" ? "جلب" : "Fetch"}
                  </button>
                </div>

                {isFetchingDigitalRx && (
                  <div className="rx-digital-loader">
                    <div className="rx-digital-loader-spinner" />
                    <span className="rx-digital-loader-text">
                      {language === "ar" ? "جاري الاستعلام من وزارة الصحة..." : "Querying MOH database..."}
                    </span>
                  </div>
                )}

                {digitalRxList.length > 0 && (
                  <div className="rx-digital-list">
                    {digitalRxList.map((rx) => (
                      <div
                        key={rx.id}
                        onClick={() => setSelectedDigitalRxId(rx.id)}
                        className={`rx-digital-item ${selectedDigitalRxId === rx.id ? "selected" : "unselected"}`}
                      >
                        <div>
                          <strong className="rx-digital-item-doctor">{rx.doctor}</strong>
                          <span className="rx-digital-item-meta">{rx.hospital} • {rx.date}</span>
                        </div>
                        <code className="rx-digital-item-code">{rx.code}</code>
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
            <div className="location-modal-header">
              <h3 className="location-modal-title">{t.selectAddress}</h3>
              <button className="btn-icon" onClick={() => setShowLocationGating(false)}>✕</button>
            </div>
            
            <div className="location-modal-list">
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
                  className="location-modal-item"
                >
                  <strong className="location-modal-item-tag">
                    {language === "ar" ? addr.tag_ar : addr.tag}
                  </strong>
                  <span className="location-modal-item-street">
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
