export interface Apartment {
  id: string;
  apartmentName: string;
  buildingName: string;
  buildingId: string;
  note: string;
  area: number;
  createBy: string;
  createTime: number;
  updateBy: string;
  updateTime: number;
}

export interface ApartmentFilter {
  buildingName?: string;
  buildingId?: string;
  apartmentName?: string;
  createTimeFrom?: number;
  createTimeTo?: number;
  page: number;
  size: number;
}

export interface ApartmentFormData {
  apartmentName: string;
  buildingName: string;
  buildingId: string;
  area: number;
  note?: string;
}

export interface ApartmentPaginatedResponse {
  data: { data: Apartment[]; recordsTotal: number };
}

export interface ApartmentDetailResponse {
  data: Apartment;
}
