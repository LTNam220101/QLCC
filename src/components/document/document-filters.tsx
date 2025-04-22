"use client";

import { useEffect } from "react";
import { Calendar as CalendarComponent, Search, Trash2 } from "lucide-react";
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
  useDocumentStore,
  buildings,
  documentStatuses,
} from "@/lib/store/use-document-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export function DocumentFilters() {
  const { filters, setFilter, clearFilters, applyFilters } = useDocumentStore();

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="mb-2">Tên tài liệu căn hộ</Label>
          <Input
            value={filters.name}
            onChange={(e) => setFilter("name", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2">Tòa nhà</Label>
          <Select
            value={filters.building}
            onValueChange={(value) => {
              if (value !== "all") {
                setFilter("building", value);
              } else {
                setFilter("building", "");
              }
            }}
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
          <Label className="mb-2">Trạng thái</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => {
              if (value !== "all") {
                setFilter("status", value);
              } else {
                setFilter("status", "");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {documentStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Ngày hiệu lực (Từ - Đến)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.effectiveDateRange && "text-muted-foreground"
                )}
              >
                <CalendarComponent className="ml-auto h-4 w-4 opacity-50" />
                {filters.effectiveDateRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                locale={vi}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    const dateRange = `${format(
                      range.from,
                      "dd/MM/yyyy"
                    )} - ${format(range.to, "dd/MM/yyyy")}`;
                    setFilter("effectiveDateRange", dateRange);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-2">Ngày tạo (Từ - Đến)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.createdDateRange && "text-muted-foreground"
                )}
              >
                <CalendarComponent className="ml-auto h-4 w-4 opacity-50" />
                {filters.createdDateRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={2030}
                locale={vi}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    const dateRange = `${format(
                      range.from,
                      "dd/MM/yyyy"
                    )} - ${format(range.to, "dd/MM/yyyy")}`;
                    setFilter("createdDateRange", dateRange);
                  }
                }}
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
