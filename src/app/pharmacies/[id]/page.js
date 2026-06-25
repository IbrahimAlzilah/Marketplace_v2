"use client";

import React, { use, useState } from "react";
import { useApp } from "@/context/AppContext";
import { mockPharmacies, mockProducts } from "@/mock/data";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

export default function PharmacyDetailPage({ params }) {
  const resolvedParams = use(params);
  const pharmacyId = resolvedParams.id;

  const { language } = useApp();
  const router = useRouter();

  const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
  const products = mockProducts.filter((p) => p.pharmacyId === pharmacyId);

  const [selectedCat, setSelectedCat] = useState("all");

  if (!pharmacy) {
    return <div className="empty-state">Pharmacy Not Found</div>;
  }

  const name = language === "ar" ? pharmacy.name_ar : pharmacy.name_en;
  const eta = language === "ar" ? pharmacy.deliveryEta_ar : pharmacy.deliveryEta_en;

  const t = {
    back: language === "ar" ? "الصيدليات" : "Pharmacies",
    reviews: language === "ar" ? "تقييمات العملاء" : "Customer Reviews",
    catalog: language === "ar" ? "دليل المنتجات" : "Product Catalog",
    all: language === "ar" ? "الكل" : "All",
    medications: language === "ar" ? "الأدوية" : "Medicines",
    vitamins: language === "ar" ? "الفيتامينات" : "Vitamins",
    baby: language === "ar" ? "العناية بالطفل" : "Baby Care",
    beauty: language === "ar" ? "العناية بالبشرة" : "Skin Care",
    devices: language === "ar" ? "الأجهزة الطبية" : "Medical Devices",
    personal: language === "ar" ? "العناية الشخصية" : "Personal Care",
    fitness: language === "ar" ? "الرشاقة والرياضة" : "Fitness",
    herbal: language === "ar" ? "المنتجات العشبية" : "Herbal",
    sar: language === "ar" ? "ر.س" : "SAR",
    fee: language === "ar" ? "رسوم التوصيل:" : "Delivery Fee:"
  };

  const categories = [
    { id: "all", label: t.all },
    { id: "medications", label: t.medications },
    { id: "vitamins", label: t.vitamins },
    { id: "baby", label: t.baby },
    { id: "beauty", label: t.beauty },
    { id: "devices", label: t.devices },
    { id: "personal", label: t.personal },
    { id: "fitness", label: t.fitness },
    { id: "herbal", label: t.herbal }
  ];

  const filteredProducts = selectedCat === "all"
    ? products
    : products.filter((p) => p.category === selectedCat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Back navigation */}
      {/* <button
        onClick={() => router.push("/pharmacies")}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
          fontWeight: "700",
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        ← {t.back}
      </button> */}

      {/* Header card details */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          gap: "16px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ fontSize: "48px", width: "64px", height: "64px", backgroundColor: "var(--bg)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {pharmacy.logo}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>{name}</h2>
          <span style={{ color: "var(--warning)", fontWeight: "600", fontSize: "14px" }}>
            ★ {pharmacy.rating.toFixed(1)} ({pharmacy.reviewsCount} {t.reviews})
          </span>
          <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-2)", marginTop: "8px" }}>
            <span>⏱️ {eta}</span>
            <span>🚗 {t.fee} {pharmacy.deliveryFee === 0 ? "Free" : `${pharmacy.deliveryFee} ${t.sar}`}</span>
          </div>
        </div>
      </div>

      {/* Product Categories row */}
      <div className="horizontal-scroll" style={{ display: "flex", gap: "8px" ,borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: `1.5px solid ${selectedCat === cat.id ? "var(--primary)" : "var(--border)"}`,
              backgroundColor: selectedCat === cat.id ? "var(--primary)" : "var(--surface)",
              color: selectedCat === cat.id ? "var(--text-on-primary)" : "var(--text-2)",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px" }}>{t.catalog} ({filteredProducts.length})</h3>
        {filteredProducts.length > 0 ? (
          <div className="product-grid" style={{ marginBottom: "20px" }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">💊</span>
            <span className="empty-title">{t.catalog} Empty</span>
          </div>
        )}
      </div>

      {/* Collapsible Reviews block */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "20px"
        }}
      >
        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>💬 {t.reviews}</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "var(--warning)" }}>
              <span>★★★★★</span>
              <span style={{ color: "var(--text-2)" }}>18-06-2026</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-1)", marginTop: "4px" }}>
              {language === "ar" ? "توصيل سريع جداً وتعامل محترم من الصيدلي." : "Very fast delivery, and the pharmacist was extremely helpful."}
            </p>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "var(--warning)" }}>
              <span>★★★★☆</span>
              <span style={{ color: "var(--text-2)" }}>15-06-2026</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-1)", marginTop: "4px" }}>
              {language === "ar" ? "التغليف ممتاز ومبرد بشكل جيد." : "Packaging was excellent and properly cold-chain insulated."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
