"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useAuth({
  required = false,
  onUnauthenticated = "/login",
  onAuthenticated = null,
}: {
  required?: boolean;
  onUnauthenticated?: string;
  onAuthenticated?: string | null;
} = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const loading = status === "loading";
  const authenticated = status === "authenticated";
  const unauthenticated = status === "unauthenticated";

  useEffect(() => {
    // Nếu đã xác thực trạng thái và yêu cầu đăng nhập nhưng không có session
    if (!loading && required && unauthenticated) {
      router.push(
        `${onUnauthenticated}?callbackUrl=${encodeURIComponent(pathname)}`
      );
    }

    // Nếu đã xác thực trạng thái, đã đăng nhập và có đường dẫn chuyển hướng
    if (!loading && authenticated && onAuthenticated) {
      router.push(onAuthenticated);
    }
  }, [
    loading,
    authenticated,
    unauthenticated,
    required,
    router,
    pathname,
    onUnauthenticated,
    onAuthenticated,
  ]);

  return { session, loading, authenticated, unauthenticated };
}
