import { create } from "zustand"
import { NewsFilter } from "../../../types/news"

interface NewsFilterState {
  filter: NewsFilter
  setFilter: (filter: Partial<NewsFilter>) => void
  resetFilter: () => void
}

const initialFilter: NewsFilter = {
  title: undefined,
  manageBuildingList: undefined,
  sentTimeFrom: undefined,
  sentTimeTo: undefined,
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20
}

export const useNewsFilterStore = create<NewsFilterState>()(
  (set) => ({
    filter: initialFilter,
    setFilter: (newFilter) =>
      set((state) => ({
        filter: { ...state.filter, ...newFilter }
      })),
    resetFilter: () => set({ filter: initialFilter })
  })
)
