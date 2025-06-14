import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  LockKeyhole,
  LockKeyholeOpen,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/common/status-badge";
import { Resident } from "../../types/residents";
import { Checkbox } from "@/components/ui/checkbox";
export const generateData = ({
  startIndex,
  handleUpdateClick,
  handleDeleteClick,
  handleSelect,
  handleSelectAll,
  selectedResidents
}: {
  startIndex: number;
  handleUpdateClick?: (resident: Resident, status: number) => void;
  handleDeleteClick?: (resident: Resident) => void;
  handleSelect?: (resident: Resident, checked: boolean) => void
  handleSelectAll?: (checked: boolean) => void
  selectedResidents?: string[]
}): Column<Resident>[] => [
    {
      dataIndex: "checkbox",
      name: <Checkbox
        checked={selectedResidents && selectedResidents?.length > 0}
        onCheckedChange={(checked: boolean) => {
          handleSelectAll?.(checked)
        }}
      />,
      render: (resident) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedResidents?.includes(resident.id)}
            onCheckedChange={(checked: boolean) => {
              handleSelect?.(resident, checked)
            }}
          />
        </div>
      )
    },
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
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {resident.status === 0 ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateClick?.(resident, 4)}
            >
              <LockKeyholeOpen className="!h-4 !w-4" color="green" />
            </Button>
          ) : null}
          {resident.status === 2 ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateClick?.(resident, 3)}
            >
              <CheckCheck className="!h-4 !w-4" color="green" />
            </Button>
          ) : null}
          {[0, 1, 2]?.includes(resident.status) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeleteClick?.(resident)}
            >
              <Trash2 className="!h-4 !w-4" color="#FE0000" />
            </Button>
          ) : null}

          {resident.status === 4 ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateClick?.(resident, 0)}
            >
              <LockKeyhole className="!h-4 !w-4" color="green" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];
