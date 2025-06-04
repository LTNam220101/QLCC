"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import Link from "next/link"
import ArrowUp from "@/icons/arrow-up.svg"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive: boolean
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <div className="text-[#79828B] text-[16px] font-semibold mb-2">MENU</div>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && (
                    <div className="w-6 h-6 max-w-full max-h-full flex items-center justify-center">
                      <item.icon className="group-data-[state=open]/collapsible:*:!fill-[#fff]" />
                    </div>
                  )}
                  <span className="text-[#79828B] text-[16px] font-semibold">
                    {item.title}
                  </span>
                  {item.items?.length && (
                    <ArrowUp className="!size-6 ml-auto transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-180 group-data-[state=closed]/collapsible:*:!stroke-[#52CC00]" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                        >
                          <Link
                            href={`${item.url}${subItem.url}`}
                            className={
                              subItem.isActive
                                ? "border-l-4 border-[#52CC00]"
                                : ""
                            }
                          >
                            <div className="w-2 h-2 my-2 ml-5 mr-1 bg-[#52CC00] rounded-full" />
                            <span className="text-[#79828B] text-[16px] font-semibold">
                              {subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
