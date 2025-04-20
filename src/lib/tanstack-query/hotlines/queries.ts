import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Hotline, HotlineFilter, HotlineFormData, HotlinePaginatedResponse } from "@/types/hotline"

// Mock API service - Thay thế bằng API thực tế sau này
const HotlineService = {
  getHotlines: async (filter: HotlineFilter): Promise<HotlinePaginatedResponse> => {
    // Giả lập API call
    console.log("Fetching hotlines with filter:", filter)

    // Dữ liệu mẫu
    const mockData: Hotline[] = Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      name: `Hotline ${i + 1}`,
      phoneNumber: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      buildingId: Math.floor(Math.random() * 5) + 1,
      buildingName: `Tòa nhà ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      note: i % 3 === 0 ? `Ghi chú cho hotline ${i + 1}` : undefined,
      status: i % 4 === 0 ? "inactive" : "active",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      createdBy: "Admin",
      updatedAt: i % 2 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() : undefined,
      updatedBy: i % 2 === 0 ? "Admin" : undefined,
    }))

    // Lọc dữ liệu theo filter
    let filteredData = [...mockData]

    if (filter.status) {
      filteredData = filteredData.filter((item) => item.status === filter.status)
    }

    if (filter.name) {
      filteredData = filteredData.filter((item) => item.name.toLowerCase().includes(filter.name!.toLowerCase()))
    }

    if (filter.phoneNumber) {
      filteredData = filteredData.filter((item) => item.phoneNumber.includes(filter.phoneNumber!))
    }

    if (filter.buildingId) {
      filteredData = filteredData.filter((item) => item.buildingId === filter.buildingId)
    }

    if (filter.fromDate && filter.toDate) {
      const fromDate = new Date(filter.fromDate)
      const toDate = new Date(filter.toDate)
      filteredData = filteredData.filter((item) => {
        const createdAt = new Date(item.createdAt)
        return createdAt >= fromDate && createdAt <= toDate
      })
    }

    // Phân trang
    const startIndex = (filter.page - 1) * filter.limit
    const paginatedData = filteredData.slice(startIndex, startIndex + filter.limit)

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      data: paginatedData,
      total: filteredData.length,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(filteredData.length / filter.limit),
    }
  },

  getHotlineById: async (id: number): Promise<Hotline> => {
    // Giả lập API call
    console.log("Fetching hotline with id:", id)

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Dữ liệu mẫu
    return {
      id,
      name: `Hotline ${id}`,
      phoneNumber: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      buildingId: Math.floor(Math.random() * 5) + 1,
      buildingName: `Tòa nhà ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      note: id % 3 === 0 ? `Ghi chú cho hotline ${id}` : undefined,
      status: id % 4 === 0 ? "inactive" : "active",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      createdBy: "Admin",
      updatedAt: id % 2 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() : undefined,
      updatedBy: id % 2 === 0 ? "Admin" : undefined,
    }
  },

  createHotline: async (data: HotlineFormData): Promise<Hotline> => {
    // Giả lập API call
    console.log("Creating hotline with data:", data)

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Dữ liệu mẫu
    return {
      id: Math.floor(Math.random() * 1000) + 100,
      name: data.name,
      phoneNumber: data.phoneNumber,
      buildingId: data.buildingId,
      buildingName: `Tòa nhà ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      note: data.note,
      status: data.status || "active",
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    }
  },

  updateHotline: async (id: number, data: HotlineFormData): Promise<Hotline> => {
    // Giả lập API call
    console.log("Updating hotline with id:", id, "and data:", data)

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Dữ liệu mẫu
    return {
      id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      buildingId: data.buildingId,
      buildingName: `Tòa nhà ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      note: data.note,
      status: data.status || "active",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      createdBy: "Admin",
      updatedAt: new Date().toISOString(),
      updatedBy: "Admin",
    }
  },

  deleteHotline: async (id: number): Promise<void> => {
    // Giả lập API call
    console.log("Deleting hotline with id:", id)

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },

  updateHotlineStatus: async (id: number, status: "active" | "inactive"): Promise<Hotline> => {
    // Giả lập API call
    console.log("Updating hotline status with id:", id, "and status:", status)

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Dữ liệu mẫu
    return {
      id,
      name: `Hotline ${id}`,
      phoneNumber: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      buildingId: Math.floor(Math.random() * 5) + 1,
      buildingName: `Tòa nhà ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      note: id % 3 === 0 ? `Ghi chú cho hotline ${id}` : undefined,
      status,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      createdBy: "Admin",
      updatedAt: new Date().toISOString(),
      updatedBy: "Admin",
    }
  },
}

// Query keys
export const hotlineKeys = {
  all: ["hotlines"] as const,
  lists: () => [...hotlineKeys.all, "list"] as const,
  list: (filters: HotlineFilter) => [...hotlineKeys.lists(), filters] as const,
  details: () => [...hotlineKeys.all, "detail"] as const,
  detail: (id: number) => [...hotlineKeys.details(), id] as const,
}

// Hooks
export const useHotlines = (filter: HotlineFilter) => {
  return useQuery({
    queryKey: hotlineKeys.list(filter),
    queryFn: () => HotlineService.getHotlines(filter),
    keepPreviousData: true,
  })
}

export const useHotline = (id: number) => {
  return useQuery({
    queryKey: hotlineKeys.detail(id),
    queryFn: () => HotlineService.getHotlineById(id),
    enabled: !!id,
  })
}

export const useCreateHotline = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: HotlineFormData) => HotlineService.createHotline(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() })
    },
  })
}

export const useUpdateHotline = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: HotlineFormData) => HotlineService.updateHotline(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() })
    },
  })
}

export const useDeleteHotline = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => HotlineService.deleteHotline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() })
    },
  })
}

export const useUpdateHotlineStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "active" | "inactive" }) =>
      HotlineService.updateHotlineStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() })
    },
  })
}
