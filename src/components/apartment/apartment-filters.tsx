"use client";

import { useEffect } from "react";
import { Search, Trash2, Calendar as CalendarComponent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useApartmentStore,
  vehicleTypes,
} from "@/lib/store/use-apartment-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { buildings } from "@/lib/store/use-resident-store";
import { Label } from "../ui/label";

export function ApartmentFilters() {
  const { filters, setFilter, clearFilters, applyFilters } =
    useApartmentStore();

  // Xử lý tìm kiếm
  const handleSearch = () => {
    applyFilters();
  };

  // Áp dụng bộ lọc khi component được mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="flex space-x-[14px] mt-5 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[14px] gap-y-4">
        <div>
          <Label className="mb-2">Tòa nhà</Label>
          <Select
            value={filters.building}
            onValueChange={(value) => setFilter("building", value)}
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
          <Label className="mb-2">Số căn hộ</Label>
          <Input
            value={filters.apartmentNumber}
            onChange={(e) => setFilter("apartmentNumber", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2">Số lượng phương tiện</Label>
          <Input
            value={filters.vehicleCount}
            onChange={(e) => setFilter("vehicleCount", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2">Loại phương tiện</Label>
          <Select
            value={filters.vehicleType}
            onValueChange={(value) => setFilter("vehicleType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Diện tích</Label>
          <Input
            value={filters.area}
            onChange={(e) => setFilter("area", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2">Ghi chú</Label>
          <Input
            value={filters.note}
            onChange={(e) => setFilter("note", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2">Ngày tạo (Từ - Đến)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {filters.dateRange
                  ? format(filters.dateRange, "dd/MM/yyyy", { locale: vi })
                  : null}
                <CalendarComponent className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                locale={vi}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    const dateRange = `${format(
                      range.from,
                      "dd/MM/yyyy"
                    )} - ${format(range.to, "dd/MM/yyyy")}`;
                    setFilter("dateRange", dateRange);
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
          onClick={clearFilters}
          className="text-red hover:text-red"
        >
          <Trash2 className="h-4 w-4" color="#FE0000" /> Xóa tìm kiếm
        </Button>
      </div>
    </div>
  );
}
