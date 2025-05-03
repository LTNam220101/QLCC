export interface Hotline {
  hotlineId: string
  name: string
  hotline: string
  buildingId: string
  note?: string
  status: number
  createTime: number
  createBy: string
  updateTime?: number
  updateBy?: string
}

export interface HotlineFilter {
  // status?: number;
  statusList?: number[]
  name?: string
  hotline?: string
  manageBuildingList?: string[]
  createTimeFrom?: number
  createTimeTo?: number
  page: number
  size: number
}

export interface HotlineFormData {
  name: string
  hotline: string
  buildingId: string
  note?: string
  status?: number
}

export interface HotlinePaginatedResponse {
  data: { data: Hotline[]; recordsTotal: number }
  status: string
  message: string
}

export interface HotlineDetailResponse {
  data: Hotline
  status: string
  message: string
}
