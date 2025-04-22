export interface Hotline {
  hotlineId: string;
  name: string;
  hotline: string;
  buildingId: string;
  note?: string;
  status: number;
  createTime: number;
  createBy: string;
  updateTime?: number;
  updateBy?: string;
}

export interface HotlineFilter {
  status?: number;
  name?: string;
  hotline?: string;
  buildingId?: number;
  createTimeFrom?: number;
  createTimeTo?: number;
  page: number;
  size: number;
}

export interface HotlineFormData {
  name: string;
  hotline: string;
  buildingId: string;
  note?: string;
  status?: number;
}

export interface HotlinePaginatedResponse {
  data: { data: Hotline[]; recordsTotal: number };
  total: number;
  // page: number;
  // limit: number;
  // totalPages: number;
}

export interface HotlineDetailResponse {
  data: Hotline;
}
