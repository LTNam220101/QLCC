"use client"

import { useEffect, useState } from "react"
import { useMovingTicketFilterStore } from "@/lib/store/use-moving-ticket-filter-store"
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
import { CalendarIcon, Search, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import { TransferType } from "@/enum"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"

export function MovingTicketFilters() {
  const { filter, setFilter, resetFilter } = useMovingTicketFilterStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const [statusList, setStatusList] = useState(filter.statusList)
  const [transferType, setTransferType] = useState(filter.transferType)
  const [ticketCode, setTicketCode] = useState(filter.ticketCode || "")
  const [manageBuildingList, setManageBuildingList] = useState(
    filter.manageBuildingList || undefined
  )
  const [manageApartmentList, setManageApartmentList] = useState(
    filter.manageApartmentList || undefined
  )
  const [movingDayTimeFrom, setMovingDayTimeFrom] = useState<Date | undefined>(
    filter.movingDayTimeFrom ? new Date(filter.movingDayTimeFrom) : undefined
  )
  const [movingDayTimeTo, setMovingDayTimeTo] = useState<Date | undefined>(
    filter.movingDayTimeTo ? new Date(filter.movingDayTimeTo) : undefined
  )

  const { data } = useApartments(
    {
      manageBuildingList: manageBuildingList,
      page: 0,
      size: 1000
    },
    !!manageBuildingList?.[0]
  )
  // Áp dụng bộ lọc
  const applyFilter = () => {
    setFilter({
      statusList: statusList || undefined,
      transferType: transferType,
      ticketCode: ticketCode || undefined,
      manageBuildingList: manageBuildingList || undefined,
      manageApartmentList: manageApartmentList || undefined,
      movingDayTimeFrom: movingDayTimeFrom
        ? movingDayTimeFrom.getTime()
        : undefined,
      movingDayTimeTo: movingDayTimeTo ? movingDayTimeTo.getTime() : undefined,
      page: 0 // Reset về trang 1 khi lọc
    })
  }
  // Xóa bộ lọc
  const clearFilter = () => {
    setStatusList(undefined)
    setTransferType(undefined)
    setTicketCode("")
    setManageBuildingList(undefined)
    setManageApartmentList(undefined)
    setMovingDayTimeFrom(undefined)
    setMovingDayTimeTo(undefined)
    resetFilter()
  }

  useEffect(() => {
    setStatusList(filter.statusList || undefined)
    setTransferType(filter.transferType)
    setTicketCode(filter.ticketCode || "")
    setManageBuildingList(filter.manageBuildingList || undefined)
    setManageApartmentList(filter.manageApartmentList || undefined)
    setMovingDayTimeFrom(
      filter.movingDayTimeFrom ? new Date(filter.movingDayTimeFrom) : undefined
    )
    setMovingDayTimeTo(
      filter.movingDayTimeTo ? new Date(filter.movingDayTimeTo) : undefined
    )
  }, [filter])
  return (
    <div className="flex space-x-[14px] mt-5 mb-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[14px] gap-y-4">
        {/* Trạng thái */}
        <div>
          <Label className="mb-2">Trạng thái</Label>
          <Select
            value={`${statusList?.[0]}`}
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

        {/* Hình thức */}
        <div>
          <Label className="mb-2">Hình thức</Label>
          <Select
            value={`${transferType}`}
            onValueChange={(value) => {
              if (value !== "all") {
                setTransferType(+value)
              } else {
                setTransferType(undefined)
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">{TransferType[1]}</SelectItem>
              <SelectItem value="0">{TransferType[0]}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mã đăng ký */}
        <div>
          <Label className="mb-2">Mã đăng ký</Label>
          <Input
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
          />
        </div>

        {/* Ngày tạo */}
        <div>
          <Label className="mb-2">Ngày chuyển đồ (Từ - Đến)</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !movingDayTimeFrom &&
                      !movingDayTimeTo &&
                      "text-muted-foreground"
                  )}
                >
                  {movingDayTimeFrom
                    ? format(movingDayTimeFrom, "dd/MM/yyyy")
                    : "-"}{" "}
                  -
                  {movingDayTimeTo
                    ? format(movingDayTimeTo, "dd/MM/yyyy")
                    : " -"}
                  <CalendarIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  captionLayout="dropdown-buttons"
                  fromYear={1960}
                  toYear={2030}
                  selected={{ from: movingDayTimeFrom, to: movingDayTimeTo }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setMovingDayTimeFrom(range?.from)
                    }
                    if (range?.to) {
                      setMovingDayTimeTo(range?.to)
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
            value={manageBuildingList?.[0]}
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
            value={manageApartmentList?.[0]}
            onValueChange={(value) => {
              if (value !== "all") {
                setManageApartmentList([value])
              } else {
                setManageApartmentList(undefined)
              }
            }}
            disabled={!manageBuildingList?.[0]}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {data?.data?.data?.map((apartment) => (
                <SelectItem key={apartment.id} value={apartment.id}>
                  {apartment.apartmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Nút tìm kiếm và xóa bộ lọc */}
      <div className="flex gap-2 mt-[21px]">
        <Button onClick={applyFilter}>
          <Search className="h-4 w-4" /> Tìm kiếm
        </Button>
        <Button
          variant="outline"
          onClick={clearFilter}
          className="text-red hover:text-red"
        >
          <Trash2 className="h-4 w-4" color="#FE0000" /> Xóa tìm kiếm
        </Button>
      </div>
    </div>
  )
}
