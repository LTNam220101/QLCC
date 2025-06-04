"use client";

import { Button } from "@/components/ui/button";
import { useHotline } from "@/lib/tanstack-query/hotlines/queries";
import InfoRow from "../common/info-row";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface HotlineDetailProps {
  hotlineId: string;
}

export function HotlineDetail({ hotlineId }: HotlineDetailProps) {
  const { data, isLoading, isError, isRefetching } = useHotline(hotlineId);

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
            <InfoRow label="Số hotline" value={data?.data?.hotline} />
            <InfoRow
              className="col-span-2"
              label="Ghi chú"
              value={data?.data?.note}
            />
          </div>
          <div>
            <InfoRow label="Tên hiển thị" value={data?.data?.name} highlight />
            <InfoRow label="Tòa nhà" value={data?.data?.buildingId} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
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
    </>
  );
}
