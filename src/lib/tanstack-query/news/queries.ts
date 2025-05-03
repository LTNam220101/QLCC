import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  NewsDetailResponse,
  NewsFilter,
  NewsFormData,
  NewsPaginatedResponse
} from "../../../../types/news"
import { apiRequest } from "../../../../utils/api"

const NewsService = {
  getNewss: async (
    filter: NewsFilter
  ): Promise<NewsPaginatedResponse> => {
    try {
      // Chuyển đổi filter thành query params
      const queryParams = {
        page: filter.page,
        size: filter.size,
        ...(filter.title !== undefined && { title: filter.title }),
        ...(filter.manageBuildingList && {
          manageBuildingList: filter.manageBuildingList
        }),
        ...(filter.sentTimeFrom && { sentTimeFrom: filter.sentTimeFrom }),
        ...(filter.sentTimeTo && { sentTimeTo: filter.sentTimeTo }),
        ...(filter.createTimeFrom && { createTimeFrom: filter.createTimeFrom }),
        ...(filter.createTimeTo && { createTimeTo: filter.createTimeTo })
      }

      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NewsPaginatedResponse>({
        url: "/news",
        method: "GET",
        queryParams,
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch news")
      }

      return response
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  },

  getNewsById: async (
    id?: string
  ): Promise<NewsDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NewsDetailResponse>({
        url: `/news/${id}`,
        method: "GET",
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch news")
      }
      return response
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  },

  createNews: async (
    data: NewsFormData
  ): Promise<NewsDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NewsDetailResponse>({
        url: "/news",
        method: "POST",
        useCredentials: true,
        body: data
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch news")
      }
      return response
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  },

  updateNews: async (
    id?: string,
    data?: NewsFormData & { newsId?: string }
  ): Promise<NewsDetailResponse> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<NewsDetailResponse>({
        url: `/news/${id}`,
        method: "PUT",
        useCredentials: true,
        body: {
          title: data?.title,
          content: data?.content,
          buildingId: data?.buildingId,
          sentTime: data?.sentTime,
        }
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch news")
      }
      return response
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  },

  deleteNews: async (id: string): Promise<boolean> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<boolean>({
        url: `/news/${id}`,
        method: "DELETE",
        useCredentials: true
      })
      return response
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  }
}

// Query keys
export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (filters: NewsFilter) =>
    [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, "detail"] as const,
  detail: (id?: string) => [...newsKeys.details(), id] as const
}

// Hooks
export const useNewss = (filter: NewsFilter) => {
  return useQuery({
    queryKey: newsKeys.list(filter),
    queryFn: () => NewsService.getNewss(filter),
    gcTime: 0,
  })
}

export const useNews = (id?: string) => {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => NewsService.getNewsById(id),
    enabled: !!id,
    gcTime: 0,
  })
}

export const useCreateNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NewsFormData) =>
      NewsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
    }
  })
}

export const useUpdateNews = (id?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NewsFormData) =>
      NewsService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
    }
  })
}

export const useDeleteNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => NewsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
    }
  })
}
