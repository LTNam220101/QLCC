"use client";

import { useEffect, useState } from "react";
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
  apartments,
  roles,
} from "@/lib/store/use-resident-store";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useBuildings } from "@/lib/tanstack-query/buildings/queries";
import { ResidentStatus } from "../../../types/residents";

export function ResidentFilters() {
  const { data: buildings } = useBuildings();
  const { filters, setFilter, clearFilters } = useResidentStore();
  const [fullName, setFullName] = useState(filters.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(filters.phoneNumber || "");
  const [role, setRole] = useState(filters.role || "");
  const [status, setStatus] = useState(filters.status || undefined);
  const [manageBuildingList, setManageBuildingList] = useState(
    filters.manageBuildingList || []
  );
  const [manageApartmentList, setManageApartmentList] = useState(
    filters.manageApartmentList || []
  );

  // Lấy danh sách căn hộ theo tòa nhà đã chọn
  const filteredApartments =
    filters.manageBuildingList && filters.manageBuildingList.length !== 0
      ? apartments.filter(
          (apt) => apt.buildingId === filters.manageBuildingList?.[0]
        )
      : apartments;

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setFilter({
      fullName: fullName || undefined,
      phoneNumber: phoneNumber || undefined,
      role: role || undefined,
      status: status || undefined,
      manageBuildingList: manageBuildingList || [],
      manageApartmentList: manageApartmentList || [],
      page: 0,
    });
  };

  // Xóa bộ lọc
  const clearFilter = () => {
    setFullName("");
    setPhoneNumber("");
    setRole("");
    setStatus(undefined);
    setManageBuildingList([]);
    setManageApartmentList([]);
    clearFilters();
  };

  useEffect(() => {
    setFullName(filters.fullName || "");
    setPhoneNumber(filters.phoneNumber || "");
    setRole(filters.role || "");
    setStatus(filters.status);
    setManageBuildingList(filters.manageBuildingList || []);
    setManageApartmentList(filters.manageApartmentList || []);
  }, [filters]);

  return (
    <>
      <div className="flex space-x-[14px] mt-5 mb-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[14px] gap-y-4">
          <div>
            <Label className="mb-2">Họ và tên</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Số điện thoại</Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">Vai trò</Label>
            <Select
              value={role}
              onValueChange={(value) => {
                if (value !== "all") {
                  setRole(value);
                } else {
                  setRole("");
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"all"}>Tất cả vai trò</SelectItem>
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
              value={`${status}`}
              onValueChange={(value) => {
                if (value !== "all") {
                  setStatus(+value);
                } else {
                  setStatus(undefined);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(ResidentStatus).map(([id, status]) => (
                  <SelectItem key={id} value={id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Toà nhà</Label>
            <Select
              value={manageBuildingList?.[0] || ""}
              onValueChange={(value) => {
                if (value !== "all") {
                  setManageBuildingList([value]);
                } else {
                  setManageBuildingList([]);
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
              value={manageApartmentList?.[0] || ""}
              onValueChange={(value) => {
                if (value !== "all") {
                  setManageApartmentList([value]);
                } else {
                  setManageApartmentList([]);
                }
              }}
              disabled={
                !manageBuildingList?.[0] || manageBuildingList?.[0] === ""
              }
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
  );
}
