import { auth } from "@/auth"
import { AppSidebar } from "@/components/app-nav"
import NavBreadcrumb from "@/components/app-nav/nav-breadcrumb"
import NavTrigger from "@/components/app-nav/nav-trigger"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>
  return (
    <>
      <SidebarProvider
        style={{
          "--sidebar-width": "300px",
          "--sidebar-width-icon": "72px",
          "--sidebar-width-mobile": "20rem"
        }}
      >
        <div className="flex flex-1 h-screen overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F3F6]">
            <header className="h-[100px] gap-2 bg-white flex items-center">
              <NavTrigger />
            </header>
            <NavBreadcrumb />
            <main className="flex-1 mx-5 mb-[20px] overflow-auto">
              {children}
            </main>
            <Toaster />
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}
