import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { TanStackQueryProvider } from "@/lib/tanstack-query/provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Manrope({
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
          <SessionProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SessionProvider>
        </TanStackQueryProvider>
      </body>
    </html>
  )
}
