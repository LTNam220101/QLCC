import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MovingTicketDetailResponse,
  MovingTicketFilter,
  MovingTicketFormData,
  MovingTicketPaginatedResponse,
} from "../../../../types/moving-tickets";
import { apiRequest } from "../../../../utils/api";

const MovingTicketService = {
  getMovingTickets: async (
    filter: MovingTicketFilter
  ): Promise<MovingTicketPaginatedResponse> => {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filter.page,
        size: filter.size,
        ...(filter.statusList !== undefined && { statusList: filter.statusList }),
        ...(filter.transferType !== undefined && { transferType: filter.transferType }),
        ...(filter.ticketCode && { ticketCode: filter.ticketCode }),
        ...(filter.movingDayTimeFrom && {
          movingDayTimeFrom: filter.movingDayTimeFrom,
        }),
        ...(filter.movingDayTimeTo && {
          movingDayTimeTo: filter.movingDayTimeTo,
        }),
        ...(filter.apartmentId && { apartmentId: filter.apartmentId }),
        ...(filter.buildingId && { buildingId: filter.buildingId }),
      };

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<MovingTicketPaginatedResponse>({
        url: "/ticket-moving",
        method: "GET",
        queryParams,
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch moving-tickets");
      }

      return response;
    } catch (error) {
      console.error("Error fetching moving-tickets:", error);
      throw error;
    }
  },

  getMovingTicketById: async (
    id?: string
  ): Promise<MovingTicketDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<MovingTicketDetailResponse>({
        url: `/ticket-moving/${id}`,
        method: "GET",
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch moving-tickets");
      }
      return response;
    } catch (error) {
      console.error("Error fetching moving-tickets:", error);
      throw error;
    }
  },

  createMovingTicket: async (
    data: MovingTicketFormData
  ): Promise<MovingTicketDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<MovingTicketDetailResponse>({
        url: "/ticket-moving",
        method: "POST",
        useCredentials: true,
        body: data,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch moving-tickets");
      }
      return response;
    } catch (error) {
      console.error("Error fetching moving-tickets:", error);
      throw error;
    }
  },

  updateMovingTicket: async (
    id?: string,
    data?: MovingTicketFormData
  ): Promise<MovingTicketDetailResponse> => {
    try {
      const _id = data?.ticketId
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<MovingTicketDetailResponse>({
        url: `/ticket-moving/${id || _id}`,
        method: "PUT",
        useCredentials: true,
        body: {
          movingDayTime: data?.movingDayTime,
          expectedTime: data?.expectedTime,
          buildingId: data?.buildingId,
          apartmentId: data?.apartmentId,
          transferType: data?.transferType,
          note: data?.note,
          status: data?.status,
        },
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch moving-tickets");
      }
      return response;
    } catch (error) {
      console.error("Error fetching moving-tickets:", error);
      throw error;
    }
  },

  deleteMovingTicket: async (id: string): Promise<boolean> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/ticket-moving/${id}`,
        method: "DELETE",
        useCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching moving-tickets:", error);
      throw error;
    }
  },
};

// Query keys
export const hotlineKeys = {
  all: ["moving-tickets"] as const,
  lists: () => [...hotlineKeys.all, "list"] as const,
  list: (filters: MovingTicketFilter) =>
    [...hotlineKeys.lists(), filters] as const,
  details: () => [...hotlineKeys.all, "detail"] as const,
  detail: (id?: string) => [...hotlineKeys.details(), id] as const,
};

// Hooks
export const useMovingTickets = (filter: MovingTicketFilter) => {
  return useQuery({
    queryKey: hotlineKeys.list(filter),
    queryFn: () => MovingTicketService.getMovingTickets(filter),
  });
};

export const useMovingTicket = (id?: string) => {
  return useQuery({
    queryKey: hotlineKeys.detail(id),
    queryFn: () => MovingTicketService.getMovingTicketById(id),
    enabled: !!id,
  });
};

export const useCreateMovingTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MovingTicketFormData) =>
      MovingTicketService.createMovingTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};

export const useUpdateMovingTicket = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MovingTicketFormData) =>
      MovingTicketService.updateMovingTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};

export const useDeleteMovingTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MovingTicketService.deleteMovingTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotlineKeys.lists() });
    },
  });
};
