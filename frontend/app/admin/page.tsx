"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { verifyAdminSession } from "@/lib/api/admin-session";
import {
  ADMIN_ACCESS_TOKEN_STORAGE_KEY,
  clearAdminSessionStorage,
} from "@/lib/admin-session-storage";

export default function AdminPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const token =
        window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ?? "";

      if (!token) {
        router.replace("/admin/login?error=session&next=/admin");
        return;
      }

      const result = await verifyAdminSession(token);

      if (!isMounted) {
        return;
      }

      if (!result.ok) {
        clearAdminSessionStorage();
        const reason = result.reason === "not_admin" ? "not_admin" : "session";
        router.replace(`/admin/login?error=${reason}&next=/admin`);
        return;
      }

      setAdminEmail(result.email);
      setAccessToken(token);
      setIsCheckingSession(false);
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-wl-gray-light px-4 py-16">
        <p className="mx-auto max-w-3xl text-sm text-wl-text-secondary">
          Verification de la session admin...
        </p>
      </main>
    );
  }

  return <AdminDashboard adminEmail={adminEmail} accessToken={accessToken} />;
}
