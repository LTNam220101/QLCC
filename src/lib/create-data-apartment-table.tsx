import { Column } from "@/components/common/table-data";
import { buildings, getDisplayName, roles } from "./store/use-resident-store";
import { Button } from "@/components/ui/button";
import { Edit, Lock, Trash2 } from "lucide-react";

export const generateData = ({
  handleDeleteClick,
  handleEditClick,
  router,
}: {
  handleDeleteClick?: (id: string) => void;
  handleEditClick?: (id: string) => void;
  router: any;
}): Column<any>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => index + 1,
  },
  {
    dataIndex: "apartmentNumber",
    name: "Căn hộ",
  },
  {
    dataIndex: "apartment",
    name: "Tòa nhà",
    render: (apartment) => {
      return getDisplayName(apartment.building, buildings);
    },
  },
  {
    dataIndex: "area",
    name: "Diện tích",
    render: (resident) => {
      return getDisplayName(resident.area, buildings);
    },
  },
  {
    dataIndex: "createAt",
    name: "Ngày tạo",
    render: (resident) => {
      return getDisplayName(resident.createAt, buildings);
    },
  },
  {
    dataIndex: "note",
    name: "Ghi chú",
    render: (resident) => {
      return getDisplayName(resident.role, roles);
    },
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (resident) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(`/building-information/apartments/${resident.id}`)
          }
        >
          <Lock className="h-4 w-4" color="#194FFF" />
          <span className="sr-only">Chi tiết</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleEditClick?.(resident.id)}
        >
          <Edit className="h-4 w-4" color="#194FFF" />
          <span className="sr-only">Sửa</span>
        </Button>
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
