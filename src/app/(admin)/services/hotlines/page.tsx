import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HotlineFilters } from "@/components/hotline/hotline-filters";
import { HotlineTable } from "@/components/hotline/hotline-table";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Quản lý Hotline",
  description: "Quản lý danh sách hotline của tòa nhà",
};

export default function HotlinesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Quản lý Hotline">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/services/hotlines/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-5" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>

      <HotlineFilters />

      <HotlineTable />
    </div>
  );
}
