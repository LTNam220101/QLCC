export const ResidentStatus: {
  [key: number]: { name: string; color: string }
} = {
  0: { name: "Huỷ kích hoạt", color: "red" },
  1: { name: "Soạn thảo", color: "gray" },
  2: { name: "Tạo mới", color: "gray" },
  3: { name: "Chờ xác minh", color: "orange" },
  4: { name: "Đang hoạt động", color: "green" }
}

export interface Resident {
  id: string
  fullName: string
  phoneNumber: string
  manageBuildingList: string[]
  // manageApartmentList: string[];
  role: string
  // moveInDate: string;
  status: number
  email: string
  identifyId: string
  identifyIssueDate: number
  identifyIssuer: string
  gender: number
  dateOfBirth: number
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

export interface ResidentFilter {
  statusList?: number[]
  fullName?: string
  phoneNumber?: string
  identifyId?: string
  createTimeFrom?: number
  createTimeTo?: number
  page: number
  size: number
}

export interface ResidentFormData {
  fullName: string
  phoneNumber: string
  // manageBuildingList: string[];
  // manageApartmentList: string[];
  // role: string;
  // moveInDate?: string;
  email?: string
  identifyId: string
  identifyIssueDate: number
  identifyIssuer: string
  gender?: number
  dateOfBirth: number
  status?: number
}

export interface ResidentPaginatedResponse {
  data: { data: Resident[]; recordsTotal: number }
  status: string
  message: string
}

export interface ResidentDetailResponse {
  data: Resident
  status: string
  message: string
}
