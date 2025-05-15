"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserApartmentFilters } from "@/components/user-apartment/user-apartment-filters";
import { UserApartmentTable } from "@/components/user-apartment/user-apartment-table";
import { UserApartmentDrawer } from "@/components/user-apartment/user-apartment-drawer";
import { useUserApartmentStore } from "@/lib/store/use-user-apartment-store";
import PageHeader from "@/components/common/page-header";

export default function UserApartmentsPage() {
  const { openDrawer } = useUserApartmentStore();

  return (
    <div>
      <PageHeader
        title={"Quản lý căn hộ"}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="green"
            className="my-[10px] rounded-sm flex items-center gap-2"
            onClick={() => openDrawer("add")}
          >
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </PageHeader>

      {/* Bộ lọc */}
      <UserApartmentFilters />

      {/* Bảng dữ liệu */}
      <UserApartmentTable />

      {/* Drawer */}
      <UserApartmentDrawer />
    </div>
  );
}
