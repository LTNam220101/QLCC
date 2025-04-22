export interface Building {
  buildingId: string;
  buildingName: string;
  investorName: string;
  managementCompanyName: string;
  status: number;
  createTime: number;
  createBy: number;
  updateTime?: number;
  updateBy?: number;
}

export interface BuildingDetailResponse {
  data: Building[];
}
