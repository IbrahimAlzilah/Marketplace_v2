"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoyaltyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?action=loyalty");
  }, [router]);

  return (
    <div className="redirect-loading-text">
      Redirecting to Wallet & Loyalty Points...
    </div>
  );
}
