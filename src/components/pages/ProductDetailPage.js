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
    <div className="pdp-wrapper-main">
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
      <nav className="pdp-breadcrumbs">
        <Link href="/home" className="pdp-breadcrumb-link">
          {language === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span>&gt;</span>
        <Link href={`/search?cat=${product.category}`} className="pdp-breadcrumb-link">
          {categoryLabel}
        </Link>
        <span>&gt;</span>
        <span className="pdp-breadcrumb-current">{productName}</span>
      </nav>

      {/* Product Gating alerts (SFDA warnings) */}
      {product.isRx && (
        <div className="rx-alert-pulse pdp-rx-alert">
          <span className="pdp-rx-alert-icon">⚠️</span>
          <div>
            <strong className="pdp-rx-alert-title">{t.rxBadge}</strong>
            <span className="pdp-rx-alert-desc">{t.rxDesc}</span>
          </div>
        </div>
      )}

      <div className="pdp-container">
        {/* LEFT COLUMN: Gallery */}
        <div className="pdp-image-col">
          
          {/* Main Image 1:1 Box */}
          <div className="pdp-gallery pdp-gallery-container">
            <span>{galleryImages[activeImg]}</span>
            
            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="pdp-wishlist-btn"
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Interactive dot indicators (Screen 14 specification) */}
          <div className="pdp-slider-dots">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`pdp-slider-dot ${activeImg === idx ? "active" : ""}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails grid */}
          <div className="pdp-thumbnails-row">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`pdp-thumbnail-btn ${activeImg === idx ? "active" : ""}`}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Details */}
        <div className="pdp-details-col">
          
          {/* Pharmacy source linking */}
          <div className="pdp-vendor-link-row">
            <Link
              href={`/pharmacies/${activeVendor.id}`}
              className="pdp-vendor-link"
            >
              🏥 {language === "ar" ? activeVendor.name_ar : activeVendor.name_en}
            </Link>
            <span className="pdp-meta-span">|</span>
            <span className="pdp-meta-span">⭐ {activeVendor.rating}</span>
          </div>
          
          {/* Product name & rating */}
          <h1 className="pdp-product-name">{productName}</h1>
          <div className="pdp-rating-row">
            <span className="pdp-rating-star">★ {product.rating}</span>
            <span className="pdp-rating-count">({product.reviewsCount} reviews / مراجعة)</span>
          </div>

          {/* Pricing Row matching active vendor selection */}
          <div className="pdp-price-row">
            <span className="pdp-price-main">
              {activeVendor.price.toFixed(2)} {t.sar}
            </span>
            {activeVendor.originalPrice && activeVendor.originalPrice > activeVendor.price && (
              <>
                <span className="pdp-price-original">
                  {activeVendor.originalPrice.toFixed(2)} {t.sar}
                </span>
                <span className="pdp-price-discount">
                  %{Math.round(((activeVendor.originalPrice - activeVendor.price) / activeVendor.originalPrice) * 100)} {language === "ar" ? "خصم" : "OFF"}
                </span>
              </>
            )}
          </div>

          {/* Multi-Vendor alternative sellers picker (Radio selections) */}
          <div className="pdp-alternatives-card">
            <h4 className="pdp-alternatives-header">
              <span>🔁</span> {t.alternative}
            </h4>
            
            <div className="pdp-alternatives-list">
              {availableVendors.map((vendor) => {
                const isSelected = selectedVendorId === vendor.id;
                const vName = language === "ar" ? vendor.name_ar : vendor.name_en;
                const vEta = language === "ar" ? vendor.deliveryEta_ar : vendor.deliveryEta_en;

                return (
                  <label 
                    key={vendor.id}
                    className={`pdp-alternative-label ${isSelected ? "selected" : ""}`}
                  >
                    <input 
                      type="radio" 
                      name="vendor-selection"
                      checked={isSelected}
                      onChange={() => setSelectedVendorId(vendor.id)}
                      className="pdp-alternative-radio"
                    />
                    
                    <span className="pdp-alternative-logo">{vendor.logo}</span>
                    
                    <div className="pdp-alternative-info">
                      <div className="pdp-alternative-row-header">
                        <span className="pdp-alternative-name">{vName}</span>
                        <strong className="pdp-alternative-price">
                          {vendor.price.toFixed(2)} {t.sar}
                        </strong>
                      </div>
                      
                      <div className="pdp-alternative-meta-row">
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
          <div className="pdp-accordion-container">
            
            {/* Description Tab */}
            <div className="pdp-accordion-card">
              <div 
                className="collapsible-header pdp-accordion-header"
                onClick={() => toggleTab("description")}
              >
                <span>📝 {t.description}</span>
                <span className="pdp-accordion-arrow" style={{ transform: openTabs.description ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.description && (
                <div className="pdp-accordion-body">
                  {desc}
                </div>
              )}
            </div>

            {/* Directions Tab */}
            <div className="pdp-accordion-card">
              <div 
                className="collapsible-header pdp-accordion-header"
                onClick={() => toggleTab("directions")}
              >
                <span>💡 {t.directions}</span>
                <span className="pdp-accordion-arrow" style={{ transform: openTabs.directions ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.directions && (
                <div className="pdp-accordion-body">
                  {language === "ar" ? extraProductDetails.directions.ar : extraProductDetails.directions.en}
                </div>
              )}
            </div>

            {/* Warnings Tab */}
            <div className="pdp-accordion-card">
              <div 
                className="collapsible-header pdp-accordion-header"
                onClick={() => toggleTab("warnings")}
              >
                <span>⚠️ {t.warnings}</span>
                <span className="pdp-accordion-arrow" style={{ transform: openTabs.warnings ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.warnings && (
                <div className="pdp-accordion-body-warning">
                  {language === "ar" ? extraProductDetails.warnings.ar : extraProductDetails.warnings.en}
                </div>
              )}
            </div>

            {/* Ingredients Tab */}
            <div className="pdp-accordion-card">
              <div 
                className="collapsible-header pdp-accordion-header"
                onClick={() => toggleTab("ingredients")}
              >
                <span>🧪 {t.ingredients}</span>
                <span className="pdp-accordion-arrow" style={{ transform: openTabs.ingredients ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {openTabs.ingredients && (
                <div className="pdp-accordion-body">
                  {language === "ar" ? extraProductDetails.ingredients.ar : extraProductDetails.ingredients.en}
                </div>
              )}
            </div>

          </div>

          {/* Cold chain / Expiry tags */}
          {product.isColdChain && (
            <div className="pdp-cold-chain-banner">
              <strong className="font-bold">❄️ {t.coldChain}</strong>
              <span>{t.coldDesc}</span>
            </div>
          )}

          <div className="pdp-expiry-banner">
            <span>📅</span>
            <div>
              <strong className="pdp-expiry-label">{t.expiry}</strong>
              <span className="pdp-expiry-date-text">{t.expiryDate}</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Purchase Panel Sidebar */}
        <div className="pdp-purchase-col">
          <div>
            <span className="pdp-purchase-label">Price / الإجمالي</span>
            <div className="pdp-purchase-price-row">
              <span className="pdp-purchase-price-val">
                {((cartItem ? cartItem.quantity : 1) * activeVendor.price).toFixed(2)}
              </span>
              <span className="pdp-purchase-currency">{t.sar}</span>
            </div>
          </div>

          <div className="pdp-delivery-panel">
            <div>🚗 {language === "ar" ? `التوصيل بواسطة ${activeVendor.name_ar}` : `Delivery by ${activeVendor.name_en}`}</div>
            <div className="pdp-delivery-eta">
              ⏱️ {language === "ar" ? `الوقت المتوقع: ${activeVendor.deliveryEta_ar}` : `Estimated Time: ${activeVendor.deliveryEta_en}`}
            </div>
          </div>

          {/* Saved Prescription Checker for POM Gating */}
          {product.isRx && !cartItem && (
            <div className="pdp-prescription-box">
              <strong className="pdp-prescription-header">📋 {t.checkRx}</strong>
              
              {!isPrescriptionLinked ? (
                <>
                  <span className="pdp-prescription-saved-label">{t.savedRxHeader}:</span>
                  <div className="pdp-prescription-list">
                    {savedPrescriptions.map((rx) => (
                      <button
                        key={rx.id}
                        onClick={() => handleLinkPrescription(rx.id)}
                        className="btn-secondary pdp-prescription-select-btn"
                      >
                        <strong className="pdp-prescription-doctor">{language === "ar" ? rx.doctor_ar : rx.doctor}</strong>
                        <span>{language === "ar" ? rx.hospital_ar : rx.hospital} • {rx.date}</span>
                        <code className="pdp-prescription-code-badge">{rx.code}</code>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="pdp-linked-success-wrapper">
                  <div className="pdp-linked-success-line">
                    <span>✓</span>
                    <span>{t.rxLinkedSuccess}</span>
                  </div>
                  <div className="pdp-linked-details-card">
                    <strong>{language === "ar" ? linkedPrescriptionDetails.doctor_ar : linkedPrescriptionDetails.doctor}</strong>
                    <div>{linkedPrescriptionDetails.code}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsPrescriptionLinked(false);
                      setLinkedPrescriptionDetails(null);
                      setSelectedFileName("");
                    }} 
                    className="pdp-unlink-btn"
                  >
                    {language === "ar" ? "إلغاء الربط" : "Unlink Prescription"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Add / Adjust quantity flow */}
          {cartItem ? (
            <div className="pdp-quantity-panel">
              <div className="pdp-qty-row">
                <span className="pdp-qty-label">Qty / الكمية</span>
                <div className="qty-counter">
                  <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}>-</button>
                  <span className="qty-val qty-val-min">{cartItem.quantity}</span>
                  <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="btn-secondary" onClick={() => router.push("/cart")}>
                🛒 View Cart / عرض السلة
              </button>
            </div>
          ) : (
            <div className="pdp-purchase-actions">
              <button
                onClick={handleAddAction}
                className="btn-primary pdp-add-to-cart-btn"
              >
                {product.isRx && !isPrescriptionLinked ? `📋 ${t.uploadRx}` : `🛒 ${t.addToCart}`}
              </button>
              
              {/* Consult Pharmacist Help trigger */}
              <button
                onClick={handleOpenChat}
                className="btn-secondary pdp-consult-btn"
              >
                💬 {t.consult}
              </button>
            </div>
          )}

          {cartItem && cartItem.isRx && cartItem.rxFile && (
            <div className="pdp-attachment-attached-badge">
              <span>✓</span>
              <span>{t.rxAttached}: {cartItem.rxFile}</span>
            </div>
          )}
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR (Always holds primary & secondary actions for conversion route) */}
      <div className="sticky-bottom-bar mobile-only sticky-bottom-bar gap-10">
        <div className="pdp-mobile-price-container">
          <span className="pdp-mobile-price-label">Total Price</span>
          <strong className="pdp-mobile-price-value">
            {((cartItem ? cartItem.quantity : 1) * activeVendor.price).toFixed(2)} {t.sar}
          </strong>
        </div>

        {cartItem ? (
          <div className="qty-counter pdp-mobile-qty-counter">
            <button className="qty-btn pdp-mobile-qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}>-</button>
            <span className="qty-val qty-val-w20-f14">{cartItem.quantity}</span>
            <button className="qty-btn pdp-mobile-qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}>+</button>
          </div>
        ) : (
          <div className="pdp-mobile-actions-row">
            <button
              onClick={handleOpenChat}
              className="btn-secondary pdp-mobile-consult-btn"
              title={t.consult}
            >
              💬
            </button>
            <button
              onClick={handleAddAction}
              className="btn-primary pdp-mobile-add-btn"
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
            <div className="pdp-modal-header">
              <h3 className="pdp-modal-title">📋 {t.uploadRx}</h3>
              <button className="btn-icon" type="button" onClick={() => setShowRxModal(false)}>✕</button>
            </div>
            
            <p className="pdp-modal-desc">
              {language === "ar" ? "يرجى تحميل صورة الوصفة الطبية للاستمرار في شراء هذا الدواء." : "Please upload a photo of your doctor's prescription to purchase this medicine."}
            </p>

            {/* Quick Selection Dropdown in Modal as well */}
            <div className="pdp-modal-quick-select">
              <strong className="pdp-modal-quick-select-title">{language === "ar" ? "أو اختر من الوصفات المسجلة" : "Or Select Saved Prescription:"}</strong>
              <div className="pdp-modal-quick-select-list">
                {savedPrescriptions.map((rx) => (
                  <button
                    key={rx.id}
                    type="button"
                    onClick={() => {
                      handleLinkPrescription(rx.id);
                      setShowRxModal(false);
                    }}
                    className="btn-secondary pdp-modal-rx-select-btn"
                  >
                    <div>
                      <strong>{language === "ar" ? rx.doctor_ar : rx.doctor}</strong>
                      <div className="pdp-modal-hospital-name">{language === "ar" ? rx.hospital_ar : rx.hospital}</div>
                    </div>
                    <code className="pdp-modal-code">{rx.code}</code>
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-modal-upload-block">
              <label className="pdp-modal-upload-dashed">
                <span className="pdp-modal-upload-icon">📷</span>
                <span className="pdp-modal-upload-label-text">{t.camera}</span>
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

              <div className="pdp-modal-or-divider">OR</div>

              <input
                type="text"
                placeholder={language === "ar" ? "أو أدخل رقم الوصفة الموحد (وصفتي)" : "Or enter National Rx ID (Wasfaty)"}
                className="form-input"
                value={selectedFileName}
                onChange={(e) => setSelectedFileName(e.target.value)}
              />
            </div>

            {selectedFileName && (
              <div className="pdp-modal-attached-badge">
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
          <div className="modal-sheet pdp-chat-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Chat header */}
            <div className="pdp-chat-header">
              <div className="pdp-chat-header-left">
                <span className="pdp-chat-header-avatar">👨‍⚕️</span>
                <div>
                  <h3 className="pdp-chat-header-title">{t.chatTitle}</h3>
                  <span className="pdp-chat-header-subtitle">{t.chatSubtitle}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPharmacistChat(false)} 
                className="pdp-chat-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Chat messages canvas */}
            <div className="pdp-chat-canvas">
              {chatMessages.map((msg) => {
                const isPharmacist = msg.sender === "pharmacist";
                const text = language === "ar" ? msg.text_ar : msg.text_en;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`chat-bubble ${isPharmacist ? "chat-bubble-ph" : "chat-bubble-user"}`}
                  >
                    {text}
                  </div>
                );
              })}

              {isTyping && (
                <div className="chat-bubble chat-bubble-ph chat-typing-bubble">
                  <span className="chat-typing-dot"></span>
                  <span className="chat-typing-dot" style={{ animationDelay: "0.2s" }}></span>
                  <span className="chat-typing-dot" style={{ animationDelay: "0.4s" }}></span>
                </div>
              )}
            </div>

            {/* Smart Option Chips */}
            <div className="pdp-chat-chips-row">
              <button 
                type="button" 
                onClick={() => triggerChatResponse(language === "ar" ? "ما هي الجرعة الصحيحة؟" : "What is the dosage?", "dosage")}
                className="pdp-chat-chip-btn"
              >
                💊 {language === "ar" ? "الجرعة" : "Dosage"}
              </button>
              <button 
                type="button" 
                onClick={() => triggerChatResponse(language === "ar" ? "هل هناك أعراض جانبية؟" : "Are there side effects?", "side_effects")}
                className="pdp-chat-chip-btn"
              >
                ⚠️ {language === "ar" ? "الأعراض الجانبية" : "Side Effects"}
              </button>
              <button 
                type="button" 
                onClick={() => triggerChatResponse(language === "ar" ? "التداخلات الدوائية؟" : "Drug interactions?", "interactions")}
                className="pdp-chat-chip-btn"
              >
                🔁 {language === "ar" ? "التداخلات" : "Interactions"}
              </button>
            </div>

            {/* Chat Input panel */}
            <form onSubmit={handleSendCustomMessage} className="pdp-chat-input-row">
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="pdp-chat-input-box"
              />
              <button 
                type="submit" 
                className="btn-primary pdp-chat-send-btn"
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
