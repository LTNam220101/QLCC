export const UserApartmentStatus: {
  [key: number]: { name: string; color: string };
} = {
  "-1": { name: "Từ chối", color: "red" },
  0: { name: "Huỷ liên kết", color: "red" },
  1: { name: "Đã liên kết", color: "green" },
  2: { name: "Chờ liên kết", color: "gray" },
};
export const UserApartmentRole: {
  [key: number]: string;
} = {
  1: "Chủ hộ",
  2: "Khách thuê",
  3: "Thành viên",
};

export interface UserApartment {
  status: number;
  userApartmentMappingId: string;
  userId: string;
  userPhone: string;
  fullName: string;
  apartmentName: string;
  apartmentId: string;
  buildingName: string;
  buildingId: string;
  userApartmentRole: number;
  userApartmentRoleName: string;
  userApartmentRoleId: string;
  note: string;
  rejectReason: string;
  createBy: string;
  createTime: number;
  updateBy: string;
  updateTime: number;
}

export interface UserApartmentFilter {
  userPhone?: string;
  fullName?: string;
  manageBuildingList?: string[];
  manageApartmentList?: string[];
  statusList?: number[];
  userApartmentRoleName?: string;
  createTimeFrom?: number;
  createTimeTo?: number;
  page: number;
  size: number;
}

export interface UserApartmentFormData {
  userPhone: string;
  userApartmentRole: number;
  buildingId: string;
  apartmentName: string;
  buildingName: string;
  // area: number
  note?: string;
}

export interface UserApartmentPaginatedResponse {
  data: { data: UserApartment[]; recordsTotal: number };
  status: string;
  message: string;
}

export interface UserApartmentDetailResponse {
  data: UserApartment;
  status: string;
  message: string;
}
