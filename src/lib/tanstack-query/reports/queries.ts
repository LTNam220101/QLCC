import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ReportDetailResponse,
  ReportFilter,
  ReportFormData,
  ReportPaginatedResponse,
} from "../../../../types/resident-reports";
import { apiRequest } from "../../../../utils/api";

const ReportService = {
  getReports: async (
    filter: ReportFilter
  ): Promise<ReportPaginatedResponse> => {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filter.page,
        size: filter.size,
        ...(filter.status !== undefined && { status: filter.status }),
        ...(filter.reportContent !== undefined && {
          reportContent: filter.reportContent,
        }),
        ...(filter.buildingId && { buildingId: filter.buildingId }),
        ...(filter.apartmentId && { apartmentId: filter.apartmentId }),
        ...(filter.createTimeFrom && {
          createTimeFrom: filter.createTimeFrom,
        }),
        ...(filter.createTimeTo && {
          createTimeTo: filter.createTimeTo,
        }),
      };

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ReportPaginatedResponse>({
        url: "/resident-report",
        method: "GET",
        queryParams,
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch reports");
      }

      return response;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  getReportById: async (id?: string): Promise<ReportDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ReportDetailResponse>({
        url: `/resident-report/${id}`,
        method: "GET",
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch reports");
      }
      return response;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  createReport: async (data: ReportFormData): Promise<ReportDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ReportDetailResponse>({
        url: "/resident-report",
        method: "POST",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch reports");
      }
      return response;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  updateReport: async (
    id?: string,
    data?: ReportFormData
  ): Promise<ReportDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ReportDetailResponse>({
        url: `/resident-report/${id}`,
        method: "PUT",
        useCredentials: true,
        body: {
          buildingId: data?.buildingId,
          apartmentId: data?.apartmentId,
          reportContent: data?.reportContent,
          note: data?.note,
          status: data?.status,
        },
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch reports");
      }
      return response;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  deleteReport: async (id: string): Promise<boolean> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/resident-report/${id}`,
        method: "DELETE",
        useCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },
};

// Query keys
export const hotlineKeys = {
  all: ["reports"] as const,
  lists: () => [...hotlineKeys.all, "list"] as const,
  list: (filters: ReportFilter) => [...hotlineKeys.lists(), filters] as const,
  details: () => [...hotlineKeys.all, "detail"] as const,
  detail: (id?: string) => [...hotlineKeys.details(), id] as const,
};

// Hooks
export const useReports = (filter: ReportFilter) => {
  return useQuery({
    queryKey: hotlineKeys.list(filter),
    queryFn: () => ReportService.getReports(filter),
  });
};

export const useReport = (id?: string) => {
  return useQuery({
    queryKey: hotlineKeys.detail(id),
    queryFn: () => ReportService.getReportById(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReportFormData) => ReportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};

export const useUpdateReport = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportFormData) => ReportService.updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};
