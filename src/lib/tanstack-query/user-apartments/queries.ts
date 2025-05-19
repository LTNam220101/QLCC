import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UserApartmentDetailResponse,
  UserApartmentFilter,
  UserApartmentFormData,
  UserApartmentPaginatedResponse,
} from "../../../../types/user-apartments";
import { apiRequest, apiRequestFile } from "../../../../utils/api";

// Giả lập API service
const UserApartmentService = {
  // Lấy danh sách căn hộ với phân trang và lọc
  async getUserApartments(
    filters: UserApartmentFilter
  ): Promise<UserApartmentPaginatedResponse> {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filters.page,
        size: filters.size,
        ...(filters.userPhone && {
          userPhone: filters.userPhone,
        }),
        ...(filters.fullName && { fullName: filters.fullName }),
        ...(filters.manageBuildingList && {
          manageBuildingList: filters.manageBuildingList,
        }),
        ...(filters.manageApartmentList && {
          manageApartmentList: filters.manageApartmentList,
        }),
        ...(filters.statusList && {
          statusList: filters.statusList,
        }),
        ...(filters.userApartmentRoleName && {
          userApartmentRoleName: filters.userApartmentRoleName,
        }),
        ...(filters.createTimeFrom && {
          createTimeFrom: filters.createTimeFrom,
        }),
        ...(filters.createTimeTo && {
          createTimeTo: filters.createTimeTo,
        }),
      };

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<UserApartmentPaginatedResponse>({
        url: "/user-apartment-mapping",
        method: "GET",
        queryParams,
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch userApartments");
      }

      return response;
    } catch (error) {
      console.error("Error fetching userApartments:", error);
      throw error;
    }
  },

  // Lấy chi tiết căn hộ
  async getUserApartment(id: string): Promise<UserApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<UserApartmentDetailResponse>({
        url: `/user-apartment-mapping/${id}`,
        method: "GET",
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch userApartments");
      }
      return response;
    } catch (error) {
      console.error("Error fetching userApartments:", error);
      throw error;
    }
  },

  // Thêm căn hộ mới
  async addUserApartment(
    data: UserApartmentFormData
  ): Promise<UserApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<UserApartmentDetailResponse>({
        url: "/user-apartment-mapping",
        method: "POST",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch userApartments");
      }
      return response;
    } catch (error) {
      console.error("Error fetching userApartments:", error);
      throw error;
    }
  },

  // Cập nhật căn hộ
  async updateUserApartment(
    id: string,
    data: UserApartmentFormData
  ): Promise<UserApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<UserApartmentDetailResponse>({
        url: `/user-apartment-mapping/${id}`,
        method: "PUT",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch userApartments");
      }
      return response;
    } catch (error) {
      console.error("Error fetching userApartments:", error);
      throw error;
    }
  },

  // Cập nhật căn hộ
  async verifyUserApartment(id: string): Promise<UserApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<UserApartmentDetailResponse>({
        url: `/user-apartment-mapping/verify/${id}`,
        method: "POST",
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch userApartments");
      }
      return response;
    } catch (error) {
      console.error("Error fetching userApartments:", error);
      throw error;
    }
  },

  // Cập nhật căn hộ
  async rejectUserApartment(
    id: string,
    data: {
      rejectReason: string;
    }
  ): Promise<UserApartmentDetailResponse> {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<UserApartmentDetailResponse>({
        url: `/user-apartment-mapping/reject/${id}`,
        method: "POST",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch userApartments");
      }
      return response;
    } catch (error) {
      console.error("Error fetching userApartments:", error);
      throw error;
    }
  },
};

// Query keys
export const userApartmentKeys = {
  all: ["userApartments"] as const,
  lists: () => [...userApartmentKeys.all, "list"] as const,
  list: (filters: UserApartmentFilter) =>
    [...userApartmentKeys.lists(), { filters }] as const,
  details: () => [...userApartmentKeys.all, "detail"] as const,
  detail: (id: string) => [...userApartmentKeys.details(), id] as const,
};

// Custom hooks

// Hook lấy danh sách căn hộ với phân trang và lọc
export function useUserApartments(
  filters: UserApartmentFilter,
  enabled = true
) {
  return useQuery({
    queryKey: userApartmentKeys.list(filters),
    queryFn: () => UserApartmentService.getUserApartments(filters),
    enabled: enabled,
  });
}

// Hook lấy chi tiết căn hộ
export function useUserApartment(id: string) {
  return useQuery({
    queryKey: userApartmentKeys.detail(id),
    queryFn: () => UserApartmentService.getUserApartment(id),
    enabled: !!id, // Chỉ gọi API khi có ID
  });
}

// Hook thêm căn hộ mới
export function useAddUserApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserApartmentFormData) =>
      UserApartmentService.addUserApartment(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách căn hộ
      queryClient.invalidateQueries({ queryKey: userApartmentKeys.lists() });
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi thêm căn hộ");
    },
  });
}

// Hook cập nhật căn hộ
export function useUpdateUserApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserApartmentFormData }) =>
      UserApartmentService.updateUserApartment(id, data),
    onSuccess: (data) => {
      // Cập nhật cache cho chi tiết căn hộ
      queryClient.setQueryData(
        userApartmentKeys.detail(data.data.userApartmentMappingId),
        data
      );

      // Invalidate và refetch danh sách căn hộ
      queryClient.invalidateQueries({ queryKey: userApartmentKeys.lists() });
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi cập nhật căn hộ");
    },
  });
}
