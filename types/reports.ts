export interface Report {
  reportId: string;
  reportContent: string;
  note?: string;
  buildingId: string;
  apartmentId: string;
  status: number;
  createTime: number;
  createBy: string;
  updateTime?: number;
  updateBy?: string;
//   residentName: string;
//   residentId: string;
}

export interface ReportFilter {
  status?: number;
  name?: string;
  hotline?: string;
  buildingId?: number;
  createTimeFrom?: number;
  createTimeTo?: number;
  page: number;
  size: number;
}

export interface ReportFormData {
  name: string;
  hotline: string;
  buildingId: string;
  note?: string;
  status?: number;
}

export interface ReportPaginatedResponse {
  data: { data: Report[]; recordsTotal: number };
  total: number;
  // page: number;
  // limit: number;
  // totalPages: number;
}

export interface ReportDetailResponse {
  data: Report;
}
