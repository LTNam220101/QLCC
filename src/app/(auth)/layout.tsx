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
          className="hidden md:flex md:w-1/2 bg-[#283b6a] text-white flex-col justify-end items-center relative"
          style={{
            backgroundImage:
              "linear-gradient(90.31deg, #28457C 0.2%, #294478 21.88%, #2D3F6F 35.8%, #2B3865 54.52%, #283257 67.62%, #252A48 99.24%)"
          }}
        >
          <div className="absolute top-[135px] left-[92px] flex items-center gap-4">
            <div className="w-16 rounded-full border-2 border-white/50 overflow-hidden">
              <Image
                alt="Công Ty Cổ Phần Sáng Tạo Văn Minh Số"
                src={"/logo.jpg"}
                width={600}
                height={600}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Công Ty Cổ Phần Sáng Tạo Văn Minh Số
              </h1>
              {/* <p className="text-2xl">SLOGAN</p> */}
            </div>
          </div>

          <div className="w-full h-full relative">
            <Image
              src="/auth.png"
              alt="Smart building management"
              // width={900}
              // height={900}
              fill
              className="object-contain object-bottom"
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
  )
}
