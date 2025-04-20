import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

// Giả lập API service
const DocumentService = {
  // Lấy danh sách tài liệu
  async getDocuments(filters = {}) {
    // Trong thực tế, đây sẽ là API call
    console.log("Fetching documents with filters:", filters)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Trả về dữ liệu mẫu
    return mockDocuments
  },

  // Lấy chi tiết tài liệu
  async getDocument(id: number) {
    console.log("Fetching document with id:", id)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const document = mockDocuments.find((d) => d.id === id)
    if (!document) {
      throw new Error("Document not found")
    }

    return document
  },

  // Thêm tài liệu mới
  async addDocument(data: any) {
    console.log("Adding new document:", data)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Giả lập tạo ID mới
    const newId = Math.max(...mockDocuments.map((d) => d.id)) + 1

    const newDocument = {
      id: newId,
      ...data,
      status: "active",
      createdBy: "Admin",
      createdAt: new Date().toISOString().split("T")[0],
      updatedBy: "Admin",
      updatedAt: new Date().toISOString().split("T")[0],
    }

    // Thêm vào danh sách mẫu
    mockDocuments.push(newDocument)

    return newDocument
  },

  // Cập nhật tài liệu
  async updateDocument(id: number, data: any) {
    console.log("Updating document:", id, data)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockDocuments.findIndex((d) => d.id === id)
    if (index === -1) {
      throw new Error("Document not found")
    }

    // Cập nhật thông tin
    const updatedDocument = {
      ...mockDocuments[index],
      ...data,
      updatedBy: "Admin",
      updatedAt: new Date().toISOString().split("T")[0],
    }

    mockDocuments[index] = updatedDocument

    return updatedDocument
  },

  // Xóa tài liệu
  async deleteDocument(id: number) {
    console.log("Deleting document:", id)

    // Giả lập delay API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const index = mockDocuments.findIndex((d) => d.id === id)
    if (index === -1) {
      throw new Error("Document not found")
    }

    // Xóa khỏi danh sách
    const deletedDocument = mockDocuments.splice(index, 1)[0]

    return deletedDocument
  },
}

// Dữ liệu mẫu
const mockDocuments = [
  {
    id: 1,
    name: "Hướng dẫn sử dụng đăng nhập - đăng xuất",
    building: "A",
    status: "active",
    effectiveDate: "2023-01-15",
    note: "Tài liệu hướng dẫn cơ bản cho cư dân",
    files: [
      {
        id: 1,
        name: "huong-dan-dang-nhap.pdf",
        size: 1024000,
        type: "application/pdf",
        url: "/documents/huong-dan-dang-nhap.pdf",
      },
      {
        id: 2,
        name: "huong-dan-dang-xuat.pdf",
        size: 512000,
        type: "application/pdf",
        url: "/documents/huong-dan-dang-xuat.pdf",
      },
    ],
    createdBy: "Admin",
    createdAt: "2023-01-10",
    updatedBy: "Admin",
    updatedAt: "2023-01-10",
  },
  {
    id: 2,
    name: "Nội quy chung cư",
    building: "A",
    status: "active",
    effectiveDate: "2023-02-20",
    note: "Nội quy áp dụng cho tất cả cư dân",
    files: [
      {
        id: 3,
        name: "noi-quy-chung-cu.pdf",
        size: 2048000,
        type: "application/pdf",
        url: "/documents/noi-quy-chung-cu.pdf",
      },
    ],
    createdBy: "Admin",
    createdAt: "2023-01-15",
    updatedBy: "Admin",
    updatedAt: "2023-02-20",
  },
  {
    id: 3,
    name: "Hướng dẫn sử dụng tiện ích",
    building: "B",
    status: "active",
    effectiveDate: "2023-03-10",
    note: "Hướng dẫn sử dụng các tiện ích trong tòa nhà",
    files: [
      {
        id: 4,
        name: "huong-dan-su-dung-tien-ich.pdf",
        size: 3072000,
        type: "application/pdf",
        url: "/documents/huong-dan-su-dung-tien-ich.pdf",
      },
      {
        id: 5,
        name: "huong-dan-su-dung-tien-ich.docx",
        size: 1536000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        url: "/documents/huong-dan-su-dung-tien-ich.docx",
      },
    ],
    createdBy: "Admin",
    createdAt: "2023-02-05",
    updatedBy: "Admin",
    updatedAt: "2023-03-15",
  },
  {
    id: 4,
    name: "Quy định phòng cháy chữa cháy",
    building: "C",
    status: "expired",
    effectiveDate: "2022-03-10",
    note: "Quy định đã hết hiệu lực",
    files: [
      {
        id: 6,
        name: "quy-dinh-pccc.pdf",
        size: 4096000,
        type: "application/pdf",
        url: "/documents/quy-dinh-pccc.pdf",
      },
    ],
    createdBy: "Admin",
    createdAt: "2022-03-10",
    updatedBy: "Admin",
    updatedAt: "2022-03-10",
  },
  {
    id: 5,
    name: "Hướng dẫn thanh toán phí",
    building: "D",
    status: "active",
    effectiveDate: "2023-04-05",
    note: "Hướng dẫn các phương thức thanh toán phí quản lý",
    files: [
      {
        id: 7,
        name: "huong-dan-thanh-toan-phi.pdf",
        size: 1024000,
        type: "application/pdf",
        url: "/documents/huong-dan-thanh-toan-phi.pdf",
      },
      {
        id: 8,
        name: "bieu-phi.xlsx",
        size: 512000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "/documents/bieu-phi.xlsx",
      },
    ],
    createdBy: "Admin",
    createdAt: "2023-04-05",
    updatedBy: "Admin",
    updatedAt: "2023-04-05",
  },
]

// Query keys
export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (filters: any) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: number) => [...documentKeys.details(), id] as const,
}

// Custom hooks

// Hook lấy danh sách tài liệu
export function useDocuments(filters = {}) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: () => DocumentService.getDocuments(filters),
  })
}

// Hook lấy chi tiết tài liệu
export function useDocument(id: number) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => DocumentService.getDocument(id),
    enabled: !!id, // Chỉ gọi API khi có ID
  })
}

// Hook thêm tài liệu mới
export function useAddDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => DocumentService.addDocument(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách tài liệu
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })

      toast("Tài liệu đã được thêm vào hệ thống")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi thêm tài liệu")
    },
  })
}

// Hook cập nhật tài liệu
export function useUpdateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => DocumentService.updateDocument(id, data),
    onSuccess: (data) => {
      // Cập nhật cache cho chi tiết tài liệu
      queryClient.setQueryData(documentKeys.detail(data.id), data)

      // Invalidate và refetch danh sách tài liệu
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })

      toast("Thông tin tài liệu đã được cập nhật")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi cập nhật tài liệu")
    },
  })
}

// Hook xóa tài liệu
export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => DocumentService.deleteDocument(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách tài liệu
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() })

      toast("Đã xóa tài liệu khỏi hệ thống")
    },
    onError: (error: any) => {
      toast(error.message || "Có lỗi xảy ra khi xóa tài liệu")
    },
  })
}
