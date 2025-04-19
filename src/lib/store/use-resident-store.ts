import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Định nghĩa các kiểu dữ liệu
export type ResidentStatus =
  | "active"
  | "pending"
  | "inactive"
  | "draft"
  | "new";

export interface Resident {
  id: number;
  name: string;
  phone: string;
  building: string;
  apartment: string;
  role: string;
  moveInDate: string;
  status: ResidentStatus;
  email: string;
  idNumber: string;
  idIssueDate: string;
  idIssuePlace: string;
  gender: string;
  birthDate: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ResidentFilters {
  name: string;
  phone: string;
  role: string;
  status: string;
  building: string;
  apartment: string;
}

interface ResidentState {
  // Dữ liệu
  residents: Resident[];
  filteredResidents: Resident[];

  // Bộ lọc
  filters: ResidentFilters;

  // Phân trang
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;

  // Dialog xóa
  deleteDialogOpen: boolean;
  residentToDelete: number | null;

  // Hành động
  setResidents: (residents: Resident[]) => void;
  setFilteredResidents: (residents: Resident[]) => void;
  setFilter: (key: keyof ResidentFilters, value: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setResidentToDelete: (id: number | null) => void;
  deleteResident: () => void;
}

// Dữ liệu mẫu cho cư dân
const initialResidents = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    building: "A",
    apartment: "A-101",
    role: "owner",
    moveInDate: "2023-01-15",
    status: "active" as ResidentStatus,
    email: "nguyenvana@example.com",
    idNumber: "012345678901",
    idIssueDate: "2020-01-01",
    idIssuePlace: "Hà Nội",
    gender: "Nam",
    birthDate: "1985-05-15",
    createdBy: "Admin",
    createdAt: "2023-01-10",
    updatedBy: "Admin",
    updatedAt: "2023-01-10",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    building: "A",
    apartment: "A-102",
    role: "tenant",
    moveInDate: "2023-02-20",
    status: "pending" as ResidentStatus,
    email: "tranthib@example.com",
    idNumber: "012345678902",
    idIssueDate: "2019-05-10",
    idIssuePlace: "Hồ Chí Minh",
    gender: "Nữ",
    birthDate: "1990-10-20",
    createdBy: "Admin",
    createdAt: "2023-02-15",
    updatedBy: "Admin",
    updatedAt: "2023-02-15",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    building: "B",
    apartment: "B-101",
    role: "family",
    moveInDate: "2023-03-10",
    status: "inactive" as ResidentStatus,
    email: "levanc@example.com",
    idNumber: "012345678903",
    idIssueDate: "2018-12-05",
    idIssuePlace: "Đà Nẵng",
    gender: "Nam",
    birthDate: "1978-03-25",
    createdBy: "Admin",
    createdAt: "2023-03-05",
    updatedBy: "Admin",
    updatedAt: "2023-03-05",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    building: "C",
    apartment: "C-101",
    role: "guest",
    moveInDate: "2023-04-05",
    status: "new" as ResidentStatus,
    email: "phamthid@example.com",
    idNumber: "012345678904",
    idIssueDate: "2021-02-15",
    idIssuePlace: "Hải Phòng",
    gender: "Nữ",
    birthDate: "1995-12-10",
    createdBy: "Admin",
    createdAt: "2023-04-01",
    updatedBy: "Admin",
    updatedAt: "2023-04-01",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    building: "D",
    apartment: "D-101",
    role: "owner",
    moveInDate: "2023-05-15",
    status: "draft" as ResidentStatus,
    email: "hoangvane@example.com",
    idNumber: "012345678905",
    idIssueDate: "2017-08-20",
    idIssuePlace: "Cần Thơ",
    gender: "Nam",
    birthDate: "1982-07-30",
    createdBy: "Admin",
    createdAt: "2023-05-10",
    updatedBy: "Admin",
    updatedAt: "2023-05-10",
  },
];

