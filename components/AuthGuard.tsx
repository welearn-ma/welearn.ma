"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_ACCESS_TOKEN_STORAGE_KEY = "wl_admin_access_token";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const token =
        window.sessionStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ??
        "";

      if (!token) {
        router.replace("/admin/login?error=session");
        return;
      }

      try {
        const response = await fetch(
          "https://api.welearn.ma/api/admin/session",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        if (response.status !== 200) {
          window.sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
          router.replace("/admin/login?error=session");
          return;
        }

        if (isMounted) {
          setIsChecking(false);
        }
      } catch {
        window.sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
        router.replace("/admin/login?error=session");
      }
    };

    void verifySession();

    return () => {
      isMounted = false;
    };
  }, [router]);

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
