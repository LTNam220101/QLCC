"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Thông tin toà nhà",
      url: "/building-infomation",
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <div className="flex items-center px-[18px] py-[14px] gap-[10px]">
          <div className="w-8 h-8 border border-[#666666] rounded-lg flex items-center justify-center">
            <Settings2 />
          </div>
          <span className="font-medium text-[#666]">TRANG CHỦ</span>
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
