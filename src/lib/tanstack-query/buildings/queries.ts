import {
  Building,
  BuildingDetailResponse,
} from "./../../../../types/buildings";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../../utils/api";

// Mock API service - Thay thế bằng API thực tế sau này
const BuildingService = {
  getBuildings: async (): Promise<Building[]> => {
    try {
      // Gọi API sử dụng sendRequest
      const response = await apiRequest<BuildingDetailResponse>({
        url: "/building",
        method: "GET",
        useCredentials: true,
      });
      // Kiểm tra lỗi từ API (nếu có)
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to fetch hotlines");
      }

      return response?.data;
    } catch (error) {
      console.error("Error fetching hotlines:", error);
      throw error;
    }
  },
};

// Query keys
export const buildingKeys = {
  all: ["buildings"] as const,
  lists: () => [...buildingKeys.all, "list"] as const,
  list: () => [...buildingKeys.lists()] as const,
};

// Hooks
export const useBuildings = () => {
  return useQuery({
    queryKey: buildingKeys.list(),
    queryFn: () => BuildingService.getBuildings(),
  });
};
