import { Column } from "@/components/common/table-data";
import { UserApartment, UserApartmentRole } from "../../types/user-apartments";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { UserApartmentStatus } from "../../types/user-apartments";

export const generateData = ({
  startIndex,
  handleChangeStatus,
}: {
  startIndex: number;
  handleChangeStatus?: (userApartment: UserApartment, status: number) => void;
}): Column<UserApartment>[] => [
    {
      dataIndex: "index",
      name: "STT",
      render: (_, index) => startIndex + index + 1,
    },
    {
      dataIndex: "userPhone",
      name: "Số điện thoại",
    },
    {
      dataIndex: "fullName",
      name: "Họ và tên",
    },
    {
      dataIndex: "buildingName",
      name: "Tòa nhà",
    },
    {
      dataIndex: "apartmentName",
      name: "Căn hộ",
    },
    {
      dataIndex: "userApartmentRoleName",
      name: "Vai trò",
    },
    {
      dataIndex: "createTime",
      name: "Ngày tạo",
      render: (apartment) => {
        return apartment.createTime
          ? format(new Date(apartment.createTime), "dd/MM/yyyy", { locale: vi })
          : "-";
      },
    },
    {
      dataIndex: "status",
      name: "Trạng thái",
      render: (userApartment) => {
        const color = `${UserApartmentStatus?.[userApartment?.status]?.color}_outline`
        const statusName = UserApartmentStatus?.[userApartment?.status]?.name
        return <Badge variant={color as any}>{statusName}</Badge>
      }
    },
    {
      dataIndex: "status",
      name: "Thao tác",
      render: (userApartment) => (userApartment?.status === 2 ?
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <EllipsisVertical className="h-4 w-4" color="#194FFF" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem onClick={() => handleDeleteClick?.(userApartment)}> */}
              {/* Xoá */}
              {/* </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => handleChangeStatus?.(userApartment, 0)}
              >
                Huỷ liên kết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeStatus?.(userApartment, 1)}
              >
                Phê duyệt
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeStatus?.(userApartment, -1)}
              >
                Từ chối
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> : (
          null
        )
      )
    }
  ];
