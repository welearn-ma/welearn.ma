import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  getAdminSessionCookieName,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export default async function AdminPage() {
  if (!isAdminAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const sessionToken = (await cookies()).get(
    getAdminSessionCookieName(),
  )?.value;
  if (!sessionToken) {
    redirect("/admin/login");
  }

  const payload = await verifyAdminSessionToken(sessionToken);
  if (!payload) {
    redirect("/admin/login?error=session");
  }

  return <AdminDashboard adminEmail={payload.email} />;
}
