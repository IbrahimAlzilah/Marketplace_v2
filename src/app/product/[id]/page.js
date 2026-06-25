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

  if (!product) {
    return <div className="empty-state">Product Not Found</div>;
  }

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

  const [activeImg, setActiveImg] = useState(0);
  const galleryImages = [
    product.image,
    "📦",
    "🔬",
    "🛡️"
  ];

  const name = language === "ar" ? product.name_ar : product.name_en;
  const desc = language === "ar" ? product.description_ar : product.description_en;
  const pharmacyName = language === "ar" ? product.pharmacyName_ar : product.pharmacyName_en;

  const t = {
    back: language === "ar" ? "الرئيسية" : "Home",
    sar: language === "ar" ? "ر.س" : "SAR",
    rxBadge: language === "ar" ? "وصفة طبية مطلوبة" : "Prescription Required",
    rxDesc: language === "ar" ? "هذا الدواء خاضع للهيئة العامة للغذاء والدواء ولا يصرف إلا بوصفة طبية معتمدة." : "This medicine is regulated by SFDA and requires a valid prescription to dispense.",
    coldChain: language === "ar" ? "سلسلة التبريد مضمونة" : "Cold-Chain Integrity Guaranteed",
    coldDesc: language === "ar" ? "يتم شحن هذا الدواء في حاويات مبردة للحفاظ على فاعليته." : "Insulated refrigerated delivery box matches product cooling standards.",
    expiry: language === "ar" ? "تاريخ انتهاء الصلاحية مضمون" : "Guaranteed Expiry Date",
    expiryDate: language === "ar" ? "صلاحية مضمونة حتى ديسمبر ٢٠٢٧" : "Guaranteed Expiry: Dec 2027 or later",
    description: language === "ar" ? "عن المنتج" : "Description",
    alternative: language === "ar" ? "متوفر أيضاً لدى صيدليات أخرى" : "Also Available at Other Pharmacies",
    addToCart: language === "ar" ? "إضافة إلى السلة" : "Add to Cart",
    uploadRx: language === "ar" ? "رفع الوصفة الطبية" : "Upload Prescription",
    rxAttached: language === "ar" ? "تم إرفاق الوصفة" : "Prescription Attached",
    consult: language === "ar" ? "استشر الصيدلي مجاناً" : "Ask Pharmacist",
    camera: language === "ar" ? "التقاط صورة للوصفة" : "Take Photo of Prescription",
    uploadFile: language === "ar" ? "تحميل ملف (PDF / صورة)" : "Upload File (PDF / Image)",
    submit: language === "ar" ? "تأكيد وإضافة للسلة" : "Confirm & Add",
    km: language === "ar" ? "كم" : "km",
    fee: language === "ar" ? "رسوم التوصيل:" : "Fee:",
    free: language === "ar" ? "مجاني" : "Free"
  };

  const alternativePharmacies = mockPharmacies.filter((ph) => ph.id !== product.pharmacyId).slice(0, 2);

  const handleAddAction = () => {
    if (product.isRx && !selectedFileName && (!cartItem || !cartItem.rxFile)) {
      setShowRxModal(true);
      return;
    }
    addToCart(product, 1);
  };

  const handleRxSubmit = (e) => {
    e.preventDefault();
    const fileName = selectedFileName || "prescription_scan.jpg";
    addToCart(product, 1);
    attachPrescription(product.id, fileName);
    setShowRxModal(false);
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
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

      <div className="pdp-container">
        {/* LEFT COLUMN: Gallery */}
        <div className="pdp-image-col" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="pdp-gallery" style={{ height: "320px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "96px", position: "relative" }}>
            <span>{galleryImages[activeImg]}</span>
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
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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
          
          {/* Pharmacy source */}
          <Link
            href={`/pharmacies/${product.pharmacyId}`}
            style={{ 
              fontSize: "12px", 
              color: "var(--primary)", 
              fontWeight: "700", 
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            🏥 {pharmacyName}
          </Link>
          
          {/* Product name & rating */}
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-1)", margin: 0 }}>{name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <span style={{ color: "var(--warning)" }}>★ {product.rating}</span>
            <span style={{ color: "var(--text-2)" }}>({product.reviewsCount} reviews)</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
            <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--primary)" }}>
              {product.price.toFixed(2)} {t.sar}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "14px", textDecoration: "line-through", color: "var(--text-2)" }}>
                {product.originalPrice.toFixed(2)} {t.sar}
              </span>
            )}
          </div>

          {/* POM Rx regulatory banner */}
          {product.isRx && (
            <div className="rx-notice-box">
              <strong style={{ fontWeight: "700" }}>⚠️ {t.rxBadge}</strong>
              <span>{t.rxDesc}</span>
            </div>
          )}

          {/* Cold chain regulation */}
          {product.isColdChain && (
            <div style={{ backgroundColor: "rgba(14, 165, 233, 0.05)", border: "1px dashed var(--info)", padding: "12px", borderRadius: "12px", color: "var(--info)", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <strong style={{ fontWeight: "700" }}>❄️ {t.coldChain}</strong>
              <span>{t.coldDesc}</span>
            </div>
          )}

          {/* Expiry guarantee */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", backgroundColor: "var(--bg)", padding: "8px 12px", borderRadius: "8px" }}>
            <span>📅</span>
            <div>
              <strong style={{ display: "block", fontWeight: "700" }}>{t.expiry}</strong>
              <span style={{ color: "var(--text-2)" }}>{t.expiryDate}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>{t.description}</h4>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--text-2)" }}>{desc}</p>
          </div>

          {/* Alternative Pharmacies sellers */}
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>🔁 {t.alternative}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alternativePharmacies.map((ph) => (
                <div key={ph.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "20px" }}>🏥</span>
                    <div>
                      <Link
                        href={`/pharmacies/${ph.id}`}
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          display: "block",
                          color: "var(--primary)",
                          textDecoration: "none"
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                      >
                        {language === "ar" ? ph.name_ar : ph.name_en}
                      </Link>
                      <span style={{ fontSize: "10px", color: "var(--text-2)" }}>
                        ⭐ {ph.rating} | 📍 {ph.distance} {t.km} | ⏱️ {language === "ar" ? ph.deliveryEta_ar : ph.deliveryEta_en} | 🚗 {t.fee} {ph.deliveryFee === 0 ? t.free : `${ph.deliveryFee} ${t.sar}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart({ ...product, pharmacyId: ph.id, pharmacyName_en: ph.name_en, pharmacyName_ar: ph.name_ar }, 1);
                      router.push("/cart");
                    }}
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--primary)",
                      border: "1px solid var(--primary)",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    {t.addToCart}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Purchase Sidebar Panel */}
        <div className="pdp-purchase-col" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "var(--shadow-md)" }}>
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", fontWeight: "700" }}>Price / الإجمالي</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
              <span style={{ fontSize: "26px", fontWeight: "800", color: "var(--primary)" }}>
                {((cartItem ? cartItem.quantity : 1) * product.price).toFixed(2)}
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-2)" }}>{t.sar}</span>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingBlock: "10px" }}>
            <div>🚗 {language === "ar" ? `التوصيل بواسطة ${pharmacyName}` : `Delivery by ${pharmacyName}`}</div>
            <div style={{ fontWeight: "700", color: "var(--text-1)", marginTop: "4px" }}>
              ⏱️ {language === "ar" ? "الوقت المتوقع: ٢٥-٤٠ دقيقة" : "Estimated Time: 25-40 mins"}
            </div>
          </div>

          {/* Add / Adjust buttons inside sidebar */}
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
            <button
              onClick={handleAddAction}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {product.isRx ? `📋 ${t.uploadRx}` : `🛒 ${t.addToCart}`}
            </button>
          )}

          {cartItem && cartItem.isRx && cartItem.rxFile && (
            <div style={{ fontSize: "11px", color: "var(--secondary)", backgroundColor: "rgba(24, 182, 122, 0.05)", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✓</span>
              <span>{t.rxAttached}: {cartItem.rxFile}</span>
            </div>
          )}
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR (Hidden on desktop by media queries) */}
      <div className="sticky-bottom-bar mobile-only">
        <div>
          <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block" }}>Total Price</span>
          <strong style={{ fontSize: "18px", color: "var(--primary)" }}>
            {((cartItem ? cartItem.quantity : 1) * product.price).toFixed(2)} {t.sar}
          </strong>
        </div>

        {cartItem ? (
          <div className="qty-counter" style={{ padding: "6px 12px", gap: "16px" }}>
            <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)} style={{ width: "28px", height: "28px", fontSize: "16px" }}>-</button>
            <span className="qty-val" style={{ fontSize: "14px", minWidth: "20px" }}>{cartItem.quantity}</span>
            <button className="qty-btn" onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)} style={{ width: "28px", height: "28px", fontSize: "16px" }}>+</button>
          </div>
        ) : (
          <button
            onClick={handleAddAction}
            className="btn-primary"
            style={{ width: "auto", flex: 1 }}
          >
            {product.isRx ? `📋 ${t.uploadRx}` : `🛒 ${t.addToCart}`}
          </button>
        )}
      </div>

      {/* Prescription upload modal */}
      {showRxModal && (
        <div className="modal-overlay" onClick={() => setShowRxModal(false)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleRxSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>📋 {t.uploadRx}</h3>
              <button className="btn-icon" type="button" onClick={() => setShowRxModal(false)}>✕</button>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--text-2)" }}>
              {language === "ar" ? "يرجى تحميل صورة الوصفة الطبية للاستمرار في شراء هذا المنتج." : "Please upload a photo of your doctor's prescription to purchase this medicine."}
            </p>

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
    </div>
  );
}
