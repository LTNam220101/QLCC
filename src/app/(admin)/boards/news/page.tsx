import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsFilters } from "@/components/news/news-filters";
import { NewsTable } from "@/components/news/news-table";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Quản lý News",
  description: "Quản lý danh sách news của tòa nhà",
};

export default function NewssPage() {
  return (
    <div>
      <PageHeader title="Quản lý bảng tin">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/boards/news/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-6" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>

      <NewsFilters />

      <NewsTable />
    </div>
  );
}
