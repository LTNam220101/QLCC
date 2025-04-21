import { getSession, useSession } from "next-auth/react";
import { auth } from "@/auth";

// Hàm lấy token từ server-side
export async function getServerToken() {
  const session = await auth();
  return session?.user?.token || undefined;
}

// Hàm lấy token từ client-side (sử dụng trong useEffect hoặc event handlers)
export async function getClientToken() {
  const session = await getSession();
  return session?.user?.token || undefined;
}

// Hook lấy token từ client-side (sử dụng trong React components)
export function useToken() {
  const { data: session, status } = useSession();
  return {
    token: session?.user?.token || undefined,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
