"use client";

import React, { use, useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { mockProducts, mockPharmacies } from "@/mock/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { language, cart, addToCart, updateCartQuantity, attachPrescription, wishlist, toggleWishlist, addToRecentlyViewed } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      addToRecentlyViewed(productId);
    }
  }, [productId]);

  const product = mockProducts.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);
  const isWishlisted = wishlist.includes(productId);

  const [showRxModal, setShowRxModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  
  const [selectedVendorId, setSelectedVendorId] = useState(product ? product.pharmacyId : "");

  // Interactive Saved Prescription state
  const [isPrescriptionLinked, setIsPrescriptionLinked] = useState(false);
  const [linkedPrescriptionDetails, setLinkedPrescriptionDetails] = useState(null);

  // Pharmacist Helpline chat drawer state
  const [showPharmacistChat, setShowPharmacistChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  // Accordion tabs state
  const [openTabs, setOpenTabs] = useState({
    description: true,
    directions: false,
    warnings: false,
    ingredients: false
  });

  const toggleTab = (tabName) => {
    setOpenTabs((prev) => ({
      ...prev,
      [tabName]: !prev[tabName]
    }));
  };

  useEffect(() => {
    if (product) {
      setSelectedVendorId(product.pharmacyId);
      // Reset prescription state on product change
      setIsPrescriptionLinked(false);
      setLinkedPrescriptionDetails(null);
      setSelectedFileName("");
    }
  }, [product]);

  if (!product) {
    return <div className="empty-state">Product Not Found</div>;
  }

  // Multi-vendor calculations
  const defaultPharmacy = mockPharmacies.find((p) => p.id === product.pharmacyId);
  const alternativePharmacies = mockPharmacies.filter((ph) => ph.id !== product.pharmacyId).slice(0, 2);

  // Build the list of all available vendors for this product
  const availableVendors = [
    {
      id: product.pharmacyId,
      name_en: product.pharmacyName_en,
      name_ar: product.pharmacyName_ar,
      rating: defaultPharmacy?.rating || 4.8,
      distance: defaultPharmacy?.distance || 1.0,
      deliveryEta_en: defaultPharmacy?.deliveryEta_en || "20-30 mins",
      deliveryEta_ar: defaultPharmacy?.deliveryEta_ar || "٢٠-٣٠ دقيقة",
      deliveryFee: defaultPharmacy?.deliveryFee || 10,
      logo: defaultPharmacy?.logo || "🏥",
      price: product.price,
      originalPrice: product.originalPrice
    },
    ...alternativePharmacies.map((ph, idx) => {
      // Cheaper / premium pricing adjustments based on brand
      let adjustedPrice = product.price;
      if (ph.id === "ph-2") adjustedPrice = product.price * 0.92; // Nahdi (Cheaper - 8% off)
      else if (ph.id === "ph-3") adjustedPrice = product.price * 1.05; // Whites (Premium - 5% up)
      else adjustedPrice = product.price * (1 - (idx + 1) * 0.03); // fallback adjustments

      let adjustedOriginal = product.originalPrice;
      if (adjustedOriginal) {
        if (ph.id === "ph-2") adjustedOriginal = product.originalPrice * 0.92;
        else if (ph.id === "ph-3") adjustedOriginal = product.originalPrice * 1.05;
        else adjustedOriginal = product.originalPrice * (1 - (idx + 1) * 0.03);
      } else {
        // If cheaper, mock an original price to show discount
        if (adjustedPrice < product.price) {
          adjustedOriginal = product.price;
        }
      }

      return {
        id: ph.id,
        name_en: ph.name_en,
        name_ar: ph.name_ar,
        rating: ph.rating,
        distance: ph.distance,
        deliveryEta_en: ph.deliveryEta_en,
        deliveryEta_ar: ph.deliveryEta_ar,
        deliveryFee: ph.deliveryFee,
        logo: ph.logo,
        price: adjustedPrice,
        originalPrice: adjustedOriginal
      };
    })
  ];

  const activeVendor = availableVendors.find((v) => v.id === selectedVendorId) || availableVendors[0];

  // Translation helpers
  const categoryNames = {
    medications: { en: "Medicines", ar: "الأدوية" },
    vitamins: { en: "Vitamins", ar: "الفيتامينات" },
    baby: { en: "Baby Care", ar: "العناية بالطفل" },
    beauty: { en: "Skin Care", ar: "العناية بالبشرة" },
    devices: { en: "Medical Devices", ar: "الأجهزة الطبية" },
    personal: { en: "Personal Care", ar: "العناية الشخصية" },
    fitness: { en: "Fitness", ar: "الرشاقة والرياضة" },
    herbal: { en: "Herbal", ar: "المنتجات العشبية" }
  };

  const catInfo = categoryNames[product.category] || { en: "Products", ar: "المنتجات" };
  const categoryLabel = language === "ar" ? catInfo.ar : catInfo.en;
  const productName = language === "ar" ? product.name_ar : product.name_en;

  const galleryImages = [
    product.image,
    "📦",
    "🔬",
    "🛡️"
  ];

  const desc = language === "ar" ? product.description_ar : product.description_en;

  // Mock directions, warnings, and ingredients based on category
  const extraProductDetails = {
    directions: {
      en: product.category === "medications" || product.category === "vitamins"
        ? "Take 1-2 tablets daily with water, preferably with a meal. Do not exceed the recommended dose."
        : "Apply evenly to the affected area or clean skin. Use daily or as recommended by a dermatologist.",
      ar: product.category === "medications" || product.category === "vitamins"
        ? "تناول قرصاً أو قرصين يومياً مع الماء، ويفضل مع وجبة الطعام. لا تتجاوز الجرعة الموصى بها."
        : "ضعه بالتساوي على المنطقة المصابة أو على بشرة نظيفة. استخدمه يومياً أو حسب توصية طبيب الجلدية."
    },
    warnings: {
      en: product.isRx 
        ? "SFDA Regulated medicine. Keep out of reach of children. Consult a healthcare professional immediately if side effects occur. Protect from direct heat."
        : "Keep out of reach of children. Discontinue use and consult a doctor if irritation or adverse reaction develops.",
      ar: product.isRx
        ? "دواء خاضع لرقابة الهيئة العامة للغذاء والدواء. يحفظ بعيداً عن متناول الأطفال. استشر الطبيب فوراً في حال ظهور أعراض جانبية. يحفظ بعيداً عن الحرارة المباشرة."
        : "يحفظ بعيداً عن متناول الأطفال. توقف عن الاستخدام واستشر الطبيب في حال حدوث تهيج أو أعراض جانبية."
    },
    ingredients: {
      en: product.category === "medications"
        ? "Active substance per unit: Standard therapeutic concentration. Free from lactose, gluten, and artificial colorants."
        : "Purified Water, Glycerin, Active botanical extracts, Preservatives, Fragrance-free hypoallergenic base.",
      ar: product.category === "medications"
        ? "المادة الفعالة لكل وحدة: التركيز العلاجي القياسي. خالٍ من اللاكتوز والجلوتين والملونات الاصطناعية."
        : "مياه نقية، جلسرين، مستخلصات نباتية نشطة، مواد حافظة، قاعدة مضادة للحساسية وخالية من العطور."
    }
  };

  const t = {
    back: language === "ar" ? "الرئيسية" : "Home",
    sar: language === "ar" ? "ر.س" : "SAR",
    rxBadge: language === "ar" ? "وصفة طبية مطلوبة (خاضع لرقابة SFDA)" : "Prescription Required (SFDA Regulated)",
    rxDesc: language === "ar" ? "هذا الدواء خاضع للهيئة العامة للغذاء والدواء ولا يصرف إلا بوصفة طبية معتمدة." : "This medicine is regulated by SFDA and requires a valid prescription to dispense.",
    coldChain: language === "ar" ? "سلسلة التبريد مضمونة" : "Cold-Chain Integrity Guaranteed",
    coldDesc: language === "ar" ? "يتم شحن هذا دواء في حاويات مبردة للحفاظ على فاعليته." : "Insulated refrigerated delivery box matches product cooling standards.",
    expiry: language === "ar" ? "تاريخ انتهاء الصلاحية مضمون" : "Guaranteed Expiry Date",
    expiryDate: language === "ar" ? "صلاحية مضمونة حتى ديسمبر ٢٠٢٧" : "Guaranteed Expiry: Dec 2027 or later",
    description: language === "ar" ? "وصف المنتج" : "Product Description",
    directions: language === "ar" ? "طريقة الاستخدام والإرشادات" : "Usage Directions",
    warnings: language === "ar" ? "التحذيرات والاحتياطات" : "Warnings & Precautions",
    ingredients: language === "ar" ? "المكونات" : "Ingredients & Formulation",
    alternative: language === "ar" ? "صيدليات بيع بديلة" : "Select Pharmacy Vendor",
    addToCart: language === "ar" ? "إضافة إلى السلة" : "Add to Cart",
    uploadRx: language === "ar" ? "رفع الوصفة الطبية" : "Upload Prescription",
    rxAttached: language === "ar" ? "تم إرفاق الوصفة" : "Prescription Attached",
    consult: language === "ar" ? "استشر الصيدلي مجاناً" : "Ask Pharmacist",
    camera: language === "ar" ? "التقاط صورة للوصفة" : "Take Photo of Prescription",
    uploadFile: language === "ar" ? "تحميل ملف (PDF / صورة)" : "Upload File (PDF / Image)",
    submit: language === "ar" ? "تأكيد وإضافة للسلة" : "Confirm & Add",
    km: language === "ar" ? "كم" : "km",
    fee: language === "ar" ? "التوصيل:" : "Delivery:",
    free: language === "ar" ? "مجاني" : "Free",
    checkRx: language === "ar" ? "التحقق من الوصفات الطبية المعتمدة" : "Check Saved/Wasfaty Prescriptions",
    linkRx: language === "ar" ? "ربط الوصفة الطبية" : "Link Selected Prescription",
    rxLinkedSuccess: language === "ar" ? "تم ربط الوصفة والتحقق بنجاح ✓" : "Prescription Verified & Linked ✓",
    chatTitle: language === "ar" ? "استشارة صيدلي يسر" : "YUSUR Pharmacist Helpline",
    chatSubtitle: language === "ar" ? "الرد خلال ثوانٍ" : "Replies in seconds",
    chatPlaceholder: language === "ar" ? "اكتب سؤالك هنا..." : "Type your question...",
    btnSend: language === "ar" ? "إرسال" : "Send",
    savedRxHeader: language === "ar" ? "الوصفات المحفوظة المكتشفة" : "Discovered Saved Prescriptions"
  };

  const savedPrescriptions = [
    { id: "rx-1", doctor: "Dr. Sarah Al-Otaibi", doctor_ar: "د. سارة العتيبي", hospital: "King Khalid Hospital", hospital_ar: "مستشفى الملك خالد", date: "2026-06-15", code: "MOH-8829-X" },
    { id: "rx-2", doctor: "Dr. Fahad Al-Mutairi", doctor_ar: "د. فهد المطيري", hospital: "Riyadh Medical City", hospital_ar: "مدينة الرياض الطبية", date: "2026-05-10", code: "WASFATY-7739-B" }
  ];

  const handleAddAction = () => {
    if (product.isRx && !selectedFileName && !isPrescriptionLinked && (!cartItem || !cartItem.rxFile)) {
      setShowRxModal(true);
      return;
    }
    // Add product with active vendor customization
    const customProduct = {
      ...product,
      price: activeVendor.price,
      originalPrice: activeVendor.originalPrice,
      pharmacyId: activeVendor.id,
      pharmacyName_en: activeVendor.name_en,
      pharmacyName_ar: activeVendor.name_ar
    };
    addToCart(customProduct, 1);
  };

  const handleRxSubmit = (e) => {
    e.preventDefault();
    const fileName = selectedFileName || "prescription_scan.jpg";
    const customProduct = {
      ...product,
      price: activeVendor.price,
      originalPrice: activeVendor.originalPrice,
      pharmacyId: activeVendor.id,
      pharmacyName_en: activeVendor.name_en,
      pharmacyName_ar: activeVendor.name_ar
    };
    addToCart(customProduct, 1);
    attachPrescription(product.id, fileName);
    setShowRxModal(false);
  };

  const handleLinkPrescription = (rxId) => {
    const rx = savedPrescriptions.find((r) => r.id === rxId);
    if (rx) {
      setLinkedPrescriptionDetails(rx);
      setIsPrescriptionLinked(true);
      setSelectedFileName(`${rx.code} - ${rx.doctor}`);
      
      // Auto attach in context
      attachPrescription(product.id, `${rx.code} (${language === "ar" ? rx.doctor_ar : rx.doctor})`);
    }
  };

  // Chatbot flow trigger
  const handleOpenChat = () => {
    setShowPharmacistChat(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: "msg-1",
          sender: "pharmacist",
          text_en: `Hello! I am Dr. Hisham, your YUSUR pharmacist advisor. How can I assist you with ${product.name_en} today?`,
          text_ar: `أهلاً بك! أنا الدكتور هشام، مستشار الصيدلة الخاص بك في يسر. كيف يمكنني مساعدتك بخصوص ${product.name_ar} اليوم؟`
        }
      ]);
    }
  };

  const triggerChatResponse = (userMsgText, answerKey) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text_en: userMsgText,
      text_ar: userMsgText
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let pharmacistTextEn = "";
      let pharmacistTextAr = "";

      if (answerKey === "dosage") {
        pharmacistTextEn = product.category === "medications" 
          ? `For ${product.name_en}, the standard dosage is 1 tablet every 6-8 hours as needed, maximum 4 grams/day. Please confirm with your prescription.`
          : `For ${product.name_en}, we recommend consuming 1 serving daily with breakfast for optimal performance.`;
        pharmacistTextAr = product.category === "medications"
          ? `بالنسبة لـ ${product.name_ar}، الجرعة القياسية هي قرص واحد كل ٦-٨ ساعات عند الحاجة، بحد أقصى ٤ جرام يومياً. يرجى التأكد من الوصفة.`
          : `بخصوص لـ ${product.name_ar}، نوصي بتناول حصة واحدة يومياً مع الإفطار لتحقيق أفضل فاعلية.`;
      } else if (answerKey === "side_effects") {
        pharmacistTextEn = `Common side effects are minor and include mild nausea, dry mouth, or drowsiness. Stop usage if rash or hives develop.`;
        pharmacistTextAr = `الأعراض الجانبية الشائعة طفيفة وتشمل غثيان خفيف، جفاف الفم، أو النعاس. توقف عن الاستخدام في حال ظهور طفح جلدي.`;
      } else if (answerKey === "interactions") {
        pharmacistTextEn = `Avoid taking this alongside other liver-metabolized drugs or alcohol. Tell us if you take blood thinners.`;
        pharmacistTextAr = `تجنب تناول هذا الدواء مع أدوية أخرى تستقلب في الكبد. أخبرنا إذا كنت تتناول أدوية مسيلة للدم.`;
      } else {
        pharmacistTextEn = `Thank you for your inquiry about ${product.name_en}. A licensed pharmacist will review this chat and message you directly in the app.`;
        pharmacistTextAr = `شكراً لاستفسارك بخصوص ${product.name_ar}. سيقوم صيدلي مرخص بمراجعة المحادثة والرد عليك مباشرة عبر التطبيق.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ph-${Date.now()}`,
          sender: "pharmacist",
          text_en: pharmacistTextEn,
          text_ar: pharmacistTextAr
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendCustomMessage = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    const txt = customQuestion;
    setCustomQuestion("");
    triggerChatResponse(txt, "custom");
  };

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Styles for PDP animations */}
      <style>{`
        .collapsible-header:hover {
          background-color: var(--bg) !important;
        }
        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          borderRadius: 12px;
          fontSize: 13px;
          lineHeight: 1.4;
        }
        .chat-bubble-ph {
          background-color: var(--bg);
          color: var(--text-1);
          border-inline-start: 3px solid var(--primary);
          align-self: flex-start;
        }
        .chat-bubble-user {
          background-color: var(--primary);
          color: white;
          align-self: flex-end;
        }
        @keyframes pulseAlert {
          0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          100% { box-shadow: 0 0 0 8px rgba(225, 29, 72, 0); }
        }
        .rx-alert-pulse {
          animation: pulseAlert 1.5s infinite;
        }
      `}</style>

      {/* Breadcrumbs */}
      <nav 
        style={{ 
          fontSize: "12px", 
          color: "var(--text-2)", 
          marginBottom: "16px", 
          display: "flex", 
          alignItems: "center", 
          gap: "6px",
          flexWrap: "wrap" 
        }}
      >
        <Link href="/home" style={{ color: "var(--text-2)", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-2)'}>
          {language === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span>&gt;</span>
        <Link href={`/search?cat=${product.category}`} style={{ color: "var(--text-2)", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-2)'}>
          {categoryLabel}
        </Link>
        <span>&gt;</span>
        <span style={{ color: "var(--text-1)", fontWeight: "600" }}>{productName}</span>
      </nav>

      {/* Product Gating alerts (SFDA warnings) */}
      {product.isRx && (
        <div 
          className="rx-alert-pulse"
          style={{
            backgroundColor: "rgba(225, 29, 72, 0.06)",
            border: "1.5px solid var(--danger)",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <div>
            <strong style={{ display: "block", color: "var(--danger)", fontSize: "13px", fontWeight: "800" }}>{t.rxBadge}</strong>
            <span style={{ fontSize: "11px", color: "var(--text-1)", marginTop: "2px", display: "block" }}>{t.rxDesc}</span>
          </div>
        </div>
      )}

      <div className="pdp-container">
        {/* LEFT COLUMN: Gallery */}
        <div className="pdp-image-col" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Main Image 1:1 Box */}
          <div 
            className="pdp-gallery" 
            style={{ 
              width: "100%",
              aspectRatio: "1/1",
              height: "auto",
              maxHeight: "360px",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "96px", 
              position: "relative",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              backgroundColor: "var(--surface)",
              overflow: "hidden"
            }}
          >
            <span>{galleryImages[activeImg]}</span>
            
            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                position: "absolute",
                top: "16px",
                insetInlineEnd: "16px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "18px",
                boxShadow: "var(--shadow-sm)",
                zIndex: 10
              }}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Interactive dot indicators (Screen 14 specification) */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBlock: "6px" }}>
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                style={{
                  width: activeImg === idx ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: activeImg === idx ? "var(--primary)" : "var(--border)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.25s ease"
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails grid */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  border: `2px solid ${activeImg === idx ? "var(--primary)" : "var(--border)"}`,
                  backgroundColor: "var(--surface)",
                  fontSize: "24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s"
                }}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Details */}
        <div className="pdp-details-col" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Pharmacy source linking */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href={`/pharmacies/${activeVendor.id}`}
              style={{ 
                fontSize: "12px", 
                color: "var(--primary)", 
                fontWeight: "800", 
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              🏥 {language === "ar" ? activeVendor.name_ar : activeVendor.name_en}
            </Link>
            <span style={{ fontSize: "11px", color: "var(--text-2)" }}>|</span>
            <span style={{ fontSize: "11px", color: "var(--text-2)" }}>⭐ {activeVendor.rating}</span>
          </div>
          
          {/* Product name & rating */}
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>{productName}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <span style={{ color: "var(--warning)", fontWeight: "700" }}>★ {product.rating}</span>
            <span style={{ color: "var(--text-2)" }}>({product.reviewsCount} reviews / مراجعة)</span>
          </div>

          {/* Pricing Row matching active vendor selection */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <span style={{ fontSize: "26px", fontWeight: "800", color: "var(--primary)" }}>
              {activeVendor.price.toFixed(2)} {t.sar}
            </span>
            {activeVendor.originalPrice && activeVendor.originalPrice > activeVendor.price && (
              <>
                <span style={{ fontSize: "14px", textDecoration: "line-through", color: "var(--text-2)" }}>
                  {activeVendor.originalPrice.toFixed(2)} {t.sar}
                </span>
                <span style={{ fontSize: "11px", backgroundColor: "rgba(225, 29, 72, 0.1)", color: "var(--danger)", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                  %{Math.round(((activeVendor.originalPrice - activeVendor.price) / activeVendor.originalPrice) * 100)} {language === "ar" ? "خصم" : "OFF"}
                </span>
              </>
            )}
          </div>

          {/* Multi-Vendor alternative sellers picker (Radio selections) */}
          <div style={{ backgroundColor: "var(--surface)", border: "1.5px solid var(--primary)", borderRadius: "16px", padding: "16px", boxShadow: "var(--shadow-sm)" }}>
            <h4 style={{ fontSize: "13px", fontWeight: "800", marginBottom: "12px", color: "var(--text-1)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>🔁</span> {t.alternative}
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {availableVendors.map((vendor) => {
                const isSelected = selectedVendorId === vendor.id;
                const vName = language === "ar" ? vendor.name_ar : vendor.name_en;
                const vEta = language === "ar" ? vendor.deliveryEta_ar : vendor.deliveryEta_en;

                return (
                  <label 
                    key={vendor.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: isSelected ? "rgba(15, 108, 189, 0.02)" : "transparent",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="vendor-selection"
                      checked={isSelected}
                      onChange={() => setSelectedVendorId(vendor.id)}
                      style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                    />
                    
                    <span style={{ fontSize: "20px" }}>{vendor.logo}</span>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-1)" }}>{vName}</span>
                        <strong style={{ fontSize: "13px", color: isSelected ? "var(--primary)" : "var(--text-1)" }}>
                          {vendor.price.toFixed(2)} {t.sar}
                        </strong>
                      </div>
                      
                      <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "var(--text-2)", marginTop: "2px" }}>
                        <span>⭐ {vendor.rating}</span>
                        <span>•</span>
                        <span>📍 {vendor.distance} {t.km}</span>
                        <span>•</span>
                        <span>⏱️ {vEta}</span>
                        <span>•</span>
                        <span>🚗 {vendor.deliveryFee === 0 ? t.free : `${vendor.deliveryFee} ${t.sar}`}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Collapsible Accordions (Description, Directions, Warnings, Ingredients) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            
            {/* Description Tab */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--surface)" }}>
              <div 
                className="collapsible-header"
                onClick={() => toggleTab("description")}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer", fontWeight: "700", fontSize: "13px", color: "var(--text-1)" }}
              >
                <span>📝 {t.description}</span>
                <span style={{ transition: "transform 0.2s", transform: openTabs.description ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.description && (
                <div style={{ padding: "12px 16px", fontSize: "12.5px", color: "var(--text-2)", borderTop: "1px solid var(--border)", lineHeight: "1.5" }}>
                  {desc}
                </div>
              )}
            </div>

            {/* Directions Tab */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--surface)" }}>
              <div 
                className="collapsible-header"
                onClick={() => toggleTab("directions")}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer", fontWeight: "700", fontSize: "13px", color: "var(--text-1)" }}
              >
                <span>💡 {t.directions}</span>
                <span style={{ transition: "transform 0.2s", transform: openTabs.directions ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.directions && (
                <div style={{ padding: "12px 16px", fontSize: "12.5px", color: "var(--text-2)", borderTop: "1px solid var(--border)", lineHeight: "1.5" }}>
                  {language === "ar" ? extraProductDetails.directions.ar : extraProductDetails.directions.en}
                </div>
              )}
            </div>

            {/* Warnings Tab */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--surface)" }}>
              <div 
                className="collapsible-header"
                onClick={() => toggleTab("warnings")}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer", fontWeight: "700", fontSize: "13px", color: "var(--text-1)" }}
              >
                <span>⚠️ {t.warnings}</span>
                <span style={{ transition: "transform 0.2s", transform: openTabs.warnings ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.warnings && (
                <div style={{ padding: "12px 16px", fontSize: "12.5px", color: "var(--danger)", borderTop: "1px solid var(--border)", lineHeight: "1.5", fontWeight: "500" }}>
                  {language === "ar" ? extraProductDetails.warnings.ar : extraProductDetails.warnings.en}
                </div>
              )}
            </div>

            {/* Ingredients Tab */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--surface)" }}>
              <div 
                className="collapsible-header"
                onClick={() => toggleTab("ingredients")}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer", fontWeight: "700", fontSize: "13px", color: "var(--text-1)" }}
              >
                <span>🧪 {t.ingredients}</span>
                <span style={{ transition: "transform 0.2s", transform: openTabs.ingredients ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.ingredients && (
                <div style={{ padding: "12px 16px", fontSize: "12.5px", color: "var(--text-2)", borderTop: "1px solid var(--border)", lineHeight: "1.5" }}>
                  {language === "ar" ? extraProductDetails.ingredients.ar : extraProductDetails.ingredients.en}
                </div>
              )}
            </div>

          </div>

          {/* Cold chain / Expiry tags */}
          {product.isColdChain && (
            <div style={{ backgroundColor: "rgba(14, 165, 233, 0.05)", border: "1px dashed var(--info)", padding: "12px", borderRadius: "12px", color: "var(--info)", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <strong style={{ fontWeight: "700" }}>❄️ {t.coldChain}</strong>
              <span>{t.coldDesc}</span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", backgroundColor: "var(--bg)", padding: "8px 12px", borderRadius: "8px" }}>
            <span>📅</span>
            <div>
              <strong style={{ display: "block", fontWeight: "700" }}>{t.expiry}</strong>
              <span style={{ color: "var(--text-2)" }}>{t.expiryDate}</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Purchase Panel Sidebar */}
        <div className="pdp-purchase-col" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", height: "fit-content", position: "sticky", top: "100px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "700" }}>Price / الإجمالي</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
              <span style={{ fontSize: "26px", fontWeight: "800", color: "var(--primary)" }}>
                {((cartItem ? cartItem.quantity : 1) * activeVendor.price).toFixed(2)}
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-2)" }}>{t.sar}</span>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingBlock: "10px" }}>
            <div>🚗 {language === "ar" ? `التوصيل بواسطة ${activeVendor.name_ar}` : `Delivery by ${activeVendor.name_en}`}</div>
            <div style={{ fontWeight: "700", color: "var(--text-1)", marginTop: "4px" }}>
              ⏱️ {language === "ar" ? `الوقت المتوقع: ${activeVendor.deliveryEta_ar}` : `Estimated Time: ${activeVendor.deliveryEta_en}`}
            </div>
          </div>

          {/* Saved Prescription Checker for POM Gating */}
          {product.isRx && !cartItem && (
            <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <strong style={{ fontSize: "11px", color: "var(--text-1)", fontWeight: "700" }}>📋 {t.checkRx}</strong>
              
              {!isPrescriptionLinked ? (
                <>
                  <span style={{ fontSize: "10px", color: "var(--text-2)" }}>{t.savedRxHeader}:</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {savedPrescriptions.map((rx) => (
                      <button
                        key={rx.id}
                        onClick={() => handleLinkPrescription(rx.id)}
                        className="btn-secondary"
                        style={{ padding: "6px 8px", fontSize: "10px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", textAlign: "start", height: "auto" }}
                      >
                        <strong style={{ color: "var(--primary)" }}>{language === "ar" ? rx.doctor_ar : rx.doctor}</strong>
                        <span>{language === "ar" ? rx.hospital_ar : rx.hospital} • {rx.date}</span>
                        <code style={{ fontSize: "9px", backgroundColor: "rgba(0,0,0,0.05)", padding: "1px 4px", borderRadius: "3px" }}>{rx.code}</code>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ color: "var(--secondary)", fontSize: "11.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>✓</span>
                    <span>{t.rxLinkedSuccess}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-2)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", padding: "6px 8px", borderRadius: "6px" }}>
                    <strong>{language === "ar" ? linkedPrescriptionDetails.doctor_ar : linkedPrescriptionDetails.doctor}</strong>
                    <div>{linkedPrescriptionDetails.code}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsPrescriptionLinked(false);
                      setLinkedPrescriptionDetails(null);
                      setSelectedFileName("");
                    }} 
                    style={{ background: "transparent", border: "none", color: "var(--danger)", fontSize: "10px", cursor: "pointer", textDecoration: "underline", alignSelf: "flex-end" }}
                  >
                    {language === "ar" ? "إلغاء الربط" : "Unlink Prescription"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Add / Adjust quantity flow */}
          {cartItem ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--bg)", padding: "8px 16px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Qty / الكمية</span>
                <div className="qty-counter" style={{ padding: "4px 8px" }}>
                  <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}>-</button>
                  <span className="qty-val" style={{ minWidth: "16px" }}>{cartItem.quantity}</span>
                  <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="btn-secondary" onClick={() => router.push("/cart")}>
                🛒 View Cart / عرض السلة
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={handleAddAction}
                className="btn-primary"
                style={{ width: "100%" }}
              >
                {product.isRx && !isPrescriptionLinked ? `📋 ${t.uploadRx}` : `🛒 ${t.addToCart}`}
              </button>
              
              {/* Consult Pharmacist Help trigger */}
              <button
                onClick={handleOpenChat}
                className="btn-secondary"
                style={{ width: "100%", gap: "6px" }}
              >
                💬 {t.consult}
              </button>
            </div>
          )}

          {cartItem && cartItem.isRx && cartItem.rxFile && (
            <div style={{ fontSize: "11px", color: "var(--secondary)", backgroundColor: "rgba(24, 182, 122, 0.05)", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✓</span>
              <span>{t.rxAttached}: {cartItem.rxFile}</span>
            </div>
          )}
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR (Always holds primary & secondary actions for conversion route) */}
      <div className="sticky-bottom-bar mobile-only" style={{ gap: "10px" }}>
        <div style={{ minWidth: "80px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-2)", display: "block" }}>Total Price</span>
          <strong style={{ fontSize: "17px", color: "var(--primary)" }}>
            {((cartItem ? cartItem.quantity : 1) * activeVendor.price).toFixed(2)} {t.sar}
          </strong>
        </div>

        {cartItem ? (
          <div className="qty-counter" style={{ padding: "6px 12px", gap: "16px", flex: 1, justifyContent: "space-between" }}>
            <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)} style={{ width: "28px", height: "28px", fontSize: "16px" }}>-</button>
            <span className="qty-val" style={{ fontSize: "14px", minWidth: "20px" }}>{cartItem.quantity}</span>
            <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)} style={{ width: "28px", height: "28px", fontSize: "16px" }}>+</button>
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, gap: "6px" }}>
            <button
              onClick={handleOpenChat}
              className="btn-secondary"
              style={{ width: "auto", paddingInline: "12px", fontSize: "11px" }}
              title={t.consult}
            >
              💬
            </button>
            <button
              onClick={handleAddAction}
              className="btn-primary"
              style={{ width: "auto", flex: 1, fontSize: "12px", padding: "8px" }}
            >
              {product.isRx && !isPrescriptionLinked ? `📋 ${t.uploadRx}` : `🛒 ${t.addToCart}`}
            </button>
          </div>
        )}
      </div>

      {/* Prescription Upload Dialog Modal */}
      {showRxModal && (
        <div className="modal-overlay" onClick={() => setShowRxModal(false)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleRxSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>📋 {t.uploadRx}</h3>
              <button className="btn-icon" type="button" onClick={() => setShowRxModal(false)}>✕</button>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--text-2)" }}>
              {language === "ar" ? "يرجى تحميل صورة الوصفة الطبية للاستمرار في شراء هذا الدواء." : "Please upload a photo of your doctor's prescription to purchase this medicine."}
            </p>

            {/* Quick Selection Dropdown in Modal as well */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBlock: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <strong style={{ fontSize: "11px" }}>{language === "ar" ? "أو اختر من الوصفات المسجلة" : "Or Select Saved Prescription:"}</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {savedPrescriptions.map((rx) => (
                  <button
                    key={rx.id}
                    type="button"
                    onClick={() => {
                      handleLinkPrescription(rx.id);
                      setShowRxModal(false);
                    }}
                    className="btn-secondary"
                    style={{ padding: "8px", fontSize: "11px", textAlign: "start", height: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div>
                      <strong>{language === "ar" ? rx.doctor_ar : rx.doctor}</strong>
                      <div style={{ fontSize: "9px", color: "var(--text-2)" }}>{language === "ar" ? rx.hospital_ar : rx.hospital}</div>
                    </div>
                    <code style={{ fontSize: "9px" }}>{rx.code}</code>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBlock: "10px" }}>
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
                <span style={{ fontSize: "13px", fontWeight: "700" }}>{t.camera}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const name = e.target.files[0]?.name || "rx_scan.png";
                    setSelectedFileName(name);
                  }}
                  style={{ display: "none" }}
                />
              </label>

              <div style={{ textAlign: "center", fontSize: "11px", color: "var(--text-2)" }}>OR</div>

              <input
                type="text"
                placeholder={language === "ar" ? "أو أدخل رقم الوصفة الموحد (وصفتي)" : "Or enter National Rx ID (Wasfaty)"}
                className="form-input"
                value={selectedFileName}
                onChange={(e) => setSelectedFileName(e.target.value)}
              />
            </div>

            {selectedFileName && (
              <div style={{ fontSize: "12px", backgroundColor: "rgba(24,182,122,0.1)", color: "var(--secondary)", padding: "8px 12px", borderRadius: "8px", fontWeight: "600" }}>
                ✓ {t.rxAttached}: {selectedFileName}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={!selectedFileName}>
              {t.submit}
            </button>
          </form>
        </div>
      )}

      {/* Pharmacist Helpline chat drawer (Modal sheets style) */}
      {showPharmacistChat && (
        <div className="modal-overlay" onClick={() => setShowPharmacistChat(false)}>
          <div 
            className="modal-sheet" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: "400px", 
              height: "85vh", 
              display: "flex", 
              flexDirection: "column", 
              padding: 0,
              borderRadius: "20px 20px 0 0",
              overflow: "hidden"
            }}
          >
            {/* Chat header */}
            <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--primary)", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "28px" }}>👨‍⚕️</span>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "800", margin: 0, color: "white" }}>{t.chatTitle}</h3>
                  <span style={{ fontSize: "11px", opacity: 0.9 }}>{t.chatSubtitle}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPharmacistChat(false)} 
                style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Chat messages canvas */}
            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#F1F5F9" }}>
              {chatMessages.map((msg) => {
                const isPharmacist = msg.sender === "pharmacist";
                const text = language === "ar" ? msg.text_ar : msg.text_en;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`chat-bubble ${isPharmacist ? "chat-bubble-ph" : "chat-bubble-user"}`}
                    style={{
                      alignSelf: isPharmacist ? "flex-start" : "flex-end",
                      backgroundColor: isPharmacist ? "var(--surface)" : "var(--primary)",
                      color: isPharmacist ? "var(--text-1)" : "white",
                      borderInlineStart: isPharmacist ? "3px solid var(--primary)" : "none",
                      boxShadow: "var(--shadow-sm)"
                    }}
                  >
                    {text}
                  </div>
                );
              })}

              {isTyping && (
                <div 
                  className="chat-bubble chat-bubble-ph"
                  style={{ alignSelf: "flex-start", backgroundColor: "var(--surface)", borderInlineStart: "3px solid var(--primary)", display: "flex", gap: "4px", padding: "10px 18px" }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--text-2)", display: "inline-block", animation: "pulsePin 1s infinite alternate" }}></span>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--text-2)", display: "inline-block", animation: "pulsePin 1s infinite alternate", animationDelay: "0.2s" }}></span>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--text-2)", display: "inline-block", animation: "pulsePin 1s infinite alternate", animationDelay: "0.4s" }}></span>
                </div>
              )}
            </div>

            {/* Smart Option Chips */}
            <div style={{ padding: "10px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px", overflowX: "auto", backgroundColor: "var(--surface)" }}>
              <button 
                type="button" 
                onClick={() => triggerChatResponse(language === "ar" ? "ما هي الجرعة الصحيحة؟" : "What is the dosage?", "dosage")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", fontSize: "11px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                💊 {language === "ar" ? "الجرعة" : "Dosage"}
              </button>
              <button 
                type="button" 
                onClick={() => triggerChatResponse(language === "ar" ? "هل هناك أعراض جانبية؟" : "Are there side effects?", "side_effects")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", fontSize: "11px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                ⚠️ {language === "ar" ? "الأعراض الجانبية" : "Side Effects"}
              </button>
              <button 
                type="button" 
                onClick={() => triggerChatResponse(language === "ar" ? "التداخلات الدوائية؟" : "Drug interactions?", "interactions")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", fontSize: "11px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔁 {language === "ar" ? "التداخلات" : "Interactions"}
              </button>
            </div>

            {/* Chat Input panel */}
            <form onSubmit={handleSendCustomMessage} style={{ padding: "10px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px", backgroundColor: "var(--surface)" }}>
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "13px" }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: "auto", paddingInline: "16px", fontSize: "12px" }}
              >
                {t.btnSend}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
