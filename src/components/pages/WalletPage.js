"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?action=wallet");
  }, [router]);

  return (
    <div className="redirect-loading-text">
      Redirecting to Wallet & Loyalty Points...
    </div>
  );
}
