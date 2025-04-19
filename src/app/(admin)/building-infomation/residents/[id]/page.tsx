"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header";
import InfoRow from "@/components/common/info-row";
import { getDisplayName } from "@/lib/store/use-resident-store";
import StatusBadge from "@/components/common/status-badge";

// Dữ liệu mẫu cho các tòa nhà
const buildings = [
  { id: "A", name: "Tòa nhà A" },
  { id: "B", name: "Tòa nhà B" },
  { id: "C", name: "Tòa nhà C" },
  { id: "D", name: "Tòa nhà D" },
];

// Dữ liệu mẫu cho các vai trò
const roles = [
  { id: "owner", name: "Chủ hộ" },
  { id: "tenant", name: "Người thuê" },
  { id: "family", name: "Thành viên gia đình" },
  { id: "guest", name: "Khách" },
];
// Dữ liệu mẫu cho cư dân
const initialResidents = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    building: "A",
    apartment: "A-101",
    role: "owner",
    moveInDate: "2023-01-15",
    status: "active",
    email: "nguyenvana@example.com",
    idNumber: "012345678901",
    idIssueDate: "2020-01-01",
    idIssuePlace: "Hà Nội",
    gender: "Nam",
    birthDate: "1985-05-15",
    createdBy: "Admin",
    createdAt: "2023-01-10",
    updatedBy: "Admin",
    updatedAt: "2023-01-10",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    building: "A",
    apartment: "A-102",
    role: "tenant",
    moveInDate: "2023-02-20",
    status: "pending",
    email: "tranthib@example.com",
    idNumber: "012345678902",
    idIssueDate: "2019-05-10",
    idIssuePlace: "Hồ Chí Minh",
    gender: "Nữ",
    birthDate: "1990-10-20",
    createdBy: "Admin",
    createdAt: "2023-02-15",
    updatedBy: "Admin",
    updatedAt: "2023-02-15",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    building: "B",
    apartment: "B-101",
    role: "family",
    moveInDate: "2023-03-10",
    status: "inactive",
    email: "levanc@example.com",
    idNumber: "012345678903",
    idIssueDate: "2018-12-05",
    idIssuePlace: "Đà Nẵng",
    gender: "Nam",
    birthDate: "1978-03-25",
    createdBy: "Admin",
    createdAt: "2023-03-05",
    updatedBy: "Admin",
    updatedAt: "2023-03-05",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    building: "C",
    apartment: "C-101",
    role: "guest",
    moveInDate: "2023-04-05",
    status: "new",
    email: "phamthid@example.com",
    idNumber: "012345678904",
    idIssueDate: "2021-02-15",
    idIssuePlace: "Hải Phòng",
    gender: "Nữ",
    birthDate: "1995-12-10",
    createdBy: "Admin",
    createdAt: "2023-04-01",
    updatedBy: "Admin",
    updatedAt: "2023-04-01",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    building: "D",
    apartment: "D-101",
    role: "owner",
    moveInDate: "2023-05-15",
    status: "draft",
    email: "hoangvane@example.com",
    idNumber: "012345678905",
    idIssueDate: "2017-08-20",
    idIssuePlace: "Cần Thơ",
    gender: "Nam",
    birthDate: "1982-07-30",
    createdBy: "Admin",
    createdAt: "2023-05-10",
    updatedBy: "Admin",
    updatedAt: "2023-05-10",
  },
];

export default function ResidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [resident, setResident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call để lấy thông tin cư dân
    const fetchResident = async () => {
      setLoading(true);
      try {
        // Trong thực tế, đây sẽ là một API call
        const foundResident = initialResidents.find(
          (r) => r.id === Number.parseInt(id)
        );

        if (foundResident) {
          setResident(foundResident);
        } else {
          // Nếu không tìm thấy, chuyển hướng về trang danh sách
          router.push("/residents");
        }
      } catch (error) {
        console.error("Error fetching resident:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResident();
  }, [id, router]);

  if (loading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (!resident) {
    return <div className="container mx-auto p-4">Không tìm thấy cư dân</div>;
  }

  return (
    <div>
      <PageHeader
        title={
          <>
            Chi tiết cư dân
            <StatusBadge status={resident.status} className="ml-[14px]" />
          </>
        }
        backUrl="/building-information/residents"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/building-information/residents/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>

      {/* Thông tin chung */}
      <div className="space-y-4 mt-5 mb-[30px]">
        <h2 className="font-bold">Thông tin chung</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Số điện thoại" value={resident.phone} />
            <InfoRow label="Căn hộ" value={resident.apartment} highlight />
            <InfoRow label="Họ và tên" value={resident.name} />
            <InfoRow label="Số CMND/CCCD/Hộ chiếu" value={resident.idNumber} />
            <InfoRow
              label="Nơi cấp CMND/CCCD/Hộ chiếu"
              value={resident.idIssuePlace}
            />
            <InfoRow
              label="Vai trò"
              value={getDisplayName(resident.role, roles)}
            />
          </div>
          <div>
            <InfoRow label="Email" value={resident.email} />
            <InfoRow
              label="Tòa nhà"
              value={getDisplayName(resident.building, buildings)}
            />
            <InfoRow label="Ngày sinh" value={resident.birthDate} />
            <InfoRow
              label="Ngày cấp CMND/CCCD/Hộ chiếu"
              value={resident.idIssueDate}
            />
            <InfoRow label="Giới tính" value={resident.gender} />
            <InfoRow label="Ngày chuyển đến" value={resident.moveInDate} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold">Thông tin khác</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Người tạo" value={resident.createdBy} />
            <InfoRow label="Người cập nhật" value={resident.updatedBy} />
          </div>
          <div>
            <InfoRow label="Ngày tạo" value={resident.createdAt} />
            <InfoRow label="Ngày cập nhật" value={resident.updatedAt} />
          </div>
        </div>
      </div>
    </div>
  );
}
