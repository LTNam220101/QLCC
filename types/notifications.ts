export interface Notification {
  notificationManagementId: string
  title: string
  content: string
  buildingName: string
  apartmentName: string
  buildingId: string
  apartmentId: string
  status: number
  sentTime: number
  sentBy: string
  createTime: number
  createBy: string
  updateTime?: number
  updateBy?: string
}

export interface NotificationFilter {
  title?: string
  content?: string
  manageBuildingList?: string[]
  manageApartmentList?: string[]
  sentTimeFrom?: number
  sentTimeTo?: number
  createTimeFrom?: number
  createTimeTo?: number
  page: number
  size: number
}

export interface NotificationFormData {
  title: string
  content: string
  buildingId: string
  apartmentId?: string
  sentTime: number
}

export interface NotificationPaginatedResponse {
  data: { data: Notification[]; recordsTotal: number }
  status: string
  message: string
}

export interface NotificationDetailResponse {
  data: Notification
  status: string
  message: string
}
