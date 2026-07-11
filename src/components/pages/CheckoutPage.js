"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PharmacyHeader from "@/components/PharmacyHeader";
import { mockPharmacies } from "@/mock/data";

// Detailed Scenarios Configuration
const SCENARIOS = {
  scenario_1: {
    name_en: "Scenario 1: Full Approval (All items approved)",
    name_ar: "السيناريو ١: قبول كلي (جميع المنتجات مقبولة)",
    items: [
      {
        id: "pr-1",
        name_en: "Panadol Extra Soluble (Pain Relief)",
        name_ar: "بنادول إكسترا فوار (مسكن للألم)",
        price: 12.50,
        image: "🔴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-1",
        pharmacyName_en: "Al-Dawaa Pharmacy",
        pharmacyName_ar: "صيدلية الدواء",
        quantity: 2,
        allocation: 2
      },
      {
        id: "pr-2",
        name_en: "Solgar Vitamin D3 1000 IU (90 Caps)",
        name_ar: "سولجار فيتامين د٣ ١٠٠٠ وحدة دولية (٩٠ كبسولة)",
        price: 65.00,
        image: "💛",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-1",
        pharmacyName_en: "Al-Dawaa Pharmacy",
        pharmacyName_ar: "صيدلية الدواء",
        quantity: 1,
        allocation: 1
      }
    ]
  },
  scenario_2: {
    name_en: "Scenario 2: Partial Rejection (Some approved, some rejected)",
    name_ar: "السيناريو ٢: رفض جزئي (قبول البعض ورفض الآخر)",
    items: [
      {
        id: "pr-1",
        name_en: "Panadol Extra Soluble (Pain Relief)",
        name_ar: "بنادول إكسترا فوار (مسكن للألم)",
        price: 12.50,
        image: "🔴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-1",
        pharmacyName_en: "Al-Dawaa Pharmacy",
        pharmacyName_ar: "صيدلية الدواء",
        quantity: 2,
        allocation: 2
      },
      {
        id: "pr-6",
        name_en: "CeraVe Hydrating Cleanser (236ml)",
        name_ar: "سيرافي غسول مرطب للوجه (٢٣٦ مل)",
        price: 78.00,
        image: "🧴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-3",
        pharmacyName_en: "Whites Pharmacy",
        pharmacyName_ar: "صيدلية وايتس",
        quantity: 1,
        allocation: "*" // Fully Rejected, no replacements
      }
    ]
  },
  scenario_3: {
    name_en: "Scenario 3: Partial Allocation (Requested 10, approved 4)",
    name_ar: "السيناريو ٣: تخصيص جزئي للكمية (طلب ١٠، مقبول ٤)",
    items: [
      {
        id: "pr-4",
        name_en: "Baby Milk Similac Gold 1 (400g)",
        name_ar: "حليب أطفال سيميلاك جولد ١ (٤٠٠ جم)",
        price: 85.00,
        image: "🍼",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-2",
        pharmacyName_en: "Nahdi Pharmacy",
        pharmacyName_ar: "صيدلية النهدي",
        quantity: 10,
        allocation: 4 // Partial Allocation, no replacements
      }
    ]
  },
  scenario_4: {
    name_en: "Scenario 4: Rejected with Replacements",
    name_ar: "السيناريو ٤: مرفوض مع وجود بدائل معروضة",
    items: [
      {
        id: "pr-6",
        name_en: "CeraVe Hydrating Cleanser (236ml)",
        name_ar: "سيرافي غسول مرطب للوجه (٢٣٦ مل)",
        price: 78.00,
        image: "🧴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-3",
        pharmacyName_en: "Whites Pharmacy",
        pharmacyName_ar: "صيدلية وايتس",
        quantity: 1,
        allocation: "0", // Rejected
        replacements: [
          {
            id: "pr-6-alt1",
            name_en: "CeraVe Hydrating Cleanser (Alt. from Al-Dawaa)",
            name_ar: "سيرافي غسول مرطب (بديل من الدواء)",
            price: 78.00,
            image: "🧴",
            pharmacyId: "ph-1",
            pharmacyName_en: "Al-Dawaa Pharmacy",
            pharmacyName_ar: "صيدلية الدواء"
          },
          {
            id: "pr-6-alt2",
            name_en: "Cetaphil Gentle Cleanser (Alt. from Nahdi)",
            name_ar: "سيتافيل منظف لطيف (بديل من النهدي)",
            price: 68.00,
            image: "🧴",
            pharmacyId: "ph-2",
            pharmacyName_en: "Nahdi Pharmacy",
            pharmacyName_ar: "صيدلية النهدي"
          }
        ]
      }
    ]
  },
  scenario_5: {
    name_en: "Scenario 5: Partial Allocation with Replacements",
    name_ar: "السيناريو ٥: تخصيص جزئي مع بدائل للكمية المتبقية",
    items: [
      {
        id: "pr-5",
        name_en: "Lantus SoloStar Insulin Pen",
        name_ar: "قلم أنسولين لانتوس سولوشتار",
        price: 185.00,
        image: "💉",
        isRx: true,
        isColdChain: true,
        pharmacyId: "ph-1",
        pharmacyName_en: "Al-Dawaa Pharmacy",
        pharmacyName_ar: "صيدلية الدواء",
        quantity: 5,
        allocation: 2, // Approved: 2, Replaced: 3
        replacements: [
          {
            id: "pr-5-alt1",
            name_en: "Basaglar KwikPen Insulin (Alt. from Nahdi)",
            name_ar: "أنسولين باساجلار كويك بن (بديل من النهدي)",
            price: 175.00,
            image: "💉",
            isRx: true,
            isColdChain: true,
            pharmacyId: "ph-2",
            pharmacyName_en: "Nahdi Pharmacy",
            pharmacyName_ar: "صيدلية النهدي"
          }
        ]
      }
    ]
  },
  scenario_6: {
    name_en: "Scenario 6: Reject All Replacements",
    name_ar: "السيناريو ٦: رفض جميع البدائل المعروضة",
    items: [
      {
        id: "pr-6",
        name_en: "CeraVe Hydrating Cleanser (236ml)",
        name_ar: "سيرافي غسول مرطب للوجه (٢٣٦ مل)",
        price: 78.00,
        image: "🧴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-3",
        pharmacyName_en: "Whites Pharmacy",
        pharmacyName_ar: "صيدلية وايتس",
        quantity: 1,
        allocation: "*",
        replacements: [
          {
            id: "pr-6-alt1",
            name_en: "CeraVe Hydrating Cleanser (Alt. from Al-Dawaa)",
            name_ar: "سيرافي غسول مرطب (بديل من الدواء)",
            price: 78.00,
            image: "🧴",
            pharmacyId: "ph-1",
            pharmacyName_en: "Al-Dawaa Pharmacy",
            pharmacyName_ar: "صيدلية الدواء"
          }
        ]
      }
    ]
  },
  scenario_7: {
    name_en: "Scenario 7: Entire Order Rejected",
    name_ar: "السيناريو ٧: رفض كامل الطلب من الصيدليات",
    items: [
      {
        id: "pr-6",
        name_en: "CeraVe Hydrating Cleanser (236ml)",
        name_ar: "سيرافي غسول مرطب للوجه (٢٣٦ مل)",
        price: 78.00,
        image: "🧴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-3",
        pharmacyName_en: "Whites Pharmacy",
        pharmacyName_ar: "صيدلية وايتس",
        quantity: 2,
        allocation: "*"
      },
      {
        id: "pr-9",
        name_en: "GNC Triple Strength Fish Oil (90 Softgels)",
        name_ar: "جي إن سي زيت السمك ثلاثي القوة (٩٠ كبسولة)",
        price: 145.00,
        image: "🐟",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-4",
        pharmacyName_en: "Al-Safaa Pharmacy",
        pharmacyName_ar: "صيدلية الصفا",
        quantity: 1,
        allocation: "0"
      }
    ]
  },
  scenario_8: {
    name_en: "Scenario 8: Mixed Order (All Cases Combined)",
    name_ar: "السيناريو ٨: طلب مختلط (يحتوي على كافة الحالات)",
    items: [
      {
        id: "pr-1",
        name_en: "Panadol Extra Soluble (Pain Relief)",
        name_ar: "بنادول إكسترا فوار (مسكن للألم)",
        price: 12.50,
        image: "🔴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-1",
        pharmacyName_en: "Al-Dawaa Pharmacy",
        pharmacyName_ar: "صيدلية الدواء",
        quantity: 3,
        allocation: 3 // Approved
      },
      {
        id: "pr-4",
        name_en: "Baby Milk Similac Gold 1 (400g)",
        name_ar: "حليب أطفال سيميلاك جولد ١ (٤٠٠ جم)",
        price: 85.00,
        image: "🍼",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-2",
        pharmacyName_en: "Nahdi Pharmacy",
        pharmacyName_ar: "صيدلية النهدي",
        quantity: 10,
        allocation: 4 // Partial Allocation
      },
      {
        id: "pr-6",
        name_en: "CeraVe Hydrating Cleanser (236ml)",
        name_ar: "سيرافي غسول مرطب للوجه (٢٣٦ مل)",
        price: 78.00,
        image: "🧴",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-3",
        pharmacyName_en: "Whites Pharmacy",
        pharmacyName_ar: "صيدلية وايتس",
        quantity: 1,
        allocation: "*", // Rejected with replacements
        replacements: [
          {
            id: "pr-6-alt1",
            name_en: "CeraVe Hydrating Cleanser (Alt. from Al-Dawaa)",
            name_ar: "سيرافي غسول مرطب (بديل من الدواء)",
            price: 78.00,
            image: "🧴",
            pharmacyId: "ph-1",
            pharmacyName_en: "Al-Dawaa Pharmacy",
            pharmacyName_ar: "صيدلية الدواء"
          }
        ]
      },
      {
        id: "pr-5",
        name_en: "Lantus SoloStar Insulin Pen",
        name_ar: "قلم أنسولين لانتوس سولوشتار",
        price: 185.00,
        image: "💉",
        isRx: true,
        isColdChain: true,
        pharmacyId: "ph-1",
        pharmacyName_en: "Al-Dawaa Pharmacy",
        pharmacyName_ar: "صيدلية الدواء",
        quantity: 5,
        allocation: 2, // Partial with replacements
        replacements: [
          {
            id: "pr-5-alt1",
            name_en: "Basaglar KwikPen Insulin (Alt. from Nahdi)",
            name_ar: "أنسولين باساجلار كويك بن (بديل من النهدي)",
            price: 175.00,
            image: "💉",
            isRx: true,
            isColdChain: true,
            pharmacyId: "ph-2",
            pharmacyName_en: "Nahdi Pharmacy",
            pharmacyName_ar: "صيدلية النهدي"
          }
        ]
      },
      {
        id: "pr-9",
        name_en: "GNC Triple Strength Fish Oil (90 Softgels)",
        name_ar: "جي إن سي زيت السمك ثلاثي القوة (٩٠ كبسولة)",
        price: 145.00,
        image: "🐟",
        isRx: false,
        isColdChain: false,
        pharmacyId: "ph-4",
        pharmacyName_en: "Al-Safaa Pharmacy",
        pharmacyName_ar: "صيدلية الصفا",
        quantity: 1,
        allocation: "0" // Rejected
      }
    ]
  }
};

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
    createOrder,
    selectedPharmacyIds,
    activeCheckout,
    setActiveCheckout,
    submitCheckout,
    cancelCheckout,
    updateCheckoutItem,
    updateCheckoutState
  } = useApp();

  const router = useRouter();

  // Review stage local states (before submission)
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [selectedScenario, setSelectedScenario] = useState("scenario_1");
  const [acceptedSfda, setAcceptedSfda] = useState(false);

  // Address Modal States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState("select");
  const [newTag, setNewTag] = useState("Home");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Riyadh");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("mada");
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleCancelCheckout = () => {
    cancelCheckout();
    router.push("/cart");
  };

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
      continueBtn: "Submit Checkout for Review",
      backBtn: "Back",
      confirmPayment: "Confirm Payment",
      confirmOrder: "Confirm Order",
      sfdaCheckbox: "I certify that I have read and accepted the SFDA safety warnings for the requested items.",
      processingTitle: "Processing Pharmacy Review",
      processingDesc: "Each order line is reviewed independently...",
      timeRemaining: "Review progress",
      approvedTitle: "Pharmacy Order Approval Status",
      approvedOrders: "Approved Items",
      rejectedOrders: "Rejected Items",
      continueToPayment: "Continue to Payment",
      cancelCheckoutBtn: "Cancel Checkout",
      rejectionTitle: "Order Rejected",
      rejectionDesc: "Unfortunately, all pharmacies have rejected the requested quantities.",
      reasonLabel: "Rejection Reason",
      cartUpdatedNotice: "Your cart has been restored, and rejected items are removed.",
      continueShopping: "Continue Shopping",
      paymentTitle: "Payment Method",
      walletBalance: "Wallet balance",
      useWallet: "Use Wallet Balance",
      loyaltyPoints: "Loyalty Points",
      redeemLoyalty: "Redeem Loyalty Points",
      promoCode: "Promo Code",
      apply: "Apply",
      promoApplied: "Promo Applied Successfully!",
      preparingPayment: "Preparing secure payment session...",
      placedSuccess: "Order Placed Successfully!",
      orderId: "Order ID",
      availableItems: "Available Items",
      unavailableItems: "Unavailable Items",
      refundedToWallet: "Refunded to Wallet",
      trackBtn: "Track Order Status",
      receiptBtn: "View Electronic Receipt",
      homeBtn: "Back to Home",
      trackingTitle: "Track Your Order",
      driver: "Driver",
      shipment: "Shipment",
      statusPlaced: "Order Placed",
      statusPreparing: "Preparing Order",
      statusOut: "Out for Delivery",
      statusDelivered: "Delivered",
      scenarioSelector: "Simulation Scenario Selector (Evaluation Toggle)",
      scenario1: "Scenario 1: Full Approval (All items approved)",
      scenario2: "Scenario 2: Partial Rejection (Some approved, some rejected)",
      scenario3: "Scenario 3: Partial Allocation (Requested 10, approved 4)",
      scenario4: "Scenario 4: Rejected with Replacements (Choose alternative)",
      scenario5: "Scenario 5: Partial Allocation with Replacements",
      scenario6: "Scenario 6: Reject All Replacements (Ignore alternatives)",
      scenario7: "Scenario 7: Entire Order Rejected (All items rejected)",
      scenario8: "Scenario 8: Mixed Order (Combination of all cases)",
      actualCart: "Use my current shopping cart items (Mocked Custom Outcome)",
      selectAddress: "Choose a delivery address",
      addNewAddress: "Add a new address",
      select: "Select",
      cancel: "Cancel",
      sar: "SAR",
      eta: "Delivery ETA:",
      free: "Free",
      noItems: "No items for checkout",
      browseProducts: "Browse Health Catalog",
      rejectedOutStock: "Item is out of stock in this branch",
      walletTxTitle: "Deduction for Order",
      rewardsEarned: "Loyalty Points Earned",
      approvedMsg: "Item has been approved by the pharmacist",
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
      removeContinue: "Remove Item",
      pickupOption: "Store Pickup",
      deliveryOption: "Home Delivery",
      pickupTitle: "Pickup Store Location",
      pickupReady: "Ready for pickup in 15 mins (Free)",
      substituteTitle: "For your unavailable item:",
      statusPending: "Pending Review",
      statusApproved: "Fully Approved",
      statusPartial: "Partially Approved",
      statusRejected: "Rejected",
      actionAcceptPartial: "Accept Partial Quantity",
      actionSelectReplacement: "Select Replacement Option",
      actionIgnoreReplacements: "Ignore Alternatives",
      resolvedMsg: "Resolved",
      originalItem: "Original Requested Item",
      alternativeSelected: "Alternative Selected",
      resolvedLabel: "Status",
      acceptApprovedOnly: "Accept Approved Only",
      selectAltForRemaining: "Select Alternative for Remaining",
      pendingReviewTitle: "Pharmacy Review in Progress",
      itemsReviewedCount: "items reviewed",
      noPayableItems: "No payable items remain in this order.",
      returnToCartBtn: "Return to Cart & Start Over"
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
      continueBtn: "تقديم الطلب لمراجعة الصيدلية",
      backBtn: "رجوع",
      confirmPayment: "تأكيد الدفع",
      confirmOrder: "تأكيد الطلب",
      sfdaCheckbox: "أقر بأنني قد اطلعت على تحذيرات وتعليمات الاستخدام المعتمدة من الهيئة العامة للغذاء والدواء للطلب.",
      processingTitle: "جاري معالجة مراجعة الصيدلية",
      processingDesc: "يتم مراجعة كل منتج بشكل مستقل من قبل الصيدلي...",
      timeRemaining: "تقدم المراجعة",
      approvedTitle: "حالة موافقة الصيدليات على الطلب",
      approvedOrders: "المنتجات المقبولة",
      rejectedOrders: "المنتجات المرفوضة",
      continueToPayment: "المتابعة للدفع",
      cancelCheckoutBtn: "إلغاء عملية الشراء",
      rejectionTitle: "تم رفض الطلب",
      rejectionDesc: "للأسف، تم رفض الكميات المطلوبة بالكامل من قبل الصيدليات.",
      reasonLabel: "سبب الرفض",
      cartUpdatedNotice: "تمت استعادة سلتك وإزالة المنتجات المرفوضة تلقائياً.",
      continueShopping: "مواصلة التسوق",
      paymentTitle: "طريقة الدفع",
      walletBalance: "رصيد المحفظة",
      useWallet: "استخدام رصيد المحفظة",
      loyaltyPoints: "نقاط الولاء",
      redeemLoyalty: "استبدال نقاط الولاء",
      promoCode: "رمز الكوبون",
      apply: "تطبيق",
      promoApplied: "تم تطبيق الكوبون بنجاح!",
      preparingPayment: "جاري تهيئة جلسة الدفع الآمنة...",
      placedSuccess: "تم تقديم الطلب بنجاح!",
      orderId: "رقم الطلب",
      availableItems: "المنتجات المتوفرة",
      unavailableItems: "المنتجات غير المتوفرة",
      refundedToWallet: "مسترجعة للمحفظة",
      trackBtn: "تتبع حالة الطلب",
      receiptBtn: "عرض الفاتورة الإلكترونية",
      homeBtn: "العودة للرئيسية",
      trackingTitle: "تتبع شحناتك",
      driver: "السائق",
      shipment: "شحنة",
      statusPlaced: "تم تقديم الطلب",
      statusPreparing: "جاري تجهيز الطلب",
      statusOut: "خرج للتوصيل",
      statusDelivered: "تم التوصيل",
      scenarioSelector: "محدد سيناريو المحاكاة (خاص بالتقييم)",
      scenario1: "السيناريو ١: قبول كلي (جميع المنتجات مقبولة)",
      scenario2: "السيناريو ٢: رفض جزئي (قبول البعض ورفض الآخر)",
      scenario3: "السيناريو ٣: تخصيص جزئي للكمية (طلب ١٠، مقبول ٤)",
      scenario4: "السيناريو ٤: مرفوض مع وجود بدائل معروضة",
      scenario5: "السيناريو ٥: تخصيص جزئي مع بدائل للكمية المتبقية",
      scenario6: "السيناريو ٦: رفض جميع البدائل المعروضة",
      scenario7: "السيناريو ٧: رفض كامل الطلب من الصيدليات",
      scenario8: "السيناريو ٨: طلب مختلط (يحتوي على كافة الحالات)",
      actualCart: "استخدم منتجات سلة التسوق الحالية (محاكاة)",
      selectAddress: "اختر عنوان التوصيل",
      addNewAddress: "إضافة عنوان جديد",
      select: "اختيار",
      cancel: "إلغاء",
      sar: "ر.س",
      eta: "التوصيل المتوقع:",
      free: "مجاني",
      noItems: "لا توجد منتجات للدفع",
      browseProducts: "تصفح كتالوج المنتجات",
      rejectedOutStock: "المنتج غير متوفر في هذا الفرع",
      walletTxTitle: "دفع قيمة الطلب",
      rewardsEarned: "نقاط الولاء المكتسبة",
      approvedMsg: "تم قبول المنتج من قبل الصيدلي",
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
      removeContinue: "إزالة المنتج",
      pickupOption: "استلام من الصيدلية",
      deliveryOption: "توصيل للمنزل",
      pickupTitle: "موقع فرع الاستلام",
      pickupReady: "جاهز للاستلام خلال ١٥ دقيقة (مجاني)",
      substituteTitle: "بديل لمنتجك غير المتوفر:",
      statusPending: "قيد المراجعة",
      statusApproved: "مقبول بالكامل",
      statusPartial: "مقبول جزئياً",
      statusRejected: "مرفوض",
      actionAcceptPartial: "قبول الكمية المقبولة",
      actionSelectReplacement: "اختيار البديل المتاح",
      actionIgnoreReplacements: "تجاهل البدائل",
      resolvedMsg: "تمت التسوية",
      originalItem: "المنتج الأصلي المطلوب",
      alternativeSelected: "تم اختيار البديل",
      resolvedLabel: "الحالة",
      acceptApprovedOnly: "قبول الكمية المعتمدة فقط",
      selectAltForRemaining: "اختر بديل للكمية المتبقية",
      pendingReviewTitle: "مراجعة الصيدلية قيد المعالجة",
      itemsReviewedCount: "منتجات تم مراجعتها",
      noPayableItems: "لا توجد منتجات قابلة للدفع في هذا الطلب.",
      returnToCartBtn: "العودة للسلة والبدء من جديد"
    }
  };

  const t = language === "ar" ? translations.ar : translations.en;

  // Active steps calculation based on global activeCheckout
  const checkoutStep = activeCheckout ? activeCheckout.step : "review";

  // Filter cart items for checkout review
  const checkoutCartItems = cart.filter(item => selectedPharmacyIds.includes(item.pharmacyId));
  const activeItemsList = activeCheckout ? activeCheckout.items : checkoutCartItems;

  // Group checkout items by pharmacy
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

  const currentScenarioData = SCENARIOS[selectedScenario];

  // 1. Submit Checkout Action
  const handleSubmitCheckout = () => {
    if (fulfillmentType === "delivery" && !currentAddress && addresses.length === 0) {
      alert(language === "ar" ? "الرجاء تحديد عنوان التوصيل أولاً" : "Please select a delivery address first");
      return;
    }
    
    const targetAddress = currentAddress || addresses[0];

    // Load items based on selected scenario
    let itemsToSubmit = [];
    if (selectedScenario === "actual_cart") {
      // Map actual cart items to simulated outcomes based on Scenario 8 template
      itemsToSubmit = checkoutCartItems.map((item, idx) => {
        let allocation = item.quantity;
        let replacements = null;

        if (idx === 1) {
          allocation = Math.max(1, Math.floor(item.quantity / 2));
        } else if (idx === 2) {
          allocation = "*";
          replacements = [
            {
              id: `${item.id}-alt`,
              name_en: `${item.name_en} (Alt. Brand)`,
              name_ar: `${item.name_ar} (ماركة بديلة)`,
              price: item.price * 0.95,
              image: item.image,
              pharmacyId: item.pharmacyId,
              pharmacyName_en: item.pharmacyName_en,
              pharmacyName_ar: item.pharmacyName_ar
            }
          ];
        } else if (idx === 3) {
          allocation = "0";
        }

        return {
          ...item,
          allocation,
          replacements
        };
      });
    } else {
      itemsToSubmit = currentScenarioData.items;
    }

    submitCheckout(itemsToSubmit, targetAddress, fulfillmentType, selectedScenario);
  };

  // 2. Simulated progressive review line-by-line
  useEffect(() => {
    if (activeCheckout && activeCheckout.step === "processing_approval") {
      const pendingItems = activeCheckout.items.filter(item => item.allocation === "?");

      if (pendingItems.length === 0) {
        // Evaluate if entire order rejected
        const allRejected = activeCheckout.items.every(
          item => item.isRemoved || item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0
        );

        const timer = setTimeout(() => {
          if (allRejected) {
            updateCheckoutState({ step: "rejection_status" });
          } else {
            updateCheckoutState({ step: "approval_status" });
          }
        }, 1200);
        return () => clearTimeout(timer);
      }

      // Review one item
      const itemToReview = pendingItems[0];
      const timer = setTimeout(() => {
        let actualAllocation = itemToReview.quantity;
        let replacements = null;

        if (activeCheckout.scenario === "actual_cart") {
          // Find item in the submitted cart list
          const submittedItem = activeCheckout.items.find(i => i.id === itemToReview.id);
          actualAllocation = submittedItem?.allocation !== undefined ? submittedItem.allocation : itemToReview.quantity;
          replacements = submittedItem?.replacements || null;
        } else {
          const scenarioItem = currentScenarioData.items.find(i => i.id === itemToReview.id);
          actualAllocation = scenarioItem?.allocation !== undefined ? scenarioItem.allocation : itemToReview.quantity;
          replacements = scenarioItem?.replacements || null;
        }

        updateCheckoutItem(itemToReview.id, {
          allocation: actualAllocation,
          replacements: replacements
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeCheckout?.step, activeCheckout?.items]);

  // 3. Payment Completion Timeout Simulator
  useEffect(() => {
    if (activeCheckout && activeCheckout.step === "processing_payment") {
      const timer = setTimeout(() => {
        const { subtotal, deliveryFee, vat, total } = getCheckoutTotals();
        const discount = subtotal * couponDiscount;
        const totalBeforeDeduct = subtotal + deliveryFee + vat - discount;

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
        const orderIdVal = `YS-${Math.floor(100 + Math.random() * 900)}`;

        // Convert loyalty points
        const redeemedPoints = loyaltyDeduct * 50;

        // Final payable items list
        const payableItems = getPayableItemsList();

        // Create actual orders inside context
        const placedOrders = createOrder(
          walletDeduct,
          redeemedPoints,
          paymentMethod,
          fulfillmentType === "pickup" ? "pickup" : deliveryOption,
          null, // All checked out pharmacies
          payableItems
        );

        // Update active checkout state with order completion payload
        updateCheckoutState({
          step: "confirmation",
          simulatedOrderId: orderIdVal,
          placedSubtotal: subtotal,
          placedDeliveryFee: deliveryFee,
          placedVat: vat,
          placedCouponDiscount: discount,
          placedWalletDeduction: walletDeduct,
          placedLoyaltyDeduction: loyaltyDeduct,
          placedTotalPayable: totalBeforeDeduct,
          placedFinalPaid: finalPaid,
          placedOrders: placedOrders
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeCheckout?.step]);

  // Resolution Helpers
  const isLineResolved = (item) => {
    if (item.isRemoved) return true;
    if (item.allocation === "?") return false;

    // Fully approved
    if (Number(item.allocation) === item.quantity) return true;

    // Rejected (no replacements)
    if (
      (item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0) &&
      (!item.replacements || item.replacements.length === 0)
    ) {
      return false; // must click Remove
    }

    // Rejected with replacements
    if (
      (item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0) &&
      item.replacements &&
      item.replacements.length > 0
    ) {
      return item.selectedReplacement ? true : false;
    }

    // Partial allocation (no replacements)
    if (Number(item.allocation) < item.quantity && (!item.replacements || item.replacements.length === 0)) {
      return item.resolvedAllocation !== undefined && item.resolvedAllocation !== null;
    }

    // Partial allocation with replacements
    if (Number(item.allocation) < item.quantity && item.replacements && item.replacements.length > 0) {
      return (
        (item.resolvedAllocation !== undefined && item.resolvedAllocation !== null) ||
        item.selectedReplacement
      );
    }

    return false;
  };

  const getPayableItemsList = () => {
    if (!activeCheckout || !activeCheckout.items) return [];
    const list = [];
    activeCheckout.items.forEach(item => {
      if (item.isRemoved) return;

      // Case 1: Replacement selected
      if (item.selectedReplacement) {
        // If they also accepted the approved part (Scenario 5)
        if (item.allocation > 0 && typeof item.allocation === "number" && item.resolvedAllocation) {
          list.push({
            ...item,
            quantity: item.allocation
          });
        }
        // Add replacement details
        const repQty = item.allocation > 0 && typeof item.allocation === "number"
          ? (item.quantity - item.allocation)
          : item.quantity;

        list.push({
          id: item.selectedReplacement.id,
          name_en: item.selectedReplacement.name_en,
          name_ar: item.selectedReplacement.name_ar,
          price: item.selectedReplacement.price,
          image: item.selectedReplacement.image || "💊",
          isRx: item.selectedReplacement.isRx || false,
          isColdChain: item.selectedReplacement.isColdChain || false,
          pharmacyId: item.selectedReplacement.pharmacyId,
          pharmacyName_en: item.selectedReplacement.pharmacyName_en,
          pharmacyName_ar: item.selectedReplacement.pharmacyName_ar,
          quantity: repQty
        });
        return;
      }

      // Case 2: Rejected (no replacements)
      if (item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0) return;

      // Case 3: Approved/Partial Approved
      const allocNum = Number(item.allocation);
      if (!isNaN(allocNum) && allocNum > 0) {
        if (allocNum < item.quantity) {
          if (item.resolvedAllocation) {
            list.push({ ...item, quantity: allocNum });
          }
        } else {
          list.push({ ...item, quantity: allocNum });
        }
      }
    });
    return list;
  };

  const getCheckoutTotals = () => {
    const list = getPayableItemsList();
    const subtotal = list.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Group by pharmacy to compute delivery fees
    const groupedPayables = list.reduce((acc, item) => {
      if (!acc[item.pharmacyId]) acc[item.pharmacyId] = [];
      acc[item.pharmacyId].push(item);
      return acc;
    }, {});

    let deliveryFee = 0;
    if (fulfillmentType !== "pickup") {
      Object.keys(groupedPayables).forEach(pid => {
        const pItems = groupedPayables[pid];
        const pSub = pItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (pSub < 100) {
          const isCold = pItems.some(i => i.isColdChain);
          deliveryFee += isCold ? 25 : 10;
        }
      });
    }

    const vat = subtotal * 0.15;
    const total = subtotal + deliveryFee + vat;

    return { subtotal, deliveryFee, vat, total };
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
    const newAddr = {
      id: `ad-${Date.now()}`,
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

  const activeAddress = currentAddress || addresses[0];

  // Render empty state if cart is empty and no checkout is in progress
  if (!activeCheckout && checkoutCartItems.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🛒</span>
        <h2 className="empty-title">{t.noItems}</h2>
        <button className="btn-primary cart-empty-btn" onClick={() => router.push("/home")}>
          {t.browseProducts}
        </button>
      </div>
    );
  }

  const { subtotal, deliveryFee, vat, total } = getCheckoutTotals();

  // Check if all lines are resolved in approval screen
  const allResolved = activeCheckout ? activeCheckout.items.every(isLineResolved) : false;

  return (
    <div className="checkout-page-container">

      {/* STEP 1: REVIEW SECURE CHECKOUT */}
      {checkoutStep === "review" && (
        <div>
          <h1 className="checkout-page-title">{t.checkout}</h1>
          <div className="two-col-layout">
            <div className="layout-main-col">

              {/* EVALUATION TOGGLE SCENARIO SELECTOR */}
              <div className="scenario-selector-box">
                <span className="scenario-selector-label">⚙️ {t.scenarioSelector}</span>
                <select
                  className="form-input scenario-selector-input"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  <option value="scenario_1">{t.scenario1}</option>
                  <option value="scenario_2">{t.scenario2}</option>
                  <option value="scenario_3">{t.scenario3}</option>
                  <option value="scenario_4">{t.scenario4}</option>
                  <option value="scenario_5">{t.scenario5}</option>
                  <option value="scenario_6">{t.scenario6}</option>
                  <option value="scenario_7">{t.scenario7}</option>
                  <option value="scenario_8">{t.scenario8}</option>
                  <option value="actual_cart">{t.actualCart}</option>
                </select>
              </div>

              {/* Fulfillment Option Toggle */}
              <div className="fulfillment-toggle-container">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("delivery")}
                  className={`fulfillment-toggle-btn ${fulfillmentType === "delivery" ? "active" : ""}`}
                >
                  🚚 {t.deliveryOption}
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType("pickup")}
                  className={`fulfillment-toggle-btn ${fulfillmentType === "pickup" ? "active" : ""}`}
                >
                  🏪 {t.pickupOption}
                </button>
              </div>

              {fulfillmentType === "pickup" ? (
                /* Pickup store details */
                <div className="checkout-card">
                  <span className="checkout-card-title">🏪 {t.pickupTitle}</span>
                  <div className="checkout-branch-highlight">
                    <strong className="checkout-branch-name">📍 {language === "ar" ? "فرع حي الياسمين (الرئيسي)" : "Al-Yasmin Branch (Main)"}</strong>
                    <span className="checkout-branch-address">{language === "ar" ? "الرياض، طريق أنس بن مالك" : "Riyadh, Anas Ibn Malik Road"}</span>
                    <span className="checkout-branch-ready">
                      ⏱️ {t.pickupReady}
                    </span>
                  </div>
                </div>
              ) : (
                /* Delivery address details */
                <div className="checkout-card">
                  <div className="checkout-card-header">
                    <span className="checkout-card-title">📍 {t.deliveryAddress}</span>
                    <button
                      type="button"
                      onClick={() => { setShowAddressModal(true); setAddressModalMode("select"); }}
                      className="checkout-change-btn"
                    >
                      {t.changeBtn}
                    </button>
                  </div>
                  {activeAddress ? (
                    <div>
                      <strong className="checkout-address-tag">{language === "ar" ? activeAddress.tag_ar : activeAddress.tag}</strong>
                      <p className="checkout-address-detail">
                        {language === "ar" ? activeAddress.street_ar : activeAddress.street}, {language === "ar" ? activeAddress.city_ar : activeAddress.city}
                      </p>
                    </div>
                  ) : (
                    <button onClick={() => { setShowAddressModal(true); setAddressModalMode("add"); }} className="btn-secondary checkout-add-address-btn">+ {t.addNewAddress}</button>
                  )}
                </div>
              )}

              {/* Items detail list */}
              <div className="checkout-items-list">
                <h3 className="checkout-section-title">📦 {t.reviewTitle} ({checkoutCartItems.reduce((s, i) => s + i.quantity, 0)})</h3>
                {Object.keys(groupedCart).map((pharmacyId) => {
                  const grp = groupedCart[pharmacyId];
                  const pharmName = language === "ar" ? grp.name_ar : grp.name_en;
                  const pharmSub = grp.items.reduce((s, i) => s + i.price * i.quantity, 0);

                  return (
                    <div key={pharmacyId} className="pharmacy-group-box">
                      <div className="checkout-pharmacy-header">
                        <span className="checkout-pharmacy-name">🏥 {pharmName}</span>
                      </div>
                      <div className="pharmacy-group-items">
                        {grp.items.map((item) => (
                          <div key={item.id} className="checkout-item-row">
                            <span className="checkout-item-icon">{item.image || "📦"}</span>
                            <div className="checkout-item-info">
                              <h4 className="checkout-item-name">{language === "ar" ? item.name_ar : item.name_en}</h4>
                              <span className="checkout-item-price">{item.price.toFixed(2)} {t.sar}</span>
                            </div>
                            <span className="checkout-item-qty">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="checkout-pharmacy-subtotal">
                        <span>{language === "ar" ? "المجموع الفرعي للصيدلية:" : "Pharmacy Subtotal:"}</span>
                        <span>{pharmSub.toFixed(2)} {t.sar}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Side column summary details */}
            <div className="layout-side-col">
              <div className="checkout-summary-card">
                <h3 className="checkout-summary-title">{t.orderSummary}</h3>

                {(() => {
                  const initialSubtotal = checkoutCartItems.reduce((s, i) => s + i.price * i.quantity, 0);
                  const initialDeliveryFee = fulfillmentType === "pickup" ? 0 : Object.keys(groupedCart).reduce((sum, id) => {
                    const items = groupedCart[id].items;
                    const sub = items.reduce((s, item) => s + item.price * item.quantity, 0);
                    if (sub >= 100) return sum;
                    const isCold = items.some(i => i.isColdChain);
                    return sum + (isCold ? 25 : 10);
                  }, 0);
                  const initialVat = initialSubtotal * 0.15;
                  const initialTotal = initialSubtotal + initialDeliveryFee + initialVat;

                  return (
                    <div className="checkout-summary-billing">
                      <div className="checkout-summary-row">
                        <span>{t.subtotal}</span>
                        <strong>{initialSubtotal.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div className="checkout-summary-row">
                        <span>{t.deliveryFees}</span>
                        <strong>{initialDeliveryFee === 0 ? t.free : `${initialDeliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div className="checkout-summary-row">
                        <span>{t.vat}</span>
                        <strong>{initialVat.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div className="checkout-summary-total-row">
                        <span>{t.totalPayable}</span>
                        <span>{initialTotal.toFixed(2)} {t.sar}</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  className="btn-primary checkout-submit-btn"
                  onClick={handleSubmitCheckout}
                >
                  {t.continueBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING APPROVAL (LINE LEVEL PROGRESS METER) */}
      {checkoutStep === "processing_approval" && (
        <div className="processing-screen-container">
          {/* Orange spinner wrapper */}
          <div className="processing-spinner-outer">
            <div className="processing-spinner-inner" />
          </div>

          <div>
            <h2 className="processing-title">{t.pendingReviewTitle}</h2>
            <p className="processing-desc">{t.processingDesc}</p>
          </div>

          {/* Time Countdown Meter */}
          <div className="processing-progress-wrapper">
            {(() => {
              const totalItems = activeCheckout.items.length;
              const reviewedItems = activeCheckout.items.filter(i => i.allocation !== "?").length;
              const progressPercent = Math.min((reviewedItems / totalItems) * 100, 100);

              return (
                <>
                  <div className="processing-progress-header">
                    <span>⏱️ {t.timeRemaining}</span>
                    <span className="processing-progress-header-count">{reviewedItems} / {totalItems} {t.itemsReviewedCount}</span>
                  </div>
                  <div className="processing-progress-track">
                    <div className="processing-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                </>
              );
            })()}
          </div>

          {/* Real-time Pharmacy items checklists */}
          <div className="processing-checklist-card">
            <span className="processing-checklist-title">
              {language === "ar" ? "تفاصيل حالة مراجعة المنتجات" : "Line Item Review Progress"}
            </span>
            {activeCheckout.items.map((item) => {
              const status = item.allocation === "?" ? "pending" : (item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0) ? "rejected" : "approved";
              const itemName = language === "ar" ? item.name_ar : item.name_en;

              return (
                <div key={item.id} className="processing-checklist-row">
                  <div className="processing-checklist-row-info">
                    <strong className="processing-checklist-row-name">{item.image} {itemName}</strong>
                    <span className="processing-checklist-row-pharmacy">🏥 {language === "ar" ? item.pharmacyName_ar : item.pharmacyName_en}</span>
                  </div>
                  {status === "pending" && (
                    <span className="processing-status-badge pending">
                      <span className="dot-pulse" />
                      {t.statusPending}
                    </span>
                  )}
                  {status === "approved" && (
                    <span className="processing-status-badge approved">
                      <span>✓</span>
                      {Number(item.allocation) < item.quantity ? `${t.statusPartial} (${item.allocation}/${item.quantity})` : t.statusApproved}
                    </span>
                  )}
                  {status === "rejected" && (
                    <span className="processing-status-badge rejected">
                      <span>✕</span>
                      {t.statusRejected}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: ORDER APPROVAL STATUS (DETAILED DECISION INTERFACE) */}
      {checkoutStep === "approval_status" && (
        <div className="profile-panel-container-gap20">
          <div className="approval-header-container">
            <h2 className="profile-mobile-title">{t.approvedTitle}</h2>
            <button
              onClick={handleCancelCheckout}
              className="btn-secondary approval-cancel-btn"
            >
              {t.cancelCheckoutBtn}
            </button>
          </div>

          <div className="two-col-layout">
            <div className="layout-main-col">
              {activeCheckout.items.map((item) => {
                if (item.isRemoved) return null;

                const itemName = language === "ar" ? item.name_ar : item.name_en;
                const pharmacyName = language === "ar" ? item.pharmacyName_ar : item.pharmacyName_en;
                
                const isApproved = item.allocation !== "?" && item.allocation !== "*" && item.allocation !== "0" && Number(item.allocation) > 0;
                const isPartial = isApproved && Number(item.allocation) < item.quantity;
                const isRejected = item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0;

                const resolved = isLineResolved(item);

                return (
                  <div
                    key={item.id}
                    className={`approval-item-card ${resolved ? "resolved" : "unresolved"}`}
                  >
                    {/* Pharmacy Header row */}
                    <div className="approval-item-pharmacy-row">
                      <span className="approval-item-pharmacy-name">🏥 {pharmacyName}</span>
                      
                      {/* Resolution badge */}
                      {resolved ? (
                        <span className="approval-badge resolved">
                          ✓ {t.resolvedMsg}
                        </span>
                      ) : (
                        <span className="approval-badge unresolved">
                          ⚠️ Action Required
                        </span>
                      )}
                    </div>

                    {/* Original Item Detail section */}
                    <div className="approval-original-item" style={{ opacity: item.selectedReplacement ? 0.6 : 1 }}>
                      <span className="approval-original-icon">{item.image}</span>
                      <div className="approval-original-info">
                        <h4 className="approval-original-name">{itemName}</h4>
                        <div className="approval-original-meta">
                          <span>{t.originalItem}</span>
                          <span>•</span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                          <span>•</span>
                          <span>Price: <strong>{item.price.toFixed(2)} {t.sar}</strong></span>
                        </div>
                      </div>

                      {/* Status indicator pill */}
                      <div>
                        {isApproved && !isPartial && (
                          <span className="approval-original-status-pill approved">
                            {t.statusApproved}
                          </span>
                        )}
                        {isPartial && (
                          <span className="approval-original-status-pill partial">
                            {t.statusPartial}: {item.allocation}/{item.quantity}
                          </span>
                        )}
                        {isRejected && (
                          <span className="approval-original-status-pill rejected">
                            {t.statusRejected}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resolution Actions Panel */}
                    <div className="approval-resolution-panel">
                      
                      {/* Case 1: Partial Allocation (Scenario 3 / Scenario 5 approved part) */}
                      {isPartial && !item.selectedReplacement && (
                        <div className="approval-partial-container">
                          <span className="approval-partial-text">
                            👉 {language === "ar" ? `تمت الموافقة على ${item.allocation} كبسولات فقط من أصل ${item.quantity}.` : `Only ${item.allocation} items are approved out of ${item.quantity}.`}
                          </span>
                          
                          <div className="approval-partial-buttons">
                            <button
                              type="button"
                              onClick={() => updateCheckoutItem(item.id, { resolvedAllocation: item.allocation })}
                              className={`btn-primary approval-partial-accept-btn ${item.resolvedAllocation === item.allocation ? "active" : ""}`}
                            >
                              ✓ {t.actionAcceptPartial} ({item.allocation})
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCheckoutItem(item.id, { isRemoved: true })}
                              className="btn-secondary approval-partial-remove-btn"
                            >
                              ✕ {t.removeContinue}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case 2: Rejected with replacements (Scenario 4 / Scenario 5 remaining part) */}
                      {item.replacements && item.replacements.length > 0 && (
                        <div className="approval-alternatives-container">
                          <span className="approval-alternatives-title">🔍 {t.alternativesHeader}:</span>
                          
                          <div className="approval-alternatives-list">
                            {item.replacements.map(alt => {
                              const isSelectedAlt = item.selectedReplacement && item.selectedReplacement.id === alt.id;
                              return (
                                <div
                                  key={alt.id}
                                  className={`approval-alternative-card ${isSelectedAlt ? "selected" : "unselected"}`}
                                >
                                  <div>
                                    <strong className="approval-alternative-name">{alt.image} {language === "ar" ? alt.name_ar : alt.name_en}</strong>
                                    <span className="approval-alternative-pharmacy">🏥 {language === "ar" ? alt.pharmacyName_ar : alt.pharmacyName_en}</span>
                                  </div>
                                  <div className="approval-alternative-right">
                                    <strong className="approval-alternative-price">{alt.price.toFixed(2)} {t.sar}</strong>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateCheckoutItem(item.id, {
                                          selectedReplacement: alt,
                                          // If it was partial allocation (Scenario 5), select replacement for remaining 3, and keep 2 of original
                                          resolvedAllocation: isPartial ? item.allocation : null
                                        });
                                      }}
                                      className={`btn-primary approval-alternative-accept-btn ${isSelectedAlt ? "active" : ""}`}
                                    >
                                      {t.acceptSub}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="approval-alternatives-actions">
                            {isPartial && (
                              <button
                                type="button"
                                onClick={() => updateCheckoutItem(item.id, { resolvedAllocation: item.allocation, selectedReplacement: null })}
                                className={`btn-secondary approval-alternatives-accept-approved-btn ${item.resolvedAllocation && !item.selectedReplacement ? "active" : ""}`}
                              >
                                ✓ {t.acceptApprovedOnly} ({item.allocation})
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => updateCheckoutItem(item.id, { isRemoved: true })}
                              className="btn-secondary approval-alternatives-remove-btn"
                            >
                              ✕ {isPartial ? t.removeContinue : t.removeContinue}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case 3: Rejected (No replacements) (Scenario 2 rejected part / Scenario 7) */}
                      {isRejected && (!item.replacements || item.replacements.length === 0) && (
                        <div className="approval-rejected-out-stock-box">
                          <span className="approval-rejected-out-stock-text">
                            ⚠️ {t.rejectedOutStock}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCheckoutItem(item.id, { isRemoved: true })}
                            className="btn-secondary approval-rejected-out-stock-remove-btn"
                          >
                            ✕ {t.removeContinue}
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Side column summary for step 3 */}
            <div className="layout-side-col">
              <div className="checkout-summary-card">
                <h3 className="checkout-summary-title">{t.orderSummary}</h3>

                {(() => {
                  const payables = getPayableItemsList();
                  if (payables.length === 0) {
                    return <p className="checkout-no-payable-items">{t.noPayableItems}</p>;
                  }

                  return (
                    <div className="checkout-summary-billing">
                      {payables.map(p => (
                        <div key={p.id} className="checkout-summary-row checkout-summary-row-opacity">
                          <span>{language === "ar" ? p.name_ar : p.name_en} × {p.quantity}</span>
                          <strong>{(p.price * p.quantity).toFixed(2)} {t.sar}</strong>
                        </div>
                      ))}

                      <div className="checkout-summary-divider" />

                      <div className="checkout-summary-row">
                        <span>{t.subtotal}</span>
                        <strong>{subtotal.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div className="checkout-summary-row">
                        <span>{t.deliveryFees}</span>
                        <strong>{deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div className="checkout-summary-row">
                        <span>{t.vat}</span>
                        <strong>{vat.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div className="checkout-summary-total-row">
                        <span>{t.totalPayable}</span>
                        <span>{total.toFixed(2)} {t.sar}</span>
                      </div>
                    </div>
                  );
                })()}

                {getPayableItemsList().length > 0 ? (
                  <button
                    className="btn-primary checkout-submit-btn"
                    disabled={!allResolved}
                    onClick={() => updateCheckoutState({ step: "payment" })}
                  >
                    {t.continueToPayment}
                  </button>
                ) : (
                  <button
                    className="btn-secondary checkout-submit-btn checkout-return-btn"
                    onClick={handleCancelCheckout}
                  >
                    {t.returnToCartBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REJECTION STATUS (TOTAL REJECTION SCREEN) */}
      {checkoutStep === "rejection_status" && (
        <div className="rejection-screen-container">
          <div className="rejection-icon-circle">
            ✕
          </div>
          <div>
            <h2 className="rejection-title">{t.rejectionTitle}</h2>
            <p className="rejection-desc">{t.rejectionDesc}</p>
          </div>

          <div className="rejection-reasons-card">
            <span className="rejection-reasons-header">{t.reasonLabel}</span>
            {activeCheckout.items.map((item) => {
              const name = language === "ar" ? item.name_ar : item.name_en;
              return (
                <div key={item.id} className="rejection-reason-item">
                  <strong className="rejection-reason-item-name">{item.image} {name}</strong>
                  <span className="rejection-reason-item-status">
                    • {t.rejectedOutStock}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rejection-info-banner">
            <span>ℹ️</span>
            <span>{t.cartUpdatedNotice}</span>
          </div>

          <button onClick={handleCancelCheckout} className="btn-primary checkout-block-btn">
            {t.returnToCartBtn}
          </button>
        </div>
      )}

      {/* STEP 5: PAYMENT SELECTION */}
      {checkoutStep === "payment" && (
        <div>
          <h2 className="checkout-payment-title">{t.paymentTitle}</h2>
          <div className="two-col-layout">
            <div className="layout-main-col">

              {/* Wallet Balance */}
              <div className="checkout-benefit-card">
                <div>
                  <strong className="checkout-benefit-title">💳 {t.useWallet}</strong>
                  <span className="checkout-benefit-meta">{t.walletBalance}: {walletBalance.toFixed(2)} {t.sar}</span>
                </div>
                <input
                  type="checkbox"
                  checked={useWallet}
                  disabled={walletBalance <= 0}
                  onChange={() => setUseWallet(!useWallet)}
                  className="checkout-benefit-checkbox"
                />
              </div>

              {/* Loyalty points */}
              <div className="checkout-benefit-card">
                <div>
                  <strong className="checkout-benefit-title">👑 {t.redeemLoyalty}</strong>
                  <span className="checkout-benefit-meta">{t.loyaltyPoints}: {loyaltyPoints} pts ({(loyaltyPoints / 50).toFixed(2)} {t.sar})</span>
                </div>
                <input
                  type="checkbox"
                  checked={useLoyalty}
                  disabled={loyaltyPoints < 50}
                  onChange={() => setUseLoyalty(!useLoyalty)}
                  className="checkout-benefit-checkbox"
                />
              </div>

              {/* Payment Methods */}
              <div className="checkout-card">
                <span className="checkout-card-title">💳 Select Payment Option</span>
                <div className="orders-refund-options-list">
                  {[
                    { id: "mada", name_en: "Mada card", name_ar: "مدى", logo: "💳" },
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
                        className={`payment-option-card ${isSelected ? "selected" : "unselected"}`}
                      >
                        <div className="payment-option-logo-name">
                          <span className="checkout-payment-logo-size">{method.logo}</span>
                          <div className="checkout-payment-name-wrapper">
                            <strong className="checkout-payment-name-text">{name}</strong>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id)}
                          className="checkout-payment-checkbox"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Billing summary column */}
            <div className="layout-side-col">
              <div className="checkout-summary-card">
                <h3 className="checkout-summary-title">{t.orderSummary}</h3>

                {(() => {
                  const discount = subtotal * couponDiscount;
                  const totalBeforeDeduct = subtotal + deliveryFee + vat - discount;

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
                    <div className="checkout-summary-billing">
                      <div className="checkout-summary-row">
                        <span>{t.subtotal}</span>
                        <strong>{subtotal.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div className="checkout-summary-row">
                        <span>{t.deliveryFees}</span>
                        <strong>{deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div className="checkout-summary-row">
                        <span>{t.vat}</span>
                        <strong>{vat.toFixed(2)} {t.sar}</strong>
                      </div>

                      <div className="checkout-invoice-thick-divider" />

                      <div className="checkout-summary-row checkout-invoice-total-text">
                        <span>{t.totalAmount}</span>
                        <span>{totalBeforeDeduct.toFixed(2)} {t.sar}</span>
                      </div>

                      <div className="checkout-invoice-thick-divider" />

                      {/* Promo Code */}
                      <form onSubmit={handleApplyCoupon} className="checkout-coupon-form">
                        <input
                          type="text"
                          className="form-input coupon-code-input"
                          placeholder={t.promoCode}
                          value={couponCode}
                          disabled={couponApplied}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button type="submit" className="btn-secondary checkout-coupon-apply-btn" disabled={couponApplied}>
                          {t.apply}
                        </button>
                      </form>
                      {couponApplied && (
                        <div className="coupon-status-alert">
                          <span>✓ {t.promoApplied}</span>
                          <button
                            type="button"
                            onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCouponCode(""); }}
                            className="coupon-remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      <div className="checkout-invoice-thick-divider" />

                      {/* Benefits Info */}
                      <div className="checkout-invoice-benefits-section">
                        <span className="checkout-invoice-benefits-header">
                          {t.availableBenefits}
                        </span>
                        <div className="checkout-summary-row">
                          <span className="checkout-invoice-benefit-row-label">💳 {language === "ar" ? "رصيد المحفظة" : "Wallet Balance"}</span>
                          <strong className="checkout-invoice-primary-color">{walletBalance.toFixed(2)} {t.sar}</strong>
                        </div>
                        <div className="checkout-summary-row">
                          <span className="checkout-invoice-benefit-row-label">👑 {language === "ar" ? "نقاط الولاء" : "Loyalty Points"}</span>
                          <strong className="checkout-invoice-gold-color">{loyaltyPoints} pts ({(loyaltyPoints / 50).toFixed(2)} {t.sar})</strong>
                        </div>
                      </div>

                      {/* Deductions applied list */}
                      {(walletDeduct > 0 || loyaltyDeduct > 0 || discount > 0) && (
                        <>
                          <div className="checkout-invoice-dashed-divider" />
                          <div className="checkout-invoice-deductions-list">
                            {discount > 0 && (
                              <div className="checkout-summary-row checkout-invoice-danger-bold-text">
                                <span>{t.additionalDiscount}</span>
                                <span>-{discount.toFixed(2)} {t.sar}</span>
                              </div>
                            )}
                            {useWallet && walletDeduct > 0 && (
                              <div className="checkout-summary-row checkout-invoice-secondary-bold-text">
                                <span>{t.paymentFromBalance}</span>
                                <span>-{walletDeduct.toFixed(2)} {t.sar}</span>
                              </div>
                            )}
                            {useLoyalty && loyaltyDeduct > 0 && (
                              <div className="checkout-summary-row checkout-invoice-secondary-bold-text">
                                <span>{t.redeemLoyalty}</span>
                                <span>-{loyaltyDeduct.toFixed(2)} {t.sar}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Final Net Amount Row */}
                      <div className="checkout-summary-total-row">
                        <span>{t.paidAmount}</span>
                        <span className="checkout-invoice-purple-color">{finalPayable.toFixed(2)} {t.sar}</span>
                      </div>

                      <button onClick={() => updateCheckoutState({ step: "processing_payment" })} className="btn-primary checkout-submit-btn checkout-invoice-pay-btn">
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
        <div className="processing-payment-container">
          <div className="payment-spinner" />
          <div>
            <h2 className="checkout-processing-payment-title">{t.preparingPayment}</h2>
          </div>
        </div>
      )}

      {/* STEP 7: ORDER CONFIRMATION SCREEN */}
      {checkoutStep === "confirmation" && (
        <div className="confirmation-container">
          {/* Orange Shopping Bag Icon */}
          <div className="confirmation-icon-outer">
            <div className="confirmation-icon-inner">
              👜
            </div>
          </div>

          <div>
            <h2 className="confirmation-title">{t.placedSuccess}</h2>
            <span className="confirmation-id-label">{t.orderId}: <strong>{activeCheckout.simulatedOrderId}</strong></span>
          </div>

          {/* High fidelity items breakdown card */}
          <div className="confirmation-breakdown-card">
            
            {/* Available Items */}
            <div>
              <span className="confirmation-section-header available">
                <span className="confirmation-section-badge-circle available">✓</span>
                {t.availableItems}
              </span>

              <div className="checkout-invoice-benefits-section">
                {getPayableItemsList().map(item => (
                  <div key={item.id} className="confirmation-item-card-row available">
                    <div className="confirmation-item-card-row-info">
                      <span className="confirmation-item-card-row-name">{language === "ar" ? item.name_ar : item.name_en}</span>
                      <span className="confirmation-item-card-row-qty">Qty: {item.quantity}</span>
                    </div>
                    <strong className="confirmation-item-card-row-price available">{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Unavailable / Rejected Items */}
            {activeCheckout.items.some(i => i.isRemoved || i.allocation === "*" || i.allocation === "0" || Number(i.allocation) === 0) && (
              <div className="checkout-invoice-dashed-divider-pt14">
                <span className="confirmation-section-header unavailable">
                  <span className="confirmation-section-badge-circle unavailable">✕</span>
                  {t.unavailableItems} <span className="checkout-invoice-sub-refunded-text">({t.refundedToWallet})</span>
                </span>

                <div className="checkout-invoice-benefits-section">
                  {activeCheckout.items.filter(i => i.isRemoved || i.allocation === "*" || i.allocation === "0" || Number(i.allocation) === 0).map(item => {
                    // Check if replacement was chosen, in which case the original is rejected
                    return (
                      <div key={item.id} className="confirmation-item-card-row unavailable">
                        <div className="confirmation-item-card-row-info">
                          <span className="confirmation-item-card-row-name unavailable">{language === "ar" ? item.name_ar : item.name_en}</span>
                          <span className="confirmation-item-card-row-qty">Qty: {item.quantity}</span>
                        </div>
                        <strong className="confirmation-item-card-row-price unavailable">{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total Row */}
            <div className="confirmation-total-row">
              <span>{t.totalPayable}</span>
              <span className="confirmation-total-value">{activeCheckout.placedTotalPayable.toFixed(2)} {t.sar}</span>
            </div>

          </div>

          {/* Action buttons */}
          <div className="confirmation-actions-container">
            <button onClick={() => updateCheckoutState({ step: "tracking" })} className="btn-primary checkout-invoice-track-btn">
              {t.trackBtn}
            </button>
            <button onClick={() => setShowReceiptModal(true)} className="btn-secondary checkout-block-btn">
              {t.receiptBtn}
            </button>
            <button
              onClick={() => {
                setActiveCheckout(null); // Reset active checkout
                router.push("/home");
              }}
              className="btn-secondary checkout-invoice-home-btn"
            >
              {t.homeBtn}
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: SHIPMENT TRACKING TIMELINE */}
      {checkoutStep === "tracking" && (
        <div>
          <h2 className="checkout-payment-title">🚚 {t.trackingTitle}</h2>

          <div className="tracking-timeline-list">
            {activeCheckout.placedOrders && activeCheckout.placedOrders.map((ord, oIndex) => {
              const driverName = oIndex % 2 === 0 ? "Fahad Al-Harbi" : "Yousef Al-Malki";
              const driverPhone = oIndex % 2 === 0 ? "+966 50 123 4567" : "+966 55 987 6543";
              const pharmacyName = language === "ar" ? ord.pharmacyName_ar : ord.pharmacyName_en;

              return (
                <div key={ord.id} className="tracking-timeline-card">
                  <div className="tracking-timeline-card-header">
                    <div>
                      <strong className="tracking-timeline-pharmacy">🏥 {pharmacyName}</strong>
                      <span className="tracking-timeline-shipment-id">{t.shipment} #{ord.id}</span>
                    </div>
                    <span className="tracking-timeline-status">
                      ⏳ {language === "ar" ? "خارج للتوصيل" : "Out for Delivery"}
                    </span>
                  </div>

                  {/* Milestones timeline */}
                  <div className="tracking-milestones-container">
                    {[
                      { step: "placed", title: t.statusPlaced, done: true, time: "16:45" },
                      { step: "preparing", title: t.statusPreparing, done: true, time: "16:47" },
                      { step: "out", title: t.statusOut, done: true, active: true, time: "16:51" },
                      { step: "delivered", title: t.statusDelivered, done: false, time: "--:--" }
                    ].map((stepItem, sIndex) => (
                      <div key={stepItem.step} className="tracking-milestone-item">
                        <div className={`tracking-milestone-bullet ${stepItem.active ? "active" : stepItem.done ? "done" : "pending"}`} />
                        <div className="checkout-timeline-row-between">
                          <span className={stepItem.active ? "checkout-timeline-title-active" : "checkout-timeline-title-normal"}>
                            {stepItem.title}
                          </span>
                          <span className="checkout-timeline-time">{stepItem.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Driver box details */}
                  <div className="tracking-driver-box">
                    <div>
                      <span className="tracking-driver-label">👤 {t.driver}</span>
                      <strong className="checkout-payment-name-text">{driverName}</strong>
                    </div>
                    <a href={`tel:${driverPhone}`} className="tracking-driver-phone-btn">
                      📞 {driverPhone}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setActiveCheckout(null); // Reset checkout state
              router.push("/home");
            }}
            className="btn-primary checkout-invoice-home-btn-mt24"
          >
            {t.homeBtn}
          </button>
        </div>
      )}

      {/* CHOOSE A DELIVERY ADDRESS MODAL */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-sheet checkout-address-select-modal" onClick={(e) => e.stopPropagation()}>

            {addressModalMode === "select" ? (
              /* SELECT ADDRESS */
              <div>
                <div className="address-modal-header">
                  <h3 className="address-modal-title">{t.selectAddress}</h3>
                  <button className="btn-icon checkout-btn-icon-size16" onClick={() => setShowAddressModal(false)}>✕</button>
                </div>

                <button
                  type="button"
                  onClick={() => setAddressModalMode("add")}
                  className="address-modal-add-btn"
                >
                  <span className="checkout-btn-icon-size16">➕</span> {t.addNewAddress}
                </button>

                <div className="address-modal-list">
                  {addresses.map((addr) => {
                    const isSelected = activeAddress && activeAddress.id === addr.id;
                    const isHome = addr.tag === "Home";
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setCurrentAddress(addr)}
                        className={`address-modal-item ${isSelected ? "selected" : "unselected"}`}
                      >
                        <div
                          className={`address-modal-radio-outer ${isSelected ? "selected" : "unselected"}`}
                        >
                          {isSelected && <div className="address-modal-radio-inner" />}
                        </div>

                        <div className="address-modal-item-info">
                          <span className="checkout-address-tag-icon">{isHome ? "🏠" : "💼"}</span>
                          <div className="checkout-address-item-details-column">
                            <div className="address-modal-item-tag-row">
                              <strong className="address-modal-item-tag">
                                {language === "ar" ? addr.tag_ar : addr.tag.toLowerCase()}
                              </strong>
                              {isHome && (
                                <span className="address-modal-item-main-badge">
                                  Main
                                </span>
                              )}
                            </div>
                            <span className="address-modal-item-street">
                              {language === "ar" ? addr.street_ar : addr.street}, {language === "ar" ? addr.city_ar : addr.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="address-modal-actions">
                  <button
                    type="button"
                    className="btn-primary checkout-invoice-track-btn"
                    onClick={() => setShowAddressModal(false)}
                  >
                    {t.select}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary checkout-invoice-home-btn"
                    onClick={() => setShowAddressModal(false)}
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              /* ADD NEW ADDRESS */
              <form onSubmit={handleAddressSubmit}>
                <div className="address-modal-header">
                  <div className="checkout-invoice-benefit-row-label">
                    <button
                      type="button"
                      onClick={() => setAddressModalMode("select")}
                      className="checkout-address-back-btn"
                    >
                      {language === "ar" ? "→" : "←"}
                    </button>
                    <h3 className="checkout-address-modal-title"> {t.addNewAddress}</h3>
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

                <button type="submit" className="btn-primary checkout-address-save-btn">
                  ✓ Save Address
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ELECTRONIC RECEIPT MODAL */}
      {showReceiptModal && activeCheckout && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-sheet checkout-receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header">
              <h3 className="receipt-modal-title">🧾 {t.electronicReceipt}</h3>
              <button className="btn-icon" onClick={() => setShowReceiptModal(false)}>✕</button>
            </div>

            <div className="checkout-receipt-body">
              <div className="receipt-modal-info">
                <div>{t.orderId}: <strong className="checkout-receipt-info-value">{activeCheckout.simulatedOrderId}</strong></div>
                <div>{t.dateLabel}: <strong className="checkout-receipt-info-value">{new Date().toISOString().split("T")[0]}</strong></div>
                <div>{t.paymentMethodLabel}: <strong className="checkout-receipt-info-value">{paymentMethod.toUpperCase()}</strong></div>
                <div>{t.deliveryAddress}: <strong className="checkout-receipt-info-value">{activeAddress ? `${activeAddress.street}, ${activeAddress.city}` : ""}</strong></div>
              </div>

              <div className="receipt-modal-table-container">
                <table className="receipt-modal-table">
                  <thead>
                    <tr className="receipt-modal-table-header">
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPayableItemsList().map(item => (
                      <tr key={item.id} className="receipt-modal-table-row">
                        <td className="checkout-receipt-info-value">
                          {language === "ar" ? item.name_ar : item.name_en}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{(item.price * item.quantity).toFixed(2)} {t.sar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="receipt-modal-summary">
                <div className="checkout-summary-row">
                  <span>{t.subtotal}</span>
                  <strong>{activeCheckout.placedSubtotal.toFixed(2)} {t.sar}</strong>
                </div>
                <div className="checkout-summary-row">
                  <span>{t.deliveryFees}</span>
                  <strong>{activeCheckout.placedDeliveryFee === 0 ? t.free : `${activeCheckout.placedDeliveryFee.toFixed(2)} ${t.sar}`}</strong>
                </div>
                <div className="checkout-summary-row">
                  <span>{t.vat}</span>
                  <strong>{activeCheckout.placedVat.toFixed(2)} {t.sar}</strong>
                </div>
                {activeCheckout.placedCouponDiscount > 0 && (
                  <div className="checkout-summary-row checkout-invoice-danger-bold-text">
                    <span>{t.additionalDiscount}</span>
                    <strong>-{activeCheckout.placedCouponDiscount.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                {activeCheckout.placedWalletDeduction > 0 && (
                  <div className="checkout-summary-row checkout-invoice-secondary-bold-text">
                    <span>{t.paymentFromBalance}</span>
                    <strong>-{activeCheckout.placedWalletDeduction.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                {activeCheckout.placedLoyaltyDeduction > 0 && (
                  <div className="checkout-summary-row checkout-invoice-secondary-bold-text">
                    <span>{t.redeemLoyalty}</span>
                    <strong>-{activeCheckout.placedLoyaltyDeduction.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                <div className="checkout-summary-total-row">
                  <span>{t.paidAmount}</span>
                  <span>{activeCheckout.placedFinalPaid.toFixed(2)} {t.sar}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary checkout-invoice-pay-btn"
                onClick={() => setShowReceiptModal(false)}
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
