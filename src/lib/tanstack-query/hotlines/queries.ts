import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HotlineDetailResponse,
  HotlineFilter,
  HotlineFormData,
  HotlinePaginatedResponse,
} from "../../../../types/hotlines";
import { apiRequest } from "../../../../utils/api";

const HotlineService = {
  getHotlines: async (
    filter: HotlineFilter
  ): Promise<HotlinePaginatedResponse> => {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filter.page,
        size: filter.size,
        ...(filter.statusList !== undefined && { statusList: filter.statusList }),
        ...(filter.name && { name: filter.name }),
        ...(filter.hotline && { hotline: filter.hotline }),
        ...(filter.buildingId && { buildingId: filter.buildingId }),
        ...(filter.createTimeFrom && { createTimeFrom: filter.createTimeFrom }),
        ...(filter.createTimeTo && { createTimeTo: filter.createTimeTo }),
      };

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<HotlinePaginatedResponse>({
        url: "/hotline",
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

  getHotlineById: async (id?: string): Promise<HotlineDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<HotlineDetailResponse>({
        url: `/hotline/${id}`,
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

  createHotline: async (
    data: HotlineFormData
  ): Promise<HotlineDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<HotlineDetailResponse>({
        url: "/hotline",
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

  updateHotline: async (
    id?: string,
    data?: HotlineFormData & { hotlineId?: string }
  ): Promise<HotlineDetailResponse> => {
    try {
      const _id = data?.hotlineId;
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<HotlineDetailResponse>({
        url: `/hotline/${id || _id}`,
        method: "PUT",
        useCredentials: true,
        body: {
          name: data?.name,
          hotline: data?.hotline,
          buildingId: data?.buildingId,
          note: data?.note,
          status: data?.status,
        },
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

  deleteHotline: async (id: string): Promise<boolean> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/hotline/${id}`,
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
export const hotlineKeys = {
  all: ["hotlines"] as const,
  lists: () => [...hotlineKeys.all, "list"] as const,
  list: (filters: HotlineFilter) => [...hotlineKeys.lists(), filters] as const,
  details: () => [...hotlineKeys.all, "detail"] as const,
  detail: (id?: string) => [...hotlineKeys.details(), id] as const,
};

// Hooks
export const useHotlines = (filter: HotlineFilter) => {
  return useQuery({
    queryKey: hotlineKeys.list(filter),
    queryFn: () => HotlineService.getHotlines(filter),
  });
};

export const useHotline = (id?: string) => {
  return useQuery({
    queryKey: hotlineKeys.detail(id),
    queryFn: () => HotlineService.getHotlineById(id),
    enabled: !!id,
  });
};

export const useCreateHotline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HotlineFormData) => HotlineService.createHotline(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};

export const useUpdateHotline = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HotlineFormData) =>
      HotlineService.updateHotline(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};

export const useDeleteHotline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => HotlineService.deleteHotline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};
