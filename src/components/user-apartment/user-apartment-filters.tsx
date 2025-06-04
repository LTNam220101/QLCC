"use client"

import { useEffect, useState } from "react"
import CalendarComponent from "@/icons/calendar.svg"
import Search from "@/icons/search-normal.svg"
import Trash2 from "@/icons/trash.svg"
import { Button } from "@/components/ui/button"
import { useUserApartmentStore } from "@/lib/store/use-user-apartment-store"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Label } from "../ui/label"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select"
import { Input } from "../ui/input"
import { useQueryClient } from "@tanstack/react-query"
import { userApartmentKeys } from "@/lib/tanstack-query/user-apartments/queries"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"
import { UserApartmentStatus, UserApartmentRole } from "../../../types/user-apartments"

export function UserApartmentFilters() {
  const queryClient = useQueryClient()
  const { filters, setFilter, clearFilters } = useUserApartmentStore()
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings()
  const [userPhone, setUserPhone] = useState(filters.userPhone || "")
  const [fullName, setFullName] = useState(filters.fullName || "")
  const [manageBuildingList, setManageBuildingList] = useState(
    filters.manageBuildingList || undefined
  )
  const [manageApartmentList, setManageApartmentList] = useState(
    filters.manageApartmentList || undefined
  )
  const [statusList, setStatusList] = useState(filters.statusList || undefined)
  const [userApartmentRoleName, setUserApartmentRoleName] = useState(
    filters.userApartmentRoleName || undefined
  )
  const [createTimeFrom, setFromDate] = useState<Date | undefined>(
    filters.createTimeFrom ? new Date(filters.createTimeFrom) : undefined
  )
  const [createTimeTo, setToDate] = useState<Date | undefined>(
    filters.createTimeTo ? new Date(filters.createTimeTo) : undefined
  )
  const { data } = useApartments(
    {
      manageBuildingList: manageBuildingList,
      page: 0,
      size: 1000
    },
    !!manageBuildingList?.[0]
  )
  // Xử lý tìm kiếm
  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: userApartmentKeys.lists() })
    setFilter({
      userPhone: userPhone || undefined,
      fullName: fullName || undefined,
      userApartmentRoleName: userApartmentRoleName || undefined,
      manageBuildingList: manageBuildingList || undefined,
      manageApartmentList: manageApartmentList || undefined,
      statusList: statusList || undefined,
      createTimeFrom: createTimeFrom ? createTimeFrom.getTime() : undefined,
      createTimeTo: createTimeTo ? createTimeTo.getTime() : undefined,
      page: 0
    })
  }

  // Xóa bộ lọc
  const clearFilter = () => {
    setUserPhone("")
    setFullName("")
    setManageBuildingList(undefined)
    setManageApartmentList(undefined)
    setStatusList(undefined)
    setUserApartmentRoleName(undefined)
    setFromDate(undefined)
    setToDate(undefined)
    clearFilters()
  }

  useEffect(() => {
    setUserPhone(filters.userPhone || "")
    setFullName(filters.fullName || "")
    setManageBuildingList(filters.manageBuildingList)
    setManageApartmentList(filters.manageApartmentList)
    setStatusList(filters.statusList)
    setUserApartmentRoleName(filters.userApartmentRoleName)
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
    <div className="flex space-x-[14px] py-4 px-7 bg-white rounded-b-lg">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-3">
        <div>
          <Label className="mb-2">Số điện thoại</Label>
          <Input
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
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
          <Label className="mb-2">Tòa nhà</Label>
          <Select
            value={manageBuildingList?.[0] || "all"}
            onValueChange={(value) => {
              if (value !== "all") {
                setManageBuildingList([value])
              } else {
                setManageBuildingList([])
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {buildings?.map((building) => (
                <SelectItem
                  key={building.buildingId}
                  value={building.buildingId}
                >
                  {building.buildingName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {data?.data?.data?.map((apartment) => (
                <SelectItem key={apartment.id} value={apartment.id}>
                  {apartment.apartmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              {Object.entries(UserApartmentStatus).map(([id, status]) => (
                <SelectItem key={id} value={id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trạng thái */}
        <div>
          <Label className="mb-2">Vai trò</Label>
          <Select
            value={userApartmentRoleName ? `${userApartmentRoleName}` : "all"}
            onValueChange={(value) => {
              if (value !== "all") {
                setUserApartmentRoleName(value)
              } else {
                setUserApartmentRoleName(undefined)
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(UserApartmentRole).map(([id, role]) => (
                <SelectItem key={id} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Ngày tạo (Từ - Đến)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !createTimeFrom && !createTimeTo && "text-muted-foreground"
                )}
              >
                {createTimeFrom ? format(createTimeFrom, "dd/MM/yyyy") : "-"} -
                {createTimeTo ? format(createTimeTo, "dd/MM/yyyy") : " -"}
                <CalendarComponent className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                captionLayout="dropdown-buttons"
                fromYear={1960}
                toYear={2030}
                locale={vi}
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
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Nút tìm kiếm và xóa bộ lọc */}
      <div className="flex gap-2 mt-[21px]">
        <Button size={"xl"} onClick={handleSearch} className="font-bold">
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
