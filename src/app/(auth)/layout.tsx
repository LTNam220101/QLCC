import type React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import { AuthRoute } from "@/components/auth/auth-route"

export const metadata: Metadata = {
  title: "Xác thực - Hệ thống Quản lý Chung cư",
  description: "Đăng nhập, đăng ký và quản lý tài khoản"
}

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthRoute>
      <div className="flex min-h-screen">
        {/* Left side - Background and branding */}
        <div
          className="hidden md:flex md:w-1/2 bg-green text-white flex-col justify-end items-center relative"

        >
          <div className="w-full h-full relative">
            <Image
              src="/auth.png"
              alt="Smart building management"
              // width={900}
              // height={900}
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-[640px]">{children}</div>
        </div>
      </div>
    </AuthRoute>
  )
}
