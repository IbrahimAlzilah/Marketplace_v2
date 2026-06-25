"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?action=wallet");
  }, [router]);

  return (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-2)", fontSize: "14px" }}>
      Redirecting to Wallet & Loyalty Points...
    </div>
  );
}
