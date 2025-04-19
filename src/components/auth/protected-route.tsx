"use client";

import type React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner"; // Tạo component Spinner nếu chưa có

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  useEffect(() => {
    if (!isLoading && isUnauthenticated) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
    }
  }, [isLoading, isUnauthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isUnauthenticated) {
    return null;
  }

  return <>{children}</>;
}
