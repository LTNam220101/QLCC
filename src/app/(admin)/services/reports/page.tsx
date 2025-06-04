import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReportFilters } from "@/components/report/report-filters";
import { ReportTable } from "@/components/report/report-table";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Quản lý Report",
  description: "Quản lý danh sách report của tòa nhà",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Quản lý phản ánh">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/services/reports/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-5" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>

      <ReportFilters />

      <ReportTable />
    </div>
  );
}
