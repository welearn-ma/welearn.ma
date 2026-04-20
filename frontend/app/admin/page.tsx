"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  ADMIN_ACCESS_TOKEN_STORAGE_KEY,
  getStoredAdminAccessToken,
} from "@/lib/admin-session-storage";

export default function AdminPage() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const token =
      window.sessionStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ??
      getStoredAdminAccessToken();
    setAccessToken(token);
  }, []);

  if (!accessToken) {
    return (
      <main className="min-h-screen bg-wl-gray-light px-4 py-16">
        <p className="mx-auto max-w-3xl text-sm text-wl-text-secondary text-center">
          Verification de la session admin...
        </p>
      </main>
    );
  }

  return <AdminDashboard accessToken={accessToken} />;
}
