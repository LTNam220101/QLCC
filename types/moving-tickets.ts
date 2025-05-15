export const MovingStatus: {
  [key: number]: { name: string; color: string }
} = {
  '-3': { name: "Đã hết hạn", color: "gray" },
  '-2': { name: "Từ chối", color: "red" },
  '-1': { name: "Đã xoá", color: "red" },
  0: { name: "Chờ xác nhận", color: "gray" },
  1: { name: "Chưa đến hạn", color: "orange" },
  2: { name: "Đang chuyển đồ", color: "blue" },
  3: { name: "Hoàn thành", color: "green" },
  4: { name: "Đã đánh giá", color: "purple" }
}

export interface MovingTicket {
  ticketId: string
  ticketCode: string
  ticketType: number
  residentId: string
  buildingId: string
  buildingName: string
  apartmentId: string
  apartmentName: string
  //   movingDay: string;
  movingDayTime: number
  expectedTime: string
  evaluate?: number
  evaluateContent?: string
  transferType: number
  note?: string
  status: number
  createTime: number
  createBy: string
  updateTime?: number
  updateBy?: string
}

export interface MovingTicketFilter {
  statusList?: number[];
  transferType?: number
  ticketCode?: string
  movingDayTimeFrom?: number
  movingDayTimeTo?: number
  manageBuildingList?: string[]
  manageApartmentList?: string[]
  page: number
  size: number
}

export interface MovingTicketFormData {
  movingDayTime: number
  expectedTime: string
  apartmentId: string
  buildingId: string
  transferType: number
  note?: string
  status?: number
  ticketId?: string
}

export interface MovingTicketPaginatedResponse {
  data: { data: MovingTicket[]; recordsTotal: number }
  status: string
  message: string
}

export interface MovingTicketDetailResponse {
  data: MovingTicket
  status: string
  message: string
}
