import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  getAdminConfig,
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export default async function AdminPage() {
  const { sessionSecret } = getAdminConfig();

  if (!sessionSecret) {
    redirect("/admin/login?error=config");
  }

  const sessionToken = (await cookies()).get(
    getAdminSessionCookieName(),
  )?.value;
  if (!sessionToken) {
    redirect("/admin/login");
  }

  const payload = await verifyAdminSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    redirect("/admin/login?error=session");
  }

  return <AdminDashboard adminEmail={payload.email} />;
}
