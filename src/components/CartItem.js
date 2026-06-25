"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function CartItem({ item, onUploadPrescription }) {
  const { language, updateCartQuantity, removeFromCart } = useApp();

  const name = language === "ar" ? item.name_ar : item.name_en;
  
  const t = {
    sar: language === "ar" ? "ر.س" : "SAR",
    rxNeeded: language === "ar" ? "يتطلب وصفة طبية" : "Prescription Required",
    uploadRx: language === "ar" ? "اضغط لرفع الوصفة" : "Tap to upload prescription",
    rxAttached: language === "ar" ? "تم إرفاق الوصفة" : "Prescription attached",
    delete: language === "ar" ? "حذف" : "Remove"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        gap: "8px"
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ fontSize: "28px", width: "48px", height: "48px", backgroundColor: "var(--bg)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.image}
        </div>
        <div style={{ flex: 1 }}>
          <h5 style={{ fontSize: "13px", fontWeight: "600" }}>{name}</h5>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>
            {item.price.toFixed(2)} {t.sar}
          </span>
        </div>
        
        <div className="qty-counter">
          <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
          <span className="qty-val">{item.quantity}</span>
          <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          style={{ background: "transparent", border: "none", fontSize: "16px", cursor: "pointer", color: "var(--danger)" }}
        >
          🗑️
        </button>
      </div>

      {item.isRx && (
        <div
          onClick={() => onUploadPrescription && onUploadPrescription(item)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            backgroundColor: item.rxFile ? "rgba(24, 182, 122, 0.05)" : "rgba(225, 29, 72, 0.05)",
            border: `1px dashed ${item.rxFile ? "var(--secondary)" : "var(--danger)"}`,
            borderRadius: "8px",
            fontSize: "11px",
            cursor: "pointer"
          }}
        >
          <span style={{ color: item.rxFile ? "var(--secondary)" : "var(--danger)", fontWeight: "600" }}>
            📋 {t.rxNeeded}
          </span>
          <span style={{ color: item.rxFile ? "var(--text-1)" : "var(--primary)", fontWeight: "700" }}>
            {item.rxFile ? `${t.rxAttached} (${item.rxFile})` : t.uploadRx}
          </span>
        </div>
      )}
    </div>
  );
}
