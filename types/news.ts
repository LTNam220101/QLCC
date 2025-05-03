export interface News {
  newsId: string
  title: string
  content: string
  buildingName: string
  buildingId: string
  status: number
  sentTime: number
  sentBy: string
  createTime: number
  createBy: string
  updateTime?: number
  updateBy?: string
}

export interface NewsFilter {
  title?: string
  manageBuildingList?: string[]
  sentTimeFrom?: number
  sentTimeTo?: number
  createTimeFrom?: number
  createTimeTo?: number
  page: number
  size: number
}

export interface NewsFormData {
  title: string
  content: string
  buildingId: string
  sentTime: number
}

export interface NewsPaginatedResponse {
  data: { data: News[]; recordsTotal: number }
  status: string
  message: string
}

export interface NewsDetailResponse {
  data: News
  status: string
  message: string
}
