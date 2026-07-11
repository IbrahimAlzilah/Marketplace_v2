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
        <Link href="/wallet" className="wallet-card-header-link">
          {t.details}
        </Link>
      </div>

      <div>
        <span className="wallet-card-label">{t.balance}</span>
        <h3 className="wallet-card-balance">
          {walletBalance.toFixed(2)} <span className="wallet-card-currency">{t.sar}</span>
        </h3>
      </div>

      {!compact && (
        <div className="wallet-card-breakdown">
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
    <div className="loyalty-card">
      <div className="loyalty-card-header">
        <span>{t.rewards} ({t.gold})</span>
        <Link href="/loyalty" className="loyalty-card-header-link">
          {t.details}
        </Link>
      </div>

      <div>
        {compact && (<span className="loyalty-card-label">{t.balance}</span>)}
        <h3 className="loyalty-card-points-value">
          {loyaltyPoints} <span className="loyalty-card-points-unit">{t.points}</span>
        </h3>
        {!compact && (
          <span className="loyalty-card-value-equiv">
            {t.value} {valueSar.toFixed(2)} {t.sar}
          </span>
        )}
      </div>

      {!compact && (
        <div className="loyalty-progress-container">
          <div className="loyalty-progress-info">
            <span>{loyaltyPoints} / 1500 {t.points}</span>
            <span>{t.nextTier}</span>
          </div>
          <div className="loyalty-progress-bar">
            <div className="loyalty-progress-fill" style={{ width: `${percent}%` }}></div>
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
    subtitle: language === "ar" ? "اكسب نقاطاً مع كل عملية شراء واستبدلها بمزايا خصرية" : "Earn points with every purchase and redeem them for exclusive benefits",
    viewAll: language === "ar" ? "عرض الكل" : "View All",
    loyaltyTitle: language === "ar" ? "نقاط الولاء" : "Loyalty Points",
    walletTitle: language === "ar" ? "رصيد المحفظة" : "Wallet Balance",
    pointsHistory: language === "ar" ? "سجل النقاط" : "Points History",
    transactionDetails: language === "ar" ? "تفاصيل المعاملات" : "TRANSACTION DETAILS",
    pointsUnit: language === "ar" ? "نقطة" : "pts",
    currency: language === "ar" ? "ر.س" : "SAR"
  };

  return (
    <div className="unified-card">
      {/* Background glass circles behind the View All button */}
      <div className="unified-card-circle-1" />
      <div className="unified-card-circle-2" />
      <div className="unified-card-circle-3" />
      <div className="unified-card-circle-4" />

      {/* Header section */}
      <div className="unified-card-header">
        <div className="unified-card-title-box">
          <span className="unified-card-icon">🎁</span>
          <div>
            <h4 className="unified-card-title">{t.title}</h4>
          </div>
        </div>

        <button
          onClick={onViewAllClick}
          type="button"
          className="unified-view-all-btn"
        >
          {t.viewAll} <span className="unified-btn-arrow">{language === "ar" ? "◀" : "▶"}</span>
        </button>
      </div>

      {/* Side-by-side sub-boxes */}
      <div className="unified-sub-boxes">
        {/* Left Sub-box (Loyalty Points) */}
        <div className="unified-sub-box">
          <div className="unified-sub-box-header">
            <span className="unified-sub-box-title">
              ✨ {t.loyaltyTitle}
            </span>
            <button
              onClick={onPointsHistoryClick}
              type="button"
              className="unified-sub-box-link"
            >
              {t.pointsHistory}
            </button>
          </div>
          <div className="unified-sub-box-value-container">
            <strong className="unified-sub-box-value">
              {loyaltyPoints.toLocaleString()} {t.pointsUnit}
            </strong>
          </div>
        </div>

        {/* Right Sub-box (Wallet Balance) */}
        <div className="unified-sub-box">
          <div className="unified-sub-box-header">
            <span className="unified-sub-box-title">
              👛 {t.walletTitle}
            </span>
            <button
              onClick={onTransactionDetailsClick}
              type="button"
              className="unified-sub-box-link blue-accent"
            >
              {t.transactionDetails}
            </button>
          </div>
          <div className="unified-sub-box-value-container">
            <strong className="unified-sub-box-value">
              {language === "ar" ? `${walletBalance.toFixed(2)} ${t.currency}` : `${walletBalance.toFixed(2)} ${t.currency}`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
