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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "30px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "800" }}>{t.title}</h1>

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
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>
                {t.trackTitle} #{trackingOrder.id}
              </h3>
              <button className="btn-icon" onClick={() => setTrackingOrder(null)}>✕</button>
            </div>

            {/* Map visual */}
            <div
              style={{
                height: "120px",
                background: "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.15)), url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23b1e2c6%22/><path d=%22M20,0 L20,100 M80,0 L80,100 M0,30 L100,30 M0,70 L100,70%22 stroke=%22%23ffffff%22 stroke-width=%223%22/><circle cx=%2250%22 cy=%2250%22 r=%224%22 fill=%22%230F6CBD%22/><circle cx=%2270%22 cy=%2260%22 r=%226%22 fill=%22%2318B67A%22/></svg>')",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-1)",
                fontWeight: "700",
                fontSize: "12px",
                border: "1px solid var(--border)"
              }}
            >
              🛵 Courier Route Live Pin
            </div>

            {/* Driver section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "var(--bg)", borderRadius: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block" }}>{t.driver}</span>
                <strong style={{ fontSize: "13px" }}>{trackingOrder.driverName}</strong>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={`tel:${trackingOrder.driverPhone}`}
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "white",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}
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
              className="btn-secondary"
              onClick={() => alert("Connecting to pharmacist support line...")}
              style={{ padding: "8px", fontSize: "12px" }}
            >
              🏥 {t.support} (Licensed Pharmacist Line)
            </button>

            <button
              type="button"
              className="btn-danger"
              onClick={() => setShowRefundSelector(true)}
              style={{
                padding: "8px",
                fontSize: "12px",
                marginTop: "8px",
                backgroundColor: "var(--danger)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                width: "100%"
              }}
            >
              🛑 {language === "ar" ? "إلغاء الطلب" : "Cancel Order"}
            </button>
          </div>
        </div>
      )}

      {/* Refund Selector Modal overlay */}
      {showRefundSelector && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowRefundSelector(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 10px 0" }}>
              {language === "ar" ? "اختر طريقة استرداد الأموال" : "Choose Refund Method"}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-2)", marginBottom: "16px", lineHeight: "1.4" }}>
              {language === "ar" 
                ? "إذا قمت بإلغاء هذا الطلب، يرجى اختيار طريقة استرداد المبلغ المدفوع:" 
                : "If you cancel this order, please choose how you would like to receive your refund:"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {/* Option 1: Wallet */}
              <button
                type="button"
                onClick={() => handleCancelConfirm("wallet")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px",
                  border: "1.5px solid var(--primary)",
                  borderRadius: "12px",
                  backgroundColor: "rgba(15, 108, 189, 0.03)",
                  textAlign: "start",
                  cursor: "pointer"
                }}
              >
                <strong style={{ fontSize: "12.5px", color: "var(--primary)" }}>
                  | {language === "ar" ? "استرداد إلى المحفظة الإلكترونية (فوري)" : "Refund to Electronic Wallet (Instant)"}
                </strong>
                <span style={{ fontSize: "10.5px", color: "var(--text-2)", marginTop: "4px" }}>
                  {language === "ar" ? "سيتم إيداع الرصيد في محفظتك فوراً لاستخدامه في طلباتك القادمة." : "Funds will be credited immediately to your wallet for future purchases."}
                </span>
              </button>

              {/* Option 2: Payment Method */}
              <button
                type="button"
                onClick={() => handleCancelConfirm("card")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  textAlign: "start",
                  cursor: "pointer"
                }}
              >
                <strong style={{ fontSize: "12.5px", color: "var(--text-1)" }}>
                  🏦 {language === "ar" ? "استرداد إلى بطاقة الدفع (٣-٥ أيام عمل)" : "Refund to Original Payment Card (3-5 Days)"}
                </strong>
                <span style={{ fontSize: "10.5px", color: "var(--text-2)", marginTop: "4px" }}>
                  {language === "ar" ? "سيتم إرجاع المبلغ لبطاقة الدفع (مدى/فيزا) خلال ٣-٥ أيام عمل حسب البنك." : "Refund will return to your card (Mada/Visa) in 3-5 business days."}
                </span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowRefundSelector(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: "8px", fontSize: "12px" }}
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
