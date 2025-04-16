import { AppSidebar } from "@/components/app-sidebar";
import NavTrigger from "@/components/app-sidebar/nav-trigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className='antialiased'>
        <SidebarProvider>
          <div className="flex flex-1 min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                  <NavTrigger />
                </div>
              </header>
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
