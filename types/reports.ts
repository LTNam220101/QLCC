export const ReportStatus: {
  [key: number]: { name: string; color: string }
} = {
  0: { name: "Từ chối", color: "red" },
  1: { name: "Chờ xử lý", color: "gray" },
  2: { name: "Đang xử lý", color: "blue" },
  3: { name: "Hoàn thành", color: "green" },
  4: { name: "Đã đánh giá", color: "purple" }
}

export interface Report {
  reportId: string
  reportCode: string
  reportContent: string
  reportImages?: string[]
  resultContent: string
  note?: string
  buildingId: string
  buildingName: string
  apartmentId: string
  apartmentName: string
  residentId: string
  residentName: string
  status: number
  createTime: number
  createBy: string
  updateTime?: number
  updateBy?: string
  evaluate?: number
  evaluateContent?: string
  evaluateImages?: string[]
}

export interface ReportFilter {
  statusList?: number[]
  reportContent?: string
  manageBuildingList?: string[]
  manageApartmentList?: string[]
  createTimeFrom?: number
  createTimeTo?: number
  page: number
  size: number
}

export interface ReportFormData {
  buildingId: string
  apartmentId: string
  reportContent: string
  note?: string
  status?: number
  reportId?: string
}

export interface ReportPaginatedResponse {
  data: { data: Report[]; recordsTotal: number }
  status: string
  message: string
}

export interface ReportDetailResponse {
  data: Report
  status: string
  message: string
}

export interface FeedbackImage {
  id: string
  url: string
  name: string
}

export interface FeedbackFormData {
  buildingId: string
  apartmentId: string
  code: string
  content: string
  note: string
  images: (FeedbackImage | UploadedImage)[]
}

export interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
}