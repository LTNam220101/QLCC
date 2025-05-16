import { create } from "zustand"
import { devtools } from "zustand/middleware"
import {
  UserApartment,
  UserApartmentFilter
} from "../../../types/user-apartments"

export type DrawerType = "add" | "edit" | null

interface UserApartmentState {
  // Bộ lọc
  filters: UserApartmentFilter

  selectedUserApartment?: UserApartment
  drawerOpen: boolean
  drawerType: DrawerType

  // Hành động
  setFilter: (filter: Partial<UserApartmentFilter>) => void
  clearFilters: () => void

  openDrawer: (type: DrawerType, apartment?: UserApartment) => void
  closeDrawer: () => void
}

const initialFilter: UserApartmentFilter = {
  userPhone: "",
  fullName: "",
  manageBuildingList: undefined,
  manageApartmentList: undefined,
  statusList: undefined,
  userApartmentRoleName: undefined,
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20
}

// Tạo store với Zustand
export const useUserApartmentStore = create<UserApartmentState>()(
  devtools((set) => ({
    //filter
    filters: initialFilter,
    //drawer
    selectedUserApartment: null,
    drawerOpen: false,
    drawerType: null,

    // Các hành động filter
    setFilter: (newFilter) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilter }
      })),
    clearFilters: () =>
      set({
        filters: initialFilter
      }),

    // Hành động drawerÏ
    openDrawer: (type, apartment) =>
      set({
        drawerOpen: true,
        drawerType: type,
        selectedUserApartment: apartment
      }),
    closeDrawer: () =>
      set({
        drawerOpen: false,
        drawerType: null,
        selectedUserApartment: undefined
      })
  }))
)
