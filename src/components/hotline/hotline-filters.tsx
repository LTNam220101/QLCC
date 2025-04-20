"use client"

import { useState } from "react"
import { useHotlineFilterStore } from "@/lib/store/use-hotline-filter-store"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function HotlineFilters() {
  const { filter, setFilter, resetFilter } = useHotlineFilterStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()

  const [name, setName] = useState(filter.name || "")
  const [phoneNumber, setPhoneNumber] = useState(filter.phoneNumber || "")
  const [fromDate, setFromDate] = useState<Date | undefined>(filter.fromDate ? new Date(filter.fromDate) : undefined)
  const [toDate, setToDate] = useState<Date | undefined>(filter.toDate ? new Date(filter.toDate) : undefined)

  // Áp dụng bộ lọc
  const applyFilter = () => {
    setFilter({
      name: name || undefined,
      phoneNumber: phoneNumber || undefined,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      page: 1, // Reset về trang 1 khi lọc
    })
  }

  // Xóa bộ lọc
  const clearFilter = () => {
    setName("")
    setPhoneNumber("")
    setFromDate(undefined)
    setToDate(undefined)
    resetFilter()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trạng thái */}
        <div>
          <label className="text-sm font-medium">Trạng thái</label>
          <Select
            value={filter.status || ""}
            onValueChange={(value) => setFilter({ status: value ? (value as "active" | "inactive") : undefined })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tên hiển thị */}
        <div>
          <label className="text-sm font-medium">Tên hiển thị</label>
          <Input placeholder="Nhập tên hiển thị" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Số hotline */}
        <div>
          <label className="text-sm font-medium">Số hotline</label>
          <Input placeholder="Nhập số hotline" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        {/* Ngày tạo */}
        <div>
          <label className="text-sm font-medium">Ngày tạo (Từ - Đến)</label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : "Từ ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus locale={vi} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "dd/MM/yyyy") : "Đến ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus locale={vi} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tòa nhà */}
        <div>
          <label className="text-sm font-medium">Tòa nhà</label>
          <Select
            value={filter.buildingId?.toString() || ""}
            onValueChange={(value) => setFilter({ buildingId: value ? Number.parseInt(value) : undefined })}
            disabled={isLoadingBuildings}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {buildings?.map((building) => (
                <SelectItem key={building.id} value={building.id.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={clearFilter}>
          <X className="mr-2 h-4 w-4" />
          Xóa tìm kiếm
        </Button>
        <Button onClick={applyFilter}>
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  )
}