// Tạo store với Zustand
export const useResidentStore = create<ResidentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Trạng thái ban đầu
        residents: initialResidents,
        filteredResidents: initialResidents,
        filters: {
          name: "",
          phone: "",
          role: "",
          status: "",
          building: "",
          apartment: "",
        },
        currentPage: 1,
        itemsPerPage: 20,
        totalItems: initialResidents.length,
        deleteDialogOpen: false,
        residentToDelete: null,

        // Các hành động
        setResidents: (residents) => set({ residents }),

        setFilteredResidents: (filteredResidents) =>
          set({ filteredResidents, totalItems: filteredResidents.length }),

        setFilter: (key, value) =>
          set((state) => ({
            filters: { ...state.filters, [key]: value },
            // Reset apartment khi thay đổi building
            ...(key === "building" && {
              filters: { ...state.filters, [key]: value, apartment: "" },
            }),
          })),

        clearFilters: () =>
          set({
            filters: {
              name: "",
              phone: "",
              role: "",
              status: "",
              building: "",
              apartment: "",
            },
          }),

        applyFilters: () => {
          const { residents, filters } = get();
          let result = [...residents];

          if (filters.name) {
            result = result.filter((resident) =>
              resident.name.toLowerCase().includes(filters.name.toLowerCase())
            );
          }

          if (filters.phone) {
            result = result.filter((resident) =>
              resident.phone.includes(filters.phone)
            );
          }

          if (filters.role && filters.role !== "all") {
            result = result.filter(
              (resident) => resident.role === filters.role
            );
          }

          if (filters.status && filters.status !== "all") {
            result = result.filter(
              (resident) => resident.status === filters.status
            );
          }

          if (filters.building && filters.building !== "all") {
            result = result.filter(
              (resident) => resident.building === filters.building
            );
          }

          if (filters.apartment && filters.apartment !== "all") {
            result = result.filter(
              (resident) => resident.apartment === filters.apartment
            );
          }

          set({
            filteredResidents: result,
            totalItems: result.length,
            currentPage: 1,
          });
        },

        setCurrentPage: (page) => set({ currentPage: page }),

        setItemsPerPage: (count) => set({ itemsPerPage: count }),

        setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),

        setResidentToDelete: (id) => set({ residentToDelete: id }),

        deleteResident: () => {
          const { residentToDelete, residents, filters } = get();

          if (residentToDelete) {
            const updatedResidents = residents.filter(
              (resident) => resident.id !== residentToDelete
            );

            set({ residents: updatedResidents });

            // Áp dụng lại bộ lọc sau khi xóa
            let result = [...updatedResidents];

            if (filters.name) {
              result = result.filter((resident) =>
                resident.name.toLowerCase().includes(filters.name.toLowerCase())
              );
            }

            if (filters.phone) {
              result = result.filter((resident) =>
                resident.phone.includes(filters.phone)
              );
            }

            if (filters.role && filters.role !== "all") {
              result = result.filter(
                (resident) => resident.role === filters.role
              );
            }

            if (filters.status && filters.status !== "all") {
              result = result.filter(
                (resident) => resident.status === filters.status
              );
            }

            if (filters.building && filters.building !== "all") {
              result = result.filter(
                (resident) => resident.building === filters.building
              );
            }

            if (filters.apartment && filters.apartment !== "all") {
              result = result.filter(
                (resident) => resident.apartment === filters.apartment
              );
            }

            set({
              filteredResidents: result,
              totalItems: result.length,
              deleteDialogOpen: false,
              residentToDelete: null,
            });
          }
        },
      }),
      {
        name: "resident-storage",
        // Chỉ lưu trữ dữ liệu cư dân, không lưu trạng thái UI
        partialize: (state) => ({ residents: state.residents }),
      }
    )
  )
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
export const getDisplayName = (id: string, options: any[]) => {
  const option = options.find((opt) => opt.id === id);
  return option ? option.name : id;
};

export const getStatusColor = (status: string) => {
  const statusObj = statuses.find((s) => s.id === status);
  return statusObj ? statusObj.color : "gray";
};
