"use client"

import { useEffect, useState } from "react"
import { useHotlineFilterStore } from "@/lib/store/use-hotline-filter-store"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import CalendarIcon from "@/icons/calendar.svg"
import Search from "@/icons/search-normal.svg"
import Trash2 from "@/icons/trash.svg"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import { useQueryClient } from "@tanstack/react-query"
import { hotlineKeys } from "@/lib/tanstack-query/hotlines/queries"

export function HotlineFilters() {
  const queryClient = useQueryClient()
  const { filter, setFilter, resetFilter } = useHotlineFilterStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const [statusList, setStatusList] = useState(filter.statusList || undefined)
  const [name, setName] = useState(filter.name || "")
  const [hotline, setHotline] = useState(filter.hotline || "")
  const [manageBuildingList, setManageBuildingList] = useState(
    filter.manageBuildingList || undefined
  )
  const [createTimeFrom, setFromDate] = useState<Date | undefined>(
    filter.createTimeFrom ? new Date(filter.createTimeFrom) : undefined
  )
  const [createTimeTo, setToDate] = useState<Date | undefined>(
    filter.createTimeTo ? new Date(filter.createTimeTo) : undefined
  )

  // Áp dụng bộ lọc
  const applyFilter = () => {
    queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() })
    setFilter({
      statusList: statusList || undefined,
      name: name || undefined,
      hotline: hotline || undefined,
      manageBuildingList: manageBuildingList || undefined,
      createTimeFrom: createTimeFrom ? createTimeFrom.getTime() : undefined,
      createTimeTo: createTimeTo ? createTimeTo.getTime() : undefined,
      page: 0 // Reset về trang 1 khi lọc
    })
  }

  // Xóa bộ lọc
  const clearFilter = () => {
    setStatusList(undefined)
    setName("")
    setHotline("")
    setFromDate(undefined)
    setToDate(undefined)
    resetFilter()
  }

  useEffect(() => {
    setStatusList(filter.statusList || undefined)
    setName(filter.name || "")
    setHotline(filter.hotline || "")
    setFromDate(
      filter.createTimeFrom ? new Date(filter.createTimeFrom) : undefined
    )
    setToDate(filter.createTimeTo ? new Date(filter.createTimeTo) : undefined)
  }, [filter])

  useEffect(() => {
    return () => {
      clearFilter()
    }
  }, [])

  return (
    <div className="flex space-x-[14px] py-4 px-7 bg-white rounded-b-lg">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-7 gap-y-3">
        {/* Trạng thái */}
        <div>
          <Label className="mb-2">Trạng thái</Label>
          <Select
            value={statusList?.[0] ? `${statusList?.[0]}` : "all"}
            onValueChange={(value) => {
              if (value !== "all") {
                setStatusList([+value])
              } else {
                setStatusList(undefined)
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">Đang hoạt động</SelectItem>
              <SelectItem value="0">Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tên hiển thị */}
        <div>
          <Label className="mb-2">Tên hiển thị</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Số hotline */}
        <div>
          <Label className="mb-2">Số hotline</Label>
          <Input value={hotline} onChange={(e) => setHotline(e.target.value)} />
        </div>

        {/* Ngày tạo */}
        <div>
          <Label className="mb-2">Ngày tạo (Từ - Đến)</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !createTimeFrom && !createTimeTo && "text-muted-foreground"
                  )}
                  size="xl"
                >
                  {createTimeFrom ? format(createTimeFrom, "dd/MM/yyyy") : "-"}{" "}
                  -{createTimeTo ? format(createTimeTo, "dd/MM/yyyy") : " -"}
                  <CalendarIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  captionLayout="dropdown-buttons"
                  fromYear={1960}
                  toYear={2030}
                  selected={{ from: createTimeFrom, to: createTimeTo }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setFromDate(range?.from)
                    }
                    if (range?.to) {
                      setToDate(new Date(range?.to?.getTime() + 86399))
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tòa nhà */}
        <div>
          <Label className="mb-2">Tòa nhà</Label>
          <Select
            value={manageBuildingList?.[0] || "all"}
            onValueChange={(value) => {
              if (value !== "all") {
                setManageBuildingList([value])
              } else {
                setManageBuildingList(undefined)
              }
            }}
            disabled={isLoadingBuildings}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {buildings?.map((building) => (
                <SelectItem
                  key={building.buildingId}
                  value={building?.buildingId?.toString()}
                >
                  {building.buildingName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Nút tìm kiếm và xóa bộ lọc */}
      <div className="flex gap-2 mt-[21px]">
        <Button size={"xl"} onClick={applyFilter} className="font-bold">
          <Search className="h-6 w-6 [&>path]:stroke-white" /> Tìm kiếm
        </Button>
        <Button
          size={"xl"}
          variant="outline"
          onClick={clearFilter}
          className="border-red text-red hover:text-red font-bold"
        >
          <Trash2 className="h-6 w-6 [&>path]:stroke-red" /> Xóa tìm kiếm
        </Button>
      </div>
    </div>
  )
}
