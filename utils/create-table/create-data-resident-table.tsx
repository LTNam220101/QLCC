import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  LockKeyhole,
  LockKeyholeOpen,
  ScanSearch,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/common/status-badge";
import Link from "next/link";
import { Resident } from "../../types/residents";

export const generateData = ({
  startIndex,
  handleUpdateClick,
  handleDeleteClick,
}: {
  startIndex: number;
  handleUpdateClick?: (resident: Resident, status: number) => void;
  handleDeleteClick?: (resident: Resident) => void;
}): Column<Resident>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1,
  },
  {
    dataIndex: "phoneNumber",
    name: "Số điện thoại",
  },
  {
    dataIndex: "fullName",
    name: "Họ và tên",
  },
  {
    dataIndex: "identifyId",
    name: "Số CMND/CCCD/Hộ chiếu",
  },
  {
    dataIndex: "phoneNumber",
    name: "Số điện thoại",
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
            <ScanSearch className="h-4 w-4" color="#194FFF" />
          </Button>
        </Link>
        {/* <Link href={`/building-information/residents/${resident.id}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" color="#194FFF" />
          </Button>
        </Link> */}
        {resident.status === 0 ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateClick?.(resident, 4)}
          >
            <LockKeyholeOpen className="h-6 w-6" color="blue" />
          </Button>
        ) : null}
        {resident.status === 2 ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateClick?.(resident, 3)}
          >
            <CheckCheck className="h-6 w-6" color="blue" />
          </Button>
        ) : null}
        {[0, 1, 2]?.includes(resident.status) ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDeleteClick?.(resident)}
          >
            <Trash2 className="h-4 w-4" color="#FE0000" />
          </Button>
        ) : null}

        {resident.status === 4 ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateClick?.(resident, 0)}
          >
            <LockKeyhole className="h-6 w-6" color="blue" />
          </Button>
        ) : null}
      </div>
    ),
  },
];
