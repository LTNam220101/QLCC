"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useResidentStore } from "@/lib/store/use-resident-store"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { ResidentStatus } from "../../../types/residents"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { vi } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { residentKeys } from "@/lib/tanstack-query/residents/queries"

export function ResidentFilters() {
  const queryClient = useQueryClient()
  const { filters, setFilter, clearFilters } = useResidentStore()
  const [fullName, setFullName] = useState(filters.fullName || "")
  const [phoneNumber, setPhoneNumber] = useState(filters.phoneNumber || "")
  const [statusList, setStatusList] = useState(filters.statusList || undefined)
  const [identifyId, setIdentifyId] = useState(filters.identifyId || "")
  const [createTimeFrom, setFromDate] = useState<Date | undefined>(
    filters.createTimeFrom ? new Date(filters.createTimeFrom) : undefined
  )
  const [createTimeTo, setToDate] = useState<Date | undefined>(
    filters.createTimeTo ? new Date(filters.createTimeTo) : undefined
  )

  // Xử lý tìm kiếm
  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: residentKeys.lists() })
    setFilter({
      fullName: fullName || undefined,
      phoneNumber: phoneNumber || undefined,
      identifyId: identifyId || "",
      statusList: statusList || undefined,
      createTimeFrom: createTimeFrom ? createTimeFrom.getTime() : undefined,
      createTimeTo: createTimeTo ? createTimeTo.getTime() : undefined,
      page: 0
    })
  }

  // Xóa bộ lọc
  const clearFilter = () => {
    setFullName("")
    setPhoneNumber("")
    setIdentifyId("")
    setStatusList(undefined)
    setFromDate(undefined)
    setToDate(undefined)
    clearFilters()
  }

  useEffect(() => {
    setFullName(filters.fullName || "")
    setPhoneNumber(filters.phoneNumber || "")
    setIdentifyId(filters.identifyId || "")
    setStatusList(filters.statusList)
    setFromDate(
      filters.createTimeFrom ? new Date(filters.createTimeFrom) : undefined
    )
    setToDate(filters.createTimeTo ? new Date(filters.createTimeTo) : undefined)
  }, [filters])

  useEffect(() => {
    return () => {
      clearFilter()
    }
  }, [])

  return (
    <>
      <div className="flex space-x-[14px] mt-5 mb-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[14px] gap-y-4">
          <div>
            <Label className="mb-2">Số điện thoại</Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Họ và tên</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Số CMND/CCCD/Hộ chiếu</Label>
            <Input
              value={identifyId}
              onChange={(e) => setIdentifyId(e.target.value)}
            />
          </div>
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
                {Object.entries(ResidentStatus).map(([id, status]) => (
                  <SelectItem key={id} value={id}>
                    {status.name}
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
                      !createTimeFrom &&
                        !createTimeTo &&
                        "text-muted-foreground"
                    )}
                  >
                    {createTimeFrom
                      ? format(createTimeFrom, "dd/MM/yyyy")
                      : "-"}{" "}
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
                        setToDate(new Date(range?.to?.getTime()+86399))
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
          <Button onClick={handleSearch}>
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
      <Separator className="bg-[#D9D9D9]" />
    </>
  )
}
