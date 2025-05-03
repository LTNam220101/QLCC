import { create } from "zustand"
import { NotificationFilter } from "../../../types/notifications"

interface NotificationFilterState {
  filter: NotificationFilter
  setFilter: (filter: Partial<NotificationFilter>) => void
  resetFilter: () => void
}

const initialFilter: NotificationFilter = {
  title: undefined,
  content: undefined,
  manageBuildingList: undefined,
  manageApartmentList: undefined,
  sentTimeFrom: undefined,
  sentTimeTo: undefined,
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20
}

export const useNotificationFilterStore = create<NotificationFilterState>()(
  (set) => ({
    filter: initialFilter,
    setFilter: (newFilter) =>
      set((state) => ({
        filter: { ...state.filter, ...newFilter }
      })),
    resetFilter: () => set({ filter: initialFilter })
  })
)
