"use client"

import { useEffect, useState } from "react"
import { useReportFilterStore } from "@/lib/store/use-report-filter-store"
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
import { ReportStatus } from "../../../types/reports"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"
import { useQueryClient } from "@tanstack/react-query"
import { reportKeys } from "@/lib/tanstack-query/reports/queries"

export function ReportFilters() {
  const queryClient = useQueryClient()
  const { filter, setFilter, resetFilter } = useReportFilterStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()

  const [statusList, setStatusList] = useState(filter.statusList)
  const [reportContent, setReportContent] = useState(filter.reportContent || "")
  const [manageBuildingList, setManageBuildingId] = useState(
    filter.manageBuildingList || undefined
  )
  const [manageApartmentList, setManageApartmentList] = useState(
    filter.manageApartmentList || undefined
  )
  const [createTimeFrom, setCreateTimeFrom] = useState<Date | undefined>(
    filter.createTimeFrom ? new Date(filter.createTimeFrom) : undefined
  )
  const [createTimeTo, setCreateTimeTo] = useState<Date | undefined>(
    filter.createTimeTo ? new Date(filter.createTimeTo) : undefined
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
    queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
    setFilter({
      statusList: statusList || undefined,
      reportContent: reportContent,
      manageBuildingList: manageBuildingList || undefined,
      manageApartmentList: manageApartmentList || undefined,
      createTimeFrom: createTimeFrom ? createTimeFrom.getTime() : undefined,
      createTimeTo: createTimeTo ? createTimeTo.getTime() : undefined,
      page: 0 // Reset về trang 1 khi lọc
    })
  }
  // Xóa bộ lọc
  const clearFilter = () => {
    setStatusList(undefined)
    setReportContent("")
    setManageBuildingId(undefined)
    setManageApartmentList(undefined)
    setCreateTimeFrom(undefined)
    setCreateTimeTo(undefined)
    resetFilter()
  }

  useEffect(() => {
    setStatusList(filter.statusList || undefined)
    setReportContent(filter.reportContent || "")
    setManageBuildingId(filter.manageBuildingList || undefined)
    setManageApartmentList(filter.manageApartmentList || undefined)
    setCreateTimeFrom(
      filter.createTimeFrom ? new Date(filter.createTimeFrom) : undefined
    )
    setCreateTimeTo(
      filter.createTimeTo ? new Date(filter.createTimeTo) : undefined
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
              {Object.entries(ReportStatus).map(([id, status]) => (
                <SelectItem key={id} value={id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nội dung */}
        <div>
          <Label className="mb-2">Nội dung</Label>
          <Input
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </div>

        {/* Tòa nhà */}
        <div>
          <Label className="mb-2">Tòa nhà</Label>
          <Select
            value={manageBuildingList?.[0] || "all"}
            onValueChange={(value) => {
              if (value !== "all") {
                setManageBuildingId([value])
              } else {
                setManageBuildingId(undefined)
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
                  value={building?.buildingId}
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
                      setCreateTimeFrom(range?.from)
                    }
                    if (range?.to) {
                      setCreateTimeTo(range?.to)
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
