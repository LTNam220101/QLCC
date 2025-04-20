export type HotlineStatus = "active" | "inactive"

export interface Hotline {
  id: number
  name: string
  phoneNumber: string
  buildingId: number
  buildingName: string
  note?: string
  status: HotlineStatus
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface HotlineFilter {
  status?: HotlineStatus
  name?: string
  phoneNumber?: string
  buildingId?: number
  fromDate?: string
  toDate?: string
  page: number
  limit: number
}

export interface HotlineFormData {
  name: string
  phoneNumber: string
  buildingId: number
  note?: string
  status?: HotlineStatus
}

export interface HotlinePaginatedResponse {
  data: Hotline[]
  total: number
  page: number
  limit: number
  totalPages: number
}
