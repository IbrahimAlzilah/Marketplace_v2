"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function Footer() {
  const { language } = useApp();

  const t = {
    logo: "YUSUR",
    tagline: language === "ar" ? "منصتك الصحية الموثوقة للمنتجات الصيدلانية" : "Your Trusted Healthcare Multi-Vendor Marketplace",
    about: language === "ar" ? "عن يسر" : "About YUSUR",
    aboutDesc: language === "ar" ? "يسر هو سوق صحي متعدد البائعين يربط الصيدليات المرخصة بالمستهلكين لتسهيل تلبية الطلبات." : "YUSUR is a multi-vendor health marketplace connecting licensed pharmacies with consumers for fast delivery.",
    contact: language === "ar" ? "اتصل بنا" : "Contact Us",
    support: language === "ar" ? "الدعم والمساعدة" : "Help & Support",
    privacy: language === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
    terms: language === "ar" ? "الشروط والأحكام" : "Terms & Conditions",
    copyright: language === "ar" ? "© ٢٠٢٦ يسر. جميع الحقوق محفوظة." : "© 2026 YUSUR. All rights reserved.",
    linksHeader: language === "ar" ? "روابط سريعة" : "Quick Links",
    contactHeader: language === "ar" ? "تواصل معنا" : "Support Helpline"
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand-col">
          <div className="footer-logo">
            <span>🟢</span>
            <strong>{t.logo}</strong>
          </div>
          <p className="footer-desc-text">{t.tagline}</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t.linksHeader}</h4>
          <div className="footer-links">
            <Link href="/home" className="footer-link-item">{language === "ar" ? "الرئيسية" : "Home"}</Link>
            <Link href="/pharmacies" className="footer-link-item">{language === "ar" ? "الصيدليات" : "Pharmacies"}</Link>
            <Link href="/profile" className="footer-link-item">{language === "ar" ? "حسابي" : "My Account"}</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t.about}</h4>
          <p className="footer-desc-text footer-col-desc">{t.aboutDesc}</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t.contactHeader}</h4>
          <div className="footer-contact-details">
            <span>📞 920012345</span>
            <span>📧 support@yusur.com</span>
            <div className="footer-support-row">
              <Link href="/profile?action=support" className="footer-link-item footer-underline-link">
                {t.support}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>{t.copyright}</span>
        <div className="footer-bottom-links">
          <Link href="/profile?action=support" className="footer-bottom-link">{t.privacy}</Link>
          <Link href="/profile?action=support" className="footer-bottom-link">{t.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
