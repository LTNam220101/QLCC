import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Định nghĩa các kiểu dữ liệu
export interface Apartment {
  id: number;
  apartmentNumber: string;
  building: string;
  area: number;
  vehicleCount: number;
  vehicleType?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ApartmentFilters {
  building: string;
  apartmentNumber: string;
  vehicleCount: string;
  vehicleType: string;
  area: string;
  note: string;
  dateRange: string;
}

export type DrawerType = "add" | "edit" | "import" | null;

interface ApartmentState {
  // Dữ liệu
  apartments: Apartment[];
  filteredApartments: Apartment[];
  selectedApartment: Apartment | null;

  // Bộ lọc
  filters: ApartmentFilters;

  // Phân trang
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;

  // Trạng thái drawer
  drawerOpen: boolean;
  drawerType: DrawerType;

  // Dialog xóa
  deleteDialogOpen: boolean;
  apartmentToDelete: number | null;

  // Hành động
  setApartments: (apartments: Apartment[]) => void;
  setFilteredApartments: (apartments: Apartment[]) => void;
  setFilter: (key: keyof ApartmentFilters, value: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setApartmentToDelete: (id: number | null) => void;
  deleteApartment: () => void;

  // Drawer actions
  openDrawer: (type: DrawerType, apartment?: Apartment | null) => void;
  closeDrawer: () => void;
  addApartment: (
    apartment: Omit<
      Apartment,
      "id" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt"
    >
  ) => void;
  updateApartment: (id: number, data: Partial<Apartment>) => void;
  importApartments: (
    apartments: Omit<
      Apartment,
      "id" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt"
    >[]
  ) => void;
}

// Dữ liệu mẫu cho căn hộ
const initialApartments = [
  {
    id: 1,
    apartmentNumber: "A-101",
    building: "A",
    area: 75.5,
    vehicleCount: 2,
    vehicleType: "car",
    note: "Căn góc, view đẹp",
    createdBy: "Admin",
    createdAt: "2023-01-10",
    updatedBy: "Admin",
    updatedAt: "2023-01-10",
  },
  {
    id: 2,
    apartmentNumber: "A-102",
    building: "A",
    area: 65.8,
    vehicleCount: 1,
    vehicleType: "motorbike",
    note: "Đã có người ở",
    createdBy: "Admin",
    createdAt: "2023-01-15",
    updatedBy: "Admin",
    updatedAt: "2023-02-20",
  },
  {
    id: 3,
    apartmentNumber: "B-201",
    building: "B",
    area: 85.2,
    vehicleCount: 2,
    vehicleType: "both",
    note: "Căn hộ 2 phòng ngủ",
    createdBy: "Admin",
    createdAt: "2023-02-05",
    updatedBy: "Admin",
    updatedAt: "2023-03-15",
  },
  {
    id: 4,
    apartmentNumber: "C-301",
    building: "C",
    area: 120.0,
    vehicleCount: 3,
    vehicleType: "both",
    note: "Căn hộ cao cấp",
    createdBy: "Admin",
    createdAt: "2023-03-10",
    updatedBy: "Admin",
    updatedAt: "2023-03-10",
  },
  {
    id: 5,
    apartmentNumber: "D-401",
    building: "D",
    area: 95.5,
    vehicleCount: 2,
    vehicleType: "car",
    note: "Căn hộ mới bàn giao",
    createdBy: "Admin",
    createdAt: "2023-04-05",
    updatedBy: "Admin",
    updatedAt: "2023-04-05",
  },
];

// Tạo store với Zustand
export const useApartmentStore = create<ApartmentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Trạng thái ban đầu
        apartments: initialApartments,
        filteredApartments: initialApartments,
        selectedApartment: null,
        filters: {
          building: "",
          apartmentNumber: "",
          vehicleCount: "",
          vehicleType: "",
          area: "",
          note: "",
          dateRange: "",
        },
        currentPage: 1,
        itemsPerPage: 20,
        totalItems: initialApartments.length,
        deleteDialogOpen: false,
        apartmentToDelete: null,
        drawerOpen: false,
        drawerType: null,

        // Các hành động
        setApartments: (apartments) => set({ apartments }),

        setFilteredApartments: (filteredApartments) =>
          set({ filteredApartments, totalItems: filteredApartments.length }),

        setFilter: (key, value) =>
          set((state) => ({
            filters: { ...state.filters, [key]: value },
          })),

        clearFilters: () =>
          set({
            filters: {
              building: "",
              apartmentNumber: "",
              vehicleCount: "",
              vehicleType: "",
              area: "",
              note: "",
              dateRange: "",
            },
          }),

