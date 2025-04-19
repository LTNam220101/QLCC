"use client";

import { useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
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
  useResidentStore,
  buildings,
  apartments,
  roles,
  statuses,
} from "@/lib/store/use-resident-store";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

export function ResidentFilters() {
  const { filters, setFilter, clearFilters, applyFilters } = useResidentStore();

  // Lấy danh sách căn hộ theo tòa nhà đã chọn
  const filteredApartments =
    filters.building && filters.building !== "all"
      ? apartments.filter((apt) => apt.buildingId === filters.building)
      : apartments;

  // Xử lý tìm kiếm
  const handleSearch = () => {
    applyFilters();
  };

  // Áp dụng bộ lọc khi component được mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <>
      <div className="flex space-x-[14px] mt-5 mb-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[14px] gap-y-4">
          <div>
            <Label className="mb-2">Họ và tên</Label>
            <Input
              value={filters.name}
              onChange={(e) => setFilter("name", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Số điện thoại</Label>
            <Input
              value={filters.phone}
              onChange={(e) => setFilter("phone", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Vai trò</Label>
            <Select
              value={filters.role}
              onValueChange={(value) => setFilter("role", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Trạng thái</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilter("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Toà nhà</Label>
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
            <Label className="mb-2">Căn hộ</Label>
            <Select
              value={filters.apartment}
              onValueChange={(value) => setFilter("apartment", value)}
              disabled={!filters.building || filters.building === "all"}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả căn hộ</SelectItem>
                {filteredApartments.map((apartment) => (
                  <SelectItem key={apartment.id} value={apartment.id}>
                    {apartment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nút tìm kiếm và xóa bộ lọc */}
        <div className="flex gap-2 mt-[21px]">
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" /> Tìm kiếm
          </Button>
          <Button variant="outline" onClick={clearFilters} className="text-red hover:text-red">
            <Trash2 className="h-4 w-4" color="#FE0000" /> Xóa tìm kiếm
          </Button>
        </div>
      </div>
      <Separator className="bg-[#D9D9D9]" />
    </>
  );
}
