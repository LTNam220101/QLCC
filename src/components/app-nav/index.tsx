"use client"

import * as React from "react"
import { BookOpen, Bot, Command, Settings2, SquareTerminal } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "TRANG CHỦ",
      url: "/",
      icon: Settings2,
    },
    {
      title: "Thông tin toà nhà",
      url: "/building-information",
      icon: SquareTerminal,
      items: [
        {
          title: "Quản lý cư dân",
          url: "/residents"
        },
        {
          title: "Quản lý căn hộ",
          url: "/apartments"
        },
        {
          title: "Quản lý tài liệu căn hộ",
          url: "/documents"
        },
        {
          title: "Quản lý sổ tay cư dân",
          url: "/apartments"
        },
        {
          title: "Quản lý thông tin toà nhà",
          url: "/apartments"
        }
      ]
    },
    {
      title: "Dịch vụ toà nhà",
      url: "/services",
      icon: Bot,
      items: [
        {
          title: "Quản lý khách thăm",
          url: "/news_feed"
        },
        {
          title: "Quản lý đăng ký thi công",
          url: "/transport"
        },
        {
          title: "Quản lý đăng ký chuyển đồ",
          url: "/moving-tickets"
        },
        {
          title: "Quản lý phản ánh",
          url: "/reports"
        },
        {
          title: "Quản lý hotline",
          url: "/hotlines"
        },
        {
          title: "Giao tiếp",
          url: "/hotlines"
        }
      ]
    },
    // {
    //   title: "Thanh toán/Chi phí",
    //   url: "/notification",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Bảng kê chi phí",
    //       url: "#"
    //     },
    //     {
    //       title: "Quản lý thanh toán",
    //       url: "#"
    //     }
    //   ]
    // },
    {
      title: "Thông báo/Bảng tin",
      url: "/boards",
      icon: Settings2,
      items: [
        {
          title: "Thông báo",
          url: "/notifications"
        },
        {
          title: "Bảng tin",
          url: "/news"
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // Duyệt và cập nhật trạng thái isActive
  const navItems = data.navMain.map((item) => {
    const isMainActive =
      pathname === item.url || pathname.startsWith(item.url + "/")

    // Duyệt submenu nếu có
    const subItems = item.items?.map((sub) => {
      const isSubActive =
        pathname === sub.url || pathname.startsWith(item.url + sub.url)
      return {
        ...sub,
        isActive: isSubActive
      }
    })

    // Nếu bất kỳ submenu nào active => menu chính cũng active
    const isAnySubActive = subItems?.some((s) => s.isActive)

    return {
      ...item,
      isActive: isMainActive || isAnySubActive,
      items: subItems
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-purple">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <div className="flex rounded-full size-[60px] items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-[60px]" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-xl text-white">CÔNG TY A</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
