import { Badge } from "../ui/badge";
import { ResidentStatus } from "../../../types/residents";

const StatusBadge = ({
  status,
  className,
}: {
  status: number;
  className?: string;
}) => {
  const color = `${ResidentStatus?.[status]?.color}_outline`;
  const statusName = ResidentStatus?.[status]?.name;

  return (
    <Badge className={className} variant={color as any}>
      {statusName}
    </Badge>
  );
};

export default StatusBadge;
