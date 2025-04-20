import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import type { ResidentFilters, PaginationState } from "@/lib/store/use-resident-filter-store"

// Định nghĩa kiểu dữ liệu cho Resident
export type ResidentStatus = "active" | "pending" | "inactive" | "draft" | "new"

export interface Resident {
  id: number
  name: string
  phone: string
  building: string
  apartment: string
  role: string
  moveInDate: string
  status: ResidentStatus
  email: string
  idNumber: string
  idIssueDate: string
  idIssuePlace: string
  gender: string
  birthDate: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Định nghĩa kiểu dữ liệu cho kết quả phân trang
export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    pageCount: number
  }
}

// Giả lập API service
const ResidentService = {
  // Lấy danh sách cư dân với phân trang và lọc
  async getResidents(filters: ResidentFilters, pagination: PaginationState): Promise<PaginatedResult<Resident>> {
    console.log("Fetching residents with filters:", filters)
    console.log("Pagination:", pagination)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Lọc dữ liệu
    let filteredData = [...mockResidents]

    if (filters.name) {
      filteredData = filteredData.filter((resident) => resident.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    if (filters.phone) {
      filteredData = filteredData.filter((resident) => resident.phone.includes(filters.phone))
    }

    if (filters.role && filters.role !== "all") {
      filteredData = filteredData.filter((resident) => resident.role === filters.role)
    }

    if (filters.status && filters.status !== "all") {
      filteredData = filteredData.filter((resident) => resident.status === filters.status)
    }

    if (filters.building && filters.building !== "all") {
      filteredData = filteredData.filter((resident) => resident.building === filters.building)
    }

    if (filters.apartment && filters.apartment !== "all") {
      filteredData = filteredData.filter((resident) => resident.apartment === filters.apartment)
    }

    // Tính toán phân trang
    const total = filteredData.length
    const { currentPage, itemsPerPage } = pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, total)
    const paginatedData = filteredData.slice(startIndex, endIndex)

    // Trả về kết quả
    return {
      data: paginatedData,
      meta: {
        total,
        page: currentPage,
        pageSize: itemsPerPage,
        pageCount: Math.ceil(total / itemsPerPage),
      },
    }
  },

  // Lấy chi tiết cư dân
  async getResident(id: number): Promise<Resident> {
    console.log("Fetching resident with id:", id)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const resident = mockResidents.find((r) => r.id === id)
    if (!resident) {
      throw new Error("Resident not found")
    }

    return resident
  },

  // Thêm cư dân mới
  async addResident(data: Partial<Resident>): Promise<Resident> {
    console.log("Adding new resident:", data)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Giả lập tạo ID mới
    const newId = Math.max(...mockResidents.map((r) => r.id)) + 1

    const newResident = {
      id: newId,
      ...data,
      status: data.status || ("active" as ResidentStatus),
      createdBy: "Admin",
      createdAt: new Date().toISOString().split("T")[0],
      updatedBy: "Admin",
      updatedAt: new Date().toISOString().split("T")[0],
    } as Resident

    // Thêm vào danh sách mẫu
    mockResidents.push(newResident)

    return newResident
  },

  // Cập nhật cư dân
  async updateResident(id: number, data: Partial<Resident>): Promise<Resident> {
    console.log("Updating resident:", id, data)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockResidents.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Resident not found")
    }

    // Cập nhật thông tin
    const updatedResident = {
      ...mockResidents[index],
      ...data,
      updatedBy: "Admin",
      updatedAt: new Date().toISOString().split("T")[0],
    }

    mockResidents[index] = updatedResident

    return updatedResident
  },

  // Xóa cư dân
  async deleteResident(id: number): Promise<Resident> {
    console.log("Deleting resident:", id)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockResidents.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Resident not found")
    }

    // Xóa khỏi danh sách
    const deletedResident = mockResidents.splice(index, 1)[0]

    return deletedResident
  },
}

// Dữ liệu mẫu
const mockResidents: Resident[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    building: "A",
    apartment: "A-101",
    role: "owner",
    moveInDate: "2023-01-15",
    status: "active",
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
    status: "pending",
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
    status: "inactive",
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
    status: "new",
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
    status: "draft",
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
]

// Query keys
export const residentKeys = {
  all: ["residents"] as const,
  lists: () => [...residentKeys.all, "list"] as const,
  list: (filters: ResidentFilters, pagination: PaginationState) =>
    [...residentKeys.lists(), { filters, pagination }] as const,
  details: () => [...residentKeys.all, "detail"] as const,
  detail: (id: number) => [...residentKeys.details(), id] as const,
}

// Custom hooks

// Hook lấy danh sách cư dân với phân trang và lọc
export function useResidents(filters: ResidentFilters, pagination: PaginationState) {
  return useQuery({
    queryKey: residentKeys.list(filters, pagination),
    queryFn: () => ResidentService.getResidents(filters, pagination),
    keepPreviousData: true, // Giữ dữ liệu cũ khi loading dữ liệu mới
  })
}

// Hook lấy chi tiết cư dân
export function useResident(id: number) {
  return useQuery({
    queryKey: residentKeys.detail(id),
    queryFn: () => ResidentService.getResident(id),
    enabled: !!id, // Chỉ gọi API khi có ID
  })
}

// Hook thêm cư dân mới
export function useAddResident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Resident>) => ResidentService.addResident(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách cư dân
      queryClient.invalidateQueries({ queryKey: residentKeys.lists() })

      toast("Cư dân đã được thêm vào hệ thống")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi thêm cư dân")
    },
  })
}

// Hook cập nhật cư dân
export function useUpdateResident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Resident> }) => ResidentService.updateResident(id, data),
    onSuccess: (data) => {
      // Cập nhật cache cho chi tiết cư dân
      queryClient.setQueryData(residentKeys.detail(data.id), data)

      // Invalidate và refetch danh sách cư dân
      queryClient.invalidateQueries({ queryKey: residentKeys.lists() })

      toast("Thông tin cư dân đã được cập nhật")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi cập nhật cư dân")
    },
  })
}

// Hook xóa cư dân
export function useDeleteResident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ResidentService.deleteResident(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách cư dân
      queryClient.invalidateQueries({ queryKey: residentKeys.lists() })

      toast("Đã xóa cư dân khỏi hệ thống")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi xóa cư dân")
    },
  })
}
