"use client"

import { useEffect, useState } from "react"
import { useNewsFilterStore } from "@/lib/store/use-news-filter-store"
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
import { useQueryClient } from "@tanstack/react-query"
import { newsKeys } from "@/lib/tanstack-query/news/queries"

export function NewsFilters() {
  const queryClient = useQueryClient()
  const { filter, setFilter, resetFilter } = useNewsFilterStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()

  const [title, setTitle] = useState(filter.title || "")
  const [manageBuildingList, setManageBuildingList] = useState(
    filter.manageBuildingList || undefined
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

  // Áp dụng bộ lọc
  const applyFilter = () => {
    queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
setFilter({
      title: title || "",
      manageBuildingList: manageBuildingList || undefined,
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
    setManageBuildingList(undefined)
    setSentFromDate(undefined)
    setSentToDate(undefined)
    setFromDate(undefined)
    setToDate(undefined)
    resetFilter()
  }

  useEffect(() => {
    setTitle(filter.title || "")
    setManageBuildingList(filter.manageBuildingList || undefined)
    setSentFromDate(
      filter.sentTimeFrom ? new Date(filter.sentTimeFrom) : undefined
    )
    setSentToDate(filter.sentTimeTo ? new Date(filter.sentTimeTo) : undefined)
    setFromDate(
      filter.createTimeFrom ? new Date(filter.createTimeFrom) : undefined
    )
    setToDate(filter.createTimeTo ? new Date(filter.createTimeTo) : undefined)
  }, [filter])

  return (
    <div className="flex space-x-[14px] mt-5 mb-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[14px] gap-y-4">
        {/* Tiêu đề thông báo */}
        <div>
          <Label className="mb-2">Tiêu đề thông báo</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
                      setSentToDate(range?.to)
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
                      setToDate(range?.to)
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
