import type { Metadata } from "next";
import { MovingTicketForm } from "@/components/moving-ticket/moving-ticket-form";
import PageHeader from "@/components/common/page-header";

export const metadata: Metadata = {
  title: "Thêm mới MovingTicket",
  description: "Thêm mới moving-ticket cho tòa nhà",
};

export default function AddMovingTicketPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={"Thêm mới đăng ký chuyển đồ"}
        backUrl={`/services/moving-tickets`}
      />
      <MovingTicketForm />
    </div>
  );
}
