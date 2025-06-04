"use client";

import { Button } from "@/components/ui/button";
import { useMovingTicket } from "@/lib/tanstack-query/moving-tickets/queries";
import InfoRow from "../common/info-row";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Rating, RatingValue } from "../ui/rating";

interface MovingTicketDetailProps {
  movingTicketId: string;
}

export function MovingTicketDetail({
  movingTicketId,
}: MovingTicketDetailProps) {
  const { data, isLoading, isError, isRefetching } = useMovingTicket(movingTicketId);

  if (isLoading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-[22px] bg-white rounded-lg px-8 flex-1 mb-[30px]">
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Căn hộ" value={data?.data?.apartmentId} />
            <InfoRow
              label="Mã đăng ký"
              value={data?.data?.ticketCode?.split("-")?.at(-1)}
            />
            <InfoRow
              label="Ghi chú"
              className="col-span-2"
              value={data?.data?.note}
            />
          </div>
          <div>
            <InfoRow
              label="Ngày chuyển đồ"
              value={
                data?.data?.movingDayTime &&
                format(new Date(data?.data?.movingDayTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
              highlight
            />
            <InfoRow label="Hình thức" value={data?.data?.transferType} />
            <InfoRow
              label="Nội dung xác nhận"
              value={data?.data?.evaluateContent}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-[30px]">
        <h2 className="font-bold">Thông tin khác</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Người tạo" value={data?.data?.createBy} />
            <InfoRow label="Người cập nhật" value={data?.data?.updateBy} />
          </div>
          <div>
            <InfoRow
              label="Ngày tạo"
              value={
                data?.data?.createTime &&
                format(new Date(data?.data?.createTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              value={
                data?.data?.updateTime &&
                format(new Date(data?.data?.updateTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-5">
          <h2 className="font-bold">Đánh giá</h2>
          <Rating
            value={(data?.data?.evaluate || 0) as RatingValue}
            readonly
            size="sm"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div className="col-span-2">
            <InfoRow
              label="Nội dung đánh giá"
              value={data?.data?.evaluateContent}
            />
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
