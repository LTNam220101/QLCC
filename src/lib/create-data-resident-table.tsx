import { Column } from "@/components/common/table-data";
import { buildings, getDisplayName, roles } from "./store/use-resident-store";
import { Button } from "@/components/ui/button";
import { Edit, Lock, Trash2 } from "lucide-react";
import StatusBadge from "@/components/common/status-badge";
import Link from "next/link";

export const generateData = ({
  handleDeleteClick,
}: {
  handleDeleteClick?: (id: string) => void;
  router: any;
}): Column<any>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => index + 1,
  },
  {
    dataIndex: "name",
    name: "Họ và tên",
  },
  {
    dataIndex: "phone",
    name: "Số điện thoại",
  },
  {
    dataIndex: "building",
    name: "Toà nhà",
    render: (resident) => {
      return getDisplayName(resident.building, buildings);
    },
  },
  {
    dataIndex: "apartment",
    name: "Căn hộ",
  },
  {
    dataIndex: "role",
    name: "Vai trò",
    render: (resident) => {
      return getDisplayName(resident.role, roles);
    },
  },
  {
    dataIndex: "moveInDate",
    name: "Ngày chuyển đến",
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (resident) => <StatusBadge status={resident.status} />,
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (resident) => (
      <div className="flex gap-2">
        <Link href={`/building-information/residents/${resident.id}`}>
          <Button variant="outline" size="icon">
            <Lock className="h-4 w-4" color="#194FFF" />
            <span className="sr-only">Chi tiết</span>
          </Button>
        </Link>
        <Link href={`/building-information/residents/${resident.id}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" color="#194FFF" />
            <span className="sr-only">Sửa</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick?.(resident.id)}
        >
          <Trash2 className="h-4 w-4" color="#FE0000" />
          <span className="sr-only">Xóa</span>
        </Button>
      </div>
    ),
  },
];
