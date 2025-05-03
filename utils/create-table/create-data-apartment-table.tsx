import { Column } from "@/components/common/table-data";
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
];
