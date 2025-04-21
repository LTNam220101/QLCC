import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import { Edit, Lock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buildings } from "@/lib/store/use-resident-store";

export const generateData = ({
  handleDeleteClick,
}: {
  handleDeleteClick?: (id: number) => void;
}): Column<any>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => index + 1,
  },
  {
    dataIndex: "name",
    name: "Tên tài liệu căn hộ",
  },
  {
    dataIndex: "apartment",
    name: "Tòa nhà",
    render: (document) => {
      return (
        buildings.find((b) => b.id === document.building)?.name ||
        document.building
      );
    },
  },
  {
    dataIndex: "noFile",
    name: "Số lượng file",
    render: (document) => {
      return document.files.length;
    },
  },
  {
    dataIndex: "createBy",
    name: "Người tạo",
  },
  {
    dataIndex: "createAt",
    name: "Ngày tạo",
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (document) => {
      return renderStatusBadge(document.status);
    },
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (document) => (
      <div className="flex gap-2">
        <Link href={`/building-information/documents/${document.id}`}>
          <Button variant="outline" size="icon">
            <Lock className="h-4 w-4" color="#194FFF" />
            <span className="sr-only">Chi tiết</span>
          </Button>
        </Link>
        <Link href={`/building-information/documents/${document.id}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" color="#194FFF" />
            <span className="sr-only">Sửa</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick?.(document.id)}
        >
          <Trash2 className="h-4 w-4" color="#FE0000" />
          <span className="sr-only">Xóa</span>
        </Button>
      </div>
    ),
  },
];

const renderStatusBadge = (status: string) => {
  let bgColor = "bg-gray-100 text-gray-800";

  if (status === "active") {
    bgColor = "bg-green-100 text-green-800";
  } else if (status === "expired") {
    bgColor = "bg-red-100 text-red-800";
  }

  const statusName =
    status === "active"
      ? "Đang hiệu lực"
      : status === "inactive"
      ? "Chưa hiệu lực"
      : "Hết hiệu lực";

  return <Badge className={bgColor}>{statusName}</Badge>;
};
