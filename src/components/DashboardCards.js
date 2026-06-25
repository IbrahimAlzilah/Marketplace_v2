"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export function WalletCard({ compact = false }) {
  const { language, walletBalance } = useApp();

  const t = {
    wallet: language === "ar" ? "محفظة يسر" : "YUSUR Wallet",
    balance: language === "ar" ? "الرصيد الحالي" : "Current Balance",
    sar: language === "ar" ? "ر.س" : "SAR",
    refunds: language === "ar" ? "مسترجعات:" : "Refunds:",
    promo: language === "ar" ? "رصيد ترويجي:" : "Promo:",
    details: language === "ar" ? "تفاصيل المعاملات" : "Transaction Details"
  };

  return (
    <div className="wallet-card">
      <div className="wallet-card-header">
        <span>{t.wallet}</span>
        {/* {!compact && (
          <Link href="/wallet" style={{ color: "#fff", textDecoration: "underline", fontSize: "11px" }}>
            {t.details}
          </Link>
        )} */}
        <Link href="/wallet" style={{ color: "#fff", textDecoration: "underline", fontSize: "11px" }}>
          {t.details}
        </Link>
      </div>

      <div>
        <span style={{ fontSize: "11px", opacity: 0.8, display: "block" }}>{t.balance}</span>
        <h3 className="wallet-card-balance">
          {walletBalance.toFixed(2)} <span style={{ fontSize: "16px" }}>{t.sar}</span>
        </h3>
      </div>

      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "10px" }}>
          <span>{t.refunds} {(walletBalance * 0.8).toFixed(2)} {t.sar}</span>
          <span>{t.promo} {(walletBalance * 0.2).toFixed(2)} {t.sar}</span>
        </div>
      )}
    </div>
  );
}

export function LoyaltyCard({ compact = false }) {
  const { language, loyaltyPoints } = useApp();

  const valueSar = loyaltyPoints / 50;

  const t = {
    rewards: language === "ar" ? "برنامج الولاء" : "Loyalty Rewards",
    balance: language === "ar" ? "نقاطي" : "My Points",
    value: language === "ar" ? "القيمة المعادلة:" : "Equivalent Value:",
    sar: language === "ar" ? "ر.س" : "SAR",
    points: language === "ar" ? "نقطة" : "pts",
    gold: language === "ar" ? "عضوية ذهبية" : "Gold Member",
    nextTier: language === "ar" ? "باقي 250 نقطة للبلاتيني" : "250 pts to Platinum Tier",
    details: language === "ar" ? "سجل النقاط" : "Points History"
  };

  const percent = Math.min((loyaltyPoints / 1500) * 100, 100);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #b8860b 0%, #d4af37 100%)",
        color: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600" }}>
        <span>{t.rewards} ({t.gold})</span>
        {/* {!compact && (
          <Link href="/loyalty" style={{ color: "#fff", textDecoration: "underline", fontSize: "11px" }}>
            {t.details}
          </Link>
        )} */}
        <Link href="/loyalty" style={{ color: "#fff", textDecoration: "underline", fontSize: "11px" }}>
          {t.details}
        </Link>
      </div>

      <div>
        {compact && (<span style={{ fontSize: "11px", opacity: 0.8, display: "block" }}>{t.balance}</span>)}
        <h3 style={{ fontSize: "28px", fontWeight: "800", marginTop: "4px" }}>
          {loyaltyPoints} <span style={{ fontSize: "14px", fontWeight: "600" }}>{t.points}</span>
        </h3>
        {!compact && (
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            {t.value} {valueSar.toFixed(2)} {t.sar}
          </span>
        )}
      </div>

      {!compact && (
        <div className="loyalty-progress-container" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", opacity: 0.9 }}>
            <span>{loyaltyPoints} / 1500 {t.points}</span>
            <span>{t.nextTier}</span>
          </div>
          <div className="loyalty-progress-bar" style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}>
            <div className="loyalty-progress-fill" style={{ width: `${percent}%`, backgroundColor: "white" }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function WalletLoyaltyUnifiedCard({
  onPointsHistoryClick,
  onTransactionDetailsClick,
  onViewAllClick
}) {
  const { language, walletBalance, loyaltyPoints } = useApp();

  const t = {
    title: language === "ar" ? "المحفظة ونقاط المكافآت" : "Wallet & Loyalty Points",
    subtitle: language === "ar" ? "اكسب نقاطاً مع كل عملية شراء واستبدلها بمزايا حصرية" : "Earn points with every purchase and redeem them for exclusive benefits",
    viewAll: language === "ar" ? "عرض الكل" : "View All",
    loyaltyTitle: language === "ar" ? "نقاط الولاء" : "Loyalty Points",
    walletTitle: language === "ar" ? "رصيد المحفظة" : "Wallet Balance",
    pointsHistory: language === "ar" ? "سجل النقاط" : "Points History",
    transactionDetails: language === "ar" ? "تفاصيل المعاملات" : "TRANSACTION DETAILS",
    pointsUnit: language === "ar" ? "نقطة" : "pts",
    currency: language === "ar" ? "ر.س" : "SAR"
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0b3a60 0%, #1e5a8f 100%)",
        color: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background glass circles behind the View All button */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          [language === "ar" ? "right" : "left"]: "-60px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55px",
          [language === "ar" ? "right" : "left"]: "40px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-50px",
          [language === "ar" ? "left" : "right"]: "-60px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55px",
          [language === "ar" ? "left" : "right"]: "40px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>🎁</span>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "800", margin: 0 }}>{t.title}</h4>
            {/* <p style={{ fontSize: "10px", opacity: 0.8, margin: "2px 0 0 0", lineHeight: "1.3" }}>{t.subtitle}</p> */}
          </div>
        </div>

        <button
          onClick={onViewAllClick}
          type="button"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap"
          }}
        >
          {t.viewAll} <span style={{ fontSize: "9px" }}>{language === "ar" ? "◀" : "▶"}</span>
        </button>
      </div>

      {/* Side-by-side sub-boxes */}
      <div className="unified-sub-boxes" style={{ position: "relative", zIndex: 1 }}>
        {/* Left Sub-box (Loyalty Points) */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "70px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
              ✨ {t.loyaltyTitle}
            </span>
            <button
              onClick={onPointsHistoryClick}
              type="button"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffca28",
                fontSize: "10px",
                fontWeight: "700",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                whiteSpace: "nowrap"
              }}
            >
              {t.pointsHistory}
            </button>
          </div>
          <div style={{ textAlign: "start", marginTop: "8px" }}>
            <strong style={{ fontSize: "16px", fontWeight: "800" }}>
              {loyaltyPoints.toLocaleString()} {t.pointsUnit}
            </strong>
          </div>
        </div>

        {/* Right Sub-box (Wallet Balance) */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "70px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
              👛 {t.walletTitle}
            </span>
            <button
              onClick={onTransactionDetailsClick}
              type="button"
              style={{
                background: "transparent",
                border: "none",
                color: "#81d4fa",
                fontSize: "9px",
                fontWeight: "700",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                textTransform: "uppercase",
                whiteSpace: "nowrap"
              }}
            >
              {t.transactionDetails}
            </button>
          </div>
          <div style={{ textAlign: "start", marginTop: "8px" }}>
            <strong style={{ fontSize: "16px", fontWeight: "800" }}>
              {language === "ar" ? `${walletBalance.toFixed(2)} ${t.currency}` : `${walletBalance.toFixed(2)} ${t.currency}`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
