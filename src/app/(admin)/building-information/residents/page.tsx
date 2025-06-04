"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResidentFilters } from "@/components/resident/resident-filters";
import { ResidentTable } from "@/components/resident/resident-table";
import PageHeader from "@/components/common/page-header";
import { Plus } from "lucide-react";

export default function ResidentsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Quản lý cư dân">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/building-information/residents/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-5" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>
      {/* Bộ lọc */}
      <ResidentFilters />
      {/* Bảng dữ liệu */}
      <ResidentTable />
    </div>
  );
}
