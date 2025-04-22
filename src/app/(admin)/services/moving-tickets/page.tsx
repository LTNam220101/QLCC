import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MovingTicketFilters } from "@/components/moving-ticket/moving-ticket-filters";
import { MovingTicketTable } from "@/components/moving-ticket/moving-ticket-table";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Quản lý MovingTicket",
  description: "Quản lý danh sách moving-ticket của tòa nhà",
};

export default function MovingTicketsPage() {
  return (
    <div>
      <PageHeader title="Quản lý đăng ký chuyển đồ">
        <Button size={"lg"} variant={"green"} className="my-[10px]">
          <Link
            href="/services/moving-tickets/add"
            className="flex items-center"
          >
            <Plus className="mr-2 size-6" />
            Thêm mới
          </Link>
        </Button>
      </PageHeader>

      <MovingTicketFilters />

      <MovingTicketTable />
    </div>
  );
}
