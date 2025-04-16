import { AppSidebar } from "@/components/app-nav";
import NavTrigger from "@/components/app-nav/nav-trigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBreadcrumb from "@/components/app-nav/nav-breadcrumb";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Chung cư",
  description: "Hệ thống quản lý chung cư hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable}>
      <body className="antialiased">
        <SidebarProvider>
          <div className="flex flex-1 h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F3F6]">
              <header className="flex h-[98px] shrink-0 items-center gap-2 bg-white">
                <div className="flex items-center gap-2 px-3">
                  <NavTrigger />
                </div>
              </header>
              <NavBreadcrumb />
              <main className="flex-1 mx-[15px] mb-[20px] bg-white px-5 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
