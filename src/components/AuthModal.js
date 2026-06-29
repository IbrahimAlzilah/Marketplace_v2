"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

const translations = {
  ar: {
    loginTitle: "مرحباً بك في يسر",
    loginSub: "تسجيل الدخول للمتابعة",
    phoneLabel: "رقم الجوال",
    phonePlaceholder: "50 123 4567",
    passwordLabel: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    registerLink: "ليس لديك حساب؟ سجل الآن",
    loginBtn: "تسجيل الدخول",
    registerTitle: "إنشاء حساب جديد",
    fullNameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    agreeTerms: "أوافق على الشروط والأحكام وسياسات وزارة الصحة",
    createAccountBtn: "إنشاء حساب",
    backToLogin: "العودة لتسجيل الدخول",
    otpTitle: "التحقق من رقم الجوال",
    otpSub: "أدخل الرمز المكون من 4 أرقام المرسل إلى {phone}",
    verifyBtn: "التحقق والمتابعة",
    resendTimer: "إعادة الإرسال خلال {timer} ثانية",
    resendBtn: "إعادة إرسال الرمز",
    forgotTitle: "استعادة كلمة المرور",
    forgotSub: "أدخل رقم جوالك وسنقوم بإرسال رمز تحقق لتغيير كلمة المرور",
    sendOtpBtn: "إرسال رمز التحقق",
    resetTitle: "تعيين كلمة المرور الجديدة",
    resetSub: "يرجى تعيين كلمة مرور جديدة قوية لحسابك",
    newPassLabel: "كلمة المرور الجديدة",
    confirmPassLabel: "تأكيد كلمة المرور",
    resetBtn: "تحديث كلمة المرور والدخول",
    ruleLength: "ثمانية خانات أو أكثر",
    ruleNumber: "يحتوي على رقم واحد على الأقل",
    invalidOtp: "رمز التحقق غير صالح، يرجى إدخال 4921 للتبسيط أو الرمز الصحيح",
    invalidUser: "البيانات المدخلة غير صحيحة، يرجى المحاولة مجدداً",
    termsRequired: "يرجى الموافقة على الشروط واللوائح للمتابعة"
  },
  en: {
    loginTitle: "Welcome to YUSUR",
    loginSub: "Please login to continue",
    phoneLabel: "Mobile Number",
    phonePlaceholder: "50 123 4567",
    passwordLabel: "Password",
    forgotPassword: "Forgot Password?",
    registerLink: "Don't have an account? Register",
    loginBtn: "Login",
    registerTitle: "Create Account",
    fullNameLabel: "Full Name",
    emailLabel: "Email Address",
    agreeTerms: "I agree to MOH Terms & Conditions",
    createAccountBtn: "Create Account",
    backToLogin: "Back to Login",
    otpTitle: "Verify Number",
    otpSub: "Enter 4-digit code sent to {phone}",
    verifyBtn: "Verify & Continue",
    resendTimer: "Resend in {timer}s",
    resendBtn: "Resend Code",
    forgotTitle: "Forgot Password",
    forgotSub: "Enter your mobile number to get a verification code",
    sendOtpBtn: "Send OTP Code",
    resetTitle: "Reset Password",
    resetSub: "Enter your new credentials below",
    newPassLabel: "New Password",
    confirmPassLabel: "Confirm Password",
    resetBtn: "Update & Login",
    ruleLength: "At least 8 characters",
    ruleNumber: "At least 1 number",
    invalidOtp: "Invalid OTP, please try again (use code 4921 to bypass)",
    invalidUser: "Invalid credentials, please try again",
    termsRequired: "You must accept the terms & conditions"
  }
};

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { language, login } = useApp();

  const [step, setStep] = useState("login"); // login, register, otp, forgot, otp-forgot, reset
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Register state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);

  // Reset password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error/Success state
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = language === "ar" ? translations.ar : translations.en;

  // Password rules validation checkmarks
  const isLengthOk = password.length >= 8;
  const isNumberOk = /\d/.test(password);

  const isResetLengthOk = newPassword.length >= 8;
  const isResetNumberOk = /\d/.test(newPassword);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if ((step === "otp" || step === "otp-forgot") && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const resetAllStates = () => {
    setPhone("");
    setPassword("");
    setFullName("");
    setEmail("");
    setTermsAccepted(false);
    setOtpDigits(["", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetAllStates();
    setStep("login");
    onClose();
  };

  const startOtpCountdown = () => {
    setTimer(60);
    setOtpDigits(["", "", "", ""]);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone || !password) return;

    // Simulate authentication
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Use standard check for mock user: Ibrahim Phone: 0501234567 or 501234567
      const cleanPhone = phone.replace(/\s+/g, "");
      if (cleanPhone.endsWith("0501234567") || cleanPhone.endsWith("501234567")) {
        // Correct Ibrahim profile, transition to OTP Verification
        setStep("otp");
        startOtpCountdown();
      } else {
        // Reject unknown credentials for visual error outline state
        setErrorMsg(t.invalidUser);
      }
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !phone || !password) return;
    if (!termsAccepted) {
      setErrorMsg(t.termsRequired);
      return;
    }
    if (!isLengthOk || !isNumberOk) {
      setErrorMsg(language === "ar" ? "كلمة المرور ضعيفة" : "Password does not meet requirements");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Route to OTP (Screen 5)
      setStep("otp");
      startOtpCountdown();
    }, 800);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp-forgot");
      startOtpCountdown();
    }, 800);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const code = otpDigits.join("");
    if (code.length < 4) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // The wireframe OTP is 4921 (or mock OTP bypass)
      if (code === "4921" || code === "1234" || code === "9999") {
        if (step === "otp") {
          login(phone, password);
          if (onSuccess) onSuccess();
          handleClose();
        } else {
          // Transition to Reset Password step
          setStep("reset");
        }
      } else {
        setErrorMsg(t.invalidOtp);
      }
    }, 800);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setErrorMsg(language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    if (!isResetLengthOk || !isResetNumberOk) {
      setErrorMsg(language === "ar" ? "كلمة المرور ضعيفة" : "Password does not meet requirements");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(phone, newPassword);
      if (onSuccess) onSuccess();
      handleClose();
    }, 800);
  };

  const handleOtpChange = (index, value) => {
    // only numeric digits allowed
    const num = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = num.slice(-1);
    setOtpDigits(newDigits);

    // Auto focus next box
    if (newDigits[index] !== "" && index < 3) {
      document.getElementById(`otp-box-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
      document.getElementById(`otp-box-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 11000 }} onClick={handleClose}>
      <div className="modal-sheet" style={{ maxWidth: "420px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Back & Close Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          {step !== "login" && step !== "register" && step !== "forgot" ? (
            <button
              type="button"
              onClick={() => setStep(step === "otp-forgot" ? "forgot" : "login")}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "var(--primary)" }}
            >
              ← {t.backToLogin}
            </button>
          ) : (
            <span style={{ fontSize: "18px", fontWeight: "800" }}>
              {step === "login" ? t.loginTitle : step === "register" ? t.registerTitle : t.forgotTitle}
            </span>
          )}
          <button className="btn-icon" type="button" onClick={handleClose}>✕</button>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid var(--danger)", color: "var(--danger)", padding: "10px 14px", borderRadius: "8px", fontSize: "12px", marginBottom: "16px", fontWeight: "600" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* SCREEN 3: LOGIN FORM */}
        {step === "login" && (
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-2)", margin: 0 }}>
              {t.loginSub}
            </p>

            <div className="form-group">
              <label className="form-label">{t.phoneLabel}</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {/* Flag Selector Dropdown */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid var(--border)", borderRadius: "10px", paddingInline: "10px", backgroundColor: "var(--bg)", fontSize: "13px" }}>
                  <span>🇸🇦</span>
                  <strong>+966</strong>
                </div>
                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  className="form-input"
                  style={{ flex: 1, borderColor: errorMsg ? "var(--danger)" : "var(--border)" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="form-label" style={{ margin: 0 }}>{t.passwordLabel}</label>
                <button
                  type="button"
                  onClick={() => setStep("forgot")}
                  style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "var(--primary)", fontWeight: "600" }}
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ borderColor: errorMsg ? "var(--danger)" : "var(--border)", paddingRight: "40px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  {showPass ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "8px" }}>
              {isLoading ? "..." : t.loginBtn}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("register");
                setErrorMsg("");
              }}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--primary)", fontWeight: "600", textDecoration: "underline", alignSelf: "center", marginTop: "4px" }}
            >
              {t.registerLink}
            </button>
          </form>
        )}

        {/* SCREEN 4: REGISTRATION FORM */}
        {step === "register" && (
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">{t.fullNameLabel}</label>
              <input
                type="text"
                placeholder="Ibrahim Al-Fahad"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.emailLabel}</label>
              <input
                type="email"
                placeholder="ibrahim@example.sa"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.phoneLabel}</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid var(--border)", borderRadius: "10px", paddingInline: "10px", backgroundColor: "var(--bg)", fontSize: "13px" }}>
                  <span>🇸🇦</span>
                  <strong>+966</strong>
                </div>
                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  className="form-input"
                  style={{ flex: 1 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.passwordLabel}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingRight: "40px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  {showPass ? "👁️" : "🙈"}
                </button>
              </div>

              {/* Password complexity checklist (Screen 4 Rules) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px", fontSize: "11px", color: "var(--text-2)" }}>
                <span style={{ display: "flex", gap: "6px", alignItems: "center", color: isLengthOk ? "var(--success)" : "var(--danger)" }}>
                  {isLengthOk ? "✅" : "❌"} {t.ruleLength}
                </span>
                <span style={{ display: "flex", gap: "6px", alignItems: "center", color: isNumberOk ? "var(--success)" : "var(--danger)" }}>
                  {isNumberOk ? "✅" : "❌"} {t.ruleNumber}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "4px" }}>
              <input
                type="checkbox"
                id="terms"
                style={{ width: "16px", height: "16px", cursor: "pointer", marginTop: "2px" }}
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms" style={{ fontSize: "12px", color: "var(--text-1)", cursor: "pointer", lineHeight: "1.4" }}>
                {t.agreeTerms}
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "8px" }}>
              {isLoading ? "..." : t.createAccountBtn}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("login");
                setErrorMsg("");
              }}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--primary)", fontWeight: "600", textDecoration: "underline", alignSelf: "center", marginTop: "4px" }}
            >
              {t.backToLogin}
            </button>
          </form>
        )}

        {/* SCREEN 6: FORGOT PASSWORD REQUEST FORM */}
        {step === "forgot" && (
          <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-2)", margin: 0 }}>
              {t.forgotSub}
            </p>

            <div className="form-group">
              <label className="form-label">{t.phoneLabel}</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid var(--border)", borderRadius: "10px", paddingInline: "10px", backgroundColor: "var(--bg)", fontSize: "13px" }}>
                  <span>🇸🇦</span>
                  <strong>+966</strong>
                </div>
                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  className="form-input"
                  style={{ flex: 1 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "..." : t.sendOtpBtn}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("login");
                setErrorMsg("");
              }}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--primary)", fontWeight: "600", textDecoration: "underline", alignSelf: "center", marginTop: "4px" }}
            >
              {t.backToLogin}
            </button>
          </form>
        )}

        {/* SCREEN 5: OTP VERIFICATION FORM (Also handles forgot-password verification) */}
        {(step === "otp" || step === "otp-forgot") && (
          <form onSubmit={handleOtpVerify} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>💬</span>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 6px 0" }}>{t.otpTitle}</h2>
              <p style={{ fontSize: "12px", color: "var(--text-2)", margin: 0 }}>
                {t.otpSub.replace("{phone}", `+966 ${phone || "50 123 4567"}`)}
              </p>
            </div>

            {/* 4 Single-Digit Input Boxes (Screen 5 Rules) */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-box-${index}`}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="form-input"
                  style={{
                    width: "48px",
                    height: "48px",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "800",
                    borderRadius: "12px",
                    borderColor: errorMsg ? "var(--danger)" : "var(--border)"
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  required
                />
              ))}
            </div>

            {/* Countdown timer & resend option */}
            <div style={{ textAlign: "center", fontSize: "12px" }}>
              {timer > 0 ? (
                <span style={{ color: "var(--text-2)" }}>{t.resendTimer.replace("{timer}", timer)}</span>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: "4px 10px", fontSize: "11px", display: "inline-block", width: "auto" }}
                  onClick={startOtpCountdown}
                >
                  🔄 {t.resendBtn}
                </button>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading || otpDigits.includes("")}>
              {isLoading ? "..." : t.verifyBtn}
            </button>
          </form>
        )}

        {/* SCREEN 6 CONTINUATION: RESET PASSWORD FORM */}
        {step === "reset" && (
          <form onSubmit={handleResetSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>🔒</span>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 6px 0" }}>{t.resetTitle}</h2>
              <p style={{ fontSize: "12px", color: "var(--text-2)", margin: 0 }}>{t.resetSub}</p>
            </div>

            <div className="form-group">
              <label className="form-label">{t.newPassLabel}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingRight: "40px" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  {showPass ? "👁️" : "🙈"}
                </button>
              </div>

              {/* Reset Password complexity checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px", fontSize: "11px", color: "var(--text-2)" }}>
                <span style={{ display: "flex", gap: "6px", alignItems: "center", color: isResetLengthOk ? "var(--success)" : "var(--danger)" }}>
                  {isResetLengthOk ? "✅" : "❌"} {t.ruleLength}
                </span>
                <span style={{ display: "flex", gap: "6px", alignItems: "center", color: isResetNumberOk ? "var(--success)" : "var(--danger)" }}>
                  {isResetNumberOk ? "✅" : "❌"} {t.ruleNumber}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.confirmPassLabel}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading || !isResetLengthOk || !isResetNumberOk}>
              {isLoading ? "..." : t.resetBtn}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
