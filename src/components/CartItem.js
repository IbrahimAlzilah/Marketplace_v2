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
    <div className="cart-item-card">
      <div className="cart-item-main">
        <Link
          href={`/product/${item.id}`}
          className="cart-item-info-link"
        >
          <div className="cart-item-thumbnail">
            {item.image}
          </div>
          <div className="cart-item-text-wrapper">
            <h5 className="cart-item-title">{name}</h5>
            <span className="cart-item-price-tag">
              {item.price.toFixed(2)} {t.sar}
            </span>
          </div>
        </Link>
        
        <div className="qty-counter">
          <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
          <span className="qty-val">{item.quantity}</span>
          <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="cart-item-delete-btn"
        >
          🗑️
        </button>
      </div>

      {item.isRx && (
        <div
          onClick={() => onUploadPrescription && onUploadPrescription(item)}
          className={`cart-item-rx-row ${item.rxFile ? "rx-attached" : "rx-needed"}`}
        >
          <span className={`cart-item-rx-label ${item.rxFile ? "rx-attached" : "rx-needed"}`}>
            📋 {t.rxNeeded}
          </span>
          <span className={`cart-item-rx-action ${item.rxFile ? "rx-attached" : "rx-needed"}`}>
            {item.rxFile ? `${t.rxAttached} (${item.rxFile})` : t.uploadRx}
          </span>
        </div>
      )}
    </div>
  );
}
