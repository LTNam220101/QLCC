export const ReportStatus: {
  [key: number]: { name: string; color: string };
} = {
  0: { name: "Từ chối", color: "red" },
  1: { name: "Chờ xử lý", color: "gray" },
  2: { name: "Đang xử lý", color: "blue" },
  3: { name: "Hoàn thành", color: "green" },
  4: { name: "Đã đánh giá", color: "purple" },
};

export interface Report {
  reportId: string;
  reportContent: string;
  resultContent: string;
  note?: string;
  buildingId: string;
  buildingName: string;
  apartmentId: string;
  apartmentName: string;
  ressidentId: string;
  ressidentName: string;
  status: number;
  createTime: number;
  createBy: string;
  updateTime?: number;
  updateBy?: string;
  evaluate?: number;
  evaluateContent?: string;
  //   residentName: string;
  //   residentId: string;
}

export interface ReportFilter {
  // status?: number;
  statusList?: number[];
  reportContent?: string;
  buildingId?: string;
  apartmentId?: string;
  createTimeFrom?: number;
  createTimeTo?: number;
  page: number;
  size: number;
}

export interface ReportFormData {
  buildingId: string;
  apartmentId: string;
  reportContent: string;
  note?: string;
  status?: number;
  reportId?: string;
}

export interface ReportPaginatedResponse {
  data: { data: Report[]; recordsTotal: number };
  total: number;
}

export interface ReportDetailResponse {
  data: Report;
}
