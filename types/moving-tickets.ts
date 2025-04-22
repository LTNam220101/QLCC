export interface MovingTicket {
  ticketId: string;
  ticketCode: string;
  ticketType: number;
  residentId: string;
  buildingId: string;
  buildingName: string;
  apartmentId: string;
  apartmentName: string;
  //   movingDay: string;
  movingDayTime: number;
  expectedTime: string;
  evaluate?: number;
  evaluateContent?: string;
  transferType: number;
  note?: string;
  status: number;
  createTime: number;
  createBy: string;
  updateTime?: number;
  updateBy?: string;
}

export interface MovingTicketFilter {
  status?: number;
  transferType?: number;
  ticketCode?: string;
  movingDayTimeFrom?: number;
  movingDayTimeTo?: number;
  apartmentId?: string;
  buildingId?: string;
  page: number;
  size: number;
}

export interface MovingTicketFormData {
  movingDayTime: number;
  expectedTime: string;
  apartmentId: string;
  buildingId: string;
  transferType: number;
  note?: string;
  status?: number;
}

export interface MovingTicketPaginatedResponse {
  data: { data: MovingTicket[]; recordsTotal: number };
  total: number;
  // page: number;
  // limit: number;
  // totalPages: number;
}

export interface MovingTicketDetailResponse {
  data: MovingTicket;
}
