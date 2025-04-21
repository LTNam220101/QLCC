import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Định nghĩa các kiểu dữ liệu
export type DocumentStatus = "active" | "inactive" | "expired";

export interface DocumentFile {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadProgress?: number;
}

export interface ApartmentDocument {
  id: number;
  name: string;
  building: string;
  status: DocumentStatus;
  effectiveDate: string;
  note?: string;
  files: DocumentFile[];
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export interface DocumentFilters {
  name: string;
  building: string;
  status: string;
  effectiveDateRange: string;
  createdDateRange: string;
}

export type DrawerType = "add" | "edit" | "view" | "upload" | "preview" | null;

interface DocumentState {
  // Dữ liệu
  documents: ApartmentDocument[];
  filteredDocuments: ApartmentDocument[];
  selectedDocument: ApartmentDocument | null;
  selectedFile: DocumentFile | null;

  // Bộ lọc
  filters: DocumentFilters;

  // Phân trang
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;

  // Trạng thái drawer
  drawerOpen: boolean;
  drawerType: DrawerType;

  // Dialog xóa
  deleteDialogOpen: boolean;
  documentToDelete: number | null;
  fileToDelete: { documentId: number; fileId: number } | null;

  // Hành động
  setDocuments: (documents: ApartmentDocument[]) => void;
  setFilteredDocuments: (documents: ApartmentDocument[]) => void;
  setFilter: (key: keyof DocumentFilters, value: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setDocumentToDelete: (id: number | null) => void;
  setFileToDelete: (
    data: { documentId: number; fileId: number } | null
  ) => void;
  deleteDocument: () => void;
  deleteFile: () => void;

  // Drawer actions
  openDrawer: (
    type: DrawerType,
    document?: ApartmentDocument | null,
    file?: DocumentFile | null
  ) => void;
  closeDrawer: () => void;
  addDocument: (
    document: Omit<
      ApartmentDocument,
      | "id"
      | "createBy"
      | "createTime"
      | "updateBy"
      | "updateTime"
      | "files"
      | "status"
    >,
    files: File[]
  ) => void;
  updateDocument: (
    id: number,
    data: Partial<ApartmentDocument>,
    newFiles?: File[],
    removedFileIds?: number[]
  ) => void;
  uploadFiles: (documentId: number, files: File[]) => void;
}

// Dữ liệu mẫu cho tài liệu căn hộ
const initialDocuments = [
  {
    id: 1,
    name: "Hướng dẫn sử dụng đăng nhập - đăng xuất",
    building: "A",
    status: "active" as DocumentStatus,
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
    createBy: "Admin",
    createTime: "2023-01-10",
    updateBy: "Admin",
    updateTime: "2023-01-10",
  },
  {
    id: 2,
    name: "Nội quy chung cư",
    building: "A",
    status: "active" as DocumentStatus,
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
    createBy: "Admin",
    createTime: "2023-01-15",
    updateBy: "Admin",
    updateTime: "2023-02-20",
  },
  {
    id: 3,
    name: "Hướng dẫn sử dụng tiện ích",
    building: "B",
    status: "active" as DocumentStatus,
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
    createBy: "Admin",
    createTime: "2023-02-05",
    updateBy: "Admin",
    updateTime: "2023-03-15",
  },
  {
    id: 4,
    name: "Quy định phòng cháy chữa cháy",
    building: "C",
    status: "expired" as DocumentStatus,
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
    createBy: "Admin",
    createTime: "2022-03-10",
    updateBy: "Admin",
    updateTime: "2022-03-10",
  },
  {
    id: 5,
    name: "Hướng dẫn thanh toán phí",
    building: "D",
    status: "active" as DocumentStatus,
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
    createBy: "Admin",
    createTime: "2023-04-05",
    updateBy: "Admin",
    updateTime: "2023-04-05",
  },
];

// Tạo store với Zustand
export const useDocumentStore = create<DocumentState>()(
  devtools((set, get) => ({
    // Trạng thái ban đầu
    documents: initialDocuments,
    filteredDocuments: initialDocuments,
    selectedDocument: null,
    selectedFile: null,
    filters: {
      name: "",
      building: "",
      status: "",
      effectiveDateRange: "",
      createdDateRange: "",
    },
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: initialDocuments.length,
    deleteDialogOpen: false,
    documentToDelete: null,
    fileToDelete: null,
    drawerOpen: false,
    drawerType: null,

    // Các hành động
    setDocuments: (documents) => set({ documents }),

    setFilteredDocuments: (filteredDocuments) =>
      set({ filteredDocuments, totalItems: filteredDocuments.length }),

    setFilter: (key, value) =>
      set((state) => ({
        filters: { ...state.filters, [key]: value },
      })),

    clearFilters: () =>
      set({
        filters: {
          name: "",
          building: "",
          status: "",
          effectiveDateRange: "",
          createdDateRange: "",
        },
      }),

    applyFilters: () => {
      const { documents, filters } = get();
      let result = [...documents];

      if (filters.name) {
        result = result.filter((document) =>
          document.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.building) {
        result = result.filter(
          (document) => document.building === filters.building
        );
      }

      if (filters.status) {
        result = result.filter(
          (document) => document.status === filters.status
        );
      }

      // Xử lý lọc theo khoảng thời gian hiệu lực nếu cần
      // Xử lý lọc theo khoảng thời gian tạo nếu cần

      set({
        filteredDocuments: result,
        totalItems: result.length,
        currentPage: 1,
      });
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    setItemsPerPage: (count) => set({ itemsPerPage: count }),

    setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),

    setDocumentToDelete: (id) => set({ documentToDelete: id }),

    setFileToDelete: (data) => set({ fileToDelete: data }),

    deleteDocument: () => {
      const { documentToDelete, documents } = get();

      if (documentToDelete) {
        const updatedDocuments = documents.filter(
          (document) => document.id !== documentToDelete
        );
        set({ documents: updatedDocuments });

        // Áp dụng lại bộ lọc sau khi xóa
        const { applyFilters } = get();
        applyFilters();

        set({
          deleteDialogOpen: false,
          documentToDelete: null,
        });
      }
    },

    deleteFile: () => {
      const { fileToDelete, documents } = get();

      if (fileToDelete) {
        const { documentId, fileId } = fileToDelete;
        const updatedDocuments = documents.map((document) => {
          if (document.id === documentId) {
            return {
              ...document,
              files: document.files.filter((file) => file.id !== fileId),
            };
          }
          return document;
        });

        set({ documents: updatedDocuments });

        // Áp dụng lại bộ lọc sau khi xóa
        const { applyFilters } = get();
        applyFilters();

        set({
          deleteDialogOpen: false,
          fileToDelete: null,
        });
      }
    },

    // Drawer actions
    openDrawer: (type, document = null, file = null) =>
      set({
        drawerOpen: true,
        drawerType: type,
        selectedDocument: document,
        selectedFile: file,
      }),

    closeDrawer: () =>
      set({
        drawerOpen: false,
        drawerType: null,
        selectedDocument: null,
        selectedFile: null,
      }),

    addDocument: (documentData, files) => {
      const { documents } = get();
      const newId =
        documents.length > 0 ? Math.max(...documents.map((a) => a.id)) + 1 : 1;

      const now = new Date().toISOString().split("T")[0];

      // Tạo các file mới
      const newFiles: DocumentFile[] = files.map((file, index) => ({
        id: newId * 100 + index,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));

      const newDocument: ApartmentDocument = {
        id: newId,
        ...documentData,
        status: "active",
        files: newFiles,
        createBy: "Admin",
        createTime: now,
        updateBy: "Admin",
        updateTime: now,
      };

      set({
        documents: [...documents, newDocument],
        drawerOpen: false,
        drawerType: null,
      });

      // Áp dụng lại bộ lọc sau khi thêm
      const { applyFilters } = get();
      applyFilters();
    },

    updateDocument: (id, data, newFiles = [], removedFileIds = []) => {
      const { documents } = get();
      const now = new Date().toISOString().split("T")[0];

      const updatedDocuments = documents.map((document) => {
        if (document.id === id) {
          // Lọc ra các file không bị xóa
          const remainingFiles = document.files.filter(
            (file) => !removedFileIds.includes(file.id)
          );

          // Tạo các file mới
          const addedFiles: DocumentFile[] = newFiles.map((file, index) => ({
            id: document.id * 1000 + remainingFiles.length + index,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          }));

          return {
            ...document,
            ...data,
            files: [...remainingFiles, ...addedFiles],
            updateBy: "Admin",
            updateTime: now,
          };
        }
        return document;
      });

      set({
        documents: updatedDocuments,
        drawerOpen: false,
        drawerType: null,
        selectedDocument: null,
      });

      // Áp dụng lại bộ lọc sau khi cập nhật
      const { applyFilters } = get();
      applyFilters();
    },

    uploadFiles: (documentId, files) => {
      const { documents } = get();
      const now = new Date().toISOString().split("T")[0];

      const updatedDocuments = documents.map((document) => {
        if (document.id === documentId) {
          // Tạo các file mới
          const newFiles: DocumentFile[] = files.map((file, index) => ({
            id: document.id * 1000 + document.files.length + index,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          }));

          return {
            ...document,
            files: [...document.files, ...newFiles],
            updateBy: "Admin",
            updateTime: now,
          };
        }
        return document;
      });

      set({
        documents: updatedDocuments,
        drawerOpen: false,
        drawerType: null,
      });

      // Áp dụng lại bộ lọc sau khi cập nhật
      const { applyFilters } = get();
      applyFilters();
    },
  }))
);

// Dữ liệu tham chiếu
export const buildings = [
  { id: "A", name: "Tòa nhà A" },
  { id: "B", name: "Tòa nhà B" },
  { id: "C", name: "Tòa nhà C" },
  { id: "D", name: "Tòa nhà D" },
];

export const documentStatuses = [
  { id: "active", name: "Đang hiệu lực", color: "green" },
  { id: "inactive", name: "Chưa hiệu lực", color: "gray" },
  { id: "expired", name: "Hết hiệu lực", color: "red" },
];

// Hàm tiện ích
export const getDisplayName = (id: string, options: any[]) => {
  const option = options.find((opt) => opt.id === id);
  return option ? option.name : id;
};

export const getStatusColor = (status: string) => {
  const statusObj = documentStatuses.find((s) => s.id === status);
  return statusObj ? statusObj.color : "gray";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};
