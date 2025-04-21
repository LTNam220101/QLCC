"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Calendar as CalendarComponent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Label } from "../ui/label";
import { useBuildings } from "@/lib/tanstack-query/buildings/queries";
import { cn } from "@/lib/utils";

export function ApartmentFilters() {
  const { filters, setFilter, clearFilters } = useApartmentStore();
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings();
  const [apartmentName, setApartmentName] = useState(
    filters.apartmentName || ""
  );
  const [buildingName, setBuildingName] = useState(filters.buildingName || "");
  const [createTimeFrom, setFromDate] = useState<Date | undefined>(
    filters.createTimeFrom ? new Date(filters.createTimeFrom) : undefined
  );
  const [createTimeTo, setToDate] = useState<Date | undefined>(
    filters.createTimeTo ? new Date(filters.createTimeTo) : undefined
  );
  // Xử lý tìm kiếm
  const handleSearch = () => {
    setFilter({
      apartmentName: apartmentName || undefined,
      buildingName: buildingName || undefined,
      createTimeFrom: createTimeFrom ? createTimeFrom.getTime() : undefined,
      createTimeTo: createTimeTo ? createTimeTo.getTime() : undefined,
      page: 0,
    });
  };

  // Xóa bộ lọc
  const clearFilter = () => {
    setApartmentName("");
    setBuildingName("");
    setFromDate(undefined);
    setToDate(undefined);
    clearFilters();
  };

  useEffect(() => {
    setApartmentName(filters.apartmentName || "");
    setBuildingName(filters.buildingName || "");
    setFromDate(
      filters.createTimeFrom ? new Date(filters.createTimeFrom) : undefined
    );
    setToDate(
      filters.createTimeTo ? new Date(filters.createTimeTo) : undefined
    );
  }, [filters]);

  return (
    <div className="flex space-x-[14px] mt-5 mb-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[14px] gap-y-4">
        {/* <div>
          <Label className="mb-2">Tòa nhà</Label>
          <Select
            value={filters.buildingName}
            onValueChange={(value) => setBuildingName(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tòa nhà</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building.id} value={building.id}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Căn hộ</Label>
          <Input
            value={filters.apartmentName}
            onChange={(e) => setApartmentName(e.target.value)}
          />
        </div> */}

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
                locale={vi}
                selected={{ from: createTimeFrom, to: createTimeTo }}
                onSelect={(range) => {
                  if (range?.from) {
                    setFromDate(range?.from);
                  }
                  if (range?.to) {
                    setToDate(range?.to);
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
  );
}
