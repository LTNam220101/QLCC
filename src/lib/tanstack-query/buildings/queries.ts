import { useQuery } from "@tanstack/react-query"

interface Building {
  id: number
  name: string
}

// Mock API service - Thay thế bằng API thực tế sau này
const BuildingService = {
  getBuildings: async (): Promise<Building[]> => {
    // Giả lập API call
    console.log("Fetching buildings")

    // Dữ liệu mẫu
    const mockData: Building[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Tòa nhà ${String.fromCharCode(65 + i)}`,
    }))

    // Giả lập độ trễ mạng
    await new Promise((resolve) => setTimeout(resolve, 300))

    return mockData
  },
}

// Query keys
export const buildingKeys = {
  all: ["buildings"] as const,
  lists: () => [...buildingKeys.all, "list"] as const,
  list: () => [...buildingKeys.lists()] as const,
}

// Hooks
export const useBuildings = () => {
  return useQuery({
    queryKey: buildingKeys.list(),
    queryFn: () => BuildingService.getBuildings(),
  })
}
