"use client"

import { useEffect, useState } from "react"
import { useNotificationFilterStore } from "@/lib/store/use-notification-filter-store"
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
import { useApartments } from "@/lib/tanstack-query/apartments/queries"
import { notificationKeys } from "@/lib/tanstack-query/notifications/queries"
import { useQueryClient } from "@tanstack/react-query"

export function NotificationFilters() {
  const queryClient = useQueryClient()
  const { filter, setFilter, resetFilter } = useNotificationFilterStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()

  const [title, setTitle] = useState(filter.title || "")
  const [content, setContent] = useState(filter.content || "")
  const [manageBuildingList, setManageBuildingList] = useState(
    filter.manageBuildingList || undefined
  )
  const [manageApartmentList, setManageApartmentList] = useState(
    filter.manageApartmentList || undefined
  )
  const [sentTimeFrom, setSentFromDate] = useState<Date | undefined>(
    filter.sentTimeFrom ? new Date(filter.sentTimeFrom) : undefined
  )
  const [sentTimeTo, setSentToDate] = useState<Date | undefined>(
    filter.sentTimeTo ? new Date(filter.sentTimeTo) : undefined
  )
  const [createTimeFrom, setFromDate] = useState<Date | undefined>(
    filter.createTimeFrom ? new Date(filter.createTimeFrom) : undefined
  )
  const [createTimeTo, setToDate] = useState<Date | undefined>(
    filter.createTimeTo ? new Date(filter.createTimeTo) : undefined
  )

  const { data: apartments } = useApartments(
    {
      manageBuildingList: manageBuildingList
        ? [manageBuildingList?.[0]]
        : undefined,
      page: 0,
      size: 1000
    },
    !!manageBuildingList?.[0]
  )

  // Áp dụng bộ lọc
  const applyFilter = () => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    setFilter({
      title: title || "",
      content: content || "",
      manageBuildingList: manageBuildingList || undefined,
      manageApartmentList: manageApartmentList || undefined,
      sentTimeFrom: sentTimeFrom ? sentTimeFrom.getTime() : undefined,
      sentTimeTo: sentTimeTo ? sentTimeTo.getTime() : undefined,
      createTimeFrom: createTimeFrom ? createTimeFrom.getTime() : undefined,
      createTimeTo: createTimeTo ? createTimeTo.getTime() : undefined,
      page: 0 // Reset về trang 1 khi lọc
    })
  }

  // Xóa bộ lọc
  const clearFilter = () => {
    setTitle("")
    setContent("")
    setManageBuildingList(undefined)
    setManageApartmentList(undefined)
    setSentFromDate(undefined)
    setSentToDate(undefined)
    setFromDate(undefined)
    setToDate(undefined)
    resetFilter()
  }

  useEffect(() => {
    setTitle(filter.title || "")
    setContent(filter.content || "")
    setManageBuildingList(filter.manageBuildingList || undefined)
    setManageApartmentList(filter.manageApartmentList || undefined)
    setSentFromDate(
      filter.sentTimeFrom ? new Date(filter.sentTimeFrom) : undefined
    )
    setSentToDate(filter.sentTimeTo ? new Date(filter.sentTimeTo) : undefined)
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
        {/* Tiêu đề thông báo */}
        <div>
          <Label className="mb-2">Tiêu đề thông báo</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Nội dung thông báo */}
        <div>
          <Label className="mb-2">Nội dung thông báo</Label>
          <Input value={content} onChange={(e) => setContent(e.target.value)} />
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

        {/* Căn hộ */}
        <div>
          <Label className="mb-2">Căn hộ</Label>
          <Select
            value={manageApartmentList?.[0] || "all"}
            onValueChange={(value) => {
              if (value !== "all") {
                setManageApartmentList([value])
              } else {
                setManageApartmentList(undefined)
              }
            }}
            disabled={isLoadingBuildings}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {apartments?.data?.data?.map((apartment) => (
                <SelectItem key={apartment.id} value={apartment?.id}>
                  {apartment.apartmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ngày gửi */}
        <div>
          <Label className="mb-2">Ngày gửi (Từ - Đến)</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !sentTimeFrom && !sentTimeTo && "text-muted-foreground"
                  )}
                >
                  {sentTimeFrom ? format(sentTimeFrom, "dd/MM/yyyy") : "-"} -
                  {sentTimeTo ? format(sentTimeTo, "dd/MM/yyyy") : " -"}
                  <CalendarIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  captionLayout="dropdown-buttons"
                  fromYear={1960}
                  toYear={2030}
                  selected={{ from: sentTimeFrom, to: sentTimeTo }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setSentFromDate(range?.from)
                    }
                    if (range?.to) {
                      setSentToDate(new Date(range?.to?.getTime() + 86399))
                    }
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>
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
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>
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
