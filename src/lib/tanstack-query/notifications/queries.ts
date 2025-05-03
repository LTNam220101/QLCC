import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  NotificationDetailResponse,
  NotificationFilter,
  NotificationFormData,
  NotificationPaginatedResponse
} from "../../../../types/notifications"
import { apiRequest } from "../../../../utils/api"

const NotificationService = {
  getNotifications: async (
    filter: NotificationFilter
  ): Promise<NotificationPaginatedResponse> => {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filter.page,
        size: filter.size,
        ...(filter.title !== undefined && { title: filter.title }),
        ...(filter.content && { content: filter.content }),
        ...(filter.manageBuildingList && {
          manageBuildingList: filter.manageBuildingList
        }),
        ...(filter.manageApartmentList && {
          manageApartmentList: filter.manageApartmentList
        }),
        ...(filter.sentTimeFrom && { sentTimeFrom: filter.sentTimeFrom }),
        ...(filter.sentTimeTo && { sentTimeTo: filter.sentTimeTo }),
        ...(filter.createTimeFrom && { createTimeFrom: filter.createTimeFrom }),
        ...(filter.createTimeTo && { createTimeTo: filter.createTimeTo })
      }

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NotificationPaginatedResponse>({
        url: "/notification-management",
        method: "GET",
        queryParams,
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch notifications")
      }

      return response
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  },

  getNotificationById: async (
    id?: string
  ): Promise<NotificationDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NotificationDetailResponse>({
        url: `/notification-management/${id}`,
        method: "GET",
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch notifications")
      }
      return response
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  },

  createNotification: async (
    data: NotificationFormData
  ): Promise<NotificationDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NotificationDetailResponse>({
        url: "/notification-management",
        method: "POST",
        useCredentials: true,
        body: data
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch notifications")
      }
      return response
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  },

  updateNotification: async (
    id?: string,
    data?: NotificationFormData & { notificationId?: string }
  ): Promise<NotificationDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NotificationDetailResponse>({
        url: `/notification-management/${id}`,
        method: "PUT",
        useCredentials: true,
        body: {
          title: data?.title,
          content: data?.content,
          buildingId: data?.buildingId,
          apartmentId: data?.apartmentId,
          sentTime: data?.sentTime,
        }
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch notifications")
      }
      return response
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/notification-management/${id}`,
        method: "DELETE",
        useCredentials: true
      })
      return response
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  }
}

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: NotificationFilter) =>
    [...notificationKeys.lists(), filters] as const,
  details: () => [...notificationKeys.all, "detail"] as const,
  detail: (id?: string) => [...notificationKeys.details(), id] as const
}

// Hooks
export const useNotifications = (filter: NotificationFilter) => {
  return useQuery({
    queryKey: notificationKeys.list(filter),
    queryFn: () => NotificationService.getNotifications(filter),
    gcTime: 0,
  })
}

export const useNotification = (id?: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => NotificationService.getNotificationById(id),
    enabled: !!id,
    gcTime: 0,
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NotificationFormData) =>
      NotificationService.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    }
  })
}

export const useUpdateNotification = (id?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NotificationFormData) =>
      NotificationService.updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    }
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => NotificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    }
  })
}
