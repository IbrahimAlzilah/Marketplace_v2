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
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <span className="order-card-id">#{order.id}</span>
          <span className="order-card-date">
            {t.date} {order.date}
          </span>
        </div>
        <span
          className="order-card-status-badge"
          style={{
            backgroundColor: currentStatus.color
          }}
        >
          {language === "ar" ? currentStatus.ar : currentStatus.en}
        </span>
      </div>

      <div className="order-card-info">
        <strong className="order-card-pharmacy">
          🏥 {pharmacyName}
        </strong>
        {order.items.map((item) => (
          <div key={item.id} className="order-card-item-row">
            <span>
              {language === "ar" ? item.name_ar : item.name_en} x{item.quantity}
            </span>
            <span>
              {(item.price * item.quantity).toFixed(2)} {t.sar}
            </span>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <span className="order-card-total-box">
          {t.total} <strong className="order-card-total-val">{order.total.toFixed(2)} {t.sar}</strong>
        </span>

        <div className="order-card-actions">
          {order.status === "completed" ? (
            <button
              onClick={handleReorder}
              className="order-card-btn reorder-btn"
            >
              🔄 {t.reorder}
            </button>
          ) : (
            <button
              onClick={() => onTrackClick && onTrackClick(order)}
              className="order-card-btn track-btn"
            >
              📍 {t.track}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
