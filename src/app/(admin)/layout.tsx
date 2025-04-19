import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-nav";
import NavBreadcrumb from "@/components/app-nav/nav-breadcrumb";
import NavTrigger from "@/components/app-nav/nav-trigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  return (
    <>
      <SidebarProvider>
        <div className="flex flex-1 h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F3F6]">
            <header className="h-[98px] gap-2 bg-white flex items-center">
              <NavTrigger />
            </header>
            <NavBreadcrumb />
            <main className="flex-1 mx-[15px] mb-[20px] bg-white px-5 overflow-auto">
              {children}
            </main>
            <Toaster />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
