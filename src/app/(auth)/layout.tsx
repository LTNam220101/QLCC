import type React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { AuthRoute } from "@/components/auth/auth-route";

export const metadata: Metadata = {
  title: "Xác thực - Hệ thống Quản lý Chung cư",
  description: "Đăng nhập, đăng ký và quản lý tài khoản",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRoute>
      <div className="flex min-h-screen">
        {/* Left side - Background and branding */}
        <div className="hidden md:flex md:w-1/2 bg-[#283b6a] text-white flex-col justify-center items-center p-8 relative">
          <div className="absolute top-10 left-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/50"></div>
            <div>
              <h1 className="text-2xl font-bold">CÔNG TY A</h1>
              <p className="text-2xl">SLOGAN</p>
            </div>
          </div>

          <div className="max-w-md mx-auto mt-20">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Smart building management"
              width={500}
              height={400}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </AuthRoute>
  );
}
