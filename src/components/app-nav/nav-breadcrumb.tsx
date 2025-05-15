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

// Map các đường dẫn URL sang tên hiển thị thân thiện
const breadcrumbNameMap: Record<string, string> = {
  // Toà nhà
  "building-information": "Thông tin toà nhà",
  residents: "Quản lý cư dân",
  apartments: "Quản lý căn hộ",
  documents: "Quản lý tài liệu căn hộ",
  links: "Quản lý liên kết căn hộ",
  //Dịch vụ
  services: "Quản lý dịch vụ",
  reports: "Quản lý phản ánh",
  "moving-tickets": "Quản lý đăng ký chuyển đồ",
  hotlines: "Quản lý hotline",
  // Thông báo, bảng tin
  boards: "Thông báo/Bảng tin",
  notifications: "Thông báo",
  news: "Bảng tin",
  // Profile
  profile: "Tài khoản",
  "profile-info": "Thông tin tài khoản",
  "change-profile": "Sửa thông tin tài khoản",
  "change-password": "Đổi mật khẩu"
}

const NavBreadcrumb = () => {
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
    let displayName = breadcrumbNameMap[segment]
    const prev = pathSegments[index - 1] || ""
    const prevPrev = pathSegments[index - 2] || ""
    const prevName = (breadcrumbNameMap[prev]?.toLowerCase() || "").replace(
      "quản lý",
      ""
    )
    const prevPrevName = (
      breadcrumbNameMap[prevPrev]?.toLowerCase() || ""
    ).replace("quản lý", "")

    // Kiểm tra xem đây có phải là mục cuối cùng không
    const isLast = index === pathSegments.length - 1

    if (!displayName) {
      if (segment === "edit") {
        displayName = `Cập nhật ${prevPrevName}`.trim()
      } else if (segment === "add") {
        displayName = `Thêm mới ${prevName}`.trim()
      } else {
        // Tự động đặt "Chi tiết [đối tượng]" dựa vào segment trước đó
        displayName = `Chi tiết ${prevName}`.trim()
      }
    }

    return {
      href,
      displayName,
      isLast
    }
  })
  return (
    <Breadcrumb className="ml-[14px] mt-[14px] mb-[10px]">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {breadcrumbs.map((breadcrumb, index) =>
          breadcrumb.isLast ? (
            <BreadcrumbItem key={index}>
              <BreadcrumbPage>{breadcrumb.displayName}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={breadcrumb.href || "/"}>
                  {breadcrumb.displayName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default NavBreadcrumb