        applyFilters: () => {
          const { apartments, filters } = get();
          let result = [...apartments];

          if (filters.building) {
            result = result.filter((apartment) =>
              apartment.building
                .toLowerCase()
                .includes(filters.building.toLowerCase())
            );
          }

          if (filters.apartmentNumber) {
            result = result.filter((apartment) =>
              apartment.apartmentNumber
                .toLowerCase()
                .includes(filters.apartmentNumber.toLowerCase())
            );
          }

          if (filters.vehicleCount) {
            result = result.filter(
              (apartment) =>
                apartment.vehicleCount.toString() === filters.vehicleCount
            );
          }

          if (filters.vehicleType) {
            result = result.filter(
              (apartment) => apartment.vehicleType === filters.vehicleType
            );
          }

          if (filters.area) {
            result = result.filter((apartment) =>
              apartment.area.toString().includes(filters.area)
            );
          }

          if (filters.note) {
            result = result.filter((apartment) =>
              apartment.note?.toLowerCase().includes(filters.note.toLowerCase())
            );
          }

          // Xử lý lọc theo khoảng thời gian nếu cần

          set({
            filteredApartments: result,
            totalItems: result.length,
            currentPage: 1,
          });
        },

        setCurrentPage: (page) => set({ currentPage: page }),

        setItemsPerPage: (count) => set({ itemsPerPage: count }),

        setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),

        setApartmentToDelete: (id) => set({ apartmentToDelete: id }),

        deleteApartment: () => {
          const { apartmentToDelete, apartments } = get();

          if (apartmentToDelete) {
            const updatedApartments = apartments.filter(
              (apartment) => apartment.id !== apartmentToDelete
            );
            set({ apartments: updatedApartments });

            // Áp dụng lại bộ lọc sau khi xóa
            const { applyFilters } = get();
            applyFilters();

            set({
              deleteDialogOpen: false,
              apartmentToDelete: null,
            });
          }
        },

        // Drawer actions
        openDrawer: (type, apartment = null) =>
          set({
            drawerOpen: true,
            drawerType: type,
            selectedApartment: apartment,
          }),

        closeDrawer: () =>
          set({
            drawerOpen: false,
            drawerType: null,
            selectedApartment: null,
          }),

        addApartment: (apartmentData) => {
          const { apartments } = get();
          const newId =
            apartments.length > 0
              ? Math.max(...apartments.map((a) => a.id)) + 1
              : 1;

          const now = new Date().toISOString().split("T")[0];

          const newApartment: Apartment = {
            id: newId,
            ...apartmentData,
            createdBy: "Admin",
            createdAt: now,
            updatedBy: "Admin",
            updatedAt: now,
          };

          set({
            apartments: [...apartments, newApartment],
            drawerOpen: false,
            drawerType: null,
          });

          // Áp dụng lại bộ lọc sau khi thêm
          const { applyFilters } = get();
          applyFilters();
        },

        updateApartment: (id, data) => {
          const { apartments } = get();
          const now = new Date().toISOString().split("T")[0];

          const updatedApartments = apartments.map((apartment) =>
            apartment.id === id
              ? {
                  ...apartment,
                  ...data,
                  updatedBy: "Admin",
                  updatedAt: now,
                }
              : apartment
          );

          set({
            apartments: updatedApartments,
            drawerOpen: false,
            drawerType: null,
            selectedApartment: null,
          });

          // Áp dụng lại bộ lọc sau khi cập nhật
          const { applyFilters } = get();
          applyFilters();
        },

        importApartments: (apartmentsData) => {
          const { apartments } = get();
          const now = new Date().toISOString().split("T")[0];

          let lastId =
            apartments.length > 0
              ? Math.max(...apartments.map((a) => a.id))
              : 0;

          const newApartments = apartmentsData.map((data) => {
            lastId++;
            return {
              id: lastId,
              ...data,
              createdBy: "Admin",
              createdAt: now,
              updatedBy: "Admin",
              updatedAt: now,
            };
          });

          set({
            apartments: [...apartments, ...newApartments],
            drawerOpen: false,
            drawerType: null,
          });

          // Áp dụng lại bộ lọc sau khi nhập
          const { applyFilters } = get();
          applyFilters();
        },
      }),
      {
        name: "apartment-storage",
        // Chỉ lưu trữ dữ liệu căn hộ, không lưu trạng thái UI
        partialize: (state) => ({ apartments: state.apartments }),
      }
    )
  )
);
export const vehicleTypes = [
  { id: "car", name: "Ô tô" },
  { id: "motorbike", name: "Xe máy" },
  { id: "both", name: "Cả hai" },
  { id: "none", name: "Không có" },
];
