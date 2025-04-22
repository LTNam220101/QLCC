export interface Resident {
  id: string;
  fullName: string;
  phoneNumber: string;
  manageBuildingList: string[];
  // manageApartmentList: string[];
  role: string;
  // moveInDate: string;
  status: number;
  email: string;
  identifyId: string;
  identifyIssueDate: number;
  identifyIssuer: string;
  gender: number;
  dateOfBirth: number;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export interface ResidentFilter {
  status?: number;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  manageBuildingList?: string[];
  manageApartmentList?: string[];
  page: number;
  size: number;
}

export interface ResidentFormData {
  fullName: string;
  phoneNumber: string;
  manageBuildingList: string[];
  // manageApartmentList: string[];
  role: string;
  // moveInDate?: string;
  email?: string;
  identifyId: string;
  identifyIssueDate: number;
  identifyIssuer: string;
  gender?: number;
  dateOfBirth: number;
}

export interface ResidentPaginatedResponse {
  data: { data: Resident[]; recordsTotal: number };
}

export interface ResidentDetailResponse {
  data: Resident;
}
