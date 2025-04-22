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
  status?: number;
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
}

export interface ReportPaginatedResponse {
  data: { data: Report[]; recordsTotal: number };
  total: number;
}

export interface ReportDetailResponse {
  data: Report;
}
