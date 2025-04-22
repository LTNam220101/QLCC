import { MovingTicketForm } from "@/components/moving-ticket/moving-ticket-form";
import PageHeader from "@/components/common/page-header";
import { use } from "react";

interface EditMovingTicketPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMovingTicketPage({
  params,
}: EditMovingTicketPageProps) {
  const { id } = use(params);

  return (
    <div>
      <PageHeader title="Sửa đăng ký chuyển đồ" backUrl={`/services/moving-tickets/${id}`} />
      <MovingTicketForm movingTicketId={id} isEdit />
    </div>
  );
}
