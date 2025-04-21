import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Apartment, ApartmentFilter } from "../../../types/apartments";

export type DrawerType = "add" | "edit" | "import" | null;

interface ApartmentState {
  // Bộ lọc
  filters: ApartmentFilter;

  selectedApartment?: Apartment;
  drawerOpen: boolean;
  drawerType: DrawerType;

  // Hành động
  setFilter: (filter: Partial<ApartmentFilter>) => void;
  clearFilters: () => void;

  openDrawer: (type: DrawerType, apartment?: Apartment) => void;
  closeDrawer: () => void;
}

const initialFilter: ApartmentFilter = {
  buildingName: undefined,
  buildingId: undefined,
  apartmentName: undefined,
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20,
};

// Tạo store với Zustand
export const useApartmentStore = create<ApartmentState>()(
  devtools((set) => ({
    //filter
    filters: initialFilter,
    //drawer
    selectedApartment: null,
    drawerOpen: false,
    drawerType: null,

    // Các hành động filter
    setFilter: (newFilter) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilter },
      })),
    clearFilters: () =>
      set({
        filters: initialFilter,
      }),

    // Hành động drawerÏ
    openDrawer: (type, apartment) =>
      set({
        drawerOpen: true,
        drawerType: type,
        selectedApartment: apartment,
      }),
    closeDrawer: () =>
      set({
        drawerOpen: false,
        drawerType: null,
        selectedApartment: undefined,
      }),
  }))
);
