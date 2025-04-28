import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { ResidentFilter } from "../../../types/residents"
import { Building } from "../../../types/buildings"

interface ResidentState {
  // Bộ lọc
  filters: ResidentFilter

  // Hành động
  setFilter: (filter: Partial<ResidentFilter>) => void
  clearFilters: () => void
}

const initialFilter: ResidentFilter = {
  status: undefined,
  fullName: undefined,
  phoneNumber: undefined,
  identifyId: "",
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20
}

// Tạo store với Zustand
export const useResidentStore = create<ResidentState>()(
  devtools((set) => ({
    filters: initialFilter,

    // Các hành động
    setFilter: (newFilter) =>
      set((state) => {
        return {
          filters: { ...state.filters, ...newFilter },
        };
      }),

    clearFilters: () =>
      set({
        filters: initialFilter
      })
  }))
)

// Hàm tiện ích
export const getDisplayName = (
  id: string | number | undefined,
  options: any[]
) => {
  const option = options.find((opt) => opt.id === id)
  return option ? option.name : id
}
export const getDisplayBuildingName = (
  id: string | number | undefined,
  options?: Building[]
) => {
  const option = options?.find((opt) => opt.buildingId === id)
  return option ? option.buildingName : id
}