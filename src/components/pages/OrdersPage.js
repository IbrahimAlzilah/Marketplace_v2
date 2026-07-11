"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const { language, orders, cancelOrder } = useApp();
  const [activeTab, setActiveTab] = useState("active"); // active, history
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showRefundSelector, setShowRefundSelector] = useState(false);

  const handleCancelConfirm = (refundType) => {
    if (!trackingOrder) return;
    cancelOrder(trackingOrder.id, refundType);
    if (refundType === "wallet") {
      alert(
        language === "ar"
          ? `تم إلغاء الطلب #${trackingOrder.id} بنجاح. وتم إرجاع المبلغ لمحفظتك الإلكترونية.`
          : `Order #${trackingOrder.id} was canceled successfully. The amount was refunded to your wallet.`
      );
    } else {
      alert(
        language === "ar"
          ? `تم إلغاء الطلب #${trackingOrder.id} بنجاح. وجاري استرجاع المبلغ لبطاقتك المصرفية خلال ٣-٥ أيام عمل.`
          : `Order #${trackingOrder.id} was canceled successfully. Refund will be processed to your card in 3-5 business days.`
      );
    }
    setShowRefundSelector(false);
    setTrackingOrder(null);
  };

  const t = {
    title: language === "ar" ? "طلباتي" : "My Orders",
    active: language === "ar" ? "الطلبات النشطة" : "Active Orders",
    history: language === "ar" ? "السجل التاريخي" : "Order History",
    empty: language === "ar" ? "لا توجد طلبات" : "No orders found",
    emptyDesc: language === "ar" ? "لم تقم بطلب أي منتجات حتى الآن." : "You have not made any purchases yet.",
    trackTitle: language === "ar" ? "تتبع الطلب" : "Live Delivery Tracking",
    status: language === "ar" ? "حالة الطلب:" : "Order Status:",
    eta: language === "ar" ? "الوقت المتوقع للتوصيل:" : "Delivery ETA:",
    driver: language === "ar" ? "السائق:" : "Driver:",
    call: language === "ar" ? "اتصال" : "Call",
    support: language === "ar" ? "مساعدة طبية" : "Ask Pharmacist",
    timelinePlaced: language === "ar" ? "تم استلام الطلب" : "Order Placed",
    timelinePreparing: language === "ar" ? "جاري تحضير الأدوية" : "Preparing Medications",
    timelineDelivering: language === "ar" ? "مع السائق للتوصيل" : "Out for Delivery",
    timelineArrived: language === "ar" ? "تم التوصيل بنجاح" : "Delivered Successfully"
  };

  const activeOrders = orders.filter((o) => o.status === "delivering" || o.status === "pending_rx");
  const historyOrders = orders.filter((o) => o.status === "completed");

  const shownOrders = activeTab === "active" ? activeOrders : historyOrders;

  const handleOpenTracker = (order) => {
    setTrackingOrder(order);
  };

  return (
    <div className="profile-panel-container-gap16-pb30">
      <h1 className="profile-mobile-title">{t.title}</h1>

      {/* Tabs */}
      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === "active" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          {t.active} ({activeOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "tab-btn-active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          {t.history} ({historyOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="profile-panel-container-gap16">
        {shownOrders.length > 0 ? (
          shownOrders.map((order) => (
            <OrderCard key={order.id} order={order} onTrackClick={handleOpenTracker} />
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <strong className="empty-title">{t.empty}</strong>
            <p className="empty-desc">{t.emptyDesc}</p>
          </div>
        )}
      </div>

      {/* Live Tracking overlay modal */}
      {trackingOrder && (
        <div className="modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="search-filter-row-between">
              <h3 className="profile-modal-title">
                {t.trackTitle} #{trackingOrder.id}
              </h3>
              <button className="btn-icon" onClick={() => setTrackingOrder(null)}>✕</button>
            </div>

            {/* Map visual */}
            <div className="profile-tracker-map-preview">
              Live Courier Route Map
            </div>

            {/* Driver section */}
            <div className="profile-tx-card">
              <div>
                <span className="profile-sidebar-email">{t.driver}</span>
                <strong className="profile-driver-name">{trackingOrder.driverName}</strong>
              </div>
              <div className="profile-btn-row-gap8">
                <a
                  href={`tel:${trackingOrder.driverPhone}`}
                  className="profile-driver-call-btn"
                >
                  📞 {t.call}
                </a>
              </div>
            </div>

            {/* Timeline progress tracker */}
            <div className="tracker-timeline">
              <div className={`tracker-step ${trackingOrder.timeline[0].done ? "tracker-step-done" : ""} ${trackingOrder.status === "pending_rx" ? "tracker-step-active" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelinePlaced}</span>
                <span className="tracker-time">{trackingOrder.timeline[0].time}</span>
              </div>
              <div className={`tracker-step ${trackingOrder.timeline[1].done ? "tracker-step-done" : ""} ${trackingOrder.status === "delivering" ? "tracker-step-active" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelinePreparing}</span>
                <span className="tracker-time">{trackingOrder.timeline[1].time}</span>
              </div>
              <div className={`tracker-step ${trackingOrder.timeline[2].done ? "tracker-step-done" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelineDelivering}</span>
                <span className="tracker-time">{trackingOrder.timeline[2].time}</span>
              </div>
              <div className={`tracker-step ${trackingOrder.timeline[3].done ? "tracker-step-done" : ""}`}>
                <div className="tracker-dot"></div>
                <span className="tracker-title">{t.timelineArrived}</span>
                <span className="tracker-time">{trackingOrder.timeline[3].time}</span>
              </div>
            </div>

            <button
              className="btn-secondary profile-preset-btn"
              onClick={() => alert("Connecting to pharmacist support line...")}
            >
              🏥 {t.support} (Licensed Pharmacist Line)
            </button>

            <button
              type="button"
              className="orders-cancel-btn"
              onClick={() => setShowRefundSelector(true)}
            >
              🛑 {language === "ar" ? "إلغاء الطلب" : "Cancel Order"}
            </button>
          </div>
        </div>
      )}

      {/* Refund Selector Modal overlay */}
      {showRefundSelector && (
        <div className="modal-overlay orders-refund-overlay" onClick={() => setShowRefundSelector(false)}>
          <div className="modal-sheet orders-refund-sheet" onClick={(e) => e.stopPropagation()}>
            <h3 className="orders-refund-title">
              {language === "ar" ? "اختر طريقة استرداد الأموال" : "Choose Refund Method"}
            </h3>
            <p className="orders-refund-desc">
              {language === "ar" 
                ? "إذا قمت بإلغاء هذا الطلب، يرجى اختيار طريقة استرداد المبلغ المدفوع:" 
                : "If you cancel this order, please choose how you would like to receive your refund:"}
            </p>

            <div className="orders-refund-options-list">
              {/* Option 1: Wallet */}
              <button
                type="button"
                onClick={() => handleCancelConfirm("wallet")}
                className="orders-refund-wallet-btn"
              >
                <strong className="orders-refund-wallet-title">
                  | {language === "ar" ? "استرداد إلى المحفظة الإلكترونية (فوري)" : "Refund to Electronic Wallet (Instant)"}
                </strong>
                <span className="orders-refund-wallet-desc">
                  {language === "ar" ? "سيتم إيداع الرصيد في محفظتك فوراً لاستخدامه في طلباتك القادمة." : "Funds will be credited immediately to your wallet for future purchases."}
                </span>
              </button>

              {/* Option 2: Payment Method */}
              <button
                type="button"
                onClick={() => handleCancelConfirm("card")}
                className="orders-refund-card-btn"
              >
                <strong className="orders-refund-card-title">
                  🏦 {language === "ar" ? "استرداد إلى بطاقة الدفع (٣-٥ أيام عمل)" : "Refund to Original Payment Card (3-5 Days)"}
                </strong>
                <span className="orders-refund-wallet-desc">
                  {language === "ar" ? "سيتم إرجاع المبلغ لبطاقة الدفع (مدى/فيزا) خلال ٣-٥ أيام عمل حسب البنك." : "Refund will return to your card (Mada/Visa) in 3-5 business days."}
                </span>
              </button>
            </div>

            <div className="profile-btn-row-gap8">
              <button
                type="button"
                onClick={() => setShowRefundSelector(false)}
                className="btn-secondary profile-preset-btn"
              >
                {language === "ar" ? "تراجع" : "Go Back"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
