import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  ApartmentDetailResponse,
  ApartmentFilter,
  ApartmentFormData,
  ApartmentPaginatedResponse
} from "../../../../types/apartments"
import { apiRequest, apiRequestFile } from "../../../../utils/api"

// Giả lập API service
const ApartmentService = {
  // Lấy danh sách căn hộ với phân trang và lọc
  async getApartments(
    filters: ApartmentFilter
  ): Promise<ApartmentPaginatedResponse> {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filters.page,
        size: filters.size,
        ...(filters.manageBuildingList && {
          manageBuildingList: filters.manageBuildingList
        }),
        ...(filters.apartmentName && { apartmentName: filters.apartmentName }),
        ...(filters.createTimeFrom && {
          createTimeFrom: filters.createTimeFrom
        }),
        ...(filters.createTimeTo && {
          createTimeTo: filters.createTimeTo
        })
      }

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ApartmentPaginatedResponse>({
        url: "/apartment",
        method: "GET",
        queryParams,
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch apartments")
      }

      return response
    } catch (error) {
      console.error("Error fetching apartments:", error)
      throw error
    }
  },

  // Lấy chi tiết căn hộ
  async getApartment(id: string): Promise<ApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ApartmentDetailResponse>({
        url: `/apartment/${id}`,
        method: "GET",
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch apartments")
      }
      return response
    } catch (error) {
      console.error("Error fetching apartments:", error)
      throw error
    }
  },

  // Thêm căn hộ mới
  async addApartment(
    data: ApartmentFormData
  ): Promise<ApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ApartmentDetailResponse>({
        url: "/apartment",
        method: "POST",
        useCredentials: true,
        body: data
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch apartments")
      }
      return response
    } catch (error) {
      console.error("Error fetching apartments:", error)
      throw error
    }
  },

  // Cập nhật căn hộ
  async updateApartment(
    id: string,
    data: ApartmentFormData
  ): Promise<ApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ApartmentDetailResponse>({
        url: `/apartment/${id}`,
        method: "PUT",
        useCredentials: true,
        body: data
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch apartments")
      }
      return response
    } catch (error) {
      console.error("Error fetching apartments:", error)
      throw error
    }
  },

  // Xóa căn hộ
  async deleteApartment(id: string): Promise<boolean> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/apartment/${id}`,
        method: "DELETE",
        useCredentials: true
      })
      return response
    } catch (error) {
      console.error("Error fetching apartments:", error)
      throw error
    }
  },

  async importApartment(data: File): Promise<any> {
    try {
      let formData = new FormData()
      formData.append("file", data)
      // Gọi API sử dụng sendRequest
      const response = await apiRequestFile<any>({
        url: "/apartment/import-apartment",
        method: "POST",
        useCredentials: true,
        body: formData
      })
      // Tạo URL cho response
      const url = window.URL.createObjectURL(response)
  
      // Tạo thẻ a để download
      const a = document.createElement("a")
      a.href = url
      a.download = "mau-can-ho"
      document.body.appendChild(a)
      a.click()
  
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch apartments")
      }
      return response
    } catch (error) {
      console.error("Error fetching apartments:", error)
      throw error
    }
  }
}

// Query keys
export const apartmentKeys = {
  all: ["apartments"] as const,
  lists: () => [...apartmentKeys.all, "list"] as const,
  list: (filters: ApartmentFilter) =>
    [...apartmentKeys.lists(), { filters }] as const,
  details: () => [...apartmentKeys.all, "detail"] as const,
  detail: (id: string) => [...apartmentKeys.details(), id] as const
}

// Custom hooks

// Hook lấy danh sách căn hộ với phân trang và lọc
export function useApartments(filters: ApartmentFilter, enabled = true) {
  return useQuery({
    queryKey: apartmentKeys.list(filters),
    queryFn: () => ApartmentService.getApartments(filters),
    enabled: enabled
  })
}

// Hook lấy chi tiết căn hộ
export function useApartment(id: string) {
  return useQuery({
    queryKey: apartmentKeys.detail(id),
    queryFn: () => ApartmentService.getApartment(id),
    enabled: !!id // Chỉ gọi API khi có ID
  })
}

// Hook thêm căn hộ mới
export function useAddApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ApartmentFormData) =>
      ApartmentService.addApartment(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách căn hộ
      queryClient.invalidateQueries({ queryKey: apartmentKeys.lists() })
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi thêm căn hộ")
    }
  })
}

// Hook cập nhật căn hộ
export function useUpdateApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApartmentFormData }) =>
      ApartmentService.updateApartment(id, data),
    onSuccess: (data) => {
      // Cập nhật cache cho chi tiết căn hộ
      queryClient.setQueryData(apartmentKeys.detail(data.data.id), data)

      // Invalidate và refetch danh sách căn hộ
      queryClient.invalidateQueries({ queryKey: apartmentKeys.lists() })
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi cập nhật căn hộ")
    }
  })
}

// Hook xóa căn hộ
export function useDeleteApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ApartmentService.deleteApartment(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách căn hộ
      queryClient.invalidateQueries({ queryKey: apartmentKeys.lists() })

      toast("Đã xóa căn hộ khỏi hệ thống")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi xóa căn hộ")
    }
  })
}

// Hook thêm căn hộ mới bằng excel
export function useImportApartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: File) => ApartmentService.importApartment(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách căn hộ
      queryClient.invalidateQueries({ queryKey: apartmentKeys.lists() })
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi thêm căn hộ")
    }
  })
}
