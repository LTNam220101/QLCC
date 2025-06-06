import { Column } from "@/components/common/table-data"
import { UserApartment } from "../../types/user-apartments"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { UserApartmentStatus } from "../../types/user-apartments"

export const generateData = ({
  startIndex,
}: {
  startIndex: number
}): Column<UserApartment>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1
  },
  {
    dataIndex: "buildingName",
    name: "Tòa nhà"
  },
  {
    dataIndex: "apartmentName",
    name: "Căn hộ"
  },
  {
    dataIndex: "userApartmentRoleName",
    name: "Vai trò"
  },
  {
    dataIndex: "createTime",
    name: "Ngày liên kết",
    render: (apartment) => {
      return apartment.createTime
        ? format(new Date(apartment.createTime), "dd/MM/yyyy", { locale: vi })
        : "-"
    }
  },
  {
    dataIndex: "createBy",
    name: "Người liên kết",
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (userApartment) => {
      const color = `${
        UserApartmentStatus?.[userApartment?.status]?.color
      }_outline`
      const statusName = UserApartmentStatus?.[userApartment?.status]?.name
      return <Badge variant={color as any}>{statusName}</Badge>
    }
  },
]
