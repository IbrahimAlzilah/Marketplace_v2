"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function ProductCard({ product, disabled = false }) {
  const { language, cart, addToCart, updateCartQuantity, wishlist, toggleWishlist } = useApp();

  const cartItem = cart.find((item) => item.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  const t = {
    rx: language === "ar" ? "وصفة" : "Rx",
    cold: language === "ar" ? "تبريد" : "Cold",
    sar: language === "ar" ? "ر.س" : "SAR",
    add: language === "ar" ? "إضافة" : "Add"
  };

  const name = language === "ar" ? product.name_ar : product.name_en;
  const pharmName = language === "ar" ? product.pharmacyName_ar : product.pharmacyName_en;

  return (
    <div className={`product-card ${disabled ? "disabled" : ""}`}>
      <button className="wishlist-btn" disabled={disabled} onClick={() => toggleWishlist(product.id)}>
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      <div className="product-badge-container">
        {product.isRx && <span className="badge badge-rx">{t.rx}</span>}
        {product.isColdChain && <span className="badge badge-cold">{t.cold}</span>}
        {product.originalPrice && <span className="badge badge-offer">%{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}</span>}
      </div>

      <Link href={disabled ? "#" : `/product/${product.id}`} className={`product-card-link ${disabled ? "disabled" : ""}`}>
        <div className="product-image">{product.image}</div>
        <span className="product-pharmacy">🏥 {pharmName}</span>
        <h4 className="product-name">{name}</h4>
      </Link>

      <div className="product-price-row">
        <div className="price-box">
          <span className="price">
            {product.price.toFixed(2)} <span className="product-currency-small">{t.sar}</span>
          </span>
          {product.originalPrice && (
            <span className="original-price">
              {product.originalPrice.toFixed(2)} {t.sar}
            </span>
          )}
        </div>

        {cartItem ? (
          <div className={`qty-counter ${disabled ? "disabled" : ""}`}>
            <button className="qty-btn" disabled={disabled} onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}>-</button>
            <span className="qty-val">{cartItem.quantity}</span>
            <button className="qty-btn" disabled={disabled} onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}>+</button>
          </div>
        ) : (
          <button className={`add-qty-btn ${disabled ? "disabled" : ""}`} disabled={disabled} onClick={() => addToCart(product, 1)}>
            +
          </button>
        )}
      </div>
    </div>
  );
}
