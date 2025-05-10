import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportDetailResponse, ReportFilter, ReportFormData, ReportPaginatedResponse } from "../../../../types/reports";

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
        ...(filter.statusList !== undefined && { statusList: filter.statusList }),
        ...(filter.reportContent !== undefined && {
          reportContent: filter.reportContent,
        }),
        ...(filter.manageBuildingList && { manageBuildingList: filter.manageBuildingList }),
        ...(filter.manageApartmentList && { manageApartmentList: filter.manageApartmentList }),
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
      if ("status" in response && response.status !== "success") {
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
      if ("status" in response && response.status !== "success") {
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
      if ("status" in response && response.status !== "success") {
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
      const _id = data?.reportId;
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<ReportDetailResponse>({
        url: `/resident-report/${id || _id}`,
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
      if ("status" in response && response.status !== "success") {
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
export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (filters: ReportFilter) => [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id?: string) => [...reportKeys.details(), id] as const,
};

// Hooks
export const useReports = (filter: ReportFilter) => {
  return useQuery({
    queryKey: reportKeys.list(filter),
    queryFn: () => ReportService.getReports(filter),
  });
};

export const useReport = (id?: string) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => ReportService.getReportById(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReportFormData) => ReportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const useUpdateReport = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportFormData) => ReportService.updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};
