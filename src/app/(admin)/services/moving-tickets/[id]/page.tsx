"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MovingTicketDetail } from "@/components/moving-ticket/moving-ticket-detail";
import { Edit } from "lucide-react";
import PageHeader from "@/components/common/page-header";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { useMovingTicket } from "@/lib/tanstack-query/moving-tickets/queries";

interface MovingTicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MovingTicketDetailPage({
  params,
}: MovingTicketDetailPageProps) {
  const { id } = use(params);
  const { data: movingTicket } = useMovingTicket(id);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Chi tiết đăng ký chuyển đồ
            {movingTicket?.data && (
              <Badge
                variant={
                  movingTicket?.data?.status === 1
                    ? "green_outline"
                    : "destructive_outline"
                }
                className="ml-3"
              >
                {movingTicket?.data?.status === 1
                  ? "Đang hoạt động"
                  : "Đã khóa"}
              </Badge>
            )}
          </>
        }
        backUrl="/services/moving-tickets"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/services/moving-tickets/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>
      <MovingTicketDetail movingTicketId={id} />
    </div>
  );
}
