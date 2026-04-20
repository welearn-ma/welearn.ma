"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ADMIN_ACCESS_TOKEN_STORAGE_KEY,
  clearAdminSessionStorage,
} from "@/lib/admin-session-storage";

const FETCH_TIMEOUT_MS = 5000;

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const [isChecking, setIsChecking] = useState(isProtectedAdminRoute);

  // Issue 1 — keep authenticated admins inside the /admin area
  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      const token =
        window.sessionStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ??
        "";

      if (token) {
        router.replace("/admin");
      }
    }
  }, [pathname, router]);

  // Issue 2 — verify token on mount with immediate redirect if missing, timeout if slow
  useEffect(() => {
    if (!isProtectedAdminRoute) {
      setIsChecking(false);
      return;
    }

    let isMounted = true;
    setIsChecking(true);

    const verifySession = async () => {
      const token =
        window.sessionStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ??
        "";

      // No token → redirect immediately, no backend call
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      // Token exists → show loading and verify with backend
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, FETCH_TIMEOUT_MS);

      try {
        const response = await fetch(
          "https://api.welearn.ma/api/admin/session",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.status !== 200) {
          clearAdminSessionStorage();
          router.replace("/admin/login?error=session&expired=1");
          return;
        }

        if (isMounted) {
          setIsChecking(false);
        }
      } catch {
        clearTimeout(timeoutId);
        clearAdminSessionStorage();
        router.replace("/admin/login?error=session&expired=1");
      }
    };

    void verifySession();

    return () => {
      isMounted = false;
    };
  }, [isProtectedAdminRoute, router]);

  if (isChecking) {
    return (
      <main className="min-h-screen bg-wl-gray-light px-4 py-16">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 text-sm text-wl-text-secondary">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-wl-border border-t-wl-blue" />
          Verification de la session admin...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
