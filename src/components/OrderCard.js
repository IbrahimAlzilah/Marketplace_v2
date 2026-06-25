"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function OrderCard({ order, onTrackClick }) {
  const { language, addToCart } = useApp();
  const router = useRouter();

  const pharmacyName = language === "ar" ? order.pharmacyName_ar : order.pharmacyName_en;
  
  const statusTexts = {
    delivering: {
      en: "Out for Delivery",
      ar: "جاري التوصيل",
      color: "var(--info)"
    },
    completed: {
      en: "Completed",
      ar: "مكتمل",
      color: "var(--success)"
    },
    pending_rx: {
      en: "Pending Rx Approval",
      ar: "بانتظار موافقة الوصفة",
      color: "var(--warning)"
    }
  };

  const currentStatus = statusTexts[order.status] || { en: order.status, ar: order.status, color: "var(--text-2)" };

  const t = {
    sar: language === "ar" ? "ر.س" : "SAR",
    items: language === "ar" ? "منتجات" : "items",
    track: language === "ar" ? "تتبع الطلب" : "Track Order",
    reorder: language === "ar" ? "إعادة الطلب" : "Reorder",
    date: language === "ar" ? "التاريخ:" : "Date:",
    total: language === "ar" ? "الإجمالي:" : "Total:"
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      // Find matching item in mockProducts or just build a product outline
      addToCart({
        id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar,
        price: item.price,
        image: "📦",
        pharmacyId: "ph-1", // default fallback
        pharmacyName_en: order.pharmacyName_en,
        pharmacyName_ar: order.pharmacyName_ar
      }, item.quantity);
    });
    router.push("/cart");
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: "700" }}>#{order.id}</span>
          <span style={{ fontSize: "11px", color: "var(--text-2)", marginInlineStart: "8px" }}>
            {t.date} {order.date}
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            padding: "4px 8px",
            borderRadius: "6px",
            color: "white",
            backgroundColor: currentStatus.color
          }}
        >
          {language === "ar" ? currentStatus.ar : currentStatus.en}
        </span>
      </div>

      <div style={{ fontSize: "13px", color: "var(--text-1)" }}>
        <strong style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: "var(--text-2)" }}>
          🏥 {pharmacyName}
        </strong>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBlock: "2px" }}>
            <span>
              {language === "ar" ? item.name_ar : item.name_en} x{item.quantity}
            </span>
            <span>
              {(item.price * item.quantity).toFixed(2)} {t.sar}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "600" }}>
          {t.total} <strong style={{ color: "var(--primary)", fontSize: "15px" }}>{order.total.toFixed(2)} {t.sar}</strong>
        </span>

        <div style={{ display: "flex", gap: "8px" }}>
          {order.status === "completed" ? (
            <button
              onClick={handleReorder}
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              🔄 {t.reorder}
            </button>
          ) : (
            <button
              onClick={() => onTrackClick && onTrackClick(order)}
              style={{
                backgroundColor: "var(--secondary)",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              📍 {t.track}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
