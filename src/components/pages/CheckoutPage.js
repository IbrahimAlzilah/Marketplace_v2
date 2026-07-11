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
      <div className="empty-state" style={{ marginTop: "40px" }}>
        <span className="empty-icon">🛒</span>
        <h2 className="empty-title">{t.noItems}</h2>
        <button className="btn-primary" onClick={() => router.push("/home")} style={{ width: "auto" }}>
          {t.browseProducts}
        </button>
      </div>
    );
  }

  const { subtotal, deliveryFee, vat, total } = getCheckoutTotals();

  // Check if all lines are resolved in approval screen
  const allResolved = activeCheckout ? activeCheckout.items.every(isLineResolved) : false;

  return (
    <div style={{ paddingBottom: "50px", position: "relative" }}>

      {/* STEP 1: REVIEW SECURE CHECKOUT */}
      {checkoutStep === "review" && (
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "20px" }}>{t.checkout}</h1>
          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* EVALUATION TOGGLE SCENARIO SELECTOR */}
              <div style={{
                backgroundColor: "rgba(15, 108, 189, 0.06)",
                border: "1.5px dashed var(--primary)",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--primary)" }}>⚙️ {t.scenarioSelector}</span>
                <select
                  className="form-input"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  style={{ fontSize: "12.5px", padding: "8px 12px" }}
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
                /* Pickup store details */
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
                /* Delivery address details */
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

              {/* Items detail list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>📦 {t.reviewTitle} ({checkoutCartItems.reduce((s, i) => s + i.quantity, 0)})</h3>
                {Object.keys(groupedCart).map((pharmacyId) => {
                  const grp = groupedCart[pharmacyId];
                  const pharmName = language === "ar" ? grp.name_ar : grp.name_en;
                  const pharmSub = grp.items.reduce((s, i) => s + i.price * i.quantity, 0);

                  return (
                    <div key={pharmacyId} style={{ border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", backgroundColor: "var(--surface)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>🏥 {pharmName}</span>
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

            {/* Side column summary details */}
            <div className="layout-side-col">
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

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
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.subtotal}</span>
                        <strong>{initialSubtotal.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.deliveryFees}</span>
                        <strong>{initialDeliveryFee === 0 ? t.free : `${initialDeliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.vat}</span>
                        <strong>{initialVat.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                        <span>{t.totalPayable}</span>
                        <span>{initialTotal.toFixed(2)} {t.sar}</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  className="btn-primary"
                  onClick={handleSubmitCheckout}
                  style={{ width: "100%", marginTop: "8px" }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", justifyContent: "center", minHeight: "380px", textAlign: "center", paddingBlock: "30px" }}>
          {/* Orange spinner wrapper */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "rgba(249, 115, 22, 0.1)", marginBottom: "8px" }}>
            <div style={{ width: "45px", height: "45px", borderRadius: "50%", border: "4px solid rgba(249, 115, 22, 0.2)", borderTopColor: "#F97316", animation: "spin 1s infinite linear" }} />
          </div>

          <div>
            <h2 style={{ fontSize: "21px", fontWeight: "800", margin: "0 0 6px 0", color: "var(--text-1)" }}>{t.pendingReviewTitle}</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-2)", margin: 0 }}>{t.processingDesc}</p>
          </div>

          {/* Time Countdown Meter */}
          <div style={{ width: "100%", maxWidth: "440px", paddingInline: "10px" }}>
            {(() => {
              const totalItems = activeCheckout.items.length;
              const reviewedItems = activeCheckout.items.filter(i => i.allocation !== "?").length;
              const progressPercent = Math.min((reviewedItems / totalItems) * 100, 100);

              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "700", color: "var(--text-2)", marginBottom: "6px" }}>
                    <span>⏱️ {t.timeRemaining}</span>
                    <span style={{ color: "var(--text-1)" }}>{reviewedItems} / {totalItems} {t.itemsReviewedCount}</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #F97316, #EA580C)", transition: "width 0.4s ease-out" }} />
                  </div>
                </>
              );
            })()}
          </div>

          {/* Real-time Pharmacy items checklists */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "440px", textAlign: "start", marginTop: "10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "800", display: "block", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
              {language === "ar" ? "تفاصيل حالة مراجعة المنتجات" : "Line Item Review Progress"}
            </span>
            {activeCheckout.items.map((item) => {
              const status = item.allocation === "?" ? "pending" : (item.allocation === "*" || item.allocation === "0" || Number(item.allocation) === 0) ? "rejected" : "approved";
              const itemName = language === "ar" ? item.name_ar : item.name_en;

              return (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: "4px" }}>
                  <div style={{ flex: 1, minWidth: 0, paddingEnd: "10px" }}>
                    <strong style={{ fontSize: "13px", color: "var(--text-1)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.image} {itemName}</strong>
                    <span style={{ fontSize: "10.5px", color: "var(--text-3)" }}>🏥 {language === "ar" ? item.pharmacyName_ar : item.pharmacyName_en}</span>
                  </div>
                  {status === "pending" && (
                    <span style={{ fontSize: "11px", color: "var(--warning)", backgroundColor: "rgba(245, 158, 11, 0.08)", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="dot-pulse" style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--warning)", display: "inline-block" }} />
                      {t.statusPending}
                    </span>
                  )}
                  {status === "approved" && (
                    <span style={{ fontSize: "11px", color: "var(--success)", backgroundColor: "rgba(16, 185, 129, 0.08)", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>✓</span>
                      {Number(item.allocation) < item.quantity ? `${t.statusPartial} (${item.allocation}/${item.quantity})` : t.statusApproved}
                    </span>
                  )}
                  {status === "rejected" && (
                    <span style={{ fontSize: "11px", color: "var(--danger)", backgroundColor: "rgba(239, 68, 68, 0.08)", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>{t.approvedTitle}</h2>
            <button
              onClick={handleCancelCheckout}
              className="btn-secondary"
              style={{ width: "auto", padding: "6px 12px", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: "12px" }}
            >
              {t.cancelCheckoutBtn}
            </button>
          </div>

          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                    style={{
                      border: `1.5px solid ${resolved ? "var(--border)" : "var(--primary)"}`,
                      borderRadius: "16px",
                      padding: "16px",
                      backgroundColor: "var(--surface)",
                      position: "relative",
                      transition: "all 0.2s"
                    }}
                  >
                    {/* Pharmacy Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)" }}>🏥 {pharmacyName}</span>
                      
                      {/* Resolution badge */}
                      {resolved ? (
                        <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: "700", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "8px" }}>
                          ✓ {t.resolvedMsg}
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "var(--primary)", fontWeight: "700", backgroundColor: "rgba(15, 108, 189, 0.1)", padding: "2px 8px", borderRadius: "8px", animation: "pulsePin 1s infinite alternate" }}>
                          ⚠️ Action Required
                        </span>
                      )}
                    </div>

                    {/* Original Item Detail section */}
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", opacity: item.selectedReplacement ? 0.6 : 1 }}>
                      <span style={{ fontSize: "28px" }}>{item.image}</span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 4px 0" }}>{itemName}</h4>
                        <div style={{ display: "flex", gap: "10px", fontSize: "11.5px", color: "var(--text-2)" }}>
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
                          <span style={{ fontSize: "11.5px", color: "var(--success)", fontWeight: "700", backgroundColor: "rgba(16, 185, 129, 0.08)", padding: "4px 10px", borderRadius: "10px" }}>
                            {t.statusApproved}
                          </span>
                        )}
                        {isPartial && (
                          <span style={{ fontSize: "11.5px", color: "var(--warning)", fontWeight: "700", backgroundColor: "rgba(245, 158, 11, 0.08)", padding: "4px 10px", borderRadius: "10px" }}>
                            {t.statusPartial}: {item.allocation}/{item.quantity}
                          </span>
                        )}
                        {isRejected && (
                          <span style={{ fontSize: "11.5px", color: "var(--danger)", fontWeight: "700", backgroundColor: "rgba(239, 68, 68, 0.08)", padding: "4px 10px", borderRadius: "10px" }}>
                            {t.statusRejected}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resolution Actions Panel */}
                    <div style={{ marginTop: "14px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                      
                      {/* Case 1: Partial Allocation (Scenario 3 / Scenario 5 approved part) */}
                      {isPartial && !item.selectedReplacement && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-1)" }}>
                            👉 {language === "ar" ? `تمت الموافقة على ${item.allocation} كبسولات فقط من أصل ${item.quantity}.` : `Only ${item.allocation} items are approved out of ${item.quantity}.`}
                          </span>
                          
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              type="button"
                              onClick={() => updateCheckoutItem(item.id, { resolvedAllocation: item.allocation })}
                              className="btn-primary"
                              style={{
                                flex: 1,
                                paddingVertical: "8px",
                                fontSize: "12px",
                                border: item.resolvedAllocation === item.allocation ? "1.5px solid var(--success)" : "none",
                                backgroundColor: item.resolvedAllocation === item.allocation ? "rgba(16, 185, 129, 0.1)" : "var(--primary)",
                                color: item.resolvedAllocation === item.allocation ? "var(--success)" : "white"
                              }}
                            >
                              ✓ {t.actionAcceptPartial} ({item.allocation})
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCheckoutItem(item.id, { isRemoved: true })}
                              className="btn-secondary"
                              style={{ flex: 1, paddingVertical: "8px", fontSize: "12px", border: "1.5px solid var(--danger)", color: "var(--danger)" }}
                            >
                              ✕ {t.removeContinue}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case 2: Rejected with replacements (Scenario 4 / Scenario 5 remaining part) */}
                      {item.replacements && item.replacements.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                          <span style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--text-2)" }}>🔍 {t.alternativesHeader}:</span>
                          
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {item.replacements.map(alt => {
                              const isSelectedAlt = item.selectedReplacement && item.selectedReplacement.id === alt.id;
                              return (
                                <div
                                  key={alt.id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px",
                                    border: `1.5px solid ${isSelectedAlt ? "var(--secondary)" : "var(--border)"}`,
                                    borderRadius: "10px",
                                    backgroundColor: isSelectedAlt ? "rgba(24, 182, 122, 0.03)" : "var(--surface)",
                                    transition: "all 0.15s"
                                  }}
                                >
                                  <div>
                                    <strong style={{ fontSize: "12.5px", display: "block" }}>{alt.image} {language === "ar" ? alt.name_ar : alt.name_en}</strong>
                                    <span style={{ fontSize: "10px", color: "var(--text-3)" }}>🏥 {language === "ar" ? alt.pharmacyName_ar : alt.pharmacyName_en}</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <strong style={{ color: "var(--primary)", fontSize: "13px" }}>{alt.price.toFixed(2)} {t.sar}</strong>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateCheckoutItem(item.id, {
                                          selectedReplacement: alt,
                                          // If it was partial allocation (Scenario 5), select replacement for remaining 3, and keep 2 of original
                                          resolvedAllocation: isPartial ? item.allocation : null
                                        });
                                      }}
                                      className="btn-primary"
                                      style={{
                                        width: "auto",
                                        padding: "6px 12px",
                                        fontSize: "11px",
                                        backgroundColor: isSelectedAlt ? "var(--secondary)" : "var(--primary)"
                                      }}
                                    >
                                      {t.acceptSub}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
                            {isPartial && (
                              <button
                                type="button"
                                onClick={() => updateCheckoutItem(item.id, { resolvedAllocation: item.allocation, selectedReplacement: null })}
                                className="btn-secondary"
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "11px",
                                  border: item.resolvedAllocation && !item.selectedReplacement ? "1.5px solid var(--success)" : "1px solid var(--border)",
                                  color: item.resolvedAllocation && !item.selectedReplacement ? "var(--success)" : "var(--text-2)"
                                }}
                              >
                                ✓ {t.acceptApprovedOnly} ({item.allocation})
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => updateCheckoutItem(item.id, { isRemoved: true })}
                              className="btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "11px", border: "1px solid var(--danger)", color: "var(--danger)" }}
                            >
                              ✕ {isPartial ? t.removeContinue : t.removeContinue}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case 3: Rejected (No replacements) (Scenario 2 rejected part / Scenario 7) */}
                      {isRejected && (!item.replacements || item.replacements.length === 0) && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "10px", padding: "10px 14px" }}>
                          <span style={{ fontSize: "12px", color: "var(--danger)", fontWeight: "600" }}>
                            ⚠️ {t.rejectedOutStock}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCheckoutItem(item.id, { isRemoved: true })}
                            className="btn-secondary"
                            style={{ width: "auto", padding: "6px 12px", fontSize: "11.5px", border: "1.5px solid var(--danger)", color: "var(--danger)", backgroundColor: "white" }}
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
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

                {(() => {
                  const payables = getPayableItemsList();
                  if (payables.length === 0) {
                    return <p style={{ fontSize: "12px", color: "var(--text-3)", margin: "10px 0" }}>{t.noPayableItems}</p>;
                  }

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
                      {payables.map(p => (
                        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", opacity: 0.85 }}>
                          <span>{language === "ar" ? p.name_ar : p.name_en} × {p.quantity}</span>
                          <strong>{(p.price * p.quantity).toFixed(2)} {t.sar}</strong>
                        </div>
                      ))}

                      <div style={{ borderTop: "1px solid var(--border)", paddingValues: "6px 0", marginTop: "6px" }} />

                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.subtotal}</span>
                        <strong>{subtotal.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.deliveryFees}</span>
                        <strong>{deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.vat}</span>
                        <strong>{vat.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                        <span>{t.totalPayable}</span>
                        <span>{total.toFixed(2)} {t.sar}</span>
                      </div>
                    </div>
                  );
                })()}

                {getPayableItemsList().length > 0 ? (
                  <button
                    className="btn-primary"
                    disabled={!allResolved}
                    onClick={() => updateCheckoutState({ step: "payment" })}
                    style={{ width: "100%", marginTop: "8px" }}
                  >
                    {t.continueToPayment}
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={handleCancelCheckout}
                    style={{ width: "100%", marginTop: "8px", border: "1.5px solid var(--danger)", color: "var(--danger)" }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center", paddingBlock: "30px", maxWidth: "550px", margin: "0 auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>
            ✕
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-1)", margin: "0 0 6px 0" }}>{t.rejectionTitle}</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-2)", margin: 0 }}>{t.rejectionDesc}</p>
          </div>

          <div style={{ width: "100%", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", textAlign: "start", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "800" }}>{t.reasonLabel}</span>
            {activeCheckout.items.map((item) => {
              const name = language === "ar" ? item.name_ar : item.name_en;
              return (
                <div key={item.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "13px", display: "block", color: "var(--text-1)" }}>{item.image} {name}</strong>
                  <span style={{ fontSize: "11.5px", color: "var(--danger)", fontWeight: "600" }}>
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

          <button onClick={handleCancelCheckout} className="btn-primary" style={{ width: "100%", paddingVertical: "14px" }}>
            {t.returnToCartBtn}
          </button>
        </div>
      )}

      {/* STEP 5: PAYMENT SELECTION */}
      {checkoutStep === "payment" && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>{t.paymentTitle}</h2>
          <div className="two-col-layout">
            <div className="layout-main-col" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Wallet Balance */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>💳 {t.useWallet}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-2)" }}>{t.walletBalance}: {walletBalance.toFixed(2)} {t.sar}</span>
                </div>
                <input
                  type="checkbox"
                  checked={useWallet}
                  disabled={walletBalance <= 0}
                  onChange={() => setUseWallet(!useWallet)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>

              {/* Loyalty points */}
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

            {/* Billing summary column */}
            <div className="layout-side-col">
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>{t.orderSummary}</h3>

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
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.subtotal}</span>
                        <strong>{subtotal.toFixed(2)} {t.sar}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.deliveryFees}</span>
                        <strong>{deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.sar}`}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{t.vat}</span>
                        <strong>{vat.toFixed(2)} {t.sar}</strong>
                      </div>

                      <div style={{ borderTop: "1.5px solid var(--border)", marginTop: "4px", marginBottom: "4px" }} />

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15.5px", fontWeight: "800", color: "var(--text-1)" }}>
                        <span>{t.totalAmount}</span>
                        <span>{totalBeforeDeduct.toFixed(2)} {t.sar}</span>
                      </div>

                      <div style={{ borderTop: "1.5px solid var(--border)", marginTop: "4px", marginBottom: "4px" }} />

                      {/* Promo Code */}
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

                      <div style={{ borderTop: "1.5px solid var(--border)", marginTop: "4px", marginBottom: "4px" }} />

                      {/* Benefits Info */}
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

                      <button onClick={() => updateCheckoutState({ step: "processing_payment" })} className="btn-primary" style={{ width: "100%", marginTop: "10px", paddingVertical: "14px" }}>
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

      {/* STEP 7: ORDER CONFIRMATION SCREEN */}
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
            <span style={{ fontSize: "13px", color: "var(--text-2)", display: "block" }}>{t.orderId}: <strong>{activeCheckout.simulatedOrderId}</strong></span>
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
                {getPayableItemsList().map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(24, 182, 122, 0.05)", padding: "10px 12px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-1)" }}>{language === "ar" ? item.name_ar : item.name_en}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-2)" }}>Qty: {item.quantity}</span>
                    </div>
                    <strong style={{ color: "#7C3AED", fontSize: "13px" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Unavailable / Rejected Items */}
            {activeCheckout.items.some(i => i.isRemoved || i.allocation === "*" || i.allocation === "0" || Number(i.allocation) === 0) && (
              <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "14px" }}>
                <span style={{ fontSize: "12px", color: "var(--danger)", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", border: "1.5px solid var(--danger)", fontSize: "10px" }}>✕</span>
                  {t.unavailableItems} <span style={{ fontSize: "10.5px", fontWeight: "500", color: "var(--text-2)" }}>({t.refundedToWallet})</span>
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {activeCheckout.items.filter(i => i.isRemoved || i.allocation === "*" || i.allocation === "0" || Number(i.allocation) === 0).map(item => {
                    // Check if replacement was chosen, in which case the original is rejected
                    return (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(225, 29, 72, 0.05)", padding: "10px 12px", borderRadius: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-1)", textDecoration: "line-through" }}>{language === "ar" ? item.name_ar : item.name_en}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-2)" }}>Qty: {item.quantity}</span>
                        </div>
                        <strong style={{ color: "var(--danger)", fontSize: "13px" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid var(--border)", paddingTop: "12px", fontSize: "15px", fontWeight: "800" }}>
              <span>{t.totalPayable}</span>
              <span style={{ color: "#7C3AED" }}>{activeCheckout.placedTotalPayable.toFixed(2)} {t.sar}</span>
            </div>

          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            <button onClick={() => updateCheckoutState({ step: "tracking" })} className="btn-primary" style={{ width: "100%", paddingVertical: "14px", backgroundColor: "#6355a4", border: "none" }}>
              {t.trackBtn}
            </button>
            <button onClick={() => setShowReceiptModal(true)} className="btn-secondary" style={{ width: "100%", paddingVertical: "14px" }}>
              {t.receiptBtn}
            </button>
            <button
              onClick={() => {
                setActiveCheckout(null); // Reset active checkout
                router.push("/home");
              }}
              className="btn-secondary"
              style={{ width: "100%", paddingVertical: "14px", border: "1px solid var(--border)" }}
            >
              {t.homeBtn}
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: SHIPMENT TRACKING TIMELINE */}
      {checkoutStep === "tracking" && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>🚚 {t.trackingTitle}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {activeCheckout.placedOrders && activeCheckout.placedOrders.map((ord, oIndex) => {
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

          <button
            onClick={() => {
              setActiveCheckout(null); // Reset checkout state
              router.push("/home");
            }}
            className="btn-primary"
            style={{ width: "100%", marginTop: "24px", paddingVertical: "14px" }}
          >
            {t.homeBtn}
          </button>
        </div>
      )}

      {/* CHOOSE A DELIVERY ADDRESS MODAL */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px", borderRadius: "24px" }}>

            {addressModalMode === "select" ? (
              /* SELECT ADDRESS */
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>{t.selectAddress}</h3>
                  <button className="btn-icon" onClick={() => setShowAddressModal(false)} style={{ fontSize: "16px" }}>✕</button>
                </div>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAddressModalMode("add")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", paddingVertical: "12px", marginBottom: "16px", border: "1.5px solid var(--border)", color: "var(--text-1)", backgroundColor: "white", borderRadius: "16px" }}
                >
                  <span style={{ fontSize: "16px" }}>➕</span> {t.addNewAddress}
                </button>

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
              /* ADD NEW ADDRESS */
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

      {/* ELECTRONIC RECEIPT MODAL */}
      {showReceiptModal && activeCheckout && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px", padding: "24px", borderRadius: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>🧾 {t.electronicReceipt}</h3>
              <button className="btn-icon" onClick={() => setShowReceiptModal(false)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-2)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>{t.orderId}: <strong style={{ color: "var(--text-1)" }}>{activeCheckout.simulatedOrderId}</strong></div>
                <div>{t.dateLabel}: <strong style={{ color: "var(--text-1)" }}>{new Date().toISOString().split("T")[0]}</strong></div>
                <div>{t.paymentMethodLabel}: <strong style={{ color: "var(--text-1)" }}>{paymentMethod.toUpperCase()}</strong></div>
                <div>{t.deliveryAddress}: <strong style={{ color: "var(--text-1)" }}>{activeAddress ? `${activeAddress.street}, ${activeAddress.city}` : ""}</strong></div>
              </div>

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
                    {getPayableItemsList().map(item => (
                      <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px", color: "var(--text-1)" }}>
                          {language === "ar" ? item.name_ar : item.name_en}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center", color: "var(--text-2)" }}>{item.quantity}</td>
                        <td style={{ padding: "10px", textAlign: "end", fontWeight: "700" }}>{(item.price * item.quantity).toFixed(2)} {t.sar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", backgroundColor: "var(--bg)", padding: "12px", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t.subtotal}</span>
                  <strong>{activeCheckout.placedSubtotal.toFixed(2)} {t.sar}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t.deliveryFees}</span>
                  <strong>{activeCheckout.placedDeliveryFee === 0 ? t.free : `${activeCheckout.placedDeliveryFee.toFixed(2)} ${t.sar}`}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t.vat}</span>
                  <strong>{activeCheckout.placedVat.toFixed(2)} {t.sar}</strong>
                </div>
                {activeCheckout.placedCouponDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--danger)" }}>
                    <span>{t.additionalDiscount}</span>
                    <strong>-{activeCheckout.placedCouponDiscount.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                {activeCheckout.placedWalletDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)" }}>
                    <span>{t.paymentFromBalance}</span>
                    <strong>-{activeCheckout.placedWalletDeduction.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                {activeCheckout.placedLoyaltyDeduction > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--secondary)" }}>
                    <span>{t.redeemLoyalty}</span>
                    <strong>-{activeCheckout.placedLoyaltyDeduction.toFixed(2)} {t.sar}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "800", borderTop: "1.5px dashed var(--border)", paddingTop: "10px", marginTop: "4px", color: "var(--primary)" }}>
                  <span>{t.paidAmount}</span>
                  <span>{activeCheckout.placedFinalPaid.toFixed(2)} {t.sar}</span>
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
