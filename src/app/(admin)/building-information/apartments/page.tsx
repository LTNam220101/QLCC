"use client";

import { Plus } from "lucide-react";
import FileSpreadsheet from "@/icons/document-text.svg"
import { Button } from "@/components/ui/button";
import { ApartmentFilters } from "@/components/apartment/apartment-filters";
import { ApartmentTable } from "@/components/apartment/apartment-table";
import { ApartmentDrawer } from "@/components/apartment/apartment-drawer";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import PageHeader from "@/components/common/page-header";

export default function ApartmentsPage() {
  const { openDrawer } = useApartmentStore();

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={"Quản lý căn hộ"}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="my-[10px] border-green text-green hover:text-green flex items-center gap-2"
            onClick={() =>  ("import")}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Thêm mới từ Excel
          </Button>
          <Button
            variant="green"
            className="my-[10px] flex items-center gap-2"
            onClick={() => openDrawer("add")}
          >
            <Plus className="!h-4 !w-4" />
            Thêm mới
          </Button>
        </div>
      </PageHeader>

      {/* Bộ lọc */}
      <ApartmentFilters />

      {/* Bảng dữ liệu */}
      <ApartmentTable />

      {/* Drawer */}
      <ApartmentDrawer />
    </div>
  );
}
