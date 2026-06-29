"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const {
    language,
    cart,
    setCart,
    walletBalance,
    loyaltyPoints,
    currentAddress,
    addresses,
    setCurrentAddress,
    addAddress,
    createOrder
  } = useApp();
  const router = useRouter();

  // State Machine steps: 'review', 'processing_approval', 'approval_status', 'rejection_status', 'payment', 'processing_payment', 'confirmation', 'tracking'
  const [checkoutStep, setCheckoutStep] = useState("review");
  const [scenario, setScenario] = useState("partial_success"); // 'partial_success' or 'full_rejection'

  // Input states
  const [deliveryOption, setDeliveryOption] = useState("standard"); // standard, fast, cold
  const [paymentMethod, setPaymentMethod] = useState("mada"); // mada, apple, stc, cod
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Address modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState("select"); // 'select' or 'add'
  const [newTag, setNewTag] = useState("Home");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Riyadh");

  // Gating & Verification
  const [acceptedSfda, setAcceptedSfda] = useState(false);

  // Simulated status list
  const [approvalProgress, setApprovalProgress] = useState(0);
  const [pharmacyStatus, setPharmacyStatus] = useState({});
  const [simulatedOrderId, setSimulatedOrderId] = useState("");
  const [checkoutPlacedOrders, setCheckoutPlacedOrders] = useState([]);

  // Dictionary localization
  const translations = {
    en: {
      checkout: "Secure Checkout",
      reviewTitle: "Details of the Items",
      deliveryAddress: "Delivery Address",
      changeBtn: "Change",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      vat: "VAT (15%)",
      deliveryFees: "Delivery Fees",
      totalPayable: "Total Payable",
      continueBtn: "Continue to Pharmacy Review",
      backBtn: "Back",
      confirmPayment: "Confirm Payment",
      confirmOrder: "Confirm Order",
      sfdaCheckbox: "I certify that I have read and accepted the SFDA (Saudi Food & Drug Authority) medical use safety warnings for the requested items.",
      processingTitle: "Processing Your Order",
      processingDesc: "Waiting for pharmacy approval...",
      approvedTitle: "Order Approval Status",
      approvedOrders: "Approved Orders",
      rejectedOrders: "Rejected Orders",
      continueToPayment: "Continue to Payment",
      cancelOrder: "Cancel Order",
      rejectionTitle: "Order Rejected",
      rejectionDesc: "Unfortunately, all pharmacies have rejected your order.",
      reasonLabel: "Rejection Reason",
      cartUpdatedNotice: "Your cart has been updated automatically, removing the unavailable items.",
      continueShopping: "Continue Shopping",
      paymentTitle: "Payment Method",
      walletBalance: "Wallet Balance",
      useWallet: "Use Wallet Balance",
      loyaltyPoints: "Loyalty Points",
      redeemLoyalty: "Redeem Loyalty Points",
      promoCode: "Promo Code",
      apply: "Apply",
      promoApplied: "Promo Applied Successfully!",
      preparingPayment: "Preparing payment session...",
      placedSuccess: "Order Placed Successfully!",
      orderId: "Order ID",
      availableItems: "Available Items (Paid)",
      unavailableItems: "Unavailable Items (Refunded)",
      refundedToWallet: "Refunded to Wallet",
      trackBtn: "Track Your Order",
      homeBtn: "Back to Home",
      trackingTitle: "Track Your Order",
      driver: "Driver",
      shipment: "Shipment",
      statusPlaced: "Order Placed",
      statusPreparing: "Preparing Order",
      statusOut: "Out for Delivery",
      statusDelivered: "Delivered",
      scenarioSelector: "Simulation Scenario Selector (Evaluation Toggle)",
      scenarioA: "Scenario A: Partial Approval (Nahdi/Dawaa approves, Whites Pharmacy rejects)",
      scenarioB: "Scenario B: Full Rejection (All pharmacies reject order)",
      scenarioC: "Scenario C: Full Approval (All pharmacies approve order)",
      selectAddress: "Select Delivery Address",
      addNewAddress: "Add a new title",
      select: "Select",
      cancel: "Cancel",
      sar: "SAR",
      eta: "Delivery ETA:",
      free: "Free",
      noItems: "No items for checkout",
      browseProducts: "Browse Health Catalog",
      rejectedOutStock: "Some items are currently out of stock",
      rejectedPrescription: "Requires physical prescription validation",
      walletTxTitle: "Deduction for Order",
      rewardsEarned: "Loyalty Points Earned"
    },
    ar: {
      checkout: "عملية الدفع الآمنة",
      reviewTitle: "تفاصيل المنتجات",
      deliveryAddress: "عنوان التوصيل",
      changeBtn: "تغيير",
      orderSummary: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      vat: "ضريبة القيمة المضافة (١٥٪)",
      deliveryFees: "رسوم التوصيل",
      totalPayable: "الإجمالي الكلي",
      continueBtn: "متابعة لمراجعة الصيدلية",
      backBtn: "رجوع",
      confirmPayment: "تأكيد الدفع",
      confirmOrder: "تأكيد الطلب",
      sfdaCheckbox: "أقر بأنني قد اطلعت على تحذيرات وتعليمات الاستخدام المعتمدة من الهيئة العامة للغذاء والدواء للطلب.",
      processingTitle: "جاري معالجة طلبك",
      processingDesc: "بانتظار موافقة الصيدلية...",
      approvedTitle: "حالة موافقة الطلب",
      approvedOrders: "الطلبات المقبولة",
      rejectedOrders: "الطلبات المرفوضة",
      continueToPayment: "المتابعة للدفع",
      cancelOrder: "إلغاء الطلب",
      rejectionTitle: "تم رفض الطلب",
      rejectionDesc: "للأسف، تم رفض طلبك من قبل كافة الصيدليات.",
      reasonLabel: "سبب الرفض",
      cartUpdatedNotice: "تم تحديث سلتك تلقائياً وإزالة المنتجات غير المتوفرة.",
      continueShopping: "مواصلة التسوق",
      paymentTitle: "طريقة الدفع",
      walletBalance: "رصيد المحفظة",
      useWallet: "استخدام رصيد المحفظة",
      loyaltyPoints: "نقاط الولاء",
      redeemLoyalty: "استبدال نقاط الولاء",
      promoCode: "رمز الكوبون",
      apply: "تطبيق",
      promoApplied: "تم تطبيق الكوبون بنجاح!",
      preparingPayment: "جاري تهيئة جلسة الدفع...",
      placedSuccess: "تم تقديم الطلب بنجاح!",
      orderId: "رقم الطلب",
      availableItems: "المنتجات المتوفرة (تم الدفع)",
      unavailableItems: "المنتجات غير المتوفرة (مسترجعة)",
      refundedToWallet: "تم إرجاع المبلغ للمحفظة",
      trackBtn: "تتبع طلبك الآن",
      homeBtn: "العودة للرئيسية",
      trackingTitle: "تتبع طلباتك",
      driver: "السائق",
      shipment: "شحنة",
      statusPlaced: "تم تقديم الطلب",
      statusPreparing: "جاري تجهيز الطلب",
      statusOut: "خرج للتوصيل",
      statusDelivered: "تم التوصيل",
      scenarioSelector: "محدد سيناريو المحاكاة (خاص بالتقييم)",
      scenarioA: "السيناريو أ: قبول جزئي (رفض صيدلية وايتس وقبول البقية)",
      scenarioB: "السيناريو ب: رفض كلي (تم رفض الطلب من كافة الصيدليات)",
      scenarioC: "السيناريو ج: قبول كلي (تم قبول الطلب من كافة الصيدليات)",
      selectAddress: "حدد موقع التوصيل",
      addNewAddress: "إضافة عنوان جديد",
      select: "اختيار",
      cancel: "إلغاء",
      sar: "ر.س",
      eta: "التوصيل المتوقع:",
      free: "مجاني",
      noItems: "لا توجد منتجات للدفع",
      browseProducts: "تصفح المنتجات",
      rejectedOutStock: "بعض المنتجات غير متوفرة حالياً",
      rejectedPrescription: "يتطلب التحقق من الوصفة الطبية الأصلية",
      walletTxTitle: "دفع قيمة الطلب",
      rewardsEarned: "نقاط الولاء المكتسبة"
    }
  };

  const t = language === "ar" ? translations.ar : translations.en;

  // Group cart items by pharmacy
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.pharmacyId]) {
      acc[item.pharmacyId] = {
        id: item.pharmacyId,
        name_en: item.pharmacyName_en,
        name_ar: item.pharmacyName_ar,
        items: []
      };
    }
    acc[item.pharmacyId].items.push(item);
    return acc;
  }, {});

  const pharmacyIdsInCart = Object.keys(groupedCart);

  // Simulation effect for pharmacy approval stage
  useEffect(() => {
    if (checkoutStep === "processing_approval") {
      setApprovalProgress(10);
      const initialStatus = {};
      pharmacyIdsInCart.forEach(id => {
        initialStatus[id] = "pending";
      });
      setPharmacyStatus(initialStatus);

      // Simulating real-time pharmacy review stages
      const timer1 = setTimeout(() => {
        setApprovalProgress(40);
        setPharmacyStatus(prev => {
          const next = { ...prev };
          // Pharmacy 1 approves
          if (pharmacyIdsInCart[0]) next[pharmacyIdsInCart[0]] = "approved";
          return next;
        });
      }, 1000);

      const timer2 = setTimeout(() => {
        setApprovalProgress(75);
        setPharmacyStatus(prev => {
          const next = { ...prev };
          // Pharmacy 2 approves/rejects
          if (pharmacyIdsInCart[1]) {
            if (scenario === "full_rejection") {
              next[pharmacyIdsInCart[1]] = "rejected";
            } else {
              next[pharmacyIdsInCart[1]] = "approved";
            }
          }
          return next;
        });
      }, 2000);

      const timer3 = setTimeout(() => {
        setApprovalProgress(100);
        setPharmacyStatus(prev => {
          const next = { ...prev };
          // Pharmacy 3 (or Whites) rejects in Scenario A, or everyone rejects in Scenario B
          pharmacyIdsInCart.forEach((id, index) => {
            if (scenario === "full_success") {
              next[id] = "approved";
            } else if (scenario === "full_rejection") {
              next[id] = "rejected";
            } else if (index > 1 || id === "ph-3") {
              next[id] = "rejected"; // Whites Pharmacy ph-3 is rejected in Scenario A
            } else {
              next[id] = "approved";
            }
          });
          return next;
        });
      }, 3000);

      // Automate transitioning to next step
      const finishTimer = setTimeout(() => {
        if (scenario === "full_rejection") {
          // Alternative Flow: Order Rejected, update cart automatically, show reason
          setCheckoutStep("rejection_status");
          // Update cart automatically (removing all items from this order, but we clear it as it's fully rejected)
          setCart([]);
        } else {
          // Success/Partial Approval Flow
          setCheckoutStep("approval_status");
        }
      }, 4200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(finishTimer);
      };
    }
  }, [checkoutStep]);

  // Simulation effect for payment stage
  useEffect(() => {
    if (checkoutStep === "processing_payment") {
      const timer = setTimeout(() => {
        // Place order in system context
        const orderIdVal = `YS-${Math.floor(100000 + Math.random() * 900000)}`;
        setSimulatedOrderId(orderIdVal);

        // Calculate deductions
        const itemsSub = getApprovedSubtotal();
        const deliveryFee = getApprovedDeliveryFee();
        const vat = itemsSub * 0.15;
        const totalAmount = itemsSub + deliveryFee + vat;

        let walletDeduct = 0;
        if (useWallet) {
          walletDeduct = Math.min(walletBalance, totalAmount);
        }

        let loyaltyDeduct = 0;
        if (useLoyalty) {
          const maxLoyalty = Math.floor(loyaltyPoints / 50);
          loyaltyDeduct = Math.min(maxLoyalty, totalAmount - walletDeduct);
        }

        const redeemedPoints = loyaltyDeduct * 50;

        // Call the app context order placement function
        const placed = createOrder(walletDeduct, redeemedPoints, paymentMethod, deliveryOption);
        setCheckoutPlacedOrders(placed);

        setCheckoutStep("confirmation");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [checkoutStep]);

  // Pricing Helpers
  const getDeliveryFeeForPharmacy = (items) => {
    const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0);
    if (subtotal >= 100) return 0;
    const isCold = items.some(item => item.isColdChain);
    if (deliveryOption === "cold" || isCold) return 25;
    if (deliveryOption === "fast") return 18;
    return 10;
  };

  const getApprovedSubtotal = () => {
    return Object.keys(groupedCart).reduce((sum, key) => {
      // In Scenario A, Whites (ph-3) is rejected
      if (scenario === "partial_success" && key === "ph-3") return sum;
      return sum + groupedCart[key].items.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);
  };

  const getApprovedDeliveryFee = () => {
    return Object.keys(groupedCart).reduce((sum, key) => {
      if (scenario === "partial_success" && key === "ph-3") return sum;
      return sum + getDeliveryFeeForPharmacy(groupedCart[key].items);
    }, 0);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "BABY20") {
      setCouponDiscount(0.20);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "YUSUR10") {
      setCouponDiscount(0.10);
      setCouponApplied(true);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!newStreet) return;
    const tempId = `addr-${Date.now()}`;
    const newAddr = {
      id: tempId,
      tag: newTag,
      tag_ar: newTag === "Home" ? "المنزل" : "العمل",
      street: newStreet,
      street_ar: newStreet,
      city: newCity,
      city_ar: newCity === "Riyadh" ? "الرياض" : "جدة"
    };
    addAddress(newAddr);
    setCurrentAddress(newAddr);
    setAddressModalMode("select");
    setShowAddressModal(false);
    setNewStreet("");
  };

  // Render Check Gating
  if (cart.length === 0 && ["review", "processing_approval", "approval_status"].includes(checkoutStep)) {
    return (
      <div className="empty-state" style={{ marginTop: "40px" }}>
        <span className="empty-icon">🛒</span>
        <h2 className="empty-title">{t.noItems}</h2>
        <button className="btn-primary" onClick={() => router.push("/home")} style={{ width: "auto" }}>
          {t.browseProducts}
        </button>
      </div>
    );
  }

  // Address selection resolver
  const activeAddress = currentAddress || addresses[0];

  return (
    <div style={{ paddingBottom: "50px", position: "relative" }}>
      {/* FLOATING SCENARIO SELECTOR WIDGET */}
      {["review", "processing_approval"].includes(checkoutStep) && (
        <div style={{
          backgroundColor: "rgba(15, 108, 189, 0.08)",
          border: "1.5px dashed var(--primary)",
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: "12.5px"
        }}>
          <strong style={{ color: "var(--primary)" }}>⚙️ {t.scenarioSelector}:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: scenario === "full_success" ? "700" : "400" }}>
              <input
                type="radio"
                name="scenario"
                checked={scenario === "full_success"}
                onChange={() => setScenario("full_success")}
                disabled={checkoutStep !== "review"}
              />
              {t.scenarioC}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: scenario === "partial_success" ? "700" : "400" }}>
              <input
                type="radio"
                name="scenario"
                checked={scenario === "partial_success"}
                onChange={() => setScenario("partial_success")}
                disabled={checkoutStep !== "review"}
              />
              {t.scenarioA}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: scenario === "full_rejection" ? "700" : "400" }}>
              <input
                type="radio"
                name="scenario"
                checked={scenario === "full_rejection"}
                onChange={() => setScenario("full_rejection")}
                disabled={checkoutStep !== "review"}
              />
              {t.scenarioB}
            </label>
          </div>
        </div>
      )}

      {/* STEP 1: REVIEW ITEMS & ADDRESS */}
      {checkoutStep === "review" && (
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "20px" }}>{t.checkout}</h1>
          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Delivery Address block */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-1)" }}>📍 {t.deliveryAddress}</span>
                  <button
                    onClick={() => { setShowAddressModal(true); setAddressModalMode("select"); }}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                  >
                    {t.changeBtn}
                  </button>
                </div>
                {activeAddress ? (
                  <div>
                    <strong style={{ fontSize: "13.5px", display: "block" }}>{language === "ar" ? activeAddress.tag_ar : activeAddress.tag}</strong>
                    <p style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "2px" }}>
                      {language === "ar" ? activeAddress.street_ar : activeAddress.street}, {language === "ar" ? activeAddress.city_ar : activeAddress.city}
                    </p>
                  </div>
                ) : (
                  <button onClick={() => { setShowAddressModal(true); setAddressModalMode("add"); }} className="btn-secondary" style={{ width: "100%" }}>+ {t.addNewAddress}</button>
                )}
              </div>

              {/* Items details breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>📦 {t.reviewTitle} ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
                {Object.keys(groupedCart).map((pharmacyId) => {
                  const grp = groupedCart[pharmacyId];
                  const pharmName = language === "ar" ? grp.name_ar : grp.name_en;
                  const pharmSub = grp.items.reduce((s, i) => s + i.price * i.quantity, 0);
                  const isWhites = pharmacyId === "ph-3";

                  return (
                    <div key={pharmacyId} style={{ border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", backgroundColor: "var(--surface)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>🏥 {pharmName}</span>
                        {isWhites && scenario === "partial_success" && (
                          <span style={{ fontSize: "11px", color: "var(--warning)", fontWeight: "600" }}>
                            ⚠️ {language === "ar" ? "مخزون محدود متوفر" : "Limited stock warning"}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {grp.items.map((item) => (
                          <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <span style={{ fontSize: "20px" }}>{item.image || "📦"}</span>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{language === "ar" ? item.name_ar : item.name_en}</h4>
                              <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{item.price.toFixed(2)} {t.sar}</span>
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: "700" }}>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: "1.5px dashed var(--border)", marginTop: "12px", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700" }}>
                        <span>{language === "ar" ? "المجموع الفرعي للصيدلية:" : "Pharmacy Subtotal:"}</span>
                        <span>{pharmSub.toFixed(2)} {t.sar}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right column details summary */}
            <div className="layout-side-col">
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{t.subtotal}</span>
                    <strong>{cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)} {t.sar}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{t.deliveryFees}</span>
                    <strong>{Object.keys(groupedCart).reduce((sum, id) => sum + getDeliveryFeeForPharmacy(groupedCart[id].items), 0).toFixed(2)} {t.sar}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{t.vat}</span>
                    <strong>{(cart.reduce((s, i) => s + i.price * i.quantity, 0) * 0.15).toFixed(2)} {t.sar}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                    <span>{t.totalPayable}</span>
                    <span>
                      {(
                        cart.reduce((s, i) => s + i.price * i.quantity, 0) +
                        Object.keys(groupedCart).reduce((sum, id) => sum + getDeliveryFeeForPharmacy(groupedCart[id].items), 0) +
                        cart.reduce((s, i) => s + i.price * i.quantity, 0) * 0.15
                      ).toFixed(2)} {t.sar}
                    </span>
                  </div>
                </div>

                {/* SFDA warning */}
                <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
                  <input
                    id="sfda-check"
                    type="checkbox"
                    checked={acceptedSfda}
                    onChange={() => setAcceptedSfda(!acceptedSfda)}
                    style={{ width: "16px", height: "16px", marginTop: "2px", cursor: "pointer" }}
                  />
                  <label htmlFor="sfda-check" style={{ fontSize: "10px", color: "var(--text-2)", lineHeight: "1.4", cursor: "pointer" }}>
                    {t.sfdaCheckbox}
                  </label>
                </div>

                <button
                  className="btn-primary"
                  disabled={!acceptedSfda}
                  onClick={() => setCheckoutStep("processing_approval")}
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  {t.continueBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING APPROVAL DIALOG */}
      {checkoutStep === "processing_approval" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", justifyContent: "center", minHeight: "350px", textAlign: "center", paddingBlock: "30px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", border: "4px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 1s infinite linear" }} />
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 6px 0" }}>{t.processingTitle}</h2>
            <p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0 }}>{t.processingDesc}</p>
          </div>

          <div style={{ width: "100%", maxWidth: "340px", height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden", marginTop: "6px" }}>
            <div style={{ width: `${approvalProgress}%`, height: "100%", backgroundColor: "var(--primary)", transition: "width 0.4s ease" }} />
          </div>

          {/* Real-time checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "360px", textAlign: "start", marginTop: "10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px" }}>
            {Object.keys(groupedCart).map((pharmacyId) => {
              const grp = groupedCart[pharmacyId];
              const name = language === "ar" ? grp.name_ar : grp.name_en;
              const status = pharmacyStatus[pharmacyId] || "pending";

              return (
                <div key={pharmacyId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingVertical: "4px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-1)" }}>🏥 {name}</span>
                  {status === "pending" && (
                    <span style={{ fontSize: "11.5px", color: "var(--warning)", backgroundColor: "rgba(154, 103, 0, 0.08)", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>
                      ⏳ {language === "ar" ? "قيد المراجعة..." : "Reviewing..."}
                    </span>
                  )}
                  {status === "approved" && (
                    <span style={{ fontSize: "11.5px", color: "var(--secondary)", backgroundColor: "rgba(24, 182, 122, 0.08)", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>
                      ✓ {language === "ar" ? "مقبول" : "Approved"}
                    </span>
                  )}
                  {status === "rejected" && (
                    <span style={{ fontSize: "11.5px", color: "var(--error)", backgroundColor: "rgba(207, 34, 46, 0.08)", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>
                      ✕ {language === "ar" ? "مرفوض" : "Rejected"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: ORDER APPROVAL STATUS (SUCCESS/PARTIAL) */}
      {checkoutStep === "approval_status" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>🟢 {t.approvedTitle}</h2>

          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Approved Card list */}
              <div style={{ backgroundColor: "rgba(24, 182, 122, 0.04)", border: "1.5px solid var(--secondary)", borderRadius: "16px", padding: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--secondary)", margin: "0 0 12px 0" }}>
                  ✓ {t.approvedOrders} (
                  {Object.keys(groupedCart).filter(key => !(scenario === "partial_success" && key === "ph-3")).length}
                  )
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {Object.keys(groupedCart).map((pharmacyId) => {
                    const grp = groupedCart[pharmacyId];
                    if (scenario === "partial_success" && pharmacyId === "ph-3") return null;

                    return (
                      <div key={pharmacyId} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px" }}>
                        <strong style={{ fontSize: "13px", color: "var(--text-1)", display: "block", marginBottom: "6px" }}>🏥 {language === "ar" ? grp.name_ar : grp.name_en}</strong>
                        {grp.items.map(item => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", paddingVertical: "2px" }}>
                            <span style={{ color: "var(--text-2)" }}>{language === "ar" ? item.name_ar : item.name_en} x{item.quantity}</span>
                            <strong>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rejected Card list */}
              {scenario === "partial_success" && groupedCart["ph-3"] && (
                <div style={{ backgroundColor: "rgba(207, 34, 46, 0.04)", border: "1.5px solid var(--error)", borderRadius: "16px", padding: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--error)", margin: "0 0 8px 0" }}>
                    ✕ {t.rejectedOrders} (1)
                  </h3>
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px" }}>
                    <strong style={{ fontSize: "13px", color: "var(--text-1)", display: "block", marginBottom: "4px" }}>
                      🏥 {language === "ar" ? groupedCart["ph-3"].name_ar : groupedCart["ph-3"].name_en}
                    </strong>
                    <span style={{ fontSize: "11.5px", color: "var(--error)", fontWeight: "700", display: "block", marginBottom: "8px" }}>
                      ⚠️ {t.reasonLabel}: {t.rejectedOutStock}
                    </span>
                    {groupedCart["ph-3"].items.map(item => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.6 }}>
                        <span>{language === "ar" ? item.name_ar : item.name_en} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} {t.sar}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right CTAs */}
            <div className="layout-side-col">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => setCheckoutStep("payment")} className="btn-primary" style={{ width: "100%" }}>
                  {t.continueToPayment}
                </button>
                <button onClick={() => { setCheckoutStep("review"); router.push("/cart"); }} className="btn-secondary" style={{ width: "100%" }}>
                  {t.cancelOrder}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REJECTION STATUS (ALTERNATIVE FULL REJECTION FLOW) */}
      {checkoutStep === "rejection_status" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center", paddingBlock: "30px", maxWidth: "550px", margin: "0 auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(207, 34, 46, 0.1)", color: "var(--error)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>
            ✕
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-1)", margin: "0 0 6px 0" }}>{t.rejectionTitle}</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-2)", margin: 0 }}>{t.rejectionDesc}</p>
          </div>

          <div style={{ width: "100%", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", textAlign: "start", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "800" }}>{t.reasonLabel}</span>
            {Object.keys(groupedCart).map((pharmacyId) => {
              const name = language === "ar" ? groupedCart[pharmacyId].name_ar : groupedCart[pharmacyId].name_en;
              return (
                <div key={pharmacyId} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px", lastChild: { border: "none" } }}>
                  <strong style={{ fontSize: "13px", display: "block", color: "var(--text-1)" }}>🏥 {name}</strong>
                  <span style={{ fontSize: "12px", color: "var(--error)", fontWeight: "600" }}>
                    • {t.rejectedOutStock}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: "rgba(15, 108, 189, 0.05)", border: "1px solid var(--primary)", borderRadius: "12px", padding: "12px 16px", fontSize: "12px", color: "var(--text-1)", display: "flex", gap: "6px", alignItems: "center" }}>
            <span>ℹ️</span>
            <span>{t.cartUpdatedNotice}</span>
          </div>

          <button onClick={() => { setCheckoutStep("review"); router.push("/home"); }} className="btn-primary" style={{ width: "100%" }}>
            {t.continueShopping}
          </button>
        </div>
      )}

      {/* STEP 5: PAYMENT SCREEN */}
      {checkoutStep === "payment" && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>{t.paymentTitle}</h2>
          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Wallet Benefit */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>💳 {t.useWallet}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{t.walletBalance}: {walletBalance.toFixed(2)} {t.sar}</span>
                </div>
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={() => setUseWallet(!useWallet)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>

              {/* Loyalty points Benefit */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>👑 {t.redeemLoyalty}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{t.loyaltyPoints}: {loyaltyPoints} pts ({(loyaltyPoints / 50).toFixed(2)} {t.sar})</span>
                </div>
                <input
                  type="checkbox"
                  checked={useLoyalty}
                  disabled={loyaltyPoints < 50}
                  onChange={() => setUseLoyalty(!useLoyalty)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>

              {/* Payment Methods */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-1)" }}>💳 Select Payment Option</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { id: "mada", name: "Mada Card / مدى", logo: "💳", color: "#15B064" },
                    { id: "apple", name: "Apple Pay", logo: "🍏", color: "#000000" },
                    { id: "stc", name: "STC Pay", logo: "💜", color: "#4F46E5" },
                    { id: "visa", name: "Credit Card (Visa/Mastercard)", logo: "💳", color: "#0F6CBD" }
                  ].map(method => (
                    <label key={method.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: `1.5px solid ${paymentMethod === method.id ? "var(--primary)" : "var(--border)"}`, borderRadius: "12px", cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "16px" }}>{method.logo}</span>
                        <strong style={{ fontSize: "12.5px" }}>{method.name}</strong>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Billing summary and Place Order */}
            <div className="layout-side-col">
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

                {/* Promo Code Coupon (Now inside Order Summary) */}
                <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "4px" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t.promoCode}
                    value={couponCode}
                    disabled={couponApplied}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", fontSize: "12px" }}
                  />
                  <button type="submit" className="btn-secondary" style={{ width: "auto", paddingInline: "16px", fontSize: "12px" }} disabled={couponApplied}>
                    {t.apply}
                  </button>
                </form>
                {couponApplied && (
                  <div style={{ color: "var(--secondary)", fontSize: "11.5px", fontWeight: "700", marginTop: "-8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>✓ {t.promoApplied}</div>
                )}

                {(() => {
                  const itemsSub = getApprovedSubtotal();
                  const deliveryFee = getApprovedDeliveryFee();
                  const vat = itemsSub * 0.15;
                  const discount = itemsSub * couponDiscount;
                  const totalBeforeDeduct = itemsSub + deliveryFee + vat - discount;

                  let walletDeduct = 0;
                  if (useWallet) {
                    walletDeduct = Math.min(walletBalance, totalBeforeDeduct);
                  }

                  let loyaltyDeduct = 0;
                  if (useLoyalty) {
                    const maxLoyalty = Math.floor(loyaltyPoints / 50);
                    loyaltyDeduct = Math.min(maxLoyalty, totalBeforeDeduct - walletDeduct);
                  }

                  const finalPayable = totalBeforeDeduct - walletDeduct - loyaltyDeduct;

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.subtotal}</span>
                        <strong>{itemsSub.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.deliveryFees}</span>
                        <strong>{deliveryFee.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.vat}</span>
                        <strong>{vat.toFixed(2)} {t.sar}</strong>
                      </div>
                      {discount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)" }}>
                          <span>{t.promoCode} ({couponCode.toUpperCase()})</span>
                          <strong>-{discount.toFixed(2)} {t.sar}</strong>
                        </div>
                      )}
                      {useWallet && walletDeduct > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)", fontWeight: "700" }}>
                          <span>{t.useWallet}</span>
                          <span>-{walletDeduct.toFixed(2)} {t.sar}</span>
                        </div>
                      )}
                      {useLoyalty && loyaltyDeduct > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)", fontWeight: "700" }}>
                          <span>{t.redeemLoyalty}</span>
                          <span>-{loyaltyDeduct.toFixed(2)} {t.sar}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                        <span>{t.totalPayable}</span>
                        <span>{finalPayable.toFixed(2)} {t.sar}</span>
                      </div>

                      <button onClick={() => setCheckoutStep("processing_payment")} className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                        {t.confirmPayment}
                      </button>
                    </div>
                  );
                })()}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: PROCESSING PAYMENT DIALOG */}
      {checkoutStep === "processing_payment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", justifyContent: "center", minHeight: "350px", textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "4px solid var(--border)", borderTopColor: "var(--secondary)", animation: "spin 1s infinite linear" }} />
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800" }}>{t.preparingPayment}</h2>
          </div>
        </div>
      )}

      {/* STEP 7: ORDER CONFIRMATION */}
      {checkoutStep === "confirmation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center", paddingBlock: "30px", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: "rgba(24, 182, 122, 0.1)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "bold" }}>
            ✓
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-1)", margin: "0 0 4px 0" }}>{t.placedSuccess}</h2>
            <span style={{ fontSize: "13px", color: "var(--text-2)", display: "block" }}>{t.orderId}: <strong>{simulatedOrderId}</strong></span>
          </div>

          {/* List of items that were processed */}
          <div style={{ width: "100%", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", textAlign: "start", display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Approved Paid Items */}
            <div>
              <span style={{ fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase", fontWeight: "800", display: "block", marginBottom: "6px" }}>🟢 {t.availableItems}</span>
              {Object.keys(groupedCart).map((pharmacyId) => {
                const grp = groupedCart[pharmacyId];
                if (scenario === "partial_success" && pharmacyId === "ph-3") return null;

                return grp.items.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", paddingVertical: "2px" }}>
                    <span>{language === "ar" ? item.name_ar : item.name_en} x{item.quantity}</span>
                    <strong style={{ color: "var(--text-1)" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                  </div>
                ));
              })}
            </div>

            {/* Rejected Refunded Items */}
            {scenario === "partial_success" && groupedCart["ph-3"] && (
              <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "12px" }}>
                <span style={{ fontSize: "11px", color: "var(--error)", textTransform: "uppercase", fontWeight: "800", display: "block", marginBottom: "6px" }}>🔴 {t.unavailableItems} ({t.refundedToWallet})</span>
                {groupedCart["ph-3"].items.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", paddingVertical: "2px", opacity: 0.65 }}>
                    <span>{language === "ar" ? item.name_ar : item.name_en} x{item.quantity}</span>
                    <strong>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            <button onClick={() => setCheckoutStep("tracking")} className="btn-primary" style={{ width: "100%" }}>
              {t.trackBtn}
            </button>
            <button onClick={() => { setCheckoutStep("review"); router.push("/home"); }} className="btn-secondary" style={{ width: "100%" }}>
              {t.homeBtn}
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: LIVE TRACKING TIMELINE */}
      {checkoutStep === "tracking" && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>🚚 {t.trackingTitle}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {checkoutPlacedOrders.map((ord, oIndex) => {
              const driverName = oIndex % 2 === 0 ? "Fahad Al-Harbi" : "Yousef Al-Malki";
              const driverPhone = oIndex % 2 === 0 ? "+966 50 123 4567" : "+966 55 987 6543";
              const pharmacyName = language === "ar" ? ord.pharmacyName_ar : ord.pharmacyName_en;

              return (
                <div key={ord.id} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "14px" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "var(--primary)" }}>🏥 {pharmacyName}</strong>
                      <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block", marginTop: "2px" }}>{t.shipment} #{ord.id}</span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--secondary)" }}>
                      ⏳ {language === "ar" ? "قيد التوصيل" : "Out for Delivery"}
                    </span>
                  </div>

                  {/* Tracking timeline */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "24px", paddingRight: language === "ar" ? "24px" : "auto", borderLeft: language !== "ar" ? "2px solid var(--border)" : "none", borderRight: language === "ar" ? "2px solid var(--border)" : "none", marginBlock: "10px", marginLeft: language !== "ar" ? "8px" : "auto", marginRight: language === "ar" ? "8px" : "auto" }}>
                    {[
                      { step: "placed", title: t.statusPlaced, done: true, time: "16:45" },
                      { step: "preparing", title: t.statusPreparing, done: true, time: "16:47" },
                      { step: "out", title: t.statusOut, done: true, active: true, time: "16:51" },
                      { step: "delivered", title: t.statusDelivered, done: false, time: "--:--" }
                    ].map((stepItem, sIndex) => (
                      <div key={stepItem.step} style={{ position: "relative" }}>
                        {/* Dot indicator */}
                        <div style={{
                          position: "absolute",
                          left: language !== "ar" ? "-31px" : "auto",
                          right: language === "ar" ? "-31px" : "auto",
                          top: "2px",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: stepItem.active ? "var(--primary)" : stepItem.done ? "var(--secondary)" : "var(--border)",
                          border: stepItem.active ? "3px solid rgba(15,108,189,0.2)" : "none",
                          boxSizing: "content-box"
                        }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                          <span style={{ fontWeight: stepItem.active ? "800" : "600", color: stepItem.active ? "var(--primary)" : "var(--text-1)" }}>
                            {stepItem.title}
                          </span>
                          <span style={{ color: "var(--text-2)" }}>{stepItem.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Driver box info */}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block" }}>👤 {t.driver}</span>
                      <strong style={{ fontSize: "13px" }}>{driverName}</strong>
                    </div>
                    <a href={`tel:${driverPhone}`} style={{
                      backgroundColor: "rgba(15, 108, 189, 0.08)",
                      color: "var(--primary)",
                      textDecoration: "none",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: "700"
                    }}>
                      📞 {driverPhone}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => router.push("/home")} className="btn-primary" style={{ width: "100%", marginTop: "24px" }}>
            {t.homeBtn}
          </button>
        </div>
      )}

      {/* NEW ADDRESS MODAL POPUP (WITH SELECT ADDRESS LISTING & ADD NEW) */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>

            {addressModalMode === "select" ? (
              /* SELECT ADDRESS MODE */
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>{t.selectAddress}</h3>
                  <button className="btn-icon" onClick={() => setShowAddressModal(false)}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto", marginBottom: "16px" }}>
                  {addresses.map((addr) => {
                    const isSelected = activeAddress && activeAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setCurrentAddress(addr);
                          setShowAddressModal(false);
                        }}
                        style={{
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                          backgroundColor: isSelected ? "rgba(15, 108, 189, 0.05)" : "var(--surface)",
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                          <strong style={{ fontSize: "13px", color: "var(--text-1)" }}>
                            {language === "ar" ? addr.tag_ar : addr.tag}
                          </strong>
                          {isSelected && <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "12px" }}>✓</span>}
                        </div>
                        <span style={{ fontSize: "11.5px", color: "var(--text-2)" }}>
                          {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAddressModalMode("add")}
                  style={{ width: "100%" }}
                >
                  + {t.addNewAddress}
                </button>
              </div>
            ) : (
              /* ADD NEW ADDRESS FORM MODE */
              <form onSubmit={handleAddressSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setAddressModalMode("select")}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "var(--primary)",
                        padding: 0
                      }}
                    >
                      {language === "ar" ? "→" : "←"}
                    </button>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}> {t.addNewAddress}</h3>
                  </div>
                  <button className="btn-icon" type="button" onClick={() => setShowAddressModal(false)}>✕</button>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === "ar" ? "نوع العنوان" : "Address Tag"}</label>
                  <select className="form-input" value={newTag} onChange={(e) => setNewTag(e.target.value)}>
                    <option value="Home">Home / المنزل</option>
                    <option value="Work">Work / العمل</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === "ar" ? "المدينة" : "City"}</label>
                  <select className="form-input" value={newCity} onChange={(e) => setNewCity(e.target.value)}>
                    <option value="Riyadh">Riyadh / الرياض</option>
                    <option value="Jeddah">Jeddah / جدة</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === "ar" ? "اسم الشارع وتفاصيل البناء" : "Street & Building Details"}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Al-Malqa, Building 45"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                  ✓ Save Address
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
