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
  const [fulfillmentType, setFulfillmentType] = useState("delivery"); // 'delivery' or 'pickup'
  const [scenario, setScenario] = useState("partial_success"); // 'partial_success', 'full_rejection', 'full_success'

  const handleAcceptSubstitute = (rejectedItem, alternative) => {
    setPurchasedCart((prev) => {
      const filtered = prev.filter(i => !(i.id === rejectedItem.id && i.pharmacyId === "ph-3"));
      const newItem = {
        ...rejectedItem,
        id: alternative.id,
        name_en: alternative.name_en,
        name_ar: alternative.name_ar,
        price: alternative.price,
        pharmacyId: alternative.pharmacyId,
        pharmacyName_en: alternative.pharmacyName_en,
        pharmacyName_ar: alternative.pharmacyName_ar
      };
      return [...filtered, newItem];
    });
  };

  const handleRemoveRejectedItem = (rejectedItem) => {
    setPurchasedCart((prev) =>
      prev.filter(i => !(i.id === rejectedItem.id && i.pharmacyId === "ph-3"))
    );
  };

  // Input states
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("mada"); // visa, apple, tabby, stc, cod, mada
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

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Gating & Verification
  const [acceptedSfda, setAcceptedSfda] = useState(false);

  // Simulated status list
  const [approvalProgress, setApprovalProgress] = useState(0);
  const [countdown, setCountdown] = useState(58);
  const [pharmacyStatus, setPharmacyStatus] = useState({});
  const [simulatedOrderId, setSimulatedOrderId] = useState("");
  const [checkoutPlacedOrders, setCheckoutPlacedOrders] = useState([]);
  const [purchasedCart, setPurchasedCart] = useState([]);
  const [placedSubtotal, setPlacedSubtotal] = useState(0);
  const [placedDeliveryFee, setPlacedDeliveryFee] = useState(0);
  const [placedVat, setPlacedVat] = useState(0);
  const [placedCouponDiscount, setPlacedCouponDiscount] = useState(0);
  const [placedWalletDeduction, setPlacedWalletDeduction] = useState(0);
  const [placedLoyaltyDeduction, setPlacedLoyaltyDeduction] = useState(0);
  const [placedTotalPayable, setPlacedTotalPayable] = useState(0);
  const [placedFinalPaid, setPlacedFinalPaid] = useState(0);

  // Copy cart once checkout is initiated so we have a persistent record after cart is cleared
  useEffect(() => {
    if (cart.length > 0 && purchasedCart.length === 0) {
      setPurchasedCart([...cart]);
    }
  }, [cart]);

  // Dictionary localization
  const translations = {
    en: {
      checkout: "Secure Checkout",
      reviewTitle: "Details of the Items",
      deliveryAddress: "Delivery Address",
      changeBtn: "Change",
      orderSummary: "Order Summary",
      subtotal: "Product price",
      vat: "VAT (15%)",
      deliveryFees: "Delivery fees",
      totalPayable: "Total",
      continueBtn: "Continue to Pharmacy Review",
      backBtn: "Back",
      confirmPayment: "Confirm Payment",
      confirmOrder: "Confirm Order",
      sfdaCheckbox: "I certify that I have read and accepted the SFDA (Saudi Food & Drug Authority) medical use safety warnings for the requested items.",
      processingTitle: "Processing Your Order",
      processingDesc: "Waiting for pharmacy approval...",
      timeRemaining: "Time remaining",
      pharmaciesReviewing: "Pharmacies are reviewing your order. You'll be notified once they respond.",
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
      walletBalance: "Wallet balance",
      useWallet: "Use Wallet Balance",
      loyaltyPoints: "Loyalty Points",
      redeemLoyalty: "Redeem Loyalty Points",
      promoCode: "Promo Code",
      apply: "Apply",
      promoApplied: "Promo Applied Successfully!",
      preparingPayment: "Preparing payment session...",
      placedSuccess: "Order Placed Successfully!",
      orderId: "Order ID",
      availableItems: "Available Items",
      unavailableItems: "Unavailable Items",
      refundedToWallet: "Refunded to Wallet",
      trackBtn: "View order status",
      receiptBtn: "View electronic receipt",
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
      selectAddress: "Choose a delivery address",
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
      rewardsEarned: "Loyalty Points Earned",
      approvedMsg: "Your order has been approved and will be prepared for delivery",
      paymentFromBalance: "Payment from balance",
      electronicReceipt: "Electronic Receipt",
      dateLabel: "Date",
      paymentMethodLabel: "Payment Method",
      paidAmount: "Paid Amount",
      close: "Close",
      additionalDiscount: "Additional discount",
      totalAmount: "Total Amount",
      availableBenefits: "Available Benefits",
      alternativesHeader: "Alternatives Found in Marketplace",
      acceptSub: "Accept Substitute",
      removeContinue: "Remove & Continue",
      pickupOption: "Store Pickup",
      deliveryOption: "Home Delivery",
      pickupTitle: "Pickup Store Location",
      pickupReady: "Ready for pickup in 15 mins (Free)",
      substituteTitle: "For your unavailable item:"
    },
    ar: {
      checkout: "عملية الدفع الآمنة",
      reviewTitle: "تفاصيل المنتجات",
      deliveryAddress: "عنوان التوصيل",
      changeBtn: "تغيير",
      orderSummary: "ملخص الطلب",
      subtotal: "سعر المنتجات",
      vat: "ضريبة القيمة المضافة (١٥٪)",
      deliveryFees: "رسوم التوصيل",
      totalPayable: "الإجمالي الكلي",
      continueBtn: "متابعة لمراجعة الصيدلية",
      backBtn: "رجوع",
      confirmPayment: "تأكيد الدفع",
      confirmOrder: "تأكيد الطلب",
      sfdaCheckbox: "أقر بأنني قد اطلع على تحذيرات وتعليمات الاستخدام المعتمدة من الهيئة العامة للغذاء والدواء للطلب.",
      processingTitle: "جاري معالجة طلبك",
      processingDesc: "بانتظار موافقة الصيدلية...",
      timeRemaining: "الوقت المتبقي",
      pharmaciesReviewing: "تقوم الصيدليات بمراجعة طلبك حالياً. سيتم إخطارك بمجرد ردها.",
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
      availableItems: "المنتجات المتوفرة",
      unavailableItems: "المنتجات غير المتوفرة",
      refundedToWallet: "مسترجعة للمحفظة",
      trackBtn: "عرض حالة الطلب",
      receiptBtn: "عرض الفاتورة الإلكترونية",
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
      selectAddress: "اختر عنوان التوصيل",
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
      rewardsEarned: "نقاط الولاء المكتسبة",
      approvedMsg: "تم قبول طلبك وجاري تجهيزه للتوصيل",
      paymentFromBalance: "دفع من الرصيد",
      electronicReceipt: "الفاتورة الإلكترونية",
      dateLabel: "التاريخ",
      paymentMethodLabel: "طريقة الدفع",
      paidAmount: "المبلغ المدفوع",
      close: "إغلاق",
      additionalDiscount: "خصم إضافي",
      totalAmount: "المبلغ الإجمالي",
      availableBenefits: "المزايا المتاحة",
      alternativesHeader: "البدائل المتاحة في السوق",
      acceptSub: "قبول البديل",
      removeContinue: "إزالة ومتابعة",
      pickupOption: "استلام من الصيدلية",
      deliveryOption: "توصيل للمنزل",
      pickupTitle: "موقع فرع الاستلام",
      pickupReady: "جاهز للاستلام خلال ١٥ دقيقة (مجاني)",
      substituteTitle: "بديل لمنتجك غير المتوفر:"
    }
  };

  const t = language === "ar" ? translations.ar : translations.en;

  const activeItemsList = purchasedCart.length > 0 ? purchasedCart : cart;

  // Group cart items by pharmacy
  const groupedCart = activeItemsList.reduce((acc, item) => {
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
      setCountdown(58);
      const initialStatus = {};
      pharmacyIdsInCart.forEach(id => {
        initialStatus[id] = "pending";
      });
      setPharmacyStatus(initialStatus);

      // Rapid tick-down countdown timer simulation
      const countdownTimer = setInterval(() => {
        setCountdown(prev => (prev > 12 ? prev - 1 : 12));
      }, 70);

      // Simulating real-time pharmacy review stages
      const timer1 = setTimeout(() => {
        setApprovalProgress(45);
        setPharmacyStatus(prev => {
          const next = { ...prev };
          if (pharmacyIdsInCart[0]) next[pharmacyIdsInCart[0]] = "approved";
          return next;
        });
      }, 1000);

      const timer2 = setTimeout(() => {
        setApprovalProgress(75);
        setPharmacyStatus(prev => {
          const next = { ...prev };
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
          pharmacyIdsInCart.forEach((id, index) => {
            if (scenario === "full_success") {
              next[id] = "approved";
            } else if (scenario === "full_rejection") {
              next[id] = "rejected";
            } else if (index > 1 || id === "ph-3") {
              next[id] = "rejected"; // Whites ph-3 is rejected in Scenario A
            } else {
              next[id] = "approved";
            }
          });
          return next;
        });
      }, 3000);

      // Automate transitioning to next step
      const finishTimer = setTimeout(() => {
        clearInterval(countdownTimer);
        if (scenario === "full_rejection") {
          setCheckoutStep("rejection_status");
          setCart([]);
        } else {
          setCheckoutStep("approval_status");
        }
      }, 4200);

      return () => {
        clearInterval(countdownTimer);
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
        // Calculate and freeze wallet and loyalty deductions in state hooks
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

        const finalPaid = totalBeforeDeduct - walletDeduct - loyaltyDeduct;

        setPlacedSubtotal(itemsSub);
        setPlacedDeliveryFee(deliveryFee);
        setPlacedVat(vat);
        setPlacedCouponDiscount(discount);
        setPlacedWalletDeduction(walletDeduct);
        setPlacedLoyaltyDeduction(loyaltyDeduct);
        setPlacedTotalPayable(totalBeforeDeduct);
        setPlacedFinalPaid(finalPaid);

        const orderIdVal = `ORD-${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
        setSimulatedOrderId(orderIdVal);

        const redeemedPoints = loyaltyDeduct * 50;

        // Place order in system context
        const placed = createOrder(walletDeduct, redeemedPoints, paymentMethod, fulfillmentType === "pickup" ? "pickup" : deliveryOption);
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
    return isCold ? 25 : 10;
  };

  const getApprovedSubtotal = () => {
    return Object.keys(groupedCart).reduce((sum, key) => {
      if (scenario === "partial_success" && key === "ph-3") return sum;
      return sum + groupedCart[key].items.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);
  };

  const getApprovedDeliveryFee = () => {
    if (fulfillmentType === "pickup") return 0;
    return Object.keys(groupedCart).reduce((sum, key) => {
      if (scenario === "partial_success" && key === "ph-3") return sum;
      return sum + getDeliveryFeeForPharmacy(groupedCart[key].items);
    }, 0);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "WELCOME20") {
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
    const tempId = `ad-${Date.now()}`;
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

  if (activeItemsList.length === 0 && ["review", "processing_approval", "approval_status"].includes(checkoutStep)) {
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
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

      {/* STEP 1: REVIEW SECURE CHECKOUT */}
      {checkoutStep === "review" && (
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "20px" }}>{t.checkout}</h1>
          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Fulfillment Option Toggle (Flowchart requirement: Pickup vs Delivery) */}
              <div style={{ display: "flex", gap: "10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "6px" }}>
                <button
                  type="button"
                  onClick={() => setFulfillmentType("delivery")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: fulfillmentType === "delivery" ? "var(--primary)" : "transparent",
                    color: fulfillmentType === "delivery" ? "white" : "var(--text-2)",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🚚 {t.deliveryOption}
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType("pickup")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: fulfillmentType === "pickup" ? "var(--primary)" : "transparent",
                    color: fulfillmentType === "pickup" ? "white" : "var(--text-2)",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🏪 {t.pickupOption}
                </button>
              </div>

              {fulfillmentType === "pickup" ? (
                /* Pickup Location Block */
                <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-1)" }}>🏪 {t.pickupTitle}</span>
                  <div style={{ padding: "12px", border: "1.5px solid var(--primary)", borderRadius: "12px", backgroundColor: "rgba(15, 108, 189, 0.04)" }}>
                    <strong style={{ fontSize: "13.5px", display: "block" }}>📍 {language === "ar" ? "فرع حي الياسمين (الرئيسي)" : "Al-Yasmin Branch (Main)"}</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-2)", display: "block", marginTop: "2px" }}>{language === "ar" ? "الرياض، طريق أنس بن مالك" : "Riyadh, Anas Ibn Malik Road"}</span>
                    <span style={{ display: "block", fontSize: "11px", color: "var(--secondary)", fontWeight: "700", marginTop: "6px" }}>
                      ⏱️ {t.pickupReady}
                    </span>
                  </div>
                </div>
              ) : (
                /* Delivery Address Block */
                <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-1)" }}>📍 {t.deliveryAddress}</span>
                    <button
                      type="button"
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
              )}

              {/* Items Detail breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>📦 {t.reviewTitle} ({activeItemsList.reduce((s, i) => s + i.quantity, 0)})</h3>
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

            {/* Right Column Order Summary details */}
            <div className="layout-side-col">
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{t.subtotal}</span>
                    <strong>{activeItemsList.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)} {t.sar}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{t.deliveryFees}</span>
                    <strong>{(fulfillmentType === "pickup" ? 0 : Object.keys(groupedCart).reduce((sum, id) => sum + getDeliveryFeeForPharmacy(groupedCart[id].items), 0)).toFixed(2)} {t.sar}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{t.vat}</span>
                    <strong>{(activeItemsList.reduce((s, i) => s + i.price * i.quantity, 0) * 0.15).toFixed(2)} {t.sar}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                    <span>{t.totalPayable}</span>
                    <span>
                      {(
                        activeItemsList.reduce((s, i) => s + i.price * i.quantity, 0) +
                        (fulfillmentType === "pickup" ? 0 : Object.keys(groupedCart).reduce((sum, id) => sum + getDeliveryFeeForPharmacy(groupedCart[id].items), 0)) +
                        activeItemsList.reduce((s, i) => s + i.price * i.quantity, 0) * 0.15
                      ).toFixed(2)} {t.sar}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => {
                    if (fulfillmentType === "delivery" && !activeAddress) {
                      alert(language === "ar" ? "الرجاء تحديد عنوان التوصيل أولاً" : "Please select a delivery address first");
                      return;
                    }
                    setCheckoutStep("processing_approval");
                  }}
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  {t.continueBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING APPROVAL LOADING DIALOG */}
      {checkoutStep === "processing_approval" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", justifyContent: "center", minHeight: "380px", textAlign: "center", paddingBlock: "30px" }}>
          {/* Orange Circular Loader */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "rgba(249, 115, 22, 0.1)", marginBottom: "8px" }}>
            <div style={{ width: "45px", height: "45px", borderRadius: "50%", border: "4px solid rgba(249, 115, 22, 0.2)", borderTopColor: "#F97316", animation: "spin 1s infinite linear" }} />
          </div>

          <div>
            <h2 style={{ fontSize: "21px", fontWeight: "800", margin: "0 0 6px 0", color: "var(--text-1)" }}>{t.processingTitle}</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-2)", margin: 0 }}>{t.processingDesc}</p>
          </div>

          {/* Time Countdown Meter */}
          <div style={{ width: "100%", maxWidth: "360px", paddingInline: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "700", color: "var(--text-2)", marginBottom: "6px" }}>
              <span>⏱️ {t.timeRemaining}</span>
              <span style={{ color: "var(--text-1)" }}>{countdown}s</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(countdown / 58) * 100}%`, height: "100%", background: "linear-gradient(90deg, #F97316, #EA580C)", transition: "width 0.1s linear" }} />
            </div>
          </div>

          {/* Real-time Pharmacy checklists */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "360px", textAlign: "start", marginTop: "10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "800", display: "block" }}>
              {language === "ar" ? "حالة موافقة الصيدليات" : "Pharmacy Status updates"}
            </span>
            {Object.keys(groupedCart).map((pharmacyId) => {
              const grp = groupedCart[pharmacyId];
              const name = language === "ar" ? grp.name_ar : grp.name_en;
              const status = pharmacyStatus[pharmacyId] || "pending";
              const itemCount = grp.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <div key={pharmacyId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: "4px" }}>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "var(--text-1)", display: "block" }}>🏥 {name}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{itemCount} {itemCount > 1 ? (language === "ar" ? "منتجات" : "Products") : (language === "ar" ? "منتج" : "Product")}</span>
                  </div>
                  {status === "pending" && (
                    <span style={{ fontSize: "11.5px", color: "var(--warning)", backgroundColor: "rgba(245, 158, 11, 0.08)", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--warning)", display: "inline-block" }} />
                      {language === "ar" ? "قيد المراجعة" : "Pending"}
                    </span>
                  )}
                  {status === "approved" && (
                    <span style={{ fontSize: "11.5px", color: "var(--secondary)", backgroundColor: "rgba(24, 182, 122, 0.08)", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--secondary)", display: "inline-block" }} />
                      {language === "ar" ? "مقبول" : "Approve"}
                    </span>
                  )}
                  {status === "rejected" && (
                    <span style={{ fontSize: "11.5px", color: "var(--danger)", backgroundColor: "rgba(225, 29, 72, 0.08)", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--danger)", display: "inline-block" }} />
                      {language === "ar" ? "مرفوض" : "Rejected"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Alert details */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", backgroundColor: "rgba(14, 165, 233, 0.08)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: "12px", padding: "12px 16px", width: "100%", maxWidth: "360px", fontSize: "11.5px", color: "var(--text-1)", textAlign: "start" }}>
            <span style={{ fontSize: "16px" }}>ℹ️</span>
            <span>{t.pharmaciesReviewing}</span>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER APPROVAL STATUS (SUCCESS / PARTIAL) */}
      {checkoutStep === "approval_status" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>{t.approvedTitle}</h2>

          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Approved Cards Container */}
              <div style={{ border: "1.5px solid var(--secondary)", borderRadius: "16px", padding: "16px", backgroundColor: "var(--surface)" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--secondary)", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid var(--secondary)", fontSize: "12px" }}>✓</span>
                  {t.approvedOrders} ({Object.keys(groupedCart).filter(key => !(scenario === "partial_success" && key === "ph-3")).length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {Object.keys(groupedCart).map((pharmacyId) => {
                    const grp = groupedCart[pharmacyId];
                    if (scenario === "partial_success" && pharmacyId === "ph-3") return null;

                    const itemCount = grp.items.reduce((s, i) => s + i.quantity, 0);
                    const deliveryFee = getDeliveryFeeForPharmacy(grp.items);

                    return (
                      <div key={pharmacyId} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <strong style={{ fontSize: "13.5px", color: "var(--text-1)" }}>🏥 {language === "ar" ? grp.name_ar : grp.name_en}</strong>
                          <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{itemCount} {language === "ar" ? "منتجات" : "Products"}</span>
                        </div>
                        <p style={{ fontSize: "11.5px", color: "var(--secondary)", fontWeight: "600", marginBottom: "12px" }}>
                          ✓ {t.approvedMsg}
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                          {grp.items.map(item => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                              <span style={{ color: "var(--text-2)" }}>{language === "ar" ? item.name_ar : item.name_en} × {item.quantity}</span>
                              <strong style={{ color: "#7C3AED" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", borderTop: "1px dashed var(--border)", paddingTop: "6px", marginTop: "2px" }}>
                            <span style={{ color: "var(--text-2)" }}>{t.deliveryFees}</span>
                            <strong style={{ color: "#7C3AED" }}>{deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.sar}`}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rejected Cards Container (In Scenario A) */}
              {scenario === "partial_success" && groupedCart["ph-3"] && (
                <div style={{ border: "1.5px solid var(--danger)", borderRadius: "16px", padding: "16px", backgroundColor: "var(--surface)" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--danger)", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid var(--danger)", fontSize: "12px" }}>✕</span>
                    {t.rejectedOrders} (1)
                  </h3>
                  
                  <div style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "14px" }}>
                    <strong style={{ fontSize: "13.5px", color: "var(--text-1)", display: "block", marginBottom: "4px" }}>
                      🏥 {language === "ar" ? groupedCart["ph-3"].name_ar : groupedCart["ph-3"].name_en}
                    </strong>
                    <p style={{ fontSize: "11.5px", color: "var(--danger)", fontWeight: "700", marginBottom: "12px" }}>
                      ⚠️ {t.reasonLabel}: {t.rejectedOutStock}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                      {groupedCart["ph-3"].items.map(item => {
                        const mockAlternatives = [
                          {
                            id: "pr-6-alt1",
                            name_en: "CeraVe Hydrating Cleanser (Alt. from Al-Dawaa)",
                            name_ar: "سيرافي منظف مرطب (بديل من الدواء)",
                            price: 78.00,
                            pharmacyId: "ph-1",
                            pharmacyName_en: "Al-Dawaa Pharmacy",
                            pharmacyName_ar: "صيدلية الدواء"
                          },
                          {
                            id: "pr-6-alt2",
                            name_en: "Cetaphil Gentle Cleanser (Alt. from Nahdi)",
                            name_ar: "سيتافيل منظف لطيف (بديل من النهدي)",
                            price: 68.00,
                            pharmacyId: "ph-2",
                            pharmacyName_en: "Nahdi Pharmacy",
                            pharmacyName_ar: "صيدلية النهدي"
                          }
                        ];

                        return (
                          <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "8px", borderBottom: "1px dashed var(--border)", paddingBottom: "12px", marginBottom: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", opacity: 0.8 }}>
                              <span style={{ fontWeight: "700" }}>{language === "ar" ? item.name_ar : item.name_en} × {item.quantity}</span>
                              <strong style={{ color: "var(--danger)" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                            </div>

                            {/* Alternatives box container */}
                            <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                              <strong style={{ fontSize: "11px", color: "var(--text-2)", display: "block" }}>🔍 {t.alternativesHeader}:</strong>
                              
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {mockAlternatives.map(alt => (
                                  <div key={alt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", padding: "6px 8px", borderRadius: "6px" }}>
                                    <div>
                                      <span style={{ fontWeight: "600", display: "block", fontSize: "11px" }}>{language === "ar" ? alt.name_ar : alt.name_en}</span>
                                      <span style={{ fontSize: "9px", color: "var(--text-3)" }}>🏥 {language === "ar" ? alt.pharmacyName_ar : alt.pharmacyName_en}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <strong style={{ color: "var(--primary)", fontSize: "11.5px" }}>{alt.price.toFixed(2)} {t.sar}</strong>
                                      <button
                                        type="button"
                                        onClick={() => handleAcceptSubstitute(item, alt)}
                                        style={{
                                          backgroundColor: "var(--secondary)",
                                          color: "white",
                                          border: "none",
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          fontSize: "10px",
                                          fontWeight: "700",
                                          cursor: "pointer"
                                        }}
                                      >
                                        {t.acceptSub}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveRejectedItem(item)}
                                style={{
                                  alignSelf: "flex-end",
                                  background: "none",
                                  border: "none",
                                  color: "var(--danger)",
                                  fontSize: "10.5px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  marginTop: "2px"
                                }}
                              >
                                ✕ {t.removeContinue}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="layout-side-col">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button onClick={() => setCheckoutStep("payment")} className="btn-primary" style={{ width: "100%", paddingVertical: "14px" }}>
                  {t.continueToPayment}
                </button>
                <button onClick={() => { setCheckoutStep("review"); router.push("/cart"); }} className="btn-secondary" style={{ width: "100%", paddingVertical: "14px" }}>
                  {t.cancelOrder}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REJECTION STATUS (ALTERNATIVE FLOW) */}
      {checkoutStep === "rejection_status" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center", paddingBlock: "30px", maxWidth: "550px", margin: "0 auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(225, 29, 72, 0.1)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>
            ✕
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-1)", margin: "0 0 6px 0" }}>{t.rejectionTitle}</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-2)", margin: 0 }}>{t.rejectionDesc}</p>
          </div>

          <div style={{ width: "100%", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", textAlign: "start", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "800" }}>{t.reasonLabel}</span>
            {Object.keys(groupedCart).map((pharmacyId) => {
              const name = language === "ar" ? groupedCart[pharmacyId].name_ar : groupedCart[pharmacyId].name_en;
              return (
                <div key={pharmacyId} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "8px", lastChild: { border: "none" } }}>
                  <strong style={{ fontSize: "13.5px", display: "block", color: "var(--text-1)" }}>🏥 {name}</strong>
                  <span style={{ fontSize: "12px", color: "var(--danger)", fontWeight: "600" }}>
                    • {t.rejectedOutStock}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: "rgba(14, 165, 233, 0.05)", border: "1px solid var(--info)", borderRadius: "12px", padding: "12px 16px", fontSize: "12.5px", color: "var(--text-1)", display: "flex", gap: "8px", alignItems: "center", textAlign: "start" }}>
            <span>ℹ️</span>
            <span>{t.cartUpdatedNotice}</span>
          </div>

          <button onClick={() => { setCheckoutStep("review"); router.push("/home"); }} className="btn-primary" style={{ width: "100%", paddingVertical: "14px" }}>
            {t.continueShopping}
          </button>
        </div>
      )}

      {/* STEP 5: PAYMENT SELECTION & BREAKDOWN */}
      {checkoutStep === "payment" && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>{t.paymentTitle}</h2>
          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Wallet Balance Integration */}
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

              {/* Payment Methods exactly matching Image 2 */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-1)" }}>💳 Select Payment Option</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { id: "visa", name_en: "Visa (**** 4209)", name_ar: "فيزا (**** ٤٢٠٩)", logo: "💳" },
                    { id: "apple", name_en: "Apple Pay", name_ar: "آبل باي", logo: "🍏" },
                    { id: "stc", name_en: "STC Pay", name_ar: "إس تي سي باي", logo: "💜" },
                    { id: "cod", name_en: "Cash payment", name_ar: "الدفع عند الاستلام", logo: "💵" },
                  ].map(method => {
                    const isSelected = paymentMethod === method.id;
                    const name = language === "ar" ? method.name_ar : method.name_en;

                    return (
                      <label
                        key={method.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                          borderRadius: "12px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "rgba(15, 108, 189, 0.03)" : "var(--surface)",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }}>{method.logo}</span>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <strong style={{ fontSize: "13px", color: "var(--text-1)" }}>{name}</strong>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column billing order summary */}
            <div className="layout-side-col">
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

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
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.subtotal}</span>
                        <strong>{itemsSub.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.deliveryFees}</span>
                        <strong>{deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.vat}</span>
                        <strong>{vat.toFixed(2)} {t.sar}</strong>
                      </div>

                      {/* Line Separator */}
                      <div style={{ borderTop: "1.5px solid var(--border)", marginTop: "4px", marginBottom: "4px" }} />

                      {/* Total Amount Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15.5px", fontWeight: "800", color: "var(--text-1)" }}>
                        <span>{t.totalAmount}</span>
                        <span>{totalBeforeDeduct.toFixed(2)} {t.sar}</span>
                      </div>

                      {/* Line Separator */}
                      <div style={{ borderTop: "1.5px solid var(--border)", marginTop: "4px", marginBottom: "4px" }} />

                      {/* Promo Code Form */}
                      <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", marginTop: "4px", marginBottom: "4px" }}>
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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(24, 182, 122, 0.08)", padding: "8px 10px", borderRadius: "8px", fontSize: "12px", color: "var(--secondary)", fontWeight: "700", marginTop: "-6px" }}>
                          <span>✓ {t.promoApplied}</span>
                          <button
                            type="button"
                            onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCouponCode(""); }}
                            style={{ border: "none", background: "none", color: "var(--danger)", cursor: "pointer", fontWeight: "700" }}
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {/* Line Separator */}
                      <div style={{ borderTop: "1.5px solid var(--border)", marginTop: "4px", marginBottom: "4px" }} />

                      {/* AVAILABLE BENEFITS */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "2px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-2)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {t.availableBenefits}
                        </span>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>💳 {language === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</span>
                          <strong style={{ color: "var(--primary)" }}>{walletBalance.toFixed(2)} {t.sar}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>👑 {language === "ar" ? "نقاط الولاء" : "Loyalty Points"}</span>
                          <strong style={{ color: "#f59e0b" }}>{loyaltyPoints} pts ({(loyaltyPoints / 50).toFixed(2)} {t.sar})</strong>
                        </div>
                      </div>

                      {/* Deductions applied list */}
                      {(walletDeduct > 0 || loyaltyDeduct > 0 || discount > 0) && (
                        <>
                          <div style={{ borderTop: "1.5px dashed var(--border)", marginTop: "4px", marginBottom: "4px" }} />
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {discount > 0 && (
                              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)", fontWeight: "700" }}>
                                <span>{t.additionalDiscount}</span>
                                <span>-{discount.toFixed(2)} {t.sar}</span>
                              </div>
                            )}
                            {useWallet && walletDeduct > 0 && (
                              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)", fontWeight: "700" }}>
                                <span>{t.paymentFromBalance}</span>
                                <span>-{walletDeduct.toFixed(2)} {t.sar}</span>
                              </div>
                            )}
                            {useLoyalty && loyaltyDeduct > 0 && (
                              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)", fontWeight: "700" }}>
                                <span>{t.redeemLoyalty}</span>
                                <span>-{loyaltyDeduct.toFixed(2)} {t.sar}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Final Net Amount Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                        <span>{t.paidAmount}</span>
                        <span style={{ color: "#7C3AED" }}>{finalPayable.toFixed(2)} {t.sar}</span>
                      </div>

                      <button onClick={() => setCheckoutStep("processing_payment")} className="btn-primary" style={{ width: "100%", marginTop: "10px", paddingVertical: "14px" }}>
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

      {/* STEP 7: ORDER CONFIRMATION SCREEN (MATCHING IMAGE 1) */}
      {checkoutStep === "confirmation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center", paddingBlock: "30px", maxWidth: "480px", margin: "0 auto" }}>
          {/* Orange Shopping Bag Icon */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "rgba(249, 115, 22, 0.1)", marginBottom: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#F97316", color: "white", fontSize: "32px" }}>
              👜
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-1)", margin: "0 0 4px 0" }}>{t.placedSuccess}</h2>
            <span style={{ fontSize: "13px", color: "var(--text-2)", display: "block" }}>{t.orderId}: <strong>{simulatedOrderId}</strong></span>
          </div>

          {/* High fidelity items breakdown card */}
          <div style={{ width: "100%", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "16px", textAlign: "start", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "var(--shadow-sm)" }}>

            {/* Available Items */}
            <div>
              <span style={{ fontSize: "12px", color: "var(--secondary)", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", border: "1.5px solid var(--secondary)", fontSize: "10px" }}>✓</span>
                {t.availableItems}
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.keys(groupedCart).map((pharmacyId) => {
                  const grp = groupedCart[pharmacyId];
                  if (scenario === "partial_success" && pharmacyId === "ph-3") return null;

                  return grp.items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(24, 182, 122, 0.05)", padding: "10px 12px", borderRadius: "10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-1)" }}>{language === "ar" ? item.name_ar : item.name_en}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-2)" }}>Qty: {item.quantity}</span>
                      </div>
                      <strong style={{ color: "#7C3AED", fontSize: "13px" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                    </div>
                  ));
                })}
              </div>
            </div>

            {/* Unavailable Items (In Scenario A) */}
            {scenario === "partial_success" && groupedCart["ph-3"] && (
              <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "14px" }}>
                <span style={{ fontSize: "12px", color: "var(--danger)", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", border: "1.5px solid var(--danger)", fontSize: "10px" }}>✕</span>
                  {t.unavailableItems} <span style={{ fontSize: "10.5px", fontWeight: "500", color: "var(--text-2)" }}>({t.refundedToWallet})</span>
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {groupedCart["ph-3"].items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(225, 29, 72, 0.05)", padding: "10px 12px", borderRadius: "10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-1)" }}>{language === "ar" ? item.name_ar : item.name_en}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-2)" }}>Qty: {item.quantity}</span>
                      </div>
                      <strong style={{ color: "var(--danger)", fontSize: "13px" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid var(--border)", paddingTop: "12px", fontSize: "15px", fontWeight: "800" }}>
              <span>{t.totalPayable}</span>
              <span style={{ color: "#7C3AED" }}>{placedTotalPayable.toFixed(2)} {t.sar}</span>
            </div>

          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            <button onClick={() => setCheckoutStep("tracking")} className="btn-primary" style={{ width: "100%", paddingVertical: "14px", backgroundColor: "#6355a4", border: "none" }}>
              {t.trackBtn}
            </button>
            <button onClick={() => setShowReceiptModal(true)} className="btn-secondary" style={{ width: "100%", paddingVertical: "14px" }}>
              {t.receiptBtn}
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: SHIPMENT TRACKING TIMELINE */}
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
                      ⏳ {language === "ar" ? "خارج للتوصيل" : "Out for Delivery"}
                    </span>
                  </div>

                  {/* Milestones timeline */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "24px", paddingRight: language === "ar" ? "24px" : "auto", borderLeft: language !== "ar" ? "2px solid var(--border)" : "none", borderRight: language === "ar" ? "2px solid var(--border)" : "none", marginBlock: "10px", marginLeft: language !== "ar" ? "8px" : "auto", marginRight: language === "ar" ? "8px" : "auto" }}>
                    {[
                      { step: "placed", title: t.statusPlaced, done: true, time: "16:45" },
                      { step: "preparing", title: t.statusPreparing, done: true, time: "16:47" },
                      { step: "out", title: t.statusOut, done: true, active: true, time: "16:51" },
                      { step: "delivered", title: t.statusDelivered, done: false, time: "--:--" }
                    ].map((stepItem, sIndex) => (
                      <div key={stepItem.step} style={{ position: "relative" }}>
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

                  {/* Driver box details */}
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

          <button onClick={() => { setCheckoutStep("review"); router.push("/home"); }} className="btn-primary" style={{ width: "100%", marginTop: "24px", paddingVertical: "14px" }}>
            {t.homeBtn}
          </button>
        </div>
      )}

      {/* CHOOSE A DELIVERY ADDRESS MODAL (MATCHING IMAGE 4) */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px", borderRadius: "24px" }}>

            {addressModalMode === "select" ? (
              /* SELECT ADDRESS MODE */
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>{t.selectAddress}</h3>
                  <button className="btn-icon" onClick={() => setShowAddressModal(false)} style={{ fontSize: "16px" }}>✕</button>
                </div>

                {/* Add new title button */}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAddressModalMode("add")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", paddingVertical: "12px", marginBottom: "16px", border: "1.5px solid var(--border)", color: "var(--text-1)", backgroundColor: "white", borderRadius: "16px" }}
                >
                  <span style={{ fontSize: "16px" }}>➕</span> {t.addNewAddress}
                </button>

                {/* Address Selection List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "280px", overflowY: "auto", marginBottom: "20px", paddingInline: "2px" }}>
                  {addresses.map((addr) => {
                    const isSelected = activeAddress && activeAddress.id === addr.id;
                    const isHome = addr.tag === "Home";
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setCurrentAddress(addr)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px",
                          borderRadius: "16px",
                          border: `1.5px solid ${isSelected ? "rgba(249, 115, 22, 0.5)" : "var(--border)"}`,
                          backgroundColor: "var(--surface)",
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        {/* Radio Checkmark on Left */}
                        <div style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? "#F97316" : "var(--border)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {isSelected && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#F97316" }} />}
                        </div>

                        {/* Location Details with Home/Work icon */}
                        <div style={{ flex: 1, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "18px", marginTop: "2px" }}>{isHome ? "🏠" : "💼"}</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong style={{ fontSize: "13.5px", color: "var(--text-1)" }}>
                                {language === "ar" ? addr.tag_ar : addr.tag.toLowerCase()}
                              </strong>
                              {isHome && (
                                <span style={{ fontSize: "10px", color: "#0066cc", backgroundColor: "#e6f2ff", padding: "2px 6px", borderRadius: "8px", fontWeight: "700" }}>
                                  Main
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "11.5px", color: "var(--text-2)", lineHeight: "1.4" }}>
                              {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setShowAddressModal(false)}
                    style={{ width: "100%", paddingVertical: "14px", backgroundColor: "#6355a4", border: "none" }}
                  >
                    {t.select}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddressModal(false)}
                    style={{ width: "100%", paddingVertical: "14px", border: "1px solid var(--border)", color: "var(--text-2)" }}
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              /* ADD NEW ADDRESS FORM MODE */
              <form onSubmit={handleAddressSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
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
                    placeholder="e.g. Olaya St, Building 25"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px", paddingVertical: "14px" }}>
                  ✓ Save Address
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ELECTRONIC RECEIPT MODAL SHEET */}
      {showReceiptModal && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px", padding: "24px", borderRadius: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>🧾 {t.electronicReceipt}</h3>
              <button className="btn-icon" onClick={() => setShowReceiptModal(false)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Receipt details */}
              <div style={{ fontSize: "12px", color: "var(--text-2)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>{t.orderId}: <strong style={{ color: "var(--text-1)" }}>{simulatedOrderId}</strong></div>
                <div>{t.dateLabel}: <strong style={{ color: "var(--text-1)" }}>{new Date().toISOString().split("T")[0]}</strong></div>
                <div>{t.paymentMethodLabel}: <strong style={{ color: "var(--text-1)" }}>{paymentMethod.toUpperCase()}</strong></div>
                <div>{t.deliveryAddress}: <strong style={{ color: "var(--text-1)" }}>{activeAddress ? `${activeAddress.street}, ${activeAddress.city}` : ""}</strong></div>
              </div>

              {/* Items Table list */}
              <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginTop: "6px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg)", borderBottom: "1.5px solid var(--border)" }}>
                      <th style={{ padding: "10px", textAlign: "start" }}>Item</th>
                      <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
                      <th style={{ padding: "10px", textAlign: "end" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(groupedCart).map((pharmacyId) => {
                      const grp = groupedCart[pharmacyId];
                      if (scenario === "partial_success" && pharmacyId === "ph-3") return null;

                      return grp.items.map(item => (
                        <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "10px", color: "var(--text-1)" }}>
                            {language === "ar" ? item.name_ar : item.name_en}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center", color: "var(--text-2)" }}>{item.quantity}</td>
                          <td style={{ padding: "10px", textAlign: "end", fontWeight: "700" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>

              {/* Calculations receipt card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", backgroundColor: "var(--bg)", padding: "12px", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t.subtotal}</span>
                  <strong>{placedSubtotal.toFixed(2)} {t.sar}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t.deliveryFees}</span>
                  <strong>{placedDeliveryFee === 0 ? t.free : `${placedDeliveryFee.toFixed(2)} ${t.sar}`}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t.vat}</span>
                  <strong>{placedVat.toFixed(2)} {t.sar}</strong>
                </div>
                {placedCouponDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)" }}>
                    <span>{t.additionalDiscount}</span>
                    <strong>-{placedCouponDiscount.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                {placedWalletDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)" }}>
                    <span>{t.paymentFromBalance}</span>
                    <strong>-{placedWalletDeduction.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                {placedLoyaltyDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)" }}>
                    <span>{t.redeemLoyalty}</span>
                    <strong>-{placedLoyaltyDeduction.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "800", borderTop: "1.5px dashed var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                  <span>{t.paidAmount}</span>
                  <span>{placedFinalPaid.toFixed(2)} {t.sar}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowReceiptModal(false)}
                style={{ width: "100%", paddingVertical: "12px", marginTop: "6px" }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
