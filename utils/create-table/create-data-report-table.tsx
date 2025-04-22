import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import { Edit, LockKeyhole, LockKeyholeOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Report } from "../../types/reports";

export const generateData = ({
  handleDeleteClick,
  handleChangeStatus,
}: {
  handleDeleteClick?: (hotline: Report) => void;
  handleChangeStatus?: (hotline: Report) => void;
}): Column<Report>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => index + 1,
  },
  {
    dataIndex: "name",
    name: "Mã phản ánh",
  },
  {
    dataIndex: "hotline",
    name: "Nội dung",
  },
  {
    dataIndex: "buildingName",
    name: "Căn hộ",
  },
  {
    dataIndex: "buildingName",
    name: "Toà nhà",
  },
  {
    dataIndex: "buildingName",
    name: "Ghi chú",
  },
  {
    dataIndex: "buildingName",
    name: "Ngày tạo",
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (hotline) => (
      <Badge
        variant={hotline.status === 1 ? "green_outline" : "destructive_outline"}
      >
        {hotline.status === 1 ? "Đang hoạt động" : "Đã khóa"}
      </Badge>
    ),
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (hotline) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            handleChangeStatus?.(hotline);
          }}
        >
          {hotline.status === 1 ? (
            <LockKeyhole className="h-4 w-4" color="#194FFF" />
          ) : (
            <LockKeyholeOpen className="h-4 w-4" color="#194FFF" />
          )}
        </Button>
        <Link href={`/services/reports/${hotline.hotlineId}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" color="#194FFF" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick?.(hotline)}
        >
          <Trash2 className="h-4 w-4" color="#FE0000" />
        </Button>
      </div>
    ),
  },
];
