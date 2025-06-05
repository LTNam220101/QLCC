"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MovingTicketDetail } from "@/components/moving-ticket/moving-ticket-detail"
import Edit from "@/icons/edit.svg"
import PageHeader from "@/components/common/page-header"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { useMovingTicket } from "@/lib/tanstack-query/moving-tickets/queries"
import { MovingStatus } from "../../../../../../types/moving-tickets"

interface MovingTicketDetailPageProps {
  params: Promise<{ id: string }>
}

export default function MovingTicketDetailPage({
  params
}: MovingTicketDetailPageProps) {
  const { id } = use(params)
  const { data: movingTicket } = useMovingTicket(id)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Chi tiết đăng ký chuyển đồ
            {movingTicket?.data && (
              <Badge
                variant={
                  `${
                    MovingStatus?.[movingTicket?.data?.status]?.color
                  }_outline` as any
                }
                className="ml-2"
              >
                {MovingStatus?.[movingTicket?.data?.status]?.name}
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
            <Edit className="mr-2 size-5" />
            Chỉnh sửa
          </Link>
        </Button>
      </PageHeader>
      <MovingTicketDetail movingTicketId={id} />
    </div>
  )
}
