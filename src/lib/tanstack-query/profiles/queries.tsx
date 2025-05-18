import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { ProfileDetailResponse, ProfileFilter, ProfileFormData, ProfilePaginatedResponse } from "../../../../types/profiles";

import { apiRequest } from "../../../../utils/api"

const ProfileService = {
  getProfile: async () => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest({
        url: "/user/detail",
        method: "GET",
        useCredentials: true
      })
      // Kiểm tra lỗi từ API (nếu có)
      if ("status" in response && response.status !== "success") {
        throw new Error(response.message || "Failed to fetch profiles")
      }

      return response
    } catch (error) {
      console.error("Error fetching profiles:", error)
      throw error
    }
  },

  deleteProfile: async () => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest({
        url: `/user/delete`,
        method: "POST",
        useCredentials: true
      })
      return response
    } catch (error) {
      console.error("Error fetching profiles:", error)
      throw error
    }
  }
}

// Query keys
export const profileKeys = {
  detail: () => ["profile"] as const
}

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => ProfileService.getProfile()
  })
}

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => ProfileService.deleteProfile(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() })
    }
  })
}
