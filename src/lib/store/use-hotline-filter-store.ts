import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { HotlineFilter } from "@/types/hotline"

interface HotlineFilterState {
  filter: HotlineFilter
  setFilter: (filter: Partial<HotlineFilter>) => void
  resetFilter: () => void
}

const initialFilter: HotlineFilter = {
  status: undefined,
  name: undefined,
  phoneNumber: undefined,
  buildingId: undefined,
  fromDate: undefined,
  toDate: undefined,
  page: 1,
  limit: 20,
}

export const useHotlineFilterStore = create<HotlineFilterState>()(
  persist(
    (set) => ({
      filter: initialFilter,
      setFilter: (newFilter) =>
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        })),
      resetFilter: () => set({ filter: initialFilter }),
    }),
    {
      name: "hotline-filter-storage",
    },
  ),
)
