import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ResidentDetailResponse,
  ResidentFilter,
  ResidentFormData,
  ResidentPaginatedResponse,
} from "../../../../types/residents";
import { apiRequest } from "../../../../utils/api";

// Giả lập API service
const ResidentService = {
  // Lấy danh sách cư dân với phân trang và lọc
  async getResidents(
    filters: ResidentFilter
  ): Promise<ResidentPaginatedResponse> {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filters.page,
        size: filters.size,
        ...(filters.status && { status: filters.status }),
        ...(filters.fullName && { fullName: filters.fullName }),
        ...(filters.phoneNumber && { phoneNumber: filters.phoneNumber }),
        ...(filters.role && { role: filters.role }),
        ...(filters.manageBuildingList && {
          manageBuildingList: filters.manageBuildingList,
        }),
        ...(filters.manageApartmentList && {
          manageApartmentList: filters.manageApartmentList,
        }),
      };

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ResidentPaginatedResponse>({
        url: "/resident",
        method: "GET",
        queryParams,
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch hotlines");
      }

      return response;
    } catch (error) {
      console.error("Error fetching hotlines:", error);
      throw error;
    }
  },

  // Lấy chi tiết cư dân
  async getResident(id: string): Promise<ResidentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ResidentDetailResponse>({
        url: `/resident/${id}`,
        method: "GET",
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch hotlines");
      }
      return response;
    } catch (error) {
      console.error("Error fetching hotlines:", error);
      throw error;
    }
  },

  // Thêm cư dân mới
  async addResident(data: ResidentFormData): Promise<ResidentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ResidentDetailResponse>({
        url: "/resident",
        method: "POST",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch hotlines");
      }
      return response;
    } catch (error) {
      console.error("Error fetching hotlines:", error);
      throw error;
    }
  },

  // Cập nhật cư dân
  async updateResident(
    id: string,
    data: ResidentFormData
  ): Promise<ResidentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ResidentDetailResponse>({
        url: `/resident/${id}`,
        method: "PUT",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch hotlines");
      }
      return response;
    } catch (error) {
      console.error("Error fetching hotlines:", error);
      throw error;
    }
  },

  // Xóa cư dân
  async deleteResident(id: string): Promise<boolean> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/resident/${id}`,
        method: "DELETE",
        useCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching hotlines:", error);
      throw error;
    }
  },
};

// Query keys
export const residentKeys = {
  all: ["residents"] as const,
  lists: () => [...residentKeys.all, "list"] as const,
  list: (filters: ResidentFilter) =>
    [...residentKeys.lists(), { filters }] as const,
  details: () => [...residentKeys.all, "detail"] as const,
  detail: (id: string) => [...residentKeys.details(), id] as const,
};

// Custom hooks

// Hook lấy danh sách cư dân với phân trang và lọc
export function useResidents(filters: ResidentFilter) {
  return useQuery({
    queryKey: residentKeys.list(filters),
    queryFn: () => ResidentService.getResidents(filters),
  });
}

// Hook lấy chi tiết cư dân
export function useResident(id: string) {
  return useQuery({
    queryKey: residentKeys.detail(id),
    queryFn: () => ResidentService.getResident(id),
    enabled: !!id, // Chỉ gọi API khi có ID
  });
}

// Hook thêm cư dân mới
export function useAddResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResidentFormData) => ResidentService.addResident(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách cư dân
      queryClient.invalidateQueries({ queryKey: residentKeys.lists() });

      toast("Cư dân đã được thêm vào hệ thống");
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi thêm cư dân");
    },
  });
}

// Hook cập nhật cư dân
export function useUpdateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResidentFormData }) =>
      ResidentService.updateResident(id, data),
    onSuccess: (data) => {
      // Cập nhật cache cho chi tiết cư dân
      queryClient.setQueryData(residentKeys.detail(data.data.id), data);

      // Invalidate và refetch danh sách cư dân
      queryClient.invalidateQueries({ queryKey: residentKeys.lists() });

      toast("Thông tin cư dân đã được cập nhật");
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi cập nhật cư dân");
    },
  });
}

// Hook xóa cư dân
export function useDeleteResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ResidentService.deleteResident(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách cư dân
      queryClient.invalidateQueries({ queryKey: residentKeys.lists() });

      toast("Đã xóa cư dân khỏi hệ thống");
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi xóa cư dân");
    },
  });
}
