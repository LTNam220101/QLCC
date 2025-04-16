"use client"

import { usePathname } from "next/navigation"
import React, { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../ui/breadcrumb"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

// Map các đường dẫn URL sang tên hiển thị thân thiện
const breadcrumbNameMap: Record<string, string> = {
  // Phân hệ chính
  dashboard: "Tổng quan",
  residents: "Quản lý cư dân",
  apartments: "Quản lý căn hộ",
  buildings: "Quản lý tòa nhà",
  facilities: "Danh sách tiện ích",
  "facility-bookings": "Đặt lịch sử dụng",
  invoices: "Hóa đơn",
  payments: "Thanh toán",
  "fee-config": "Cấu hình phí",
  staff: "Nhân viên",
  roles: "Phân quyền",
  settings: "Cài đặt hệ thống",

  // Các trang con
  add: "Thêm mới",
  edit: "Chỉnh sửa",
  detail: "Chi tiết",
  view: "Xem"
}

const NavTrigger = () => {
  const pathname = usePathname()

  // Bỏ qua nếu đang ở trang chủ
  if (pathname === "/") {
    return null
  }

  // Tách đường dẫn thành các phần
  const pathSegments = pathname.split("/").filter(Boolean)

  // Tạo các mục breadcrumb
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Xây dựng đường dẫn tích lũy cho mỗi phần
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`

    // Lấy tên hiển thị từ map, hoặc dùng tên segment nếu không có trong map
    const displayName = breadcrumbNameMap[segment] || segment

    // Kiểm tra xem đây có phải là mục cuối cùng không
    const isLast = index === pathSegments.length - 1

    return {
      href,
      displayName,
      isLast
    }
  })
  return (
    <>
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) =>
            breadcrumb.isLast ? (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{breadcrumb.displayName}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {breadcrumb.displayName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </Fragment>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}

export default NavTrigger
