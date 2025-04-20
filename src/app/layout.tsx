import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { TanStackQueryProvider } from "@/lib/tanstack-query/provider"

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Chung cư",
  description: "Hệ thống quản lý chung cư hiện đại"
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={inter.variable}>
      <body className="antialiased">
        <TanStackQueryProvider>
          <SessionProvider>{children}</SessionProvider>
        </TanStackQueryProvider>
      </body>
    </html>
  )
}
