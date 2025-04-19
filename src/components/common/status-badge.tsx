import { getStatusColor } from "@/lib/store/use-resident-store";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const StatusBadge = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const color = getStatusColor(status);
  const statusName =
    status === "active"
      ? "Đang hoạt động"
      : status === "pending"
      ? "Chờ xác minh"
      : status === "inactive"
      ? "Huỷ kích hoạt"
      : status === "draft"
      ? "Soạn thảo"
      : status === "new"
      ? "Tạo mới"
      : status;

  let bgColor = "bg-gray-100 text-gray-800";

  if (color === "green") {
    bgColor = "bg-green-100 text-green-800";
  } else if (color === "orange") {
    bgColor = "bg-orange-100 text-orange-800";
  } else if (color === "red") {
    bgColor = "bg-red-100 text-red-800";
  } else if (color === "blue") {
    bgColor = "bg-blue-100 text-blue-800";
  }

  return <Badge className={cn(bgColor, className)}>{statusName}</Badge>;
};

export default StatusBadge;
