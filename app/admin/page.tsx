"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

const ADMIN_EMAIL_STORAGE_KEY = "wl_admin_email";

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState("admin@welearn.ma");

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY)?.trim();
    if (stored) {
      setAdminEmail(stored);
    }
  }, []);

  return (
    <AuthGuard>
      <AdminDashboard adminEmail={adminEmail} />
    </AuthGuard>
  );
}
