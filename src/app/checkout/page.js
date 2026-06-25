"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const {
    language,
    cart,
    walletBalance,
    loyaltyPoints,
    currentAddress,
    addresses,
    setCurrentAddress,
    addAddress,
    createOrder
  } = useApp();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = Unified Checkout, 2 = Order Placed Success

  // Selection States
  const [deliveryOption, setDeliveryOption] = useState("standard"); // standard, cold
  const [paymentMethod, setPaymentMethod] = useState("mada"); // mada, apple, stc, cod
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyalty, setUseLoyalty] = useState(false);

  // Address modal form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newTag, setNewTag] = useState("Home");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Riyadh");

  // Order Details Cache for success screen
  const [placedOrders, setPlacedOrders] = useState([]);

  if (cart.length === 0 && step === 1) {
    return (
      <div className="empty-state" style={{ marginTop: "40px" }}>
        <span className="empty-icon">🛒</span>
        <h2 className="empty-title">
          {language === "ar" ? "لا توجد منتجات للدفع" : "No Items for Checkout"}
        </h2>
        <button className="btn-primary" onClick={() => router.push("/home")} style={{ width: "auto" }}>
          {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
        </button>
      </div>
    );
  }

  // Cost Computations
  const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Group split delivery counts
  const pharmaciesCount = Object.keys(
    cart.reduce((acc, item) => {
      acc[item.pharmacyId] = true;
      return acc;
    }, {})
  ).length;

  const baseDeliveryFee = deliveryOption === "cold" ? 25 : 10;
  const deliveryFees = baseDeliveryFee * pharmaciesCount;
  const initialVat = itemsSubtotal * 0.15;
  const initialTotal = itemsSubtotal + deliveryFees + initialVat;

  // Wallet deductions
  let walletDeduction = 0;
  if (useWallet) {
    walletDeduction = Math.min(walletBalance, initialTotal);
  }

  // Loyalty deductions (Redeem in steps of 50 points = 1 SAR)
  const maxLoyaltyDeduction = Math.floor(loyaltyPoints / 50); // in SAR
  let loyaltyDeduction = 0;
  if (useLoyalty) {
    const remainingToPay = initialTotal - walletDeduction;
    loyaltyDeduction = Math.min(maxLoyaltyDeduction, remainingToPay);
  }

  const finalTotal = initialTotal - walletDeduction - loyaltyDeduction;

  const t = {
    checkout: language === "ar" ? "عملية الدفع الآمنة" : "Secure Checkout",
    sar: language === "ar" ? "ر.س" : "SAR",
    address: language === "ar" ? "عنوان التوصيل" : "Delivery Address",
    delivery: language === "ar" ? "طريقة الشحن" : "Shipping Method",
    payment: language === "ar" ? "طريقة الدفع" : "Payment Method",
    wallet: language === "ar" ? "رصيد المحفظة" : "Wallet Balance",
    loyalty: language === "ar" ? "نقاط الولاء" : "Loyalty Points",
    selectAddress: language === "ar" ? "اختر عنوان التوصيل" : "Select Delivery Address",
    addAddress: language === "ar" ? "إضافة عنوان جديد" : "Add New Address",
    standardDel: language === "ar" ? "توصيل عادي (١٠ ر.س لكل صيدلية)" : "Standard Delivery (10 SAR/pharmacy)",
    coldDel: language === "ar" ? "توصيل مبرد طبي (٢٥ ر.س لكل صيدلية)" : "Insulated Cold-Chain Delivery (25 SAR/pharmacy)",
    walletTitle: language === "ar" ? "استخدام رصيد المحفظة" : "Use Wallet Balance",
    walletDesc: language === "ar" ? `رصيدك الحالي: ${walletBalance.toFixed(2)} ر.س. خصم هذا الرصيد من الإجمالي.` : `Your balance: ${walletBalance.toFixed(2)} SAR. Apply this to deduct from total.`,
    loyaltyTitle: language === "ar" ? "استبدال نقاط الولاء" : "Redeem Loyalty Points",
    loyaltyDesc: language === "ar" ? `لديك ${loyaltyPoints} نقطة (تساوي ${maxLoyaltyDeduction} ر.س خصم).` : `You have ${loyaltyPoints} points (equal to ${maxLoyaltyDeduction} SAR discount).`,
    subtotal: language === "ar" ? "المجموع الفرعي:" : "Subtotal:",
    deliveryFeeLabel: language === "ar" ? "رسوم التوصيل:" : "Delivery Fees:",
    vatLabel: language === "ar" ? "ضريبة القيمة المضافة (١٥٪):" : "VAT (15%):",
    walletLabel: language === "ar" ? "خصم المحفظة:" : "Wallet Deduction:",
    loyaltyLabel: language === "ar" ? "خصم نقاط الولاء:" : "Loyalty Discount:",
    payable: language === "ar" ? "الإجمالي المستحق للدفع" : "Total Payable",
    placeOrder: language === "ar" ? "تأكيد وطلب الآن" : "Place Order & Pay",
    congrats: language === "ar" ? "تهانينا! تم الطلب بنجاح" : "Congratulations! Order Confirmed",
    successSubtitle: language === "ar" ? "تم تقسيم الطلب بنجاح نظراً لتعدد الصيدليات:" : "Your order was split between vendors to optimize delivery:",
    trackBtn: language === "ar" ? "تتبع الطلبات في حسابي" : "Track Orders in Dashboard",
    homeBtn: language === "ar" ? "العودة للرئيسية" : "Back to Home",
    orderSummary: language === "ar" ? "ملخص الطلب" : "Order Summary",
    checkoutSteps: language === "ar" ? "شحن ودفع سريع" : "Express Shipping & Payment",
    successSteps: language === "ar" ? "تأكيد الطلب" : "Order Completed"
  };

  const steps = [
    { num: 1, label: t.checkoutSteps },
    { num: 2, label: t.successSteps }
  ];

  const handlePlaceOrder = () => {
    const redeemedPoints = useLoyalty ? Math.min(loyaltyPoints, Math.floor(loyaltyDeduction * 50)) : 0;
    const ordersResult = createOrder(walletDeduction, redeemedPoints, paymentMethod, deliveryOption);
    setPlacedOrders(ordersResult);
    setStep(2);
  };

  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newStreet) return;
    addAddress({
      tag: newTag,
      tag_ar: newTag === "Home" ? "المنزل" : "العمل",
      street: newStreet,
      street_ar: newStreet,
      city: newCity,
      city_ar: newCity === "Riyadh" ? "الرياض" : "جدة"
    });
    setShowNewAddress(false);
    setNewStreet("");
  };

  return (
    <div style={{ paddingBottom: "30px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>{t.checkout}</h1>

      {/* Stepper Node UI */}
      <div className="stepper" style={{ marginBottom: "24px" }}>
        {steps.map((st) => (
          <div
            key={st.num}
            className={`step-node ${step === st.num ? "step-node-active" : step > st.num ? "step-node-done" : ""}`}
          >
            <div className="step-circle">{st.num}</div>
            <span className="step-label">{st.label}</span>
          </div>
        ))}
      </div>

      {step === 2 ? (
        /* SUCCESS PAGE (Desktop Centered Single Column Layout) */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center", paddingBlock: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(24,182,122,0.1)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>
            ✓
          </div>
          
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-1)" }}>{t.congrats}</h2>
            <p style={{ fontSize: "13px", color: "var(--text-2)", marginTop: "4px" }}>{t.successSubtitle}</p>
          </div>

          {/* Split Packages */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", textAlign: "start", marginTop: "10px" }}>
            {placedOrders.map((ord) => (
              <div key={ord.id} style={{ padding: "16px", border: "1px solid var(--border)", backgroundColor: "var(--surface)", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>
                  <span>📦 Shipment #{ord.id}</span>
                  <span style={{ color: "var(--primary)" }}>{ord.total.toFixed(2)} {t.sar}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-2)" }}>
                  🏥 {language === "ar" ? ord.pharmacyName_ar : ord.pharmacyName_en} | ETA: {language === "ar" ? ord.eta_ar : ord.eta_en}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "10px" }}>
            <button className="btn-primary" onClick={() => router.push("/profile?action=orders")}>
              {t.trackBtn}
            </button>
            <button className="btn-secondary" onClick={() => router.push("/home")}>
              {t.homeBtn}
            </button>
          </div>
        </div>
      ) : (
        /* PRIMARY CHECKOUT LAYOUT (Two-Columns) */
        <div className="two-col-layout">
          
          {/* LEFT COLUMN: Combined Checkout Panels */}
          <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* PANEL 1: Address Selection */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                📍 {t.address}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setCurrentAddress(addr)}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: `1.5px solid ${currentAddress.id === addr.id ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: currentAddress.id === addr.id ? "rgba(15, 108, 189, 0.05)" : "var(--surface)",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px" }}>
                        {language === "ar" ? addr.tag_ar : addr.tag}
                      </strong>
                      {currentAddress.id === addr.id && <span style={{ color: "var(--primary)", fontWeight: "700" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-2)" }}>
                      {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                    </span>
                  </div>
                ))}
              </div>

              <button className="btn-secondary" onClick={() => setShowNewAddress(true)} style={{ marginTop: "4px" }}>
                + {t.addAddress}
              </button>
            </div>

            {/* PANEL 2: Delivery Option Selection */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                🚗 {t.delivery}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${deliveryOption === "standard" ? "var(--primary)" : "var(--border)"}`,
                    backgroundColor: deliveryOption === "standard" ? "rgba(15, 108, 189, 0.05)" : "var(--surface)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.15s"
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryOption === "standard"}
                    onChange={() => setDeliveryOption("standard")}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>{t.standardDel}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-2)" }}>
                      {language === "ar" ? "توصيل من الفروع القريبة خلال ٣٠-٤٥ دقيقة" : "Standard delivery from near branches in 30-45 mins"}
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${deliveryOption === "cold" ? "var(--primary)" : "var(--border)"}`,
                    backgroundColor: deliveryOption === "cold" ? "rgba(15, 108, 189, 0.05)" : "var(--surface)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.15s"
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="cold"
                    checked={deliveryOption === "cold"}
                    onChange={() => setDeliveryOption("cold")}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>❄️ {t.coldDel}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-2)" }}>
                      {language === "ar" ? "يضمن سلامة الأدوية الحساسة للحرارة" : "Guarantees temperature sensitive drug safety"}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* PANEL 3: Payment Method Selection */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                💳 {t.payment}
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                {[
                  { id: "mada", name: t.mada, logo: "💳" },
                  { id: "apple", name: t.applePay, logo: "🍏 Apple Pay" },
                  { id: "stc", name: t.stcPay, logo: "💜 STC Pay" },
                  { id: "cod", name: t.cod, logo: "💵" }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: `1.5px solid ${paymentMethod === pm.id ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: paymentMethod === pm.id ? "rgba(15, 108, 189, 0.05)" : "var(--surface)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "20px" }}>{pm.logo}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* PANEL 4: Wallet & Loyalty Benefits Toggles */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                🎁 {language === "ar" ? "خصومات ومزايا" : "Discounts & Benefits"}
              </h3>
              
              {/* Wallet deduction toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <strong style={{ fontSize: "14px", display: "block", marginBottom: "2px" }}>💳 {t.walletTitle}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{t.walletDesc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={() => setUseWallet(!useWallet)}
                  disabled={walletBalance <= 0}
                  style={{ width: "22px", height: "22px", cursor: "pointer" }}
                />
              </div>

              {/* Loyalty deduction toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
                <div>
                  <strong style={{ fontSize: "14px", display: "block", marginBottom: "2px" }}>👑 {t.loyaltyTitle}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{t.loyaltyDesc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={useLoyalty}
                  onChange={() => setUseLoyalty(!useLoyalty)}
                  disabled={loyaltyPoints < 50}
                  style={{ width: "22px", height: "22px", cursor: "pointer" }}
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky summary bill panel (Always visible) */}
          <div className="layout-side-col" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", borderBottom: "1px solid var(--border)", paddingBottom: "10px", margin: 0 }}>
                📋 {t.orderSummary}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>{t.subtotal}</span>
                  <span style={{ fontWeight: "600" }}>{itemsSubtotal.toFixed(2)} {t.sar}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>{t.deliveryFeeLabel}</span>
                  <span style={{ fontWeight: "600" }}>{deliveryFees.toFixed(2)} {t.sar}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>{t.vatLabel}</span>
                  <span style={{ fontWeight: "600" }}>{initialVat.toFixed(2)} {t.sar}</span>
                </div>

                {useWallet && walletDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--success)", fontWeight: "700" }}>
                    <span>{t.walletLabel}</span>
                    <span>-{walletDeduction.toFixed(2)} {t.sar}</span>
                  </div>
                )}

                {useLoyalty && loyaltyDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--success)", fontWeight: "700" }}>
                    <span>{t.loyaltyLabel}</span>
                    <span>-{loyaltyDeduction.toFixed(2)} {t.sar}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px", color: "var(--text-1)" }}>
                  <span>{t.payable}</span>
                  <span style={{ color: "var(--primary)" }}>{finalTotal.toFixed(2)} {t.sar}</span>
                </div>
              </div>

              {/* Confirm CTA purchase */}
              <button onClick={handlePlaceOrder} className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                {t.placeOrder}
              </button>

              {/* Items Breakdown list */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "700", display: "block", marginBottom: "8px" }}>Items / المنتجات</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto" }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ color: "var(--text-1)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1, paddingRight: "8px" }}>
                        {language === "ar" ? item.name_ar : item.name_en}
                      </span>
                      <span style={{ color: "var(--text-2)", flexShrink: 0 }}>
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* New Address Overlay Modal Form */}
      {showNewAddress && (
        <div className="modal-overlay" onClick={() => setShowNewAddress(false)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleAddNewAddressSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>{t.addAddress}</h3>
              <button className="btn-icon" type="button" onClick={() => setShowNewAddress(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Address Tag</label>
              <select
                className="form-input"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              >
                <option value="Home">Home (المنزل)</option>
                <option value="Work">Work (العمل)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <select
                className="form-input"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              >
                <option value="Riyadh">Riyadh (الرياض)</option>
                <option value="Jeddah">Jeddah (جدة)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Street & Building Details</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Al-Malqa, Building 45"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              ✓ Save Address
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
