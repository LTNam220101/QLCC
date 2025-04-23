import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ResidentFilter } from "../../../types/residents";
import { Building } from "../../../types/buildings";

interface ResidentState {
  // Bộ lọc
  filters: ResidentFilter;

  // Hành động
  setFilter: (filter: Partial<ResidentFilter>) => void;
  clearFilters: () => void;
}

const initialFilter: ResidentFilter = {
  status: undefined,
  fullName: undefined,
  phoneNumber: undefined,
  role: undefined,
  manageBuildingList: undefined,
  manageApartmentList: undefined,
  page: 0,
  size: 20,
};

// Tạo store với Zustand
export const useResidentStore = create<ResidentState>()(
  devtools((set) => ({
    filters: initialFilter,

    // Các hành động
    setFilter: (newFilter) =>
      set((state) => {
        const a: any = {};
        if (newFilter.manageBuildingList) {
          a.manageApartmentList = [];
        }
        return {
          filters: { ...state.filters, ...newFilter, ...a },
        };
      }),

    clearFilters: () =>
      set({
        filters: initialFilter,
      }),
  }))
);

// Dữ liệu tham chiếu
export const buildings = [
  { id: "A", name: "Tòa nhà A" },
  { id: "B", name: "Tòa nhà B" },
  { id: "C", name: "Tòa nhà C" },
  { id: "D", name: "Tòa nhà D" },
];

export const apartments = [
  { id: "A-101", name: "A-101", buildingId: "A" },
  { id: "A-102", name: "A-102", buildingId: "A" },
  { id: "A-201", name: "A-201", buildingId: "A" },
  { id: "B-101", name: "B-101", buildingId: "B" },
  { id: "B-102", name: "B-102", buildingId: "B" },
  { id: "C-101", name: "C-101", buildingId: "C" },
  { id: "D-101", name: "D-101", buildingId: "D" },
];

export const roles = [
  { id: "owner", name: "Chủ hộ" },
  { id: "tenant", name: "Người thuê" },
  { id: "family", name: "Thành viên gia đình" },
  { id: "guest", name: "Khách" },
];

export const statuses = [
  { id: "active", name: "Đang hoạt động", color: "green" },
  { id: "pending", name: "Chờ xác minh", color: "orange" },
  { id: "inactive", name: "Huỷ kích hoạt", color: "red" },
  { id: "draft", name: "Soạn thảo", color: "gray" },
  { id: "new", name: "Tạo mới", color: "blue" },
];

// Hàm tiện ích
export const getDisplayName = (
  id: string | number | undefined,
  options: any[]
) => {
  const option = options.find((opt) => opt.id === id);
  return option ? option.name : id;
};
export const getDisplayBuildingName = (
  id: string | number | undefined,
  options?: Building[]
) => {
  const option = options?.find((opt) => opt.buildingId === id);
  return option ? option.buildingName : id;
};

export const getStatusColor = (status: string) => {
  const statusObj = statuses.find((s) => s.id === status);
  return statusObj ? statusObj.color : "gray";
};
