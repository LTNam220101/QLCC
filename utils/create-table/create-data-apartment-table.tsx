import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";
import { Apartment } from "../../types/apartments";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const generateData = ({
  startIndex,
}: {
  startIndex: number;
}): Column<Apartment>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1,
  },
  {
    dataIndex: "apartmentName",
    name: "Căn hộ",
  },
  {
    dataIndex: "buildingName",
    name: "Tòa nhà",
  },
  {
    dataIndex: "area",
    name: "Diện tích",
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
    dataIndex: "note",
    name: "Ghi chú",
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (apartment) => (
      <div className="flex gap-2">
        <Link href={`/building-information/apartments/${apartment.id}`}>
          <Button variant="outline" size="icon">
            <ScanSearch className="h-4 w-4" color="#194FFF" />
            <span className="sr-only">Chi tiết</span>
          </Button>
        </Link>
        {/* <Button
          variant="outline"
          size="icon"
          onClick={() => handleEditClick?.(apartment.id)}
        >
          <Edit className="h-4 w-4" color="#194FFF" />
          <span className="sr-only">Sửa</span>
        </Button> */}
        {/* <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick?.(apartment)}
        >
          <Trash2 className="h-4 w-4" color="#FE0000" />
          <span className="sr-only">Xóa</span>
        </Button> */}
      </div>
    ),
  },
];
