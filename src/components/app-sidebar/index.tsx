"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "TRANG CHỦ",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
    },{
      title: "Thông tin toà nhà",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Quản lý cư dân",
          url: "/residents",
        },
        {
          title: "Quản lý căn hộ",
          url: "/apartments",
        },
        {
          title: "Quản lý tài liệu căn hộ",
          url: "/apartments",
        },
        {
          title: "Quản lý sổ tay cư dân",
          url: "/apartments",
        },
        {
          title: "Quản lý thông tin toà nhà",
          url: "/apartments",
        },
      ],
    },
    {
      title: "Dịch vụ toà nhà",
      url: "/services",
      icon: Bot,
      items: [
        {
          title: "Quản lý khách thăm",
          url: "/services/news_feed",
        },
        {
          title: "Quản lý đăng ký thi công",
          url: "/services/transport",
        },
        {
          title: "Quản lý đăng ký chuyển đồ",
          url: "/services/transport",
        },
        {
          title: "Quản lý phản ánh",
          url: "/services/feed_back",
        },
        {
          title: "Quản lý hotline",
          url: "/services/hotline",
        },
        {
          title: "Giao tiếp",
          url: "/services/hotline",
        },
      ],
    },
    {
      title: "Thanh toán/Chi phí",
      url: "/notification",
      icon: BookOpen,
      items: [
        {
          title: "Bảng kê chi phí",
          url: "#",
        },
        {
          title: "Quản lý thanh toán",
          url: "#",
        },
      ],
    },
    {
      title: "Thông báo/Bảng tin",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Thông báo",
          url: "#",
        },
        {
          title: "Bảng tin",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
